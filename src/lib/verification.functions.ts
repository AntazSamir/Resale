import { createServerFn } from "@tanstack/react-start";
import { getOrRestoreSession } from "./server-functions";

export const VERIFICATION_DOC_TYPES = [
  "NID_FRONT",
  "NID_BACK",
  "SELFIE_WITH_NID",
  "TRADE_LICENSE",
  "UTILITY_BILL",
] as const;

export type VerificationDocType = (typeof VERIFICATION_DOC_TYPES)[number];
export type VerificationStatus = "NOT_STARTED" | "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

export interface VerificationProfileInput {
  fullName: string;
  phone: string;
  email?: string | undefined;
  district: string;
  address: string;
  businessName?: string | undefined;
  nidLast4?: string | undefined;
}

export interface VerificationDocument {
  id: string;
  docType: VerificationDocType;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string | null;
  district: string;
  address: string;
  businessName: string | null;
  nidLast4: string | null;
  status: Exclude<VerificationStatus, "NOT_STARTED">;
  reviewNote: string | null;
  reviewerId: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  documents: VerificationDocument[];
}

const BUCKET = "verification-documents";
const MAX_FILE_BYTES = 6 * 1024 * 1024;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

// Fallback store used when the SQL in
// supabase/manual-sql/20260922_account_verification.sql has not been applied yet.
const memoryRequests = new Map<string, VerificationRequest>();
const memoryFiles = new Map<string, string>(); // documentId -> data url

async function admin() {
  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  return getSupabaseAdmin();
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function requireUser(token: string) {
  const session = getOrRestoreSession(token);
  if (!session) return null;
  return session;
}

function requireAdmin(token: string) {
  const session = getOrRestoreSession(token);
  if (!session || (!session.isAdmin && session.role !== "ADMIN")) return null;
  return session;
}

function rowToRequest(
  row: Record<string, unknown>,
  docs: Array<Record<string, unknown>>,
): VerificationRequest {
  return {
    id: String(row["id"]),
    userId: String(row["user_id"]),
    fullName: String(row["full_name"] ?? ""),
    phone: String(row["phone"] ?? ""),
    email: (row["email"] as string | null) ?? null,
    district: String(row["district"] ?? ""),
    address: String(row["address"] ?? ""),
    businessName: (row["business_name"] as string | null) ?? null,
    nidLast4: (row["nid_last4"] as string | null) ?? null,
    status: (row["status"] as VerificationRequest["status"]) ?? "DRAFT",
    reviewNote: (row["review_note"] as string | null) ?? null,
    reviewerId: (row["reviewer_id"] as string | null) ?? null,
    submittedAt: (row["submitted_at"] as string | null) ?? null,
    reviewedAt: (row["reviewed_at"] as string | null) ?? null,
    createdAt: String(row["created_at"] ?? new Date().toISOString()),
    updatedAt: String(row["updated_at"] ?? new Date().toISOString()),
    documents: docs.map((d) => ({
      id: String(d["id"]),
      docType: d["doc_type"] as VerificationDocType,
      fileName: String(d["file_name"] ?? ""),
      mimeType: String(d["mime_type"] ?? ""),
      sizeBytes: Number(d["size_bytes"] ?? 0),
      uploadedAt: String(d["uploaded_at"] ?? ""),
    })),
  };
}

async function loadRequest(userId: string): Promise<VerificationRequest | null> {
  try {
    const supabase = await admin();
    const { data: row, error } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    if (!row) return memoryRequests.get(userId) ?? null;
    const { data: docs } = await supabase
      .from("verification_documents")
      .select("*")
      .eq("request_id", row["id"])
      .order("uploaded_at", { ascending: true });
    return rowToRequest(row, docs ?? []);
  } catch {
    return memoryRequests.get(userId) ?? null;
  }
}

async function persistRequest(req: VerificationRequest): Promise<VerificationRequest> {
  memoryRequests.set(req.userId, req);
  try {
    const supabase = await admin();
    const { error } = await supabase.from("verification_requests").upsert(
      {
        id: req.id,
        user_id: req.userId,
        full_name: req.fullName,
        phone: req.phone,
        email: req.email,
        district: req.district,
        address: req.address,
        business_name: req.businessName,
        nid_last4: req.nidLast4,
        status: req.status,
        review_note: req.reviewNote,
        reviewer_id: req.reviewerId,
        submitted_at: req.submittedAt,
        reviewed_at: req.reviewedAt,
        created_at: req.createdAt,
        updated_at: req.updatedAt,
      },
      { onConflict: "user_id" },
    );
    if (error) throw error;
  } catch (err) {
    console.warn("[verification] persist fallback to memory:", err);
  }
  return req;
}

function emptyRequest(userId: string, session: ReturnType<typeof requireUser>): VerificationRequest {
  const now = new Date().toISOString();
  return {
    id: newId("ver"),
    userId,
    fullName: session?.name ?? "",
    phone: session?.phone ?? "",
    email: session?.email ?? null,
    district: "",
    address: "",
    businessName: null,
    nidLast4: null,
    status: "DRAFT",
    reviewNote: null,
    reviewerId: null,
    submittedAt: null,
    reviewedAt: null,
    createdAt: now,
    updatedAt: now,
    documents: [],
  };
}

// ── Buyer / seller: read own account + verification state ────────────────────
export const getMyVerificationFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const session = requireUser(data.token);
    if (!session) return { success: false as const, error: "Please sign in again." };

    let account: {
      id: string;
      name: string | null;
      phone: string | null;
      email: string | null;
      role: string;
      verified: boolean;
      createdAt: string | null;
    } = {
      id: session.userId,
      name: session.name ?? null,
      phone: session.phone ?? null,
      email: session.email ?? null,
      role: session.role,
      verified: false,
      createdAt: null,
    };

    try {
      const supabase = await admin();
      const { data: user } = await supabase
        .from("users")
        .select("id, name, phone, email, role, verified, created_at")
        .eq("id", session.userId)
        .maybeSingle();
      if (user) {
        account = {
          id: user["id"],
          name: user["name"] ?? null,
          phone: user["phone"] ?? null,
          email: user["email"] ?? null,
          role: user["role"] ?? "BUYER",
          verified: Boolean(user["verified"]),
          createdAt: user["created_at"] ?? null,
        };
      }
    } catch {
      // keep session-derived account
    }

    const request = await loadRequest(session.userId);
    return {
      success: true as const,
      account,
      request,
      status: (request?.status ?? "NOT_STARTED") as VerificationStatus,
    };
  });

