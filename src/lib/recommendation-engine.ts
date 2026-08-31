import {
  products,
  listings,
  productFor,
  listingsFor,
  type Product,
  type Listing,
} from "@/data/catalog";
import { isListingPubliclyEligible } from "./listing-eligibility";
import type { OrderRecord } from "./order-store";
import type { AuthUser } from "./auth-store";

export type RecommendationReason = "same-category-and-brand" | "same-category" | "fallback";

export interface RecentOrderRecommendationItem {
  listing: Listing;
  product: Product;
  reason: RecommendationReason;
}

export interface RecentOrderShelfResult {
  shelfTitle: string;
  subtitle: string;
  sourceProductName: string;
  sourceOrderDate: string;
  items: RecentOrderRecommendationItem[];
}

export interface PersonalizedShelvesResult {
  recentOrderShelf: RecentOrderShelfResult | null;
  /**
   * Saved Searches infrastructure (Phase 4.3) is not yet implemented in the database.
   * Data-truth rule: Explicitly report unavailable dependency rather than fabricating state.
   */
  savedSearchesStatus: "UNAVAILABLE_DEPENDENCY_NOT_IMPLEMENTED";
  /**
   * Favorites infrastructure (Phase 4.3) is not yet implemented in the database.
   * Data-truth rule: Explicitly report unavailable dependency rather than fabricating state.
   */
  favoritesStatus: "UNAVAILABLE_DEPENDENCY_NOT_IMPLEMENTED";
}

/**
 * Checks if an order qualifies as a valid purchase signal for recommendations.
 * Excludes cancelled, refunded, and refund-requested orders.
 */
export function isOrderQualifying(order: OrderRecord): boolean {
  if (!order || !Array.isArray(order.items) || order.items.length === 0) {
    return false;
  }
  const nonQualifyingStatuses = ["CANCELLED", "REFUNDED", "REFUND_REQUESTED"];
  if (nonQualifyingStatuses.includes(order.orderStatus)) {
    return false;
  }
  if (order.refundStatus === "REFUNDED" || order.refundStatus === "REQUESTED") {
    return false;
  }
  return true;
}

/**
 * Generates deterministic rule-based recommendations derived strictly from a real qualifying order.
 * Priority:
 * 1. Same category AND same brand
 * 2. Same category
 * 3. Other catalog matches (if needed to fill requested limit)
 *
 * Excludes the exact listing purchased and avoids duplicates.
 */
export function getRecommendationsFromRecentOrder(
  order: OrderRecord,
  options?: {
    limit?: number;
    excludeListingIds?: string[];
    excludeProductIds?: string[];
  },
): RecentOrderShelfResult | null {
  if (!isOrderQualifying(order)) {
    return null;
  }

  // Identify the source item and its canonical product
  const sourceItem = order.items.find((item) => productFor(item.productId));
  if (!sourceItem) {
    return null;
  }

  const sourceProduct = productFor(sourceItem.productId);
  if (!sourceProduct) {
    return null;
  }

  const limit = options?.limit ?? 4;
  const excludeListingIds = new Set<string>([
    sourceItem.listingId,
    ...(options?.excludeListingIds ?? []),
  ]);
  const excludeProductIds = new Set<string>(options?.excludeProductIds ?? []);

  // Filter available listings in active catalog
  const availableListings = listings.filter(
    (l) =>
      isListingPubliclyEligible(l) &&
      !excludeListingIds.has(l.id) &&
      !excludeProductIds.has(l.productId),
  );

  // Group candidate listings by recommendation priority
  const tier1: RecentOrderRecommendationItem[] = []; // Same Category + Same Brand
  const tier2: RecentOrderRecommendationItem[] = []; // Same Category + Different Brand
  const tier3: RecentOrderRecommendationItem[] = []; // Other Categories (fallback)

  // Track added products to ensure variety (one listing per product model)
  const seenProductIds = new Set<string>([sourceProduct.id]);

  for (const listing of availableListings) {
    const p = productFor(listing.productId);
    if (!p || seenProductIds.has(p.id)) continue;

    if (p.category === sourceProduct.category && p.brand === sourceProduct.brand) {
      tier1.push({ listing, product: p, reason: "same-category-and-brand" });
      seenProductIds.add(p.id);
    }
  }

  for (const listing of availableListings) {
    const p = productFor(listing.productId);
    if (!p || seenProductIds.has(p.id)) continue;

    if (p.category === sourceProduct.category && p.brand !== sourceProduct.brand) {
      tier2.push({ listing, product: p, reason: "same-category" });
      seenProductIds.add(p.id);
    }
  }

  for (const listing of availableListings) {
    const p = productFor(listing.productId);
    if (!p || seenProductIds.has(p.id)) continue;

    if (p.category !== sourceProduct.category) {
      tier3.push({ listing, product: p, reason: "fallback" });
      seenProductIds.add(p.id);
    }
  }

  const combinedItems = [...tier1, ...tier2, ...tier3].slice(0, limit);

  if (combinedItems.length === 0) {
    return null;
  }

  return {
    shelfTitle: "Based on your recent order",
    subtitle: `Because you ordered ${sourceProduct.name}`,
    sourceProductName: sourceProduct.name,
    sourceOrderDate: order.date,
    items: combinedItems,
  };
}

