import { upsertUserRecordFn, upsertOrderFn, listOrdersFn } from "./db-server";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUND_REQUESTED"
  | "REFUNDED"
  | "DISPUTED";

export type PaymentStatus =
  "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUND_PENDING" | "REFUNDED";

export type PaymentMethod = "COD" | "BKASH" | "NAGAD" | "SSLCOMMERZ" | "CARD";

export interface OrderItemSnapshot {
  listingId: string;
  productId: string;
  name: string;
  grade: string;
  conditionScore?: number | undefined;
  price: number;
  image?: string | undefined;
  sellerId?: string | undefined;
  sellerName?: string | undefined;
  sellerDistrict?: string | undefined;
  storeId?: string | undefined;
  storeName?: string | undefined;
  warrantyMonths?: number | undefined;
  accessories?: string | undefined;
  includedItems?: string[] | undefined;
}

// Backward-compatible alias
export type OrderItem = OrderItemSnapshot;

export interface ShippingAddress {
  name: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  address: string;
}

export interface OrderTimelineEvent {
  id: string;
  type:
    | "ORDER_CREATED"
    | "ORDER_CONFIRMED"
    | "ORDER_PROCESSING"
    | "ORDER_READY_TO_SHIP"
    | "ORDER_SHIPPED"
    | "ORDER_DELIVERED"
    | "ORDER_COMPLETED"
    | "ORDER_CANCELLED"
    | "REFUND_REQUESTED"
    | "REFUNDED"
    | "PAYMENT_COLLECTED";
  title: string;
  description: string;
  timestamp: string;
  actor: "BUYER" | "SELLER" | "ADMIN" | "COURIER" | "SYSTEM";
  metadata?: Record<string, unknown> | undefined;
}

export interface OrderRecord {
  id: string;
  date: string;
  orderStatus: OrderStatus;
  status: OrderStatus; // Legacy compatibility alias
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  currency: "BDT";
  shippingAddress: ShippingAddress;
  buyerContact?:
    | {
        name: string;
        phone: string;
        nidNumber?: string | undefined;
      }
    | undefined;
  nidNumber?: string | undefined; // Legacy compatibility alias
  timeline: OrderTimelineEvent[];
  cancellation?:
    | {
        reason: string;
        actor: "BUYER" | "SELLER" | "ADMIN";
        timestamp: string;
        previousStatus: OrderStatus;
      }
    | undefined;
  refundStatus?: ("NONE" | "REQUESTED" | "PROCESSING" | "REFUNDED" | "REJECTED") | undefined;
  isSampleData?: boolean | undefined;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | undefined;
}

const STORAGE_KEY = "resale.orders.v3";
const LEGACY_STORAGE_KEY = "resale.orders";

export const DEFAULT_DELIVERY_FEE = 120;

// In-memory listeners for cross-component and remote sync updates
type OrderListener = (orders: OrderRecord[]) => void;
const listeners = new Set<OrderListener>();

