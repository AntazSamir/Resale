import { products as catalogProducts, listings as catalogListings } from "@/data/catalog";
import * as schema from "./schema";

export type User = typeof schema.users.$inferSelect;
export type Product = typeof schema.products.$inferSelect;
export type Listing = typeof schema.listings.$inferSelect;
export type Order = typeof schema.orders.$inferSelect;
export type Dispute = typeof schema.disputes.$inferSelect;
export type InspectionItem = typeof schema.inspectionItems.$inferSelect;

export interface OtpRecord {
  target: string;
  phone?: string | undefined;
  email?: string | undefined;
  otp: string;
  expiresAt: number;
}

export interface SessionRecord {
  token: string;
  userId: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  isAdmin: boolean;
  phone?: string | undefined;
  email?: string | undefined;
  name?: string | undefined;
  expiresAt: number;
  createdAt: string;
}

// In-memory data store that runs seamlessly in any JS runtime
// (Cloudflare Workers, Nitro, Node, Edge, Browser) with zero native C++ bindings.
class MemoryDatabase {
  users: User[] = [
    {
      id: "u-admin",
      phone: "01700000000",
      email: "admin@resale.com",
      name: "Admin User",
      nidNumber: "199526920199201",
      role: "ADMIN",
      verified: true,
      createdAt: new Date("2026-01-01").toISOString(),
    },
    {
      id: "u-1",
      phone: "01711111111",
      email: "seller.rafiq@example.com",
      name: "Rafiq H.",
      nidNumber: "199526920199202",
      role: "SELLER",
      verified: true,
      createdAt: new Date("2026-01-15").toISOString(),
    },
    {
      id: "u-2",
      phone: "01722222222",
      email: "seller.nusrat@example.com",
      name: "Nusrat T.",
      nidNumber: "199526920199203",
      role: "SELLER",
      verified: true,
      createdAt: new Date("2026-02-01").toISOString(),
    },
  ];

  products: Product[] = catalogProducts.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    retailPricePoisha: p.retail * 100,
    image: p.image,
    specsJson: JSON.stringify(p.specs),
  }));

  listings: Listing[] = catalogListings.map((l) => ({
    id: l.id,
    productId: l.productId,
    sellerId: "u-1",
    grade: l.grade,
    conditionScore: l.conditionScore,
    pricePoisha: l.price * 100,
    sellerNote: l.sellerNote,
    status: "PUBLISHED",
    warrantyMonths: l.warrantyMonths,
    hasInvoice: l.invoice,
    batteryHealth: l.battery ?? null,
    accessories: l.accessories,
    repairs: l.repairs,
    physicalCondition: l.physical,
    screenCondition: l.screen,
    listedAt: l.listedAt,
  }));

  orders: Order[] = [
    {
      id: "ORD-84392",
      listingId: "l-1",
      buyerId: "u-admin",
      amountPoisha: 12400000,
      paymentMethod: "cod",
      status: "SHIPPED",
      shippingAddressJson: JSON.stringify({
        name: "Admin User",
        phone: "01700000000",
        division: "Dhaka",
        district: "Dhaka",
        area: "Banani",
        address: "Road 11, House 45",
      }),
      nidNumber: "199526920199201",
      createdAt: "2026-08-14T10:00:00.000Z",
    },
    {
      id: "ORD-71204",
      listingId: "l-2",
      buyerId: "u-admin",
      amountPoisha: 4500000,
      paymentMethod: "bkash",
      status: "DELIVERED",
      shippingAddressJson: JSON.stringify({
        name: "Admin User",
        phone: "01700000000",
        division: "Dhaka",
        district: "Dhaka",
        area: "Gulshan-2",
        address: "Road 44, House 12",
      }),
      nidNumber: "199526920199201",
      createdAt: "2026-07-20T14:30:00.000Z",
    },
  ];

  disputes: Dispute[] = [];
  otps: Map<string, OtpRecord> = new Map();
  sessions: Map<string, SessionRecord> = new Map();

  // Drizzle-like chainable select/query helper for compatibility
  select() {
    return {
      from: <T>(table: T) => {
        let items: unknown[] = [];
        if (table === schema.products) items = [...this.products];
        else if (table === schema.listings) items = [...this.listings];
        else if (table === schema.users) items = [...this.users];
        else if (table === schema.orders) items = [...this.orders];
        else if (table === schema.disputes) items = [...this.disputes];

        return {
          where: (predicate?: (item: unknown) => boolean) => {
            if (predicate && typeof predicate === "function") {
              return items.filter(predicate);
            }
            return items;
          },
          then: <R>(resolve: (val: unknown[]) => R) => Promise.resolve(resolve(items)),
        };
      },
    };
  }

  insert<T>(table: T) {
    return {
      values: <V>(values: V) => {
        if (table === schema.users) {
          const u = values as unknown as User;
          const existing = this.users.find((entry) => entry.id === u.id || entry.phone === u.phone);
          if (!existing) this.users.push(u);
        } else if (table === schema.products) {
          const p = values as unknown as Product;
          const existing = this.products.find((entry) => entry.id === p.id);
          if (!existing) this.products.push(p);
        } else if (table === schema.listings) {
          this.listings.unshift(values as unknown as Listing);
        } else if (table === schema.orders) {
          this.orders.unshift(values as unknown as Order);
        } else if (table === schema.disputes) {
          this.disputes.unshift(values as unknown as Dispute);
        }

        return {
          onConflictDoNothing: () => Promise.resolve(),
          then: <R>(resolve: (val: V) => R) => Promise.resolve(resolve(values)),
        };
      },
    };
  }
}

// Global singleton instance
export const db = new MemoryDatabase();
export { schema };
