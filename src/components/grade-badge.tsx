import { gradeCriteria, gradeLabel, type Grade } from "@/data/catalog";

interface GradeBadgeProps {
  grade: Grade;
  showLabel?: boolean | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  showCriteria?: boolean | undefined;
  className?: string | undefined;
}

export function GradeBadge({
  grade,
  showLabel = true,
  size = "md",
  showCriteria = false,
  className = "",
}: GradeBadgeProps) {
  const sizeClasses =
    size === "sm"
      ? "size-5 text-[10px]"
      : size === "lg"
        ? "size-7 text-xs font-bold"
        : "size-6 text-[11px]";

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <span className="inline-flex items-center gap-2 text-xs">
        <span className={`grade-chip ${sizeClasses} shrink-0`}>{grade}</span>
        {showLabel && (
          <span className="text-subtle-foreground font-medium">{gradeLabel[grade]}</span>
        )}
      </span>
      {showCriteria && (
        <span className="text-[11px] text-muted-foreground leading-normal">
          {gradeCriteria[grade]}
        </span>
      )}
    </div>
  );
}
