import type { Grade } from "./catalog";

export type GradingOption = {
  value: string;
  label: string;
  /** Points awarded out of the criterion weight. */
  points: number;
  /** Highest grade this answer still allows. */
  cap?: Grade;
};

export type GradingCriterion = {
  id: string;
  label: string;
  help: string;
  weight: number;
  options: GradingOption[];
};

/** PRD grading checklist — the same criteria are applied to every seller. */
export const gradingCriteria: GradingCriterion[] = [
  {
    id: "physical",
    label: "Body & frame",
    help: "Cosmetic condition of the chassis, edges and back panel.",
    weight: 25,
    options: [
      { value: "pristine", label: "No signs of use", points: 25 },
      { value: "minor", label: "Minor marks, visible only up close", points: 20, cap: "A" },
      { value: "visible", label: "Visible wear or scuffs", points: 14, cap: "B" },
      { value: "damage", label: "Dents, cracks or bends", points: 6, cap: "C" },
    ],
  },
  {
    id: "screen",
    label: "Screen / display",
    help: "Scratches, burn-in, dead pixels or discolouration.",
    weight: 25,
    options: [
      { value: "flawless", label: "Flawless, original panel", points: 25 },
      { value: "micro", label: "Micro-scratches under light", points: 20, cap: "A" },
      { value: "scratches", label: "Visible scratches", points: 14, cap: "B" },
      { value: "defect", label: "Burn-in, dead pixels or crack", points: 5, cap: "C" },
    ],
  },
  {
    id: "functionality",
    label: "Functionality",
    help: "Buttons, cameras, speakers, ports and connectivity.",
    weight: 20,
    options: [
      { value: "full", label: "Everything works as expected", points: 20 },
      { value: "minor-fault", label: "One minor fault, disclosed", points: 12, cap: "C" },
      { value: "faults", label: "Multiple faults or limitations", points: 5, cap: "D" },
    ],
  },
  {
    id: "battery",
    label: "Battery health",
    help: "Reported battery health percentage (or N/A for devices without a battery).",
    weight: 12,
    options: [
      { value: "95", label: "95% or above / not applicable", points: 12 },
      { value: "90", label: "90 – 94%", points: 10, cap: "A" },
      { value: "80", label: "80 – 89%", points: 7, cap: "B" },
      { value: "low", label: "Below 80%", points: 3, cap: "C" },
    ],
  },
  {
    id: "repairs",
    label: "Repairs & replaced parts",
    help: "Any part that is not the original factory component.",
    weight: 10,
    options: [
      { value: "none", label: "None — all original parts", points: 10 },
      { value: "official", label: "Official service repair, documented", points: 7, cap: "B" },
      { value: "third-party", label: "Third-party repair", points: 4, cap: "C" },
    ],
  },
  {
    id: "accessories",
    label: "Box & accessories",
    help: "What ships with the device.",
    weight: 8,
    options: [
      { value: "complete", label: "Box and all original accessories", points: 8 },
      { value: "partial", label: "Some original accessories", points: 5, cap: "A" },
      { value: "device", label: "Device only", points: 3, cap: "A" },
    ],
  },
];

export const maxGradingScore = gradingCriteria.reduce((sum, c) => sum + c.weight, 0);

export type GradingAnswers = Record<string, string>;

const gradeOrder: Grade[] = ["A+", "A", "B", "C", "D"];

const scoreToGrade = (score: number): Grade => {
  if (score >= 95) return "A+";
  if (score >= 85) return "A";
  if (score >= 72) return "B";
  if (score >= 55) return "C";
  return "D";
};

const worseOf = (a: Grade, b: Grade): Grade =>
  gradeOrder.indexOf(a) >= gradeOrder.indexOf(b) ? a : b;

export type GradingResult = {
  complete: boolean;
  answered: number;
  conditionScore: number;
  grade: Grade;
  /** Criteria that pulled the grade down, in plain language. */
  reasons: string[];
};

/** Deterministic grade: weighted score, then capped by the worst single answer. */
export function evaluateGrading(answers: GradingAnswers): GradingResult {
  let points = 0;
  let cap: Grade = "A+";
  const reasons: string[] = [];
  let answered = 0;

  for (const criterion of gradingCriteria) {
    const selected = criterion.options.find((o) => o.value === answers[criterion.id]);
    if (!selected) continue;
    answered += 1;
    points += selected.points;
    if (selected.cap) {
      cap = worseOf(cap, selected.cap);
      reasons.push(`${criterion.label}: ${selected.label} → max grade ${selected.cap}`);
    }
  }

  const complete = answered === gradingCriteria.length;
  const conditionScore = complete ? Math.round((points / maxGradingScore) * 100) : 0;
  const grade = complete ? worseOf(scoreToGrade(conditionScore), cap) : "D";

  return { complete, answered, conditionScore, grade, reasons };
}

export const answerLabel = (criterionId: string, value?: string) =>
  gradingCriteria
    .find((c) => c.id === criterionId)
    ?.options.find((o) => o.value === value)?.label ?? "—";
