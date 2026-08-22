import phone from "@/assets/p-phone.jpg";
import laptop from "@/assets/p-laptop.jpg";
import camera from "@/assets/p-camera.jpg";
import headphones from "@/assets/p-headphones.jpg";

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
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  retail: number;
  specs: { label: string; value: string }[];
  fullSpecs?: ProductSpecGroup[];
};

export const products: Product[] = [
  // ── Smartphones ──
  {
    id: "iphone-15-pro-256",
    name: "iPhone 15 Pro 256GB",
    brand: "Apple",
    category: "Smartphones",
    image: phone,
    retail: 145000,
    specs: [
      { label: "Storage", value: "256GB" },
      { label: "Display", value: '6.1" Super Retina XDR' },
      { label: "Chip", value: "A17 Pro" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Screen Size", value: '6.1" Super Retina XDR OLED' },
          { label: "Resolution", value: "2556 x 1179 pixels at 460 ppi" },
          {
            label: "Refresh Rate",
            value: "ProMotion technology with adaptive refresh rates up to 120Hz",
          },
          {
            label: "Brightness",
            value: "1000 nits max (typical); 1600 nits peak (HDR); 2000 nits peak (outdoor)",
          },
          {
            label: "Protection",
            value: "Ceramic Shield front, textured matte glass back, titanium frame",
          },
        ],
      },
      {
        group: "Performance",
        items: [
          { label: "Chipset", value: "Apple A17 Pro (3nm)" },
          { label: "CPU", value: "6-core (2 performance + 4 efficiency cores)" },
          { label: "GPU", value: "6-core GPU with hardware-accelerated ray tracing" },
          { label: "RAM", value: "8GB" },
          { label: "Internal Storage", value: "256GB NVMe" },
        ],
      },
      {
        group: "Camera System",
        items: [
          { label: "Main Camera", value: "48MP Main (24mm, f/1.78, 2nd-gen sensor-shift OIS)" },
          { label: "Ultra-Wide", value: "12MP Ultra Wide (13mm, f/2.2, 120° FOV)" },
          { label: "Telephoto", value: "12MP 3x Telephoto (77mm, f/2.8, OIS)" },
          { label: "Front Camera", value: "12MP TrueDepth (f/1.9, autofocus)" },
          {
            label: "Video Recording",
            value:
              "4K video recording at 24/25/30/60 fps, ProRes video up to 4K 60 fps with external recording",
          },
        ],
      },
      {
        group: "Battery & Charging",
        items: [
          { label: "Battery Capacity", value: "3,274 mAh" },
          { label: "Charging Connector", value: "USB-C with USB 3 support (up to 10Gb/s)" },
          {
            label: "Wireless Charging",
            value: "MagSafe wireless charging up to 15W, Qi2 wireless charging up to 15W",
          },
        ],
      },
      {
        group: "Connectivity & Build",
        items: [
          { label: "Cellular", value: "5G (sub-6 GHz) with 4x4 MIMO, Gigabit LTE" },
          {
            label: "Wireless",
            value: "Wi-Fi 6E (802.11ax), Bluetooth 5.3, Second-generation Ultra Wideband chip",
          },
          { label: "SIM", value: "Dual eSIM or Nano-SIM + eSIM (region dependent)" },
          {
            label: "Water Resistance",
            value: "Rated IP68 (maximum depth of 6 meters up to 30 minutes)",
          },
        ],
      },
    ],
  },
  {
    id: "iphone-15-128",
    name: "iPhone 15 128GB",
    brand: "Apple",
    category: "Smartphones",
    image: phone,
    retail: 112000,
    specs: [
      { label: "Storage", value: "128GB" },
      { label: "Display", value: '6.1" OLED' },
      { label: "Chip", value: "A16 Bionic" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Screen Size", value: '6.1" Super Retina XDR OLED' },
          { label: "Resolution", value: "2556 x 1179 pixels at 460 ppi" },
          { label: "Feature", value: "Dynamic Island, HDR display, True Tone" },
          {
            label: "Brightness",
            value: "1000 nits typical; 1600 nits peak (HDR); 2000 nits peak (outdoor)",
          },
        ],
      },
      {
        group: "Performance",
        items: [
          { label: "Chipset", value: "Apple A16 Bionic (4nm)" },
          { label: "CPU", value: "6-core CPU with 2 performance and 4 efficiency cores" },
          { label: "GPU", value: "5-core GPU" },
          { label: "RAM", value: "6GB" },
          { label: "Storage", value: "128GB" },
        ],
      },
      {
        group: "Camera System",
        items: [
          {
            label: "Main Camera",
            value: "48MP Main (26mm, f/1.6, sensor-shift OIS, 2x telephoto crop)",
          },
          { label: "Ultra-Wide", value: "12MP Ultra Wide (13mm, f/2.4, 120° FOV)" },
          { label: "Front Camera", value: "12MP TrueDepth (f/1.9 autofocus)" },
        ],
      },
      {
        group: "Battery & Charging",
        items: [
          { label: "Battery Capacity", value: "3,349 mAh" },
          { label: "Port", value: "USB-C (USB 2.0 speeds up to 480Mb/s)" },
          { label: "Wireless", value: "MagSafe wireless charging up to 15W" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "Cellular & Wi-Fi", value: "5G, Wi-Fi 6 (802.11ax), Bluetooth 5.3" },
          { label: "Durability", value: "IP68 water and dust resistance" },
        ],
      },
    ],
  },
  {
    id: "iphone-14-pro-128",
    name: "iPhone 14 Pro 128GB",
    brand: "Apple",
    category: "Smartphones",
    image: phone,
    retail: 125000,
    specs: [
      { label: "Storage", value: "128GB" },
      { label: "Display", value: '6.1" ProMotion 120Hz' },
      { label: "Camera", value: "48MP Main" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Screen Size", value: '6.1" Super Retina XDR OLED' },
          { label: "Refresh Rate", value: "120Hz ProMotion with Always-On display" },
          { label: "Resolution", value: "2556 x 1179 pixels at 460 ppi" },
          { label: "Feature", value: "Dynamic Island" },
        ],
      },
      {
        group: "Performance",
        items: [
          { label: "Chipset", value: "Apple A16 Bionic (4nm)" },
          { label: "RAM", value: "6GB" },
          { label: "Storage", value: "128GB" },
        ],
      },
      {
        group: "Camera",
        items: [
          { label: "Main Camera", value: "48MP Main (24mm, f/1.78, sensor-shift OIS)" },
          { label: "Ultra-Wide", value: "12MP Ultra Wide (13mm, f/2.2)" },
          { label: "Telephoto", value: "12MP 3x Telephoto (77mm, f/2.8, OIS)" },
          { label: "Front Camera", value: "12MP TrueDepth front camera" },
        ],
      },
      {
        group: "Battery & Build",
        items: [
          { label: "Battery", value: "3,200 mAh" },
          { label: "Connector", value: "Lightning port" },
          { label: "Build", value: "Surgical-grade stainless steel frame, Ceramic Shield front" },
        ],
      },
      {
        group: "Connectivity",
        items: [{ label: "Wireless", value: "5G, Wi-Fi 6, Bluetooth 5.3, Ultra Wideband chip" }],
      },
    ],
  },
  {
    id: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra 256GB",
    brand: "Samsung",
    category: "Smartphones",
    image: phone,
    retail: 168000,
    specs: [
      { label: "Storage", value: "256GB / 12GB RAM" },
      { label: "Display", value: '6.8" QHD+ AMOLED 120Hz' },
      { label: "Chip", value: "Snapdragon 8 Gen 3" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Display Size & Type", value: '6.8" Dynamic AMOLED 2X flat display' },
          { label: "Resolution", value: "QHD+ (3120 x 1440 pixels)" },
          { label: "Refresh Rate", value: "1-120Hz adaptive refresh rate" },
          { label: "Peak Brightness", value: "2600 nits peak brightness" },
          { label: "Cover Glass", value: "Corning Gorilla Armor (anti-reflective)" },
        ],
      },
      {
        group: "Performance",
        items: [
          { label: "Processor", value: "Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)" },
          { label: "RAM", value: "12GB LPDDR5X" },
          { label: "Storage", value: "256GB UFS 4.0" },
          { label: "S-Pen", value: "Integrated S-Pen stylus with Bluetooth gestures" },
        ],
      },
      {
        group: "Camera System",
        items: [
          { label: "Wide Camera", value: "200MP Main (f/1.7, OIS, Super Quad Pixel AF)" },
          {
            label: "Periscope Telephoto",
            value: "50MP 5x Optical Zoom (f/3.4, OIS, 10x optical quality)",
          },
          { label: "Telephoto", value: "10MP 3x Optical Zoom (f/2.4, OIS)" },
          { label: "Ultra-Wide", value: "12MP Ultra-Wide (f/2.2, 120° FOV, Dual Pixel AF)" },
          { label: "Front Camera", value: "12MP (f/2.2, Dual Pixel AF)" },
        ],
      },
      {
        group: "Battery & Power",
        items: [
          { label: "Battery Capacity", value: "5,000 mAh" },
          { label: "Wired Charging", value: "45W fast charging (Fast Charging 2.0)" },
          {
            label: "Wireless Charging",
            value: "15W Fast Wireless Charging 2.0, Wireless PowerShare",
          },
        ],
      },
      {
        group: "Connectivity & Durability",
        items: [
          {
            label: "Network",
            value: "5G Sub-6/mmWave, Wi-Fi 7, Bluetooth 5.3, Ultra-Wideband (UWB)",
          },
          { label: "Durability", value: "Titanium frame, IP68 water and dust resistance" },
        ],
      },
    ],
  },
  {
    id: "samsung-galaxy-s23-fe",
    name: "Samsung Galaxy S23 FE 128GB",
    brand: "Samsung",
    category: "Smartphones",
    image: phone,
    retail: 72000,
    specs: [
      { label: "Storage", value: "128GB / 8GB RAM" },
      { label: "Display", value: '6.4" Dynamic AMOLED' },
      { label: "Battery", value: "4500mAh" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Display Size", value: '6.4" Dynamic AMOLED 2X' },
          { label: "Resolution", value: "FHD+ (2340 x 1080 pixels)" },
          { label: "Refresh Rate", value: "120Hz adaptive" },
          { label: "Brightness", value: "Up to 1450 nits peak brightness" },
        ],
      },
      {
        group: "Performance",
        items: [
          { label: "Processor", value: "Exynos 2200 / Snapdragon 8 Gen 1" },
          { label: "Memory & Storage", value: "8GB RAM, 128GB Storage" },
        ],
      },
      {
        group: "Camera System",
        items: [
          { label: "Main", value: "50MP Main (f/1.8, OIS)" },
          { label: "Telephoto", value: "8MP 3x Telephoto (f/2.4, OIS)" },
          { label: "Ultra-Wide", value: "12MP Ultra-Wide (f/2.2, 123° FOV)" },
          { label: "Front", value: "10MP Front Camera" },
        ],
      },
      {
        group: "Battery & Charging",
        items: [
          { label: "Battery", value: "4,500 mAh" },
          { label: "Charging", value: "25W wired fast charging, 15W wireless charging" },
        ],
      },
      {
        group: "Connectivity",
        items: [{ label: "Network", value: "5G, Wi-Fi 6E, Bluetooth 5.3, NFC, IP68" }],
      },
    ],
  },
  {
    id: "google-pixel-8-pro",
    name: "Google Pixel 8 Pro 128GB",
    brand: "Google",
    category: "Smartphones",
    image: phone,
    retail: 108000,
    specs: [
      { label: "Storage", value: "128GB / 12GB RAM" },
      { label: "Display", value: '6.7" Super Actua' },
      { label: "Chip", value: "Google Tensor G3" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Display Size & Type", value: '6.7" Super Actua LTPO OLED display' },
          { label: "Resolution", value: "2992 x 1344 pixels at 489 ppi" },
          { label: "Refresh Rate", value: "Smooth Display (1–120Hz)" },
          {
            label: "Brightness",
            value: "Up to 1600 nits (HDR) and up to 2400 nits peak brightness",
          },
        ],
      },
      {
        group: "Performance",
        items: [
          { label: "Processor", value: "Google Tensor G3 with Titan M2 security coprocessor" },
          { label: "Memory", value: "12GB LPDDR5X RAM" },
          { label: "Storage", value: "128GB UFS 3.1" },
          { label: "Sensors", value: "Temperature sensor on rear camera bar" },
        ],
      },
      {
        group: "Camera System",
        items: [
          { label: "Main Camera", value: "50MP Octa PD wide camera (f/1.68, OIS)" },
          { label: "Ultra-Wide", value: "48MP Quad PD ultra-wide with autofocus and Macro Focus" },
          {
            label: "Telephoto",
            value: "48MP Quad PD 5x telephoto camera (f/2.8, OIS, 30x Super Res Zoom)",
          },
          { label: "Front Camera", value: "10.5MP Dual PD selfie camera with autofocus" },
        ],
      },
      {
        group: "Battery & Charging",
        items: [
          { label: "Battery Capacity", value: "5,050 mAh" },
          {
            label: "Charging Speed",
            value:
              "Fast charging up to 30W (USB-PD 3.0 PPS), Fast wireless charging, Battery Share",
          },
        ],
      },
      {
        group: "Connectivity & Build",
        items: [
          {
            label: "Wireless",
            value: "Wi-Fi 7 (802.11be), Bluetooth 5.3, Ultra-Wideband chip (UWB)",
          },
          {
            label: "Protection",
            value: "Corning Gorilla Glass Victus 2 cover glass, IP68 water/dust resistance",
          },
        ],
      },
    ],
  },
  {
    id: "oneplus-12-256",
    name: "OnePlus 12 16/256GB",
    brand: "OnePlus",
    category: "Smartphones",
    image: phone,
    retail: 94000,
    specs: [
      { label: "Storage", value: "256GB / 16GB RAM" },
      { label: "Display", value: '6.82" 2K ProXDR 120Hz' },
      { label: "Charging", value: "100W SUPERVOOC" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Display Size", value: '6.82" 2K ProXDR LTPO AMOLED (3168 x 1440)' },
          { label: "Refresh Rate", value: "1-120Hz adaptive, 2160Hz PWM dimming" },
          { label: "Peak Brightness", value: "4500 nits peak brightness, Dolby Vision & HDR10+" },
        ],
      },
      {
        group: "Performance",
        items: [
          { label: "Processor", value: "Qualcomm Snapdragon 8 Gen 3 (4nm)" },
          { label: "RAM & Storage", value: "16GB LPDDR5X RAM, 256GB UFS 4.0 Storage" },
          { label: "Cooling", value: "Dual Cryo-velocity VC cooling system (9140mm²)" },
        ],
      },
      {
        group: "Camera System",
        items: [
          { label: "Main Camera", value: '50MP Sony LYT-808 (1/1.4", f/1.6, OIS)' },
          {
            label: "Telephoto",
            value: "64MP 3x Periscope Telephoto (OmniVision OV64B, f/2.6, OIS, 120x digital zoom)",
          },
          { label: "Ultra-Wide", value: "48MP Sony IMX581 (114° FOV, Macro capability)" },
          { label: "Calibration", value: "4th Gen Hasselblad Camera for Mobile" },
        ],
      },
      {
        group: "Battery & Charging",
        items: [
          { label: "Battery", value: "5,400 mAh dual-cell battery" },
          { label: "Wired Charging", value: "100W SUPERVOOC (1-100% in approx. 26 minutes)" },
          { label: "Wireless Charging", value: "50W AIRVOOC wireless fast charging" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          {
            label: "Network",
            value: "5G, Wi-Fi 7, Bluetooth 5.4, Infrared remote control, USB 3.2 Gen 1",
          },
        ],
      },
    ],
  },
  {
    id: "xiaomi-14-512",
    name: "Xiaomi 14 12/512GB Leica",
    brand: "Xiaomi",
    category: "Smartphones",
    image: phone,
    retail: 88000,
    specs: [
      { label: "Storage", value: "512GB / 12GB RAM" },
      { label: "Optics", value: "Leica Summilux Lens" },
      { label: "Chip", value: "Snapdragon 8 Gen 3" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Display Size", value: '6.36" LTPO OLED (2670 x 1200 pixels)' },
          {
            label: "Refresh Rate",
            value: "1-120Hz adaptive refresh rate, 3000 nits peak brightness",
          },
          { label: "Color Support", value: "12-bit color depth, Dolby Vision, HDR10+, DCI-P3" },
        ],
      },
      {
        group: "Performance",
        items: [
          { label: "Processor", value: "Qualcomm Snapdragon 8 Gen 3 (4nm)" },
          { label: "Memory & Storage", value: "12GB LPDDR5X RAM, 512GB UFS 4.0 Storage" },
        ],
      },
      {
        group: "Camera System",
        items: [
          {
            label: "Main Camera",
            value: "50MP Light Fusion 900 custom sensor (Leica Summilux f/1.6, OIS)",
          },
          {
            label: "Floating Telephoto",
            value: "50MP 75mm Leica floating telephoto (f/2.0, OIS, 10cm macro)",
          },
          { label: "Ultra-Wide", value: "50MP Leica ultra-wide (115° FOV, f/2.2)" },
          { label: "Front Camera", value: "32MP front selfie camera" },
        ],
      },
      {
        group: "Battery & Charging",
        items: [
          { label: "Battery Capacity", value: "4,610 mAh" },
          {
            label: "Charging",
            value: "90W HyperCharge wired (100% in 31 min), 50W wireless charging",
          },
        ],
      },
      {
        group: "Connectivity & Build",
        items: [
          {
            label: "Connectivity",
            value: "5G, Wi-Fi 7, Bluetooth 5.4, USB-C 3.2 Gen 1, IR Blaster, IP68",
          },
        ],
      },
    ],
  },

  // ── Laptops ──
  {
    id: "macbook-air-m2",
    name: "MacBook Air M2 8/256",
    brand: "Apple",
    category: "Laptops",
    image: laptop,
    retail: 165000,
    specs: [
      { label: "Memory", value: "8GB unified" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Display", value: '13.6" Liquid Retina' },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Display Size", value: '13.6" Liquid Retina display with True Tone' },
          { label: "Resolution", value: "2560 x 1664 native resolution at 224 pixels per inch" },
          {
            label: "Brightness & Color",
            value: "500 nits brightness, Wide color (P3), 1 billion colors support",
          },
        ],
      },
      {
        group: "Processor & Graphics",
        items: [
          { label: "Chip", value: "Apple M2 chip" },
          { label: "CPU", value: "8-core CPU with 4 performance cores and 4 efficiency cores" },
          {
            label: "GPU",
            value: "8-core GPU with hardware-accelerated ProRes & H.264 encode/decode",
          },
          { label: "Neural Engine", value: "16-core Neural Engine" },
        ],
      },
      {
        group: "Memory & Storage",
        items: [
          { label: "Unified Memory", value: "8GB unified memory (100GB/s memory bandwidth)" },
          { label: "Storage", value: "256GB PCIe-based SSD" },
        ],
      },
      {
        group: "Ports & Expansion",
        items: [
          { label: "Charging", value: "MagSafe 3 charging port" },
          {
            label: "Thunderbolt",
            value: "Two Thunderbolt / USB 4 ports (charging, DisplayPort, USB 4 up to 40Gb/s)",
          },
          {
            label: "Audio Port",
            value: "3.5mm headphone jack with advanced support for high-impedance headphones",
          },
        ],
      },
      {
        group: "Battery & Audio",
        items: [
          {
            label: "Battery",
            value:
              "52.6-watt-hour lithium-polymer battery (up to 18 hours Apple TV app movie playback)",
          },
          { label: "Power Adapter", value: "30W USB-C Power Adapter" },
          {
            label: "Audio & Camera",
            value: "Four-speaker sound system with Spatial Audio, 1080p FaceTime HD camera",
          },
        ],
      },
    ],
  },
  {
    id: "macbook-pro-14-m3",
    name: 'MacBook Pro 14" M3 16/512',
    brand: "Apple",
    category: "Laptops",
    image: laptop,
    retail: 245000,
    specs: [
      { label: "Chip", value: "Apple M3 Pro 11-Core" },
      { label: "Memory", value: "18GB unified" },
      { label: "Display", value: '14.2" Liquid Retina XDR 120Hz' },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Display Size", value: '14.2" Liquid Retina XDR display' },
          { label: "Resolution", value: "3024 x 1964 native resolution at 254 pixels per inch" },
          { label: "ProMotion", value: "Adaptive refresh rates up to 120Hz" },
          {
            label: "XDR Brightness",
            value:
              "1000 nits sustained full-screen, 1600 nits peak (HDR content only), 600 nits SDR",
          },
        ],
      },
      {
        group: "Processor & Graphics",
        items: [
          { label: "Chip", value: "Apple M3 Pro chip" },
          { label: "CPU", value: "11-core CPU (5 performance cores and 6 efficiency cores)" },
          {
            label: "GPU",
            value: "14-core GPU with hardware-accelerated ray tracing and mesh shading",
          },
          { label: "Memory Bandwidth", value: "150GB/s memory bandwidth" },
        ],
      },
      {
        group: "Memory & Storage",
        items: [
          { label: "Unified Memory", value: "18GB unified memory" },
          { label: "Storage", value: "512GB NVMe SSD" },
        ],
      },
      {
        group: "Ports & I/O",
        items: [
          { label: "Thunderbolt Ports", value: "Three Thunderbolt 4 (USB-C) ports" },
          { label: "Card Slot", value: "SDXC card slot" },
          {
            label: "Display Output",
            value: "HDMI port with support for up to 8K resolution at 60Hz or 4K at 240Hz",
          },
          { label: "Power & Headphone", value: "MagSafe 3 port, 3.5mm headphone jack" },
        ],
      },
      {
        group: "Battery & Power",
        items: [
          {
            label: "Battery",
            value: "70-watt-hour lithium-polymer battery (up to 17 hours wireless web)",
          },
          { label: "Power Adapter", value: "70W USB-C Power Adapter" },
        ],
      },
    ],
  },
  {
    id: "dell-xps-15-9530",
    name: "Dell XPS 15 9530 Core i7 RTX 4050",
    brand: "Dell",
    category: "Laptops",
    image: laptop,
    retail: 225000,
    specs: [
      { label: "Processor", value: "Intel Core i7-13700H" },
      { label: "Graphics", value: "NVIDIA RTX 4050 6GB" },
      { label: "Display", value: '15.6" OLED 3.5K Touch' },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Screen Size & Type", value: '15.6" 3.5K (3456 x 2160) OLED Touch Display' },
          {
            label: "Color & Brightness",
            value: "400 nits, 100% DCI-P3 color gamut, DisplayHDR 500, anti-reflective",
          },
        ],
      },
      {
        group: "Processor",
        items: [
          {
            label: "Processor",
            value: "13th Gen Intel Core i7-13700H (14 cores, 20 threads, up to 5.00 GHz Turbo)",
          },
          { label: "Dedicated GPU", value: "NVIDIA GeForce RTX 4050 6GB GDDR6 (40W TGP)" },
        ],
      },
      {
        group: "Memory & Storage",
        items: [
          {
            label: "Installed RAM",
            value: "16GB (2 x 8GB) DDR5 4800MHz (dual-channel upgradeable)",
          },
          { label: "Storage Drive", value: "1TB M.2 PCIe NVMe Solid State Drive" },
        ],
      },
      {
        group: "Ports & Connectivity",
        items: [
          {
            label: "Thunderbolt",
            value: "2x Thunderbolt 4 (USB Type-C) with DisplayPort and Power Delivery",
          },
          {
            label: "Additional Ports",
            value: "1x USB 3.2 Gen 2 Type-C, 1x full-size SD card reader v6.0, 3.5mm headphone/mic",
          },
          { label: "Wireless", value: "Intel Killer Wi-Fi 6 1675 (AX211) 2x2 + Bluetooth 5.2" },
        ],
      },
      {
        group: "Battery & Build",
        items: [
          { label: "Battery", value: "6-Cell 86Whr integrated battery" },
          { label: "Power Supply", value: "130W Type-C AC adapter" },
          {
            label: "Chassis",
            value: "CNC machined aluminum in Platinum Silver with carbon fiber composite palm rest",
          },
        ],
      },
    ],
  },
  {
    id: "dell-latitude-7420",
    name: "Dell Latitude 7420 Core i7 16/512",
    brand: "Dell",
    category: "Laptops",
    image: laptop,
    retail: 72000,
    specs: [
      { label: "Processor", value: "Intel Core i7-1185G7" },
      { label: "Memory", value: "16GB LPDDR4x" },
      { label: "Storage", value: "512GB NVMe SSD" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Display Size", value: '14.0" FHD (1920 x 1080) Anti-Glare IPS Non-Touch' },
          { label: "Brightness & Aspect", value: "250 nits brightness, 16:9 aspect ratio" },
        ],
      },
      {
        group: "Processor",
        items: [
          {
            label: "Processor",
            value: "Intel Core i7-1185G7 vPro (4 cores, 8 threads, up to 4.80 GHz Turbo)",
          },
          { label: "Graphics", value: "Intel Iris Xe Graphics" },
        ],
      },
      {
        group: "Memory & Storage",
        items: [
          { label: "RAM", value: "16GB LPDDR4x 4267MHz (soldered onboard)" },
          { label: "Storage", value: "512GB PCIe NVMe Class 35 SSD" },
        ],
      },
      {
        group: "Ports & I/O",
        items: [
          {
            label: "Thunderbolt",
            value: "2x Thunderbolt 4 with Power Delivery and DisplayPort (USB Type-C)",
          },
          {
            label: "USB & Video",
            value: "1x USB 3.2 Gen 1 with PowerShare, 1x HDMI 2.0, 1x uSD 4.0 memory card reader",
          },
          { label: "Audio", value: "Universal audio jack (3.5mm combo)" },
        ],
      },
      {
        group: "Battery & Power",
        items: [
          { label: "Battery", value: "4-cell 63Wh ExpressCharge Capable Battery" },
          { label: "Adapter", value: "65W Type-C Power Adapter" },
        ],
      },
    ],
  },
  {
    id: "hp-elitebook-840-g9",
    name: "HP EliteBook 840 G9 Core i5",
    brand: "HP",
    category: "Laptops",
    image: laptop,
    retail: 76000,
    specs: [
      { label: "Processor", value: "Intel Core i5-1240P" },
      { label: "Memory", value: "16GB DDR5" },
      { label: "Display", value: '14" WUXGA Anti-Glare' },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Display Size", value: '14.0" diagonal WUXGA (1920 x 1200) IPS Anti-Glare' },
          { label: "Brightness & Ratio", value: "400 nits, 100% sRGB, 16:10 aspect ratio" },
        ],
      },
      {
        group: "Processor",
        items: [
          {
            label: "CPU",
            value: "Intel Core i5-1240P (12 cores, 16 threads, up to 4.40 GHz Turbo, 12MB Cache)",
          },
          { label: "Graphics", value: "Intel Iris Xe Graphics" },
        ],
      },
      {
        group: "Memory & Storage",
        items: [
          { label: "Memory", value: "16GB DDR5-4800MHz RAM" },
          { label: "Storage", value: "512GB PCIe NVMe SSD" },
        ],
      },
      {
        group: "Ports & Audio",
        items: [
          {
            label: "Thunderbolt",
            value: "2x Thunderbolt 4 with USB4 Type-C 40Gbps (USB Power Delivery, DisplayPort 1.4)",
          },
          {
            label: "USB & HDMI",
            value: "2x SuperSpeed USB Type-A 5Gbps, 1x HDMI 2.0, 1x headphone/mic combo",
          },
          {
            label: "Audio",
            value: "Audio by Bang & Olufsen, dual stereo speakers, dual array world-facing mics",
          },
        ],
      },
      {
        group: "Battery",
        items: [
          { label: "Battery", value: "HP Long Life 3-cell, 51Wh polymer" },
          { label: "Adapter", value: "65W USB Type-C AC adapter" },
        ],
      },
    ],
  },
  {
    id: "lenovo-thinkpad-x1-carbon",
    name: "Lenovo ThinkPad X1 Carbon Gen 10",
    brand: "Lenovo",
    category: "Laptops",
    image: laptop,
    retail: 148000,
    specs: [
      { label: "Processor", value: "Intel Core i7-1260P" },
      { label: "Build", value: "Carbon Fiber & Magnesium" },
      { label: "Weight", value: "1.12 kg ultralight" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Display Size", value: '14.0" WUXGA (1920 x 1200) IPS Anti-Glare' },
          {
            label: "Features",
            value: "16:10 aspect ratio, 400 nits, 100% sRGB, Low Power consumption",
          },
        ],
      },
      {
        group: "Processor",
        items: [
          {
            label: "CPU",
            value:
              "12th Generation Intel Core i7-1260P (12 cores, 16 threads, up to 4.70 GHz Turbo)",
          },
          { label: "Graphics", value: "Integrated Intel Iris Xe Graphics" },
        ],
      },
      {
        group: "Memory & Storage",
        items: [
          { label: "Memory", value: "16GB LPDDR5-5200MHz (soldered)" },
          { label: "Storage", value: "512GB SSD M.2 2280 PCIe 4.0 x4 Performance NVMe Opal2" },
        ],
      },
      {
        group: "Ports & Connectivity",
        items: [
          {
            label: "Thunderbolt",
            value: "2x Thunderbolt 4 / USB4 40Gbps (Power Delivery 3.0 and DisplayPort 1.4a)",
          },
          {
            label: "USB & Video",
            value: "2x USB 3.2 Gen 1 (one Always On), 1x HDMI up to 4K/60Hz, 3.5mm combo audio",
          },
          { label: "Wireless", value: "Intel Wi-Fi 6E AX211, 802.11ax 2x2 Wi-Fi + Bluetooth 5.1" },
        ],
      },
      {
        group: "Battery & Weight",
        items: [
          {
            label: "Battery",
            value: "Integrated 57Wh battery, supports Rapid Charge (up to 80% in 1hr)",
          },
          { label: "Power Supply", value: "65W USB-C AC adapter" },
          {
            label: "Weight & Materials",
            value: "Starting at 1.12 kg (2.48 lbs), Carbon fiber top cover and magnesium bottom",
          },
        ],
      },
    ],
  },
  {
    id: "asus-zenbook-14-oled",
    name: "ASUS ZenBook 14 OLED Core Ultra 7",
    brand: "ASUS",
    category: "Laptops",
    image: laptop,
    retail: 138000,
    specs: [
      { label: "Processor", value: "Intel Core Ultra 7 155H" },
      { label: "Display", value: '14" 3K 120Hz OLED' },
      { label: "Battery", value: "75Wh All-Day" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          { label: "Display Size & Type", value: '14.0" 3K (2880 x 1800) OLED 16:10 aspect ratio' },
          {
            label: "Refresh Rate & Response",
            value: "120Hz refresh rate, 0.2ms response time, 600 nits HDR peak brightness",
          },
          {
            label: "Color Accuracy",
            value: "100% DCI-P3 color gamut, VESA CERTIFIED Display HDR True Black 600",
          },
        ],
      },
      {
        group: "Processor",
        items: [
          {
            label: "CPU",
            value: "Intel Core Ultra 7 155H Processor (16 cores, 22 threads, up to 4.8 GHz Turbo)",
          },
          { label: "NPU", value: "Intel AI Boost NPU for accelerated on-device AI tasks" },
          { label: "Graphics", value: "Intel Arc Graphics" },
        ],
      },
      {
        group: "Memory & Storage",
        items: [
          { label: "Memory", value: "16GB LPDDR5X 7467MHz (onboard)" },
          { label: "Storage", value: "1TB M.2 NVMe PCIe 4.0 SSD" },
        ],
      },
      {
        group: "Ports & I/O",
        items: [
          { label: "Thunderbolt", value: "2x Thunderbolt 4 supports display / power delivery" },
          {
            label: "Standard Ports",
            value: "1x USB 3.2 Gen 1 Type-A, 1x HDMI 2.1 TMDS, 1x 3.5mm Combo Audio Jack",
          },
        ],
      },
      {
        group: "Battery & Portability",
        items: [
          { label: "Battery", value: "75Wh, 4-cell Li-ion battery (up to 15+ hours battery life)" },
          { label: "Weight", value: "1.20 kg (2.65 lbs) all-metal sleek chassis" },
        ],
      },
    ],
  },

  // ── Cameras ──
  {
    id: "fuji-x100v",
    name: "Fujifilm X100V",
    brand: "Fujifilm",
    category: "Cameras",
    image: camera,
    retail: 198000,
    specs: [
      { label: "Sensor", value: "26.1MP APS-C X-Trans" },
      { label: "Lens", value: "23mm f/2.0 Fixed" },
      { label: "Viewfinder", value: "Hybrid OVF/EVF" },
    ],
    fullSpecs: [
      {
        group: "Sensor & Processing",
        items: [
          {
            label: "Image Sensor",
            value: "26.1MP APS-C (23.5mm x 15.6mm) X-Trans CMOS 4 with primary color filter",
          },
          { label: "Image Processor", value: "X-Processor 4 Quad-Core Engine" },
          { label: "ISO Sensitivity", value: "Standard ISO 160-12800 (Extended ISO 80-51200)" },
        ],
      },
      {
        group: "Optics & Lens",
        items: [
          {
            label: "Focal Length",
            value: "FUJINON 23mm fixed prime lens (equivalent to 35mm in 35mm format)",
          },
          { label: "Aperture Range", value: "f/2.0 to f/16 in 1/3 EV steps (9-blade diaphragm)" },
          { label: "Built-in Filter", value: "Internal 4-stop Neutral Density (ND) filter" },
        ],
      },
      {
        group: "Viewfinder & Display",
        items: [
          {
            label: "Hybrid Viewfinder",
            value:
              'OVF (0.52x magnification with electronic frame lines) + 0.5" 3.69M-dot OLED EVF',
          },
          { label: "Rear LCD", value: '3.0" Two-Way Tilting Touchscreen LCD (1.62 million dots)' },
        ],
      },
      {
        group: "Video Capabilities",
        items: [
          {
            label: "Video Resolutions",
            value: "DCI 4K (4096x2160) and 4K UHD (3840x2160) up to 29.97p at 200Mbps",
          },
          { label: "Slow Motion", value: "Full HD up to 120p high-speed recording" },
          {
            label: "Color Profile",
            value: "F-Log recording supported (10-bit 4:2:2 via HDMI output)",
          },
        ],
      },
      {
        group: "Connectivity & Shutter",
        items: [
          {
            label: "Shutter Type",
            value:
              "Leaf shutter up to 1/4000s (flash sync at all shutter speeds), Electronic shutter up to 1/32000s",
          },
          {
            label: "Ports & Wireless",
            value:
              "USB Type-C (USB 3.1 Gen 1), Micro HDMI Type D, 2.5mm remote/mic jack, Wi-Fi, Bluetooth 4.2",
          },
        ],
      },
    ],
  },
  {
    id: "sony-a7-iv",
    name: "Sony Alpha A7 IV Body",
    brand: "Sony",
    category: "Cameras",
    image: camera,
    retail: 235000,
    specs: [
      { label: "Sensor", value: "33MP Full-Frame Exmor R" },
      { label: "Video", value: "4K 60p 10-Bit 4:2:2" },
      { label: "Autofocus", value: "759-Point Phase Detection" },
    ],
    fullSpecs: [
      {
        group: "Sensor & Processing",
        items: [
          {
            label: "Sensor",
            value: "33.0 Megapixel Full-Frame (35.9 x 23.9 mm) back-illuminated Exmor R CMOS",
          },
          { label: "Processor", value: "BIONZ XR image processing engine" },
          {
            label: "Stabilization",
            value:
              "5-axis In-Body Image Stabilization (IBIS) offering up to 5.5 stops compensation",
          },
        ],
      },
      {
        group: "Autofocus",
        items: [
          {
            label: "AF Points",
            value: "759 phase-detection AF points covering approx. 94% of image area",
          },
          {
            label: "Tracking Capabilities",
            value: "Real-time Eye AF for Human, Animal, and Bird in still photos and 4K movies",
          },
        ],
      },
      {
        group: "Video Recording",
        items: [
          {
            label: "Video Resolution",
            value: "4K 60p (in Super 35mm mode) & 4K 30p with 7K full-pixel readout oversampling",
          },
          {
            label: "Recording Formats",
            value: "10-bit 4:2:2 All-Intra (XAVC S-I) up to 600 Mbps, S-Cinetone, S-Log3",
          },
        ],
      },
      {
        group: "Viewfinder & Screen",
        items: [
          {
            label: "EVF",
            value: "3.68 million-dot Quad-VGA OLED electronic viewfinder (120 fps high-rate mode)",
          },
          {
            label: "Rear Display",
            value: 'Side-opening 3.0" Vari-angle Touch LCD (1.03 million dots)',
          },
        ],
      },
      {
        group: "Media & Connectivity",
        items: [
          {
            label: "Storage Slots",
            value:
              "Dual media slots: Slot 1 supports CFexpress Type A / SD UHS-II; Slot 2 supports SD UHS-II",
          },
          {
            label: "Ports",
            value:
              "Full-size HDMI Type-A, USB-C 3.2 Gen 2 (10Gbps with UVC/UAC live streaming), 3.5mm mic/headphone",
          },
        ],
      },
    ],
  },
  {
    id: "canon-eos-r6-mark-ii",
    name: "Canon EOS R6 Mark II Body",
    brand: "Canon",
    category: "Cameras",
    image: camera,
    retail: 260000,
    specs: [
      { label: "Sensor", value: "24.2MP Full-Frame CMOS" },
      { label: "Burst", value: "40 fps Electronic Shutter" },
      { label: "Stabilization", value: "8.0 Stops In-Body IS" },
    ],
    fullSpecs: [
      {
        group: "Sensor & Engine",
        items: [
          { label: "Sensor", value: "24.2 Megapixel Full-Frame CMOS sensor" },
          { label: "Processor", value: "DIGIC X Image Processor" },
          {
            label: "Image Stabilization",
            value:
              "In-Body Image Stabilizer (IBIS) providing up to 8.0 stops Coordinated IS with compatible lenses",
          },
        ],
      },
      {
        group: "Autofocus & Continuous Shooting",
        items: [
          {
            label: "AF System",
            value: "Dual Pixel CMOS AF II with 1,053 AF zones and Deep Learning subject detection",
          },
          {
            label: "Continuous Burst",
            value: "Up to 40 fps electronic shutter; up to 12 fps mechanical shutter",
          },
        ],
      },
      {
        group: "Video Capabilities",
        items: [
          { label: "4K Video", value: "Uncropped 6K oversampled 4K up to 60p; Full HD up to 180p" },
          {
            label: "Profiles",
            value: "Canon Log 3 (10-bit 4:2:2), HDR PQ, 6K RAW external recording via HDMI",
          },
        ],
      },
      {
        group: "Hardware & Media",
        items: [
          {
            label: "Viewfinder & Monitor",
            value: '0.5" 3.69M-dot OLED EVF (up to 120 fps); 3.0" 1.62M-dot Vari-angle Touch LCD',
          },
          { label: "Storage", value: "Dual SD/SDHC/SDXC card slots (both support UHS-II)" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          {
            label: "Interfaces",
            value:
              "USB-C 3.2 Gen 2, Micro-HDMI Type-D, 3.5mm mic in & headphone out, Wi-Fi (5GHz/2.4GHz), Bluetooth 5.0",
          },
        ],
      },
    ],
  },
  {
    id: "nikon-z6-ii",
    name: "Nikon Z6 II Full Frame Mirrorless",
    brand: "Nikon",
    category: "Cameras",
    image: camera,
    retail: 175000,
    specs: [
      { label: "Sensor", value: "24.5MP BSI CMOS" },
      { label: "Processor", value: "Dual EXPEED 6" },
      { label: "Slots", value: "Dual CFexpress/SD" },
    ],
    fullSpecs: [
      {
        group: "Sensor & Processing",
        items: [
          {
            label: "Sensor",
            value: "24.5MP Full-Frame (FX-format) Backside Illuminated (BSI) CMOS Sensor",
          },
          { label: "Processor", value: "Dual EXPEED 6 Image Processing Engines" },
          {
            label: "In-Body VR",
            value: "5-axis Sensor-Shift Vibration Reduction (up to 5.0 stops compensation)",
          },
        ],
      },
      {
        group: "Autofocus & Performance",
        items: [
          { label: "Autofocus Points", value: "273-point Phase-Detection AF System" },
          {
            label: "Eye Detection",
            value: "Eye / Face / Animal Detection AF in both photo and video modes",
          },
          { label: "Continuous Speed", value: "Up to 14 frames per second continuous shooting" },
        ],
      },
      {
        group: "Video Capabilities",
        items: [
          { label: "Resolution", value: "4K UHD up to 60p, Full HD up to 120p" },
          {
            label: "Output",
            value: "10-bit N-Log & HDR (HLG) output via HDMI (optional RAW video upgrade)",
          },
        ],
      },
      {
        group: "Viewfinder & Display",
        items: [
          { label: "Viewfinder", value: "3.69 million-dot Quad-VGA OLED Electronic Viewfinder" },
          { label: "Monitor", value: '3.2" 2.1M-dot Tilting Touchscreen LCD' },
        ],
      },
      {
        group: "Storage & Ports",
        items: [
          { label: "Card Slots", value: "Dual slots: 1x CFexpress Type B / XQD + 1x SD UHS-II" },
          {
            label: "Connections",
            value: "USB-C (USB 3.2 Gen 1 with USB Power Delivery), Type-C HDMI, Wi-Fi, Bluetooth",
          },
        ],
      },
    ],
  },

  // ── Audio ──
  {
    id: "sony-wh1000xm5",
    name: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    category: "Audio",
    image: headphones,
    retail: 42000,
    specs: [
      { label: "Type", value: "Over-Ear Wireless ANC Headphones" },
      { label: "Battery", value: "30h playback" },
      { label: "Codec", value: "LDAC & Hi-Res Audio" },
    ],
    fullSpecs: [
      {
        group: "Audio & Noise Cancelling",
        items: [
          {
            label: "Driver Unit",
            value: "30mm precision-engineered carbon fiber composite dome driver",
          },
          {
            label: "Noise Cancelling",
            value:
              "Auto NC Optimizer with HD Noise Cancelling Processor QN1 and Integrated Processor V1 (8 microphones)",
          },
          {
            label: "Frequency Response",
            value: "4 Hz - 40,000 Hz (JEITA) / 20 Hz - 40,000 Hz (LDAC 96kHz 990kbps)",
          },
        ],
      },
      {
        group: "Connectivity & Codecs",
        items: [
          { label: "Bluetooth Version", value: "Bluetooth 5.2" },
          { label: "Audio Codecs", value: "LDAC, AAC, SBC" },
          { label: "Multipoint", value: "Supports simultaneous connection to 2 devices" },
          { label: "Wired", value: "3.5mm stereo mini jack cable included" },
        ],
      },
      {
        group: "Battery & Playback",
        items: [
          { label: "Battery Life (ANC ON)", value: "Up to 30 hours continuous playback" },
          { label: "Battery Life (ANC OFF)", value: "Up to 40 hours continuous playback" },
          {
            label: "Quick Charge",
            value: "3 minutes charging via USB-PD gives up to 3 hours playback",
          },
        ],
      },
      {
        group: "Smart Features",
        items: [
          {
            label: "Voice Quality",
            value: "4 beamforming microphones with AI-based noise reduction",
          },
          {
            label: "Controls",
            value: "Touch sensor volume and playback controls, Speak-to-Chat, Quick Attention mode",
          },
        ],
      },
    ],
  },
  {
    id: "bose-qc-ultra",
    name: "Bose QuietComfort Ultra Headphones",
    brand: "Bose",
    category: "Audio",
    image: headphones,
    retail: 46000,
    specs: [
      { label: "Type", value: "Over-Ear ANC Headphones" },
      { label: "Audio", value: "CustomTune Spatial Audio" },
      { label: "Battery", value: "24 hours" },
    ],
    fullSpecs: [
      {
        group: "Acoustics & Spatial Sound",
        items: [
          { label: "Design", value: "Over-Ear circumaural closed-back wireless headphones" },
          {
            label: "Spatial Audio",
            value: "Bose Immersive Audio with built-in head tracking (Still and Motion modes)",
          },
          {
            label: "Calibration",
            value:
              "CustomTune technology automatically analyzes ear canal geometry to optimize sound",
          },
        ],
      },
      {
        group: "Noise Cancellation",
        items: [
          {
            label: "Modes",
            value: "Quiet Mode (full ANC), Aware Mode with ActiveSense, Immersion Mode",
          },
          {
            label: "Microphones",
            value:
              "Comprehensive multi-microphone beamforming array for noise rejection and voice pickup",
          },
        ],
      },
      {
        group: "Connectivity & Bluetooth",
        items: [
          { label: "Bluetooth", value: "Bluetooth 5.3 with multipoint support" },
          { label: "Audio Codecs", value: "Snapdragon Sound with aptX Adaptive, AAC, SBC" },
          { label: "Wired Input", value: "2.5mm to 3.5mm audio cable included" },
        ],
      },
      {
        group: "Battery Life",
        items: [
          {
            label: "Playback Time",
            value: "Up to 24 hours (up to 18 hours with Immersive Audio enabled)",
          },
          {
            label: "Charging",
            value: "USB-C charging (15-minute quick charge provides up to 2.5 hours of playback)",
          },
        ],
      },
    ],
  },
  {
    id: "apple-airpods-pro-2",
    name: "Apple AirPods Pro 2 (USB-C) Earbuds",
    brand: "Apple",
    category: "Audio",
    image: headphones,
    retail: 29500,
    specs: [
      { label: "Type", value: "Wireless In-Ear ANC Earbuds" },
      { label: "Chip", value: "Apple H2" },
      { label: "Features", value: "Adaptive Audio & Transparency" },
    ],
    fullSpecs: [
      {
        group: "Audio Architecture",
        items: [
          {
            label: "Acoustic Drivers",
            value: "Custom high-excursion Apple driver and high dynamic range amplifier",
          },
          {
            label: "Chipset",
            value: "Apple H2 headphone chip in earbuds; Apple U1 / H2 chip in MagSafe Case",
          },
          {
            label: "Spatial Audio",
            value: "Personalized Spatial Audio with dynamic head tracking",
          },
        ],
      },
      {
        group: "Noise Control",
        items: [
          {
            label: "Active Noise Cancellation",
            value: "Up to 2x more active noise cancellation compared to AirPods Pro (1st gen)",
          },
          {
            label: "Smart Modes",
            value:
              "Adaptive Audio, Transparency mode, Conversation Awareness, Loud Noise Reduction",
          },
        ],
      },
      {
        group: "Battery & Case",
        items: [
          {
            label: "Earbud Playback",
            value: "Up to 6 hours listening time with ANC enabled on a single charge",
          },
          {
            label: "Total with Case",
            value: "Up to 30 hours total listening time with MagSafe Charging Case (USB-C)",
          },
          {
            label: "Charging Options",
            value: "USB-C, Apple Watch charger, MagSafe charger, Qi-certified wireless chargers",
          },
        ],
      },
      {
        group: "Sensors & Durability",
        items: [
          {
            label: "Sensors",
            value:
              "Dual beamforming microphones, inward-facing microphone, skin-detect sensor, motion accelerometer",
          },
          {
            label: "Water Resistance",
            value: "IP54 dust, sweat, and water resistance for both earbuds and case",
          },
        ],
      },
    ],
  },
  {
    id: "samsung-galaxy-buds2-pro",
    name: "Samsung Galaxy Buds2 Pro Earbuds",
    brand: "Samsung",
    category: "Audio",
    image: headphones,
    retail: 18500,
    specs: [
      { label: "Type", value: "Hi-Fi Wireless ANC Earbuds" },
      { label: "Audio", value: "24-bit Hi-Fi Audio" },
      { label: "Water Resistance", value: "IPX7" },
    ],
    fullSpecs: [
      {
        group: "Audio & Speaker",
        items: [
          {
            label: "Speaker System",
            value: "Custom coaxial 2-way speaker (tweeter for crisp highs + woofer for deep bass)",
          },
          {
            label: "Hi-Fi Audio",
            value:
              "24-bit Hi-Fi audio via Samsung Seamless Codec (SSC HiFi) on compatible Galaxy devices",
          },
          {
            label: "3D Audio",
            value:
              "360 Audio with Direct Multi-Channel (5.1ch/7.1ch/Dolby Atmos) and head tracking",
          },
        ],
      },
      {
        group: "Active Noise Cancellation",
        items: [
          {
            label: "ANC Performance",
            value:
              "Intelligent Active Noise Cancellation with 3 high-SNR microphones tracking and filtering background noise",
          },
          {
            label: "Voice Detect",
            value:
              "Instantly switches from ANC to Ambient mode and lowers volume when you begin speaking",
          },
        ],
      },
      {
        group: "Battery & Playback",
        items: [
          {
            label: "Earbuds Playback",
            value: "Up to 5 hours with ANC ON (up to 8 hours with ANC OFF)",
          },
          {
            label: "Total with Case",
            value: "Up to 18 hours with ANC ON (up to 29 hours with ANC OFF)",
          },
          { label: "Charging", value: "USB-C wired charging + Qi wireless charging support" },
        ],
      },
      {
        group: "Connectivity & Ingress",
        items: [
          {
            label: "Bluetooth",
            value: "Bluetooth 5.3 with Auto Switch device pairing across Samsung Galaxy ecosystem",
          },
          {
            label: "Water Resistance",
            value: "IPX7 rated (submersible up to 1 meter in fresh water for up to 30 minutes)",
          },
        ],
      },
    ],
  },
  {
    id: "sony-wf1000xm5",
    name: "Sony WF-1000XM5 ANC Wireless Earbuds",
    brand: "Sony",
    category: "Audio",
    image: headphones,
    retail: 28000,
    specs: [
      { label: "Type", value: "In-Ear ANC Wireless Earbuds" },
      { label: "Drivers", value: "Dynamic Driver X" },
      { label: "Battery", value: "8h + 16h Case" },
    ],
    fullSpecs: [
      {
        group: "Audio Drivers & Processing",
        items: [
          {
            label: "Driver Unit",
            value:
              "Specially designed Dynamic Driver X (8.4mm) with dome-edge separation structure",
          },
          {
            label: "Audio Processors",
            value: "Integrated Processor V2 and HD Noise Cancelling Processor QN2e",
          },
          {
            label: "Hi-Res Audio",
            value: "Hi-Res Audio Wireless with LDAC and DSEE Extreme AI audio upscaling",
          },
        ],
      },
      {
        group: "Noise Cancellation",
        items: [
          {
            label: "Microphones",
            value:
              "3 microphones per earbud (including dual feedback mics) for precise low-frequency noise reduction",
          },
          {
            label: "Earbud Tips",
            value: "Noise Isolation Earbud Tips crafted from polyurethane foam",
          },
        ],
      },
      {
        group: "Battery & Charging",
        items: [
          {
            label: "Battery Life",
            value: "Up to 8 hours (earbuds) + 16 hours (case) = 24 hours total with ANC ON",
          },
          {
            label: "Quick Charging",
            value: "3 minutes of charging provides up to 60 minutes of playback",
          },
          { label: "Wireless Charging", value: "Qi wireless charging enabled charging case" },
        ],
      },
      {
        group: "Connectivity & Sensors",
        items: [
          {
            label: "Bluetooth & Codecs",
            value: "Bluetooth 5.3 (multipoint connection), LDAC, AAC, SBC, LC3",
          },
          {
            label: "Voice Technology",
            value: "Bone conduction sensors and AI-based noise reduction algorithm with DNN",
          },
          { label: "Water Resistance", value: "IPX4 splash and sweat resistance" },
        ],
      },
    ],
  },
  {
    id: "jbl-charge-5",
    name: "JBL Charge 5 Bluetooth Speaker",
    brand: "JBL",
    category: "Audio",
    image: headphones,
    retail: 17500,
    specs: [
      { label: "Type", value: "Portable Bluetooth Speaker" },
      { label: "Power", value: "40W RMS Output" },
      { label: "Battery", value: "20 hours with Powerbank" },
    ],
    fullSpecs: [
      {
        group: "Acoustic Drivers & Power",
        items: [
          {
            label: "Transducers",
            value: "52mm x 90mm racetrack-shaped woofer + separate 20mm dome tweeter",
          },
          { label: "Passive Radiators", value: "Dual side-firing passive bass radiators" },
          {
            label: "Rated Output Power",
            value: "40W RMS total (30W RMS woofer + 10W RMS tweeter)",
          },
          { label: "Frequency Response", value: "60 Hz - 20,000 Hz" },
        ],
      },
      {
        group: "Battery & Power Bank",
        items: [
          { label: "Battery Type", value: "Li-ion polymer 27Wh (equivalent to 3.6V / 7500 mAh)" },
          {
            label: "Playtime",
            value: "Up to 20 hours of music playtime (dependent on volume level and audio content)",
          },
          { label: "Charge Time", value: "4 hours (5V / 3A)" },
          {
            label: "Powerbank Out",
            value: "Built-in USB-A port (5V / 2.0A maximum) to charge smartphones and accessories",
          },
        ],
      },
      {
        group: "Connectivity & Pairing",
        items: [
          { label: "Bluetooth Version", value: "Bluetooth 5.1 (A2DP 1.3, AVRCP 1.6)" },
          {
            label: "Multi-Speaker",
            value: "JBL PartyBoost allows pairing with compatible JBL PartyBoost speakers",
          },
        ],
      },
      {
        group: "Durability & Dimensions",
        items: [
          { label: "Ingress Protection", value: "IP67 waterproof and dustproof certified" },
          { label: "Dimensions & Weight", value: "223 x 96.5 x 94 mm; 0.96 kg (2.11 lbs)" },
        ],
      },
    ],
  },

  // ── Tablets ──
  {
    id: "ipad-pro-11-m2",
    name: 'iPad Pro 11" M2 128GB Wi-Fi',
    brand: "Apple",
    category: "Tablets",
    image: phone,
    retail: 112000,
    specs: [
      { label: "Chip", value: "Apple M2 8-Core" },
      { label: "Display", value: '11" Liquid Retina ProMotion' },
      { label: "Stylus", value: "Apple Pencil (2nd Gen) Hover" },
    ],
    fullSpecs: [
      {
        group: "Display",
        items: [
          {
            label: "Screen Size & Type",
            value: '11.0" Liquid Retina LED-backlit Multi-Touch IPS display',
          },
          { label: "Resolution", value: "2388 x 1668 resolution at 264 pixels per inch (ppi)" },
          {
            label: "Display Tech",
            value:
              "ProMotion 120Hz adaptive refresh, True Tone, P3 wide color gamut, 600 nits max brightness",
          },
        ],
      },
      {
        group: "Processor & Graphics",
        items: [
          { label: "Chipset", value: "Apple M2 chip" },
          { label: "CPU", value: "8-core CPU with 4 performance cores and 4 efficiency cores" },
          { label: "GPU", value: "10-core GPU with 100GB/s memory bandwidth" },
          { label: "Neural Engine", value: "16-core Neural Engine" },
        ],
      },
      {
        group: "Memory & Storage",
        items: [
          { label: "RAM", value: "8GB RAM" },
          { label: "Storage", value: "128GB" },
        ],
      },
      {
        group: "Cameras & Audio",
        items: [
          {
            label: "Rear Camera",
            value: "12MP Wide (f/1.8) + 10MP Ultra-Wide (f/2.4) + LiDAR Scanner",
          },
          { label: "Front Camera", value: "12MP Ultra Wide front camera with Center Stage" },
          { label: "Speakers", value: "Four speaker audio and studio-quality five-mic array" },
        ],
      },
      {
        group: "Accessories & Ports",
        items: [
          {
            label: "Stylus Support",
            value: "Apple Pencil (2nd gen) with Apple Pencil hover feature",
          },
          {
            label: "Keyboard Support",
            value: "Smart Keyboard Folio and Magic Keyboard compatible",
          },
          { label: "Connector", value: "Thunderbolt / USB 4 port (up to 40Gb/s)" },
          { label: "Wireless", value: "Wi-Fi 6E (802.11ax), Bluetooth 5.3" },
        ],
      },
    ],
  },

  // ── Smartwatches ──
  {
    id: "apple-watch-series-9",
    name: "Apple Watch Series 9 45mm GPS",
    brand: "Apple",
    category: "Smartwatches",
    image: phone,
    retail: 52000,
    specs: [
      { label: "Chip", value: "S9 SiP with Double Tap" },
      { label: "Display", value: "2000 nits Always-On Retina" },
      { label: "Health", value: "ECG, Blood Oxygen, Temp Sensing" },
    ],
    fullSpecs: [
      {
        group: "Case & Display",
        items: [
          { label: "Case Size", value: "45mm (396 x 484 pixels, 1143 sq mm display area)" },
          {
            label: "Display Type",
            value: "Always-On Retina LTPO OLED display with edge-to-edge glass",
          },
          {
            label: "Brightness",
            value: "Up to 2000 nits peak brightness; dims to 1 nit in dark environments",
          },
        ],
      },
      {
        group: "Processing & Interaction",
        items: [
          {
            label: "Processor",
            value: "S9 SiP with 64-bit dual-core processor and 4-core Neural Engine",
          },
          {
            label: "Gesture Control",
            value: "Double Tap gesture for one-handed navigation and actions",
          },
          { label: "Storage", value: "64GB internal storage capacity" },
        ],
      },
      {
        group: "Health & Safety Sensors",
        items: [
          {
            label: "Heart Monitoring",
            value: "Electrical heart sensor (ECG app) and third-generation optical heart sensor",
          },
          {
            label: "Vital Tracking",
            value:
              "Blood Oxygen sensor & app, Temperature sensing for ovulation and sleep insights",
          },
          {
            label: "Safety Features",
            value:
              "Emergency SOS, International emergency calling, Fall Detection, Crash Detection",
          },
        ],
      },
      {
        group: "Connectivity & Battery",
        items: [
          {
            label: "Connectivity",
            value: "GPS, Wi-Fi 4 (802.11n), Bluetooth 5.3, Second-generation Ultra Wideband chip",
          },
          {
            label: "Battery Life",
            value: "Up to 18 hours of normal use (up to 36 hours in Low Power Mode)",
          },
          { label: "Charging", value: "Fast magnetic USB-C charging cable" },
          {
            label: "Water Resistance",
            value: "Water resistant 50 meters (swimproof), IP6X dust resistant",
          },
        ],
      },
    ],
  },

  // ── Gaming Consoles ──
  {
    id: "ps5-slim-disc",
    name: "Sony PlayStation 5 Slim Disc Edition",
    brand: "Sony",
    category: "Gaming Consoles",
    image: laptop,
    retail: 68000,
    specs: [
      { label: "Storage", value: "1TB Ultra-High Speed SSD" },
      { label: "Graphics", value: "Ray Tracing 4K 120Hz" },
      { label: "Controller", value: "DualSense Haptic Feedback" },
    ],
    fullSpecs: [
      {
        group: "Processor & Graphics",
        items: [
          {
            label: "CPU",
            value:
              "x86-64-AMD Ryzen Zen 2 (8 Cores / 16 Threads, variable frequency up to 3.5 GHz)",
          },
          {
            label: "GPU",
            value:
              "AMD Radeon RDNA 2-based graphics engine (Ray Tracing Acceleration, up to 2.23 GHz, 10.3 TFLOPS)",
          },
          { label: "System Memory", value: "16GB GDDR6 (448 GB/s bandwidth)" },
        ],
      },
      {
        group: "Storage & Optical Drive",
        items: [
          {
            label: "Internal SSD",
            value: "1TB Custom PCIe Gen 4 NVMe SSD (5.5 GB/s raw read bandwidth)",
          },
          { label: "Expandable Storage", value: "M.2 NVMe SSD slot (PCIe Gen 4 x4 supported)" },
          { label: "Disc Drive", value: "Ultra HD Blu-ray (66G/100G) disc drive up to 4K BD-ROM" },
        ],
      },
      {
        group: "Video & Audio Output",
        items: [
          {
            label: "Video Output",
            value: "HDMI OUT port with support for 4K 120Hz TVs, 8K TVs, VRR (HDMI ver. 2.1)",
          },
          { label: "Audio", value: "Tempest 3D AudioTech" },
        ],
      },
      {
        group: "Input / Output Ports",
        items: [
          {
            label: "Front Ports",
            value: "2x USB Type-C ports (1x 10Gbps SuperSpeed + 1x Hi-Speed USB)",
          },
          {
            label: "Rear Ports",
            value:
              "2x USB Type-A ports (SuperSpeed USB 10Gbps), Gigabit Ethernet (10BASE-T/100BASE-TX/1000BASE-T)",
          },
          { label: "Networking", value: "Wi-Fi 6 (IEEE 802.11 a/b/g/n/ac/ax), Bluetooth 5.1" },
        ],
      },
      {
        group: "Controller",
        items: [
          {
            label: "Included Controller",
            value:
              "DualSense Wireless Controller with Haptic Feedback and Dynamic Adaptive Triggers",
          },
        ],
      },
    ],
  },

  // ── Accessories ──
  {
    id: "apple-magsafe-duo",
    name: "Apple MagSafe Duo Wireless Fast Charger",
    brand: "Apple",
    category: "Accessories",
    image: phone,
    retail: 15000,
    specs: [
      { label: "Type", value: "Dual Wireless Charger" },
      { label: "Compatibility", value: "iPhone & Apple Watch" },
      { label: "Feature", value: "Foldable travel design" },
    ],
    fullSpecs: [
      {
        group: "Compatibility",
        items: [
          {
            label: "iPhone Compatibility",
            value: "iPhone 12, 13, 14, 15, and 16 models with MagSafe",
          },
          {
            label: "Apple Watch Compatibility",
            value: "All Apple Watch models (Case folds up for Nightstand mode)",
          },
          {
            label: "AirPods Compatibility",
            value: "AirPods with Wireless Charging Case / MagSafe Case",
          },
        ],
      },
      {
        group: "Features & Design",
        items: [
          { label: "Form Factor", value: "Foldable, portable dual wireless charging pad" },
          {
            label: "Simultaneous Charging",
            value: "Charges compatible iPhone and Apple Watch concurrently",
          },
        ],
      },
      {
        group: "Technical Requirements",
        items: [
          {
            label: "Recommended Adapter",
            value:
              "20W USB-C Power Adapter (9V/2.22A) for up to 11W wireless charging, or 27W+ Adapter (9V/3A) for up to 14W wireless charging",
          },
          { label: "Included Cable", value: "USB-C to Lightning Cable (1m)" },
        ],
      },
    ],
  },
  {
    id: "anker-737-powerbank",
    name: "Anker 737 Power Bank (PowerCore 24K 140W)",
    brand: "Anker",
    category: "Accessories",
    image: phone,
    retail: 14500,
    specs: [
      { label: "Capacity", value: "24,000mAh" },
      { label: "Output", value: "140W Ultra-Fast PD 3.1" },
      { label: "Display", value: "Smart Digital Screen" },
    ],
    fullSpecs: [
      {
        group: "Battery & Capacity",
        items: [
          { label: "Battery Capacity", value: "24,000 mAh (86.4Wh) high-density multi-cell pack" },
          {
            label: "Airline Compliance",
            value: "Approved for carry-on luggage on commercial flights (< 100Wh)",
          },
        ],
      },
      {
        group: "Power Output & Input",
        items: [
          {
            label: "Max Single Port Output",
            value: "140W ultra-fast charging via USB-C Power Delivery 3.1",
          },
          { label: "Max Total Output", value: "140W multi-device charging distribution" },
          {
            label: "Recharge Speed",
            value:
              "Supports 140W high-speed two-way recharging (recharges in ~52 minutes with compatible 140W charger)",
          },
        ],
      },
      {
        group: "Ports & Display",
        items: [
          {
            label: "Port Configuration",
            value: "2x USB-C ports (PD 3.1 140W max each) + 1x USB-A port (18W max)",
          },
          {
            label: "Smart Digital Display",
            value:
              "Full-color digital screen displaying output/input wattage, battery %, remaining time, and battery health",
          },
          { label: "Safety System", value: "ActiveShield 2.0 real-time temperature monitoring" },
        ],
      },
    ],
  },
  {
    id: "apple-pencil-2",
    name: "Apple Pencil (2nd Generation) Stylus",
    brand: "Apple",
    category: "Accessories",
    image: phone,
    retail: 13500,
    specs: [
      { label: "Type", value: "Active Stylus" },
      { label: "Charging", value: "Magnetic Wireless Pairing" },
      { label: "Compatibility", value: "iPad Pro, Air, Mini" },
    ],
    fullSpecs: [
      {
        group: "Features & Interaction",
        items: [
          {
            label: "Precision & Latency",
            value: "Pixel-perfect precision and industry-leading low latency",
          },
          {
            label: "Sensitivity",
            value: "Pressure and tilt sensitivity for natural drawing and shading",
          },
          {
            label: "Double-Tap Gesture",
            value: "Touch-sensitive surface allows switching tools with a double-tap",
          },
        ],
      },
      {
        group: "Charging & Pairing",
        items: [
          {
            label: "Attachment",
            value: "Attaches magnetically to the side of compatible iPad models",
          },
          {
            label: "Charging Method",
            value: "Automatic wireless pairing and charging while magnetically attached",
          },
        ],
      },
      {
        group: "Compatibility",
        items: [
          {
            label: "Compatible iPads",
            value:
              "iPad Pro 12.9-inch (3rd, 4th, 5th, 6th gen), iPad Pro 11-inch (1st, 2nd, 3rd, 4th gen), iPad Air (4th, 5th gen), iPad mini (6th gen)",
          },
          {
            label: "Dimensions",
            value: "Length: 166 mm (6.53 inches); Diameter: 8.9 mm (0.35 inch); Weight: 20.7 grams",
          },
        ],
      },
    ],
  },

  // ── Home Products ──
  {
    id: "google-nest-hub-2",
    name: "Google Nest Hub (2nd Gen) Smart Home Speaker & Display",
    brand: "Google",
    category: "Home Products",
    image: phone,
    retail: 9500,
    specs: [
      { label: "Display", value: '7" Touchscreen' },
      { label: "Voice", value: "Google Assistant Built-in" },
      { label: "Audio", value: "Full-Range Enhanced Speaker" },
    ],
    fullSpecs: [
      {
        group: "Display & Controls",
        items: [
          { label: "Display Screen", value: '7" LCD Touchscreen (1024 x 600 resolution)' },
          {
            label: "Gesture Sensor",
            value: "Motion Sense Soli radar sensor for Quick Gestures and Sleep Sensing",
          },
          {
            label: "Ambient EQ",
            value:
              "Light sensor dynamically adjusts display color and brightness to match room lighting",
          },
        ],
      },
      {
        group: "Audio & Microphones",
        items: [
          {
            label: "Speaker",
            value:
              "Full-range speaker with 43.5 mm driver (delivers 50% more bass than original Nest Hub)",
          },
          {
            label: "Microphones",
            value: "3 far-field microphones with physical mic mute switch on rear",
          },
          {
            label: "Voice Assistant",
            value: "Google Assistant built-in with on-device machine learning chip",
          },
        ],
      },
      {
        group: "Connectivity & Smart Home",
        items: [
          {
            label: "Wi-Fi & Bluetooth",
            value: "Wi-Fi 802.11b/g/n/ac (2.4 GHz / 5 GHz), Bluetooth 5.0",
          },
          {
            label: "Smart Protocols",
            value: "Built-in Chromecast, Thread border router for Matter device connectivity",
          },
          { label: "Power", value: "15W power adapter with 1.5m cable" },
        ],
      },
    ],
  },
];

