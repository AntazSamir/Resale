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
    id: "fuji-x100v",
    name: "Fujifilm X100V",
    brand: "Fujifilm",
    category: "Cameras",
    image: camera,
    retail: 198000,
    specs: [
      { label: "Sensor", value: "26.1MP APS-C" },
      { label: "Lens", value: "23mm f/2" },
      { label: "Shutter count", value: "Reported per listing" },
    ],
  },
  {
    id: "sony-wh1000xm5",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Audio",
    image: headphones,
    retail: 42000,
    specs: [
      { label: "Type", value: "Over-ear ANC" },
      { label: "Battery", value: "30h playback" },
      { label: "Codec", value: "LDAC" },
    ],
  },
];

export const listings: Listing[] = [
  {
    id: "l-1",
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
    productId: "iphone-15-pro-256",
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
    conditionScore: 89,
    listedAt: "2026-08-09",
    sellerNote:
      "Daily driver for a year, always in a case. Minor frame marks visible only in direct light. Cable included, no box.",
    inspection: [
      { component: "Screen", status: "No visible scratches", notes: "Original panel" },
      {
        component: "Body / frame",
        status: "Minor signs of use",
        notes: "Light marks on the stainless frame",
      },
      { component: "Back panel", status: "No cracks" },
      { component: "Cameras", status: "All lenses clear" },
      { component: "Speaker & mic", status: "Working" },
      { component: "Buttons", status: "All responsive" },
      { component: "Ports & charging", status: "Working" },
      { component: "Battery", status: "92% health" },
      { component: "Connectivity", status: "Wi-Fi, Bluetooth, 5G tested" },
      { component: "Water damage", status: "No indicator triggered" },
      { component: "Activation lock", status: "Removed" },
      { component: "Network lock", status: "Factory unlocked" },
      { component: "Repairs / replaced parts", status: "None" },
    ],
    productId: "iphone-15-pro-256",
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
    conditionScore: 74,
    listedAt: "2026-08-02",
    sellerNote:
      "Screen was replaced at an authorised service centre in 2025 (job sheet available). Corners show scuffs from a drop before the repair. Priced accordingly.",
    inspection: [
      {
        component: "Screen",
        status: "Replaced panel, no scratches",
        notes: "Official service replacement, Mar 2025",
      },
      {
        component: "Body / frame",
        status: "Visible scuffs on corners",
        notes: "From a drop, no bends",
      },
      { component: "Back panel", status: "Hairline scratch, no crack" },
      { component: "Cameras", status: "Clear, no dust" },
      { component: "Speaker & mic", status: "Working" },
      { component: "Buttons", status: "All responsive" },
      { component: "Ports & charging", status: "Working", notes: "Lint cleaned" },
      { component: "Battery", status: "86% health" },
      { component: "Connectivity", status: "Wi-Fi, Bluetooth, 5G tested" },
      { component: "Water damage", status: "No indicator triggered" },
      { component: "Activation lock", status: "Removed" },
      { component: "Network lock", status: "Factory unlocked" },
      {
        component: "Repairs / replaced parts",
        status: "Screen replaced (official)",
        notes: "Invoice not available",
      },
    ],
    productId: "iphone-15-pro-256",
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
  {
    id: "l-4",
    conditionScore: 90,
    listedAt: "2026-08-12",
    sellerNote:
      "Company-purchased unit, light office use. Original box and 30W adapter included, 6 months of warranty remaining.",
    inspection: [
      { component: "Display", status: "No visible scratches" },
      { component: "Body / chassis", status: "Light wear on palm rest" },
      { component: "Keyboard", status: "All keys working" },
      { component: "Trackpad", status: "Click and gestures normal" },
      { component: "Speakers & mic", status: "Working" },
      { component: "Ports & charging", status: "Both USB-C and MagSafe tested" },
      { component: "Battery", status: "94% health", notes: "Cycle count 138" },
      { component: "Storage / RAM", status: "256GB SSD, 8GB — as specified" },
      { component: "Performance", status: "Normal thermals under load" },
      { component: "Connectivity", status: "Wi-Fi 6, Bluetooth tested" },
      { component: "Water damage", status: "None" },
      { component: "Repairs / replaced parts", status: "None" },
    ],
    productId: "macbook-air-m2",
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
    conditionScore: 68,
    listedAt: "2026-07-28",
    sellerNote:
      "Keyboard was replaced last year, works perfectly. There is a dent on the lid corner and two faint screen scratches — photographed honestly. Third-party charger only.",
    inspection: [
      { component: "Display", status: "Two faint scratches", notes: "Visible when screen is off" },
      { component: "Body / chassis", status: "Dent on lid corner" },
      {
        component: "Keyboard",
        status: "Replaced, all keys working",
        notes: "Third-party service, 2025",
      },
      { component: "Trackpad", status: "Click and gestures normal" },
      { component: "Speakers & mic", status: "Working" },
      {
        component: "Ports & charging",
        status: "Working",
        notes: "Third-party 65W charger included",
      },
      { component: "Battery", status: "88% health" },
      { component: "Storage / RAM", status: "256GB SSD, 8GB" },
      { component: "Performance", status: "Normal" },
      { component: "Connectivity", status: "Wi-Fi 6, Bluetooth tested" },
      { component: "Water damage", status: "None" },
      { component: "Repairs / replaced parts", status: "Keyboard replaced", notes: "No invoice" },
    ],
    productId: "macbook-air-m2",
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
  {
    id: "l-6",
    conditionScore: 96,
    listedAt: "2026-08-13",
    sellerNote:
      "Barely used travel camera, shutter count 4,120. Box, strap and two batteries included. Two months of shop warranty left.",
    inspection: [
      { component: "Body", status: "As new, no marks" },
      { component: "Lens", status: "Clear, no fungus or dust" },
      { component: "Shutter count", status: "4,120 actuations" },
      { component: "Sensor", status: "No dust spots", notes: "Test shots available" },
      { component: "Screen / EVF", status: "Flawless" },
      { component: "Dials & buttons", status: "All responsive" },
      { component: "Ports & charging", status: "USB-C charging tested" },
      { component: "Batteries", status: "2 included, both hold charge" },
      { component: "Connectivity", status: "Wi-Fi, Bluetooth tested" },
      { component: "Water damage", status: "None" },
      { component: "Repairs / replaced parts", status: "None" },
    ],
    productId: "fuji-x100v",
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
  {
    id: "l-7",
    conditionScore: 88,
    listedAt: "2026-08-06",
    sellerNote:
      "Used for commuting, kept in the case. Slight creasing on the ear pads, everything else is as new. Case and cable included.",
    inspection: [
      { component: "Ear pads", status: "Minor creasing" },
      { component: "Headband", status: "No cracks or peeling" },
      { component: "Drivers", status: "Both channels clear" },
      { component: "ANC", status: "Working normally" },
      { component: "Microphones", status: "Call quality tested" },
      { component: "Buttons / touch controls", status: "All responsive" },
      { component: "Ports & charging", status: "USB-C charging tested" },
      { component: "Battery", status: "Holds a full-day charge" },
      { component: "Connectivity", status: "Bluetooth multipoint tested" },
      { component: "Water damage", status: "None" },
      { component: "Repairs / replaced parts", status: "None" },
    ],
    productId: "sony-wh1000xm5",
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
];

export const taka = (n: number) => `৳${n.toLocaleString("en-US")}`;

export const listingsFor = (productId: string) =>
  listings.filter((l) => l.productId === productId).sort((a, b) => a.price - b.price);

export const productFor = (id: string) => products.find((p) => p.id === id);

export const cheapest = (productId: string) => listingsFor(productId)[0] as Listing;
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
