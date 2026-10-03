// Centralized typed HTTP client for Admin SPA → /api/admin/* endpoints
// All calls send the rst_ token as Bearer token. No service-role key ever touches this file.

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id?: string;
  phone: string;
  email?: string;
  name?: string;
  role?: "BUYER" | "SELLER" | "ADMIN";
  isAdmin?: boolean;
}

export interface AuditItem {
  id: string;
  listingId: string;
  action: string;
  actorRole: string;
  previousStatus: string | null;
  newStatus: string;
  reasonText: string | null;
  createdAt: string;
}

export interface RecentOrderItem {
  id: string;
  status: string;
  amountBDT: number;
  district: string;
  createdAt: string;
}

export interface DashboardMetrics {
  pendingModerationCount: number;
  activeListingsCount: number;
  totalOrdersCount: number;
  settledGmvBDT: number;
  orderStatusBreakdown: Record<string, number>;
  listingStatusBreakdown?: Record<string, number>;
  openDisputesCount?: number;
  unverifiedSellersCount?: number;
  recentOrders?: RecentOrderItem[];
  recentAuditFeed: AuditItem[];
  dataSource: string;
}

export interface AdminListing {
  id: string;
  productName: string;
  brand: string;
  category: string;
  price: number;
  grade: string;
  status: string;
  sellerName: string;
  createdAt: string;
  image?: string;
  availability?: string;
}

export interface AdminOrder {
  id: string;
  status: string;
  amountBDT: number;
  buyerName: string;
  sellerName: string;
  district: string;
  createdAt: string;
  listingTitle?: string;
}

export interface ModerationItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  category: string;
  image: string;
  retailPrice: number;
  price: number;
  grade: string;
  conditionScore: number;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerVerified: boolean;
  sellerNote: string;
  warrantyMonths: number;
  hasInvoice: boolean;
  accessories: string;
  repairs: string;
  physicalCondition: string;
  screenCondition: string;
  batteryHealth: number | null;
  submittedAt: string;
}

export interface AdminUser {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  role: string;
  isAdmin: boolean;
  createdAt: string;
  listingCount?: number;
  orderCount?: number;
}

export interface SellerVerificationItem {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  isVerified: boolean;
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  nidDocUrl?: string | null;
  selfieUrl?: string | null;
  verificationNote?: string | null;
  verificationReviewedAt?: string | null;
  createdAt: string;
  listingCount?: number;
}

export interface PaymentRow {
  paymentMethod: string;
  status: string;
  amountBDT: number;
  count: number;
}

export interface PaymentSummary {
  // Actual backend fields
  rows?: PaymentRow[];
  byMethod?: Record<string, { totalBDT: number; count: number }>;
  grandTotalBDT?: number;
  grandTotalCount?: number;
  // Legacy / optional
  totalRevenueBDT?: number;
  settledBDT?: number;
  pendingBDT?: number;
  refundedBDT?: number;
  transactionCount?: number;
  recentTransactions?: Array<{
    id: string;
    amountBDT: number;
    status: string;
    createdAt: string;
  }>;
}

export interface AnalyticsTimelineItem {
  month: string;
  orders: number;
  gmvBDT: number;
  listings: number;
  moderationActions: number;
}

export interface AnalyticsCategoryItem {
  category: string;
  orders: number;
  gmvBDT: number;
}

export interface AnalyticsData {
  // Actual backend fields
  timeline?: AnalyticsTimelineItem[];
  categoryVolume?: AnalyticsCategoryItem[];
  // Legacy / optional
  dailySales?: Array<{ date: string; revenue: number; orders: number }>;
  topProducts?: Array<{ productName: string; sales: number; revenue: number }>;
  conversionRate?: number;
  averageOrderValue?: number;
}

export interface DistrictData {
  district: string;
  orders: number;
  settledSalesBDT: number;
  userCount?: number;
}

export interface GeographicData {
  districts: DistrictData[];
  totalOrders: number;
  totalSalesBDT: number;
}

export type GeoTimeRange = "today" | "7d" | "30d" | "90d" | "this_year" | "all";

export interface InspectionItem {
  id: string;
  listingId: string;
  productName: string;
  grade: string;
  conditionScore: number;
  inspectedAt?: string;
  inspector?: string;
  passed: boolean;
}

export interface DisputeItem {
  id: string;
  orderId: string;
  buyerName: string;
  sellerName: string;
  reason: string;
  status: string;
  createdAt: string;
  amountBDT?: number;
}