export function onOrdersChange(callback: OrderListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifyListeners(orders: OrderRecord[]): void {
  listeners.forEach((fn) => {
    try {
      fn(orders);
    } catch {
      // ignore
    }
  });
}

/**
 * Shared price calculation utility across cart, checkout, orders, seller, and admin
 */
export function calculateOrderTotals(params: {
  items: { price: number; quantity?: number }[];
  deliveryFee?: number;
  discount?: number;
}): {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
} {
  const subtotal = params.items.reduce((acc, it) => acc + it.price * (it.quantity ?? 1), 0);
  const deliveryFee = params.deliveryFee ?? DEFAULT_DELIVERY_FEE;
  const discount = Math.max(0, params.discount ?? 0);
  const total = Math.max(0, subtotal + deliveryFee - discount);

  return { subtotal, deliveryFee, discount, total };
}

/**
 * Creates an event object for the order timeline
 */
export function createOrderTimelineEvent(
  type: OrderTimelineEvent["type"],
  title: string,
  description: string,
  actor: OrderTimelineEvent["actor"],
  metadata?: Record<string, unknown>,
): OrderTimelineEvent {
  return {
    id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    title,
    description,
    timestamp: new Date().toISOString(),
    actor,
    metadata,
  };
}

/**
 * Cancellation rule: allowed only for PENDING and CONFIRMED stages before physical dispatch
 */
export function canCancelOrder(order: OrderRecord): boolean {
  return order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED";
}

/**
 * State machine enforcing valid sequential lifecycle transitions
 */
export function getValidNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  switch (currentStatus) {
    case "PENDING":
      return ["CONFIRMED", "CANCELLED"];
    case "CONFIRMED":
      return ["PROCESSING", "CANCELLED"];
    case "PROCESSING":
      return ["READY_TO_SHIP"];
    case "READY_TO_SHIP":
      return ["SHIPPED"];
    case "SHIPPED":
      return ["DELIVERED"];
    case "DELIVERED":
      return ["COMPLETED", "REFUND_REQUESTED"];
    case "REFUND_REQUESTED":
      return ["REFUNDED", "COMPLETED", "DISPUTED"];
    case "DISPUTED":
      return ["REFUNDED", "COMPLETED"];
    case "COMPLETED":
    case "CANCELLED":
    case "REFUNDED":
    default:
      return [];
  }
}

/**
 * Sample Demo Data labeled explicitly
 */
