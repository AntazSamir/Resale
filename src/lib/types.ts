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

// === Notification Types (Phase 4.5) ===

export const NOTIFICATION_TYPES = [
  "ORDER_PLACED",
  "ORDER_CONFIRMED",
  "ORDER_STATUS_UPDATED",
  "ORDER_DELIVERED",
  "ORDER_CANCELLED",
  "DISPUTE_FILED",
  "DISPUTE_STATUS_UPDATED",
  "DISPUTE_RESOLVED",
  "DISPUTE_SLA_WARNING",
  "PRICE_DROP",
  "SAVED_SEARCH_MATCH",
  "LISTING_MODERATION_APPROVED",
  "LISTING_MODERATION_REJECTED",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationStatus = "unread" | "read";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  entity_type?: string;
  entity_id?: string;
  reference?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  type: NotificationType;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  reference?: string;
}

export interface NotificationSummary {
  total: number;
  unreadCount: number;
  notifications: Notification[];
}

// === Phase 5.1: Listing Governance & Lifecycle Types ===

export const LISTING_MODERATION_STATUSES = [
  "DRAFT",
  "PENDING_REVIEW",
  "APPROVED",
  "REJECTED",
] as const;

export type ListingModerationStatus = (typeof LISTING_MODERATION_STATUSES)[number];

export const LISTING_AVAILABILITY_STATUSES = [
  "DRAFT",
  "PENDING_REVIEW",
  "ACTIVE",
  "PAUSED",
  "RESERVED",
  "SOLD",
  "DELISTED",
  "REJECTED",
] as const;

export type ListingAvailabilityStatus = (typeof LISTING_AVAILABILITY_STATUSES)[number];

export const LISTING_AUDIT_ACTIONS = [
  "DRAFT_CREATED",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "RESUBMITTED",
  "PAUSED",
  "RESUMED",
  "DELISTED",
  "RESERVED_FOR_ORDER",
  "SOLD",
  "EDIT_TRIGGERED_REVIEW",
  "SEED_INGESTED",
] as const;

export type ListingAuditAction = (typeof LISTING_AUDIT_ACTIONS)[number];

export interface ListingAuditEntry {
  id: string;
  listingId: string;
  actorId: string;
  actorRole: "BUYER" | "SELLER" | "ADMIN" | "SYSTEM";
  action: ListingAuditAction;
  previousStatus: string | null;
  newStatus: string;
  reasonCode?: string | null;
  reasonText?: string | null;
  createdAt: string;
}

export const LISTING_REJECTION_REASONS = [
  {
    code: "INCOMPLETE_INSPECTION",
    label: "Incomplete Inspection Checklist",
    description: "Mandatory hardware checks were left unrecorded or ambiguous.",
  },
  {
    code: "SUSPICIOUS_PRICING",
    label: "Price / Market Discrepancy",
    description:
      "Listed price deviates significantly from realistic market value for this condition.",
  },
  {
    code: "UNCLEAR_OR_STOCK_PHOTOS",
    label: "Insufficient Device Photography",
    description: "Photos are blurry, stock renders, or do not clearly show the physical unit.",
  },
  {
    code: "INCONSISTENT_GRADE_DECLARATION",
    label: "Grade / Defect Inconsistency",
    description: "Declared cosmetic grade conflicts with disclosed scratches, battery, or repairs.",
  },
  {
    code: "MISSING_ACCESSORY_DISCLOSURE",
    label: "Missing Inclusions Disclosure",
    description: "Unclear whether charger, cable, or original box are included.",
  },
  {
    code: "PROHIBITED_OR_POLICY_VIOLATION",
    label: "Policy Violation",
    description:
      "Listing violates marketplace terms (e.g., locked, bypass attempted, or prohibited accessories).",
  },
] as const;

export type ListingRejectionReasonCode = (typeof LISTING_REJECTION_REASONS)[number]["code"];

export type SellerTrustTier = "NEW_SELLER" | "RISING" | "VERIFIED_MERCHANT" | "TOP_RATED";

export interface SellerTrustBreakdown {
  fulfillmentScore: number; // Max 45
  disputeScore: number; // Max 35
  identityScore: number; // Max 20
  slaScore: number | null; // Max 0 for now (until SLA tracking is mature)
}

export interface SellerTrustScoreData {
  score: number | null; // null if NEW_SELLER
  tier: SellerTrustTier;
  breakdown: SellerTrustBreakdown;
  completedOrdersCount: number;
  upheldDisputesCount: number;
  isNidVerified: boolean;
  isStoreVerified: boolean;
  dataCoverageStatement: string;
}
