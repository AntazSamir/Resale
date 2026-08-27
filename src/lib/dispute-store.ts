import {
  getOrders,
  getOrderById,
  saveOrder,
  createOrderTimelineEvent,
  type OrderRecord,
} from "./order-store";
import { products, productFor, taka } from "@/data/catalog";
import { upsertDisputeFn } from "./db-server";

export type DisputeStatus =
  | "OPEN" // Buyer filed, awaiting seller response
  | "SELLER_RESPONDED" // Seller provided counter-evidence/contest
  | "ADMIN_REVIEW" // In mediation queue for admin decision (or auto-escalated after 24h)
  | "RESOLVED_BUYER_REFUND" // Admin/Seller approved refund (simulated local resolution)
  | "RESOLVED_SELLER_PAYOUT" // Claim dismissed, seller payout released (simulated)
  | "RESOLVED_RETURN_ACCEPTED" // Return approved, awaiting reverse pickup (simulated)
  | "CANCELLED"; // Withdrawn by buyer

export type DisputeReason =
  | "CONDITION_MISMATCH"
  | "BATTERY_HEALTH_MISMATCH"
  | "IMEI_OR_ICLOUD_LOCK"
  | "UNDISCLOSED_REPAIR"
  | "DAMAGED_IN_TRANSIT"
  | "MISSING_ACCESSORIES"
  | "COUNTERFEIT_SUSPICION";

export type DefectCategory =
  | "PHYSICAL_BODY"
  | "DISPLAY_SCREEN"
  | "BATTERY_CHARGING"
  | "CAMERA_SENSORS"
  | "PORTS_CONNECTIVITY"
  | "AUTHENTICITY_PARTS"
  | "ACCESSORIES_BOX";

export interface EvidenceItem {
  id: string;
  type: "IMAGE" | "VIDEO" | "DOCUMENT";
  url: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  fileSizeBytes: number;
  uploadedAt: string;
  uploader: "BUYER" | "SELLER" | "ADMIN";
  isSimulated?: boolean;
}

export interface RiskAssessment {
  overallRiskScore: number; // 0–100 where higher score = HIGHER risk of dispute fraud/bad claim
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  evidenceConsistencyScore: number; // 0–100% confidence in claim validity
  trustSignals: string[]; // Positive factors that REDUCED risk score
  riskSignals: string[]; // Risk flags that INCREASED risk score
  recommendation: string; // Explanatory decision guidance
}

export interface DisputeAuditLogEntry {
  id: string;
  timestamp: string;
  actor: "BUYER" | "SELLER" | "ADMIN" | "SYSTEM";
  action: string;
  notes: string;
  metadata?: Record<string, unknown>;
}

export interface DisputeRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  maskedBuyerPhone: string; // e.g. 017****1234
  maskedBuyerNid: string; // e.g. ****-****-9201
  sellerId: string;
  sellerName: string;
  maskedSellerPhone: string; // e.g. 018****5678
  productId: string;
  productName: string;
  productImage: string;
  listingGrade: string;
  listingConditionScore: number;
  itemPrice: number;
  orderTotal: number;
  reason: DisputeReason;
  defectCategory: DefectCategory;
  specificInspectionCheck?: string | undefined;
  claimedDefectDescription: string;
  requestedResolution: "FULL_REFUND" | "REPLACEMENT" | "PARTIAL_CREDIT";
  buyerEvidence: EvidenceItem[];
  sellerResponse?:
    | {
        respondedAt: string;
        acceptedReturn: boolean;
        sellerNote: string;
        counterEvidence: EvidenceItem[];
      }
    | undefined;
  adminVerdict?:
    | {
        resolvedAt: string;
        resolvedBy: string;
        decision: "BUYER_REFUND" | "SELLER_PAYOUT" | "RETURN_AND_PICKUP";
        adminNotes: string;
        refundAmountBDT?: number | undefined;
        reverseTrackingNumber?: string | undefined; // Simulated stub e.g. #REV-71204
      }
    | undefined;
  status: DisputeStatus;
  createdAt: string;
  updatedAt: string;
  deliveredAt: string;
  buyerFilingDeadlineAt: string; // deliveredAt + 48 hours
  sellerResponseDeadlineAt: string; // createdAt + 24 hours
  sellerSlaExpired: boolean;
  riskAssessment: RiskAssessment;
  auditLog: DisputeAuditLogEntry[];
}