const INITIAL_SAMPLE_ORDERS: OrderRecord[] = [
  {
    id: "ORD-84392",
    date: "2026-08-14",
    orderStatus: "SHIPPED",
    status: "SHIPPED",
    paymentStatus: "PENDING",
    paymentMethod: "COD",
    items: [
      {
        listingId: "l-1",
        productId: "iphone-15-pro-256",
        name: "iPhone 15 Pro 256GB - Titanium (Grade A)",
        grade: "A",
        conditionScore: 94,
        price: 95000,
        image: "/assets/p-phone.jpg",
        sellerId: "s-1",
        sellerName: "Rafiq H.",
        sellerDistrict: "Dhaka",
        warrantyMonths: 4,
        accessories: "Original Box, 20W USB-C Cable",
        includedItems: ["Original Box", "20W USB-C Cable"],
      },
    ],
    subtotal: 95000,
    deliveryFee: 120,
    discount: 0,
    total: 95120,
    currency: "BDT",
    shippingAddress: {
      name: "Tanvir Ahmed",
      phone: "01700000000",
      division: "Dhaka",
      district: "Dhaka",
      area: "Banani",
      address: "Road 11, House 45, Flat 4B",
    },
    buyerContact: {
      name: "Tanvir Ahmed",
      phone: "01700000000",
      nidNumber: "199526920199201",
    },
    nidNumber: "199526920199201",
    timeline: [
      {
        id: "evt-sample-1",
        type: "ORDER_CREATED",
        title: "Order Placed (Cash on Delivery)",
        description: "Order placed by buyer. Payment of ৳95,120 is due upon delivery.",
        timestamp: "2026-08-14T10:00:00.000Z",
        actor: "BUYER",
      },
      {
        id: "evt-sample-2",
        type: "ORDER_CONFIRMED",
        title: "Order Confirmed by Seller",
        description: "Seller Rafiq H. confirmed availability and device condition.",
        timestamp: "2026-08-14T12:30:00.000Z",
        actor: "SELLER",
      },
      {
        id: "evt-sample-3",
        type: "ORDER_PROCESSING",
        title: "Packing & Preparing Device",
        description: "Item boxed and packaged with security seal.",
        timestamp: "2026-08-14T15:00:00.000Z",
        actor: "SELLER",
      },
      {
        id: "evt-sample-4",
        type: "ORDER_SHIPPED",
        title: "Dispatched with Courier",
        description: "Handed over to courier partner for delivery in Dhaka.",
        timestamp: "2026-08-15T09:00:00.000Z",
        actor: "COURIER",
      },
    ],
    isSampleData: true,
    createdAt: "2026-08-14T10:00:00.000Z",
    updatedAt: "2026-08-15T09:00:00.000Z",
  },
  {
    id: "ORD-71204",
    date: "2026-07-20",
    orderStatus: "DELIVERED",
    status: "DELIVERED",
    paymentStatus: "PAID",
    paymentMethod: "COD",
    items: [
      {
        listingId: "l-2",
        productId: "macbook-air-m2",
        name: "MacBook Air M2 8/256 - Space Gray (Grade A)",
        grade: "A",
        conditionScore: 92,
        price: 112000,
        image: "/assets/p-laptop.jpg",
        sellerId: "s-2",
        sellerName: "Nusrat T.",
        sellerDistrict: "Dhaka",
        warrantyMonths: 6,
        accessories: "Original Box, 30W Power Adapter, MagSafe Cable",
        includedItems: ["Original Box", "30W Power Adapter", "MagSafe Cable"],
      },
    ],
    subtotal: 112000,
    deliveryFee: 120,
    discount: 0,
    total: 112120,
    currency: "BDT",
    shippingAddress: {
      name: "Farhana Islam",
      phone: "01800000000",
      division: "Dhaka",
      district: "Dhaka",
      area: "Gulshan-2",
      address: "Road 44, House 12",
    },
    buyerContact: {
      name: "Farhana Islam",
      phone: "01800000000",
      nidNumber: "199426920199202",
    },
    nidNumber: "199426920199202",
    timeline: [
      {
        id: "evt-sample-5",
        type: "ORDER_CREATED",
        title: "Order Placed (Cash on Delivery)",
        description: "Order placed by buyer. Payment of ৳112,120 due upon delivery.",
        timestamp: "2026-07-20T14:30:00.000Z",
        actor: "BUYER",
      },
      {
        id: "evt-sample-6",
        type: "ORDER_CONFIRMED",
        title: "Order Confirmed by Seller",
        description: "Seller Nusrat T. verified device condition.",
        timestamp: "2026-07-20T16:00:00.000Z",
        actor: "SELLER",
      },
      {
        id: "evt-sample-7",
        type: "ORDER_SHIPPED",
        title: "Shipped via Courier",
        description: "Dispatched from Dhaka Hub.",
        timestamp: "2026-07-21T10:00:00.000Z",
        actor: "COURIER",
      },
      {
        id: "evt-sample-8",
        type: "ORDER_DELIVERED",
        title: "Delivered & Payment Collected",
        description: "Doorstep delivery completed. 48-hour inspection window active.",
        timestamp: "2026-07-22T14:00:00.000Z",
        actor: "COURIER",
      },
      {
        id: "evt-sample-9",
        type: "PAYMENT_COLLECTED",
        title: "Cash on Delivery Settled",
        description: "Payment of ৳112,120 collected by courier.",
        timestamp: "2026-07-22T14:05:00.000Z",
        actor: "COURIER",
      },
    ],
    isSampleData: true,
    createdAt: "2026-07-20T14:30:00.000Z",
    updatedAt: "2026-07-22T14:05:00.000Z",
    completedAt: "2026-07-24T14:00:00.000Z",
  },
];

/**
 * Maps Supabase PostgreSQL row to strongly-typed frontend OrderRecord
 */
