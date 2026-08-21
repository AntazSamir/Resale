import { useMemo, useState } from "react";
import { inspectionFramework, TOTAL_INSPECTION_CHECKS, type InspectionItem } from "@/data/catalog";
import { Check, ChevronDown, ShieldCheck, Info } from "lucide-react";

interface InspectionReportProps {
  inspection: InspectionItem[];
  className?: string | undefined;
}

function getDocumentationLevel(recordedCount: number): {
  label: string;
  badgeClass: string;
  description: string;
} {
  if (recordedCount >= 25) {
    return {
      label: "Fully Documented",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      description:
        "Extensive test records across all hardware, security, and functional categories.",
    };
  }
  if (recordedCount >= 10) {
    return {
      label: "Partially Documented",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      description: "Key operational checks recorded; remaining items standard or unrecorded.",
    };
  }
  if (recordedCount >= 1) {
    return {
      label: "Minimally Documented",
      badgeClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      description: "Only basic baseline checks recorded by the seller.",
    };
  }
  return {
    label: "No Individual Checks Recorded",
    badgeClass: "bg-secondary text-muted-foreground border-border/60",
    description: "No granular line-by-line inspection records provided for this listing.",
  };
}

/**
 * Normalizes and matches an inspection check item against framework checks
 */
function findMatchingInspection(
  checkName: string,
  inspection: InspectionItem[],
): InspectionItem | undefined {
  const normCheck = checkName.toLowerCase();

  return inspection.find((item) => {
    const normComp = item.component.toLowerCase();
    // Direct or substring match
    if (normCheck.includes(normComp) || normComp.includes(normCheck)) return true;

    // Keyword heuristics
    if (
      normCheck.includes("display") &&
      (normComp.includes("screen") ||
        normComp.includes("display") ||
        normComp.includes("panel") ||
        normComp.includes("oled"))
    )
      return true;
    if (
      normCheck.includes("chassis") &&
      (normComp.includes("body") || normComp.includes("frame") || normComp.includes("titanium"))
    )
      return true;
    if (
      normCheck.includes("back cover") &&
      (normComp.includes("back") || normComp.includes("housing"))
    )
      return true;
    if (normCheck.includes("camera") && normComp.includes("camera")) return true;
    if (
      normCheck.includes("button") &&
      (normComp.includes("button") || normComp.includes("keyboard") || normComp.includes("switch"))
    )
      return true;
    if (normCheck.includes("port") && (normComp.includes("port") || normComp.includes("charging")))
      return true;
    if (normCheck.includes("battery") && normComp.includes("battery")) return true;
    if (
      normCheck.includes("charging speed") &&
      (normComp.includes("charging") || normComp.includes("power"))
    )
      return true;
    if (
      normCheck.includes("loudspeaker") &&
      (normComp.includes("speaker") || normComp.includes("audio") || normComp.includes("mic"))
    )
      return true;
    if (
      normCheck.includes("microphone") &&
      (normComp.includes("mic") || normComp.includes("speaker"))
    )
      return true;
    if (
      normCheck.includes("biometrics") &&
      (normComp.includes("face id") ||
        normComp.includes("fingerprint") ||
        normComp.includes("touch id"))
    )
      return true;
    if (
      normCheck.includes("vibration") &&
      (normComp.includes("vibration") || normComp.includes("haptic"))
    )
      return true;
    if (
      normCheck.includes("wi-fi") &&
      (normComp.includes("wi-fi") ||
        normComp.includes("connectivity") ||
        normComp.includes("wireless"))
    )
      return true;
    if (
      normCheck.includes("bluetooth") &&
      (normComp.includes("bluetooth") || normComp.includes("connectivity"))
    )
      return true;
    if (
      normCheck.includes("cellular") &&
      (normComp.includes("cellular") ||
        normComp.includes("5g") ||
        normComp.includes("network") ||
        normComp.includes("sim") ||
        normComp.includes("connectivity"))
    )
      return true;
    if (
      normCheck.includes("account removed") &&
      (normComp.includes("account") ||
        normComp.includes("icloud") ||
        normComp.includes("google") ||
        normComp.includes("signed out"))
    )
      return true;
    if (
      normCheck.includes("activation lock") &&
      (normComp.includes("activation lock") ||
        normComp.includes("reset") ||
        normComp.includes("lock"))
    )
      return true;
    if (
      normCheck.includes("imei") &&
      (normComp.includes("imei") || normComp.includes("serial") || normComp.includes("diagnostic"))
    )
      return true;
    if (
      normCheck.includes("carrier lock") &&
      (normComp.includes("carrier") ||
        normComp.includes("unlocked") ||
        normComp.includes("network lock"))
    )
      return true;
    if (normCheck.includes("water damage") && normComp.includes("water")) return true;
    if (
      normCheck.includes("repair") &&
      (normComp.includes("repair") || normComp.includes("replaced"))
    )
      return true;

    return false;
  });
}

