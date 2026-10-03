import { gradeLabel, gradeHint, type Grade } from "@/data/types";

export function GradePill({
  grade,
  size = "sm",
  showLabel = true,
}: {
  grade: Grade | string;
  size?: "xs" | "sm";
  showLabel?: boolean;
}) {
  const g = grade as Grade;
  return (
    <span
      data-grade={g}
      title={gradeHint[g]}
      className={`grade-tone inline-flex items-center gap-1 font-bold shadow-xs ${
        size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5"
      }`}
    >
      {g}
      {showLabel && gradeLabel[g] && (
        <span className="font-medium opacity-90">· {gradeLabel[g]}</span>
      )}
    </span>
  );
}
