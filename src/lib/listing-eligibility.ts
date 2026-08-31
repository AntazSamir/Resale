/**
 * Canonical Public Listing Discovery Eligibility Rule (Phase 5.1).
 *
 * An item is eligible for public discovery (Search, Products browse, Canonical
 * product buy offers, Category carousels, and Recommendation shelves) ONLY IF:
 * 1. Its operational status is ACTIVE (or legacy PUBLISHED), AND
 * 2. Its moderation_status is APPROVED (or is a verified seed catalog unit).
 *
 * Items in DRAFT, PENDING_REVIEW, REJECTED, PAUSED, SOLD, or DELISTED
 * must never be exposed as purchasable catalog items.
 */

export interface ListingEligibilityCheckInput {
  status?: string | null | undefined;
  moderationStatus?: string | null | undefined;
  moderation_status?: string | null | undefined;
  isSeed?: boolean | null | undefined;
  is_seed?: boolean | null | undefined;
  [key: string]: unknown;
}

/**
 * Accepts any object (or null/undefined).
 * Uses structural field inspection so it is compatible with both the catalog
 * `Listing` type (status?: string) and the db listing type (status: string).
 */
export function isListingPubliclyEligible(listing: unknown): boolean {
  if (!listing || typeof listing !== "object") return false;

  const l = listing as Record<string, unknown>;
  const status = (l["status"] as string | null | undefined) ?? "";
  const moderationStatus =
    (l["moderationStatus"] as string | null | undefined) ??
    (l["moderation_status"] as string | null | undefined) ??
    "";
  const isSeed = Boolean(l["isSeed"] ?? l["is_seed"]);

  // Ineligible statuses that explicitly take precedence
  const blockedStatuses = [
    "DRAFT",
    "PENDING_REVIEW",
    "PENDING_MODERATION",
    "REJECTED",
    "PAUSED",
    "RESERVED",
    "SOLD",
    "DELISTED",
  ];
  if (blockedStatuses.includes(status) || blockedStatuses.includes(moderationStatus)) {
    return false;
  }

  // Seed listings (including static catalog listings with default/unset status) that are not blocked are eligible
  if (isSeed || (status === "" && moderationStatus === "")) {
    return true;
  }

  // Standard marketplace listings must be approved and active
  const isApproved = moderationStatus === "APPROVED" || status === "PUBLISHED";
  const isActive = status === "ACTIVE" || status === "PUBLISHED";

  return isApproved && isActive;
}