// ── Save the account/verification details ────────────────────────────────────
export const saveVerificationProfileFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; profile: VerificationProfileInput }) => data)
  .handler(async ({ data }) => {
    const session = requireUser(data.token);
    if (!session) return { success: false as const, error: "Please sign in again." };

    const existing = (await loadRequest(session.userId)) ?? emptyRequest(session.userId, session);
    if (existing.status === "APPROVED") {
      return {
        success: false as const,
        error: "Your account is already verified. Contact support to change these details.",
      };
    }

    const p = data.profile;
    const nid = (p.nidLast4 ?? "").replace(/\D/g, "").slice(-4);
    const updated: VerificationRequest = {
      ...existing,
      fullName: p.fullName.trim(),
      phone: p.phone.trim(),
      email: p.email?.trim() || null,
      district: p.district.trim(),
      address: p.address.trim(),
      businessName: p.businessName?.trim() || null,
      nidLast4: nid || null,
      status: existing.status === "REJECTED" ? "DRAFT" : existing.status,
      updatedAt: new Date().toISOString(),
    };

    await persistRequest(updated);
    return { success: true as const, request: updated };
  });

// ── Upload an identity document ──────────────────────────────────────────────
export const uploadVerificationDocumentFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      docType: VerificationDocType;
      fileName: string;
      mimeType: string;
      dataBase64: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const session = requireUser(data.token);
    if (!session) return { success: false as const, error: "Please sign in again." };
    if (!VERIFICATION_DOC_TYPES.includes(data.docType)) {
      return { success: false as const, error: "Unsupported document type." };
    }
    if (!ALLOWED_MIME.includes(data.mimeType)) {
      return { success: false as const, error: "Upload a JPG, PNG, WebP image or a PDF." };
    }

    const buffer = Buffer.from(data.dataBase64, "base64");
    if (buffer.length === 0) return { success: false as const, error: "That file looks empty." };
    if (buffer.length > MAX_FILE_BYTES) {
      return { success: false as const, error: "Each file must be 6 MB or smaller." };
    }

    const existing = (await loadRequest(session.userId)) ?? emptyRequest(session.userId, session);
    if (existing.status === "APPROVED") {
      return { success: false as const, error: "Your account is already verified." };
    }

    const docId = newId("doc");
    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-60);
    const storagePath = `${session.userId}/${docId}-${safeName}`;

    let stored = false;
    try {
      const supabase = await admin();
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buffer, { contentType: data.mimeType, upsert: true });
      if (upErr) throw upErr;
      const { error: insErr } = await supabase.from("verification_documents").insert({
        id: docId,
        request_id: existing.id,
        user_id: session.userId,
        doc_type: data.docType,
        storage_path: storagePath,
        file_name: safeName,
        mime_type: data.mimeType,
        size_bytes: buffer.length,
        uploaded_at: new Date().toISOString(),
      });
      if (insErr) throw insErr;
      stored = true;
    } catch (err) {
      console.warn("[verification] document storage fallback:", err);
      memoryFiles.set(docId, `data:${data.mimeType};base64,${data.dataBase64}`);
    }

    const doc: VerificationDocument = {
      id: docId,
      docType: data.docType,
      fileName: safeName,
      mimeType: data.mimeType,
      sizeBytes: buffer.length,
      uploadedAt: new Date().toISOString(),
    };

    const updated: VerificationRequest = {
      ...existing,
      documents: [...existing.documents.filter((d) => d.docType !== data.docType), doc],
      status: existing.status === "REJECTED" ? "DRAFT" : existing.status,
      updatedAt: new Date().toISOString(),
    };
    await persistRequest(updated);

    return { success: true as const, request: updated, persisted: stored };
  });