export function rowToOrderRecord(row: Record<string, unknown>): OrderRecord {
  const addrJson =
    typeof row["shipping_address_json"] === "object" && row["shipping_address_json"] !== null
      ? (row["shipping_address_json"] as Record<string, unknown>)
      : {};

  const meta =
    typeof addrJson["_orderSnapshot"] === "object" && addrJson["_orderSnapshot"] !== null
      ? (addrJson["_orderSnapshot"] as Record<string, unknown>)
      : null;

  const cleanedAddress: ShippingAddress = {
    name: typeof addrJson["name"] === "string" ? addrJson["name"] : "Customer",
    phone: typeof addrJson["phone"] === "string" ? addrJson["phone"] : "",
    division: typeof addrJson["division"] === "string" ? addrJson["division"] : "Dhaka",
    district: typeof addrJson["district"] === "string" ? addrJson["district"] : "Dhaka",
    area: typeof addrJson["area"] === "string" ? addrJson["area"] : "",
    address: typeof addrJson["address"] === "string" ? addrJson["address"] : "",
  };

  const id = typeof row["id"] === "string" ? row["id"] : `ORD-${Date.now()}`;
  const amountPoisha = typeof row["amount_poisha"] === "number" ? row["amount_poisha"] : 0;
  const total =
    meta && typeof meta["total"] === "number" ? meta["total"] : Math.round(amountPoisha / 100);
  const subtotal = meta && typeof meta["subtotal"] === "number" ? meta["subtotal"] : total;
  const deliveryFee =
    meta && typeof meta["deliveryFee"] === "number" ? meta["deliveryFee"] : DEFAULT_DELIVERY_FEE;
  const discount = meta && typeof meta["discount"] === "number" ? meta["discount"] : 0;

  const statusRaw = typeof row["status"] === "string" ? row["status"] : "PENDING";
  const orderStatus = (statusRaw.toUpperCase() as OrderStatus) || "PENDING";

  const paymentMethodRaw =
    typeof row["payment_method"] === "string" ? row["payment_method"].toUpperCase() : "COD";
  const paymentMethod = (paymentMethodRaw as PaymentMethod) || "COD";

  const paymentStatus: PaymentStatus =
    meta && typeof meta["paymentStatus"] === "string"
      ? (meta["paymentStatus"] as PaymentStatus)
      : orderStatus === "DELIVERED" || orderStatus === "COMPLETED"
        ? "PAID"
        : "PENDING";

  const items: OrderItemSnapshot[] =
    meta && Array.isArray(meta["items"])
      ? (meta["items"] as OrderItemSnapshot[])
      : [
          {
            listingId: typeof row["listing_id"] === "string" ? row["listing_id"] : "l-1",
            productId: "iphone-15-pro-256",
            name: `Item (Listing #${typeof row["listing_id"] === "string" ? row["listing_id"] : "1"})`,
            grade: "A",
            price: total,
          },
        ];
  const nidNumber = typeof row["nid_number"] === "string" ? row["nid_number"] : "199526920199201";

  const buyerContact =
    meta && typeof meta["buyerContact"] === "object" && meta["buyerContact"] !== null
      ? (meta["buyerContact"] as { name: string; phone: string; nidNumber?: string })
      : {
          name: cleanedAddress.name,
          phone: cleanedAddress.phone,
          nidNumber,
        };

  const createdAt =
    typeof row["created_at"] === "string" ? row["created_at"] : new Date().toISOString();

  const timeline: OrderTimelineEvent[] =
    meta && Array.isArray(meta["timeline"])
      ? (meta["timeline"] as OrderTimelineEvent[])
      : [
          {
            id: `evt-${id}`,
            type: "ORDER_CREATED",
            title: `Order Placed (${paymentMethod})`,
            description: "Order recorded in persistent database",
            timestamp: createdAt,
            actor: "BUYER",
          },
        ];

  return {
    id,
    date:
      meta && typeof meta["date"] === "string"
        ? meta["date"]
        : createdAt.split("T")[0] || "2026-08-23",
    orderStatus,
    status: orderStatus,
    paymentStatus,
    paymentMethod,
    items,
    subtotal,
    deliveryFee,
    discount,
    total,
    currency: "BDT",
    shippingAddress: cleanedAddress,
    buyerContact,
    nidNumber,
    timeline,
    cancellation:
      meta && typeof meta["cancellation"] === "object" && meta["cancellation"] !== null
        ? (meta["cancellation"] as OrderRecord["cancellation"])
        : undefined,
    refundStatus:
      meta && typeof meta["refundStatus"] === "string"
        ? (meta["refundStatus"] as OrderRecord["refundStatus"])
        : undefined,
    isSampleData: false,
    createdAt,
    updatedAt: createdAt,
    completedAt: meta && typeof meta["completedAt"] === "string" ? meta["completedAt"] : undefined,
  };
}

