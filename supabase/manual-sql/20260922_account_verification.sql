-- ==============================================================================
-- Account & Seller Identity Verification
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New Query).
-- The app works without it (it falls back to an in-memory store for the current
-- server session), but verification requests and documents only persist for
-- everyone once this has been applied.
-- ==============================================================================

-- 1. One verification request per user
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT,
  district TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  business_name TEXT,
  nid_last4 TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED')),
  review_note TEXT,
  reviewer_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Uploaded identity documents (files live in private Storage, never public)
CREATE TABLE IF NOT EXISTS public.verification_documents (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES public.verification_requests(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL
    CHECK (doc_type IN ('NID_FRONT', 'NID_BACK', 'SELFIE_WITH_NID', 'TRADE_LICENSE', 'UTILITY_BILL')),
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_requests_status
  ON public.verification_requests(status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_verification_documents_request
  ON public.verification_documents(request_id);

-- 3. Security: identity data is server-only. RLS on, no anon/authenticated
--    policies at all — every read and write goes through the app server using
--    the service role key.
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.verification_requests TO service_role;
GRANT ALL ON public.verification_documents TO service_role;

-- 4. Private storage bucket for the document files
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('verification-documents', 'verification-documents', FALSE, 8388608)
ON CONFLICT (id) DO NOTHING;
