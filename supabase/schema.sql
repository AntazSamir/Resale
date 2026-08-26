-- ==============================================================================
-- Resale.com - Supabase PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  nid_number TEXT,
  role TEXT NOT NULL DEFAULT 'BUYER' CHECK (role IN ('BUYER', 'SELLER', 'ADMIN')),
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Products Catalog Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  retail_price_poisha BIGINT NOT NULL,
  image TEXT NOT NULL,
  specs_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Listings Table
CREATE TABLE IF NOT EXISTS public.listings (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  seller_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  grade TEXT NOT NULL CHECK (grade IN ('A+', 'A', 'B', 'C', 'D')),
  condition_score INTEGER NOT NULL,
  price_poisha BIGINT NOT NULL,
  seller_note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PENDING_MODERATION', 'PUBLISHED', 'REJECTED', 'SOLD')),
  warranty_months INTEGER NOT NULL DEFAULT 0,
  has_invoice BOOLEAN NOT NULL DEFAULT FALSE,
  battery_health INTEGER,
  accessories TEXT,
  repairs TEXT,
  physical_condition TEXT,
  screen_condition TEXT,
  listed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Inspection Items Table
CREATE TABLE IF NOT EXISTS public.inspection_items (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  component TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  buyer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  amount_poisha BIGINT NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'DISPUTED', 'CANCELLED')),
  shipping_address_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  nid_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Disputes Table
CREATE TABLE IF NOT EXISTS public.disputes (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  explanation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED_REFUND', 'RESOLVED_REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Stores Table (Phase 3.4 Pro Storefronts)
CREATE TABLE IF NOT EXISTS public.stores (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  district TEXT NOT NULL,
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

-- 8. Creator Profiles Table (Phase 3.4 Creator Hub)
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

-- 9. Product Videos Table (Phase 3.4 Video Reviews)
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

-- 10. Event Tracking Table (Phase 4.2)
-- Stores anonymized behavioral events for analytics.
-- All writes go through the server‑side trackEventFn (service_role key),
-- which bypasses RLS. No public read/select policies are defined;
-- reads are server‑only (e.g., admin dashboards).
CREATE TABLE IF NOT EXISTS public.user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_user_events_event_type ON public.user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_occurred_at ON public.user_events(occurred_at);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_listings_product_id ON public.listings(product_id);
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_listing_id ON public.orders(listing_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug ON public.stores(slug);
CREATE INDEX IF NOT EXISTS idx_creator_handle ON public.creator_profiles(handle);
CREATE INDEX IF NOT EXISTS idx_product_videos_product ON public.product_videos(product_id);
CREATE INDEX IF NOT EXISTS idx_product_videos_creator ON public.product_videos(creator_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_videos ENABLE ROW LEVEL SECURITY;

-- ── SECURITY MODEL (2026-08-26 lockdown) ──
-- * Anonymous visitors: READ-ONLY access to public catalog data.
-- * ALL writes go through the app server using SUPABASE_SERVICE_ROLE_KEY
--   (service_role bypasses RLS — no public INSERT/UPDATE policies exist).
-- * PII tables (users, orders, disputes) have NO public read policy;
--   they are only readable server-side.
--
-- Do NOT add `USING (true)` / `WITH CHECK (true)` write policies here.
-- See supabase/migrations/20260826_rls_lockdown.sql for details.

CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on listings" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on inspection_items" ON public.inspection_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access on stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Allow public read access on creator_profiles" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on approved videos" ON public.product_videos FOR SELECT USING (status = 'APPROVED');
