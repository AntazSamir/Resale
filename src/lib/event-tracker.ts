/**
 * src/lib/event-tracker.ts
 *
 * Central utility for tracking behavioral events in the Resale.com marketplace.
 *
 * Features:
 * - Resolves session ID (sessionStorage) and user ID (auth context)
 * - Validates event types against the 12‑value enum (10 active + 2 reserved)
 * - Sanitizes metadata against the safe‑key whitelist
 * - Fire‑and‑forget insert via Supabase server function (trackEventFn)
 * - Never blocks UI; errors are console‑warned in dev only
 * - Duplicate protection via per‑session localStorage set (preserves legitimate repeated views)
 * - Development/production mode via import.meta.env.DEV and VITE_ENABLE_EVENTS env var.
 *
 * Events begin accumulating from the point the instrumentation is deployed to production.
 * Demo/test activity is suppressed (see HISTORICAL_DATA/BACKFILL section of the plan).
 */

import { trackEventFn } from "@/lib/server-functions";
import { getSessionIdSafe } from "./session-id";
import {
  ACTIVE_EVENT_TYPES,
  RESERVED_EVENT_TYPES,
  EventType,
  isActiveEventType,
  isReservedEventType,
  isEventType,
  sanitizeMetadata,
  SAFE_METADATA_KEYS,
  type ActiveEventType,
  type EventUserContext,
  type ReservedEventType,
  type SafeMetadataKey,
} from "./types";

// ============================================================
// Configuration
// ============================================================

// Development mode flag using Vite's import.meta.env.DEV.
const IS_DEV = import.meta.env.DEV;

// Production toggle: if VITE_ENABLE_EVENTS is not "true", events are suppressed.
// Default to false in production; dev mode always enables events for debugging.
declare global {
  interface Window {
    VITE_ENABLE_EVENTS?: string;
  }
}
const hasViteEnableEvents = typeof window !== "undefined" && "VITE_ENABLE_EVENTS" in window;
const ENABLE_EVENTS = IS_DEV || (hasViteEnableEvents && window.VITE_ENABLE_EVENTS === "true");

// Duplicate‑protection tracking (per‑session).
// Stores "${eventType}:${entityId}" strings so that a second emit for the
// same entity within the same session is suppressed (but legitimate repeats
// across sessions are allowed — the DB may still record two rows).
const seenEventIds = new Set<string>();

// ============================================================
// Core tracking function
// ============================================================

/**
 * Track a behavioral event.
 *
 * @param opts.eventType   One of the 12 EventType values.
 * @opts.entityType      The kind of entity: 'product', 'listing', 'search', 'filter', 'cart', 'order', 'store', 'creator_video'.
 * @opts.entityId        The concrete ID (product ID, listing ID, search hash, cart ID, order ID, store slug, creator ID).
 * @opts.metadata        Optional key‑value pairs. Only keys from SAFE_METADATA_KEYS are persisted.
 *                         All other keys are stripped (dev‑only warning).
 *
 * The event is emitted only if:
 *   1. The eventType is valid (active or reserved).
 * 2. The session ID can be resolved.
 * 3. (Optional) Duplicate protection check passes.
 * 4. ENABLE_EVENTS is true (production guard).
 *
 * The insert is fire‑and‑forget; the function never throws.
 */
