import { taka } from "@/data/catalog";

export interface OrderItem {
  listingId: string;
  productId: string;
  name: string;
  grade: string;
  price: number;
  image?: string;
  sellerName?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  address: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "DISPUTED" | "CANCELLED";
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  nidNumber: string;
  createdAt: string;
}

const STORAGE_KEY = "resale.orders";

const INITIAL_SAMPLE_ORDERS: OrderRecord[] = [
  {
    id: "ORD-84392",
    date: "2026-08-14",
    status: "SHIPPED",
    items: [
      {
        listingId: "l-1",
        productId: "iphone-15-pro-256",
        name: "iPhone 15 Pro 256GB - Titanium",
        grade: "A+",
        price: 95000,
        sellerName: "Rafiq H.",
      },
    ],
    subtotal: 95000,
    deliveryFee: 150,
    total: 95150,
    paymentMethod: "cod",
    shippingAddress: {
      name: "Customer",
      phone: "01700000000",
      division: "Dhaka",
      district: "Dhaka",
      area: "Banani",
      address: "Road 11, House 45",
    },
    nidNumber: "199526920199201",
    createdAt: "2026-08-14T10:00:00.000Z",
  },
  {
    id: "ORD-71204",
    date: "2026-07-20",
    status: "DELIVERED",
    items: [
      {
        listingId: "l-2",
        productId: "macbook-air-m2",
        name: "MacBook Air M2 8/256 - Space Gray",
        grade: "A",
        price: 112000,
        sellerName: "Nusrat T.",
      },
    ],
    subtotal: 112000,
    deliveryFee: 200,
    total: 112200,
    paymentMethod: "bkash",
    shippingAddress: {
      name: "Customer",
      phone: "01700000000",
      division: "Dhaka",
      district: "Dhaka",
      area: "Gulshan-2",
      address: "Road 44, House 12",
    },
    nidNumber: "199526920199201",
    createdAt: "2026-07-20T14:30:00.000Z",
  },
];

export function getOrders(): OrderRecord[] {
  if (typeof window === "undefined") return INITIAL_SAMPLE_ORDERS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_ORDERS));
      return INITIAL_SAMPLE_ORDERS;
    }
    const parsed = JSON.parse(raw) as OrderRecord[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SAMPLE_ORDERS;
  } catch {
    return INITIAL_SAMPLE_ORDERS;
  }
}

export function getOrderById(id: string): OrderRecord | undefined {
  const orders = getOrders();
  return orders.find((o) => o.id.toUpperCase() === id.toUpperCase());
}

export function saveOrder(order: OrderRecord): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getOrders();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save order to localStorage:", error);
  }
}