const DISPUTES_STORAGE_KEY = "resale.disputes.v1";

// 48-Hour Buyer Inspection Window in milliseconds
export const BUYER_INSPECTION_WINDOW_MS = 48 * 60 * 60 * 1000;
// 24-Hour Seller Counter-Response SLA in milliseconds
export const SELLER_RESPONSE_SLA_MS = 24 * 60 * 60 * 1000;

export const REASON_LABELS: Record<DisputeReason, string> = {
  CONDITION_MISMATCH: "Condition Grade Mismatch (Visible wear/dents)",
  BATTERY_HEALTH_MISMATCH: "Battery Health Mismatch (Lower % than reported)",
  IMEI_OR_ICLOUD_LOCK: "Activation / Carrier / iCloud Locked",
  UNDISCLOSED_REPAIR: "Undisclosed Third-Party Repair / Replaced Screen",
  DAMAGED_IN_TRANSIT: "Damaged During Delivery Courier Transit",
  MISSING_ACCESSORIES: "Missing Advertised Charger / Accessories",
  COUNTERFEIT_SUSPICION: "Suspected Non-OEM / Counterfeit Component",
};

export const DEFECT_CATEGORY_LABELS: Record<DefectCategory, string> = {
  PHYSICAL_BODY: "Chassis, Housing & Outer Glass",
  DISPLAY_SCREEN: "Display Panel, Touch & TrueTone",
  BATTERY_CHARGING: "Battery Health & Charging Port",
  CAMERA_SENSORS: "Main Camera, Front Camera & Face ID",
  PORTS_CONNECTIVITY: "Wi-Fi, Bluetooth, Cellular & Audio Jacks",
  AUTHENTICITY_PARTS: "OEM Component Authenticity & Prior Repairs",
  ACCESSORIES_BOX: "Original Box, Cables & Included Items",
};

/**
 * Deterministic, rule-based risk scoring model.
 * 0 = Lowest Risk, 100 = Highest Risk.
 * Trust factors decrease risk; risk flags increase risk.
 */
export function calculateRiskAssessment(params: {
  reason: DisputeReason;
  orderTotal: number;
  buyerFilingDelayHours: number;
  evidenceCount: number;
  hasVideoEvidence: boolean;
  buyerVerified: boolean;
  claimedBatteryHealthDiff?: number;
}): RiskAssessment {
  let baseRisk = 40; // Neutral baseline risk
  const trustSignals: string[] = [];
  const riskSignals: string[] = [];

  // Trust signals (decrease risk)
  if (params.buyerVerified) {
    baseRisk -= 15;
    trustSignals.push("NID Verified Buyer (-15 risk)");
  }

  if (params.buyerFilingDelayHours <= 4) {
    baseRisk -= 15;
    trustSignals.push("Immediate post-delivery inspection filing (<4h) (-15 risk)");
  } else if (params.buyerFilingDelayHours <= 24) {
    baseRisk -= 5;
    trustSignals.push("Prompt filing within standard first 24h (-5 risk)");
  }

  if (params.evidenceCount >= 3) {
    baseRisk -= 10;
    trustSignals.push(`Multi-angle photo evidence (${params.evidenceCount} files) (-10 risk)`);
  }

  if (params.hasVideoEvidence) {
    baseRisk -= 15;
    trustSignals.push("Video diagnostic demonstration provided (-15 risk)");
  }

  // Risk flags (increase risk)
  if (params.orderTotal >= 60000) {
    baseRisk += 20;
    riskSignals.push("High-value transaction threshold (>৳60,000) (+20 risk)");
  } else if (params.orderTotal >= 35000) {
    baseRisk += 10;
    riskSignals.push("Mid-to-high value transaction (>৳35,000) (+10 risk)");
  }

  if (params.buyerFilingDelayHours >= 44) {
    baseRisk += 15;
    riskSignals.push("Late dispute filing at edge of 48h window (+15 risk)");
  }

  if (params.evidenceCount <= 1 && !params.hasVideoEvidence) {
    baseRisk += 20;
    riskSignals.push("Minimal evidence attached (single image only) (+20 risk)");
  }

  if (params.reason === "COUNTERFEIT_SUSPICION") {
    baseRisk += 15;
    riskSignals.push("Counterfeit claim requires physical serial audit (+15 risk)");
  }

  const overallRiskScore = Math.max(5, Math.min(95, Math.round(baseRisk)));
  const riskLevel: "LOW" | "MEDIUM" | "HIGH" =
    overallRiskScore <= 35 ? "LOW" : overallRiskScore <= 65 ? "MEDIUM" : "HIGH";

  // Evidence consistency score (0–100%)
  let consistency = 50;
  if (params.evidenceCount >= 2) consistency += 25;
  if (params.hasVideoEvidence) consistency += 25;
  if (params.claimedBatteryHealthDiff && params.claimedBatteryHealthDiff >= 10) consistency += 15;
  if (params.evidenceCount <= 1) consistency -= 20;
  const evidenceConsistencyScore = Math.max(10, Math.min(98, consistency));

  let recommendation = "Review buyer evidence against 32-point inspection baseline.";
  if (riskLevel === "LOW" && evidenceConsistencyScore >= 75) {
    recommendation =
      "High consistency claim with low risk profile. Recommend simulated full refund or return authorization.";
  } else if (riskLevel === "HIGH") {
    recommendation =
      "Elevated claim risk or high-value item. Recommend requesting seller counter-evidence or manual serial review.";
  }

  return {
    overallRiskScore,
    riskLevel,
    evidenceConsistencyScore,
    trustSignals,
    riskSignals,
    recommendation,
  };
}

