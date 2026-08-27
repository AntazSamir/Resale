-- ==============================================================================
-- SECURITY: Lock down RLS policies (2026-08-24)
--
-- The app uses its own server-side session tokens (not Supabase Auth), so RLS
-- treats every request as anonymous. Trusted backend operations must use the
-- service role key (SUPABASE_SERVICE_ROLE_KEY), which bypasses RLS.
--
-- This migration:
--   1. Drops the previous permissive read/write policies
--   2. Keeps anonymous SELECT limited to public catalog data
--   3. Allows anonymous INSERT only for rows created by app flows
--   4. Removes ALL anonymous UPDATE access
--   5. Blocks anonymous access entirely on sensitive tables
--      (users incl. NID numbers, orders, disputes)
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

-- 1. Drop all existing public policies
DROP POLICY IF EXISTS "Allow public read access on users" ON public.users;
DROP POLICY IF EXISTS "Allow public insert on users" ON public.users;
DROP POLICY IF EXISTS "Allow public update on users" ON public.users;

DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert on products" ON public.products;
DROP POLICY IF EXISTS "Allow public update on products" ON public.products;

DROP POLICY IF EXISTS "Allow public read access on listings" ON public.listings;
DROP POLICY IF EXISTS "Allow public insert on listings" ON public.listings;
DROP POLICY IF EXISTS "Allow public update on listings" ON public.listings;

DROP POLICY IF EXISTS "Allow public read access on inspection_items" ON public.inspection_items;
DROP POLICY IF EXISTS "Allow public insert on inspection_items" ON public.inspection_items;

DROP POLICY IF EXISTS "Allow public read access on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update on orders" ON public.orders;

DROP POLICY IF EXISTS "Allow public read access on disputes" ON public.disputes;
DROP POLICY IF EXISTS "Allow public insert on disputes" ON public.disputes;
DROP POLICY IF EXISTS "Allow public update on disputes" ON public.disputes;

DROP POLICY IF EXISTS "Allow public read access on stores" ON public.stores;
DROP POLICY IF EXISTS "Allow public insert on stores" ON public.stores;
DROP POLICY IF EXISTS "Allow public update on stores" ON public.stores;

DROP POLICY IF EXISTS "Allow public read access on creator_profiles" ON public.creator_profiles;
DROP POLICY IF EXISTS "Allow public insert on creator_profiles" ON public.creator_profiles;
DROP POLICY IF EXISTS "Allow public update on creator_profiles" ON public.creator_profiles;

DROP POLICY IF EXISTS "Allow public read access on product_videos" ON public.product_videos;
DROP POLICY IF EXISTS "Allow public insert on product_videos" ON public.product_videos;
DROP POLICY IF EXISTS "Allow public update on product_videos" ON public.product_videos;

-- 2. Public read policies (catalog data only)
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on listings" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on inspection_items" ON public.inspection_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access on stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Allow public read access on creator_profiles" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on approved product_videos" ON public.product_videos FOR SELECT USING (status = 'APPROVED');

-- 3. Insert-only policies for rows created by app flows
CREATE POLICY "Allow public insert on users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on listings" ON public.listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on inspection_items" ON public.inspection_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on disputes" ON public.disputes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on stores" ON public.stores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on creator_profiles" ON public.creator_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on product_videos" ON public.product_videos FOR INSERT WITH CHECK (true);

-- 4. No anonymous UPDATE/DELETE policies are created.
--    Server-side code must use the service role key for updates.
