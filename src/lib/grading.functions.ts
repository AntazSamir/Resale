import { createServerFn } from "@tanstack/react-start";
import {
  gradingCriteria as staticCriteria,
  evaluateGrading,
  type GradingAnswers,
  type GradingCriterion,
  type GradingOption,
} from "@/data/grading";
import type { Grade } from "@/data/catalog";
import { getOrRestoreSession } from "./server-functions";

export type DeviceGradeRecord = {
  id: string;
  listingId: string | null;
  orderId: string | null;
  graderId: string | null;
  graderRole: "SELLER" | "BUYER" | "ADMIN";
  productLabel: string;
  answers: GradingAnswers;
  conditionScore: number;
  grade: Grade;
  notes: string | null;
  createdAt: string;
};

async function admin() {
  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  return getSupabaseAdmin();
}

function rowToGrade(row: Record<string, unknown>): DeviceGradeRecord {
  return {
    id: String(row["id"] ?? ""),
    listingId: (row["listing_id"] as string | null) ?? null,
    orderId: (row["order_id"] as string | null) ?? null,
    graderId: (row["grader_id"] as string | null) ?? null,
    graderRole: (row["grader_role"] as DeviceGradeRecord["graderRole"]) ?? "BUYER",
    productLabel: String(row["product_label"] ?? ""),
    answers: (row["answers_json"] as GradingAnswers) ?? {},
    conditionScore: Number(row["condition_score"] ?? 0),
    grade: (row["grade"] as Grade) ?? "D",
    notes: (row["notes"] as string | null) ?? null,
    createdAt: String(row["created_at"] ?? new Date().toISOString()),
  };
}

/**
 * Returns the grading checklist from the database, falling back to the
 * built-in checklist when the tables have not been created yet.
 */
export const getGradingCriteriaFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = await admin();
    const [{ data: criteria, error: cErr }, { data: options, error: oErr }] = await Promise.all([
      supabase.from("grading_criteria").select("*").eq("active", true).order("sort_order"),
      supabase.from("grading_options").select("*").order("sort_order"),
    ]);

    if (cErr || oErr || !criteria || criteria.length === 0) {
      return { source: "builtin" as const, criteria: staticCriteria };
    }

    const mapped: GradingCriterion[] = (criteria as Array<Record<string, unknown>>).map((c) => {
      const id = String(c["id"]);
      const opts: GradingOption[] = ((options ?? []) as Array<Record<string, unknown>>)
        .filter((o) => o["criterion_id"] === id)
        .map((o) => {
          const cap = o["grade_cap"] as Grade | null;
          return {
            value: String(o["value"]),
            label: String(o["label"]),
            points: Number(o["points"] ?? 0),
            ...(cap ? { cap } : {}),
          };
        });
      return {
        id,
        label: String(c["label"]),
        help: String(c["help"] ?? ""),
        weight: Number(c["weight"] ?? 0),
        options: opts,
      };
    });

    return { source: "database" as const, criteria: mapped };
  } catch {
    return { source: "builtin" as const, criteria: staticCriteria };
  }
});

/**
 * Persists a grade. The score and grade are always recomputed server-side from
 * the submitted answers so a client cannot claim a better grade than the
 * checklist allows.
 */
export const saveDeviceGradeFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      answers: GradingAnswers;
      productLabel: string;
      listingId?: string | undefined;
      orderId?: string | undefined;
      notes?: string | undefined;
      role?: "SELLER" | "BUYER" | "ADMIN" | undefined;
    }) => data,
  )
  .handler(async ({ data }) => {
    const session = getOrRestoreSession(data.token);
    if (!session) {
      return { success: false as const, error: "Please sign in to save a grade." };
    }

    const result = evaluateGrading(data.answers);
    if (!result.complete) {
      return { success: false as const, error: "Answer every question before saving." };
    }

    const role: DeviceGradeRecord["graderRole"] = session.isAdmin
      ? "ADMIN"
      : (data.role ?? (session.role === "SELLER" ? "SELLER" : "BUYER"));

    const record: DeviceGradeRecord = {
      id: `grd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      listingId: data.listingId ?? null,
      orderId: data.orderId ?? null,
      graderId: session.userId,
      graderRole: role,
      productLabel: data.productLabel || "Device",
      answers: data.answers,
      conditionScore: result.conditionScore,
      grade: result.grade,
      notes: data.notes ?? null,
      createdAt: new Date().toISOString(),
    };

    try {
      const supabase = await admin();
      const { error } = await supabase.from("device_grades").insert({
        id: record.id,
        listing_id: record.listingId,
        order_id: record.orderId,
        grader_id: record.graderId,
        grader_role: record.graderRole,
        product_label: record.productLabel,
        answers_json: record.answers,
        condition_score: record.conditionScore,
        grade: record.grade,
        notes: record.notes,
        created_at: record.createdAt,
      });
      if (error) {
        return { success: true as const, persisted: false, record, warning: error.message };
      }
      return { success: true as const, persisted: true, record };
    } catch (err) {
      return { success: true as const, persisted: false, record, warning: String(err) };
    }
  });

/** Reads grades for a listing, an order, or the signed-in user's own history. */
export const getDeviceGradesFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      listingId?: string | undefined;
      orderId?: string | undefined;
      token?: string | undefined;
      mine?: boolean | undefined;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();
      let query = supabase
        .from("device_grades")
        .select("*")
        .order("created_at", { ascending: false });

      if (data.mine) {
        const session = data.token ? getOrRestoreSession(data.token) : null;
        if (!session) return { success: true as const, grades: [] as DeviceGradeRecord[] };
        query = query.eq("grader_id", session.userId);
      } else if (data.listingId) {
        query = query.eq("listing_id", data.listingId);
      } else if (data.orderId) {
        query = query.eq("order_id", data.orderId);
      } else {
        return { success: true as const, grades: [] as DeviceGradeRecord[] };
      }

      const { data: rows, error } = await query;
      if (error) return { success: true as const, grades: [] as DeviceGradeRecord[] };
      return {
        success: true as const,
        grades: ((rows ?? []) as Array<Record<string, unknown>>).map(rowToGrade),
      };
    } catch {
      return { success: true as const, grades: [] as DeviceGradeRecord[] };
    }
  });
