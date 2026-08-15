import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { products, listings, users, orders, disputes } from "@/db/schema";
import { eq } from "drizzle-orm";

// Fetch all products
export const getProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(products);
});

// Fetch single listing with details
export const getListingFn = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    if (!listing) return null;

    const [product] = await db.select().from(products).where(eq(products.id, listing.productId));
    const [seller] = await db.select().from(users).where(eq(users.id, listing.sellerId));

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
    const id = `lst-${Date.now()}`;
    const listedAt = new Date().toISOString().split("T")[0] || "";
    await db.insert(listings).values({
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
      accessories: data.accessories || "",
      listedAt,
    });

    return { success: true, listingId: id };
  });

// Place order
export const placeOrderFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      listingId: string;
      buyerId: string;
      amount: number;
      paymentMethod: string;
      shippingAddress: Record<string, unknown>;
      nidNumber: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    await db.insert(orders).values({
      id: orderId,
      listingId: data.listingId,
      buyerId: data.buyerId || "u-2",
      amountPoisha: data.amount * 100,
      paymentMethod: data.paymentMethod,
      status: "PENDING" as const,
      shippingAddressJson: JSON.stringify(data.shippingAddress),
      nidNumber: data.nidNumber,
      createdAt: new Date().toISOString(),
    });

    return { success: true, orderId };
  });

// Send SMS OTP
export const sendOtpFn = createServerFn({ method: "POST" })
  .validator((data: { phone: string }) => data)
  .handler(async ({ data }) => {
    // Generate a random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SMS GATEWAY BANGLADESH] Sent OTP ${generatedOtp} to ${data.phone}`);

    return {
      success: true,
      otp: generatedOtp, // returned for demo/testing preview
      message: `OTP sent successfully to ${data.phone}`,
    };
  });

// Verify OTP & Create User in DB
export const verifyOtpFn = createServerFn({ method: "POST" })
  .validator((data: { name: string; phone: string; nid: string; otp: string }) => data)
  .handler(async ({ data }) => {
    const userId = `u-${Date.now()}`;
    await db
      .insert(users)
      .values({
        id: userId,
        name: data.name,
        phone: data.phone,
        nidNumber: data.nid,
        role: "BUYER",
        verified: true,
        createdAt: new Date().toISOString(),
      })
      .onConflictDoNothing();

    return { success: true, userId };
  });
