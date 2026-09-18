export type Grade = "A+" | "A" | "B" | "C" | "D";

export const gradeLabel: Record<Grade, string> = {
  "A+": "Like New",
  A: "Excellent",
  B: "Good",
  C: "Fair",
  D: "Heavy Wear",
};

export type InspectionItem = {
  component: string;
  status: string;
  passed?: boolean;
  notes?: string;
};

export type InspectionCategory = {
  name: "Physical" | "Functional" | "Connectivity" | "Security" | "Authenticity";
  checks: string[];
};

export const inspectionFramework: InspectionCategory[] = [
  {
    name: "Physical",
    checks: [
      "Display glass & panel",
      "Chassis & frame",
      "Back cover / housing",
      "Camera lens glass",
      "Physical buttons & switches",
      "Charging & audio ports",
    ],
  },
  {
    name: "Functional",
    checks: [
      "Battery health & cycle count",
      "Charging speed & power draw",
      "Loudspeakers & earpiece",
      "Microphones (primary & noise-canceling)",
      "Camera sensors (wide, telephoto, front)",
      "Biometrics (Face ID / Fingerprint)",
      "Vibration motor & haptics",
    ],
  },
  {
    name: "Connectivity",
    checks: [
      "Wi-Fi antennas (2.4GHz & 5GHz)",
      "Bluetooth pairing & range",
      "Cellular modem & signal strength",
      "NFC transactions & reader",
      "GPS & location accuracy",
    ],
  },
  {
    name: "Security",
    checks: [
      "iCloud / Google / OEM account removed",
      "Factory reset / activation lock cleared",
      "IMEI & serial diagnostic status check",
      "Carrier lock & SIM status check",
      "Diagnostic security assessment",
    ],
  },
  {
    name: "Authenticity",
    checks: [
      "OEM serial number verification",
      "Original factory display verification",
      "Battery authenticity verification",
      "Camera module authenticity check",
      "Documented repair history validation",
    ],
  },
];

export const TOTAL_INSPECTION_CHECKS = 32;

export type GalleryShot = { label: string; position: string };

export type RepairHistory = {
  component: string;
  type: "official" | "third-party" | "self";
  date?: string;
  evidence?: string;
};

export type DeviceVerification = {
  imeiStatus: "clean" | "blacklisted" | "unknown";
  carrierStatus: "unlocked" | "locked" | "unknown";
  activationLock: "cleared" | "active" | "unknown";
  accountRemoved: boolean | null;
  note?: string;
};

export type ProductSpecGroup = {
  group: string;
  items: { label: string; value: string }[];
};

export type Listing = {
  id: string;
  productId: string;
  conditionScore: number;
  passedChecks?: number;
  totalChecks?: number;
  inspection: InspectionItem[];
  sellerNote: string;
  listedAt: string;
  price: number;
  grade: Grade;
  warrantyMonths: number;
  invoice: boolean;
  battery?: number | undefined;
  accessories: string;
  repairs: string;
  physical: string;
  screen: string;
  seller: {
    id?: string | undefined;
    name: string;
    verified: boolean;
    rating: number;
    sales: number;
    district: string;
    area?: string | undefined;
  };
  storeId?: string | undefined;
  storeName?: string | undefined;
  repairHistory?: RepairHistory[] | undefined;
  deviceVerification?: DeviceVerification | undefined;
  includedItems?: string[] | undefined;
  knownIssues?: string[] | undefined;
  status?: string | undefined;
  moderationStatus?: string | undefined;
  isSeed?: boolean | undefined;
  sellerId?: string | undefined;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string | undefined;
  image: string;
  retail: number;
  specs: { label: string; value: string }[];
  fullSpecs?: ProductSpecGroup[];
};

export const gradeCriteria: Record<Grade, string> = {
  "A+": "No signs of use. Fully functional, all original parts, complete accessories.",
  A: "Minor signs of use visible only up close. Fully functional, no repairs.",
  B: "Visible wear on body or frame. Fully functional; repairs disclosed in full.",
  C: "Noticeable wear, possible cosmetic damage. Functional with disclosed limitations.",
  D: "Heavy wear or limited functionality. Sold with explicit defect disclosure.",
};

export const grades: Grade[] = ["A+", "A", "B", "C", "D"];

export const galleryShots: { label: string; position: string }[] = [
  { label: "Front", position: "50% 50%" },
  { label: "Back", position: "20% 30%" },
  { label: "Edges & ports", position: "80% 70%" },
  { label: "Powered on", position: "50% 85%" },
];
