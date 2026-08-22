import { VideoPlatform } from "@/data/creator";

export interface ParsedVideo {
  platform: VideoPlatform;
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
}

/**
 * Validates external video URLs and safely extracts platform-specific video identifiers.
 * Rejects arbitrary or unsanitized URLs to prevent XSS / iframe security vulnerabilities.
 */
export function parseAndValidateVideoUrl(rawUrl: string): ParsedVideo | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();

  // 1. YouTube validation (watch?v=, youtu.be/, embed/, shorts/)
  const ytMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      platform: "YOUTUBE",
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // 2. TikTok validation (tiktok.com/@user/video/123456789)
  const tiktokMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9._-]+)\/video\/(\d+)/,
  );
  if (tiktokMatch && tiktokMatch[2]) {
    const videoId = tiktokMatch[2];
    return {
      platform: "TIKTOK",
      videoId,
      embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=600&auto=format&fit=crop&q=80",
    };
  }

  // 3. Facebook Video validation (facebook.com/.../videos/12345)
  const fbMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:watch\/\?v=|.*\/videos\/)(\d+)/,
  );
  if (fbMatch && fbMatch[1]) {
    const videoId = fbMatch[1];
    return {
      platform: "FACEBOOK",
      videoId,
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=0`,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&auto=format&fit=crop&q=80",
    };
  }

  return null;
}
