import { Wrench, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { type RepairHistory } from "@/data/catalog";

interface RepairHistoryProps {
  repairs: string;
  repairHistory?: RepairHistory[] | undefined;
  className?: string | undefined;
}

export function RepairHistoryCard({ repairs, repairHistory, className = "" }: RepairHistoryProps) {
  const hasStructured = Array.isArray(repairHistory) && repairHistory.length > 0;
  const isNone = !hasStructured && (!repairs || repairs.trim().toLowerCase() === "none");

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <Wrench className="size-3.5 text-primary" />
        <span>Repair History</span>
      </div>

      {/* Scenario 1: No repairs recorded */}
      {isNone && (
        <div className="flex items-start gap-2.5 px-3 py-2 bg-secondary/40 border border-border/60 text-xs">
          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-medium text-foreground">
              No repairs recorded for this listing
            </span>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Seller has disclosed no aftermarket part replacements or internal servicing.
            </p>
          </div>
        </div>
      )}

      {/* Scenario 2: Structured repair items */}
      {hasStructured && (
        <div className="divide-y divide-border/40 border border-border/60 bg-secondary/30 text-xs">
          {repairHistory.map((item, index) => {
            const typeConfig =
              item.type === "official"
                ? {
                    label: "Official / Authorized",
                    badgeClass:
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                  }
                : item.type === "third-party"
                  ? {
                      label: "Third-Party",
                      badgeClass:
                        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                    }
                  : {
                      label: "Self-Serviced",
                      badgeClass:
                        "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
                    };

            return (
              <div key={index} className="p-2.5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">{item.component}</span>
                  <span
                    className={`px-1.5 py-0.5 border text-[9.5px] font-semibold uppercase tracking-wider ${typeConfig.badgeClass}`}
                  >
                    {typeConfig.label}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                  {item.date && <span>Serviced: {item.date}</span>}
                  {item.evidence && (
                    <span className="flex items-center gap-1 text-primary">
                      <FileText className="size-3" />
                      {item.evidence}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scenario 3: Free-text repair string with no structured items */}
      {!hasStructured && !isNone && (
        <div className="px-3 py-2 bg-secondary/40 border border-border/60 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <AlertTriangle className="size-3 text-amber-500 shrink-0" />
            <span>Disclosed Repairs:</span>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-4">{repairs}</p>
        </div>
      )}
    </div>
  );
}
