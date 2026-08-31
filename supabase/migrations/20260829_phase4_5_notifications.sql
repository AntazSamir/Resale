-- ==============================================================================
-- Resale.com — Phase 4.5 Notifications Infrastructure Migration
-- In-app notification system: buyers receive real-time updates on orders,
-- disputes, price drops, and saved search matches.
-- ==============================================================================

-- 1. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (
    type IN (
      'ORDER_PLACED', 'ORDER_CONFIRMED', 'ORDER_STATUS_UPDATED', 'ORDER_DELIVERED',
      'ORDER_CANCELLED', 'DISPUTE_FILED', 'DISPUTE_STATUS_UPDATED', 'DISPUTE_RESOLVED',
      'DISPUTE_SLA_WARNING', 'PRICE_DROP', 'SAVED_SEARCH_MATCH',
      'LISTING_MODERATION_APPROVED', 'LISTING_MODERATION_REJECTED'
    )
  ),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  reference TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (
    type IN (
      'ORDER_PLACED', 'ORDER_CONFIRMED', 'ORDER_STATUS_UPDATED', 'ORDER_DELIVERED',
      'ORDER_CANCELLED', 'DISPUTE_FILED', 'DISPUTE_STATUS_UPDATED', 'DISPUTE_RESOLVED',
      'DISPUTE_SLA_WARNING', 'PRICE_DROP', 'SAVED_SEARCH_MATCH',
      'LISTING_MODERATION_APPROVED', 'LISTING_MODERATION_REJECTED'
    )
  ),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, type)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notification_prefs_user ON public.notification_preferences(user_id);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- ── Notifications Policies ──
-- Users can read their own notifications
DROP POLICY IF EXISTS "Allow user read own notifications" ON public.notifications;
CREATE POLICY "Allow user read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
DROP POLICY IF EXISTS "Allow user update own notifications" ON public.notifications;
CREATE POLICY "Allow user update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own notifications (server-side via service role; this is a safety net)
DROP POLICY IF EXISTS "Allow user insert own notifications" ON public.notifications;
CREATE POLICY "Allow user insert own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- No anonymous DELETE on notifications
DROP POLICY IF EXISTS "Allow anonymous delete notifications" ON public.notifications;

-- ── Notification Preferences Policies ──
-- Users can read their own preferences
DROP POLICY IF EXISTS "Allow user read own preferences" ON public.notification_preferences;
CREATE POLICY "Allow user read own preferences" ON public.notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own preferences
DROP POLICY IF EXISTS "Allow user update own preferences" ON public.notification_preferences;
CREATE POLICY "Allow user update own preferences" ON public.notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own preferences
DROP POLICY IF EXISTS "Allow user insert own preferences" ON public.notification_preferences;
CREATE POLICY "Allow user insert own preferences" ON public.notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── Default Preferences (seed all 13 types for each existing user) ──
-- Note: This seed runs for users that exist at migration time.
-- New users get default preferences via server-side logic on first login.
DO $$
DECLARE
  rec RECORD;
  notif_type TEXT;
BEGIN
  FOR rec IN SELECT id FROM public.users LOOP
    FOREACH notif_type IN ARRAY ARRAY[
      'ORDER_PLACED', 'ORDER_CONFIRMED', 'ORDER_STATUS_UPDATED', 'ORDER_DELIVERED',
      'ORDER_CANCELLED', 'DISPUTE_FILED', 'DISPUTE_STATUS_UPDATED', 'DISPUTE_RESOLVED',
      'DISPUTE_SLA_WARNING', 'PRICE_DROP', 'SAVED_SEARCH_MATCH',
      'LISTING_MODERATION_APPROVED', 'LISTING_MODERATION_REJECTED'
    ] LOOP
      INSERT INTO public.notification_preferences (id, user_id, type, enabled, created_at, updated_at)
      VALUES (
        'pref-' || rec.id || '-' || notif_type,
        rec.id,
        notif_type,
        TRUE,
        NOW(),
        NOW()
      )
      ON CONFLICT (user_id, type) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Ensure service role can work with notification tables
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;