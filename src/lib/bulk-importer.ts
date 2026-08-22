import { products, Product, Grade } from "@/data/catalog";
import { saveGradedDraft } from "@/lib/grade-store";

export interface ParsedCsvRow {
  rowIndex: number;
  productName: string;
  grade: string;
  price: string;
  batteryHealth?: string | undefined;
  warrantyMonths?: string | undefined;
  accessories?: string | undefined;
  sellerNotes?: string | undefined;
  serialNumber?: string | undefined;
}

export interface ValidatedImportRow {
  rowIndex: number;
  raw: ParsedCsvRow;
  product?: Product | undefined;
  resolvedGrade?: Grade | undefined;
  resolvedPrice?: number | undefined;
  resolvedBattery?: number | undefined;
  resolvedWarranty?: number | undefined;
  resolvedAccessories?: string | undefined;
  resolvedNotes?: string | undefined;
  isValid: boolean;
  errors: string[];
}

export interface ImportValidationReport {
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  rows: ValidatedImportRow[];
}

/**
 * Sanitizes input strings against CSV formula injection attacks (=, +, -, @).
 */
export function sanitizeCsvCell(value: string): string {
  if (!value) return "";
  let clean = value.trim();
  // Strip surrounding quotes
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.slice(1, -1).trim();
  }
  // Neutralize CSV formula injection
  if (/^[=+\-@]/.test(clean)) {
    clean = `'${clean}`;
  }
  return clean;
}

/**
 * Parses raw CSV text into structured rows with formula sanitization.
 */
export function parseCsvText(csvText: string): ParsedCsvRow[] {
  if (!csvText || typeof csvText !== "string") return [];

  const lines = csvText
    .split(/\r\n|\n|\r/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) return [];

  // Parse header
  const headers = lines[0]!.split(",").map((h) => sanitizeCsvCell(h).toLowerCase());

  const getCol = (cols: string[], name: string): string => {
    const idx = headers.findIndex((h) => h.includes(name));
    return idx !== -1 && cols[idx] !== undefined ? sanitizeCsvCell(cols[idx]!) : "";
  };

  const parsedRows: ParsedCsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i]!;
    // Split by comma ignoring commas inside quotes
    const cols = rawLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    const productName = getCol(cols, "product") || getCol(cols, "name") || getCol(cols, "model");
    const grade = getCol(cols, "grade");
    const price = getCol(cols, "price");
    const batteryHealth = getCol(cols, "battery");
    const warrantyMonths = getCol(cols, "warranty");
    const accessories = getCol(cols, "accessories");
    const sellerNotes = getCol(cols, "note") || getCol(cols, "description");
    const serialNumber = getCol(cols, "serial") || getCol(cols, "imei");

    parsedRows.push({
      rowIndex: i + 1,
      productName,
      grade,
      price,
      batteryHealth: batteryHealth || undefined,
      warrantyMonths: warrantyMonths || undefined,
      accessories: accessories || undefined,
      sellerNotes: sellerNotes || undefined,
      serialNumber: serialNumber || undefined,
    });
  }

  return parsedRows;
}

/**
 * Matches user-provided product strings against the master catalog.
 */
export function matchCatalogProduct(query: string): Product | undefined {
  if (!query) return undefined;
  const normalized = query.trim().toLowerCase();

  // 1. Exact ID match
  const exactId = products.find((p) => p.id.toLowerCase() === normalized);
  if (exactId) return exactId;

  // 2. Exact Name match
  const exactName = products.find((p) => p.name.toLowerCase() === normalized);
  if (exactName) return exactName;

  // 3. Partial substring match
  const partial = products.find(
    (p) =>
      p.name.toLowerCase().includes(normalized) ||
      normalized.includes(p.name.toLowerCase()) ||
      p.id.toLowerCase().includes(normalized),
  );
  return partial;
}

/**
 * Validates parsed CSV rows against marketplace inspection integrity constraints.
 * Grade != inspection evidence; missing values are NOT fabricated.
 */
