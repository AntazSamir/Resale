import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://taqsfmxkiznbjyxbmbge.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY || "sb_publishable_yX2oOIHAzCMGLeazCCb9vg_ev_XaoDc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. Initial Users
const users = [
  {
    id: "u-admin",
    phone: "01700000000",
    name: "Admin User",
    nid_number: "199526920199201",
    role: "ADMIN",
    verified: true,
    created_at: new Date("2026-01-01").toISOString(),
  },
  {
    id: "u-1",
    phone: "01711111111",
    name: "Rafiq H.",
    nid_number: "199526920199202",
    role: "SELLER",
    verified: true,
    created_at: new Date("2026-01-15").toISOString(),
  },
  {
    id: "u-2",
    phone: "01722222222",
    name: "Nusrat T.",
    nid_number: "199526920199203",
    role: "SELLER",
    verified: true,
    created_at: new Date("2026-02-01").toISOString(),
  },
  {
    id: "u-3",
    phone: "01733333333",
    name: "Imran K.",
    nid_number: "199526920199204",
    role: "SELLER",
    verified: false,
    created_at: new Date("2026-02-10").toISOString(),
  },
];

// 2. Comprehensive Products Catalog
const products = [
  // ── Smartphones ──
  {
    id: "iphone-15-pro-256",
    name: "iPhone 15 Pro 256GB",
    brand: "Apple",
    category: "Smartphones",
    image: "/src/assets/p-phone.jpg",
    retail_price_poisha: 14500000,
    specs_json: [
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
    image: "/src/assets/p-phone.jpg",
    retail_price_poisha: 11200000,
    specs_json: [
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
    image: "/src/assets/p-phone.jpg",
    retail_price_poisha: 12500000,
    specs_json: [
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
    image: "/src/assets/p-phone.jpg",
    retail_price_poisha: 16200000,
    specs_json: [
      { label: "Storage", value: "256GB" },
      { label: "RAM", value: "12GB" },
      { label: "Display", value: '6.8" Dynamic AMOLED 2X' },
      { label: "Stylus", value: "Embedded S Pen" },
    ],
  },
  {
    id: "google-pixel-8-pro",
    name: "Google Pixel 8 Pro 128GB",
    brand: "Google",
    category: "Smartphones",
    image: "/src/assets/p-phone.jpg",
    retail_price_poisha: 10800000,
    specs_json: [
      { label: "Storage", value: "128GB" },
      { label: "Display", value: '6.7" Super Actua' },
      { label: "Chip", value: "Google Tensor G3" },
    ],
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12 256GB",
    brand: "OnePlus",
    category: "Smartphones",
    image: "/src/assets/p-phone.jpg",
    retail_price_poisha: 9200000,
    specs_json: [
      { label: "Storage", value: "256GB" },
      { label: "RAM", value: "12GB" },
      { label: "Chip", value: "Snapdragon 8 Gen 3" },
      { label: "Charging", value: "100W SUPERVOOC" },
    ],
  },
  {
    id: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra 512GB",
    brand: "Xiaomi",
    category: "Smartphones",
    image: "/src/assets/p-phone.jpg",
    retail_price_poisha: 13500000,
    specs_json: [
      { label: "Storage", value: "512GB" },
      { label: "RAM", value: "16GB" },
      { label: "Camera", value: '1" Leica Quad Lens' },
    ],
  },

  // ── Laptops ──
  {
    id: "macbook-air-m2",
    name: 'MacBook Air 13.6" M2 8/256',
    brand: "Apple",
    category: "Laptops",
    image: "/src/assets/p-laptop.jpg",
    retail_price_poisha: 13800000,
    specs_json: [
      { label: "Chip", value: "Apple M2 (8-core CPU / 8-core GPU)" },
      { label: "RAM", value: "8GB Unified" },
      { label: "SSD", value: "256GB NVMe" },
      { label: "Display", value: '13.6" Liquid Retina' },
    ],
  },
  {
    id: "macbook-pro-14-m3-pro",
    name: 'MacBook Pro 14" M3 Pro 18/512',
    brand: "Apple",
    category: "Laptops",
    image: "/src/assets/p-laptop.jpg",
    retail_price_poisha: 24500000,
    specs_json: [
      { label: "Chip", value: "Apple M3 Pro (11-core CPU / 14-core GPU)" },
      { label: "RAM", value: "18GB Unified" },
      { label: "SSD", value: "512GB NVMe" },
      { label: "Display", value: '14.2" Liquid Retina XDR 120Hz' },
    ],
  },
  {
    id: "dell-xps-13-plus",
    name: "Dell XPS 13 Plus 9320 Core i7",
    brand: "Dell",
    category: "Laptops",
    image: "/src/assets/p-laptop.jpg",
    retail_price_poisha: 17800000,
    specs_json: [
      { label: "CPU", value: "Intel Core i7-1360P" },
      { label: "RAM", value: "16GB LPDDR5" },
      { label: "SSD", value: "512GB PCIe 4.0" },
      { label: "Display", value: '13.4" 3.5K OLED Touch' },
    ],
  },
  {
    id: "thinkpad-x1-carbon-gen11",
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    brand: "Lenovo",
    category: "Laptops",
    image: "/src/assets/p-laptop.jpg",
    retail_price_poisha: 19500000,
    specs_json: [
      { label: "CPU", value: "Intel Core i7-1355U vPro" },
      { label: "RAM", value: "16GB LPDDR5" },
      { label: "SSD", value: "512GB NVMe OPAL2" },
      { label: "Weight", value: "1.12 kg" },
    ],
  },
  {
    id: "asus-zephyrus-g14",
    name: "ASUS ROG Zephyrus G14 (2024)",
    brand: "ASUS",
    category: "Laptops",
    image: "/src/assets/p-laptop.jpg",
    retail_price_poisha: 21500000,
    specs_json: [
      { label: "CPU", value: "AMD Ryzen 9 8945HS" },
      { label: "GPU", value: "NVIDIA RTX 4070 8GB" },
      { label: "Display", value: '14" 3K 120Hz OLED' },
      { label: "RAM", value: "32GB LPDDR5X" },
    ],
  },

  // ── Cameras ──
  {
    id: "sony-a7-iv",
    name: "Sony Alpha 7 IV (Body Only)",
    brand: "Sony",
    category: "Cameras",
    image: "/src/assets/p-camera.jpg",
    retail_price_poisha: 26500000,
    specs_json: [
      { label: "Sensor", value: "33MP Full-Frame Exmor R CMOS" },
      { label: "Video", value: "4K 60p 10-bit 4:2:2" },
      { label: "Stabilization", value: "5-Axis In-Body (5.5 stops)" },
      { label: "Mount", value: "Sony E-Mount" },
    ],
  },
  {
    id: "fujifilm-x-t5",
    name: "Fujifilm X-T5 Mirrorless Body",
    brand: "Fujifilm",
    category: "Cameras",
    image: "/src/assets/p-camera.jpg",
    retail_price_poisha: 18500000,
    specs_json: [
      { label: "Sensor", value: "40.2MP X-Trans CMOS 5 HR" },
      { label: "Video", value: "6.2K 30p internal" },
      { label: "Stabilization", value: "Up to 7.0 stops IBIS" },
      { label: "Design", value: "Classic Dial Controls" },
    ],
  },
  {
    id: "canon-eos-r6-mark-ii",
    name: "Canon EOS R6 Mark II Body",
    brand: "Canon",
    category: "Cameras",
    image: "/src/assets/p-camera.jpg",
    retail_price_poisha: 25500000,
    specs_json: [
      { label: "Sensor", value: "24.2MP Full-Frame CMOS" },
      { label: "Burst", value: "Up to 40 fps Electronic" },
      { label: "Autofocus", value: "Dual Pixel CMOS AF II" },
      { label: "Video", value: "6K oversampled 4K 60p" },
    ],
  },

  // ── Audio ──
  {
    id: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5 ANC Headphones",
    brand: "Sony",
    category: "Audio",
    image: "/src/assets/p-headphones.jpg",
    retail_price_poisha: 3850000,
    specs_json: [
      { label: "ANC", value: "Auto NC Optimizer with 8 mics" },
      { label: "Battery", value: "30 hours with ANC on" },
      { label: "Codec", value: "LDAC, AAC, SBC" },
      { label: "Driver", value: "30mm Carbon Fiber" },
    ],
  },
  {
    id: "airpods-pro-2-usbc",
    name: "Apple AirPods Pro (2nd Gen, USB-C)",
    brand: "Apple",
    category: "Audio",
    image: "/src/assets/p-headphones.jpg",
    retail_price_poisha: 2950000,
    specs_json: [
      { label: "Chip", value: "Apple H2 with MagSafe Case (USB-C)" },
      { label: "ANC", value: "Up to 2x active noise cancellation" },
      { label: "Audio", value: "Adaptive Audio & Transparency" },
      { label: "Dust/Water", value: "IP54 Rated" },
    ],
  },
  {
    id: "bose-qc-ultra-headphones",
    name: "Bose QuietComfort Ultra Headphones",
    brand: "Bose",
    category: "Audio",
    image: "/src/assets/p-headphones.jpg",
    retail_price_poisha: 4200000,
    specs_json: [
      { label: "Spatial", value: "Bose Immersive Audio" },
      { label: "ANC", value: "CustomTune active noise cancelling" },
      { label: "Battery", value: "Up to 24 hours" },
    ],
  },

  // ── Accessories ──
  {
    id: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2 (49mm Titanium)",
    brand: "Apple",
    category: "Accessories",
    image: "/src/assets/p-phone.jpg",
    retail_price_poisha: 10500000,
    specs_json: [
      { label: "Case", value: "49mm Aerospace Titanium" },
      { label: "Display", value: "3000 nits Always-On Retina" },
      { label: "Battery", value: "Up to 36 hours (72h Low Power)" },
      { label: "Water", value: "100m water resistant / EN13319" },
    ],
  },
  {
    id: "ipad-pro-11-m4",
    name: 'iPad Pro 11" M4 256GB Wi-Fi',
    brand: "Apple",
    category: "Accessories",
    image: "/src/assets/p-laptop.jpg",
    retail_price_poisha: 12800000,
    specs_json: [
      { label: "Chip", value: "Apple M4 (9-core CPU / 10-core GPU)" },
      { label: "Display", value: '11" Ultra Retina XDR Tandem OLED' },
      { label: "Storage", value: "256GB" },
      { label: "Thickness", value: "5.3 mm" },
    ],
  },
];

// 3. Initial Listings
const listings = [
  {
    id: "l-1",
    product_id: "iphone-15-pro-256",
    seller_id: "u-1",
    grade: "A+",
    condition_score: 96,
    price_poisha: 12400000,
    seller_note:
      "Flawless condition, always used with case and screen protector. Battery health 98%. Comes with original box and cable.",
    status: "PUBLISHED",
    warranty_months: 6,
    has_invoice: true,
    battery_health: 98,
    accessories: "Original Box, 20W USB-C Cable",
    repairs: "None — 100% original parts",
    physical_condition: "Zero visible scratches on body or bezel.",
    screen_condition: "Factory fresh with zero micro-scratches.",
    listed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "l-2",
    product_id: "macbook-air-m2",
    seller_id: "u-2",
    grade: "A",
    condition_score: 91,
    price_poisha: 9800000,
    seller_note:
      "Clean device used for programming. Light hairline mark near port. Cycle count 124.",
    status: "PUBLISHED",
    warranty_months: 3,
    has_invoice: true,
    battery_health: 94,
    accessories: "MagSafe 3 Charger, Original Box",
    repairs: "None",
    physical_condition: "Minor hairline scuff near USB-C port.",
    screen_condition: "Clean display, no dead pixels.",
    listed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "l-3",
    product_id: "sony-a7-iv",
    seller_id: "u-1",
    grade: "A+",
    condition_score: 97,
    price_poisha: 21500000,
    seller_note: "Shutter count under 3,400. Kept in electronic dry cabinet. Perfect condition.",
    status: "PUBLISHED",
    warranty_months: 6,
    has_invoice: true,
    battery_health: null,
    accessories: "Original NP-FZ100 Battery, Strap, Body Cap, Box",
    repairs: "None",
    physical_condition: "MINT. No cosmetic flaws.",
    screen_condition: "Screen protector applied on day one.",
    listed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "l-4",
    product_id: "sony-wh-1000xm5",
    seller_id: "u-2",
    grade: "B",
    condition_score: 83,
    price_poisha: 2650000,
    seller_note:
      "Great sound and battery life. Some cosmetic scuffs on outer earcups from daily transit.",
    status: "PUBLISHED",
    warranty_months: 1,
    has_invoice: false,
    battery_health: null,
    accessories: "Carrying Case, 3.5mm Aux Cable, USB-C Cable",
    repairs: "None",
    physical_condition: "Light superficial scratches on headband slider and cups.",
    screen_condition: "N/A",
    listed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: "l-5",
    product_id: "apple-watch-ultra-2",
    seller_id: "u-1",
    grade: "A+",
    condition_score: 98,
    price_poisha: 8400000,
    seller_note:
      "Worn sparingly. Battery health 100%. Comes with Orange Ocean Band and fast charger.",
    status: "PUBLISHED",
    warranty_months: 8,
    has_invoice: true,
    battery_health: 100,
    accessories: "Orange Ocean Band, Magnetic Fast Charger, Box",
    repairs: "None",
    physical_condition: "Titanium case pristine, zero dents.",
    screen_condition: "Sapphire crystal flawless.",
    listed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

// 4. Inspection Items
const inspectionItems = [
  {
    id: "insp-1",
    listing_id: "l-1",
    component: "Display & Touch",
    status: "PASSED",
    notes: "100% responsive, True Tone functional",
  },
  {
    id: "insp-2",
    listing_id: "l-1",
    component: "Face ID & Sensors",
    status: "PASSED",
    notes: "Instant unlock",
  },
  {
    id: "insp-3",
    listing_id: "l-1",
    component: "Camera Array",
    status: "PASSED",
    notes: "0.5x, 1x, 2x, 3x sharp, OIS active",
  },
  {
    id: "insp-4",
    listing_id: "l-1",
    component: "Battery Health",
    status: "PASSED",
    notes: "98% original capacity",
  },
  {
    id: "insp-5",
    listing_id: "l-1",
    component: "Speakers & Mic",
    status: "PASSED",
    notes: "Clean stereo separation",
  },

  {
    id: "insp-6",
    listing_id: "l-2",
    component: "Keyboard & Trackpad",
    status: "PASSED",
    notes: "Full travel, Force Touch working",
  },
  {
    id: "insp-7",
    listing_id: "l-2",
    component: "Liquid Retina Display",
    status: "PASSED",
    notes: "No dead pixels, no bleeding",
  },
  {
    id: "insp-8",
    listing_id: "l-2",
    component: "Ports & MagSafe",
    status: "PASSED",
    notes: "Full charging rate verified",
  },
];

// 5. Initial Orders
const orders = [
  {
    id: "ORD-84392",
    listing_id: "l-1",
    buyer_id: "u-admin",
    amount_poisha: 12400000,
    payment_method: "cod",
    status: "SHIPPED",
    shipping_address_json: {
      name: "Admin User",
      phone: "01700000000",
      division: "Dhaka",
      district: "Dhaka",
      area: "Banani",
      address: "Road 11, House 45",
    },
    nid_number: "199526920199201",
    created_at: "2026-08-14T10:00:00.000Z",
  },
  {
    id: "ORD-71204",
    listing_id: "l-2",
    buyer_id: "u-admin",
    amount_poisha: 4500000,
    payment_method: "bkash",
    status: "DELIVERED",
    shipping_address_json: {
      name: "Admin User",
      phone: "01700000000",
      division: "Dhaka",
      district: "Dhaka",
      area: "Gulshan-2",
      address: "Road 44, House 12",
    },
    nid_number: "199526920199201",
    created_at: "2026-07-20T14:30:00.000Z",
  },
];

async function seedSupabase() {
  console.log("---------------------------------------------");
  console.log("Uploading Resale Data to Supabase...");
  console.log("URL:", SUPABASE_URL);
  console.log("---------------------------------------------");

  // 1. Upload Users
  console.log(`\n1. Upserting ${users.length} users...`);
  const { data: uData, error: uErr } = await supabase
    .from("users")
    .upsert(users, { onConflict: "id" });
  if (uErr) {
    console.error("  ❌ Error uploading users:", uErr.message);
    if (uErr.code === "PGRST205" || uErr.message.includes("Could not find the table")) {
      console.log(
        "\n⚠️ Table not found! Please execute the SQL migration in `supabase/schema.sql` first in your Supabase SQL Editor.",
      );
      return;
    }
  } else {
    console.log("  ✅ Users uploaded successfully!");
  }

  // 2. Upload Products
  console.log(`\n2. Upserting ${products.length} products...`);
  const { data: pData, error: pErr } = await supabase
    .from("products")
    .upsert(products, { onConflict: "id" });
  if (pErr) console.error("  ❌ Error uploading products:", pErr.message);
  else console.log("  ✅ Products uploaded successfully!");

  // 3. Upload Listings
  console.log(`\n3. Upserting ${listings.length} listings...`);
  const { data: lData, error: lErr } = await supabase
    .from("listings")
    .upsert(listings, { onConflict: "id" });
  if (lErr) console.error("  ❌ Error uploading listings:", lErr.message);
  else console.log("  ✅ Listings uploaded successfully!");

  // 4. Upload Inspection Items
  console.log(`\n4. Upserting ${inspectionItems.length} inspection items...`);
  const { data: iData, error: iErr } = await supabase
    .from("inspection_items")
    .upsert(inspectionItems, { onConflict: "id" });
  if (iErr) console.error("  ❌ Error uploading inspection items:", iErr.message);
  else console.log("  ✅ Inspection items uploaded successfully!");

  // 5. Upload Orders
  console.log(`\n5. Upserting ${orders.length} orders...`);
  const { data: oData, error: oErr } = await supabase
    .from("orders")
    .upsert(orders, { onConflict: "id" });
  if (oErr) console.error("  ❌ Error uploading orders:", oErr.message);
  else console.log("  ✅ Orders uploaded successfully!");

  console.log("\n---------------------------------------------");
  console.log("✨ Seed Process Completed!");
  console.log("---------------------------------------------");
}

seedSupabase().catch(console.error);