export type ListingRejectionReasonCode =
  | "INCOMPLETE_INFO"
  | "MISLEADING_PRICE"
  | "COUNTERFEIT"
  | "PROHIBITED_ITEM"
  | "LOW_QUALITY_IMAGES"
  | "WRONG_CATEGORY"
  | "OTHER";

// ── Token management ───────────────────────────────────────────────────────────

const TOKEN_KEY = "resale.session_token";

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

// ── Core fetch helper ──────────────────────────────────────────────────────────

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = options.token ?? getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = (await res.json()) as T;

  if (!res.ok) {
    const errData = data as { error?: string };
    throw new Error(errData.error ?? `Request failed: ${res.status}`);
  }

  return data;
}

// ── API Client ─────────────────────────────────────────────────────────────────

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}

interface SessionResponse {
  success: boolean;
  valid: boolean;
  user?: AuthUser;
}

interface ApiDataResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface MutationResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const adminApi = {
  // ── Auth ──────────────────────────────────────────────────────────
  login: (identifier: string, password: string) => {
    const isEmail = identifier.includes("@");
    return request<LoginResponse>("/api/admin/auth/login", {
      method: "POST",
      body: {
        [isEmail ? "email" : "phone"]: identifier,
        password,
      },
      token: null,
    });
  },

  getSession: () => request<SessionResponse>("/api/admin/auth/session"),

  logout: () => request<MutationResponse>("/api/admin/auth/logout", { method: "POST" }),

  // ── Dashboard ─────────────────────────────────────────────────────
  getDashboard: () => request<ApiDataResponse<DashboardMetrics>>("/api/admin/dashboard"),

  // ── Orders ────────────────────────────────────────────────────────
  getOrders: () => request<ApiDataResponse<AdminOrder[]>>("/api/admin/orders"),

  // ── Listings ──────────────────────────────────────────────────────
  getListings: () => request<ApiDataResponse<AdminListing[]>>("/api/admin/listings"),

  patchListing: (
    id: string,
    updates: { price?: number; sellerNote?: string; accessories?: string },
  ) =>
    request<MutationResponse>(`/api/admin/listings/${id}`, {
      method: "PATCH",
      body: updates,
    }),

  // ── Moderation ────────────────────────────────────────────────────
  getModerationQueue: () => request<ApiDataResponse<ModerationItem[]>>("/api/admin/moderation"),

  moderateListing: (
    id: string,
    action: "APPROVE" | "REJECT",
    reasonCode?: ListingRejectionReasonCode,
    reasonText?: string,
  ) =>
    request<MutationResponse>(`/api/admin/listings/${id}/moderate`, {
      method: "POST",
      body: { action, reasonCode, reasonText },
    }),

  // ── Availability ──────────────────────────────────────────────────
  setListingAvailability: (id: string, action: "PAUSE" | "RESUME" | "DELIST") =>
    request<MutationResponse>(`/api/admin/listings/${id}/availability`, {
      method: "POST",
      body: { action },
    }),

  // ── Inspections ───────────────────────────────────────────────────
  getInspections: () => request<ApiDataResponse<InspectionItem[]>>("/api/admin/inspections"),

  // ── Disputes ──────────────────────────────────────────────────────
  getDisputes: () => request<ApiDataResponse<DisputeItem[]>>("/api/admin/disputes"),

  // ── Users ─────────────────────────────────────────────────────────
  getUsers: () => request<ApiDataResponse<AdminUser[]>>("/api/admin/users"),

  // ── Identity / Seller Verification ───────────────────────────────
  getSellerVerification: () =>
    request<ApiDataResponse<SellerVerificationItem[]>>("/api/admin/identity"),

  actOnSellerVerification: (sellerId: string, action: "APPROVE" | "REJECT", note?: string) =>
    request<MutationResponse>(`/api/admin/identity/${sellerId}/verify`, {
      method: "POST",
      body: { action, note },
    }),

  // ── Payments ──────────────────────────────────────────────────────
  getPayments: () => request<ApiDataResponse<PaymentSummary>>("/api/admin/payments"),

  // ── Analytics ─────────────────────────────────────────────────────
  getAnalytics: () => request<ApiDataResponse<AnalyticsData>>("/api/admin/analytics"),

  // ── Geography ─────────────────────────────────────────────────────
  getGeography: (timeRange: GeoTimeRange = "all") =>
    request<ApiDataResponse<GeographicData>>(`/api/admin/geography?timeRange=${timeRange}`),
};
