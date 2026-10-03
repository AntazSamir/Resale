import { runWithStartContext } from "@tanstack/start-storage-context";
import {
  getSessionUser,
  getAdminDashboardMetricsFn,
  getAdminOrdersFn,
  getAdminListingsFn,
  getModerationQueueFn,
  getAdminInspectionsFn,
  getAdminDisputesFn,
  getAdminUsersFn,
  getAdminSellerVerificationFn,
  getAdminPaymentSummaryFn,
  getAdminAnalyticsFn,
  getAdminGeographicAnalyticsFn,
  moderateListingFn,
  updateListingAvailabilityFn,
  updateListingDetailsFn,
  adminActOnSellerVerificationFn,
  loginFn,
  validateSessionFn,
  signOutFn,
  type GeoTimeRange,
} from "@/lib/server-functions";
import type { ListingRejectionReasonCode } from "@/lib/types";

const ALLOWED_ORIGINS = [
  "http://localhost:5174",
  "https://admin.resale.com",
  ...(typeof process !== "undefined" && process.env?.["ADMIN_APP_URL"]
    ? [process.env["ADMIN_APP_URL"].replace(/\/$/, "")]
    : []),
];

function isOriginAllowed(origin: string | null, host: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (host && origin.includes(host)) return true;
  // Allow *.vercel.app preview & production domains
  if (/^https:\/\/[a-zA-Z0-9-_]+\.vercel\.app$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin");
  const host = request.headers.get("Host");

  const isAllowed = isOriginAllowed(origin, host);

  const headers: Record<string, string> = {
    Vary: "Origin, Access-Control-Request-Headers",
  };

  if (isAllowed && origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept";
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
}

function jsonResponse(
  data: unknown,
  status = 200,
  corsHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
    },
  });
}

function extractToken(request: Request, body?: Record<string, unknown>): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const t = authHeader.slice(7).trim();
    if (t) return t;
  }

  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token");
  if (queryToken) return queryToken;

  if (body && typeof body["token"] === "string" && body["token"]) {
    return body["token"];
  }

  return null;
}

async function parseJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const text = await request.text();
    if (!text) return {};
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function handleAdminApiRequest(request: Request): Promise<Response> {
  return runWithStartContext(
    {
      request,
      handlerType: "serverFn",
      executedRequestMiddlewares: new Set(),
      contextAfterGlobalMiddlewares: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getRouter: () => ({}) as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startOptions: {} as any,
    },
    () => internalHandleAdminApiRequest(request),
  );
}

