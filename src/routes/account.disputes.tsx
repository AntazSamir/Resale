import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck2,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Lock,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { taka, inspectionFramework } from "@/data/catalog";
import { getOrders, type OrderRecord } from "@/lib/order-store";
import { useAuth } from "@/lib/auth-store";
import {
  createDispute,
  getDisputesForBuyer,
  isOrderEligibleForDispute,
  getSellerSlaStatus,
  REASON_LABELS,
  DEFECT_CATEGORY_LABELS,
  type DisputeReason,
  type DefectCategory,
  type EvidenceItem,
  type DisputeRecord,
} from "@/lib/dispute-store";

export const Route = createFileRoute("/account/disputes")({
  head: () => ({
    meta: [
      {
        title: "Dispute Mediation & Issue Reporting | Resale.com",
      },
      {
        name: "description",
        content:
          "Report condition mismatches, battery health discrepancies, or missing accessories within the 48-hour inspection guarantee window.",
      },
    ],
  }),
  component: DisputesPage,
});

export function DisputesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"file" | "history">("file");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [myDisputes, setMyDisputes] = useState<DisputeRecord[]>([]);

  // Form State
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [reason, setReason] = useState<DisputeReason | "">("");
  const [defectCategory, setDefectCategory] = useState<DefectCategory | "">("");
  const [specificCheck, setSpecificCheck] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [requestedResolution, setRequestedResolution] = useState<
    "FULL_REFUND" | "REPLACEMENT" | "PARTIAL_CREDIT"
  >("FULL_REFUND");
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [submittedDisputeId, setSubmittedDisputeId] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    const allOrders = getOrders();
    setOrders(allOrders);

    const buyerId = user?.id || "u-admin";
    const userDisputes = getDisputesForBuyer(buyerId);
    setMyDisputes(userDisputes);

    // Auto-select eligible order if URL param or first delivered order
    const firstEligible = allOrders.find((o) => isOrderEligibleForDispute(o).eligible);
    if (firstEligible) {
      setSelectedOrderId(firstEligible.id);
    } else if (allOrders.length > 0 && allOrders[0]) {
      setSelectedOrderId(allOrders[0].id);
    }
  }, [user]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const eligibility = selectedOrder
    ? isOrderEligibleForDispute(selectedOrder)
    : { eligible: false, hoursRemaining: 0, minutesRemaining: 0, expired: false };

  // File Upload Handler (with strict 5MB photo / 15MB video quota checks)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;

    setFileError("");
    const isVid = file.type.startsWith("video/");
    const maxSizeBytes = isVid ? 15 * 1024 * 1024 : 5 * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      setFileError(
        `File too large. Maximum size for ${isVid ? "videos is 15MB" : "images is 5MB"}.`,
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = (loadEvt.target?.result as string) || "";
      const newEv: EvidenceItem = {
        id: `ev-up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: isVid ? "VIDEO" : "IMAGE",
        url: dataUrl,
        thumbnailUrl: dataUrl,
        title: file.name,
        description: `Uploaded by buyer (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
        fileSizeBytes: file.size,
        uploadedAt: new Date().toISOString(),
        uploader: "BUYER",
        isSimulated: false,
      };

      setEvidenceList((prev) => [...prev, newEv]);
    };
    reader.readAsDataURL(file);
  };

  // Add Sample Test Media helper
  const addSampleMedia = (type: "SCRATCH" | "BATTERY" | "PACKAGING") => {
    const samples: Record<string, EvidenceItem> = {
      SCRATCH: {
        id: `ev-sample-${Date.now()}-1`,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
        title: "Close-up of display scratch",
        description: "Visible under angle light (Simulated Evidence)",
        fileSizeBytes: 1240000,
        uploadedAt: new Date().toISOString(),
        uploader: "BUYER",
        isSimulated: true,
      },
      BATTERY: {
        id: `ev-sample-${Date.now()}-2`,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
        title: "Battery Health setting screenshot",
        description: "Diagnostic screenshot showing capacity mismatch (Simulated Evidence)",
        fileSizeBytes: 890000,
        uploadedAt: new Date().toISOString(),
        uploader: "BUYER",
        isSimulated: true,
      },
      PACKAGING: {
        id: `ev-sample-${Date.now()}-3`,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
        title: "Unboxing condition photo",
        description: "Missing original 30W adapter from packaging (Simulated Evidence)",
        fileSizeBytes: 980000,
        uploadedAt: new Date().toISOString(),
        uploader: "BUYER",
        isSimulated: true,
      },
    };

    const sample = samples[type];
    if (sample) {
      setEvidenceList((prev) => [...prev, sample]);
    }
  };

  const removeEvidence = (id: string) => {
    setEvidenceList((prev) => prev.filter((it) => it.id !== id));
  };

  // Submit Dispute
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!selectedOrderId) {
      setSubmitError("Please select a delivered order.");
      return;
    }

    if (!eligibility.eligible) {
      setSubmitError(eligibility.reason || "This order is not eligible for dispute.");
      return;
    }

    if (!reason) {
      setSubmitError("Please specify the primary dispute reason.");
      return;
    }

    if (!defectCategory) {
      setSubmitError("Please select the defect inspection category.");
      return;
    }

    if (!explanation.trim() || explanation.length < 20) {
      setSubmitError(
        "Please provide a detailed explanation of the defect (at least 20 characters).",
      );
      return;
    }

    if (evidenceList.length === 0) {
      setSubmitError(
        "Please attach at least one photo or screenshot demonstrating the claimed defect.",
      );
      return;
    }

    const result = createDispute({
      orderId: selectedOrderId,
      reason: reason as DisputeReason,
      defectCategory: defectCategory as DefectCategory,
      specificInspectionCheck: specificCheck || undefined,
      claimedDefectDescription: explanation,
      requestedResolution,
      evidence: evidenceList,
      buyerId: user?.id || "u-admin",
      buyerName: user?.name || "Admin User",
      buyerPhone: user?.phone || "01700000000",
      buyerNid: "199526920199201",
    });

    if (!result.success) {
      setSubmitError(result.error || "Failed to create dispute.");
      return;
    }

    setSubmittedDisputeId(result.disputeId!);
    // Refresh user's dispute list
    setMyDisputes(getDisputesForBuyer(user?.id || "u-admin"));
  };

  // Render Post-Submit Success Banner
  if (submittedDisputeId) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-2xl px-4 py-10 w-full">
          <Card className="border-border shadow-xs text-center p-6 sm:p-8">
            <CardContent className="space-y-4 pt-4">
              <div className="mx-auto bg-emerald-500/10 p-3 w-fit border border-emerald-500/20">
                <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                Dispute Successfully Filed
              </h1>
              <p className="text-xs sm:text-sm text-subtle-foreground max-w-md mx-auto leading-relaxed">
                Dispute reference <strong>#{submittedDisputeId}</strong> has been registered. Order
                payout is placed on <strong>Escrow Hold (Simulation)</strong>. The seller has 24
                hours to review and respond.
              </p>

              <div className="bg-muted/60 border border-border p-3.5 text-left text-xs space-y-2 mt-4">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Clock className="size-3.5 text-primary" />
                  <span>24-Hour Seller Counter-Response SLA Active</span>
                </div>
                <p className="text-muted-foreground leading-normal">
                  If the seller accepts the return, a reverse courier pickup code is issued
                  automatically. If the seller contests or misses the 24h deadline, Resale admin
                  mediators step in.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center pt-4">
                <Button
                  onClick={() => {
                    setSubmittedDisputeId(null);
                    setActiveTab("history");
                  }}
                >
                  View Active Disputes ({myDisputes.length})
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/account/orders">Back to Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10 w-full">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <nav className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span>&gt;</span>
            <Link to="/account/orders" className="hover:text-foreground">
              My Orders
            </Link>
            <span>&gt;</span>
            <span className="text-foreground font-semibold">Dispute Mediation Hub</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                <ShieldAlert className="size-3.5" />
                <span>48-Hour Buyer Protection Window</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Dispute Mediation &amp; Condition Claims
              </h1>
              <p className="text-xs sm:text-sm text-subtle-foreground mt-0.5">
                File a structured defect claim with photo/video evidence or track active mediation
                cases.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="inline-flex border border-border p-1 bg-muted shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("file")}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "file"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                File New Dispute
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "history"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                My Disputes ({myDisputes.length})
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: FILE NEW DISPUTE */}
        {activeTab === "file" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Filing Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold font-display">
                    Step 1: Select Delivered Order &amp; Defect
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Disputes must be filed within 48 hours of physical delivery. Provide
                    high-clarity proof for fast resolution.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {submitError && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2">
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    {/* Order Selector */}
                    <div className="space-y-1.5">
                      <Label htmlFor="order-select" className="text-xs font-semibold">
                        Select Delivered Order
                      </Label>
                      <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                        <SelectTrigger id="order-select" className="h-10 text-xs bg-background">
                          <SelectValue placeholder="Choose an order" />
                        </SelectTrigger>
                        <SelectContent>
                          {orders.map((o) => {
                            const p = o.items[0];
                            const elig = isOrderEligibleForDispute(o);
                            return (
                              <SelectItem key={o.id} value={o.id} className="text-xs py-2">
                                <div className="flex items-center justify-between gap-3 w-full">
                                  <span className="font-semibold">{o.id}</span>
                                  <span className="text-muted-foreground truncate max-w-48">
                                    {p?.name || "Device"} ({taka(o.total)})
                                  </span>
                                  {elig.eligible ? (
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-1.5 py-0.5">
                                      {elig.hoursRemaining}h remaining
                                    </span>
                                  ) : (
                                    <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5">
                                      {elig.expired ? "Window Expired" : o.orderStatus}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      {/* Eligibility Banner */}
                      {selectedOrder && (
                        <div
                          className={`p-3 border text-xs flex items-start gap-2.5 mt-2 ${
                            eligibility.eligible
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300"
                          }`}
                        >
                          {eligibility.eligible ? (
                            <>
                              <Clock className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block">
                                  48-Hour Inspection Guarantee Active
                                </span>
                                <span>
                                  You have <strong>{eligibility.hoursRemaining} hours</strong> and{" "}
                                  <strong>{eligibility.minutesRemaining} minutes</strong> remaining
                                  to submit this claim.
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block">
                                  Ineligible for Standard Dispute
                                </span>
                                <span>{eligibility.reason}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Primary Reason */}
                    <div className="space-y-1.5">
                      <Label htmlFor="reason-select" className="text-xs font-semibold">
                        Primary Dispute Reason
                      </Label>
                      <Select
                        value={reason}
                        onValueChange={(val) => setReason(val as DisputeReason)}
                      >
                        <SelectTrigger id="reason-select" className="h-10 text-xs bg-background">
                          <SelectValue placeholder="Select primary reason for dispute" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(REASON_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key} className="text-xs">
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Defect Inspection Category */}
                    <div className="space-y-1.5">
                      <Label htmlFor="defect-cat" className="text-xs font-semibold">
                        32-Point Component Category
                      </Label>
                      <Select
                        value={defectCategory}
                        onValueChange={(val) => setDefectCategory(val as DefectCategory)}
                      >
                        <SelectTrigger id="defect-cat" className="h-10 text-xs bg-background">
                          <SelectValue placeholder="Select component category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DEFECT_CATEGORY_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key} className="text-xs">
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Detailed Explanation */}
                    <div className="space-y-1.5">
                      <Label htmlFor="explanation" className="text-xs font-semibold">
                        Detailed Defect Description &amp; Discrepancy Note
                      </Label>
                      <Textarea
                        id="explanation"
                        rows={4}
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        placeholder="Explain clearly what does not match the 32-point condition report. Include specific percentages, visible scratch locations, or functional test failures..."
                        className="text-xs bg-background"
                      />
                      <span className="text-[11px] text-muted-foreground block">
                        Minimum 20 characters. Accurate descriptions expedite admin verdict.
                      </span>
                    </div>

                    {/* Resolution Requested */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Requested Resolution</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <label
                          className={`p-3 border text-xs cursor-pointer flex flex-col justify-between transition-colors ${
                            requestedResolution === "FULL_REFUND"
                              ? "bg-primary/10 border-primary text-foreground font-semibold"
                              : "bg-card border-border text-subtle-foreground"
                          }`}
                        >
                          <input
                            type="radio"
                            name="resolution"
                            value="FULL_REFUND"
                            checked={requestedResolution === "FULL_REFUND"}
                            onChange={() => setRequestedResolution("FULL_REFUND")}
                            className="sr-only"
                          />
                          <span>Full Refund</span>
                          <span className="text-[10px] text-muted-foreground font-normal mt-1">
                            Return device for 100% money back
                          </span>
                        </label>

                        <label
                          className={`p-3 border text-xs cursor-pointer flex flex-col justify-between transition-colors ${
                            requestedResolution === "REPLACEMENT"
                              ? "bg-primary/10 border-primary text-foreground font-semibold"
                              : "bg-card border-border text-subtle-foreground"
                          }`}
                        >
                          <input
                            type="radio"
                            name="resolution"
                            value="REPLACEMENT"
                            checked={requestedResolution === "REPLACEMENT"}
                            onChange={() => setRequestedResolution("REPLACEMENT")}
                            className="sr-only"
                          />
                          <span>Replacement Unit</span>
                          <span className="text-[10px] text-muted-foreground font-normal mt-1">
                            Exchange for identical verified model
                          </span>
                        </label>

                        <label
                          className={`p-3 border text-xs cursor-pointer flex flex-col justify-between transition-colors ${
                            requestedResolution === "PARTIAL_CREDIT"
                              ? "bg-primary/10 border-primary text-foreground font-semibold"
                              : "bg-card border-border text-subtle-foreground"
                          }`}
                        >
                          <input
                            type="radio"
                            name="resolution"
                            value="PARTIAL_CREDIT"
                            checked={requestedResolution === "PARTIAL_CREDIT"}
                            onChange={() => setRequestedResolution("PARTIAL_CREDIT")}
                            className="sr-only"
                          />
                          <span>Partial Credit</span>
                          <span className="text-[10px] text-muted-foreground font-normal mt-1">
                            Keep item with fair price adjustment
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Evidence Upload Portal Dropzone */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">
                          Upload Evidence Files ({evidenceList.length})
                        </Label>
                        <span className="text-[11px] text-muted-foreground">
                          Max 5MB/photo · Max 15MB/video
                        </span>
                      </div>

                      {fileError && (
                        <p className="text-xs text-destructive bg-destructive/10 p-2 border border-destructive/20">
                          {fileError}
                        </p>
                      )}

                      {/* Dropzone */}
                      <label className="border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors p-5 text-center cursor-pointer flex flex-col items-center justify-center gap-2">
                        <Upload className="size-6 text-muted-foreground" />
                        <div>
                          <span className="text-xs font-semibold text-foreground block">
                            Click or drag photos / videos here
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            JPG, PNG, WebP or MP4 up to 15MB
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>

                      {/* Quick-fill sample buttons for frictionless testing */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-muted-foreground font-medium mr-1">
                          Add Demo Proof:
                        </span>
                        <button
                          type="button"
                          onClick={() => addSampleMedia("SCRATCH")}
                          className="text-[10px] font-semibold bg-secondary hover:bg-muted px-2 py-1 border border-border text-foreground transition-colors"
                        >
                          + Display Scratch Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => addSampleMedia("BATTERY")}
                          className="text-[10px] font-semibold bg-secondary hover:bg-muted px-2 py-1 border border-border text-foreground transition-colors"
                        >
                          + Battery Capacity Screenshot
                        </button>
                        <button
                          type="button"
                          onClick={() => addSampleMedia("PACKAGING")}
                          className="text-[10px] font-semibold bg-secondary hover:bg-muted px-2 py-1 border border-border text-foreground transition-colors"
                        >
                          + Missing Accessory Photo
                        </button>
                      </div>

                      {/* Evidence Gallery Preview */}
                      {evidenceList.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3">
                          {evidenceList.map((ev) => (
                            <div
                              key={ev.id}
                              className="relative group border border-border bg-card p-2 flex flex-col justify-between space-y-1.5"
                            >
                              <div className="aspect-video w-full bg-muted overflow-hidden relative flex items-center justify-center">
                                {ev.type === "IMAGE" ? (
                                  <img
                                    src={ev.url}
                                    alt={ev.title}
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Video className="size-4" />
                                    <span>Video Clip</span>
                                  </div>
                                )}
                                {ev.isSimulated && (
                                  <span className="absolute bottom-1 left-1 bg-background/90 text-[9px] font-bold px-1 text-muted-foreground">
                                    Demo Proof
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="text-[11px] font-semibold text-foreground truncate block">
                                  {ev.title}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEvidence(ev.id)}
                                className="absolute top-1 right-1 size-5 bg-background/90 text-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors border border-border"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Disclaimer Banner */}
                    <div className="bg-muted/40 border border-border p-3 text-xs text-subtle-foreground space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <Lock className="size-3.5 text-primary" />
                        <span>Escrow Hold &amp; Mediation Policy (Simulated)</span>
                      </div>
                      <p className="leading-relaxed">
                        Filing locks the seller&apos;s payout in simulated escrow. The seller is
                        given 24 hours to contest with counter-evidence or accept the return. All
                        evidence is reviewed against our 32-point inspection baseline.
                      </p>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border">
                      <Button type="button" variant="outline" asChild>
                        <Link to="/account/orders">Cancel</Link>
                      </Button>
                      <Button type="submit" disabled={!eligibility.eligible}>
                        Submit Dispute &amp; Freeze Payout
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Guide */}
            <div className="space-y-5">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <FileCheck2 className="size-4 text-primary" />
                    <span>How Mediation Works</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-3 text-subtle-foreground leading-relaxed">
                  <div>
                    <span className="font-bold text-foreground block">1. 48h Filing Window</span>
                    <span>
                      You have 48 hours from courier delivery to verify and report any undisclosed
                      faults.
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">
                      2. 24h Seller Response SLA
                    </span>
                    <span>
                      The seller can accept return immediately or upload packaging proof/IMEI match.
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">
                      3. Admin Verdict &amp; Reverse Pickup
                    </span>
                    <span>
                      If contested, Resale mediators review the side-by-side baseline and issue a
                      binding verdict with free reverse courier pickup.
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-secondary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Need Live Assistance?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <p className="text-subtle-foreground">
                    For delivery damages or emergency cancellation assistance:
                  </p>
                  <div className="bg-background border border-border p-2.5 font-medium text-foreground">
                    <span>Dhaka Support Desk: </span>
                    <span className="font-bold text-primary">09612-RESALE</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: MY DISPUTES HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {myDisputes.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border bg-card p-6">
                <ShieldCheck className="size-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-base font-bold text-foreground">No Disputes Filed</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  You have not filed any condition or return claims. All delivered orders with
                  active 48h guarantee can be disputed from the &ldquo;File New Dispute&rdquo; tab.
                </p>
                <Button onClick={() => setActiveTab("file")} className="mt-4" size="sm">
                  File a Claim
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myDisputes.map((d) => {
                  const sellerSla = getSellerSlaStatus(d);
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
                                : d.status === "OPEN"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-[11px]"
                          >
                            {d.status.replace(/_/g, " ")}
                          </Badge>
                          <span className="text-xs font-bold text-primary">
                            {taka(d.orderTotal)}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-4 sm:p-6 space-y-4">
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
                                Reason: <strong>{REASON_LABELS[d.reason]}</strong>
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Category: {DEFECT_CATEGORY_LABELS[d.defectCategory]} &middot;
                                Seller: {d.sellerName}
                              </p>
                            </div>
                          </div>

                          {/* SLA Timer Badge */}
                          {d.status === "OPEN" && (
                            <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-800 dark:text-amber-300 shrink-0 flex items-center gap-2">
                              <Clock className="size-4 text-amber-600 shrink-0" />
                              <div>
                                <span className="font-bold block">Seller SLA Running</span>
                                <span>
                                  {sellerSla.expired
                                    ? "SLA Expired — Escalated to Admin"
                                    : `${sellerSla.hoursRemaining}h ${sellerSla.minutesRemaining}m remaining`}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Description Quote */}
                        <div className="bg-muted/30 border-l-2 border-primary p-3 text-xs text-foreground">
                          <span className="font-semibold text-muted-foreground block text-[10px] uppercase">
                            Claimed Defect:
                          </span>
                          <p className="mt-0.5 leading-relaxed">{d.claimedDefectDescription}</p>
                        </div>

                        {/* Evidence Previews */}
                        {d.buyerEvidence.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                              Attached Proof ({d.buyerEvidence.length}):
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {d.buyerEvidence.map((ev) => (
                                <div
                                  key={ev.id}
                                  className="size-12 border border-border overflow-hidden relative group bg-muted"
                                >
                                  <img
                                    src={ev.url}
                                    alt={ev.title}
                                    className="size-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resolution verdict if completed */}
                        {d.adminVerdict && (
                          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                            <span className="font-bold text-emerald-700 dark:text-emerald-300 block">
                              ✓ Resolution: {d.adminVerdict.decision.replace(/_/g, " ")} (Simulated)
                            </span>
                            <p className="text-subtle-foreground">{d.adminVerdict.adminNotes}</p>
                            {d.adminVerdict.reverseTrackingNumber && (
                              <span className="text-[11px] font-semibold text-foreground block pt-1">
                                Reverse Logistics Code: #{d.adminVerdict.reverseTrackingNumber}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Audit Timeline */}
                        <div className="pt-3 border-t border-border text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
                          <span>Filed: {new Date(d.createdAt).toLocaleString()}</span>
                          <span className="text-primary font-medium">
                            {d.auditLog.length} Timeline Event(s)
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
