import { Storefront, INITIAL_DEMO_STORES } from "@/data/storefront";
import { listings, Listing } from "@/data/catalog";
import { readGradedDrafts } from "@/lib/grade-store";
import { supabase } from "./supabase";

const STORE_STORAGE_KEY = "resale.stores";

type StoresListener = (stores: Storefront[]) => void;
const listeners = new Set<StoresListener>();

export function onStoresChange(callback: StoresListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifyListeners(stores: Storefront[]): void {
  listeners.forEach((fn) => {
    try {
      fn(stores);
    } catch {
      // ignore
    }
  });
}

/**
 * Maps frontend Storefront object to Supabase PostgreSQL row
 */
export function storefrontToSupabase(store: Storefront): Record<string, unknown> {
  return {
    id: store.id,
    owner_id: store.ownerId,
    name: store.name,
    slug: store.slug.toLowerCase().trim(),
    tagline: store.tagline || null,
    description: store.description || null,
    logo_url: store.logoUrl || null,
    banner_url: store.bannerUrl || null,
    district: store.district || "Dhaka",
    area: store.area || null,
    address: store.address || null,
    phone: store.phone || null,
    email: store.email || null,
    business_hours: store.businessHours || null,
    return_policy: store.returnPolicy || null,
    warranty_policy: store.warrantyPolicy || null,
    verified: Boolean(store.verified),
    social_links: store.socialLinks || {},
    rating: store.rating ?? 5.0,
    total_sales: store.totalSales ?? 0,
    created_at: store.createdAt || new Date().toISOString(),
  };
}

/**
 * Maps Supabase PostgreSQL row to strongly-typed frontend Storefront
 */
export function supabaseToStorefront(row: Record<string, unknown>): Storefront {
  const socialLinks =
    typeof row["social_links"] === "object" && row["social_links"] !== null
      ? (row["social_links"] as Record<string, string>)
      : {};

  return {
    id: String(row["id"]),
    ownerId: String(row["owner_id"]),
    name: String(row["name"]),
    slug: String(row["slug"]),
    tagline: typeof row["tagline"] === "string" ? row["tagline"] : undefined,
    description: typeof row["description"] === "string" ? row["description"] : undefined,
    logoUrl: typeof row["logo_url"] === "string" ? row["logo_url"] : undefined,
    bannerUrl: typeof row["banner_url"] === "string" ? row["banner_url"] : undefined,
    district: String(row["district"] || "Dhaka"),
    area: typeof row["area"] === "string" ? row["area"] : undefined,
    address: typeof row["address"] === "string" ? row["address"] : undefined,
    phone: typeof row["phone"] === "string" ? row["phone"] : undefined,
    email: typeof row["email"] === "string" ? row["email"] : undefined,
    businessHours: typeof row["business_hours"] === "string" ? row["business_hours"] : undefined,
    returnPolicy: typeof row["return_policy"] === "string" ? row["return_policy"] : undefined,
    warrantyPolicy: typeof row["warranty_policy"] === "string" ? row["warranty_policy"] : undefined,
    verified: Boolean(row["verified"]),
    socialLinks: {
      whatsapp: socialLinks["whatsapp"] || undefined,
      facebook: socialLinks["facebook"] || undefined,
      instagram: socialLinks["instagram"] || undefined,
      website: socialLinks["website"] || undefined,
    },
    rating: typeof row["rating"] === "number" ? row["rating"] : Number(row["rating"]) || 5.0,
    totalSales: typeof row["total_sales"] === "number" ? row["total_sales"] : 0,
    isDemo: false,
    createdAt: typeof row["created_at"] === "string" ? row["created_at"] : new Date().toISOString(),
  };
}

function readLocalStores(): Storefront[] {
  if (typeof window === "undefined") return INITIAL_DEMO_STORES;
  try {
    const raw = window.localStorage.getItem(STORE_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_STORES));
      return INITIAL_DEMO_STORES;
    }
    const parsed = JSON.parse(raw) as Storefront[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_STORES;
  } catch {
    return INITIAL_DEMO_STORES;
  }
}

