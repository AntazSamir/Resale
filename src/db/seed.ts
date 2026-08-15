import { db } from "./index";
import { users, products, listings, inspectionItems } from "./schema";

export async function seed() {
  console.log("Seeding database...");

  // Seed Users
  const sampleUsers = [
    {
      id: "u-1",
      name: "Rafiq H.",
      phone: "+8801700000001",
      role: "SELLER" as const,
      verified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "u-2",
      name: "Nusrat T.",
      phone: "+8801700000002",
      role: "SELLER" as const,
      verified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "u-3",
      name: "Imran K.",
      phone: "+8801700000003",
      role: "SELLER" as const,
      verified: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "u-admin",
      name: "Admin User",
      phone: "+8801700000000",
      role: "ADMIN" as const,
      verified: true,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const u of sampleUsers) {
    await db.insert(users).values(u).onConflictDoNothing();
  }

  const rawProducts = [
    {
      id: "iphone-15-pro-256",
      name: "iPhone 15 Pro 256GB",
      brand: "Apple",
      category: "Smartphones",
      retail: 145000,
      image: "/src/assets/p-phone.jpg",
      specs: [{ label: "Storage", value: "256GB" }],
    },
    {
      id: "macbook-air-m2",
      name: "MacBook Air M2 8/256",
      brand: "Apple",
      category: "Laptops",
      retail: 165000,
      image: "/src/assets/p-laptop.jpg",
      specs: [{ label: "Memory", value: "8GB unified" }],
    },
    {
      id: "fuji-x100v",
      name: "Fujifilm X100V",
      brand: "Fujifilm",
      category: "Cameras",
      retail: 198000,
      image: "/src/assets/p-camera.jpg",
      specs: [{ label: "Sensor", value: "26.1MP" }],
    },
    {
      id: "sony-wh1000xm5",
      name: "Sony WH-1000XM5",
      brand: "Sony",
      category: "Audio",
      retail: 42000,
      image: "/src/assets/p-headphones.jpg",
      specs: [{ label: "Type", value: "Over-ear ANC" }],
    },
  ];

  // Seed Products
  for (const p of rawProducts) {
    await db
      .insert(products)
      .values({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        retailPricePoisha: p.retail * 100,
        image: p.image,
        specsJson: JSON.stringify(p.specs),
      })
      .onConflictDoNothing();
  }

  console.log("Database seeded successfully!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
});