/**
 * Checks if an order is currently eligible for a dispute.
 * An order is eligible ONLY if:
 * 1. Status is "DELIVERED" or "COMPLETED"
 * 2. It has been delivered less than 48 hours ago
 * 3. It does not already have an open dispute
 */
export function isOrderEligibleForDispute(order: OrderRecord): {
  eligible: boolean;
  hoursRemaining: number;
  minutesRemaining: number;
  expired: boolean;
  reason?: string;
} {
  const existingDispute = getDisputeByOrderId(order.id);
  if (
    existingDispute &&
    !["CANCELLED", "RESOLVED_SELLER_PAYOUT"].includes(existingDispute.status)
  ) {
    return {
      eligible: false,
      hoursRemaining: 0,
      minutesRemaining: 0,
      expired: false,
      reason: `Order already has an active dispute (${existingDispute.id}).`,
    };
  }

  if (order.orderStatus !== "DELIVERED" && order.orderStatus !== "COMPLETED") {
    return {
      eligible: false,
      hoursRemaining: 0,
      minutesRemaining: 0,
      expired: false,
      reason: "Only delivered orders can be disputed within the 48-hour inspection window.",
    };
  }

  // Find delivery event in timeline, fallback to order createdAt
  const deliveryEvent = order.timeline.find((t) => t.type === "ORDER_DELIVERED");
  const deliveryTime = deliveryEvent
    ? new Date(deliveryEvent.timestamp).getTime()
    : new Date(order.createdAt).getTime();

  const now = Date.now();
  const elapsed = now - deliveryTime;
  const remaining = BUYER_INSPECTION_WINDOW_MS - elapsed;

  if (remaining <= 0) {
    return {
      eligible: false,
      hoursRemaining: 0,
      minutesRemaining: 0,
      expired: true,
      reason:
        "The 48-hour inspection guarantee window for this order has expired. Normal dispute filing is closed.",
    };
  }

  const hoursRemaining = Math.floor(remaining / (60 * 60 * 1000));
  const minutesRemaining = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  return {
    eligible: true,
    hoursRemaining,
    minutesRemaining,
    expired: false,
  };
}

/**
 * Checks the seller 24-hour response SLA status for a dispute
 */
