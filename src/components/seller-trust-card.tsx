import { useState, useEffect } from "react";
import { Star, ShieldCheck, MapPin, CheckCircle2, UserCheck } from "lucide-react";
import { type Listing } from "@/data/catalog";
import { createServerFn } from "@tanstack/react-start";

import { StoreBadge } from "@/components/storefront/store-badge";
import { SellerTrustBadge } from "@/components/seller/seller-trust-badge";
import { SellerTrustBreakdownDialog } from "@/components/seller/seller-trust-breakdown-dialog";
import type { SellerTrustScoreData } from "@/lib/types";

interface SellerTrustProps {
  seller: Listing["seller"];
  storeId?: string | undefined;
  storeName?: string | undefined;
  className?: string | undefined;
}

/**
 * Internal server function to fetch the real trust profile.
 * This is defined here for simplicity but could be moved to server-functions.ts
 */
const fetchTrustProfile = createServerFn({ method: "POST" })
  .validator((data: { sellerId: string }) => data)
  .handler(async ({ data }) => {
    // This is a proxy to the actual getSellerTrustProfileFn in server-functions.ts
    // in a real app we would import it.
    const { getSellerTrustProfileFn } = await import("@/lib/server-functions");
    const result = await getSellerTrustProfileFn({ data: { sellerId: data.sellerId } });
    return result;
  });

/**
 * Compact trust line designed to sit at the very top of the product info column.
 * [Avatar] Name  [🏪 StoreBadge] ✓ Verified Seller · Location · Rating
 */
export function SellerTrustLine({ seller, storeId, storeName, className = "" }: SellerTrustProps) {
  const [trustData, setTrustData] = useState<SellerTrustScoreData | null>(null);

  useEffect(() => {
    const id = seller.id ?? "";
    if (!id) return;
    async function loadTrust() {
      try {
        const res = await fetchTrustProfile({ data: { sellerId: id } });
        if (res.success) setTrustData(res.data);
      } catch (e) {
        console.error("Failed to load trust profile", e);
      }
    }
    loadTrust();
  }, [seller.id]);

  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
      {/* Seller Avatar / Initial */}
      <div className="size-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-semibold text-[11px] shrink-0">
        {seller.name.charAt(0)}
      </div>

      {/* Seller Name */}
      <span className="font-semibold text-foreground">{seller.name}</span>

      {/* Optional Store Badge */}
      {(storeId || storeName) && <StoreBadge storeId={storeId} storeName={storeName} />}

      {/* Verified Trust Badge (Replacing old static verified check) */}
      {trustData && (
        <SellerTrustBadge
          tier={trustData.tier}
          isNidVerified={trustData.isNidVerified}
          isStoreVerified={trustData.isStoreVerified}
        />
      )}

      {/* Location */}
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground flex items-center gap-0.5">
        <MapPin className="size-3 shrink-0" />
        {seller.area ? `${seller.area}, ` : ""}
        {seller.district}
      </span>

      {/* Rating - Replaced with Trust Score if Established */}
      <span className="text-muted-foreground">·</span>
      <span className="inline-flex items-center gap-0.5 text-muted-foreground">
        <Star className="size-3 fill-amber-400 text-amber-400 shrink-0" />
        <span className="font-medium text-foreground">
          {trustData !== null && trustData.score !== null
            ? trustData.score
            : seller.rating.toFixed(1)}
        </span>
        <span className="text-[10px] opacity-70">
          ({trustData?.completedOrdersCount ?? seller.sales})
        </span>
      </span>
    </div>
  );
}

/**
 * Standard Seller Trust Card
 */
export function SellerTrustCard({ seller, className = "" }: SellerTrustProps) {
  const [trustData, setTrustData] = useState<SellerTrustScoreData | null>(null);

  useEffect(() => {
    const id = seller.id ?? "";
    if (!id) return;
    async function loadTrust() {
      try {
        const res = await fetchTrustProfile({ data: { sellerId: id } });
        if (res.success) setTrustData(res.data);
      } catch (e) {
        console.error("Failed to load trust profile", e);
      }
    }
    loadTrust();
  }, [seller.id]);

  return (
    <div
      className={`border border-border/70 bg-card/60 p-4 space-y-3 press-feedback card-hover-lift ${className}`}
    >
      {/* Seller Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-display font-bold text-sm">
            {seller.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-foreground">{seller.name}</span>
              {trustData && (
                <SellerTrustBadge
                  tier={trustData.tier}
                  isNidVerified={trustData.isNidVerified}
                  isStoreVerified={trustData.isStoreVerified}
                />
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              <span>
                {seller.area ? `${seller.area}, ` : ""}
                {seller.district}
              </span>
            </div>
          </div>
        </div>

        {/* Trust Score & Breakdown */}
        <div className="text-right space-y-1">
          <div className="inline-flex items-center gap-1 font-semibold text-xs text-foreground">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span>
              {trustData !== null && trustData.score !== null
                ? trustData.score
                : seller.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-[10.5px] text-muted-foreground">
              {trustData?.completedOrdersCount ?? seller.sales} completed sale
              {trustData?.completedOrdersCount !== 1 ? "s" : ""}
            </p>
            {trustData && <SellerTrustBreakdownDialog data={trustData} />}
          </div>
        </div>
      </div>

      {/* Trust Details */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-[11px]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <UserCheck className="size-3 text-emerald-500 shrink-0" />
          <span>Member Account Verified</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
          <span>Direct Seller Payout</span>
        </div>
      </div>
    </div>
  );
}
