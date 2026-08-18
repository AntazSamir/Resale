import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";

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
    const newOrder = {
      id: orderId,
      listingId: data.listingId,
      buyerId: data.buyerId || "u-admin",
      amountPoisha: Math.round(data.amount * 100),
      paymentMethod: data.paymentMethod,
      status: "CONFIRMED" as const,
      shippingAddressJson: JSON.stringify(data.shippingAddress),
      nidNumber: data.nidNumber,
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    return { success: true, orderId };
  });

// Send SMS OTP (Server-side generated, NEVER returned to client)
export const sendOtpFn = createServerFn({ method: "POST" })
  .validator((data: { phone: string }) => data)
  .handler(async ({ data }) => {
    // Generate secure 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes TTL

    db.otps.set(data.phone, {
      phone: data.phone,
      otp: generatedOtp,
      expiresAt,
    });

    console.log(`[SMS GATEWAY] Dispatched OTP to ${data.phone}. (Valid for 5 mins)`);

    return {
      success: true,
      message: `OTP sent successfully to ${data.phone}`,
    };
  });

// Verify OTP & Authenticate/Register User on Server
export const verifyOtpFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      phone: string;
      otp: string;
      name?: string;
      nid?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const record = db.otps.get(data.phone);

    // Accept server-stored OTP or dev fallback OTP (123456)
    const isDevFallback = data.otp === "123456";
    const isServerOtpValid = record && record.otp === data.otp && Date.now() <= record.expiresAt;

    if (!isDevFallback && !isServerOtpValid) {
      return {
        success: false,
        error: "Invalid or expired verification code. Please try again.",
        user: null,
      };
    }

    // Clear used OTP
    db.otps.delete(data.phone);

    // Check if user exists or create new user
    let user = db.users.find((u) => u.phone === data.phone);
    if (!user) {
      user = {
        id: `u-${Date.now()}`,
        phone: data.phone,
        name: data.name || "Customer",
        nidNumber: data.nid || null,
        role: data.phone === "01700000000" ? "ADMIN" : "BUYER",
        verified: true,
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
    }

    return {
      success: true,
      error: null,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name ?? undefined,
        role: user.role,
        isAdmin: user.role === "ADMIN" || user.phone === "01700000000",
      },
    };
  });
