import { ImportValidationReport, ValidatedImportRow } from "@/lib/bulk-importer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradeBadge } from "@/components/grade-badge";
import { taka } from "@/data/catalog";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UploadCloud,
  Layers,
  ArrowRight,
} from "lucide-react";

interface ImportPreviewTableProps {
  report: ImportValidationReport;
  fileName: string;
  onCommit: () => void;
  onReset: () => void;
  isCommitting?: boolean | undefined;
}

export function ImportPreviewTable({
  report,
  fileName,
  onCommit,
  onReset,
  isCommitting = false,
}: ImportPreviewTableProps) {
  const { totalRows, validRowsCount, invalidRowsCount, rows } = report;

  return (
    <div className="space-y-6">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Total Uploaded
          </div>
          <div className="text-2xl font-bold font-display text-foreground mt-1">{totalRows}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{fileName}</div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5" />
            <span>Ready to Commit</span>
          </div>
          <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1">
            {validRowsCount}
          </div>
          <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
            Passed catalog &amp; diagnostic schema
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            invalidRowsCount > 0
              ? "border-destructive/30 bg-destructive/5"
              : "border-border bg-card"
          }`}
        >
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5">
            {invalidRowsCount > 0 && <XCircle className="size-3.5 text-destructive" />}
            <span>Invalid / Quarantined</span>
          </div>
          <div
            className={`text-2xl font-bold font-display mt-1 ${
              invalidRowsCount > 0 ? "text-destructive" : "text-foreground"
            }`}
          >
            {invalidRowsCount}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {invalidRowsCount > 0 ? "Will be skipped upon commit" : "Zero errors detected"}
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-card">
        <div>
          <h4 className="font-bold text-sm text-foreground">Validation Preview</h4>
          <p className="text-xs text-muted-foreground">
            Review parsed units before publishing to your active storefront inventory.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isCommitting}
            className="text-xs"
          >
            Upload Different File
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onCommit}
            disabled={validRowsCount === 0 || isCommitting}
            className="gap-2 text-xs font-semibold"
          >
            <UploadCloud className="size-4" />
            <span>
              Publish {validRowsCount} Valid {validRowsCount === 1 ? "Listing" : "Listings"}
            </span>
          </Button>
        </div>
      </div>

      {/* Row Table */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                <th className="p-3 font-semibold w-12 text-center">#</th>
                <th className="p-3 font-semibold">Matched Product</th>
                <th className="p-3 font-semibold">Grade</th>
                <th className="p-3 font-semibold">Price</th>
                <th className="p-3 font-semibold">Battery / Warranty</th>
                <th className="p-3 font-semibold">Validation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((row) => (
                <tr
                  key={row.rowIndex}
                  className={`hover:bg-muted/30 transition-colors ${
                    !row.isValid ? "bg-destructive/5" : ""
                  }`}
                >
                  <td className="p-3 font-mono text-muted-foreground text-center">
                    {row.rowIndex}
                  </td>
                  <td className="p-3 font-medium">
                    {row.product ? (
                      <div>
                        <span className="text-foreground font-semibold block">
                          {row.product.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {row.product.brand} &middot; {row.product.category}
                        </span>
                      </div>
                    ) : (
                      <span className="text-destructive font-semibold">
                        {row.raw.productName || "Unknown Product"}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {row.resolvedGrade ? (
                      <GradeBadge grade={row.resolvedGrade} />
                    ) : (
                      <Badge variant="outline" className="text-destructive text-[10px]">
                        {row.raw.grade || "Missing"}
                      </Badge>
                    )}
                  </td>
                  <td className="p-3 font-semibold">
                    {row.resolvedPrice ? (
                      taka(row.resolvedPrice)
                    ) : (
                      <span className="text-destructive">{row.raw.price || "Invalid"}</span>
                    )}
                  </td>
                  <td className="p-3 text-muted-foreground space-y-0.5">
                    <div>
                      {row.resolvedBattery ? `${row.resolvedBattery}% health` : "Battery: N/A"}
                    </div>
                    <div className="text-[10px]">
                      {row.resolvedWarranty ? `${row.resolvedWarranty} mo warranty` : "No warranty"}
                    </div>
                  </td>
                  <td className="p-3">
                    {row.isValid ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] gap-1">
                        <CheckCircle2 className="size-3" />
                        <span>Ready</span>
                      </Badge>
                    ) : (
                      <div className="space-y-1">
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] gap-1">
                          <XCircle className="size-3" />
                          <span>Invalid</span>
                        </Badge>
                        <ul className="text-[10px] text-destructive list-disc list-inside space-y-0.5">
                          {row.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
