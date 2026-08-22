export type VideoPlatform = "YOUTUBE" | "TIKTOK" | "FACEBOOK";

export type ReviewType =
  "FULL_REVIEW" | "UNBOXING" | "BATTERY_TEST" | "CAMERA_COMPARISON" | "LONG_TERM";

export interface CreatorChannels {
  youtube?: string | undefined;
  facebook?: string | undefined;
  tiktok?: string | undefined;
  instagram?: string | undefined;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  handle: string;
  displayName: string;
  avatarUrl?: string | undefined;
  bannerUrl?: string | undefined;
  bio?: string | undefined;
  verified: boolean;
  channels: CreatorChannels;
  totalReviews: number;
  isDemo?: boolean | undefined;
  createdAt: string;
}

export interface ProductVideo {
  id: string;
  productId: string;
  creatorId: string;
  listingId?: string | undefined; // Optional exact physical unit tested in video
  platform: VideoPlatform;
  videoUrl: string;
  videoId: string;
  title: string;
  thumbnailUrl?: string | undefined;
  reviewType: ReviewType;
  publishedDate?: string | undefined;
  isVerifiedReviewUnit: boolean;
  status: "APPROVED" | "PENDING_MODERATION" | "REJECTED";
  isDemo?: boolean | undefined;
}

export const INITIAL_DEMO_CREATORS: CreatorProfile[] = [
  {
    id: "creator-sam-tech",
    userId: "user-creator-sam",
    handle: "sam-tech-bd",
    displayName: "Sam Tech BD",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80",
    bio: "Honest, in-depth electronics reviews in Bengali. Testing real-world battery drainage, camera sensors, and thermal stability of graded pre-owned devices in Dhaka.",
    verified: true,
    channels: {
      youtube: "https://youtube.com/@samtechbd",
      facebook: "https://facebook.com/samtechbd",
      tiktok: "https://tiktok.com/@samtechbd",
    },
    totalReviews: 18,
    isDemo: true,
    createdAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "creator-gadget-talk",
    userId: "user-creator-gadget",
    handle: "gadget-talk-bangla",
    displayName: "Gadget Talk Bangla",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    bio: "Unboxings, camera comparisons, and buying guides for second-hand flagships in Bangladesh.",
    verified: true,
    channels: {
      youtube: "https://youtube.com/@gadgettalkbangla",
      facebook: "https://facebook.com/gadgettalkbangla",
    },
    totalReviews: 12,
    isDemo: true,
    createdAt: "2026-02-14T14:00:00Z",
  },
];

export const INITIAL_DEMO_VIDEOS: ProductVideo[] = [
  {
    id: "vid-1",
    productId: "iphone-15-pro-256",
    creatorId: "creator-sam-tech",
    listingId: "l-1", // Exact reviewed unit
    platform: "YOUTUBE",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    title: "iPhone 15 Pro 1-Year Long Term Review: Still Worth Buying Used in 2026?",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80",
    reviewType: "FULL_REVIEW",
    publishedDate: "2026-08-10",
    isVerifiedReviewUnit: true,
    status: "APPROVED",
    isDemo: true,
  },
  {
    id: "vid-2",
    productId: "macbook-pro-14-m3",
    creatorId: "creator-sam-tech",
    listingId: "l-4",
    platform: "YOUTUBE",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    title: "M3 MacBook Pro 14 Real-World Battery & Video Export Test in Dhaka",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    reviewType: "BATTERY_TEST",
    publishedDate: "2026-08-12",
    isVerifiedReviewUnit: true,
    status: "APPROVED",
    isDemo: true,
  },
  {
    id: "vid-3",
    productId: "sony-a7-iv",
    creatorId: "creator-gadget-talk",
    platform: "YOUTUBE",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    title: "Sony A7 IV Sensor Cleanliness & Autofocus Diagnostic Guide for Used Buyers",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    reviewType: "FULL_REVIEW",
    publishedDate: "2026-08-15",
    isVerifiedReviewUnit: false,
    status: "APPROVED",
    isDemo: true,
  },
];
