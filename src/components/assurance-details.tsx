import { Truck, ShieldCheck, Clock, BadgeX } from "lucide-react";
import { type Listing } from "@/data/types";

export function AssuranceDetails({
  listing,
  variant = "compact",
}: {
  listing: Listing;
  variant?: "compact" | "full";
}) {
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1">
          <Truck className="size-3" />
          <span>Delivery / COD</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="size-3" />
          <span>48h Return</span>
        </div>
        <div className="flex items-center gap-1">
          {listing.warrantyMonths > 0 ? (
            <>
              <ShieldCheck className="size-3 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {listing.warrantyMonths}mo Warranty
              </span>
            </>
          ) : (
            <>
              <BadgeX className="size-3" />
              <span>No Warranty</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Full variant for listing page
  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4 bg-muted/40 border border-border rounded-md text-xs sm:text-sm">
      <div className="flex items-start gap-2.5">
        <Truck className="size-4 sm:size-5 mt-0.5 text-primary shrink-0" />
        <div>
          <span className="font-semibold text-foreground block">Nationwide Delivery Available</span>
          <span className="text-muted-foreground">
            Cash on delivery (COD) supported. Ships from {listing.seller.district}.
          </span>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <Clock className="size-4 sm:size-5 mt-0.5 text-primary shrink-0" />
        <div>
          <span className="font-semibold text-foreground block">48-Hour Buyer Protection</span>
          <span className="text-muted-foreground">
            Inspect the device at home. Return if it doesn&apos;t match the listing.
          </span>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        {listing.warrantyMonths > 0 ? (
          <>
            <ShieldCheck className="size-4 sm:size-5 mt-0.5 text-emerald-500 shrink-0" />
            <div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">
                {listing.warrantyMonths} Months Seller Warranty
              </span>
              <span className="text-muted-foreground">
                Covered by {listing.seller.name}. Keep your invoice for claims.
              </span>
            </div>
          </>
        ) : (
          <>
            <BadgeX className="size-4 sm:size-5 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <span className="font-semibold text-foreground block">No Warranty Provided</span>
              <span className="text-muted-foreground">
                Device is sold as-is after the 48-hour inspection period.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