function mapToDbStatus(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "PENDING";
    case "CONFIRMED":
    case "PROCESSING":
    case "READY_TO_SHIP":
      return "CONFIRMED";
    case "SHIPPED":
      return "SHIPPED";
    case "DELIVERED":
    case "COMPLETED":
      return "DELIVERED";
    case "CANCELLED":
      return "CANCELLED";
    case "DISPUTED":
    case "REFUND_REQUESTED":
    case "REFUNDED":
      return "DISPUTED";
    default:
      return "PENDING";
  }
}

/**
 * Maps frontend OrderRecord to Supabase PostgreSQL row
 */
export function orderRecordToSupabase(order: OrderRecord): Record<string, unknown> {
  const listingId = order.items[0]?.listingId || "l-1";
  const buyerId = order.buyerContact?.phone
    ? `u-${order.buyerContact.phone.replace(/\D/g, "")}`
    : "u-admin";

  return {
    id: order.id,
    listing_id: listingId,
    buyer_id: buyerId,
    amount_poisha: Math.round(order.total * 100),
    payment_method: order.paymentMethod,
    status: mapToDbStatus(order.orderStatus),
    shipping_address_json: {
      ...order.shippingAddress,
      _orderSnapshot: {
        orderStatus: order.orderStatus,
        items: order.items,
        timeline: order.timeline,
        cancellation: order.cancellation,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        discount: order.discount,
        total: order.total,
        date: order.date,
        buyerContact: order.buyerContact,
        refundStatus: order.refundStatus,
        completedAt: order.completedAt,
      },
    },
    nid_number: order.buyerContact?.nidNumber || order.nidNumber || "199526920199201",
    created_at: order.createdAt || new Date().toISOString(),
  };
}

/**
 * Fetches all orders directly from Supabase PostgreSQL, updates local cache, and notifies listeners
 */
export async function fetchOrdersAsync(): Promise<OrderRecord[]> {
  try {
    const { json, error } = await listOrdersFn();
    const rows = JSON.parse(json || "[]") as Array<Record<string, unknown>>;

    if (error || !Array.isArray(rows) || rows.length === 0) {
      if (error) {
        console.warn("listOrdersFn error, using local cache:", error);
      }
      return getOrders();
    }

    const remoteOrders = rows.map((r) => rowToOrderRecord(r as Record<string, unknown>));

    // Merge with any unique local records if present
    if (typeof window !== "undefined") {
      const local = readLocalOrders();
      const mergedMap = new Map<string, OrderRecord>();
      // Remote takes precedence
      remoteOrders.forEach((o) => mergedMap.set(o.id.toUpperCase(), o));
      local.forEach((o) => {
        if (!mergedMap.has(o.id.toUpperCase())) {
          mergedMap.set(o.id.toUpperCase(), o);
        }
      });
      const merged = Array.from(mergedMap.values());
      writeLocalOrders(merged);
      notifyListeners(merged);
      return merged;
    }

    notifyListeners(remoteOrders);
    return remoteOrders;
  } catch (err) {
    console.warn("fetchOrdersAsync exception, using local cache:", err);
    return getOrders();
  }
}

function readLocalOrders(): OrderRecord[] {
  if (typeof window === "undefined") return INITIAL_SAMPLE_ORDERS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
            return parsedLegacy as OrderRecord[];
          }
        } catch {
          // ignore
        }
      }
      return INITIAL_SAMPLE_ORDERS;
    }
    const parsed = JSON.parse(raw) as OrderRecord[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SAMPLE_ORDERS;
  } catch {
    return INITIAL_SAMPLE_ORDERS;
  }
}

