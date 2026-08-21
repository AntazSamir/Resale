import { useState } from "react";
import { Star, ShieldCheck, MapPin, CheckCircle2, UserCheck } from "lucide-react";
import { type Listing } from "@/data/catalog";

interface SellerTrustProps {
  seller: Listing["seller"];
  className?: string | undefined;
}

/**
 * Compact trust line designed to sit at the very top of the product info column.
 * [Avatar] Name  ✓ Verified Seller · Location · Rating
 */
export function SellerTrustLine({ seller, className = "" }: SellerTrustProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
      {/* Seller Avatar / Initial */}
      <div className="size-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-semibold text-[11px] shrink-0">
        {seller.name.charAt(0)}
      </div>

      {/* Seller Name */}
      <span className="font-semibold text-foreground">{seller.name}</span>

      {/* Verified Badge */}
      {seller.verified ? (
        <div className="relative inline-flex items-center">
          <button
            type="button"
            onClick={() => setShowTooltip((prev) => !prev)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-medium transition-colors hover:bg-emerald-500/20"
            title="NID Verified Seller"
          >
            <ShieldCheck className="size-3 shrink-0" />
            <span>Verified Seller</span>
          </button>

          {showTooltip && (
            <div className="absolute left-0 top-full mt-1.5 z-30 w-64 p-2.5 bg-popover border border-border text-[11px] text-popover-foreground shadow-lg leading-relaxed rounded">
              Seller submitted identity documentation during platform onboarding. Demo verification
              data.
            </div>
          )}
        </div>
      ) : (
        <span className="text-[10px] text-muted-foreground bg-secondary/80 px-1.5 py-0.5 border border-border/40 rounded">
          Unverified Seller
        </span>
      )}

      {/* Location */}
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground flex items-center gap-0.5">
        <MapPin className="size-3 shrink-0" />
        {seller.area ? `${seller.area}, ` : ""}
        {seller.district}
      </span>

      {/* Rating */}
      <span className="text-muted-foreground">·</span>
      <span className="inline-flex items-center gap-0.5 text-muted-foreground">
        <Star className="size-3 fill-amber-400 text-amber-400 shrink-0" />
        <span className="font-medium text-foreground">{seller.rating.toFixed(1)}</span>
        <span>({seller.sales})</span>
      </span>
    </div>
  );
}

/**
 * Standard Seller Trust Card
 */
export function SellerTrustCard({ seller, className = "" }: SellerTrustProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`border border-border/70 bg-card/60 p-4 space-y-3 ${className}`}>
      {/* Seller Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-display font-bold text-sm">
            {seller.name.charAt(0)}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-foreground">{seller.name}</span>
              {seller.verified ? (
                <div className="relative inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowTooltip((prev) => !prev)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold"
                    title="NID Verified Seller"
                  >
                    <ShieldCheck className="size-3" />
                    <span>Verified Seller</span>
                  </button>

                  {showTooltip && (
                    <div className="absolute left-0 top-full mt-1.5 z-30 w-64 p-2.5 bg-popover border border-border text-[11px] text-popover-foreground shadow-lg leading-relaxed rounded">
                      This seller submitted identity documents for verification in the
                      platform&apos;s onboarding process. Sample/demo data.
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 border border-border/40 rounded">
                  Identity not verified
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
              <MapPin className="size-3 shrink-0" />
              <span>
                {seller.area ? `${seller.area}, ` : ""}
                {seller.district}
              </span>
            </div>
          </div>
        </div>

        {/* Rating & Sales */}
        <div className="text-right">
          <div className="inline-flex items-center gap-1 font-semibold text-xs text-foreground">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span>{seller.rating.toFixed(1)}</span>
          </div>
          <p className="text-[10.5px] text-muted-foreground mt-0.5">
            {seller.sales} completed sale{seller.sales !== 1 ? "s" : ""}
          </p>
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
