-- ==============================================================================
-- Phase 5.3 - Persistent grading criteria + buyer/seller device grades
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New Query).
-- The app works without it (it falls back to the built-in checklist and local
-- storage), but grades only persist for everyone once this has been applied.
-- ==============================================================================

-- 1. Grading criteria (authoritative checklist)
CREATE TABLE IF NOT EXISTS public.grading_criteria (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  help TEXT NOT NULL DEFAULT '',
  weight INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Grading options per criterion
CREATE TABLE IF NOT EXISTS public.grading_options (
  id TEXT PRIMARY KEY,
  criterion_id TEXT NOT NULL REFERENCES public.grading_criteria(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  points INTEGER NOT NULL,
  grade_cap TEXT CHECK (grade_cap IN ('A+', 'A', 'B', 'C', 'D')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (criterion_id, value)
);

-- 3. Device grades submitted by sellers, buyers or admins
CREATE TABLE IF NOT EXISTS public.device_grades (
  id TEXT PRIMARY KEY,
  listing_id TEXT REFERENCES public.listings(id) ON DELETE CASCADE,
  order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
  grader_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  grader_role TEXT NOT NULL CHECK (grader_role IN ('SELLER', 'BUYER', 'ADMIN')),
  product_label TEXT NOT NULL DEFAULT '',
  answers_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  condition_score INTEGER NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('A+', 'A', 'B', 'C', 'D')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_device_grades_listing ON public.device_grades(listing_id);
CREATE INDEX IF NOT EXISTS idx_device_grades_order ON public.device_grades(order_id);
CREATE INDEX IF NOT EXISTS idx_device_grades_grader ON public.device_grades(grader_id);

ALTER TABLE public.grading_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_grades ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.grading_criteria TO anon, authenticated;
GRANT SELECT ON public.grading_options TO anon, authenticated;
GRANT SELECT ON public.device_grades TO anon, authenticated;
GRANT ALL ON public.grading_criteria TO service_role;
GRANT ALL ON public.grading_options TO service_role;
GRANT ALL ON public.device_grades TO service_role;

-- Read-only public access to the checklist; all writes go through the app
-- server using the service role key (service_role bypasses RLS).
DROP POLICY IF EXISTS "Public read grading criteria" ON public.grading_criteria;
CREATE POLICY "Public read grading criteria" ON public.grading_criteria FOR SELECT USING (active);

DROP POLICY IF EXISTS "Public read grading options" ON public.grading_options;
CREATE POLICY "Public read grading options" ON public.grading_options FOR SELECT USING (true);

-- Grades attached to a listing are public trust data; personal (unattached)
-- grades stay server-only.
DROP POLICY IF EXISTS "Public read listing grades" ON public.device_grades;
CREATE POLICY "Public read listing grades" ON public.device_grades
  FOR SELECT USING (listing_id IS NOT NULL);

-- 4. Seed the checklist (matches src/data/grading.ts)
INSERT INTO public.grading_criteria (id, label, help, weight, sort_order) VALUES
  ('physical', 'Body & frame', 'Cosmetic condition of the chassis, edges and back panel.', 25, 1),
  ('screen', 'Screen / display', 'Scratches, burn-in, dead pixels or discolouration.', 25, 2),
  ('functionality', 'Functionality', 'Buttons, cameras, speakers, ports and connectivity.', 25, 3),
  ('battery', 'Battery health', 'Reported battery health percentage (or N/A for devices without a battery).', 15, 4),
  ('repairs', 'Repairs & replaced parts', 'Any part that is not the original factory component.', 10, 5)
ON CONFLICT (id) DO UPDATE
  SET label = EXCLUDED.label, help = EXCLUDED.help,
      weight = EXCLUDED.weight, sort_order = EXCLUDED.sort_order;

INSERT INTO public.grading_options (id, criterion_id, value, label, points, grade_cap, sort_order) VALUES
  ('physical-pristine', 'physical', 'pristine', 'No signs of use', 25, NULL, 1),
  ('physical-minor', 'physical', 'minor', 'Minor marks, visible only up close', 20, 'A', 2),
  ('physical-visible', 'physical', 'visible', 'Visible wear or scuffs', 14, 'B', 3),
  ('physical-damage', 'physical', 'damage', 'Dents, cracks or bends', 6, 'C', 4),
  ('screen-original', 'screen', 'original', 'Original panel', 25, NULL, 1),
  ('screen-micro', 'screen', 'micro', 'Micro-scratches under light', 20, 'A', 2),
  ('screen-scratches', 'screen', 'scratches', 'Visible scratches', 14, 'B', 3),
  ('screen-defect', 'screen', 'defect', 'Dead pixels or crack', 5, 'C', 4),
  ('screen-replaced', 'screen', 'replaced', 'Display changed', 10, 'B', 5),
  ('functionality-full', 'functionality', 'full', 'Everything works as expected', 25, NULL, 1),
  ('functionality-minor-fault', 'functionality', 'minor-fault', 'One minor fault, disclosed', 15, 'C', 2),
  ('functionality-faults', 'functionality', 'faults', 'Multiple faults or limitations', 5, 'D', 3),
  ('battery-95', 'battery', '95', '95% or above / not applicable', 15, NULL, 1),
  ('battery-90', 'battery', '90', '90 - 94%', 12, 'A', 2),
  ('battery-80', 'battery', '80', '80 - 89%', 8, 'B', 3),
  ('battery-low', 'battery', 'low', 'Below 80%', 4, 'C', 4),
  ('repairs-none', 'repairs', 'none', 'None - all original parts', 10, NULL, 1),
  ('repairs-official', 'repairs', 'official', 'Official service repair, documented', 7, 'B', 2),
  ('repairs-third-party', 'repairs', 'third-party', 'Third-party repair', 4, 'C', 3)
ON CONFLICT (id) DO UPDATE
  SET label = EXCLUDED.label, points = EXCLUDED.points,
      grade_cap = EXCLUDED.grade_cap, sort_order = EXCLUDED.sort_order;
