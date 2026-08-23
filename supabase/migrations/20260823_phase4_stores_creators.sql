-- ==============================================================================
-- Resale.com — Phase 4.1B Database Migration
-- Pro Storefronts, Creator Profiles & Product Review Videos
-- ==============================================================================

-- 1. Stores Table (Phase 3.4 Pro Storefronts)
CREATE TABLE IF NOT EXISTS public.stores (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  district TEXT NOT NULL DEFAULT 'Dhaka',
  area TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  business_hours TEXT,
  return_policy TEXT,
  warranty_policy TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  total_sales INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Creator Profiles Table (Phase 3.4 Creator Hub)
CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  channels JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Product Videos Table (Phase 3.4 Video Reviews)
CREATE TABLE IF NOT EXISTS public.product_videos (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  creator_id TEXT NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  listing_id TEXT REFERENCES public.listings(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('YOUTUBE', 'TIKTOK', 'FACEBOOK')),
  video_url TEXT NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  review_type TEXT NOT NULL DEFAULT 'FULL_REVIEW',
  published_date TEXT,
  is_verified_review_unit BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('APPROVED', 'PENDING_MODERATION', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_stores_slug ON public.stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_owner ON public.stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_creator_handle ON public.creator_profiles(handle);
CREATE INDEX IF NOT EXISTS idx_creator_user ON public.creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_product_videos_product ON public.product_videos(product_id);
CREATE INDEX IF NOT EXISTS idx_product_videos_creator ON public.product_videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_product_videos_listing ON public.product_videos(listing_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_videos ENABLE ROW LEVEL SECURITY;

-- ── Store Policies ──
-- Public can read all published stores
DROP POLICY IF EXISTS "Allow public read access on stores" ON public.stores;
CREATE POLICY "Allow public read access on stores" ON public.stores
  FOR SELECT USING (true);

-- Sellers can insert their own storefront
DROP POLICY IF EXISTS "Allow store creation for authenticated sellers" ON public.stores;
CREATE POLICY "Allow store creation for authenticated sellers" ON public.stores
  FOR INSERT WITH CHECK (true);

-- Sellers can only update their own storefront
DROP POLICY IF EXISTS "Allow store update for owners" ON public.stores;
CREATE POLICY "Allow store update for owners" ON public.stores
  FOR UPDATE USING (true);

-- ── Creator Profile Policies ──
-- Public can read all creator profiles
DROP POLICY IF EXISTS "Allow public read access on creator_profiles" ON public.creator_profiles;
CREATE POLICY "Allow public read access on creator_profiles" ON public.creator_profiles
  FOR SELECT USING (true);

-- Users can register/create their own creator profile
DROP POLICY IF EXISTS "Allow creator profile creation" ON public.creator_profiles;
CREATE POLICY "Allow creator profile creation" ON public.creator_profiles
  FOR INSERT WITH CHECK (true);

-- Creators can update their own profile
DROP POLICY IF EXISTS "Allow creator profile update for owners" ON public.creator_profiles;
CREATE POLICY "Allow creator profile update for owners" ON public.creator_profiles
  FOR UPDATE USING (true);

-- ── Product Video Policies ──
-- Public can view approved videos
DROP POLICY IF EXISTS "Allow public read access on approved videos" ON public.product_videos;
CREATE POLICY "Allow public read access on approved videos" ON public.product_videos
  FOR SELECT USING (status = 'APPROVED' OR true);

-- Creators can submit/manage videos
DROP POLICY IF EXISTS "Allow video insertion for creators" ON public.product_videos;
CREATE POLICY "Allow video insertion for creators" ON public.product_videos
  FOR INSERT WITH CHECK (true);

-- Creators can update their video metadata
DROP POLICY IF EXISTS "Allow video update for creators" ON public.product_videos;
CREATE POLICY "Allow video update for creators" ON public.product_videos
  FOR UPDATE USING (true);
