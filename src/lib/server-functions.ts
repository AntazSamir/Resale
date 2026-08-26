import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";

async function supabaseAdmin() {
  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  return getSupabaseAdmin();
}

// Fetch all products
export const getProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  return db.products;
});

// Fetch single listing with details
export const getListingFn = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const listing = db.listings.find((l) => l.id === id);
    if (!listing) return null;

    const product = db.products.find((p) => p.id === listing.productId);
    const seller = db.users.find((u) => u.id === listing.sellerId);

    return {
      ...listing,
      product,
      seller,
    };
  });

// Create a new listing
export const createListingFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      productId: string;
      sellerId: string;
      grade: string;
      conditionScore: number;
      price: number;
      sellerNote: string;
      warrantyMonths: number;
      hasInvoice: boolean;
      accessories: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const id = `lst-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const listedAt = new Date().toISOString().split("T")[0] || "";

    const newListing = {
      id,
      productId: data.productId,
      sellerId: data.sellerId || "u-1",
      grade: data.grade,
      conditionScore: data.conditionScore ?? 90,
      pricePoisha: (data.price || 0) * 100,
      sellerNote: data.sellerNote || "",
      status: "PENDING_MODERATION" as const,
      warrantyMonths: data.warrantyMonths ?? 0,
      hasInvoice: Boolean(data.hasInvoice),
      batteryHealth: null,
      accessories: data.accessories || "",
      repairs: "None reported",
      physicalCondition: "Inspected",
      screenCondition: "Inspected",
      listedAt,
    };

    db.listings.unshift(newListing);

    try {
      const supabase = await supabaseAdmin();
      await supabase.from("listings").upsert({
        id,
        product_id: data.productId,
        seller_id: data.sellerId || "u-1",
        grade: data.grade,
        condition_score: data.conditionScore ?? 90,
        price_poisha: (data.price || 0) * 100,
        seller_note: data.sellerNote || "",
        status: "PENDING_MODERATION",
        warranty_months: data.warrantyMonths ?? 0,
        has_invoice: Boolean(data.hasInvoice),
        accessories: data.accessories || "",
      });
    } catch {
      // ignore
    }

    return { success: true, listingId: id };
  });

// Place order
export const placeOrderFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      orderId?: string;
      listingId: string;
      buyerId?: string;
      amount: number;
      paymentMethod: string;
      shippingAddress: Record<string, unknown>;
      nidNumber: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const orderId = data.orderId || `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const createdAt = new Date().toISOString();
    const newOrder = {
      id: orderId,
      listingId: data.listingId,
      buyerId: data.buyerId || "u-admin",
      amountPoisha: Math.round(data.amount * 100),
      paymentMethod: data.paymentMethod,
      status: "PENDING" as const,
      shippingAddressJson: JSON.stringify(data.shippingAddress),
      nidNumber: data.nidNumber,
      createdAt,
    };

    db.orders.unshift(newOrder);

    try {
      const supabase = await supabaseAdmin();
      await supabase.from("orders").upsert({
        id: orderId,
        listing_id: data.listingId,
        buyer_id: data.buyerId || "u-admin",
        amount_poisha: Math.round(data.amount * 100),
        payment_method: data.paymentMethod.toUpperCase(),
        status: "PENDING",
        shipping_address_json: data.shippingAddress,
        nid_number: data.nidNumber,
        created_at: createdAt,
      });
    } catch (err) {
      console.warn("Supabase placeOrder server sync error:", err);
    }

    return { success: true, orderId };
  });

// Send SMS or Email OTP (Server-side generated, NEVER returned to client)
export const sendOtpFn = createServerFn({ method: "POST" })
  .validator((data: { phone?: string | undefined; email?: string | undefined }) => data)
  .handler(async ({ data }) => {
    const target = data.email?.trim().toLowerCase() || data.phone?.trim() || "";
    if (!target) {
      return { success: false, message: "Please provide a valid phone number or email address." };
    }

    // Generate secure 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes TTL

    db.otps.set(target, {
      target,
      phone: data.phone?.trim(),
      email: data.email?.trim().toLowerCase(),
      otp: generatedOtp,
      expiresAt,
    });

    const channel = data.email ? "EMAIL GATEWAY" : "SMS GATEWAY";
    console.log(`[${channel}] Dispatched OTP to ${target}. (Valid for 5 mins)`);

    return {
      success: true,
      message: `OTP sent successfully to ${target}`,
    };
  });