async function internalHandleAdminApiRequest(request: Request): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);

  // 1. Handle CORS Preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, ""); // Normalize trailing slash
  const method = request.method.toUpperCase();

  try {
    // ── Public Auth Endpoints ──────────────────────────────────────────

    // POST /api/admin/auth/login
    if (pathname === "/api/admin/auth/login" && method === "POST") {
      const body = await parseJsonBody(request);
      const phone = typeof body["phone"] === "string" ? body["phone"] : undefined;
      const email = typeof body["email"] === "string" ? body["email"] : undefined;
      const password = typeof body["password"] === "string" ? body["password"] : "";

      if ((!phone && !email) || !password) {
        return jsonResponse(
          { success: false, error: "Identifier (phone or email) and password are required." },
          400,
          corsHeaders,
        );
      }

      const res = await loginFn({ data: { phone, email, password } });
      if (!res.success || !res.token || !res.user) {
        return jsonResponse(
          { success: false, error: res.error || "Invalid credentials." },
          401,
          corsHeaders,
        );
      }

      // Enforce admin privileges
      if (!res.user.isAdmin && res.user.role !== "ADMIN") {
        return jsonResponse(
          {
            success: false,
            error: "Access Denied: Account does not have administrator privileges.",
          },
          403,
          corsHeaders,
        );
      }

      return jsonResponse(
        {
          success: true,
          token: res.token,
          user: res.user,
        },
        200,
        corsHeaders,
      );
    }

    // ── Parse Body & Authenticate Protected Endpoints ──────────────────
    let body: Record<string, unknown> = {};
    if (method === "POST" || method === "PATCH") {
      body = await parseJsonBody(request);
    }

    const token = extractToken(request, body);
    if (!token) {
      return jsonResponse(
        { success: false, error: "Unauthorized: Authentication token required." },
        401,
        corsHeaders,
      );
    }

    // GET /api/admin/auth/session (Token validation)
    if (pathname === "/api/admin/auth/session" && method === "GET") {
      const res = await validateSessionFn({ data: { token } });
      if (!res.valid || !res.user) {
        return jsonResponse(
          { success: false, error: "Invalid or expired session token." },
          401,
          corsHeaders,
        );
      }
      if (!res.user.isAdmin && res.user.role !== "ADMIN") {
        return jsonResponse(
          { success: false, error: "Forbidden: Administrator privileges required." },
          403,
          corsHeaders,
        );
      }
      return jsonResponse({ success: true, valid: true, user: res.user }, 200, corsHeaders);
    }

    // POST /api/admin/auth/logout
    if (pathname === "/api/admin/auth/logout" && method === "POST") {
      await signOutFn({ data: { token } });
      return jsonResponse({ success: true, message: "Signed out successfully." }, 200, corsHeaders);
    }

    // Verify session & admin role server-side for all subsequent endpoints
    const session = getSessionUser(token);
    if (!session) {
      return jsonResponse(
        { success: false, error: "Unauthorized: Invalid or expired session." },
        401,
        corsHeaders,
      );
    }
    if (!session.isAdmin && session.role !== "ADMIN") {
      return jsonResponse(
        { success: false, error: "Forbidden: Administrator privileges required." },
        403,
        corsHeaders,
      );
    }

    // ── Protected Admin Read Endpoints ─────────────────────────────────

    // GET /api/admin/dashboard
    if (pathname === "/api/admin/dashboard" && method === "GET") {
      const res = await getAdminDashboardMetricsFn({ data: { token } });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // GET /api/admin/orders
    if (pathname === "/api/admin/orders" && method === "GET") {
      const res = await getAdminOrdersFn({ data: { token } });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // GET /api/admin/listings
    if (pathname === "/api/admin/listings" && method === "GET") {
      const res = await getAdminListingsFn({ data: { token } });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // GET /api/admin/moderation
    if (pathname === "/api/admin/moderation" && method === "GET") {
      const res = await getModerationQueueFn({ data: { token } });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // GET /api/admin/inspections
    if (pathname === "/api/admin/inspections" && method === "GET") {
      const res = await getAdminInspectionsFn({ data: { token } });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // GET /api/admin/disputes
    if (pathname === "/api/admin/disputes" && method === "GET") {
      const res = await getAdminDisputesFn({ data: { token } });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // GET /api/admin/users
    if (pathname === "/api/admin/users" && method === "GET") {
      const res = await getAdminUsersFn({ data: { token } });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // GET /api/admin/identity (Seller Verification)
    if (pathname === "/api/admin/identity" && method === "GET") {
      const res = await getAdminSellerVerificationFn({ data: { token } });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // GET /api/admin/payments
    if (pathname === "/api/admin/payments" && method === "GET") {
      const res = await getAdminPaymentSummaryFn({ data: { token } });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // GET /api/admin/analytics
    if (pathname === "/api/admin/analytics" && method === "GET") {
      const res = await getAdminAnalyticsFn({ data: { token } });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // GET /api/admin/geography
    if (pathname === "/api/admin/geography" && method === "GET") {
      const timeRange = (url.searchParams.get("timeRange") as GeoTimeRange) || "all";
      const res = await getAdminGeographicAnalyticsFn({ data: { token, timeRange } });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // ── Protected Admin Mutation Endpoints ─────────────────────────────

    // Match /api/admin/listings/:id/moderate
    const moderateMatch = pathname.match(/^\/api\/admin\/listings\/([^/]+)\/moderate$/);
    if (moderateMatch && method === "POST") {
      const listingId = moderateMatch[1]!;
      const action = body["action"] as "APPROVE" | "REJECT";
      const reasonCode = body["reasonCode"] as ListingRejectionReasonCode | undefined;
      const reasonText = typeof body["reasonText"] === "string" ? body["reasonText"] : undefined;

      if (!action || (action !== "APPROVE" && action !== "REJECT")) {
        return jsonResponse(
          { success: false, error: "Valid action ('APPROVE' or 'REJECT') is required." },
          400,
          corsHeaders,
        );
      }

      const res = await moderateListingFn({
        data: {
          token,
          listingId,
          action,
          ...(reasonCode ? { reasonCode } : {}),
          ...(reasonText ? { reasonText } : {}),
        },
      });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // Match /api/admin/listings/:id/availability
    const availabilityMatch = pathname.match(/^\/api\/admin\/listings\/([^/]+)\/availability$/);
    if (availabilityMatch && method === "POST") {
      const listingId = availabilityMatch[1]!;
      const action = body["action"] as "PAUSE" | "RESUME" | "DELIST";

      if (!action || !["PAUSE", "RESUME", "DELIST"].includes(action)) {
        return jsonResponse(
          { success: false, error: "Valid action ('PAUSE', 'RESUME', or 'DELIST') is required." },
          400,
          corsHeaders,
        );
      }

      const res = await updateListingAvailabilityFn({
        data: {
          token,
          listingId,
          action,
        },
      });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // Match PATCH /api/admin/listings/:id
    const listingPatchMatch = pathname.match(/^\/api\/admin\/listings\/([^/]+)$/);
    if (listingPatchMatch && method === "PATCH") {
      const listingId = listingPatchMatch[1]!;
      const price = typeof body["price"] === "number" ? body["price"] : undefined;
      const sellerNote = typeof body["sellerNote"] === "string" ? body["sellerNote"] : undefined;
      const accessories = typeof body["accessories"] === "string" ? body["accessories"] : undefined;

      const res = await updateListingDetailsFn({
        data: {
          token,
          listingId,
          ...(price !== undefined ? { price } : {}),
          ...(sellerNote !== undefined ? { sellerNote } : {}),
          ...(accessories !== undefined ? { accessories } : {}),
        },
      });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // Match POST /api/admin/identity/:sellerId/verify
    const identityVerifyMatch = pathname.match(/^\/api\/admin\/identity\/([^/]+)\/verify$/);
    if (identityVerifyMatch && method === "POST") {
      const sellerId = identityVerifyMatch[1]!;
      const action = body["action"] as "APPROVE" | "REJECT" | undefined;
      const note = typeof body["note"] === "string" ? body["note"] : undefined;

      if (!action || (action !== "APPROVE" && action !== "REJECT")) {
        return jsonResponse(
          { success: false, error: "Valid action ('APPROVE' or 'REJECT') is required." },
          400,
          corsHeaders,
        );
      }

      const res = await adminActOnSellerVerificationFn({
        data: { token, sellerId, action, ...(note ? { note } : {}) },
      });
      return jsonResponse(res, res.success ? 200 : 400, corsHeaders);
    }

    // 404 Route Not Found
    return jsonResponse(
      { success: false, error: `Endpoint '${method} ${pathname}' not found.` },
      404,
      corsHeaders,
    );
  } catch (error: unknown) {
    console.error("Admin API Error:", error);
    return jsonResponse(
      {
        success: false,
        error: (error as Error)?.message || "Internal server error in Admin API.",
      },
      500,
      corsHeaders,
    );
  }
}
