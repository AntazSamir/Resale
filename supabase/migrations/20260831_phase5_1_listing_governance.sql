-- ==============================================================================
-- Resale.com — Phase 5.1 Marketplace Trust & Listing Governance Migration
-- Adds server-authoritative listing lifecycle, admin moderation queue,
-- rejection reason tracking, seed catalog demarcation, and append-only audit history.
-- ==============================================================================

-- 1. Extend public.listings with governance and lifecycle attributes
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by TEXT REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS rejection_reason_code TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason_text TEXT,
  ADD COLUMN IF NOT EXISTS is_seed BOOLEAN NOT NULL DEFAULT FALSE;

-- Update check constraints safely
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_moderation_status_check;
ALTER TABLE public.listings ADD CONSTRAINT listings_moderation_status_check
  CHECK (moderation_status IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'));

ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_status_check;
ALTER TABLE public.listings ADD CONSTRAINT listings_status_check
  CHECK (status IN ('DRAFT', 'PENDING_MODERATION', 'PENDING_REVIEW', 'PUBLISHED', 'ACTIVE', 'PAUSED', 'SOLD', 'DELISTED', 'REJECTED'));

-- 2. Create public.listing_audit_history Table (Append-Only)
CREATE TABLE IF NOT EXISTS public.listing_audit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES public.users(id),
  actor_role TEXT NOT NULL CHECK (actor_role IN ('BUYER', 'SELLER', 'ADMIN', 'SYSTEM')),
  action TEXT NOT NULL CHECK (
    action IN (
      'DRAFT_CREATED', 'SUBMITTED', 'APPROVED', 'REJECTED', 
      'RESUBMITTED', 'PAUSED', 'RESUMED', 'DELISTED', 
      'SOLD', 'EDIT_TRIGGERED_REVIEW', 'SEED_INGESTED'
    )
  ),
  previous_status TEXT,
  new_status TEXT NOT NULL,
  reason_code TEXT,
  reason_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance & Query Indexes
CREATE INDEX IF NOT EXISTS idx_listings_public_eligibility
  ON public.listings (moderation_status, status);

CREATE INDEX IF NOT EXISTS idx_listings_seller_status
  ON public.listings (seller_id, status);

CREATE INDEX IF NOT EXISTS idx_listings_moderation_queue
  ON public.listings (moderation_status, submitted_at)
  WHERE moderation_status = 'PENDING_REVIEW';

CREATE INDEX IF NOT EXISTS idx_listing_audit_history_listing_id
  ON public.listing_audit_history (listing_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_audit_history ENABLE ROW LEVEL SECURITY;

-- ── Listings Policies ──
DROP POLICY IF EXISTS "Public can view approved active listings" ON public.listings;
CREATE POLICY "Public can view approved active listings" ON public.listings
  FOR SELECT USING (
    (status IN ('ACTIVE', 'PUBLISHED') AND moderation_status = 'APPROVED')
    OR is_seed = TRUE
  );

DROP POLICY IF EXISTS "Sellers can view own listings" ON public.listings;
CREATE POLICY "Sellers can view own listings" ON public.listings
  FOR SELECT USING (seller_id = auth.uid());

-- ── Listing Audit History Policies ──
DROP POLICY IF EXISTS "Sellers can view audit history for own listings" ON public.listing_audit_history;
CREATE POLICY "Sellers can view audit history for own listings" ON public.listing_audit_history
  FOR SELECT USING (
    listing_id IN (SELECT id FROM public.listings WHERE seller_id = auth.uid())
  );
