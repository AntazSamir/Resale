import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, ShieldCheck, Star, User } from "lucide-react";
import type { SellerTrustTier } from "@/lib/types";

interface SellerTrustBadgeProps {
  tier: SellerTrustTier;
  isNidVerified?: boolean;
  isStoreVerified?: boolean;
  className?: string;
}

const TIER_CONFIG: Record<
  SellerTrustTier,
  { label: string; color: string; icon: React.ReactNode }
> = {
  NEW_SELLER: {
    label: "New Seller",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: <User className="w-3 h-3" />,
  },
  RISING: {
    label: "Rising Seller",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    icon: <Star className="w-3 h-3" />,
  },
  VERIFIED_MERCHANT: {
    label: "Verified Merchant",
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    icon: <ShieldCheck className="w-3 h-3" />,
  },
  TOP_RATED: {
    label: "Top Rated Merchant",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    icon: <CheckCircle className="w-3 h-3" />,
  },
};

export function SellerTrustBadge({
  tier,
  isNidVerified,
  isStoreVerified,
  className,
}: SellerTrustBadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <div className={cn("flex flex-wrap gap-1.5 items-center", className)}>
      {/* Primary Trust Tier Badge */}
      <div
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border",
          config.color,
        )}
      >
        {config.icon}
        {config.label}
      </div>

      {/* Secondary Verification Pills */}
      {isNidVerified && (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-green-50 text-green-600 border-green-200">
          <CheckCircle className="w-3 h-3" />
          NID Verified
        </div>
      )}
      {isStoreVerified && (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-purple-50 text-purple-600 border-purple-200">
          <ShieldCheck className="w-3 h-3" />
          Verified Outlet
        </div>
      )}
    </div>
  );
}