export function getSellerSlaStatus(dispute: DisputeRecord): {
  expired: boolean;
  hoursRemaining: number;
  minutesRemaining: number;
  deadlineIso: string;
} {
  const deadline = new Date(dispute.sellerResponseDeadlineAt).getTime();
  const now = Date.now();
  const remaining = deadline - now;

  if (remaining <= 0) {
    return {
      expired: true,
      hoursRemaining: 0,
      minutesRemaining: 0,
      deadlineIso: dispute.sellerResponseDeadlineAt,
    };
  }

  const hoursRemaining = Math.floor(remaining / (60 * 60 * 1000));
  const minutesRemaining = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  return {
    expired: false,
    hoursRemaining,
    minutesRemaining,
    deadlineIso: dispute.sellerResponseDeadlineAt,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// SEED MOCK DATA
// ════════════════════════════════════════════════════════════════════════════
function generateSeedDisputes(): DisputeRecord[] {
  const now = new Date();

  // Dispute 1: Active dispute on ORD-71204 (Dell Monitor) - Open / Awaiting Seller Response
  const d1Created = new Date(now.getTime() - 6 * 60 * 60 * 1000); // 6 hours ago
  const d1Delivered = new Date(now.getTime() - 10 * 60 * 60 * 1000); // 10 hours ago
  const d1SellerDeadline = new Date(d1Created.getTime() + SELLER_RESPONSE_SLA_MS);
  const d1BuyerDeadline = new Date(d1Delivered.getTime() + BUYER_INSPECTION_WINDOW_MS);

  const risk1 = calculateRiskAssessment({
    reason: "CONDITION_MISMATCH",
    orderTotal: 28620,
    buyerFilingDelayHours: 4,
    evidenceCount: 2,
    hasVideoEvidence: false,
    buyerVerified: true,
  });

  const dispute1: DisputeRecord = {
    id: "DSP-71204",
    orderId: "ORD-71204",
    orderNumber: "ORD-71204",
    buyerId: "u-admin",
    buyerName: "Admin User",
    maskedBuyerPhone: "017****0000",
    maskedBuyerNid: "****-****-9201",
    sellerId: "u-1",
    sellerName: "Rafiq H.",
    maskedSellerPhone: "017****1111",
    productId: "p-dell-u2723qe",
    productName: "Dell UltraSharp U2723QE 27-inch 4K Monitor",
    productImage:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80",
    listingGrade: "A",
    listingConditionScore: 92,
    itemPrice: 28500,
    orderTotal: 28620,
    reason: "CONDITION_MISMATCH",
    defectCategory: "DISPLAY_SCREEN",
    specificInspectionCheck: "Screen Scratch & Panel Uniformity",
    claimedDefectDescription:
      "The monitor was listed as Grade A with flawless IPS panel, but upon delivery there is a prominent 2cm scratch across the center-right panel that is clearly visible on white backgrounds.",
    requestedResolution: "FULL_REFUND",
    buyerEvidence: [
      {
        id: "ev-1",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
        title: "Center panel scratch under direct light",
        description: "Close-up of scratch on active display showing pixel distortion",
        fileSizeBytes: 1420000,
        uploadedAt: d1Created.toISOString(),
        uploader: "BUYER",
        isSimulated: true,
      },
      {
        id: "ev-2",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
        title: "Full screen white background test",
        description: "Visible mark noticeable from normal 50cm viewing distance",
        fileSizeBytes: 1850000,
        uploadedAt: d1Created.toISOString(),
        uploader: "BUYER",
        isSimulated: true,
      },
    ],
    status: "OPEN",
    createdAt: d1Created.toISOString(),
    updatedAt: d1Created.toISOString(),
    deliveredAt: d1Delivered.toISOString(),
    buyerFilingDeadlineAt: d1BuyerDeadline.toISOString(),
    sellerResponseDeadlineAt: d1SellerDeadline.toISOString(),
    sellerSlaExpired: false,
    riskAssessment: risk1,
    auditLog: [
      {
        id: "log-1",
        timestamp: d1Created.toISOString(),
        actor: "BUYER",
        action: "DISPUTE_FILED",
        notes:
          "Buyer initiated dispute within 4 hours of delivery. Marketplace escrow hold placed on order ORD-71204 (simulated).",
      },
      {
        id: "log-2",
        timestamp: d1Created.toISOString(),
        actor: "SYSTEM",
        action: "SELLER_SLA_INITIALIZED",
        notes: "24-hour seller response window initiated. Deadline set to 24 hours from filing.",
      },
    ],
  };

  // Dispute 2: Resolved dispute on ORD-84392 (iPhone 13 Pro) - Resolved Buyer Refund (Demo)
  const d2Delivered = new Date(now.getTime() - 72 * 60 * 60 * 1000); // 3 days ago
  const d2Created = new Date(now.getTime() - 68 * 60 * 60 * 1000);
  const d2Resolved = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const risk2 = calculateRiskAssessment({
    reason: "BATTERY_HEALTH_MISMATCH",
    orderTotal: 68120,
    buyerFilingDelayHours: 4,
    evidenceCount: 2,
    hasVideoEvidence: true,
    buyerVerified: true,
    claimedBatteryHealthDiff: 13,
  });

  const dispute2: DisputeRecord = {
    id: "DSP-84392",
    orderId: "ORD-84392",
    orderNumber: "ORD-84392",
    buyerId: "u-admin",
    buyerName: "Admin User",
    maskedBuyerPhone: "017****0000",
    maskedBuyerNid: "****-****-9201",
    sellerId: "u-2",
    sellerName: "Nusrat T.",
    maskedSellerPhone: "017****2222",
    productId: "p-iphone-13-pro",
    productName: "Apple iPhone 13 Pro 128GB Sierra Blue",
    productImage:
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=400&q=80",
    listingGrade: "A+",
    listingConditionScore: 96,
    itemPrice: 68000,
    orderTotal: 68120,
    reason: "BATTERY_HEALTH_MISMATCH",
    defectCategory: "BATTERY_CHARGING",
    specificInspectionCheck: "Battery Maximum Capacity %",
    claimedDefectDescription:
      "Listing specified 94% original battery health with 0 service warnings. Actual iOS Settings > Battery Health reports 81% Maximum Capacity with a 'Service Recommended' notice.",
    requestedResolution: "FULL_REFUND",
    buyerEvidence: [
      {
        id: "ev-3",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
        title: "iOS Battery Health settings screenshot",
        description: "Clear screenshot displaying 81% Maximum Capacity",
        fileSizeBytes: 890000,
        uploadedAt: d2Created.toISOString(),
        uploader: "BUYER",
        isSimulated: true,
      },
    ],
    sellerResponse: {
      respondedAt: new Date(d2Created.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      acceptedReturn: true,
      sellerNote:
        "My apologies, I confused the battery report with another 13 Pro unit in my stock. I accept the return and authorize full refund.",
      counterEvidence: [],
    },
    adminVerdict: {
      resolvedAt: d2Resolved.toISOString(),
      resolvedBy: "SuperAdmin (Moderation Desk)",
      decision: "BUYER_REFUND",
      adminNotes:
        "Seller conceded battery percentage mismatch. Approved 100% full refund to buyer. Reverse pickup code generated (simulated).",
      refundAmountBDT: 68120,
      reverseTrackingNumber: "REV-84392",
    },
    status: "RESOLVED_BUYER_REFUND",
    createdAt: d2Created.toISOString(),
    updatedAt: d2Resolved.toISOString(),
    deliveredAt: d2Delivered.toISOString(),
    buyerFilingDeadlineAt: new Date(
      d2Delivered.getTime() + BUYER_INSPECTION_WINDOW_MS,
    ).toISOString(),
    sellerResponseDeadlineAt: new Date(d2Created.getTime() + SELLER_RESPONSE_SLA_MS).toISOString(),
    sellerSlaExpired: false,
    riskAssessment: risk2,
    auditLog: [
      {
        id: "log-3",
        timestamp: d2Created.toISOString(),
        actor: "BUYER",
        action: "DISPUTE_FILED",
        notes: "Buyer reported 13% battery capacity discrepancy with diagnostic screenshot.",
      },
      {
        id: "log-4",
        timestamp: new Date(d2Created.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        actor: "SELLER",
        action: "SELLER_CONCEDED_RETURN",
        notes: "Seller accepted return without contesting. Authorized refund initiation.",
      },
      {
        id: "log-5",
        timestamp: d2Resolved.toISOString(),
        actor: "ADMIN",
        action: "RESOLVED_FULL_REFUND",
        notes:
          "Admin closed dispute with verdict: BUYER_REFUND (৳68,120). Reverse tracking code #REV-84392 assigned (simulated).",
      },
    ],
  };

  return [dispute1, dispute2];
}

// ════════════════════════════════════════════════════════════════════════════
// DISPUTE STORE IMPLEMENTATION
// ════════════════════════════════════════════════════════════════════════════

export function getDisputes(): DisputeRecord[] {
  if (typeof window === "undefined") {
    return generateSeedDisputes();
  }

  try {
    const raw = localStorage.getItem(DISPUTES_STORAGE_KEY);
    if (!raw) {
      const initial = generateSeedDisputes();
      localStorage.setItem(DISPUTES_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as DisputeRecord[];

    // Check for any expired seller SLAs on read and escalate
    let mutated = false;
    const updated = parsed.map((d) => {
      if (d.status === "OPEN") {
        const sla = getSellerSlaStatus(d);
        if (sla.expired && !d.sellerSlaExpired) {
          mutated = true;
          return {
            ...d,
            status: "ADMIN_REVIEW" as DisputeStatus,
            sellerSlaExpired: true,
            updatedAt: new Date().toISOString(),
            auditLog: [
              ...d.auditLog,
              {
                id: `log-sla-${Date.now()}`,
                timestamp: new Date().toISOString(),
                actor: "SYSTEM" as const,
                action: "SELLER_SLA_EXPIRED",
                notes:
                  "Seller 24-hour response SLA expired without counter-evidence. Auto-escalated to Admin Mediation Desk.",
              },
            ],
          };
        }
      }
      return d;
    });

    if (mutated) {
      localStorage.setItem(DISPUTES_STORAGE_KEY, JSON.stringify(updated));
    }

    return updated;
  } catch {
    return generateSeedDisputes();
  }
}

export function saveDisputes(disputes: DisputeRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DISPUTES_STORAGE_KEY, JSON.stringify(disputes));
  } catch (err) {
    console.warn("Dispute localStorage write failed or quota exceeded:", err);
  }

  // Background Supabase sync — silently ignored when table is absent
  disputes.slice(0, 1).forEach((d) => {
    const payload: Record<string, unknown> = {
      id: d.id,
      order_id: d.orderId,
      buyer_id: d.buyerId,
      seller_id: d.sellerId,
      status: d.status,
      reason: d.reason,
      created_at: d.createdAt,
      updated_at: d.updatedAt,
      meta: JSON.stringify(d),
    };
    upsertDisputeFn({ data: payload }).catch(() => {});
  });
}

export function getDisputeById(id: string): DisputeRecord | undefined {
  const all = getDisputes();
  return all.find((d) => d.id === id);
}

export function getDisputeByOrderId(orderId: string): DisputeRecord | undefined {
  const all = getDisputes();
  return all.find((d) => d.orderId === orderId);
}

export function getDisputesForBuyer(buyerId: string): DisputeRecord[] {
  const all = getDisputes();
  return all.filter((d) => d.buyerId === buyerId);
}

export function getDisputesForSeller(sellerId: string): DisputeRecord[] {
  const all = getDisputes();
  return all.filter((d) => d.sellerId === sellerId);
}

/**
 * Creates a new dispute on a delivered order.
 * - Enforces the strict 48-hour inspection guarantee window
 * - Places a simulated escrow hold on the order in order-store
 * - Calculates deterministic heuristic risk score
 */
export function createDispute(params: {
  orderId: string;
  reason: DisputeReason;
  defectCategory: DefectCategory;
  specificInspectionCheck?: string | undefined;
  claimedDefectDescription: string;
  requestedResolution: "FULL_REFUND" | "REPLACEMENT" | "PARTIAL_CREDIT";
  evidence: EvidenceItem[];
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerNid?: string | undefined;
}): { success: boolean; disputeId?: string | undefined; error?: string | undefined } {
  const order = getOrderById(params.orderId);
  if (!order) {
    return { success: false, error: "Order not found in records." };
  }

  // Validate 48-hour inspection window
  const eligibility = isOrderEligibleForDispute(order);
  if (!eligibility.eligible) {
    return { success: false, error: eligibility.reason || "Order is not eligible for dispute." };
  }

  const now = new Date();
  const disputeId = `DSP-${order.id.replace("ORD-", "")}`;

  // Find delivery event timestamp
  const deliveryEvent = order.timeline.find((t) => t.type === "ORDER_DELIVERED");
  const deliveryTime = deliveryEvent
    ? new Date(deliveryEvent.timestamp)
    : new Date(order.createdAt);
  const filingDelayHours = Math.max(
    0,
    Math.round((now.getTime() - deliveryTime.getTime()) / (60 * 60 * 1000)),
  );

  const product = order.items[0];

  // Mask sensitive PII
  const maskedBuyerPhone = params.buyerPhone
    ? `${params.buyerPhone.slice(0, 3)}****${params.buyerPhone.slice(-4)}`
    : "017****0000";
  const maskedBuyerNid = params.buyerNid
    ? `****-****-${params.buyerNid.slice(-4)}`
    : "****-****-0000";
  const maskedSellerPhone = "017****1111";

  // Calculate deterministic risk assessment
  const riskAssessment = calculateRiskAssessment({
    reason: params.reason,
    orderTotal: order.total,
    buyerFilingDelayHours: filingDelayHours,
    evidenceCount: params.evidence.length,
    hasVideoEvidence: params.evidence.some((e) => e.type === "VIDEO"),
    buyerVerified: Boolean(params.buyerNid),
  });

  const sellerResponseDeadline = new Date(now.getTime() + SELLER_RESPONSE_SLA_MS);
  const buyerFilingDeadline = new Date(deliveryTime.getTime() + BUYER_INSPECTION_WINDOW_MS);

  const newDispute: DisputeRecord = {
    id: disputeId,
    orderId: order.id,
    orderNumber: order.id,
    buyerId: params.buyerId,
    buyerName: params.buyerName,
    maskedBuyerPhone,
    maskedBuyerNid,
    sellerId: product?.sellerId || "u-1",
    sellerName: product?.sellerName || "Verified Seller",
    maskedSellerPhone,
    productId: product?.productId || "p-unknown",
    productName: product?.name || "Pre-Owned Device",
    productImage: product?.image || "",
    listingGrade: product?.grade || "A",
    listingConditionScore: product?.conditionScore || 90,
    itemPrice: product?.price || order.total,
    orderTotal: order.total,
    reason: params.reason,
    defectCategory: params.defectCategory,
    specificInspectionCheck: params.specificInspectionCheck,
    claimedDefectDescription: params.claimedDefectDescription,
    requestedResolution: params.requestedResolution,
    buyerEvidence: params.evidence,
    status: "OPEN",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    deliveredAt: deliveryTime.toISOString(),
    buyerFilingDeadlineAt: buyerFilingDeadline.toISOString(),
    sellerResponseDeadlineAt: sellerResponseDeadline.toISOString(),
    sellerSlaExpired: false,
    riskAssessment,
    auditLog: [
      {
        id: `log-${Date.now()}-1`,
        timestamp: now.toISOString(),
        actor: "BUYER",
        action: "DISPUTE_FILED",
        notes: `Dispute filed under reason "${REASON_LABELS[params.reason]}". Escrow hold placed on order payout (simulated).`,
      },
      {
        id: `log-${Date.now()}-2`,
        timestamp: now.toISOString(),
        actor: "SYSTEM",
        action: "SELLER_SLA_INITIALIZED",
        notes: `24-hour response SLA countdown started for seller. Response deadline: ${sellerResponseDeadline.toLocaleTimeString()}`,
      },
    ],
  };

  // 1. Save to disputes storage
  const allDisputes = getDisputes().filter((d) => d.id !== disputeId);
  allDisputes.unshift(newDispute);
  saveDisputes(allDisputes);

  // 2. Synchronize with order-store
  const updatedOrder: OrderRecord = {
    ...order,
    orderStatus: "DISPUTED",
    status: "DISPUTED",
    timeline: [
      ...order.timeline,
      createOrderTimelineEvent(
        "REFUND_REQUESTED",
        "Dispute Filed by Buyer",
        `Buyer reported condition issue: "${params.claimedDefectDescription.slice(0, 100)}...". Order payment placed on escrow hold (simulated).`,
        "BUYER",
        { disputeId },
      ),
    ],
    updatedAt: now.toISOString(),
  };
  saveOrder(updatedOrder);

  return { success: true, disputeId };
}

/**
 * Submits seller response or counter-evidence
 */
export function submitSellerResponse(
  disputeId: string,
  params: {
    acceptedReturn: boolean;
    sellerNote: string;
    counterEvidence: EvidenceItem[];
  },
): { success: boolean; error?: string } {
  const dispute = getDisputeById(disputeId);
  if (!dispute) return { success: false, error: "Dispute not found." };

  const now = new Date();
  const isConceded = params.acceptedReturn;

  const updated: DisputeRecord = {
    ...dispute,
    status: isConceded ? "RESOLVED_RETURN_ACCEPTED" : "SELLER_RESPONDED",
    sellerResponse: {
      respondedAt: now.toISOString(),
      acceptedReturn: params.acceptedReturn,
      sellerNote: params.sellerNote,
      counterEvidence: params.counterEvidence,
    },
    updatedAt: now.toISOString(),
    auditLog: [
      ...dispute.auditLog,
      {
        id: `log-${Date.now()}`,
        timestamp: now.toISOString(),
        actor: "SELLER",
        action: isConceded ? "SELLER_ACCEPTED_RETURN" : "SELLER_SUBMITTED_COUNTER_EVIDENCE",
        notes: isConceded
          ? "Seller agreed to return & authorized simulated refund resolution."
          : `Seller contested claim with ${params.counterEvidence.length} counter-evidence files. Note: "${params.sellerNote.slice(0, 100)}"`,
      },
    ],
  };

  const all = getDisputes().map((d) => (d.id === disputeId ? updated : d));
  saveDisputes(all);

  // If seller conceded return, update order store
  if (isConceded) {
    const order = getOrderById(dispute.orderId);
    if (order) {
      saveOrder({
        ...order,
        orderStatus: "REFUND_REQUESTED",
        status: "REFUND_REQUESTED",
        timeline: [
          ...order.timeline,
          createOrderTimelineEvent(
            "REFUND_REQUESTED",
            "Seller Authorized Return & Refund",
            "Seller accepted return request without contest. Awaiting reverse pickup (simulated).",
            "SELLER",
            { disputeId },
          ),
        ],
        updatedAt: now.toISOString(),
      });
    }
  }

  return { success: true };
}

/**
 * Resolves a dispute by an admin
 */
export function resolveDisputeByAdmin(
  disputeId: string,
  params: {
    decision: "BUYER_REFUND" | "SELLER_PAYOUT" | "RETURN_AND_PICKUP";
    adminNotes: string;
    adminName?: string;
  },
): { success: boolean; error?: string } {
  const dispute = getDisputeById(disputeId);
  if (!dispute) return { success: false, error: "Dispute not found." };

  const now = new Date();
  const adminName = params.adminName || "Resale Mediation Admin";

  let nextStatus: DisputeStatus = "RESOLVED_BUYER_REFUND";
  let actionName = "RESOLVED_BUYER_REFUND";
  let reverseTrackingNumber: string | undefined = undefined;

  if (params.decision === "SELLER_PAYOUT") {
    nextStatus = "RESOLVED_SELLER_PAYOUT";
    actionName = "RESOLVED_SELLER_PAYOUT";
  } else if (params.decision === "RETURN_AND_PICKUP") {
    nextStatus = "RESOLVED_RETURN_ACCEPTED";
    actionName = "RESOLVED_RETURN_ACCEPTED";
    reverseTrackingNumber = `REV-${dispute.orderNumber.replace("ORD-", "")}`;
  } else {
    nextStatus = "RESOLVED_BUYER_REFUND";
    actionName = "RESOLVED_BUYER_REFUND";
  }

  const updated: DisputeRecord = {
    ...dispute,
    status: nextStatus,
    adminVerdict: {
      resolvedAt: now.toISOString(),
      resolvedBy: adminName,
      decision: params.decision,
      adminNotes: params.adminNotes,
      refundAmountBDT: params.decision === "BUYER_REFUND" ? dispute.orderTotal : undefined,
      reverseTrackingNumber,
    },
    updatedAt: now.toISOString(),
    auditLog: [
      ...dispute.auditLog,
      {
        id: `log-${Date.now()}`,
        timestamp: now.toISOString(),
        actor: "ADMIN",
        action: actionName,
        notes: `Admin verdict: ${params.decision}. Notes: "${params.adminNotes}". (Local resolution simulated)`,
      },
    ],
  };

  const all = getDisputes().map((d) => (d.id === disputeId ? updated : d));
  saveDisputes(all);

  // Synchronize order store
  const order = getOrderById(dispute.orderId);
  if (order) {
    let orderNextStatus: OrderRecord["orderStatus"] = "REFUNDED";
    let timelineTitle = "Dispute Resolved: Full Refund (Simulated)";

    if (params.decision === "SELLER_PAYOUT") {
      orderNextStatus = "COMPLETED";
      timelineTitle = "Dispute Resolved: Seller Payout Released";
    } else if (params.decision === "RETURN_AND_PICKUP") {
      orderNextStatus = "REFUND_REQUESTED";
      timelineTitle = `Dispute Resolved: Reverse Pickup #${reverseTrackingNumber} Generated`;
    }

    saveOrder({
      ...order,
      orderStatus: orderNextStatus,
      status: orderNextStatus,
      paymentStatus: params.decision === "BUYER_REFUND" ? "REFUNDED" : order.paymentStatus,
      timeline: [
        ...order.timeline,
        createOrderTimelineEvent(
          params.decision === "BUYER_REFUND" ? "REFUNDED" : "ORDER_COMPLETED",
          timelineTitle,
          `Mediation conclusion: ${params.adminNotes} (Simulated resolution)`,
          "ADMIN",
          { disputeId, decision: params.decision },
        ),
      ],
      updatedAt: now.toISOString(),
    });
  }

  return { success: true };
}
