import {
  CreatorProfile,
  ProductVideo,
  INITIAL_DEMO_CREATORS,
  INITIAL_DEMO_VIDEOS,
  VideoPlatform,
  ReviewType,
} from "@/data/creator";
import { supabase } from "./supabase";

const CREATORS_STORAGE_KEY = "resale.creators";
const VIDEOS_STORAGE_KEY = "resale.product-videos";

type CreatorListener = (creators: CreatorProfile[]) => void;
type VideoListener = (videos: ProductVideo[]) => void;

const creatorListeners = new Set<CreatorListener>();
const videoListeners = new Set<VideoListener>();

export function onCreatorsChange(callback: CreatorListener): () => void {
  creatorListeners.add(callback);
  return () => {
    creatorListeners.delete(callback);
  };
}

export function onVideosChange(callback: VideoListener): () => void {
  videoListeners.add(callback);
  return () => {
    videoListeners.delete(callback);
  };
}

function notifyCreatorListeners(creators: CreatorProfile[]): void {
  creatorListeners.forEach((fn) => {
    try {
      fn(creators);
    } catch {
      // ignore
    }
  });
}

function notifyVideoListeners(videos: ProductVideo[]): void {
  videoListeners.forEach((fn) => {
    try {
      fn(videos);
    } catch {
      // ignore
    }
  });
}

// ── Converters ──

export function creatorProfileToSupabase(creator: CreatorProfile): Record<string, unknown> {
  return {
    id: creator.id,
    user_id: creator.userId || `user-${creator.handle}`,
    handle: creator.handle.toLowerCase().trim(),
    display_name: creator.displayName,
    avatar_url: creator.avatarUrl || null,
    banner_url: creator.bannerUrl || null,
    bio: creator.bio || null,
    verified: Boolean(creator.verified),
    channels: creator.channels || {},
    total_reviews: creator.totalReviews ?? 0,
    created_at: creator.createdAt || new Date().toISOString(),
  };
}

export function supabaseToCreatorProfile(row: Record<string, unknown>): CreatorProfile {
  const channels =
    typeof row["channels"] === "object" && row["channels"] !== null
      ? (row["channels"] as Record<string, string>)
      : {};

  return {
    id: String(row["id"]),
    userId: String(row["user_id"]),
    handle: String(row["handle"]),
    displayName: String(row["display_name"] || row["handle"]),
    avatarUrl: typeof row["avatar_url"] === "string" ? row["avatar_url"] : undefined,
    bannerUrl: typeof row["banner_url"] === "string" ? row["banner_url"] : undefined,
    bio: typeof row["bio"] === "string" ? row["bio"] : undefined,
    verified: Boolean(row["verified"]),
    channels: {
      youtube: channels["youtube"] || undefined,
      facebook: channels["facebook"] || undefined,
      tiktok: channels["tiktok"] || undefined,
      instagram: channels["instagram"] || undefined,
    },
    totalReviews: typeof row["total_reviews"] === "number" ? row["total_reviews"] : 0,
    isDemo: false,
    createdAt: typeof row["created_at"] === "string" ? row["created_at"] : new Date().toISOString(),
  };
}

export function productVideoToSupabase(video: ProductVideo): Record<string, unknown> {
  return {
    id: video.id,
    product_id: video.productId,
    creator_id: video.creatorId,
    listing_id: video.listingId || null,
    platform: video.platform || "YOUTUBE",
    video_url: video.videoUrl,
    video_id: video.videoId,
    title: video.title,
    thumbnail_url: video.thumbnailUrl || null,
    review_type: video.reviewType || "FULL_REVIEW",
    published_date: video.publishedDate || new Date().toISOString().split("T")[0],
    is_verified_review_unit: Boolean(video.isVerifiedReviewUnit),
    status: video.status || "APPROVED",
    created_at: new Date().toISOString(),
  };
}

