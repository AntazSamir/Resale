import { createServerFn } from "@tanstack/react-start";
import { createOrderNotification, createDisputeNotification } from "./notification-service";

/**
 * Privileged database operations. These run ONLY on the server using the
 * service-role key (RLS bypass). Clients call them as RPC endpoints.
 */

function admin() {
  // Dynamic import keeps server-only code out of the client bundle.
  return import("./supabase-admin").then((m) => m.getSupabaseAdmin());
}

export type UpsertUserInput = {
  id: string;
  phone: string;
  name: string | null;
  nidNumber?: string | null;
  role: "BUYER" | "SELLER" | "ADMIN";
  verified: boolean;
};

export const upsertUserRecordFn = createServerFn({ method: "POST" })
  .validator((data: UpsertUserInput) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();
      const { error } = await supabase.from("users").upsert(
        {
          id: data.id,
          phone: data.phone,
          name: data.name,
          nid_number: data.nidNumber ?? null,
          role: data.role,
          verified: data.verified,
        },
        { onConflict: "id" },
      );
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

export const upsertCreatorProfileFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();
      const { error } = await supabase.from("creator_profiles").upsert(data, { onConflict: "id" });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

export const upsertProductVideoFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();
      const { error } = await supabase.from("product_videos").upsert(data, { onConflict: "id" });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

export const upsertStoreFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();
      const { error } = await supabase.from("stores").upsert(data, { onConflict: "id" });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

export const upsertOrderFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();

      const existing = await supabase
        .from("orders")
        .select("status")
        .eq("id", data["id"] as string)
        .limit(1)
        .single();
      const oldStatus = existing?.data?.["status"] as string | undefined;
      const newStatus = data["status"] as string;
      const buyerId = (data["buyer_id"] as string) || (data["buyerId"] as string);

      // --- Trust Telemetry: Order State Machine Hooks ---
      const now = new Date().toISOString();
      const telemetry: Record<string, string> = {};

      if (oldStatus && oldStatus !== newStatus) {
        if (newStatus === "CONFIRMED") telemetry["confirmed_at"] = now;
        if (newStatus === "SHIPPED") telemetry["shipped_at"] = now;
        if (newStatus === "DELIVERED") telemetry["delivered_at"] = now;
        if (newStatus === "CANCELLED") {
          telemetry["cancelled_at"] = now;
          telemetry["cancelled_by"] = (data["cancelled_by"] as string) || "SYSTEM";
          telemetry["cancellation_reason"] =
            (data["cancellation_reason"] as string) || "Not specified";
        }
      }

      // Merge telemetry into the upsert data
      const updatePayload = { ...data, ...telemetry };

      const { error } = await supabase.from("orders").upsert(updatePayload);
      if (error) return { success: false, error: error.message };

      if (oldStatus && oldStatus !== newStatus) {
        try {
          await createOrderNotification(
            buyerId || "u-admin",
            "ORDER_STATUS_UPDATED",
            data["id"] as string,
            `Order status changed from ${oldStatus} to ${newStatus}.`,
          );
        } catch {
          // Notification failure should not fail the upsert
        }
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

/**
 * Orders contain sensitive PII (NID, address, phone). Reads must be authenticated
 * and strictly scoped by user role (BUYER sees only own purchases, SELLER sees
 * only orders for their listings, ADMIN can audit platform orders).
 */
export const listOrdersFn = createServerFn({ method: "POST" })
  .validator((data: { token?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const { getOrRestoreSession } = await import("./server-functions");
      const session = data?.token ? getOrRestoreSession(data.token) : null;
      if (!session) {
        return { json: "[]", error: "Authentication required to read orders." };
      }

      const supabase = await admin();
      const { data: allRows, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return { json: "[]", error: error.message };
      const rows = (allRows ?? []) as Array<Record<string, unknown>>;

      if (session.isAdmin) {
        return { json: JSON.stringify(rows), error: null };
      }

      if (session.role === "SELLER") {
        // Resolve seller's own listings to filter relevant orders
        const { data: sellerListings } = await supabase
          .from("listings")
          .select("id")
          .eq("seller_id", session.userId);
        const sellerListingIds = new Set(
          (sellerListings || []).map((l: { id: string }) => l.id.toLowerCase()),
        );

        const sellerOrders = rows.filter((r) => {
          // If seller also bought this item
          if (r["buyer_id"] === session.userId) return true;
          const listingId = String(r["listing_id"] || "").toLowerCase();
          if (listingId && sellerListingIds.has(listingId)) return true;

          const addr = r["shipping_address_json"] as Record<string, unknown> | null;
          const meta = addr?.["_orderSnapshot"] as Record<string, unknown> | null;
          if (meta && Array.isArray(meta["items"])) {
            return (meta["items"] as { sellerId?: string }[]).some(
              (item) =>
                item.sellerId && item.sellerId.toLowerCase() === session.userId.toLowerCase(),
            );
          }
          return false;
        });

        return { json: JSON.stringify(sellerOrders), error: null };
      }

      // BUYER: strictly scoped to the authenticated buyer's identity
      const buyerOrders = rows.filter((r) => {
        if (r["buyer_id"] === session.userId) return true;
        const addr = r["shipping_address_json"] as Record<string, unknown> | null;
        const meta = addr?.["_orderSnapshot"] as Record<string, unknown> | null;
        if (meta) {
          if (meta["buyerId"] === session.userId) return true;
          const contact = meta["buyerContact"] as { phone?: string; buyerId?: string } | null;
          if (contact?.buyerId === session.userId) return true;
          if (contact?.phone === session.phone || addr?.["phone"] === session.phone) {
            return true;
          }
        }
        return false;
      });

      return { json: JSON.stringify(buyerOrders), error: null };
    } catch (err) {
      return { json: "[]", error: String(err) };
    }
  });

// ─── Cart Items ──────────────────────────────────────────────────────────────
// These handlers silently swallow errors (incl. table-not-found) so the app
// degrades gracefully to localStorage when the cart_items table doesn't exist.

export type UpsertCartItemInput = {
  user_id: string;
  listing_id: string;
};

export const upsertCartItemFn = createServerFn({ method: "POST" })
  .validator((data: UpsertCartItemInput) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();
      const { error } = await supabase
        .from("cart_items")
        .upsert(
          { user_id: data.user_id, listing_id: data.listing_id },
          { onConflict: "user_id,listing_id" },
        );
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: "cart_items table unavailable" };
    }
  });