export const listings: Listing[] = [
  // ── iPhone 15 Pro ──
  {
    id: "l-1",
    productId: "iphone-15-pro-256",
    conditionScore: 97,
    listedAt: "2026-08-11",
    sellerNote:
      "Bought from Apple Store Dhaka in Nov 2024, used with a case and screen protector from day one. Selling because I upgraded to the 16 Pro. Serial and IMEI shared with the buyer after purchase.",
    inspection: [
      {
        component: "Screen",
        status: "Flawless",
        notes: "Original panel, no burn-in, true tone working",
      },
      { component: "Body / frame", status: "No visible signs of use" },
      { component: "Back panel", status: "No cracks or chips" },
      { component: "Cameras", status: "All lenses clear", notes: "Rear and front tested" },
      { component: "Speaker & mic", status: "Working" },
      { component: "Buttons", status: "All responsive" },
      { component: "Ports & charging", status: "Clean, charges normally" },
      { component: "Battery", status: "98% health", notes: "Cycle count 112" },
      { component: "Connectivity", status: "Wi-Fi, Bluetooth, 5G tested" },
      { component: "Water damage", status: "No indicator triggered" },
      { component: "Activation lock", status: "Removed, signed out" },
      { component: "Network lock", status: "Factory unlocked" },
      { component: "Repairs / replaced parts", status: "None" },
    ],
    price: 95000,
    grade: "A+",
    warrantyMonths: 4,
    invoice: true,
    battery: 98,
    accessories: "Box, cable, charger",
    repairs: "None",
    physical: "No visible signs of use",
    screen: "Flawless, screen protector applied since day one",
    seller: { name: "Rafiq H.", verified: true, rating: 4.9, sales: 23, district: "Dhaka" },
    storeId: "store-apple-vault",
    storeName: "Apple Vault Banani",
    includedItems: ["Device", "Original box", "USB-C charging cable", "20W adapter"],
    deviceVerification: {
      imeiStatus: "clean",
      carrierStatus: "unlocked",
      activationLock: "cleared",
      accountRemoved: true,
      note: "Sample verification data — not live-checked",
    },
    repairHistory: [],
    knownIssues: [],
  },
  {
    id: "l-2",
    productId: "iphone-15-pro-256",
    conditionScore: 89,
    listedAt: "2026-08-09",
    sellerNote:
      "Daily driver for a year, always in a case. Minor frame marks visible only in direct light. Cable included, no box.",
    inspection: [
      { component: "Screen", status: "No visible scratches", notes: "Original panel" },
      { component: "Body / frame", status: "Minor signs of use", notes: "Light marks on frame" },
      { component: "Back panel", status: "No cracks" },
      { component: "Cameras", status: "All lenses clear" },
      { component: "Battery", status: "92% health" },
      { component: "Repairs", status: "None" },
    ],
    price: 88000,
    grade: "A",
    warrantyMonths: 0,
    invoice: true,
    battery: 92,
    accessories: "Cable only",
    repairs: "None",
    physical: "Minor signs of use on frame",
    screen: "No visible scratches",
    seller: { name: "Nusrat T.", verified: true, rating: 4.7, sales: 11, district: "Chattogram" },
    storeId: "store-apple-vault",
    storeName: "Apple Vault Banani",
    includedItems: ["Device", "USB-C cable"],
    deviceVerification: {
      imeiStatus: "clean",
      carrierStatus: "unlocked",
      activationLock: "cleared",
      accountRemoved: true,
      note: "Sample verification data — not live-checked",
    },
    repairHistory: [],
    knownIssues: ["Minor frame marks visible only in direct light"],
  },
  {
    id: "l-3",
    productId: "iphone-15-pro-256",
    conditionScore: 74,
    listedAt: "2026-08-02",
    sellerNote:
      "Screen was replaced at an authorised service centre in 2025 (job sheet available). Corners show scuffs from a drop before the repair. Priced accordingly.",
    inspection: [
      { component: "Screen", status: "Replaced panel, no scratches" },
      { component: "Body / frame", status: "Visible scuffs on corners" },
      { component: "Battery", status: "86% health" },
    ],
    price: 82000,
    grade: "B",
    warrantyMonths: 0,
    invoice: false,
    battery: 86,
    accessories: "Device only",
    repairs: "Screen replaced (official service, 2025)",
    physical: "Visible scuffs on corners",
    screen: "Replaced panel, no scratches",
    seller: { name: "Imran K.", verified: false, rating: 4.4, sales: 6, district: "Sylhet" },
    storeId: "store-pixel-hub",
    storeName: "Pixel & Gadget Hub",
    includedItems: ["Device only"],
    deviceVerification: {
      imeiStatus: "clean",
      carrierStatus: "unlocked",
      activationLock: "cleared",
      accountRemoved: true,
      note: "Sample verification data — not live-checked",
    },
    repairHistory: [
      {
        component: "Display panel",
        type: "official",
        date: "2025",
        evidence: "Authorized service center job sheet available",
      },
    ],
    knownIssues: [
      "Screen replaced at authorized service center",
      "Visible scuffs on corners from prior drop",
    ],
  },

  // ── iPhone 15 128GB ──
  {
    id: "l-15",
    productId: "iphone-15-128",
    conditionScore: 95,
    listedAt: "2026-08-14",
    sellerNote:
      "6 months old, purchased from Gadget & Gear Dhaka. In flawless condition with original box.",
    inspection: [
      { component: "Screen", status: "Flawless" },
      { component: "Body", status: "Like new" },
      { component: "Battery", status: "96% health" },
    ],
    price: 78000,
    grade: "A+",
    warrantyMonths: 6,
    invoice: true,
    battery: 96,
    accessories: "Full box, original cable",
    repairs: "None",
    physical: "Like new",
    screen: "Flawless",
    seller: { name: "Tariqul I.", verified: true, rating: 5.0, sales: 14, district: "Dhaka" },
  },
  {
    id: "l-16",
    productId: "iphone-15-128",
    conditionScore: 88,
    listedAt: "2026-08-08",
    sellerNote: "Carefully used, tiny micro-scratches on side rails. Screen and back are mint.",
    inspection: [
      { component: "Screen", status: "Clean" },
      { component: "Body", status: "Minor micro-scratches on rails" },
      { component: "Battery", status: "91% health" },
    ],
    price: 72000,
    grade: "A",
    warrantyMonths: 2,
    invoice: true,
    battery: 91,
    accessories: "Cable only",
    repairs: "None",
    physical: "Micro-scratches on rails",
    screen: "Clean",
    seller: { name: "Zubair A.", verified: true, rating: 4.8, sales: 9, district: "Khulna" },
  },

  // ── iPhone 14 Pro ──
  {
    id: "l-17",
    productId: "iphone-14-pro-128",
    conditionScore: 92,
    listedAt: "2026-08-10",
    sellerNote:
      "Space Black, pristine condition. Dynamic Island works perfectly, 120Hz display is smooth.",
    inspection: [
      { component: "Screen", status: "Flawless" },
      { component: "Frame", status: "Light polish wear" },
      { component: "Battery", status: "89% health" },
    ],
    price: 84000,
    grade: "A",
    warrantyMonths: 0,
    invoice: true,
    battery: 89,
    accessories: "Box and cable",
    repairs: "None",
    physical: "Excellent",
    screen: "Flawless",
    seller: { name: "Shafiq M.", verified: true, rating: 4.9, sales: 31, district: "Dhaka" },
  },

  // ── Samsung Galaxy S24 Ultra ──
  {
    id: "l-18",
    productId: "samsung-galaxy-s24-ultra",
    conditionScore: 98,
    listedAt: "2026-08-15",
    sellerNote:
      "Titanium Gray. S-Pen included, 9 months Samsung warranty remaining with official invoice.",
    inspection: [
      { component: "Titanium Frame", status: "Mint" },
      { component: "Screen", status: "Flawless Gorilla Armor" },
      { component: "Cameras", status: "5x/10x periscope crystal clear" },
      { component: "Battery", status: "99% health" },
    ],
    price: 122000,
    grade: "A+",
    warrantyMonths: 9,
    invoice: true,
    battery: 99,
    accessories: "Box, S-Pen, 45W Charger",
    repairs: "None",
    physical: "Flawless titanium body",
    screen: "Flawless anti-reflective panel",
    seller: { name: "Arman R.", verified: true, rating: 5.0, sales: 27, district: "Dhaka" },
  },

  // ── Samsung Galaxy S23 FE ──
  {
    id: "l-19",
    productId: "samsung-galaxy-s23-fe",
    conditionScore: 89,
    listedAt: "2026-08-04",
    sellerNote:
      "Mint color. Great phone for photography and everyday tasks. Official warranty active.",
    inspection: [
      { component: "Screen", status: "No scratches" },
      { component: "Back Glass", status: "Flawless" },
      { component: "Battery", status: "94% health" },
    ],
    price: 49000,
    grade: "A",
    warrantyMonths: 3,
    invoice: true,
    battery: 94,
    accessories: "Box, Type-C cable",
    repairs: "None",
    physical: "Minor case rub marks",
    screen: "No scratches",
    seller: { name: "Hasan K.", verified: false, rating: 4.5, sales: 5, district: "Rajshahi" },
  },

  // ── Google Pixel 8 Pro ──
  {
    id: "l-20",
    productId: "google-pixel-8-pro",
    conditionScore: 96,
    listedAt: "2026-08-13",
    sellerNote:
      "Bay Blue. Best camera phone on the market. Running latest Android with 7 years of updates.",
    inspection: [
      { component: "Screen", status: "Flawless Super Actua" },
      { component: "Camera Bar", status: "No scratches" },
      { component: "Battery", status: "97% health" },
    ],
    price: 76000,
    grade: "A+",
    warrantyMonths: 4,
    invoice: true,
    battery: 97,
    accessories: "Box, cable, Google case",
    repairs: "None",
    physical: "Like new",
    screen: "Flawless",
    seller: { name: "Nahid Hasan", verified: true, rating: 4.9, sales: 18, district: "Dhaka" },
  },

  // ── OnePlus 12 ──
  {
    id: "l-21",
    productId: "oneplus-12-256",
    conditionScore: 94,
    listedAt: "2026-08-12",
    sellerNote:
      "Emerald Green. 100W fast charger included (charges to 100% in 26 mins). Hasselblad cameras.",
    inspection: [
      { component: "Display", status: "Flawless 120Hz" },
      { component: "Back Glass", status: "Emerald silk finish, clean" },
      { component: "Battery", status: "96% health" },
    ],
    price: 68000,
    grade: "A+",
    warrantyMonths: 5,
    invoice: true,
    battery: 96,
    accessories: "Box, 100W SUPERVOOC adapter, red cable",
    repairs: "None",
    physical: "Like new",
    screen: "Flawless",
    seller: {
      name: "Anisur Rahman",
      verified: true,
      rating: 4.8,
      sales: 12,
      district: "Chattogram",
    },
  },

  // ── Xiaomi 14 ──
  {
    id: "l-22",
    productId: "xiaomi-14-512",
    conditionScore: 93,
    listedAt: "2026-08-07",
    sellerNote: "Compact powerhouse with 512GB storage and Leica optics. 90W fast charging.",
    inspection: [
      { component: "Screen", status: "Flawless" },
      { component: "Frame", status: "Minor pocket wear" },
      { component: "Cameras", status: "Leica lenses tested" },
    ],
    price: 64000,
    grade: "A",
    warrantyMonths: 3,
    invoice: true,
    battery: 95,
    accessories: "Box, 90W charger, case",
    repairs: "None",
    physical: "Minor pocket wear",
    screen: "Flawless",
    seller: { name: "Rony Chowdhury", verified: false, rating: 4.6, sales: 7, district: "Sylhet" },
  },

  // ── MacBook Air M2 ──
  {
    id: "l-4",
    productId: "macbook-air-m2",
    conditionScore: 90,
    listedAt: "2026-08-12",
    sellerNote:
      "Company-purchased unit, light office use. Original box and 30W adapter included, 6 months of warranty remaining.",
    inspection: [
      { component: "Display", status: "No visible scratches" },
      { component: "Body / chassis", status: "Light wear on palm rest" },
      { component: "Keyboard", status: "All keys working" },
      { component: "Trackpad", status: "Click and gestures normal" },
      { component: "Battery", status: "94% health", notes: "Cycle count 138" },
    ],
    price: 118000,
    grade: "A",
    warrantyMonths: 6,
    invoice: true,
    battery: 94,
    accessories: "Box, 30W adapter",
    repairs: "None",
    physical: "Light wear on palm rest",
    screen: "No visible scratches",
    seller: { name: "Tanvir A.", verified: true, rating: 5, sales: 8, district: "Dhaka" },
    includedItems: [
      "MacBook Air M2",
      "Original box",
      "30W USB-C adapter",
      "USB-C to MagSafe 3 Cable",
    ],
    deviceVerification: {
      imeiStatus: "clean",
      carrierStatus: "unlocked",
      activationLock: "cleared",
      accountRemoved: true,
      note: "Sample verification data — not live-checked",
    },
    repairHistory: [],
    knownIssues: ["Light wear on palm rest"],
  },
  {
    id: "l-5",
    productId: "macbook-air-m2",
    conditionScore: 68,
    listedAt: "2026-07-28",
    sellerNote:
      "Keyboard was replaced last year, works perfectly. There is a dent on the lid corner and two faint screen scratches. Third-party charger included.",
    inspection: [
      { component: "Display", status: "Two faint scratches" },
      { component: "Body / chassis", status: "Dent on lid corner" },
      { component: "Battery", status: "88% health" },
    ],
    price: 104000,
    grade: "B",
    warrantyMonths: 0,
    invoice: false,
    battery: 88,
    accessories: "Third-party charger",
    repairs: "Keyboard replaced",
    physical: "Dent on lid corner",
    screen: "Two faint scratches",
    seller: { name: "Sabbir R.", verified: false, rating: 4.2, sales: 3, district: "Rajshahi" },
  },

  // ── MacBook Pro 14" M3 ──
  {
    id: "l-23",
    productId: "macbook-pro-14-m3",
    conditionScore: 99,
    listedAt: "2026-08-16",
    sellerNote:
      "Space Black. Barely used, battery cycle count only 24. AppleCare+ valid for 18 months.",
    inspection: [
      { component: "Display", status: "Flawless Liquid Retina XDR" },
      { component: "Chassis", status: "Pristine Space Black" },
      { component: "Battery", status: "100% health", notes: "Cycle count 24" },
    ],
    price: 188000,
    grade: "A+",
    warrantyMonths: 18,
    invoice: true,
    battery: 100,
    accessories: "Full original box, 70W MagSafe charger",
    repairs: "None",
    physical: "Mint condition",
    screen: "Flawless",
    seller: { name: "Faisal Mahmud", verified: true, rating: 5.0, sales: 42, district: "Dhaka" },
    includedItems: [
      'MacBook Pro 14"',
      "Original box",
      "70W USB-C power adapter",
      "USB-C to MagSafe 3 Cable (Space Black)",
    ],
    deviceVerification: {
      imeiStatus: "clean",
      carrierStatus: "unlocked",
      activationLock: "cleared",
      accountRemoved: true,
      note: "Sample verification data — not live-checked",
    },
    repairHistory: [],
    knownIssues: [],
  },

  // ── Dell XPS 15 ──
  {
    id: "l-24",
    productId: "dell-xps-15-9530",
    conditionScore: 92,
    listedAt: "2026-08-09",
    sellerNote:
      "Stunning 3.5K OLED touchscreen, RTX 4050 graphics. Ideal for video editing and 3D rendering.",
    inspection: [
      { component: "OLED Screen", status: "Flawless, no burn-in" },
      { component: "Keyboard & Trackpad", status: "Smooth" },
      { component: "Thermals", status: "Cleaned and repasted" },
    ],
    price: 155000,
    grade: "A",
    warrantyMonths: 4,
    invoice: true,
    battery: 92,
    accessories: "Original 130W USB-C charger",
    repairs: "None",
    physical: "Clean aluminum and carbon deck",
    screen: "Flawless OLED",
    seller: { name: "Shahriar Ahmed", verified: true, rating: 4.9, sales: 16, district: "Dhaka" },
  },

  // ── Dell Latitude 7420 ──
  {
    id: "l-25",
    productId: "dell-latitude-7420",
    conditionScore: 84,
    listedAt: "2026-08-01",
    sellerNote:
      "Corporate business laptop, very lightweight and reliable. Good battery backup (6-7 hours).",
    inspection: [
      { component: "Display", status: "FHD Matte, no spots" },
      { component: "Body", status: "Normal palmrest rub marks" },
      { component: "Battery", status: "87% health" },
    ],
    price: 48000,
    grade: "B",
    warrantyMonths: 1,
    invoice: true,
    battery: 87,
    accessories: "Dell 65W Type-C adapter",
    repairs: "None",
    physical: "Light cosmetic signs of use",
    screen: "Clean",
    seller: { name: "Kamrul Islam", verified: true, rating: 4.7, sales: 22, district: "Khulna" },
  },

  // ── HP EliteBook 840 G9 ──
  {
    id: "l-26",
    productId: "hp-elitebook-840-g9",
    conditionScore: 91,
    listedAt: "2026-08-06",
    sellerNote: "12th Gen Core i5 with 16GB DDR5 RAM. Bang & Olufsen sound, backlit keyboard.",
    inspection: [
      { component: "Screen", status: "Clean 16:10 panel" },
      { component: "Chassis", status: "Silver aluminum, very clean" },
      { component: "Battery", status: "93% health" },
    ],
    price: 54000,
    grade: "A",
    warrantyMonths: 3,
    invoice: true,
    battery: 93,
    accessories: "Original HP charger",
    repairs: "None",
    physical: "Very clean",
    screen: "Clean",
    seller: {
      name: "Enamul Hoque",
      verified: true,
      rating: 4.8,
      sales: 15,
      district: "Chattogram",
    },
  },

  // ── Lenovo ThinkPad X1 Carbon ──
  {
    id: "l-27",
    productId: "lenovo-thinkpad-x1-carbon",
    conditionScore: 94,
    listedAt: "2026-08-11",
    sellerNote: "Legendary ThinkPad keyboard and durability. Featherlight 1.1kg carbon body.",
    inspection: [
      { component: "Screen", status: "FHD+ Low Power IPS, flawless" },
      { component: "Keyboard", status: "Crisp and responsive" },
      { component: "Battery", status: "95% health" },
    ],
    price: 98000,
    grade: "A+",
    warrantyMonths: 6,
    invoice: true,
    battery: 95,
    accessories: "Box, 65W GaN charger",
    repairs: "None",
    physical: "Like new matte finish",
    screen: "Flawless",
    seller: { name: "Saiful Bari", verified: true, rating: 5.0, sales: 19, district: "Dhaka" },
  },

  // ── ASUS ZenBook 14 OLED ──
  {
    id: "l-28",
    productId: "asus-zenbook-14-oled",
    conditionScore: 96,
    listedAt: "2026-08-14",
    sellerNote:
      "Latest Intel Core Ultra with AI Boost. 3K 120Hz OLED screen is unbelievable. 10 months warranty.",
    inspection: [
      { component: "OLED Screen", status: "Flawless 120Hz" },
      { component: "Chassis", status: "Ponder Blue, pristine" },
      { component: "Battery", status: "98% health" },
    ],
    price: 108000,
    grade: "A+",
    warrantyMonths: 10,
    invoice: true,
    battery: 98,
    accessories: "Full box, sleeve, 65W charger",
    repairs: "None",
    physical: "Like new",
    screen: "Flawless",
    seller: { name: "Mahfuzur Rahman", verified: true, rating: 4.9, sales: 8, district: "Dhaka" },
  },

  // ── Fujifilm X100V ──
  {
    id: "l-6",
    productId: "fuji-x100v",
    conditionScore: 96,
    listedAt: "2026-08-13",
    sellerNote:
      "Barely used travel camera, shutter count 4,120. Box, strap and two batteries included. Two months of shop warranty left.",
    inspection: [
      { component: "Body", status: "As new, no marks" },
      { component: "Lens", status: "Clear, no fungus or dust" },
      { component: "Shutter count", status: "4,120 actuations" },
      { component: "Screen / EVF", status: "Flawless" },
    ],
    price: 152000,
    grade: "A+",
    warrantyMonths: 2,
    invoice: true,
    accessories: "Box, strap, 2 batteries",
    repairs: "None",
    physical: "As new, shutter count 4,120",
    screen: "Flawless",
    seller: { name: "Farhana S.", verified: true, rating: 4.8, sales: 15, district: "Dhaka" },
  },

  // ── Sony Alpha A7 IV ──
  {
    id: "l-29",
    productId: "sony-a7-iv",
    conditionScore: 95,
    listedAt: "2026-08-12",
    sellerNote:
      "Shutter count only 6,300. Sensor clean, used only for studio photography. Box and 2 original batteries.",
    inspection: [
      { component: "Sensor", status: "Clean, no spots" },
      { component: "Shutter count", status: "6,300 actuations" },
      { component: "Mount", status: "E-Mount clean" },
      { component: "Buttons & Dials", status: "All responsive" },
    ],
    price: 185000,
    grade: "A+",
    warrantyMonths: 4,
    invoice: true,
    accessories: "Box, strap, 2 NP-FZ100 batteries, dual charger",
    repairs: "None",
    physical: "Like new",
    screen: "Flawless with protector",
    seller: { name: "Tanmoy Studio", verified: true, rating: 5.0, sales: 38, district: "Dhaka" },
  },

  // ── Canon EOS R6 Mark II ──
  {
    id: "l-30",
    productId: "canon-eos-r6-mark-ii",
    conditionScore: 94,
    listedAt: "2026-08-10",
    sellerNote:
      "Outstanding wedding and sports camera. 40fps burst, incredible autofocus. Low shutter count.",
    inspection: [
      { component: "Sensor", status: "Flawless" },
      { component: "Shutter", status: "Under 8,000 actuations" },
      { component: "EVF / LCD", status: "Crystal clear" },
    ],
    price: 205000,
    grade: "A+",
    warrantyMonths: 6,
    invoice: true,
    accessories: "Box, strap, LP-E6NH battery, charger",
    repairs: "None",
    physical: "Like new",
    screen: "Flawless",
    seller: { name: "Shakil A.", verified: true, rating: 4.9, sales: 21, district: "Chattogram" },
  },

  // ── Nikon Z6 II ──
  {
    id: "l-31",
    productId: "nikon-z6-ii",
    conditionScore: 89,
    listedAt: "2026-08-05",
    sellerNote:
      "Full-frame mirrorless. Minor paint wear on baseplate from tripod mount. Everything works 100%.",
    inspection: [
      { component: "Sensor", status: "Clean" },
      { component: "Baseplate", status: "Light tripod scuff" },
      { component: "Autofocus", status: "Tested with Z and F mount lenses" },
    ],
    price: 128000,
    grade: "A",
    warrantyMonths: 0,
    invoice: true,
    accessories: "Box, battery, charger, 64GB CFexpress card",
    repairs: "None",
    physical: "Minor baseplate scuff",
    screen: "Protected with tempered glass",
    seller: {
      name: "Arif Photography",
      verified: true,
      rating: 4.7,
      sales: 17,
      district: "Sylhet",
    },
  },

  // ── Sony WH-1000XM5 ──
  {
    id: "l-7",
    productId: "sony-wh1000xm5",
    conditionScore: 88,
    listedAt: "2026-08-06",
    sellerNote:
      "Used for commuting, kept in the case. Slight creasing on the ear pads, everything else is as new. Case and cable included.",
    inspection: [
      { component: "Ear pads", status: "Minor creasing" },
      { component: "Drivers", status: "Both channels clear" },
      { component: "ANC", status: "Working normally" },
      { component: "Battery", status: "Holds full day charge" },
    ],
    price: 27500,
    grade: "A",
    warrantyMonths: 3,
    invoice: true,
    accessories: "Case, cable",
    repairs: "None",
    physical: "Minor ear-pad creasing",
    screen: "N/A",
    seller: { name: "Mahin C.", verified: true, rating: 4.6, sales: 19, district: "Khulna" },
  },

  // ── Bose QuietComfort Ultra ──
  {
    id: "l-32",
    productId: "bose-qc-ultra",
    conditionScore: 97,
    listedAt: "2026-08-14",
    sellerNote: "Black. Incredible comfort and ANC. Only 2 months old with box and carrying case.",
    inspection: [
      { component: "Ear cushions", status: "Plush, like new" },
      { component: "Spatial Audio", status: "Immersive mode working" },
      { component: "Battery", status: "24h tested" },
    ],
    price: 33500,
    grade: "A+",
    warrantyMonths: 8,
    invoice: true,
    accessories: "Original carry case, audio cable, charging cable",
    repairs: "None",
    physical: "Like new",
    screen: "N/A",
    seller: { name: "Sadman Sakib", verified: true, rating: 5.0, sales: 11, district: "Dhaka" },
  },

  // ── Apple AirPods Pro 2 ──
  {
    id: "l-33",
    productId: "apple-airpods-pro-2",
    conditionScore: 95,
    listedAt: "2026-08-13",
    sellerNote:
      "USB-C MagSafe case version. Sanitized and cleaned thoroughly. All ear tip sizes included.",
    inspection: [
      { component: "Drivers & Mics", status: "Tested and clear" },
      { component: "ANC & Transparency", status: "Working perfectly" },
      { component: "Charging Case", status: "Clean, charges normally" },
    ],
    price: 21500,
    grade: "A+",
    warrantyMonths: 5,
    invoice: true,
    accessories: "Box, unused ear tips, braided cable",
    repairs: "None",
    physical: "Very clean",
    screen: "N/A",
    seller: { name: "Tahmid Khan", verified: true, rating: 4.9, sales: 25, district: "Dhaka" },
  },

  // ── Samsung Galaxy Buds2 Pro ──
  {
    id: "l-34",
    productId: "samsung-galaxy-buds2-pro",
    conditionScore: 91,
    listedAt: "2026-08-08",
    sellerNote: "Graphite color. 24-bit Hi-Fi sound and seamless Samsung ecosystem connectivity.",
    inspection: [
      { component: "Sound", status: "Crisp and punchy bass" },
      { component: "Case", status: "Matte finish intact" },
      { component: "Battery", status: "Tested normal" },
    ],
    price: 12500,
    grade: "A",
    warrantyMonths: 2,
    invoice: true,
    accessories: "Box, charging cable, extra tips",
    repairs: "None",
    physical: "Light case scuffs",
    screen: "N/A",
    seller: { name: "Mehedi Hasan", verified: false, rating: 4.6, sales: 6, district: "Rajshahi" },
  },

  // ── Sony WF-1000XM5 ──
  {
    id: "l-35",
    productId: "sony-wf1000xm5",
    conditionScore: 94,
    listedAt: "2026-08-11",
    sellerNote: "Silver/Platinum. Best ANC earbuds on the market. Multi-point Bluetooth tested.",
    inspection: [
      { component: "Drivers", status: "Dynamic Driver X working" },
      { component: "Noise Cancelling", status: "Tested in traffic" },
      { component: "Battery", status: "Holds 8 hours" },
    ],
    price: 19500,
    grade: "A+",
    warrantyMonths: 4,
    invoice: true,
    accessories: "Box, noise isolation foam tips",
    repairs: "None",
    physical: "Like new",
    screen: "N/A",
    seller: { name: "Rashedul A.", verified: true, rating: 4.8, sales: 13, district: "Dhaka" },
  },

  // ── JBL Charge 5 ──
  {
    id: "l-36",
    productId: "jbl-charge-5",
    conditionScore: 90,
    listedAt: "2026-08-07",
    sellerNote:
      "Squad/Camo color. Huge bass, waterproof, and charges phones via built-in USB powerbank.",
    inspection: [
      { component: "Speakers", status: "Dual passive radiators intact" },
      { component: "Battery", status: "20h playtime tested" },
      { component: "Waterproof seal", status: "Tight and undamaged" },
    ],
    price: 12000,
    grade: "A",
    warrantyMonths: 0,
    invoice: true,
    accessories: "USB-C cable",
    repairs: "None",
    physical: "Minor rubber bumper marks",
    screen: "N/A",
    seller: { name: "Sayeed Ahmed", verified: true, rating: 4.7, sales: 9, district: "Sylhet" },
  },

  // ── iPad Pro 11" M2 ──
  {
    id: "l-37",
    productId: "ipad-pro-11-m2",
    conditionScore: 97,
    listedAt: "2026-08-15",
    sellerNote:
      "Space Gray. Used for digital art and note taking. Screen protector on since unboxing.",
    inspection: [
      { component: "Display", status: "120Hz ProMotion, flawless" },
      { component: "Body", status: "No bends or corner dings" },
      { component: "Battery", status: "96% health" },
    ],
    price: 84000,
    grade: "A+",
    warrantyMonths: 5,
    invoice: true,
    battery: 96,
    accessories: "Box, 20W USB-C charger, magnetic case",
    repairs: "None",
    physical: "Flawless",
    screen: "Flawless",
    seller: { name: "Junaid Chowdhury", verified: true, rating: 5.0, sales: 16, district: "Dhaka" },
  },

  // ── Apple Watch Series 9 ──
  {
    id: "l-38",
    productId: "apple-watch-series-9",
    conditionScore: 96,
    listedAt: "2026-08-14",
    sellerNote: "Midnight Aluminum 45mm. Double-tap gesture enabled. Battery health 99%.",
    inspection: [
      { component: "Glass", status: "Flawless, no scratches" },
      { component: "Sensors", status: "Heart rate & ECG tested" },
      { component: "Battery", status: "99% health" },
    ],
    price: 36000,
    grade: "A+",
    warrantyMonths: 6,
    invoice: true,
    battery: 99,
    accessories: "Box, original Midnight Sport Band, magnetic fast charger",
    repairs: "None",
    physical: "Like new",
    screen: "Flawless",
    seller: { name: "Munir Uddin", verified: true, rating: 4.9, sales: 20, district: "Dhaka" },
  },

  // ── PS5 Slim Disc ──
  {
    id: "l-39",
    productId: "ps5-slim-disc",
    conditionScore: 98,
    listedAt: "2026-08-16",
    sellerNote:
      "1TB Disc Edition. Includes 2 DualSense controllers and HDMI 2.1 cable. Only 3 months used.",
    inspection: [
      { component: "Disc Drive", status: "Reads 4K Blu-ray smoothly" },
      { component: "Thermals", status: "Quiet fans" },
      { component: "Controllers", status: "No stick drift, tested" },
    ],
    price: 52000,
    grade: "A+",
    warrantyMonths: 8,
    invoice: true,
    accessories: "Box, 2 DualSense controllers, HDMI cable, power cord",
    repairs: "None",
    physical: "Mint",
    screen: "N/A",
    seller: { name: "Shakawat Hossain", verified: true, rating: 5.0, sales: 34, district: "Dhaka" },
  },

  // ── Apple MagSafe Duo ──
  {
    id: "l-40",
    productId: "apple-magsafe-duo",
    conditionScore: 97,
    listedAt: "2026-08-16",
    sellerNote:
      "Original Apple MagSafe Duo Charger. Minimal use, charges both iPhone and Watch fast.",
    inspection: [
      { component: "Coils", status: "Charges iPhone & Apple Watch simultaneously" },
      { component: "Hinge", status: "Firm, like new" },
      { component: "Cable", status: "Original USB-C to Lightning included" },
    ],
    price: 9500,
    grade: "A+",
    warrantyMonths: 3,
    invoice: true,
    accessories: "Box, original cable",
    repairs: "None",
    physical: "Like new",
    screen: "N/A",
    seller: { name: "Tanvir Ahmed", verified: true, rating: 4.9, sales: 15, district: "Dhaka" },
  },

  // ── Anker 737 Power Bank ──
  {
    id: "l-41",
    productId: "anker-737-powerbank",
    conditionScore: 96,
    listedAt: "2026-08-17",
    sellerNote:
      "24,000mAh 140W beast. Charges MacBook Pro and phones simultaneously. Smart screen working 100%.",
    inspection: [
      { component: "Display", status: "OLED screen crisp and bright" },
      { component: "Ports", status: "2x USB-C 140W + 1x USB-A tested" },
      { component: "Battery", status: "100% capacity" },
    ],
    price: 9800,
    grade: "A+",
    warrantyMonths: 6,
    invoice: true,
    accessories: "Box, 140W USB-C cable, travel pouch",
    repairs: "None",
    physical: "Mint",
    screen: "Flawless",
    seller: {
      name: "Rezaul Karim",
      verified: true,
      rating: 4.8,
      sales: 12,
      district: "Chattogram",
    },
  },

  // ── Apple Pencil 2 ──
  {
    id: "l-42",
    productId: "apple-pencil-2",
    conditionScore: 98,
    listedAt: "2026-08-18",
    sellerNote:
      "Apple Pencil 2nd Generation. Used occasionally for note-taking with iPad Pro. Tip is clean.",
    inspection: [
      { component: "Tip", status: "Original tip, zero wear" },
      { component: "Bluetooth", status: "Instant magnetic pairing" },
      { component: "Double-tap", status: "Responsive gesture" },
    ],
    price: 8900,
    grade: "A+",
    warrantyMonths: 3,
    invoice: true,
    accessories: "Box and manuals",
    repairs: "None",
    physical: "Like new",
    screen: "N/A",
    seller: { name: "Nafis Imtiaz", verified: true, rating: 5.0, sales: 9, district: "Sylhet" },
  },

  // ── Google Nest Hub 2 ──
  {
    id: "l-43",
    productId: "google-nest-hub-2",
    conditionScore: 95,
    listedAt: "2026-08-18",
    sellerNote:
      "Chalk color. Great smart speaker and bedtime sleep tracker. Clean display and full bass.",
    inspection: [
      { component: "Screen", status: "No dead pixels, bright" },
      { component: "Speaker", status: "Deep bass, loud and clear" },
      { component: "Mics", status: "Far-field mics tested" },
    ],
    price: 6200,
    grade: "A",
    warrantyMonths: 3,
    invoice: true,
    accessories: "Original power adapter",
    repairs: "None",
    physical: "Excellent",
    screen: "Clean",
    seller: { name: "Faisal Mahmud", verified: true, rating: 4.9, sales: 18, district: "Dhaka" },
  },
];

export const taka = (n: number) => `৳${n.toLocaleString("en-US")}`;

export const listingsFor = (productId: string) =>
  listings.filter((l) => l.productId === productId).sort((a, b) => a.price - b.price);

export const productFor = (id: string) => products.find((p) => p.id === id);

export const cheapest = (productId: string) => listingsFor(productId)[0] as Listing | undefined;
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

export const listingFor = (id: string) => listings.find((l) => l.id === id);