export function supabaseToProductVideo(row: Record<string, unknown>): ProductVideo {
  return {
    id: String(row["id"]),
    productId: String(row["product_id"]),
    creatorId: String(row["creator_id"]),
    listingId: typeof row["listing_id"] === "string" ? row["listing_id"] : undefined,
    platform: (row["platform"] as VideoPlatform) || "YOUTUBE",
    videoUrl: String(row["video_url"] || ""),
    videoId: String(row["video_id"] || ""),
    title: String(row["title"] || "Product Review Video"),
    thumbnailUrl: typeof row["thumbnail_url"] === "string" ? row["thumbnail_url"] : undefined,
    reviewType: (row["review_type"] as ReviewType) || "FULL_REVIEW",
    publishedDate: typeof row["published_date"] === "string" ? row["published_date"] : undefined,
    isVerifiedReviewUnit: Boolean(row["is_verified_review_unit"]),
    status: (row["status"] as "APPROVED" | "PENDING_MODERATION" | "REJECTED") || "APPROVED",
    isDemo: false,
  };
}

// ── Creators Storage & Sync ──

function readLocalCreators(): CreatorProfile[] {
  if (typeof window === "undefined") return INITIAL_DEMO_CREATORS;
  try {
    const raw = window.localStorage.getItem(CREATORS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(CREATORS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CREATORS));
      return INITIAL_DEMO_CREATORS;
    }
    const parsed = JSON.parse(raw) as CreatorProfile[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_CREATORS;
  } catch {
    return INITIAL_DEMO_CREATORS;
  }
}

function writeLocalCreators(creators: CreatorProfile[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CREATORS_STORAGE_KEY, JSON.stringify(creators));
  } catch {
    // ignore
  }
}

let syncCreatorsInitiated = false;

export async function fetchCreatorsAsync(): Promise<CreatorProfile[]> {
  try {
    const { data, error } = await supabase
      .from("creator_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return getCreators();
    }

    if (Array.isArray(data) && data.length > 0) {
      const remoteCreators = data.map((r) =>
        supabaseToCreatorProfile(r as Record<string, unknown>),
      );

      if (typeof window !== "undefined") {
        const local = readLocalCreators();
        const mergedMap = new Map<string, CreatorProfile>();

        remoteCreators.forEach((c) => mergedMap.set(c.handle.toLowerCase(), c));
        local.forEach((c) => {
          if (!mergedMap.has(c.handle.toLowerCase())) {
            mergedMap.set(c.handle.toLowerCase(), c);
          }
        });

        const merged = Array.from(mergedMap.values());
        writeLocalCreators(merged);
        notifyCreatorListeners(merged);
        return merged;
      }

      notifyCreatorListeners(remoteCreators);
      return remoteCreators;
    }

    return getCreators();
  } catch {
    return getCreators();
  }
}

export function getCreators(): CreatorProfile[] {
  const local = readLocalCreators();

  if (typeof window !== "undefined" && !syncCreatorsInitiated) {
    syncCreatorsInitiated = true;
    setTimeout(() => {
      fetchCreatorsAsync().catch(() => {});
    }, 50);
  }

  return local;
}

export function getCreatorByHandle(handle: string): CreatorProfile | undefined {
  const all = getCreators();
  const normalized = handle.trim().toLowerCase();
  return all.find((c) => c.handle.toLowerCase() === normalized);
}

export async function fetchCreatorByHandleAsync(
  handle: string,
): Promise<CreatorProfile | undefined> {
  const normalized = handle.trim().toLowerCase();
  try {
    const { data, error } = await supabase
      .from("creator_profiles")
      .select("*")
      .eq("handle", normalized)
      .maybeSingle();

    if (!error && data) {
      return supabaseToCreatorProfile(data as Record<string, unknown>);
    }
  } catch {
    // fallback to local
  }
  return getCreatorByHandle(handle);
}

export function getCreatorById(id: string): CreatorProfile | undefined {
  const all = getCreators();
  return all.find((c) => c.id === id);
}

export function getCreatorByUserId(userId: string): CreatorProfile | undefined {
  const all = getCreators();
  return all.find((c) => c.userId === userId);
}

async function syncCreatorToSupabase(
  creator: CreatorProfile,
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Ensure user exists in public.users to satisfy foreign key
    const userId = creator.userId || `user-${creator.handle}`;
    await supabase.from("users").upsert(
      {
        id: userId,
        phone: "01700000000",
        name: creator.displayName,
        role: "BUYER",
        verified: true,
      },
      { onConflict: "id" },
    );

    // 2. Upsert creator profile
    const payload = creatorProfileToSupabase(creator);
    payload["user_id"] = userId;
    const { error } = await supabase.from("creator_profiles").upsert(payload, { onConflict: "id" });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export function saveCreator(creator: CreatorProfile): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readLocalCreators();
    const updated = [creator, ...existing.filter((c) => c.id !== creator.id)];
    writeLocalCreators(updated);
    notifyCreatorListeners(updated);

    // Asynchronously sync to Supabase
    syncCreatorToSupabase(creator).catch(() => {});
  } catch (err) {
    console.error("Failed to save creator profile:", err);
  }
}

