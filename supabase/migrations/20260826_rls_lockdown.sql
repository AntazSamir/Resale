-- ==============================================================================
-- Resale.com — RLS SECURITY LOCKDOWN
-- Run in: Supabase Dashboard → SQL Editor → New Query
--
-- WHY: All write policies were `WITH CHECK (true)` / `USING (true)`, letting
-- ANYONE with the public anon key insert/update every table via the REST API.
-- Public SELECT on users/orders/disputes also leaked PII (NID, phone, address).
--
-- AFTER THIS SCRIPT:
--   * Anonymous/signed-in users: READ-ONLY on public catalog data.
--   * ALL writes happen server-side via service-role key (bypasses RLS).
--   * PII tables (users/orders/disputes) are no longer publicly readable.
-- ==============================================================================

-- ── 1. Drop all permissive WRITE policies ────────────────────────────────────

DROP POLICY IF EXISTS "Allow public insert on users"              ON public.users;
DROP POLICY IF EXISTS "Allow public update on users"              ON public.users;
DROP POLICY IF EXISTS "Allow public insert on products"           ON public.products;
DROP POLICY IF EXISTS "Allow public update on products"           ON public.products;
DROP POLICY IF EXISTS "Allow public insert on listings"           ON public.listings;
DROP POLICY IF EXISTS "Allow public update on listings"           ON public.listings;
DROP POLICY IF EXISTS "Allow public insert on inspection_items"   ON public.inspection_items;
DROP POLICY IF EXISTS "Allow public insert on orders"             ON public.orders;
DROP POLICY IF EXISTS "Allow public update on orders"             ON public.orders;
DROP POLICY IF EXISTS "Allow public insert on disputes"           ON public.disputes;
DROP POLICY IF EXISTS "Allow public update on disputes"           ON public.disputes;

DROP POLICY IF EXISTS "Allow public insert on stores"                        ON public.stores;
DROP POLICY IF EXISTS "Allow store creation for authenticated sellers"       ON public.stores;
DROP POLICY IF EXISTS "Allow store update for owners"                        ON public.stores;

DROP POLICY IF EXISTS "Allow public insert on creator_profiles"    ON public.creator_profiles;
DROP POLICY IF EXISTS "Allow creator profile creation"             ON public.creator_profiles;
DROP POLICY IF EXISTS "Allow public update on creator_profiles"    ON public.creator_profiles;
DROP POLICY IF EXISTS "Allow creator profile update for owners"    ON public.creator_profiles;

DROP POLICY IF EXISTS "Allow public insert on product_videos"      ON public.product_videos;
DROP POLICY IF EXISTS "Allow video insertion for creators"         ON public.product_videos;
DROP POLICY IF EXISTS "Allow video update for creators"            ON public.product_videos;

-- ── 2. Remove PII-leaking public READ policies ──────────────────────────────

DROP POLICY IF EXISTS "Allow public read access on users"     ON public.users;
DROP POLICY IF EXISTS "Allow public read access on orders"    ON public.orders;
DROP POLICY IF EXISTS "Allow public read access on disputes"  ON public.disputes;

-- ── 3. Lock down the SECURITY DEFINER function ──────────────────────────────
-- rls_auto_enable() is kept intentionally: the `ensure_rls` event trigger uses
-- it to auto-enable RLS on newly created tables. We only strip public EXECUTE
-- so it can no longer be called via /rest/v1/rpc by anon/authenticated roles.

REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

-- ── 4. Guarantee RLS is enabled everywhere (defensive) ──────────────────────

ALTER TABLE public.users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_videos   ENABLE ROW LEVEL SECURITY;

-- ── 5. Ensure the service role can work with all tables ─────────────────────
-- (service_role bypasses RLS by design; these grants keep it explicit)

GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ── Done ────────────────────────────────────────────────────────────────────
-- Remaining PUBLIC policies after this script (verify in Dashboard):
--   products          : SELECT USING (true)
--   listings          : SELECT USING (true)
--   inspection_items  : SELECT USING (true)
--   stores            : SELECT USING (true)
--   creator_profiles  : SELECT USING (true)
--   product_videos    : SELECT USING (status = 'APPROVED' OR true)
