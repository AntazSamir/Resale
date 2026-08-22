import type { Grade } from "@/data/catalog";
import type { GradingAnswers } from "@/data/grading";

export type GradedDraft = {
  id: string;
  productLabel: string;
  price: number;
  grade: Grade;
  conditionScore: number;
  answers: GradingAnswers;
  storeId?: string | undefined;
  storeName?: string | undefined;
  createdAt: string;
};

const KEY = "resale.graded-listings";

export function readGradedDrafts(): GradedDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as GradedDraft[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGradedDraft(draft: Omit<GradedDraft, "id" | "createdAt">): GradedDraft {
  const record: GradedDraft = {
    ...draft,
    id: `lst-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify([record, ...readGradedDrafts()]));
  }
  return record;
}
