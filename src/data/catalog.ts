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

export type InspectionItem = { component: string; status: string; notes?: string };

export type GalleryShot = { label: string; position: string };

export type Listing = {
  id: string;
  productId: string;
  conditionScore: number;
  inspection: InspectionItem[];
  sellerNote: string;
  listedAt: string;
  price: number;
  grade: Grade;
  warrantyMonths: number;
  invoice: boolean;
  battery?: number;
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
  };
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  retail: number;
  specs: { label: string; value: string }[];
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