/**
 * Consolidated "You May Also Like" recommendation logic for canonical product pages (/product/$productId).
 * Matches:
 * 1. Same category & same brand
 * 2. Same category & other brand
 * 3. Other categories
 */
export function getProductRecommendations(productId: string, limit: number = 4): Product[] {
  const currentProduct = productFor(productId);
  if (!currentProduct) return [];

  const others = products.filter((p) => p.id !== currentProduct.id && listingsFor(p.id).length > 0);
  const sameCategorySameBrand = others.filter(
    (p) => p.category === currentProduct.category && p.brand === currentProduct.brand,
  );
  const sameCategoryOtherBrand = others.filter(
    (p) => p.category === currentProduct.category && p.brand !== currentProduct.brand,
  );
  const otherCategories = others.filter((p) => p.category !== currentProduct.category);

  return [...sameCategorySameBrand, ...sameCategoryOtherBrand, ...otherCategories].slice(0, limit);
}

/**
 * Editorial fallback content consisting of curated catalog listings.
 * Used for guests or users without qualifying order history.
 * NOTE: This is curated editorial content and must never be labeled as personalized.
 */
export function getEditorialFallback(
  limit: number = 4,
): Array<{ listing: Listing; product: Product }> {
  return listings.slice(0, limit).flatMap((l) => {
    const p = productFor(l.productId);
    return p ? [{ listing: l, product: p }] : [];
  });
}

/**
 * Orchestrator returning the authenticated user's personalized shelves.
 * Only returns a shelf if actual qualifying behavioral history exists.
 * Does NOT generate fake data for guest users or users with empty/cancelled order history.
 */
export function getUserPersonalizedShelves(
  user: AuthUser | null,
  orders: OrderRecord[],
  options?: { limit?: number },
): PersonalizedShelvesResult {
  if (!user || (!user.phone && !user.id && !user.email)) {
    return {
      recentOrderShelf: null,
      savedSearchesStatus: "UNAVAILABLE_DEPENDENCY_NOT_IMPLEMENTED",
      favoritesStatus: "UNAVAILABLE_DEPENDENCY_NOT_IMPLEMENTED",
    };
  }

  // Filter orders genuinely belonging to this authenticated user
  const userPhone = user.phone ? user.phone.replace(/\D/g, "") : "";
  const userEmail = user.email?.trim().toLowerCase();

  const userOrders = orders.filter((order) => {
    // If order has buyerContact phone, match it
    if (userPhone && order.buyerContact?.phone) {
      const orderPhone = order.buyerContact.phone.replace(/\D/g, "");
      if (orderPhone && orderPhone === userPhone) return true;
    }
    // If shipping address phone matches
    if (userPhone && order.shippingAddress?.phone) {
      const shippingPhone = order.shippingAddress.phone.replace(/\D/g, "");
      if (shippingPhone && shippingPhone === userPhone) return true;
    }
    // If email matches
    if (userEmail && order.shippingAddress?.address?.toLowerCase().includes(userEmail)) {
      return true;
    }
    return false;
  });

  // Filter for qualifying non-cancelled orders
  const qualifyingOrders = userOrders.filter(isOrderQualifying);

  if (qualifyingOrders.length === 0) {
    return {
      recentOrderShelf: null,
      savedSearchesStatus: "UNAVAILABLE_DEPENDENCY_NOT_IMPLEMENTED",
      favoritesStatus: "UNAVAILABLE_DEPENDENCY_NOT_IMPLEMENTED",
    };
  }

  // Sort qualifying orders to find the most relevant recent purchase
  // Prioritize DELIVERED / COMPLETED over in-transit, and latest date/createdAt
  const sortedOrders = [...qualifyingOrders].sort((a, b) => {
    const statusPriority = (status: string) => {
      if (status === "COMPLETED" || status === "DELIVERED") return 2;
      return 1;
    };
    const priorityDiff = statusPriority(b.orderStatus) - statusPriority(a.orderStatus);
    if (priorityDiff !== 0) return priorityDiff;

    const dateA = new Date(a.createdAt || a.date).getTime();
    const dateB = new Date(b.createdAt || b.date).getTime();
    return dateB - dateA;
  });

  const mostRecentOrder = sortedOrders[0];
  if (!mostRecentOrder) {
    return {
      recentOrderShelf: null,
      savedSearchesStatus: "UNAVAILABLE_DEPENDENCY_NOT_IMPLEMENTED",
      favoritesStatus: "UNAVAILABLE_DEPENDENCY_NOT_IMPLEMENTED",
    };
  }

  const recentOrderShelf = getRecommendationsFromRecentOrder(mostRecentOrder, options);

  return {
    recentOrderShelf,
    savedSearchesStatus: "UNAVAILABLE_DEPENDENCY_NOT_IMPLEMENTED",
    favoritesStatus: "UNAVAILABLE_DEPENDENCY_NOT_IMPLEMENTED",
  };
}