export function InspectionReport({ inspection = [], className = "" }: InspectionReportProps) {
  // Determine which checks in the framework have matches
  const { categoryData, totalRecordedCount } = useMemo(() => {
    let recorded = 0;
    const data = inspectionFramework.map((category) => {
      let catRecorded = 0;
      const checks = category.checks.map((checkName) => {
        const match = findMatchingInspection(checkName, inspection);
        if (match) {
          catRecorded++;
          recorded++;
        }
        return {
          checkName,
          match,
        };
      });

      return {
        categoryName: category.name,
        checks,
        recordedCount: catRecorded,
        totalCount: category.checks.length,
      };
    });

    const effectiveRecorded = Math.max(
      inspection.length,
      Math.min(recorded, TOTAL_INSPECTION_CHECKS),
    );

    return {
      categoryData: data,
      totalRecordedCount: effectiveRecorded,
    };
  }, [inspection]);

  const docLevel = getDocumentationLevel(totalRecordedCount);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    Physical: true,
    Functional: true,
    Connectivity: false,
    Security: true,
    Authenticity: false,
  });

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className={`border border-border/80 bg-card p-6 space-y-6 ${className}`}>
      {/* Header with Title and Documentation Level */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">
              32-Point Standardized Inspection
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Objective condition evaluation across 5 standardized hardware categories
          </p>
        </div>

        {/* Documentation Level Badge */}
        <div className="flex flex-col sm:items-end">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-semibold uppercase tracking-wider ${docLevel.badgeClass}`}
          >
            {docLevel.label}
          </span>
          <span className="text-[11px] text-muted-foreground mt-1">
            {totalRecordedCount} of {TOTAL_INSPECTION_CHECKS} checks individually recorded
          </span>
        </div>
      </div>

      {/* Subtle Explanatory Line */}
      <p className="text-xs text-muted-foreground -mt-2">
        Documentation completeness reflects individually recorded inspection checks. Unrecorded
        checks indicate tests not individually uploaded, not failed results.
      </p>

      {/* Categories Accordion / List */}
      <div className="space-y-3">
        {categoryData.map((cat) => {
          const isOpen = openCategories[cat.categoryName] ?? true;

          return (
            <div
              key={cat.categoryName}
              className="border border-border/60 bg-background/50 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleCategory(cat.categoryName)}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-secondary/40 text-left transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="font-display font-semibold text-sm text-foreground">
                    {cat.categoryName}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium px-2 py-0.5 bg-secondary/80 border border-border/40">
                    {cat.recordedCount} of {cat.totalCount} recorded
                  </span>
                </div>
                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-foreground" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-3 pt-1 border-t border-border/40 divide-y divide-border/30">
                  {cat.checks.map(({ checkName, match }) => {
                    if (match) {
                      return (
                        <div
                          key={checkName}
                          className="py-2.5 flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <span className="font-medium text-foreground">{checkName}</span>
                            {match.notes && (
                              <p className="text-[11px] text-muted-foreground">{match.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 text-right">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              {match.status}
                            </span>
                            <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                              <Check className="size-3 stroke-[2.5]" />
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // Unrecorded Check — MUST DISPLAY "— Not individually recorded" in muted grey
                    return (
                      <div
                        key={checkName}
                        className="py-2.5 flex items-center justify-between gap-3 text-xs opacity-60"
                      >
                        <span className="text-muted-foreground">{checkName}</span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          — Not individually recorded
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Disclosure */}
      <div className="flex items-start gap-2 pt-2 text-[11px] text-muted-foreground border-t border-border/40 leading-relaxed">
        <Info className="size-3.5 shrink-0 text-muted-foreground mt-0.5" />
        <span>
          Resale standardized inspection framework consists of 32 physical, functional,
          connectivity, security, and authenticity inspection checkpoints.
        </span>
      </div>
    </div>
  );
}