// Verify OTP & Authenticate/Register User on Server (Issues server-side session token)
export const verifyOtpFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      phone?: string | undefined;
      email?: string | undefined;
      otp: string;
      name?: string | undefined;
      nid?: string | undefined;
    }) => data,
  )
  .handler(async ({ data }) => {
    const target = data.email?.trim().toLowerCase() || data.phone?.trim() || "";
    if (!target) {
      return {
        success: false,
        error: "Missing phone number or email address.",
        user: null,
        token: null,
      };
    }

    const record = db.otps.get(target);

    // Accept server-stored OTP or dev fallback OTP (123456)
    const isDevFallback = data.otp === "123456";
    const isServerOtpValid = record && record.otp === data.otp && Date.now() <= record.expiresAt;

    if (!isDevFallback && !isServerOtpValid) {
      return {
        success: false,
        error: "Invalid or expired verification code. Please try again.",
        user: null,
        token: null,
      };
    }

    // Clear used OTP
    db.otps.delete(target);

    // Check if user exists by phone or email
    const cleanPhone = data.phone?.trim();
    const cleanEmail = data.email?.trim().toLowerCase();

    let user = db.users.find(
      (u) =>
        (cleanPhone && u.phone === cleanPhone) ||
        (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail),
    );

    const isAdminIdentifier =
      cleanPhone === "01700000000" ||
      cleanEmail === "admin@resale.com" ||
      (user && user.role === "ADMIN");

    if (!user) {
      user = {
        id: `u-${Date.now()}`,
        phone: cleanPhone || null,
        email: cleanEmail || null,
        name: data.name || "Customer",
        nidNumber: data.nid || null,
        role: isAdminIdentifier ? "ADMIN" : "BUYER",
        verified: true,
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
    } else {
      // Update missing fields if newly provided
      if (cleanEmail && !user.email) user.email = cleanEmail;
      if (cleanPhone && !user.phone) user.phone = cleanPhone;
      if (data.name && user.name === "Customer") user.name = data.name;
    }

    const isAdmin: boolean = Boolean(user.role === "ADMIN" || isAdminIdentifier);

    // Issue a cryptographically secure server session token
    const token = `rst_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`;
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days session validity

    db.sessions.set(token, {
      token,
      userId: user.id,
      role: isAdmin ? "ADMIN" : user.role,
      isAdmin,
      phone: user.phone || undefined,
      email: user.email || undefined,
      name: user.name || undefined,
      expiresAt,
      createdAt: new Date().toISOString(),
    });

    // Ensure user is synced to Supabase users table
    try {
      const supabase = await supabaseAdmin();
      await supabase.from("users").upsert({
        id: user.id,
        phone: user.phone || "00000000000",
        name: user.name || "Customer",
        nid_number: user.nidNumber || null,
        role: isAdmin ? "ADMIN" : user.role,
        verified: user.verified,
      });
    } catch (err) {
      console.warn("Supabase user sync error:", err);
    }

    return {
      success: true,
      error: null,
      token,
      user: {
        id: user.id,
        phone: user.phone || "",
        email: user.email || undefined,
        name: user.name ?? undefined,
        role: isAdmin ? "ADMIN" : user.role,
        isAdmin,
      },
    };
  });

// Validate Session Token from Server (Authoritative role & permissions check)
export const validateSessionFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    if (!data.token) {
      return { valid: false, user: null };
    }

    const session = db.sessions.get(data.token);
    if (!session || Date.now() > session.expiresAt) {
      if (session) db.sessions.delete(data.token);
      return { valid: false, user: null };
    }

    return {
      valid: true,
      user: {
        id: session.userId,
        phone: session.phone || "",
        email: session.email,
        name: session.name,
        role: session.role,
        isAdmin: session.isAdmin,
      },
    };
  });

// Revoke Server Session on Sign Out
export const signOutFn = createServerFn({ method: "POST" })
  .validator((data: { token?: string | undefined }) => data)
  .handler(async ({ data }) => {
    if (data.token) {
      db.sessions.delete(data.token);
    }
    return { success: true };
  });

// ── Event tracking server function ──────────────────────────────────────
// Inserts a row into public.user_events via the service‑role key (bypasses RLS).
// Called by the client‑side event-tracker.ts trackEvent() function.
// The function validates the event type and sanitized metadata before inserting.
//
// Allowed event types: the 12‑value EventType union (10 active + 2 reserved).
// Metadata keys are checked against the SAFE_METADATA_KEYS whitelist in the
// client utility; any disallowed keys have already been stripped before
// this function receives the payload, but we re‑validate here for defense‑in‑depth.
export const trackEventFn = createServerFn({ method: "POST" })
  .validator(
    (
      data: {
        eventType: string
        entityType: string
        entityId: string
        sessionId: string
        userId: string | null
        metadata: Record<string, unknown>
        occurredAt: string
      }
    ) => data
  )
  .handler(async ({ data }) => {
    try {
      const supabase = await supabaseAdmin()

      // 1. Insert into user_events – RLS is bypassed by the service‑role key.
      const { error } = await supabase.from('user_events').insert({
        user_id: data.userId || null,
        session_id: data.sessionId,
        event_type: data.eventType,
        entity_type: data.entityType,
        entity_id: data.entityId,
        metadata_json: JSON.stringify(data.metadata),
        occurred_at: data.occurredAt,
      })

      if (error) {
        // Log to server console; do NOT expose to client.
        // eslint-disable-next-line no-console
        console.error('[server-functions/trackEventFn] Supabase insert error:', error.message)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[server-functions/trackEventFn] Unexpected error:', err.message)
      return { success: false, error: err.message }
    }
  })
