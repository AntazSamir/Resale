import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { getSupabaseAdmin } from "./supabase-admin";
import type { NotificationType, CreateNotificationInput } from "./types";

// ── Helper: generate deterministic dedup key ──────────────────

function dedupKey(
  userId: string,
  type: string,
  entityType: string | undefined,
  entityId: string | undefined,
): string {
  return `${userId}:${type}:${entityType ?? ""}:${entityId ?? ""}`;
}

// ── Helper: check if a row already exists (duplicate prevention) ──

async function notificationExists(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  key: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("notifications")
    .select("id")
    .eq("reference", key)
    .limit(1)
    .single();
  if (error) return false;
  return !!data;
}

// ── Core notification creation ────────────────────────────────

export async function createNotification(
  input: CreateNotificationInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await getSupabaseAdmin();

    const id = `notif-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const ref = dedupKey(input.userId, input.type, input.entityType, input.entityId);

    // Duplicate prevention via deterministic reference key
    const exists = await notificationExists(supabase, ref);
    if (exists) {
      return { success: true, id };
    }

    // Check notification preferences — skip if disabled
    const { data: pref, error: prefError } = await supabase
      .from("notification_preferences")
      .select("enabled")
      .eq("user_id", input.userId)
      .eq("type", input.type)
      .limit(1)
      .single();

    if (prefError && prefError.code !== "PGRST116") {
      // Preference not found — default to enabled
    } else if (pref && !pref.enabled) {
      return { success: true, id };
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        id,
        user_id: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        entity_type: input.entityType ?? null,
        entity_id: input.entityId ?? null,
        reference: ref,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(
        "[notification-service/createNotification] Supabase insert error:",
        error.message,
      );
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (err) {
    console.error("[notification-service/createNotification] Unexpected error:", err);
    return { success: false, error: String(err) };
  }
}

// ── Order notification helpers ────────────────────────────────

export async function createOrderNotification(
  userId: string,
  type: Extract<
    NotificationType,
    | "ORDER_PLACED"
    | "ORDER_CONFIRMED"
    | "ORDER_STATUS_UPDATED"
    | "ORDER_DELIVERED"
    | "ORDER_CANCELLED"
  >,
  entityId: string,
  message: string,
  title?: string,
): Promise<{ success: boolean; id?: string; error?: string }> {
  return createNotification({
    userId,
    type,
    title: title ?? getDefaultTitle(type),
    message,
    entityType: "order",
    entityId,
  });
}

function getDefaultTitle(type: string): string {
  switch (type) {
    case "ORDER_PLACED":
      return "Order Placed";
    case "ORDER_CONFIRMED":
      return "Order Confirmed";
    case "ORDER_STATUS_UPDATED":
      return "Order Status Updated";
    case "ORDER_DELIVERED":
      return "Order Delivered";
    case "ORDER_CANCELLED":
      return "Order Cancelled";
    default:
      return "Order Update";
  }
}

// ── Dispute notification helpers ──────────────────────────────

export async function createDisputeNotification(
  userId: string,
  type: Extract<
    NotificationType,
    "DISPUTE_FILED" | "DISPUTE_STATUS_UPDATED" | "DISPUTE_RESOLVED" | "DISPUTE_SLA_WARNING"
  >,
  entityId: string,
  message: string,
  title?: string,
): Promise<{ success: boolean; id?: string; error?: string }> {
  return createNotification({
    userId,
    type,
    title: title ?? getDefaultDisputeTitle(type),
    message,
    entityType: "dispute",
    entityId,
  });
}

function getDefaultDisputeTitle(type: string): string {
  switch (type) {
    case "DISPUTE_FILED":
      return "Dispute Filed";
    case "DISPUTE_STATUS_UPDATED":
      return "Dispute Status Updated";
    case "DISPUTE_RESOLVED":
      return "Dispute Resolved";
    case "DISPUTE_SLA_WARNING":
      return "Dispute SLA Warning";
    default:
      return "Dispute Update";
  }
}

// ── Server functions for client-side data access ──────────────

export const fetchNotificationsFn = createServerFn({ method: "POST" })
  .validator(
    (data: { token: string; limit?: number; offset?: number; filters?: Record<string, unknown> }) =>
      data,
  )
  .handler(async ({ data }) => {
    try {
      if (!data.token) {
        return { success: false, error: "Unauthorized: Missing session token.", data: null };
      }
      const session = db.sessions.get(data.token);
      if (!session || Date.now() > session.expiresAt) {
        return {
          success: false,
          error: "Unauthorized: Session is invalid or expired.",
          data: null,
        };
      }
      const userId = session.userId;

      const supabase = await getSupabaseAdmin();
      const limit = data.limit ?? 20;
      const offset = data.offset ?? 0;

      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      const filters = data["filters"] as Record<string, unknown> | undefined;
      if (filters?.["type"]) {
        query = query.eq("type", filters["type"] as string);
      }
      if (filters?.["isRead"] !== undefined) {
        query = query.eq("is_read", filters["isRead"] as boolean);
      }

      const { data: rows, error } = await query;

      if (error) {
        console.error("[fetchNotificationsFn] Supabase error:", error.message);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, error: null, data: rows ?? [] };
    } catch (err) {
      console.error("[fetchNotificationsFn] Error:", err);
      return { success: false, error: String(err), data: null };
    }
  });

export const fetchUnreadCountFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.token) {
        return { success: false, error: "Unauthorized: Missing session token.", data: null };
      }
      const session = db.sessions.get(data.token);
      if (!session || Date.now() > session.expiresAt) {
        return {
          success: false,
          error: "Unauthorized: Session is invalid or expired.",
          data: null,
        };
      }
      const userId = session.userId;

      const supabase = await getSupabaseAdmin();
      const { data: countResult, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) {
        console.error("[fetchUnreadCountFn] Supabase error:", error.message);
        return { success: false, error: error.message, data: null };
      }

      const count = (countResult as unknown as { count: string })?.count ?? "0";
      return { success: true, error: null, data: parseInt(count, 10) };
    } catch (err) {
      console.error("[fetchUnreadCountFn] Error:", err);
      return { success: false, error: String(err), data: null };
    }
  });

export const markNotificationReadFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; notificationId: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.token) {
        return { success: false, error: "Unauthorized: Missing session token.", data: null };
      }
      const session = db.sessions.get(data.token);
      if (!session || Date.now() > session.expiresAt) {
        return {
          success: false,
          error: "Unauthorized: Session is invalid or expired.",
          data: null,
        };
      }
      const userId = session.userId;

      const supabase = await getSupabaseAdmin();
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", data.notificationId)
        .eq("user_id", userId);

      if (error) {
        console.error("[markNotificationReadFn] Supabase error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("[markNotificationReadFn] Error:", err);
      return { success: false, error: String(err) };
    }
  });

export const markAllNotificationsReadFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.token) {
        return { success: false, error: "Unauthorized: Missing session token.", data: null };
      }
      const session = db.sessions.get(data.token);
      if (!session || Date.now() > session.expiresAt) {
        return {
          success: false,
          error: "Unauthorized: Session is invalid or expired.",
          data: null,
        };
      }
      const userId = session.userId;

      const supabase = await getSupabaseAdmin();
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) {
        console.error("[markAllNotificationsReadFn] Supabase error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("[markAllNotificationsReadFn] Error:", err);
      return { success: false, error: String(err) };
    }
  });

// ── Preference server functions ───────────────────────────────

export const fetchPreferencesFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.token) {
        return { success: false, error: "Unauthorized: Missing session token.", data: null };
      }
      const session = db.sessions.get(data.token);
      if (!session || Date.now() > session.expiresAt) {
        return {
          success: false,
          error: "Unauthorized: Session is invalid or expired.",
          data: null,
        };
      }
      const userId = session.userId;

      const supabase = await getSupabaseAdmin();
      const { data: rows, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .order("type");

      if (error) {
        return { success: false, error: error.message, data: null };
      }
      return { success: true, error: null, data: rows ?? [] };
    } catch (err) {
      return { success: false, error: String(err), data: null };
    }
  });

export const updatePreferenceFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; type: string; enabled: boolean }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.token) {
        return { success: false, error: "Unauthorized: Missing session token.", data: null };
      }
      const session = db.sessions.get(data.token);
      if (!session || Date.now() > session.expiresAt) {
        return {
          success: false,
          error: "Unauthorized: Session is invalid or expired.",
          data: null,
        };
      }
      const userId = session.userId;

      const supabase = await getSupabaseAdmin();
      const { data: pref, error: selErr } = await supabase
        .from("notification_preferences")
        .select("id")
        .eq("user_id", userId)
        .eq("type", data.type)
        .limit(1)
        .single();

      if (selErr && selErr.code !== "PGRST116") {
        return { success: false, error: selErr.message };
      }

      if (pref) {
        const { error: updErr } = await supabase
          .from("notification_preferences")
          .update({ enabled: data.enabled, updated_at: new Date().toISOString() })
          .eq("id", (pref as unknown as { id: string }).id);
        if (updErr) return { success: false, error: updErr.message };
      } else {
        const id = `pref-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
        const { error: insErr } = await supabase.from("notification_preferences").insert({
          id,
          user_id: userId,
          type: data.type,
          enabled: data.enabled,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (insErr) return { success: false, error: insErr.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });
