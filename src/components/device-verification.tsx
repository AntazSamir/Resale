import { ShieldCheck, Info, Lock, AlertTriangle } from "lucide-react";
import { type DeviceVerification, type InspectionItem } from "@/data/catalog";

interface DeviceVerificationCardProps {
  deviceVerification?: DeviceVerification | undefined;
  inspection?: InspectionItem[] | undefined;
  className?: string | undefined;
}

export function DeviceVerificationCard({
  deviceVerification,
  inspection = [],
  className = "",
}: DeviceVerificationCardProps) {
  // If structured deviceVerification is available
  if (deviceVerification) {
    const imeiLabel =
      deviceVerification.imeiStatus === "clean"
        ? "Stated as clean"
        : deviceVerification.imeiStatus === "blacklisted"
          ? "Blacklisted / Flagged"
          : "Status unrecorded";

    const carrierLabel =
      deviceVerification.carrierStatus === "unlocked"
        ? "Stated as unlocked"
        : deviceVerification.carrierStatus === "locked"
          ? "Carrier locked"
          : "Status unrecorded";

    const lockLabel =
      deviceVerification.activationLock === "cleared"
        ? "Stated as cleared"
        : deviceVerification.activationLock === "active"
          ? "Active lock"
          : "Status unrecorded";

    const accountLabel =
      deviceVerification.accountRemoved === true
        ? "Stated as removed"
        : deviceVerification.accountRemoved === false
          ? "Account present"
          : "Status unrecorded";

    return (
      <div className={`border border-border/80 bg-card p-6 space-y-5 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <h2 className="font-display text-xl font-bold text-foreground">
                Device Verification
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Serial, cloud locks, and network status checks
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 uppercase tracking-wider">
            <AlertTriangle className="size-3.5" />
            SAMPLE VERIFICATION DATA — NOT LIVE-CHECKED
          </span>
        </div>

        {/* 4 Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 border border-border/60 bg-background/50 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block font-medium">
              Serial / Diagnostic
            </span>
            <span className="font-semibold text-foreground text-sm">{imeiLabel}</span>
          </div>

          <div className="p-3.5 border border-border/60 bg-background/50 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block font-medium">
              Camera &amp; Network
            </span>
            <span className="font-semibold text-foreground text-sm">{carrierLabel}</span>
          </div>

          <div className="p-3.5 border border-border/60 bg-background/50 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block font-medium">
              Activation Lock
            </span>
            <span className="font-semibold text-foreground text-sm">{lockLabel}</span>
          </div>

          <div className="p-3.5 border border-border/60 bg-background/50 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block font-medium">
              User Account Removal
            </span>
            <span className="font-semibold text-foreground text-sm">{accountLabel}</span>
          </div>
        </div>

        {/* Policy Footer Note */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
          <Lock className="size-3.5 text-muted-foreground shrink-0" />
          <span>
            IMEI and serial number are verified during listing moderation and shared with buyer
            after purchase.
          </span>
        </div>
      </div>
    );
  }

  // Fallback: Deriving from inspection items
  const securityItems = inspection.filter((item) => {
    const comp = item.component.toLowerCase();
    return (
      comp.includes("activation") ||
      comp.includes("network") ||
      comp.includes("account") ||
      comp.includes("lock") ||
      comp.includes("water") ||
      comp.includes("repairs")
    );
  });

  return (
    <div className={`border border-border/80 bg-card p-6 space-y-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Device Verification</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cloud locks, network status, and account checks
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 border text-[11px] font-medium bg-secondary text-muted-foreground border-border/60">
          From inspection notes — not independently verified
        </span>
      </div>

      {securityItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {securityItems.map((item, idx) => (
            <div key={idx} className="p-3.5 border border-border/50 bg-background/40 space-y-1">
              <span className="text-[11px] text-muted-foreground block font-medium">
                {item.component}
              </span>
              <span className="font-semibold text-foreground text-sm">{item.status}</span>
              {item.notes && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.notes}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-secondary/30 border border-border/50 text-xs text-muted-foreground">
          No specific security or diagnostic status items recorded in inspection notes.
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
        <Info className="size-3.5 text-muted-foreground shrink-0" />
        <span>IMEI and serial number are shared with the buyer after purchase.</span>
      </div>
    </div>
  );
}
