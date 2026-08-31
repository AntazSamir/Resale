-- Schema enhancements for Phase 5.2 Trust Telemetry
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_by TEXT CHECK (cancelled_by IN ('BUYER', 'SELLER', 'ADMIN', 'SYSTEM')),
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Dedicated seller reputation snapshot table (for caching and historical tier changes)
CREATE TABLE IF NOT EXISTS public.seller_reputation (
  seller_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  trust_score INTEGER CHECK (trust_score BETWEEN 0 AND 100),
  trust_tier TEXT CHECK (trust_tier IN ('NEW_SELLER', 'RISING', 'VERIFIED_MERCHANT', 'TOP_RATED')),
  completed_orders_count INTEGER DEFAULT 0,
  upheld_disputes_count INTEGER DEFAULT 0,
  nid_verified BOOLEAN DEFAULT FALSE,
  store_verified BOOLEAN DEFAULT FALSE,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for seller_reputation
ALTER TABLE public.seller_reputation ENABLE ROW LEVEL SECURITY;

-- Public can view reputation snapshots
CREATE POLICY "Public reputation view" ON public.seller_reputation
  FOR SELECT USING (true);

-- Only admin/system can update reputation (calculated by server function)
CREATE POLICY "Admin reputation update" ON public.seller_reputation
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