export async function saveCreatorAsync(
  creator: CreatorProfile,
): Promise<{ success: boolean; error?: string }> {
  saveCreator(creator);
  return syncCreatorToSupabase(creator);
}

export function isHandleAvailable(handle: string, currentCreatorId?: string): boolean {
  const normalized = handle.trim().toLowerCase();
  const all = getCreators();
  const found = all.find((c) => c.handle.toLowerCase() === normalized);
  if (!found) return true;
  return currentCreatorId ? found.id === currentCreatorId : false;
}

// ── Videos Storage & Sync ──

function readLocalVideos(): ProductVideo[] {
  if (typeof window === "undefined") return INITIAL_DEMO_VIDEOS;
  try {
    const raw = window.localStorage.getItem(VIDEOS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_VIDEOS));
      return INITIAL_DEMO_VIDEOS;
    }
    const parsed = JSON.parse(raw) as ProductVideo[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_VIDEOS;
  } catch {
    return INITIAL_DEMO_VIDEOS;
  }
}

function writeLocalVideos(videos: ProductVideo[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
  } catch {
    // ignore
  }
}

let syncVideosInitiated = false;

export async function fetchProductVideosAsync(): Promise<ProductVideo[]> {
  try {
    const { data, error } = await supabase
      .from("product_videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return getProductVideos();
    }

    if (Array.isArray(data) && data.length > 0) {
      const remoteVideos = data.map((r) => supabaseToProductVideo(r as Record<string, unknown>));

      if (typeof window !== "undefined") {
        const local = readLocalVideos();
        const mergedMap = new Map<string, ProductVideo>();

        remoteVideos.forEach((v) => mergedMap.set(v.id, v));
        local.forEach((v) => {
          if (!mergedMap.has(v.id)) {
            mergedMap.set(v.id, v);
          }
        });

        const merged = Array.from(mergedMap.values());
        writeLocalVideos(merged);
        notifyVideoListeners(merged);
        return merged;
      }

      notifyVideoListeners(remoteVideos);
      return remoteVideos;
    }

    return getProductVideos();
  } catch {
    return getProductVideos();
  }
}

export function getProductVideos(): ProductVideo[] {
  const local = readLocalVideos();

  if (typeof window !== "undefined" && !syncVideosInitiated) {
    syncVideosInitiated = true;
    setTimeout(() => {
      fetchProductVideosAsync().catch(() => {});
    }, 50);
  }

  return local;
}

export function getApprovedVideosForProduct(productId: string): ProductVideo[] {
  const all = getProductVideos();
  return all.filter((v) => v.productId === productId && v.status === "APPROVED");
}

export function getApprovedVideoForListing(listingId: string): ProductVideo | undefined {
  const all = getProductVideos();
  return all.find((v) => v.listingId === listingId && v.status === "APPROVED");
}

export function getVideosByCreator(creatorId: string): ProductVideo[] {
  const all = getProductVideos();
  return all.filter((v) => v.creatorId === creatorId);
}

async function syncProductVideoToSupabase(
  video: ProductVideo,
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = productVideoToSupabase(video);
    const { error } = await supabase.from("product_videos").upsert(payload, { onConflict: "id" });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export function saveProductVideo(video: ProductVideo): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readLocalVideos();
    const updated = [video, ...existing.filter((v) => v.id !== video.id)];
    writeLocalVideos(updated);
    notifyVideoListeners(updated);

    // Asynchronously push to Supabase
    syncProductVideoToSupabase(video).catch(() => {});
  } catch (err) {
    console.error("Failed to save product video:", err);
  }
}

export async function saveProductVideoAsync(
  video: ProductVideo,
): Promise<{ success: boolean; error?: string }> {
  saveProductVideo(video);
  return syncProductVideoToSupabase(video);
}
