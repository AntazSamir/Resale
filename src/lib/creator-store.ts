import {
  CreatorProfile,
  ProductVideo,
  INITIAL_DEMO_CREATORS,
  INITIAL_DEMO_VIDEOS,
} from "@/data/creator";

const CREATORS_STORAGE_KEY = "resale.creators";
const VIDEOS_STORAGE_KEY = "resale.product-videos";

export function getCreators(): CreatorProfile[] {
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

export function getCreatorByHandle(handle: string): CreatorProfile | undefined {
  const all = getCreators();
  const normalized = handle.trim().toLowerCase();
  return all.find((c) => c.handle.toLowerCase() === normalized);
}

export function getCreatorById(id: string): CreatorProfile | undefined {
  const all = getCreators();
  return all.find((c) => c.id === id);
}

export function getCreatorByUserId(userId: string): CreatorProfile | undefined {
  const all = getCreators();
  return all.find((c) => c.userId === userId);
}

export function saveCreator(creator: CreatorProfile): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCreators();
    const updated = [creator, ...existing.filter((c) => c.id !== creator.id)];
    window.localStorage.setItem(CREATORS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save creator profile:", err);
  }
}

export function isHandleAvailable(handle: string, currentCreatorId?: string): boolean {
  const normalized = handle.trim().toLowerCase();
  const all = getCreators();
  const found = all.find((c) => c.handle.toLowerCase() === normalized);
  if (!found) return true;
  return currentCreatorId ? found.id === currentCreatorId : false;
}

// ── Videos Storage ──

export function getProductVideos(): ProductVideo[] {
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

export function saveProductVideo(video: ProductVideo): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getProductVideos();
    const updated = [video, ...existing.filter((v) => v.id !== video.id)];
    window.localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save product video:", err);
  }
}
