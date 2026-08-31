import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "./admin.index";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Smartphone,
  Tag,
  Clock,
  RefreshCw,
} from "lucide-react";
import { taka, type Grade } from "@/data/catalog";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import { getModerationQueueFn, moderateListingFn } from "@/lib/server-functions";
import { RejectionDialog } from "@/components/moderation/rejection-dialog";
import { AuditHistorySheet } from "@/components/moderation/audit-history-sheet";
import { GradeBadge } from "@/components/grade-badge";
import type { ListingRejectionReasonCode } from "@/lib/types";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({
    meta: [{ title: "Listing Moderation Workbench | Resale.com" }],
  }),
  component: AdminModerationPage,
});

interface ModerationQueueItem {
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

function AdminModerationPage() {
  const { token } = useAuth();
  const [queue, setQueue] = useState<ModerationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<Record<string, boolean>>({});

  // Rejection Dialog state
  const [rejectItem, setRejectItem] = useState<ModerationQueueItem | null>(null);

  const fetchQueue = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getModerationQueueFn({ data: { token } });
      if (res.success && res.data) {
        setQueue(res.data as ModerationQueueItem[]);
      } else {
        setError(res.error || "Failed to fetch moderation queue.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Error fetching queue.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleApprove = async (listingId: string) => {
    if (!token) return;
    try {
      setActionInProgress((prev) => ({ ...prev, [listingId]: true }));
      const res = await moderateListingFn({
        data: {
          token,
          listingId,
          action: "APPROVE",
        },
      });

      if (res.success) {
        setQueue((prev) => prev.filter((item) => item.id !== listingId));
      } else {
        alert(res.error || "Failed to approve listing.");
      }
    } catch (err: unknown) {
      alert((err as Error)?.message || "Error approving listing.");
    } finally {
      setActionInProgress((prev) => ({ ...prev, [listingId]: false }));
    }
  };

  const handleConfirmReject = async (
    reasonCode: ListingRejectionReasonCode,
    reasonText: string,
  ) => {
    if (!token || !rejectItem) return;
    const listingId = rejectItem.id;
    try {
      setActionInProgress((prev) => ({ ...prev, [listingId]: true }));
      const res = await moderateListingFn({
        data: {
          token,
          listingId,
          action: "REJECT",
          reasonCode,
          reasonText,
        },
      });

      if (res.success) {
        setQueue((prev) => prev.filter((item) => item.id !== listingId));
      } else {
        alert(res.error || "Failed to reject listing.");
      }
    } finally {
      setActionInProgress((prev) => ({ ...prev, [listingId]: false }));
      setRejectItem(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((curr) => (curr === id ? null : id));
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex flex-col md:flex-row gap-10">
          <AdminSidebar active="moderation" />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-display font-bold">Listing Moderation Workbench</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Inspect and approve seller listings before they become publicly discoverable.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchQueue}
                disabled={loading}
                className="gap-1.5 text-xs"
              >
                <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Badge variant="secondary" className="font-mono text-xs">
                {queue.length} Pending Review
              </Badge>
              <span className="text-xs text-muted-foreground">
                All submissions undergo mandatory 32-point check review.
              </span>
            </div>

            {loading ? (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground space-y-3">
                  <RefreshCw className="size-6 animate-spin mx-auto text-primary" />
                  <p className="text-sm font-medium">Loading moderation queue from database...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="py-8 text-center text-destructive space-y-2">
                  <AlertTriangle className="size-6 mx-auto" />
                  <p className="text-sm font-medium">{error}</p>
                </CardContent>
              </Card>
            ) : queue.length === 0 ? (
              <Card className="border-emerald-500/20 bg-emerald-500/5">
                <CardContent className="py-16 text-center text-muted-foreground space-y-2">
                  <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <Check className="size-6" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Moderation Queue is Clear</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    There are currently no seller listings waiting in <code>PENDING_REVIEW</code>{" "}
                    status.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {queue.map((item) => {
                  const discountVsRetail =
                    item.retailPrice > 0
                      ? Math.round(((item.retailPrice - item.price) / item.retailPrice) * 100)
                      : 0;
                  const isBusy = actionInProgress[item.id];

                  return (
                    <Card key={item.id} className="overflow-hidden border-border/80 shadow-sm">
                      <CardHeader className="bg-muted/40 py-4 px-6 flex flex-row items-center justify-between border-b border-border/50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <CardTitle className="text-base font-bold tracking-tight">
                              {item.productName}
                            </CardTitle>
                            <GradeBadge grade={item.grade as Grade} />
                            <Badge variant="outline" className="text-[10px] uppercase font-mono">
                              Score {item.conditionScore}/100
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>
                              Listing ID:{" "}
                              <strong className="font-mono text-foreground">{item.id}</strong>
                            </span>
                            <span>·</span>
                            <span>
                              Seller: <strong className="text-foreground">{item.sellerName}</strong>{" "}
                              {item.sellerVerified ? "✓ Verified" : ""}
                            </span>
                            <span>·</span>
                            <span>
                              Submitted: {new Date(item.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-xl text-primary">
                            {taka(item.price)}
                          </p>
                          {discountVsRetail > 0 && (
                            <p className="text-[11px] text-muted-foreground">
                              {discountVsRetail}% below retail ({taka(item.retailPrice)})
                            </p>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="p-6 space-y-4">
                        {/* Summary metadata strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-muted/20 rounded-md border border-border/40 text-xs">
                          <div>
                            <span className="text-muted-foreground block text-[11px]">
                              Warranty
                            </span>
                            <span className="font-medium text-foreground">
                              {item.warrantyMonths > 0
                                ? `${item.warrantyMonths} Months`
                                : "No Warranty"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[11px]">
                              Original Invoice
                            </span>
                            <span className="font-medium text-foreground">
                              {item.hasInvoice ? "Available" : "Not Provided"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[11px]">
                              Battery Health
                            </span>
                            <span className="font-medium text-foreground">
                              {item.batteryHealth
                                ? `${item.batteryHealth}%`
                                : "— Not individually recorded"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[11px]">
                              Accessories
                            </span>
                            <span
                              className="font-medium text-foreground truncate block"
                              title={item.accessories}
                            >
                              {item.accessories || "Device only"}
                            </span>
                          </div>
                        </div>

                        {/* Expandable deep inspection view */}
                        {expanded === item.id && (
                          <div className="p-4 bg-muted/40 rounded-md space-y-3 border border-border text-xs">
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <span className="font-semibold block mb-1">
                                  Seller Notes & Disclosures:
                                </span>
                                <p className="text-muted-foreground bg-background p-2.5 rounded border border-border leading-relaxed">
                                  {item.sellerNote || "No specific notes provided by seller."}
                                </p>
                              </div>
                              <div>
                                <span className="font-semibold block mb-1">
                                  Repairs & Servicing History:
                                </span>
                                <p className="text-muted-foreground bg-background p-2.5 rounded border border-border leading-relaxed">
                                  {item.repairs || "No repair history disclosed."}
                                </p>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-border flex items-center justify-between text-muted-foreground text-[11px]">
                              <span>
                                Seller Contact Phone:{" "}
                                <strong className="text-foreground">
                                  {item.sellerPhone || "Private"}
                                </strong>
                              </span>
                              <span>
                                Category:{" "}
                                <strong className="text-foreground">{item.category}</strong>
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Action buttons & controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpand(item.id)}
                              className="h-8 text-xs gap-1"
                            >
                              {expanded === item.id ? (
                                <>
                                  <ChevronUp className="size-3.5" /> Less Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="size-3.5" /> Full Inspection Details
                                </>
                              )}
                            </Button>
                            {token && (
                              <AuditHistorySheet
                                listingId={item.id}
                                productName={item.productName}
                                token={token}
                              />
                            )}
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setRejectItem(item)}
                              disabled={isBusy}
                              className="h-9 px-4 gap-1.5 text-xs font-semibold"
                            >
                              <X className="size-3.5" />
                              Reject / Request Fixes
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApprove(item.id)}
                              disabled={isBusy}
                              className="h-9 px-5 gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Check className="size-3.5 stroke-[2.5]" />
                              {isBusy ? "Approving..." : "Approve & Publish"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        <SiteFooter />

        {rejectItem && (
          <RejectionDialog
            open={Boolean(rejectItem)}
            onOpenChange={(open) => !open && setRejectItem(null)}
            listingId={rejectItem.id}
            productName={rejectItem.productName}
            onConfirmReject={handleConfirmReject}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