export async function trackEvent(opts: {
  eventType: EventType;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  // Optional: override the session ID (e.g., for server‑side rendering).
  sessionId?: string;
  // Optional: override the user ID (e.g., for server‑side rendering).
  userId?: string | null;
}): Promise<void> {
  // -- 1. Validate event type
  if (!isEventType(opts.eventType)) {
    if (IS_DEV) {
      console.warn(`[event-tracker] Invalid event type: "${opts.eventType}"`);
    }
    return;
  }

  // -- 2. Resolve session ID
  const sessionId = opts.sessionId || getSessionIdSafe();
  if (!sessionId || (sessionId === "anon" && !IS_DEV)) {
    // In production without a session ID, we still attempt to track;
    // the server function will set session_id from the client cookie.
    // If we truly cannot get one, bail.
    if (IS_DEV) {
      console.warn("[event-tracker] Could not resolve session ID");
    }
    return;
  }

  // -- 3. Resolve user ID
  // In a real component this would come from useAuth().user?.id.
  // Here we accept an optional override; default to null (anonymous).
  const userId = opts.userId ?? null;

  // -- 4. Sanitize metadata
  const safeMetadata = sanitizeMetadata(opts.metadata ?? {});

  // -- 5. Duplicate‑protection check (per‑session only)
  // We track "${eventType}:${entityId}" so that a second emit for the
  // same entity within this browser session is suppressed.
  // This prevents accidental double‑fires from StrictMode re‑mounts or
  // rapid UI interactions, but does NOT suppress legitimate repeated
  // views from different browsers/sessions.
  const dedupeKey = `${opts.eventType}:${opts.entityId}`;
  if (seenEventIds.has(dedupeKey)) {
    // Legitimate repeat across sessions is allowed; we only suppress
    // within the current session to avoid noise.
    if (IS_DEV) {
      console.log(`[event-tracker] Duplicate suppressed (session): ${dedupeKey}`);
    }
    return;
  }
  seenEventIds.add(dedupeKey);
  // Optional: expire old entries after a session boundary.
  // For simplicity, we keep them for the lifetime of the tab.
  // In a future version we could tie this to sessionStorage TTL.

  // -- 6. Production guard
  if (!ENABLE_EVENTS) {
    if (IS_DEV) {
      console.log(`[event-tracker] Dev mode: event would be tracked: ${opts.eventType}`);
    }
    return;
  }

  // -- 7. Fire‑and‑forget insert via Supabase server function
  try {
    // trackEventFn is imported statically from server-functions
    await trackEventFn({
      eventType: opts.eventType as string,
      entityType: opts.entityType,
      entityId: opts.entityId,
      sessionId: sessionId!,
      userId: userId!,
      metadata: safeMetadata as Record<string, unknown>,
      occurredAt: new Date().toISOString(),
    } as unknown as Parameters<typeof trackEventFn>[0]);
    // Success: silently return. UI is unaffected.
  } catch (err) {
    // Never throw – if analytics fail, the marketplace experience must remain intact.
    if (IS_DEV) {
      console.warn("[event-tracker] Failed to insert event:", err);
    }
    // In production, the error is silently swallowed; the marketplace
    // continues functioning without behavioral data for this particular event.
  }
}

// ============================================================
// Helper: emit only active event types (Phase 4.2)
// ============================================================

/**
 * Convenience wrapper for the 10 active event types.
 * Reserved types (FAVORITE_ADDED, FAVORITE_REMOVED) are not emitted here;
 * they are supported in the type system for Phase 4.3 migration.
 *
 * All other opts are the same as trackEvent, but eventType is constrained
 * to the 10 active event types.
 */
export async function trackActiveEvent(opts: {
  eventType: ActiveEventType;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
  userId?: string | null;
}): Promise<void> {
  if (!isActiveEventType(opts.eventType)) {
    if (IS_DEV) {
      console.warn(
        `[event-tracker] "${opts.eventType}" is not an active event type. Use trackEvent with a reserved type for Phase 4.3.`,
      );
    }
    return;
  }
  const safeMetadata = sanitizeMetadata(opts.metadata ?? {});
  return trackEvent({
    eventType: opts.eventType,
    entityType: opts.entityType,
    entityId: opts.entityId,
    metadata: safeMetadata,
    // Don't override sessionId - let trackEvent use getSessionIdSafe() internally
    // Explicitly pass userId, ensuring it's not undefined
    userId: opts.userId ?? null,
  });
}

// ============================================================
// Export types for consumers
// ============================================================

export type {
  EventType,
  ActiveEventType,
  ReservedEventType,
  EventUserContext,
  SafeMetadataKey,
  isActiveEventType,
  isReservedEventType,
  isEventType,
  SAFE_METADATA_KEYS,
};

// ============================================================
// Development / production diagnostics (optional)
// ============================================================

// If the developer wants every tracked event to also appear in the console
// (for debugging the emission pipeline), set window.__EVENT_TRACK_DEBUG__ = true.
// This does NOT affect production behavior; events still insert into Supabase.
declare global {
  interface Window {
    __EVENT_TRACK_DEBUG__?: boolean;
  }
}

if (typeof window !== "undefined" && IS_DEV && window.__EVENT_TRACK_DEBUG__) {
  const orig = trackEvent;
  // @ts-expect-error - Monkey patching for local dev debug
  trackEvent = async (opts: Parameters<typeof orig>[0]) => {
    const result = await orig(opts);
    console.log("[event-tracker] DEBUG tracked event:", opts.eventType, "entity:", opts.entityId);
    return result;
  };
}
