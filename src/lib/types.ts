/**
 * Phase 4.2 Event Type System.
 *
 * Exactly 12 event types total:
 * - 10 currently active events (used in Phase 4.2)
 * - 2 reserved events (FAVORITE_ADDED, FAVORITE_REMOVED) for Phase 4.3
 *
 * The enum is implemented as a CHECK‑constrained TEXT column in PostgreSQL
 * plus a TypeScript union for compile‑time safety.
 */

// === 10 ACTIVE EVENT TYPES (Phase 4.2) ===
export const ACTIVE_EVENT_TYPES = [
  "PRODUCT_VIEWED",
  "LISTING_VIEWED",
  "SEARCH_PERFORMED",
  "FILTER_APPLIED",
  "CART_ADDED",
  "CART_REMOVED",
  "CHECKOUT_STARTED",
  "ORDER_COMPLETED",
  "STORE_VIEWED",
  "CREATOR_VIDEO_PLAYED",
] as const;

export type ActiveEventType = (typeof ACTIVE_EVENT_TYPES)[number];

// === 2 RESERVED EVENT TYPES (Phase 4.3 – Favorites) ===
export const RESERVED_EVENT_TYPES = ["FAVORITE_ADDED", "FAVORITE_REMOVED"] as const;

export type ReservedEventType = (typeof RESERVED_EVENT_TYPES)[number];

// === ALL 12 EVENT TYPES (union for convenience) ===
export type EventType = ActiveEventType | ReservedEventType;

// === Event type validation ===
/**
 * Narrow a string to an ActiveEventType.
 * Returns the input if valid, otherwise never.
 */
export function isActiveEventType(t: string): t is ActiveEventType {
  return ACTIVE_EVENT_TYPES.includes(t as ActiveEventType);
}

/**
 * Narrow a string to a ReservedEventType.
 */
export function isReservedEventType(t: string): t is ReservedEventType {
  return RESERVED_EVENT_TYPES.includes(t as ReservedEventType);
}

/**
 * Narrow a string to the full EventType union.
 */
export function isEventType(t: string): t is EventType {
  return isActiveEventType(t) || isReservedEventType(t);
}

// === Metadata key whitelist ===
// These are the ONLY keys allowed in metadata_json for any event.
// Any other key will be stripped by the event tracker, with a dev warning.
export const SAFE_METADATA_KEYS = [
  "category",
  "brand",
  "grade",
  "price",
  "resultCount",
  "queryLength",
  "discountPercentage",
] as const;

export type SafeMetadataKey = (typeof SAFE_METADATA_KEYS)[number];

export function isSafeMetadataKey(k: string): k is SafeMetadataKey {
  return SAFE_METADATA_KEYS.includes(k as SafeMetadataKey);
}

// Strip disallowed metadata keys; return only safe ones.
export function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (isSafeMetadataKey(key)) {
      safe[key] = value;
    }
  }
  return safe;
}

// === Session‑ID‑aware user resolution ===
export interface EventUserContext {
  userId: string | null; // null = anonymous; otherwise supabase user ID
  sessionId: string;
}

// Extract from auth store and session-id utility.
export function useEventUserContext(): EventUserContext {
  // This hook would be used inside an React component with useAuth()
  // and the session-id utility. Placed here for type definition.
  // Use getSessionIdSafe() at runtime; here we return a placeholder.
  return {
    userId: null,
    sessionId: "",
  };
}

// =======================================
// Do NOT export runtime values at module level,
// because sessionStorage is browser‑only.
// Use the exported functions to read/clear at runtime.
// =======================================
