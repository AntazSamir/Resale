import { type Grade } from "@/data/catalog";
import { GradeBadge } from "./grade-badge";

interface ConditionScoreProps {
  score: number;
  grade: Grade;
  compact?: boolean | undefined;
  className?: string | undefined;
}

function getConditionTier(score: number): {
  label: string;
  colorClass: string;
  badgeBg: string;
} {
  if (score >= 90) {
    return {
      label: "Excellent",
      colorClass: "text-emerald-500",
      badgeBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
  }
  if (score >= 75) {
    return {
      label: "Good",
      colorClass: "text-amber-500",
      badgeBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    };
  }
  if (score >= 60) {
    return {
      label: "Fair",
      colorClass: "text-orange-500",
      badgeBg: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    };
  }
  return {
    label: "Heavy Wear",
    colorClass: "text-red-500",
    badgeBg: "bg-red-500/10 text-red-500 border-red-500/20",
  };
}

export function ConditionScore({
  score,
  grade,
  compact = false,
  className = "",
}: ConditionScoreProps) {
  const tier = getConditionTier(score);

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-xs font-medium ${tier.badgeBg} ${className}`}
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Condition score ${score} out of 100, Grade ${grade} (${tier.label})`}
      >
        <span className="font-bold">{score}/100</span>
        <span>·</span>
        <span className="font-semibold">Grade {grade}</span>
        <span>({tier.label})</span>
      </div>
    );
  }

  // Segmented 4-zone progress bar calculations
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <div
      className={`border border-border bg-card/60 p-4 space-y-3 ${className}`}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Condition score ${score} out of 100, Grade ${grade} (${tier.label})`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <GradeBadge grade={grade} size="lg" showLabel={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-display font-bold text-foreground">
                {score}
                <span className="text-sm font-normal text-muted-foreground">/100</span>
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 border ${tier.badgeBg} uppercase tracking-wider`}
              >
                {tier.label}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Resale Condition Score</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-foreground">Grade {grade}</span>
          <p className="text-[11px] text-muted-foreground">Standardized Tier</p>
        </div>
      </div>

      {/* Visual 4-Zone Segmented Bar */}
      <div className="space-y-1">
        <div className="relative h-2.5 w-full bg-secondary/80 rounded-none overflow-hidden flex gap-0.5 p-0.5">
          {/* Segment 1: Below 60 (Red) */}
          <div className="h-full flex-1 relative bg-red-500/20 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{
                width: `${Math.max(0, Math.min(100, (clampedScore / 60) * 100))}%`,
              }}
            />
          </div>

          {/* Segment 2: 60-74 (Orange) */}
          <div className="h-full flex-1 relative bg-orange-500/20 overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{
                width: `${Math.max(0, Math.min(100, ((clampedScore - 60) / 15) * 100))}%`,
              }}
            />
          </div>

          {/* Segment 3: 75-89 (Amber) */}
          <div className="h-full flex-1 relative bg-amber-500/20 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{
                width: `${Math.max(0, Math.min(100, ((clampedScore - 75) / 15) * 100))}%`,
              }}
            />
          </div>

          {/* Segment 4: 90-100 (Emerald) */}
          <div className="h-full flex-1 relative bg-emerald-500/20 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${Math.max(0, Math.min(100, ((clampedScore - 90) / 10) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Zone Labels */}
        <div className="flex justify-between text-[10px] text-muted-foreground font-medium pt-0.5">
          <span className="text-red-500/80">&lt;60 Heavy</span>
          <span className="text-orange-500/80">60–74 Fair</span>
          <span className="text-amber-500/80">75–89 Good</span>
          <span className="text-emerald-500/80">90–100 Excellent</span>
        </div>
      </div>

      {/* Explanatory Note */}
      <p className="text-[11.5px] text-subtle-foreground leading-relaxed border-t border-border/40 pt-2">
        Score based on physical condition, battery health, documented repairs, and inspection
        results.
      </p>
    </div>
  );
}
