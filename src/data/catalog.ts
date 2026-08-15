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

export type Listing = {
  id: string;
  productId: string;
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
      { label: "Display", value: "6.1\" Super Retina XDR" },
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
      { label: "Display", value: "13.6\" Liquid Retina" },
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

export const cheapest = (productId: string) => listingsFor(productId)[0];