export function validateImportBatch(rows: ParsedCsvRow[]): ImportValidationReport {
  const validatedRows: ValidatedImportRow[] = [];
  const seenUnits = new Set<string>();

  for (const row of rows) {
    const errors: string[] = [];

    // 1. Validate Product Match
    if (!row.productName) {
      errors.push("Missing product model or name.");
    }
    const matchedProduct = matchCatalogProduct(row.productName);
    if (!matchedProduct && row.productName) {
      errors.push(`Product '${row.productName}' could not be matched to master catalog.`);
    }

    // 2. Validate Condition Grade
    const validGrades: Grade[] = ["A+", "A", "B", "C", "D"];
    const upperGrade = row.grade?.toUpperCase().trim() as Grade;
    if (!validGrades.includes(upperGrade)) {
      errors.push(`Invalid Grade '${row.grade}'. Must be A+, A, B, C, or D.`);
    }

    // 3. Validate Price
    const numericPrice = parseInt(row.price.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numericPrice) || numericPrice < 500) {
      errors.push(`Invalid price '${row.price}'. Must be a valid amount >= ৳500.`);
    }

    // 4. Validate Battery Health (if provided)
    let batteryVal: number | undefined;
    if (row.batteryHealth) {
      batteryVal = parseInt(row.batteryHealth.replace(/[^0-9]/g, ""), 10);
      if (isNaN(batteryVal) || batteryVal < 50 || batteryVal > 100) {
        errors.push(`Invalid battery health '${row.batteryHealth}'. Must be between 50% and 100%.`);
      }
    }

    // 5. Validate Warranty (if provided)
    let warrantyVal: number | undefined;
    if (row.warrantyMonths) {
      warrantyVal = parseInt(row.warrantyMonths.replace(/[^0-9]/g, ""), 10);
      if (isNaN(warrantyVal) || warrantyVal < 0 || warrantyVal > 36) {
        errors.push(`Invalid warranty '${row.warrantyMonths}'. Must be between 0 and 36 months.`);
      }
    }

    // 6. Duplicate Detection (Matching product + grade + price + serial in same batch)
    if (matchedProduct && upperGrade && !isNaN(numericPrice)) {
      const signature = `${matchedProduct.id}_${upperGrade}_${numericPrice}_${row.serialNumber || "noserial"}_${row.rowIndex}`;
      const duplicateKey = `${matchedProduct.id}_${upperGrade}_${numericPrice}_${row.serialNumber || ""}`;
      if (row.serialNumber && seenUnits.has(duplicateKey)) {
        errors.push(
          `Duplicate unit detected: Serial '${row.serialNumber}' already present in this upload.`,
        );
      }
      seenUnits.add(duplicateKey);
    }

    validatedRows.push({
      rowIndex: row.rowIndex,
      raw: row,
      product: matchedProduct,
      resolvedGrade: validGrades.includes(upperGrade) ? upperGrade : undefined,
      resolvedPrice: !isNaN(numericPrice) && numericPrice >= 500 ? numericPrice : undefined,
      resolvedBattery: batteryVal,
      resolvedWarranty: warrantyVal,
      resolvedAccessories: row.accessories,
      resolvedNotes: row.sellerNotes,
      isValid: errors.length === 0,
      errors,
    });
  }

  const validCount = validatedRows.filter((r) => r.isValid).length;

  return {
    totalRows: validatedRows.length,
    validRowsCount: validCount,
    invalidRowsCount: validatedRows.length - validCount,
    rows: validatedRows,
  };
}

/**
 * Commits valid import rows into the seller's active listings in storage.
 * Does NOT mark 32-point inspection items as passed unless actually checked.
 */
export function commitValidImportRows(
  validRows: ValidatedImportRow[],
  storeId?: string | undefined,
  storeName?: string | undefined,
): number {
  let count = 0;

  for (const row of validRows) {
    if (!row.isValid || !row.product || !row.resolvedGrade || !row.resolvedPrice) continue;

    saveGradedDraft({
      productLabel: row.product.name,
      price: row.resolvedPrice,
      grade: row.resolvedGrade,
      conditionScore:
        row.resolvedGrade === "A+"
          ? 96
          : row.resolvedGrade === "A"
            ? 88
            : row.resolvedGrade === "B"
              ? 76
              : row.resolvedGrade === "C"
                ? 64
                : 50,
      answers: {
        productName: row.product.name,
        category: row.product.category,
        description: row.resolvedNotes || "Imported batch inventory unit.",
        warranty: (row.resolvedWarranty || 0) > 0 ? "active" : "none",
        accessoriesIncluded: row.resolvedAccessories || "Not specified",
        batteryHealth: row.resolvedBattery ? row.resolvedBattery.toString() : "",
      },
      storeId,
      storeName,
    });

    count++;
  }

  return count;
}

export const SAMPLE_CSV_TEMPLATE = `product_name,grade,price,battery_health,warranty_months,accessories,seller_notes
iPhone 15 Pro 256GB,A+,95000,98,4,Box & Cable,Flawless condition with original box
MacBook Pro 14 M3,A,165000,95,6,MagSafe Charger,Space Black pristine unit with charger
Sony Alpha A7 IV,A,180000,,0,Body Cap & Battery,Clean sensor and shutter count 8200
Google Pixel 8 Pro,B,62000,88,0,Device Only,Minor corner marks with intact display
iPad Pro 11 M2,A+,85000,99,3,Original Box,Like new tablet used for light reading`;
