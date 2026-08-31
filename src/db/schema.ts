import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  phone: text("phone").unique(),
  email: text("email").unique(),
  name: text("name"),
  nidNumber: text("nid_number"),
  role: text("role", { enum: ["BUYER", "SELLER", "ADMIN"] })
    .default("BUYER")
    .notNull(),
  verified: integer("verified", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("created_at").notNull(),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  retailPricePoisha: integer("retail_price_poisha").notNull(),
  image: text("image").notNull(),
  specsJson: text("specs_json").notNull(),
});

export const listings = sqliteTable("listings", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  sellerId: text("seller_id")
    .notNull()
    .references(() => users.id),
  grade: text("grade").notNull(),
  conditionScore: integer("condition_score").notNull(),
  pricePoisha: integer("price_poisha").notNull(),
  sellerNote: text("seller_note").notNull(),
  moderationStatus: text("moderation_status", {
    enum: ["DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED"],
  })
    .default("PENDING_REVIEW")
    .notNull(),
  status: text("status", {
    enum: [
      "DRAFT",
      "PENDING_MODERATION",
      "PENDING_REVIEW",
      "PUBLISHED",
      "ACTIVE",
      "PAUSED",
      "RESERVED",
      "SOLD",
      "DELISTED",
      "REJECTED",
    ],
  })
    .default("PENDING_REVIEW")
    .notNull(),
  warrantyMonths: integer("warranty_months").default(0).notNull(),
  hasInvoice: integer("has_invoice", { mode: "boolean" }).default(false).notNull(),
  batteryHealth: integer("battery_health"),
  accessories: text("accessories"),
  repairs: text("repairs"),
  physicalCondition: text("physical_condition"),
  screenCondition: text("screen_condition"),
  submittedAt: text("submitted_at"),
  reviewedAt: text("reviewed_at"),
  reviewedBy: text("reviewed_by").references(() => users.id),
  rejectionReasonCode: text("rejection_reason_code"),
  rejectionReasonText: text("rejection_reason_text"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false).notNull(),
  listedAt: text("listed_at").notNull(),
});

export const listingAuditHistory = sqliteTable("listing_audit_history", {
  id: text("id").primaryKey(),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id),
  actorId: text("actor_id")
    .notNull()
    .references(() => users.id),
  actorRole: text("actor_role", { enum: ["BUYER", "SELLER", "ADMIN", "SYSTEM"] }).notNull(),
  action: text("action").notNull(),
  previousStatus: text("previous_status"),
  newStatus: text("new_status").notNull(),
  reasonCode: text("reason_code"),
  reasonText: text("reason_text"),
  createdAt: text("created_at").notNull(),
});

export const inspectionItems = sqliteTable("inspection_items", {
  id: text("id").primaryKey(),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id),
  component: text("component").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => users.id),
  amountPoisha: integer("amount_poisha").notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status", {
    enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "DISPUTED", "CANCELLED"],
  })
    .default("PENDING")
    .notNull(),
  shippingAddressJson: text("shipping_address_json").notNull(),
  nidNumber: text("nid_number").notNull(),
  createdAt: text("created_at").notNull(),
});

export const disputes = sqliteTable("disputes", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  reason: text("reason").notNull(),
  explanation: text("explanation").notNull(),
  status: text("status", { enum: ["OPEN", "RESOLVED_REFUND", "RESOLVED_REJECTED"] })
    .default("OPEN")
    .notNull(),
  createdAt: text("created_at").notNull(),
});