function writeLocalOrders(orders: OrderRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

let syncInitiated = false;

/**
 * Retrieves all stored orders immediately from cache and triggers a background sync with Supabase
 */
export function getOrders(): OrderRecord[] {
  const local = readLocalOrders();

  // Initiate background Supabase sync on first read in client
  if (typeof window !== "undefined" && !syncInitiated) {
    syncInitiated = true;
    setTimeout(() => {
      fetchOrdersAsync().catch(() => {});
    }, 50);
  }

  return local;
}

/**
 * Retrieves a single order by ID
 */
export function getOrderById(id: string): OrderRecord | undefined {
  const orders = getOrders();
  return orders.find((o) => o.id.toUpperCase() === id.trim().toUpperCase());
}

async function syncOrderToSupabase(
  order: OrderRecord,
): Promise<{ success: boolean; error?: string }> {
  try {
    const buyerPhone = order.buyerContact?.phone || "01700000000";
    const buyerId = `u-${buyerPhone.replace(/\D/g, "") || "admin"}`;

    // 1. Ensure buyer exists in public.users to satisfy foreign key
    const userResult = await upsertUserRecordFn({
      data: {
        id: buyerId,
        phone: buyerPhone,
        name: order.buyerContact?.name || "Customer",
        nidNumber: order.buyerContact?.nidNumber || null,
        role: "BUYER",
        verified: true,
      },
    });
    if (!userResult.success) {
      console.warn("Supabase buyer upsert warning:", userResult.error);
      return userResult;
    }

    // 2. Upsert order (privileged server-side write)
    const payload = orderRecordToSupabase(order);
    payload["buyer_id"] = buyerId;
    return await upsertOrderFn({ data: payload });
  } catch (err) {
    console.warn("Supabase syncOrderToSupabase exception:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Saves a new or updated order to both local storage and persistent Supabase database
 */
export function saveOrder(order: OrderRecord): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readLocalOrders();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    writeLocalOrders(updated);
    notifyListeners(updated);

    // Asynchronously push to Supabase PostgreSQL with FK guarantee
    syncOrderToSupabase(order).catch(() => {});
  } catch (error) {
    console.error("Failed to save order:", error);
  }
}

/**
 * Async version of saveOrder that guarantees awaiting Supabase persistence
 */
export async function saveOrderAsync(
  order: OrderRecord,
): Promise<{ success: boolean; error?: string }> {
  saveOrder(order);
  return syncOrderToSupabase(order);
}

/**
 * Updates an existing order record in storage and Supabase
 */
export function updateOrder(
  orderId: string,
  updater: (order: OrderRecord) => OrderRecord,
): OrderRecord | undefined {
  if (typeof window === "undefined") return;
  try {
    const existing = readLocalOrders();
    const targetIndex = existing.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());
    if (targetIndex === -1) return undefined;

    const current = existing[targetIndex]!;
    const updated = updater({ ...current, updatedAt: new Date().toISOString() });
    existing[targetIndex] = updated;

    writeLocalOrders(existing);
    notifyListeners(existing);

    // Asynchronously update in Supabase
    syncOrderToSupabase(updated).catch(() => {});

    return updated;
  } catch (error) {
    console.error("Failed to update order:", error);
    return undefined;
  }
}

/**
 * Executes a controlled order status transition adhering to the lifecycle state machine
 */
export function transitionOrderStatus(
  orderId: string,
  nextStatus: OrderStatus,
  actor: OrderTimelineEvent["actor"] = "SELLER",
  note?: string,
): { success: boolean; order?: OrderRecord | undefined; error?: string | undefined } {
  const order = getOrderById(orderId);
  if (!order) return { success: false, error: `Order #${orderId} not found.` };

  const validNexts = getValidNextStatuses(order.orderStatus);
  if (!validNexts.includes(nextStatus)) {
    return {
      success: false,
      error: `Invalid status transition from ${order.orderStatus} to ${nextStatus}.`,
    };
  }

  // Derive title and description
  const titles: Record<OrderStatus, string> = {
    PENDING: "Order Placed",
    CONFIRMED: "Order Confirmed by Seller",
    PROCESSING: "Order Processing & Packing",
    READY_TO_SHIP: "Ready for Courier Handover",
    SHIPPED: "Dispatched & In Transit",
    DELIVERED: "Delivered to Doorstep",
    COMPLETED: "Order Completed & Funds Cleared",
    CANCELLED: "Order Cancelled",
    REFUND_REQUESTED: "Return/Refund Requested",
    REFUNDED: "Refund Completed",
    DISPUTED: "Dispute Under Admin Review",
  };

  const descriptions: Record<OrderStatus, string> = {
    PENDING: "Order placed. Awaiting seller confirmation.",
    CONFIRMED: note || "Seller confirmed device condition and reservation.",
    PROCESSING: note || "Item is being carefully packed with tamper-evident seal.",
    READY_TO_SHIP: note || "Package labeled and awaiting courier pickup.",
    SHIPPED: note || "Handed over to courier partner. Tracking active.",
    DELIVERED: note || "Doorstep delivery completed. 48-hour buyer inspection window started.",
    COMPLETED: note || "Inspection period ended without dispute. Transaction complete.",
    CANCELLED: note || "Order was cancelled.",
    REFUND_REQUESTED: note || "Buyer submitted return/refund request for review.",
    REFUNDED: note || "Return verified. Refund processed.",
    DISPUTED: note || "Order escalated to platform moderation.",
  };

  const eventTypeMap: Record<OrderStatus, OrderTimelineEvent["type"]> = {
    PENDING: "ORDER_CREATED",
    CONFIRMED: "ORDER_CONFIRMED",
    PROCESSING: "ORDER_PROCESSING",
    READY_TO_SHIP: "ORDER_READY_TO_SHIP",
    SHIPPED: "ORDER_SHIPPED",
    DELIVERED: "ORDER_DELIVERED",
    COMPLETED: "ORDER_COMPLETED",
    CANCELLED: "ORDER_CANCELLED",
    REFUND_REQUESTED: "REFUND_REQUESTED",
    REFUNDED: "REFUNDED",
    DISPUTED: "REFUND_REQUESTED",
  };

  const newEvent = createOrderTimelineEvent(
    eventTypeMap[nextStatus],
    titles[nextStatus],
    descriptions[nextStatus],
    actor,
  );

  const updatedOrder = updateOrder(orderId, (prev) => {
    const updatedPaymentStatus =
      nextStatus === "COMPLETED" || (nextStatus === "DELIVERED" && actor === "COURIER")
        ? "PAID"
        : prev.paymentStatus;

    return {
      ...prev,
      orderStatus: nextStatus,
      status: nextStatus,
      paymentStatus: updatedPaymentStatus,
      timeline: [...prev.timeline, newEvent],
      completedAt: nextStatus === "COMPLETED" ? newEvent.timestamp : prev.completedAt,
    };
  });

  return { success: true, order: updatedOrder };
}

/**
 * Executes controlled cancellation with reason recording and timeline update
 */
export function cancelOrder(
  orderId: string,
  reason: string,
  actor: "BUYER" | "SELLER" | "ADMIN",
): { success: boolean; order?: OrderRecord | undefined; error?: string | undefined } {
  const order = getOrderById(orderId);
  if (!order) return { success: false, error: `Order #${orderId} not found.` };

  if (!canCancelOrder(order)) {
    return {
      success: false,
      error: `Order #${orderId} cannot be cancelled because it is already in status '${order.orderStatus}'. Only PENDING and CONFIRMED orders can be cancelled.`,
    };
  }

  const cancelEvent = createOrderTimelineEvent(
    "ORDER_CANCELLED",
    `Order Cancelled by ${actor}`,
    `Cancellation reason: ${reason}`,
    actor,
    { reason, previousStatus: order.orderStatus },
  );

  const updatedOrder = updateOrder(orderId, (prev) => ({
    ...prev,
    orderStatus: "CANCELLED",
    status: "CANCELLED",
    cancellation: {
      reason,
      actor,
      timestamp: cancelEvent.timestamp,
      previousStatus: prev.orderStatus,
    },
    timeline: [...prev.timeline, cancelEvent],
  }));

  return { success: true, order: updatedOrder };
}
