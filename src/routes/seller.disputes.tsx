import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SellerSidebar } from "./seller.dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileCheck2,
  XCircle,
  HelpCircle,
  Eye,
  X,
  MessageSquare,
  Lock,
} from "lucide-react";
import { taka } from "@/data/catalog";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import {
  getDisputes,
  getDisputesForSeller,
  submitSellerResponse,
  getSellerSlaStatus,
  REASON_LABELS,
  DEFECT_CATEGORY_LABELS,
  type DisputeRecord,
  type EvidenceItem,
} from "@/lib/dispute-store";

export const Route = createFileRoute("/seller/disputes")({
  head: () => ({
    meta: [{ title: "Dispute Mediation & Claims | Seller Hub" }],
  }),
  component: SellerDisputesPage,
});

function SellerDisputesPage() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  // Counter-Evidence Form State
  const [sellerNote, setSellerNote] = useState<string>("");
  const [counterEvidence, setCounterEvidence] = useState<EvidenceItem[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");

  useEffect(() => {
    // Show seller disputes, fallback to all disputes for demo/testing
    const sellerId = user?.id || "u-1";
    const myDisputes = getDisputesForSeller(sellerId);
    setDisputes(myDisputes.length > 0 ? myDisputes : getDisputes());
  }, [user]);

  const activeDispute = disputes.find((d) => d.id === selectedDisputeId);

  // Quick Counter-Evidence Sample Adder
  const addSampleCounterProof = (type: "PACKAGING" | "IMEI_MATCH" | "TESTING") => {
    const samples: Record<string, EvidenceItem> = {
      PACKAGING: {
        id: `ev-cnt-${Date.now()}-1`,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
        title: "Pre-dispatch packaging photo",
        description: "Device packed with bubble wrap and invoice intact (Simulated Proof)",
        fileSizeBytes: 1200000,
        uploadedAt: new Date().toISOString(),
        uploader: "SELLER",
        isSimulated: true,
      },
      IMEI_MATCH: {
        id: `ev-cnt-${Date.now()}-2`,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
        title: "IMEI & Serial verification card",
        description: "Matching IMEI verified prior to handover (Simulated Proof)",
        fileSizeBytes: 950000,
        uploadedAt: new Date().toISOString(),
        uploader: "SELLER",
        isSimulated: true,
      },
      TESTING: {
        id: `ev-cnt-${Date.now()}-3`,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
        title: "Diagnostic display test pass photo",
        description: "Screen inspected clean before packing (Simulated Proof)",
        fileSizeBytes: 1350000,
        uploadedAt: new Date().toISOString(),
        uploader: "SELLER",
        isSimulated: true,
      },
    };

    const sample = samples[type];
    if (sample) {
      setCounterEvidence((prev) => [...prev, sample]);
    }
  };

  // Submit Accept Return
  const handleAcceptReturn = (disputeId: string) => {
    setActionError("");
    const res = submitSellerResponse(disputeId, {
      acceptedReturn: true,
      sellerNote:
        "Seller accepted return request without contest. Authorized simulated refund upon reverse pickup.",
      counterEvidence: [],
    });

    if (!res.success) {
      setActionError(res.error || "Failed to process resolution.");
      return;
    }

    setActionSuccess(
      "Return accepted. Order status updated to Refund Requested (Simulation). Reverse courier pickup requested.",
    );
    // Reload
    setDisputes(getDisputes());
  };

  // Submit Counter Evidence
  const handleContestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisputeId) return;

    if (!sellerNote.trim() || sellerNote.length < 15) {
      setActionError("Please provide a detailed statement explaining your contest (min 15 chars).");
      return;
    }

    const res = submitSellerResponse(selectedDisputeId, {
      acceptedReturn: false,
      sellerNote,
      counterEvidence,
    });

    if (!res.success) {
      setActionError(res.error || "Failed to submit response.");
      return;
    }

    setActionSuccess("Counter-evidence successfully submitted. Escalated to Admin Mediation Desk.");
    setSelectedDisputeId(null);
    setSellerNote("");
    setCounterEvidence([]);
    // Reload
    setDisputes(getDisputes());
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />

        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 w-full flex gap-8 lg:gap-10">
          <SellerSidebar active="orders" />

          <div className="flex-1 space-y-6 min-w-0">
            <div>
              <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                <ShieldAlert className="size-3.5" />
                <span>Seller Mediation Workbench</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Disputes &amp; Condition Claims
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Review buyer condition claims, respond within the 24h SLA window, or authorize
                returns.
              </p>
            </div>

            {actionSuccess && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
                <button type="button" onClick={() => setActionSuccess("")}>
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            {actionError && (
              <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
                <button type="button" onClick={() => setActionError("")}>
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            {/* Active Disputes List */}
            <div className="space-y-4">
              {disputes.map((d) => {
                const sellerSla = getSellerSlaStatus(d);
                const isOpen = d.status === "OPEN";

                return (
                  <Card key={d.id} className="border-border overflow-hidden">
                    <div className="bg-muted/40 p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-display font-bold text-sm text-foreground">
                          Dispute #{d.id}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          &middot; Order #{d.orderNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            d.status.startsWith("RESOLVED")
                              ? "default"
                              : isOpen
                                ? "destructive"
                                : "outline"
                          }
                          className="text-[11px]"
                        >
                          {d.status.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-xs font-bold text-primary">{taka(d.orderTotal)}</span>
                      </div>
                    </div>

                    <CardContent className="p-4 sm:p-6 space-y-4">
                      {/* SLA Alert Banner for Seller */}
                      {isOpen && (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                          <Clock className="size-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-bold block">
                              24-Hour Action Required (SLA Countdown)
                            </span>
                            <span>
                              {sellerSla.expired
                                ? "24-Hour SLA has expired. This dispute has been escalated to Resale Admin mediation."
                                : `You have ${sellerSla.hoursRemaining} hours and ${sellerSla.minutesRemaining} minutes to respond. Uncontested claims will escalate automatically.`}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={d.productImage}
                            alt={d.productName}
                            className="size-14 object-cover border border-border bg-muted shrink-0"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-foreground">{d.productName}</h3>
                            <p className="text-xs text-subtle-foreground mt-0.5">
                              Claimed Reason: <strong>{REASON_LABELS[d.reason]}</strong>
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Component Category: {DEFECT_CATEGORY_LABELS[d.defectCategory]}
                            </p>
                          </div>
                        </div>

                        {/* Buyer Information Masked */}
                        <div className="text-xs text-right text-muted-foreground">
                          <div>
                            Buyer:{" "}
                            <span className="font-semibold text-foreground">{d.buyerName}</span>
                          </div>
                          <div>Contact: {d.maskedBuyerPhone}</div>
                        </div>
                      </div>

                      {/* Buyer Statement */}
                      <div className="bg-muted/30 border-l-2 border-amber-500 p-3 text-xs">
                        <span className="font-semibold text-muted-foreground block text-[10px] uppercase">
                          Buyer Claim:
                        </span>
                        <p className="mt-0.5 text-foreground leading-relaxed">
                          {d.claimedDefectDescription}
                        </p>
                      </div>

                      {/* Buyer Evidence Gallery */}
                      {d.buyerEvidence.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                            Buyer Uploaded Proof ({d.buyerEvidence.length}):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {d.buyerEvidence.map((ev) => (
                              <div
                                key={ev.id}
                                className="relative border border-border p-1.5 bg-card flex items-center gap-2"
                              >
                                <img
                                  src={ev.url}
                                  alt={ev.title}
                                  className="size-12 object-cover border border-border"
                                />
                                <div className="text-xs max-w-44">
                                  <span className="font-medium text-foreground truncate block">
                                    {ev.title}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {ev.description || "Photo proof"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Existing Seller Counter Evidence if Submitted */}
                      {d.sellerResponse && (
                        <div className="p-3 bg-secondary/60 border border-border text-xs space-y-1.5">
                          <span className="font-bold text-foreground block">
                            Your Submitted Response (
                            {new Date(d.sellerResponse.respondedAt).toLocaleDateString()}):
                          </span>
                          <p className="text-subtle-foreground">{d.sellerResponse.sellerNote}</p>
                          {d.sellerResponse.counterEvidence.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {d.sellerResponse.counterEvidence.map((ev) => (
                                <img
                                  key={ev.id}
                                  src={ev.url}
                                  alt={ev.title}
                                  className="size-12 object-cover border border-border"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions for OPEN disputes */}
                      {isOpen && (
                        <div className="pt-3 border-t border-border flex flex-wrap items-center justify-end gap-2.5">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleAcceptReturn(d.id)}
                            className="text-xs"
                          >
                            Accept Return &amp; Authorize Refund (Simulation)
                          </Button>
                          <Button
                            type="button"
                            onClick={() =>
                              setSelectedDisputeId(selectedDisputeId === d.id ? null : d.id)
                            }
                            className="text-xs"
                          >
                            {selectedDisputeId === d.id
                              ? "Close Contest Panel"
                              : "Contest & Submit Counter-Evidence"}
                          </Button>
                        </div>
                      )}

                      {/* Contest Form Expansion */}
                      {selectedDisputeId === d.id && isOpen && (
                        <form
                          onSubmit={handleContestSubmit}
                          className="mt-4 pt-4 border-t border-border bg-muted/20 p-4 space-y-4"
                        >
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-foreground">
                              Submit Counter-Evidence &amp; Remarks
                            </h4>
                            <p className="text-[11px] text-muted-foreground">
                              Provide dispatch packing photos, IMEI serial documentation, or
                              pre-shipping diagnostic notes.
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Your Explanation</Label>
                            <Textarea
                              rows={3}
                              value={sellerNote}
                              onChange={(e) => setSellerNote(e.target.value)}
                              placeholder="Detail your pre-dispatch testing, packaging steps, or contest reason..."
                              className="text-xs bg-background"
                            />
                          </div>

                          {/* Counter Proof Picker */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-semibold">
                                Counter-Evidence Proof ({counterEvidence.length})
                              </Label>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => addSampleCounterProof("PACKAGING")}
                                  className="text-[10px] bg-secondary hover:bg-muted px-2 py-0.5 border border-border"
                                >
                                  + Packaging Photo
                                </button>
                                <button
                                  type="button"
                                  onClick={() => addSampleCounterProof("IMEI_MATCH")}
                                  className="text-[10px] bg-secondary hover:bg-muted px-2 py-0.5 border border-border"
                                >
                                  + IMEI Match Proof
                                </button>
                              </div>
                            </div>

                            {counterEvidence.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {counterEvidence.map((ev) => (
                                  <div
                                    key={ev.id}
                                    className="relative size-14 border border-border overflow-hidden bg-muted"
                                  >
                                    <img
                                      src={ev.url}
                                      alt={ev.title}
                                      className="size-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setCounterEvidence((prev) =>
                                          prev.filter((it) => it.id !== ev.id),
                                        )
                                      }
                                      className="absolute top-0 right-0 bg-background/90 text-destructive size-4 flex items-center justify-center"
                                    >
                                      <X className="size-2.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setSelectedDisputeId(null)}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                            <Button type="submit" className="text-xs">
                              Submit Contest Response
                            </Button>
                          </div>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
