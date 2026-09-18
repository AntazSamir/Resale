import { grades, gradeLabel } from "@/data/types";
import { Info } from "lucide-react";

export function GradeGuide() {
  return (
    <div className="bg-muted/30 border border-border/60 rounded-lg p-4 sm:p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Info className="size-4 text-primary shrink-0" />
        <h3 className="text-sm font-semibold text-foreground">Understanding Our Grading</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {grades.map((grade) => {
          const colorMap: Record<string, string> = {
            "A+": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
            A: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
            B: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
            C: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
            D: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
          };
          const gradeColor = colorMap[grade] ?? "bg-muted text-muted-foreground border-border";

          const description =
            grade === "A+"
              ? "Flawless, like new condition."
              : grade === "A"
                ? "Excellent condition, barely visible wear."
                : grade === "B"
                  ? "Good condition, light scratches or wear."
                  : grade === "C"
                    ? "Fair condition, visible scratches/dents."
                    : "Heavy wear, functional but noticeably used.";

          return (
            <div
              key={grade}
              className="flex items-start gap-2.5 p-3 rounded-md bg-background border border-border/50"
            >
              <span
                className={`shrink-0 flex items-center justify-center font-bold text-xs w-7 h-7 rounded-full border ${gradeColor}`}
              >
                {grade}
              </span>
              <div>
                <span className="block text-xs font-semibold text-foreground">
                  {gradeLabel[grade]}
                </span>
                <span className="block text-[10px] text-muted-foreground mt-0.5 leading-snug">
                  {description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
