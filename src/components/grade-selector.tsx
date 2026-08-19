import { GradeBadge } from "./grade-badge";
import { gradeCriteria } from "@/data/catalog";
import {
  evaluateGrading,
  gradingCriteria,
  maxGradingScore,
  type GradingAnswers,
} from "@/data/grading";

export function GradeSelector({
  answers,
  onChange,
}: {
  answers: GradingAnswers;
  onChange: (answers: GradingAnswers) => void;
}) {
  const result = evaluateGrading(answers);

  return (
    <div className="space-y-6">
      {gradingCriteria.map((criterion) => (
        <fieldset key={criterion.id} className="space-y-2">
          <legend className="flex items-baseline justify-between w-full gap-3">
            <span className="text-sm font-medium">{criterion.label}</span>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {criterion.weight} pts
            </span>
          </legend>
          <p className="text-xs text-muted-foreground">{criterion.help}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {criterion.options.map((option) => {
              const checked = answers[criterion.id] === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-2 border p-3 text-sm transition-colors ${
                    checked ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-1 accent-current"
                    name={criterion.id}
                    value={option.value}
                    checked={checked}
                    onChange={() => onChange({ ...answers, [criterion.id]: option.value })}
                    required
                  />
                  <span>
                    <span className="block">{option.label}</span>
                  </span>
                </label>
              );
            })}
          </div>

          {criterion.id === "repairs" &&
            (answers["repairs"] === "official" || answers["repairs"] === "third-party") && (
              <div className="mt-2 space-y-1.5 border border-border bg-background p-3">
                <label className="text-xs font-semibold text-foreground block">
                  Please specify what was repaired or replaced:{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={answers["repairsDetail"] || ""}
                  onChange={(e) =>
                    onChange({
                      ...answers,
                      repairsDetail: e.target.value,
                    })
                  }
                  placeholder="e.g. Screen replaced, battery changed, camera module..."
                  className="w-full border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <p className="text-[11px] text-muted-foreground">
                  Provide clear details for moderation review and buyer confidence.
                </p>
              </div>
            )}
        </fieldset>
      ))}

      <div className="border border-border bg-muted/40 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Calculated grade</p>
          {result.complete ? (
            <GradeBadge grade={result.grade} />
          ) : (
            <span className="text-xs text-muted-foreground">
              {result.answered}/{gradingCriteria.length} criteria answered
            </span>
          )}
        </div>
        {result.complete && (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Condition score {result.conditionScore}/100 (weighted out of {maxGradingScore} points)
              · {gradeCriteria[result.grade]}
            </p>
            {result.reasons.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {result.reasons.map((r) => (
                  <li key={r}>• {r}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
