import { Storefront, INITIAL_DEMO_STORES } from "@/data/storefront";
import { listings, Listing } from "@/data/catalog";
import { readGradedDrafts } from "@/lib/grade-store";

const STORE_STORAGE_KEY = "resale.stores";

export function getStores(): Storefront[] {
  if (typeof window === "undefined") return INITIAL_DEMO_STORES;
  try {
    const raw = window.localStorage.getItem(STORE_STORAGE_KEY);
    if (!raw) {
      // Seed with initial demo stores
      window.localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_STORES));
      return INITIAL_DEMO_STORES;
    }
    const parsed = JSON.parse(raw) as Storefront[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_STORES;
  } catch {
    return INITIAL_DEMO_STORES;
  }
}

export function getStoreBySlug(slug: string): Storefront | undefined {
  const all = getStores();
  const normalized = slug.trim().toLowerCase();
  return all.find((s) => s.slug.toLowerCase() === normalized);
}

export function getStoreById(id: string): Storefront | undefined {
  const all = getStores();
  return all.find((s) => s.id === id);
}

export function getStoreByOwnerId(ownerId: string): Storefront | undefined {
  const all = getStores();
  return all.find((s) => s.ownerId === ownerId);
}

export function saveStore(store: Storefront): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStores();
    const updated = [store, ...existing.filter((s) => s.id !== store.id)];
    window.localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to persist store:", err);
  }
}

export function isSlugAvailable(slug: string, currentStoreId?: string): boolean {
  const normalized = slug.trim().toLowerCase();
  const all = getStores();
  const found = all.find((s) => s.slug.toLowerCase() === normalized);
  if (!found) return true;
  return currentStoreId ? found.id === currentStoreId : false;
}

export function getListingsForStore(storeId: string): Listing[] {
  // 1. Static mock catalog listings tagged with this storeId
  const staticStoreListings = listings.filter((l) => l.storeId === storeId);

  // 2. Dynamically saved drafts/listings in localStorage that belong to this store
  const drafts = readGradedDrafts();
  const dynamicStoreListings: Listing[] = drafts
    .filter((d) => d.storeId === storeId)
    .map((d) => ({
      id: d.id,
      productId: d.answers["productName"] ? "iphone-15-pro-256" : "iphone-15-pro-256",
      conditionScore: d.conditionScore,
      inspection: [
        { component: "Overall Diagnostic", status: `Graded ${d.grade}` },
        { component: "Documentation", status: "Seller Declared Diagnostic" },
      ],
      sellerNote: d.answers["description"] || "Verified Store inventory item.",
      listedAt: d.createdAt.split("T")[0] || "2026-08-20",
      price: d.price,
      grade: d.grade,
      warrantyMonths: d.answers["warranty"] === "active" ? 6 : 0,
      invoice: true,
      battery: d.answers["batteryHealth"] ? parseInt(d.answers["batteryHealth"], 10) : undefined,
      accessories: d.answers["accessoriesIncluded"] || "Standard",
      repairs: "None reported",
      physical: "Checked & graded",
      screen: "Functional",
      seller: {
        name: "Store Merchant",
        verified: true,
        rating: 5.0,
        sales: 1,
        district: "Dhaka",
      },
      storeId,
    }));

  return [...staticStoreListings, ...dynamicStoreListings];
}