export const removeCartItemFn = createServerFn({ method: "POST" })
  .validator((data: UpsertCartItemInput) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", data.user_id)
        .eq("listing_id", data.listing_id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: "cart_items table unavailable" };
    }
  });

export const clearCartItemsFn = createServerFn({ method: "POST" })
  .validator((data: { user_id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();
      const { error } = await supabase.from("cart_items").delete().eq("user_id", data.user_id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: "cart_items table unavailable" };
    }
  });

export const listCartItemsFn = createServerFn({ method: "POST" })
  .validator((data: { user_id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();
      const { data: rows, error } = await supabase
        .from("cart_items")
        .select("listing_id")
        .eq("user_id", data.user_id);
      if (error) return { json: "[]", error: error.message };
      return { json: JSON.stringify(rows ?? []), error: null };
    } catch {
      return { json: "[]", error: "cart_items table unavailable" };
    }
  });

// ─── Disputes ─────────────────────────────────────────────────────────────────
// Same graceful-fail pattern — swallows all errors when disputes table is absent.

export const upsertDisputeFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();

      const existing = await supabase
        .from("disputes")
        .select("status, buyer_id")
        .eq("id", data["id"] as string)
        .limit(1)
        .single();
      const oldStatus = existing?.data?.["status"] as string | undefined;
      const newStatus = data["status"] as string;
      const buyerId =
        (data["buyer_id"] as string) ||
        (data["buyerId"] as string) ||
        (existing?.data?.["buyer_id"] as string);
      const isNew = !existing?.data;

      const { error } = await supabase.from("disputes").upsert(data, { onConflict: "id" });
      if (error) return { success: false, error: error.message };

      if (isNew && buyerId) {
        try {
          await createDisputeNotification(
            buyerId,
            "DISPUTE_FILED",
            data["id"] as string,
            "A new dispute has been filed on your order.",
          );
        } catch {
          // Notification failure should not fail the upsert
        }
      } else if (oldStatus && oldStatus !== newStatus && buyerId) {
        try {
          const isResolved = [
            "RESOLVED_BUYER_REFUND",
            "RESOLVED_SELLER_PAYOUT",
            "RESOLVED_RETURN_ACCEPTED",
          ].includes(newStatus);
          await createDisputeNotification(
            buyerId,
            isResolved ? "DISPUTE_RESOLVED" : "DISPUTE_STATUS_UPDATED",
            data["id"] as string,
            isResolved
              ? "Your dispute has been resolved."
              : `Dispute status changed to ${newStatus}.`,
          );
        } catch {
          // Notification failure should not fail the upsert
        }
      }

      return { success: true };
    } catch {
      return { success: false, error: "disputes table unavailable" };
    }
  });

export const listDisputesFn = createServerFn({ method: "POST" })
  .validator((data: { buyer_id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await admin();
      const { data: rows, error } = await supabase
        .from("disputes")
        .select("*")
        .eq("buyer_id", data.buyer_id)
        .order("created_at", { ascending: false });
      if (error) return { json: "[]", error: error.message };
      return { json: JSON.stringify(rows ?? []), error: null };
    } catch {
      return { json: "[]", error: "disputes table unavailable" };
    }
  });
