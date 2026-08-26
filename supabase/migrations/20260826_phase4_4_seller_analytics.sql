-- ==============================================================================
-- Phase 4.4 Seller Analytics Intelligence - Migration & Optimizations
-- ==============================================================================

-- 1. Optimized composite indexes for fast seller analytics aggregation
CREATE INDEX IF NOT EXISTS idx_user_events_entity_lookup 
ON public.user_events(entity_type, entity_id, event_type);

CREATE INDEX IF NOT EXISTS idx_user_events_analytics_aggregation 
ON public.user_events(event_type, entity_id, occurred_at);

CREATE INDEX IF NOT EXISTS idx_orders_seller_listing_status 
ON public.orders(listing_id, status);

CREATE INDEX IF NOT EXISTS idx_disputes_order_lookup 
ON public.disputes(order_id, status);
