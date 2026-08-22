import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminSidebar } from "./admin.index";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  XCircle,
  Search,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  UserCheck,
  Maximize2,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { taka, inspectionFramework } from "@/data/catalog";
import { ProtectedRoute } from "@/components/protected-route";
import {
  getDisputes,
  resolveDisputeByAdmin,
  getSellerSlaStatus,
  REASON_LABELS,
  DEFECT_CATEGORY_LABELS,
  type DisputeRecord,
  type DisputeStatus,
} from "@/lib/dispute-store";

export const Route = createFileRoute("/admin/disputes")({
  head: () => ({
    meta: [{ title: "Dispute Mediation Workbench | Admin Console" }],
  }),
  component: AdminDisputesPage,
});

function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  // Resolution Form State
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [verdictSuccess, setVerdictSuccess] = useState<string>("");
  const [verdictError, setVerdictError] = useState<string>("");

  useEffect(() => {
    const list = getDisputes();
    setDisputes(list);
    setSelectedDisputeId((prev) => prev || (list.length > 0 ? (list[0]?.id ?? null) : null));
  }, []);

  const selectedDispute = disputes.find((d) => d.id === selectedDisputeId);

  const filteredDisputes = disputes.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.productName.toLowerCase().includes(search.toLowerCase()) ||
      d.buyerName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "ACTIVE") {
      return ["OPEN", "SELLER_RESPONDED", "ADMIN_REVIEW"].includes(d.status);
    }
    if (statusFilter === "URGENT") {
      const sla = getSellerSlaStatus(d);
      return d.status === "OPEN" && (sla.expired || sla.hoursRemaining <= 6);
    }
    if (statusFilter === "RESOLVED") {
      return d.status.startsWith("RESOLVED");
    }
    return true;
  });

  const handleResolve = (decision: "BUYER_REFUND" | "SELLER_PAYOUT" | "RETURN_AND_PICKUP") => {
    if (!selectedDispute) return;
    setVerdictError("");
    setVerdictSuccess("");

    if (!adminNotes.trim() || adminNotes.length < 10) {
      setVerdictError("Please provide an internal rationale for the audit record (min 10 chars).");
      return;
    }

    const res = resolveDisputeByAdmin(selectedDispute.id, {
      decision,
      adminNotes,
      adminName: "Senior Mediation Officer",
    });

    if (!res.success) {
      setVerdictError(res.error || "Failed to execute verdict.");
      return;
    }

    setVerdictSuccess(`Dispute verdict executed: ${decision.replace(/_/g, " ")} (Simulated).`);
    setAdminNotes("");
    // Refresh disputes
    const updated = getDisputes();
    setDisputes(updated);
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />

        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 w-full flex gap-8 lg:gap-10">
          <AdminSidebar active="disputes" />

          <div className="flex-1 space-y-6 min-w-0">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                <ShieldAlert className="size-3.5" />
                <span>Phase 3.6 Mediation Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Dispute Mediation Workbench
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Audit condition claims against 32-point inspection baselines, evaluate risk scores,
                and issue binding simulated verdicts.
              </p>
            </div>

            {/* Filter & Metric Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 bg-card border border-border">
              <div className="relative w-full sm:w-72">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search Dispute #, Order # or Buyer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs bg-background"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1.5 text-xs font-semibold border ${
                    statusFilter === "ALL"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-subtle-foreground border-border hover:bg-muted"
                  }`}
                >
                  All ({disputes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("ACTIVE")}
                  className={`px-3 py-1.5 text-xs font-semibold border ${
                    statusFilter === "ACTIVE"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-subtle-foreground border-border hover:bg-muted"
                  }`}
                >
                  Active Claims (
                  {
                    disputes.filter((d) =>
                      ["OPEN", "SELLER_RESPONDED", "ADMIN_REVIEW"].includes(d.status),
                    ).length
                  }
                  )
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("URGENT")}
                  className={`px-3 py-1.5 text-xs font-semibold border ${
                    statusFilter === "URGENT"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                  }`}
                >
                  Urgent / Expired SLA
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("RESOLVED")}
                  className={`px-3 py-1.5 text-xs font-semibold border ${
                    statusFilter === "RESOLVED"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-subtle-foreground border-border hover:bg-muted"
                  }`}
                >
                  Resolved ({disputes.filter((d) => d.status.startsWith("RESOLVED")).length})
                </button>
              </div>
            </div>

            {/* Split Screen Workbench */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Queue List (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                  Mediation Queue ({filteredDisputes.length})
                </div>

                <div className="space-y-2 max-h-187.5 overflow-y-auto pr-1">
                  {filteredDisputes.length === 0 ? (
                    <div className="p-6 border border-dashed border-border text-center text-xs text-muted-foreground bg-card">
                      No disputes matching this filter.
                    </div>
                  ) : (
                    filteredDisputes.map((d) => {
                      const isSelected = d.id === selectedDisputeId;
                      const sla = getSellerSlaStatus(d);
                      const isUrgent =
                        d.status === "OPEN" && (sla.expired || sla.hoursRemaining <= 6);

                      return (
                        <div
                          key={d.id}
                          onClick={() => setSelectedDisputeId(d.id)}
                          className={`p-3.5 border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-primary/5 border-primary shadow-xs"
                              : "bg-card border-border hover:border-foreground/30"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-display font-bold text-xs text-foreground">
                              #{d.id}
                            </span>
                            <Badge
                              variant={
                                d.status.startsWith("RESOLVED")
                                  ? "default"
                                  : isUrgent
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="text-[10px]"
                            >
                              {d.status.replace(/_/g, " ")}
                            </Badge>
                          </div>

                          <div className="text-xs font-semibold text-foreground truncate">
                            {d.productName}
                          </div>

                          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            Claim: {REASON_LABELS[d.reason]}
                          </div>

                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/60 text-[11px]">
                            <span className="font-bold text-primary">{taka(d.orderTotal)}</span>
                            {d.status === "OPEN" && (
                              <span
                                className={`font-semibold ${
                                  sla.expired ? "text-destructive" : "text-amber-600"
                                }`}
                              >
                                {sla.expired ? "SLA Expired" : `${sla.hoursRemaining}h SLA Left`}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Deep Inspection Panel (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {selectedDispute ? (
                  <div className="space-y-6">
                    {/* Header Card */}
                    <Card className="border-border">
                      <CardHeader className="bg-muted/40 p-4 sm:p-5 border-b border-border">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-lg text-foreground">
                                Case #{selectedDispute.id}
                              </span>
                              <Badge className="text-xs">
                                {selectedDispute.status.replace(/_/g, " ")}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Order #{selectedDispute.orderNumber} &middot; Filed:{" "}
                              {new Date(selectedDispute.createdAt).toLocaleString()}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-display font-bold text-primary">
                              {taka(selectedDispute.orderTotal)}
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              Requested: {selectedDispute.requestedResolution.replace(/_/g, " ")}
                            </span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 sm:p-6 space-y-6">
                        {/* Part 1: Side-by-Side Comparison Matrix */}
                        <div>
                          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                            Side-by-Side Comparison Matrix
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Baseline Column */}
                            <div className="p-4 bg-muted/20 border border-border space-y-3">
                              <div className="flex items-center gap-2 font-bold text-xs text-foreground pb-2 border-b border-border">
                                <FileCheck2 className="size-4 text-emerald-600" />
                                <span>1. Original Listing Baseline</span>
                              </div>

                              <div className="flex items-center gap-2.5">
                                <img
                                  src={selectedDispute.productImage}
                                  alt={selectedDispute.productName}
                                  className="size-12 object-cover border border-border"
                                />
                                <div>
                                  <div className="font-bold text-xs text-foreground">
                                    {selectedDispute.productName}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">
                                    Advertised Grade:{" "}
                                    <strong>{selectedDispute.listingGrade}</strong> (
                                    {selectedDispute.listingConditionScore}/100)
                                  </div>
                                </div>
                              </div>

                              <div className="text-xs text-subtle-foreground space-y-1 pt-1">
                                <div>
                                  Seller:{" "}
                                  <span className="font-semibold text-foreground">
                                    {selectedDispute.sellerName}
                                  </span>{" "}
                                  (Phone: {selectedDispute.maskedSellerPhone})
                                </div>
                                <div>
                                  Component Checked:{" "}
                                  <span className="font-medium text-foreground">
                                    {selectedDispute.specificInspectionCheck ||
                                      DEFECT_CATEGORY_LABELS[selectedDispute.defectCategory]}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Buyer Claim Column */}
                            <div className="p-4 bg-amber-500/5 border border-amber-500/20 space-y-3">
                              <div className="flex items-center gap-2 font-bold text-xs text-amber-800 dark:text-amber-300 pb-2 border-b border-amber-500/20">
                                <AlertTriangle className="size-4 text-amber-600" />
                                <span>2. Claimed Defect &amp; Evidence</span>
                              </div>

                              <div className="text-xs text-foreground leading-relaxed">
                                <span className="font-semibold text-muted-foreground block text-[10px] uppercase">
                                  Claim Category:
                                </span>
                                <span>{REASON_LABELS[selectedDispute.reason]}</span>
                              </div>

                              <div className="text-xs bg-background p-2.5 border border-border">
                                <p className="text-foreground italic leading-relaxed">
                                  &ldquo;{selectedDispute.claimedDefectDescription}&rdquo;
                                </p>
                              </div>

                              <div className="text-xs text-subtle-foreground space-y-0.5">
                                <div>
                                  Buyer:{" "}
                                  <span className="font-semibold text-foreground">
                                    {selectedDispute.buyerName}
                                  </span>{" "}
                                  (NID: {selectedDispute.maskedBuyerNid})
                                </div>
                                <div>Phone: {selectedDispute.maskedBuyerPhone}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Part 2: Evidence Photo & Video Gallery */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Attached Evidence Gallery ({selectedDispute.buyerEvidence.length} files)
                          </h3>

                          {selectedDispute.buyerEvidence.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No evidence attached.</p>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {selectedDispute.buyerEvidence.map((ev) => (
                                <div
                                  key={ev.id}
                                  className="border border-border bg-card p-2 space-y-1.5"
                                >
                                  <div className="aspect-video w-full bg-muted overflow-hidden relative">
                                    <img
                                      src={ev.url}
                                      alt={ev.title}
                                      className="size-full object-cover hover:scale-105 transition-transform"
                                    />
                                    {ev.isSimulated && (
                                      <span className="absolute bottom-1 left-1 bg-background/90 text-[9px] font-bold px-1 text-muted-foreground">
                                        Local Demo
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs font-medium text-foreground truncate">
                                    {ev.title}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground truncate">
                                    {ev.description}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Part 3: Seller Response Section if present */}
                        {selectedDispute.sellerResponse && (
                          <div className="p-4 bg-secondary/50 border border-border space-y-2 text-xs">
                            <div className="flex items-center justify-between font-bold text-foreground">
                              <span>Seller Counter-Statement &amp; Proof</span>
                              <span className="text-[11px] text-muted-foreground font-normal">
                                Responded:{" "}
                                {new Date(
                                  selectedDispute.sellerResponse.respondedAt,
                                ).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-subtle-foreground leading-relaxed">
                              {selectedDispute.sellerResponse.sellerNote}
                            </p>
                            {selectedDispute.sellerResponse.counterEvidence.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                {selectedDispute.sellerResponse.counterEvidence.map((ev) => (
                                  <img
                                    key={ev.id}
                                    src={ev.url}
                                    alt={ev.title}
                                    className="size-14 object-cover border border-border"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Part 4: Deterministic Rule-Based Risk Engine Card */}
                        <div className="p-4 bg-card border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                              <Sparkles className="size-4 text-primary" />
                              <span>Deterministic Risk &amp; Consistency Assessment</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5">
                              Rule-Based Engine (Simulated Heuristics)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            {/* Metric 1: Overall Risk Score (Higher = Higher Risk) */}
                            <div className="p-3 bg-muted/40 border border-border space-y-1">
                              <div className="text-[11px] text-muted-foreground font-medium">
                                Dispute Risk Score (0–100)
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span
                                  className={`text-2xl font-display font-bold ${
                                    selectedDispute.riskAssessment.overallRiskScore <= 35
                                      ? "text-emerald-600"
                                      : selectedDispute.riskAssessment.overallRiskScore <= 65
                                        ? "text-amber-600"
                                        : "text-destructive"
                                  }`}
                                >
                                  {selectedDispute.riskAssessment.overallRiskScore}
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground">
                                  / 100 ({selectedDispute.riskAssessment.riskLevel} RISK)
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground block">
                                Lower is safer. Measures probability of fraudulent or invalid claim.
                              </span>
                            </div>

                            {/* Metric 2: Evidence Consistency */}
                            <div className="p-3 bg-muted/40 border border-border space-y-1">
                              <div className="text-[11px] text-muted-foreground font-medium">
                                Evidence Consistency Match
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-display font-bold text-primary">
                                  {selectedDispute.riskAssessment.evidenceConsistencyScore}%
                                </span>
                                <span className="text-xs text-muted-foreground font-semibold">
                                  Confidence
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground block">
                                Evaluates multi-angle photo &amp; diagnostic data alignment.
                              </span>
                            </div>
                          </div>

                          {/* Signals Breakdown */}
                          <div className="space-y-1.5 pt-1 text-xs">
                            {selectedDispute.riskAssessment.trustSignals.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                                  Trust Factors:
                                </span>
                                {selectedDispute.riskAssessment.trustSignals.map((sig) => (
                                  <span
                                    key={sig}
                                    className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium px-2 py-0.5 border border-emerald-500/20"
                                  >
                                    ✓ {sig}
                                  </span>
                                ))}
                              </div>
                            )}

                            {selectedDispute.riskAssessment.riskSignals.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 items-center pt-1">
                                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                                  Risk Flags:
                                </span>
                                {selectedDispute.riskAssessment.riskSignals.map((sig) => (
                                  <span
                                    key={sig}
                                    className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-medium px-2 py-0.5 border border-amber-500/20"
                                  >
                                    ⚠ {sig}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="pt-2 text-[11px] text-subtle-foreground italic border-t border-border/60">
                              Guidance: {selectedDispute.riskAssessment.recommendation}
                            </div>
                          </div>
                        </div>

                        {/* Part 5: Verdict Actions Console */}
                        {!selectedDispute.status.startsWith("RESOLVED") ? (
                          <div className="p-4 bg-muted/30 border border-border space-y-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                              <Lock className="size-3.5 text-primary" />
                              <span>Issue Binding Admin Verdict (Simulated Execution)</span>
                            </div>

                            {verdictSuccess && (
                              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                                {verdictSuccess}
                              </div>
                            )}

                            {verdictError && (
                              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                                {verdictError}
                              </div>
                            )}

                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-foreground">
                                Internal Audit Rationale &amp; Findings
                              </label>
                              <Textarea
                                rows={3}
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Explain why the claim is being approved or dismissed. This rationale is logged to the dispute timeline..."
                                className="text-xs bg-background"
                              />
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => handleResolve("SELLER_PAYOUT")}
                                className="text-xs"
                              >
                                Reject Claim &amp; Release Seller Payout
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleResolve("RETURN_AND_PICKUP")}
                                className="text-xs"
                              >
                                Approve Return &amp; Reverse Pickup
                              </Button>
                              <Button
                                type="button"
                                onClick={() => handleResolve("BUYER_REFUND")}
                                className="text-xs"
                              >
                                Approve 100% Buyer Refund
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-xs">
                            <div className="flex items-center justify-between font-bold text-emerald-700 dark:text-emerald-300">
                              <span>
                                ✓ Dispute Resolved:{" "}
                                {selectedDispute.adminVerdict?.decision.replace(/_/g, " ")}
                              </span>
                              <span>
                                Closed:{" "}
                                {new Date(
                                  selectedDispute.adminVerdict?.resolvedAt ||
                                    selectedDispute.updatedAt,
                                ).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-subtle-foreground">
                              {selectedDispute.adminVerdict?.adminNotes}
                            </p>
                            {selectedDispute.adminVerdict?.reverseTrackingNumber && (
                              <div className="font-semibold text-foreground pt-1">
                                Reverse Pickup Code: #
                                {selectedDispute.adminVerdict.reverseTrackingNumber} (Simulated)
                              </div>
                            )}
                          </div>
                        )}

                        {/* Part 6: Audit Log Entries */}
                        <div className="space-y-2 pt-2 border-t border-border">
                          <h4 className="text-[11px] font-bold text-muted-foreground uppercase">
                            Dispute Audit History ({selectedDispute.auditLog.length})
                          </h4>
                          <div className="space-y-1.5">
                            {selectedDispute.auditLog.map((log) => (
                              <div
                                key={log.id}
                                className="text-[11px] p-2 bg-muted/40 border border-border flex items-start justify-between gap-3"
                              >
                                <div>
                                  <span className="font-bold text-foreground">
                                    [{log.actor}] {log.action}:
                                  </span>{" "}
                                  <span className="text-subtle-foreground">{log.notes}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground shrink-0">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="border-border p-12 text-center text-xs text-muted-foreground">
                    Select a dispute from the queue on the left to inspect evidence and resolve.
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
