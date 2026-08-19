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

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_listings_product_id ON public.listings(product_id);
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_listing_id ON public.orders(listing_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Allows reading catalog, listings, inspection items)
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on listings" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on inspection_items" ON public.inspection_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public read access on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public read access on disputes" ON public.disputes FOR SELECT USING (true);

-- Public Insert/Update Policies (Allows submitting orders, listings, disputes, users)
CREATE POLICY "Allow public insert on users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on products" ON public.products FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on listings" ON public.listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on listings" ON public.listings FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on inspection_items" ON public.inspection_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on disputes" ON public.disputes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on disputes" ON public.disputes FOR UPDATE USING (true);
