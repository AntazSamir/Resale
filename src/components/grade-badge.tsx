import { gradeLabel, type Grade } from "@/data/catalog";

export function GradeBadge({ grade, showLabel = true }: { grade: Grade; showLabel?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <span className="grade-chip size-6 text-[11px]">{grade}</span>
      {showLabel && <span className="text-subtle-foreground">{gradeLabel[grade]}</span>}
    </span>
  );
}