function writeLocalStores(stores: Storefront[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(stores));
  } catch {
    // ignore
  }
}

let syncStoresInitiated = false;

/**
 * Fetches all stores directly from Supabase PostgreSQL, updates local cache, and notifies listeners
 */
export async function fetchStoresAsync(): Promise<Storefront[]> {
  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return getStores();
    }

    if (Array.isArray(data) && data.length > 0) {
      const remoteStores = data.map((r) => supabaseToStorefront(r as Record<string, unknown>));

      if (typeof window !== "undefined") {
        const local = readLocalStores();
        const mergedMap = new Map<string, Storefront>();

        // Remote stores take precedence
        remoteStores.forEach((s) => mergedMap.set(s.slug.toLowerCase(), s));
        local.forEach((s) => {
          if (!mergedMap.has(s.slug.toLowerCase())) {
            mergedMap.set(s.slug.toLowerCase(), s);
          }
        });

        const merged = Array.from(mergedMap.values());
        writeLocalStores(merged);
        notifyListeners(merged);
        return merged;
      }

      notifyListeners(remoteStores);
      return remoteStores;
    }

    return getStores();
  } catch {
    return getStores();
  }
}

/**
 * Synchronous store list retrieval with background Supabase sync on first read
 */
export function getStores(): Storefront[] {
  const local = readLocalStores();

  if (typeof window !== "undefined" && !syncStoresInitiated) {
    syncStoresInitiated = true;
    setTimeout(() => {
      fetchStoresAsync().catch(() => {});
    }, 50);
  }

  return local;
}

export function getStoreBySlug(slug: string): Storefront | undefined {
  const all = getStores();
  const normalized = slug.trim().toLowerCase();
  return all.find((s) => s.slug.toLowerCase() === normalized);
}

export async function fetchStoreBySlugAsync(slug: string): Promise<Storefront | undefined> {
  const normalized = slug.trim().toLowerCase();
  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", normalized)
      .maybeSingle();

    if (!error && data) {
      return supabaseToStorefront(data as Record<string, unknown>);
    }
  } catch {
    // fallback to local
  }
  return getStoreBySlug(slug);
}

export function getStoreById(id: string): Storefront | undefined {
  const all = getStores();
  return all.find((s) => s.id === id);
}

export function getStoreByOwnerId(ownerId: string): Storefront | undefined {
  const all = getStores();
  return all.find((s) => s.ownerId === ownerId);
}

async function syncStoreToSupabase(store: Storefront): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Ensure owner user exists in public.users to satisfy foreign key
    const ownerId = store.ownerId || "u-1";
    await supabase.from("users").upsert(
      {
        id: ownerId,
        phone: store.phone || "01700000000",
        name: store.name,
        role: "SELLER",
        verified: true,
      },
      { onConflict: "id" },
    );

    // 2. Upsert storefront
    const payload = storefrontToSupabase(store);
    payload["owner_id"] = ownerId;
    const { error } = await supabase.from("stores").upsert(payload, { onConflict: "id" });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Saves a new or updated storefront to local cache and Supabase PostgreSQL
 */
export function saveStore(store: Storefront): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readLocalStores();
    const updated = [store, ...existing.filter((s) => s.id !== store.id)];
    writeLocalStores(updated);
    notifyListeners(updated);

    // Asynchronously sync to Supabase
    syncStoreToSupabase(store).catch(() => {});
  } catch (err) {
    console.error("Failed to persist store:", err);
  }
}

/**
 * Async version of saveStore ensuring Supabase write completion
 */
export async function saveStoreAsync(
  store: Storefront,
): Promise<{ success: boolean; error?: string }> {
  saveStore(store);
  return syncStoreToSupabase(store);
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