// ── Submit for admin review ──────────────────────────────────────────────────
export const submitVerificationFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const session = requireUser(data.token);
    if (!session) return { success: false as const, error: "Please sign in again." };

    const existing = await loadRequest(session.userId);
    if (!existing) return { success: false as const, error: "Add your details first." };
    if (existing.status === "APPROVED")
      return { success: false as const, error: "Your account is already verified." };
    if (existing.status === "PENDING")
      return { success: false as const, error: "Your documents are already under review." };

    const missing: string[] = [];
    if (!existing.fullName) missing.push("full name");
    if (!existing.phone) missing.push("phone number");
    if (!existing.district) missing.push("district");
    if (!existing.address) missing.push("address");
    if (!existing.documents.some((d) => d.docType === "NID_FRONT")) missing.push("NID front photo");
    if (!existing.documents.some((d) => d.docType === "NID_BACK")) missing.push("NID back photo");
    if (!existing.documents.some((d) => d.docType === "SELFIE_WITH_NID"))
      missing.push("selfie holding your NID");

    if (missing.length > 0) {
      return { success: false as const, error: `Still needed: ${missing.join(", ")}.` };
    }

    const updated: VerificationRequest = {
      ...existing,
      status: "PENDING",
      reviewNote: null,
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      updatedAt: new Date().toISOString(),
    };
    await persistRequest(updated);
    return { success: true as const, request: updated };
  });

// ── Admin: review queue ──────────────────────────────────────────────────────
export const getVerificationQueueFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const session = requireAdmin(data.token);
    if (!session)
      return {
        success: false as const,
        error: "Unauthorized: Admin privileges required.",
        requests: [],
      };

    let requests: VerificationRequest[] = [];
    let dataSource = "IN_MEMORY_COMPATIBILITY";
    try {
      const supabase = await admin();
      const { data: rows, error } = await supabase
        .from("verification_requests")
        .select("*")
        .neq("status", "DRAFT")
        .order("submitted_at", { ascending: true });
      if (error) throw error;
      const ids = (rows ?? []).map((r) => r["id"]);
      const { data: docs } = ids.length
        ? await supabase.from("verification_documents").select("*").in("request_id", ids)
        : { data: [] as Array<Record<string, unknown>> };
      requests = (rows ?? []).map((r) =>
        rowToRequest(
          r,
          (docs ?? []).filter((d) => d["request_id"] === r["id"]),
        ),
      );
      dataSource = "SUPABASE_POSTGRESQL";
    } catch (err) {
      console.warn("[verification] queue fallback to memory:", err);
      requests = [...memoryRequests.values()].filter((r) => r.status !== "DRAFT");
    }

    return { success: true as const, requests, dataSource };
  });

// ── Admin: short-lived link to view one document ─────────────────────────────
export const getVerificationDocumentUrlFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; documentId: string }) => data)
  .handler(async ({ data }) => {
    const session = requireAdmin(data.token);
    if (!session)
      return { success: false as const, error: "Unauthorized: Admin privileges required." };

    try {
      const supabase = await admin();
      const { data: doc, error } = await supabase
        .from("verification_documents")
        .select("storage_path")
        .eq("id", data.documentId)
        .maybeSingle();
      if (error || !doc) throw error ?? new Error("not found");
      const { data: signed, error: signErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(doc["storage_path"], 120);
      if (signErr || !signed) throw signErr ?? new Error("sign failed");
      return { success: true as const, url: signed.signedUrl };
    } catch {
      const local = memoryFiles.get(data.documentId);
      if (local) return { success: true as const, url: local };
      return { success: false as const, error: "That document is no longer available." };
    }
  });

// ── Admin: approve or reject ─────────────────────────────────────────────────
export const reviewVerificationFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      userId: string;
      decision: "APPROVE" | "REJECT";
      note?: string | undefined;
    }) => data,
  )
  .handler(async ({ data }) => {
    const session = requireAdmin(data.token);
    if (!session)
      return { success: false as const, error: "Unauthorized: Admin privileges required." };
    if (data.decision === "REJECT" && !data.note?.trim()) {
      return { success: false as const, error: "Add a reason so the seller knows what to fix." };
    }

    const existing = await loadRequest(data.userId);
    if (!existing) return { success: false as const, error: "Request not found." };

    const approved = data.decision === "APPROVE";
    const now = new Date().toISOString();
    const updated: VerificationRequest = {
      ...existing,
      status: approved ? "APPROVED" : "REJECTED",
      reviewNote: data.note?.trim() || null,
      reviewerId: session.userId,
      reviewedAt: now,
      updatedAt: now,
    };
    await persistRequest(updated);

    try {
      const supabase = await admin();
      await supabase
        .from("users")
        .update(approved ? { verified: true, role: "SELLER" } : { verified: false })
        .eq("id", data.userId);
      await supabase
        .from("seller_reputation")
        .update({ nid_verified: approved })
        .eq("seller_id", data.userId);
    } catch (err) {
      console.warn("[verification] user flag update warning:", err);
    }

    return { success: true as const, request: updated };
  });
