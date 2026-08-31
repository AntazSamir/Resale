import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SellerSidebar } from "./seller.dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { taka, type Grade } from "@/data/catalog";
import { GradeBadge } from "@/components/grade-badge";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import { getSellerListingsFn, updateListingAvailabilityFn } from "@/lib/server-functions";
import { ListingStatusBadge } from "@/components/seller/listing-status-badge";
import { AuditHistorySheet } from "@/components/moderation/audit-history-sheet";
import {
  Plus,
  RefreshCw,
  Pause,
  Play,
  Ban,
  Edit3,
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/seller/listings")({
  head: () => ({
    meta: [{ title: "My Inventory & Listings | Resale.com" }],
  }),
  component: SellerListingsPage,
});

interface SellerListingItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  grade: string;
  conditionScore: number;
  moderationStatus: string;
  status: string;
  sellerNote: string;
  warrantyMonths: number;
  hasInvoice: boolean;
  accessories: string;
  repairs: string;
  batteryHealth: number | null;
  rejectionReasonCode: string | null;
  rejectionReasonText: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  listedAt: string;
}

type TabKey = "ALL" | "ACTIVE" | "PENDING" | "REJECTED" | "DRAFT" | "PAUSED_SOLD";

function SellerListingsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<SellerListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [actionInProgress, setActionInProgress] = useState<Record<string, boolean>>({});

  const fetchListings = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getSellerListingsFn({ data: { token } });
      if (res.success && res.data) {
        setListings(res.data as SellerListingItem[]);
      } else {
        setError(res.error || "Failed to load seller listings.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Error fetching listings.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleToggleAvailability = async (
    listingId: string,
    action: "PAUSE" | "RESUME" | "DELIST",
  ) => {
    if (!token) return;
    try {
      setActionInProgress((prev) => ({ ...prev, [listingId]: true }));
      const res = await updateListingAvailabilityFn({
        data: {
          token,
          listingId,
          action,
        },
      });

      if (res.success && res.status) {
        setListings((prev) =>
          prev.map((l) => (l.id === listingId ? { ...l, status: res.status } : l)),
        );
      } else {
        alert(res.error || "Action failed.");
      }
    } catch (err: unknown) {
      alert((err as Error)?.message || "Error updating availability.");
    } finally {
      setActionInProgress((prev) => ({ ...prev, [listingId]: false }));
    }
  };

  // Filter listings by tab
  const filteredListings = listings.filter((l) => {
    switch (activeTab) {
      case "ACTIVE":
        return l.status === "ACTIVE" || l.status === "PUBLISHED";
      case "PENDING":
        return l.moderationStatus === "PENDING_REVIEW" || l.status === "PENDING_MODERATION";
      case "REJECTED":
        return l.moderationStatus === "REJECTED" || l.status === "REJECTED";
      case "DRAFT":
        return l.moderationStatus === "DRAFT" || l.status === "DRAFT";
      case "PAUSED_SOLD":
        return l.status === "PAUSED" || l.status === "SOLD" || l.status === "DELISTED";
      default:
        return true;
    }
  });

  const countFor = (tab: TabKey) => {
    switch (tab) {
      case "ACTIVE":
        return listings.filter((l) => l.status === "ACTIVE" || l.status === "PUBLISHED").length;
      case "PENDING":
        return listings.filter(
          (l) => l.moderationStatus === "PENDING_REVIEW" || l.status === "PENDING_MODERATION",
        ).length;
      case "REJECTED":
        return listings.filter((l) => l.moderationStatus === "REJECTED" || l.status === "REJECTED")
          .length;
      case "DRAFT":
        return listings.filter((l) => l.moderationStatus === "DRAFT" || l.status === "DRAFT")
          .length;
      case "PAUSED_SOLD":
        return listings.filter(
          (l) => l.status === "PAUSED" || l.status === "SOLD" || l.status === "DELISTED",
        ).length;
      default:
        return listings.length;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex flex-col md:flex-row gap-10">
          <SellerSidebar active="listings" />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-display font-bold">My Inventory & Listings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your drafts, pending review queue, active units, and sales.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchListings}
                  disabled={loading}
                  className="gap-1.5 text-xs h-9"
                >
                  <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Link to="/sell">
                  <Button size="sm" className="gap-1.5 text-xs h-9">
                    <Plus className="size-3.5" />
                    Create Listing
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 border-b border-border pb-2 mb-6 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  activeTab === "ALL"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                All ({countFor("ALL")})
              </button>
              <button
                onClick={() => setActiveTab("ACTIVE")}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  activeTab === "ACTIVE"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Active & Public ({countFor("ACTIVE")})
              </button>
              <button
                onClick={() => setActiveTab("PENDING")}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  activeTab === "PENDING"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Under Review ({countFor("PENDING")})
              </button>
              <button
                onClick={() => setActiveTab("REJECTED")}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  activeTab === "REJECTED"
                    ? "bg-destructive text-destructive-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Revisions Needed ({countFor("REJECTED")})
              </button>
              <button
                onClick={() => setActiveTab("DRAFT")}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  activeTab === "DRAFT"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Drafts ({countFor("DRAFT")})
              </button>
              <button
                onClick={() => setActiveTab("PAUSED_SOLD")}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  activeTab === "PAUSED_SOLD"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Paused / Sold ({countFor("PAUSED_SOLD")})
              </button>
            </div>

            {loading ? (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground space-y-3">
                  <RefreshCw className="size-6 animate-spin mx-auto text-primary" />
                  <p className="text-sm font-medium">Loading your listings...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="py-8 text-center text-destructive space-y-2">
                  <AlertCircle className="size-6 mx-auto" />
                  <p className="text-sm font-medium">{error}</p>
                </CardContent>
              </Card>
            ) : filteredListings.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground space-y-3">
                  <FileText className="size-10 mx-auto text-muted-foreground/40" />
                  <p className="text-base font-semibold text-foreground">
                    No listings found in this tab
                  </p>
                  <p className="text-xs max-w-sm mx-auto">
                    {activeTab === "ALL"
                      ? "You have not created any listings yet. Click below to start selling!"
                      : "No listings currently match this filter criteria."}
                  </p>
                  <Link to="/sell" className="inline-block mt-2">
                    <Button size="sm" className="gap-1.5 text-xs">
                      <Plus className="size-3.5" />
                      Create New Listing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredListings.map((item) => {
                  const isBusy = actionInProgress[item.id];
                  const isRejected =
                    item.moderationStatus === "REJECTED" || item.status === "REJECTED";
                  const isActive = item.status === "ACTIVE" || item.status === "PUBLISHED";
                  const isPaused = item.status === "PAUSED";
                  const isDraft = item.moderationStatus === "DRAFT" || item.status === "DRAFT";

                  return (
                    <Card key={item.id} className="overflow-hidden border-border/80 shadow-sm">
                      <CardHeader className="bg-muted/30 py-3.5 px-6 flex flex-row items-center justify-between border-b border-border/40">
                        <div className="flex items-center gap-3">
                          <ListingStatusBadge
                            status={item.status}
                            moderationStatus={item.moderationStatus}
                          />
                          {item.category && (
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          )}
                          <span className="text-xs font-mono text-muted-foreground">
                            ID: {item.id}
                          </span>
                        </div>
                        <div className="font-display font-bold text-lg text-primary">
                          {taka(item.price)}
                        </div>
                      </CardHeader>

                      <CardContent className="p-6 space-y-4">
                        {/* Title & Grade row */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link
                              to="/listing/$listingId"
                              params={{ listingId: item.id }}
                              className="font-semibold text-base leading-tight hover:text-primary transition-colors block"
                            >
                              {item.productName}
                            </Link>
                            {item.sellerNote && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                {item.sellerNote}
                              </p>
                            )}
                          </div>
                          <GradeBadge grade={item.grade as Grade} />
                        </div>

                        {/* Rejection Feedback Box */}
                        {isRejected && item.rejectionReasonText && (
                          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-xs space-y-2">
                            <div className="flex items-center gap-2 text-destructive font-semibold">
                              <AlertCircle className="size-4" />
                              <span>Moderation Feedback & Required Fixes</span>
                              {item.rejectionReasonCode && (
                                <Badge variant="outline" className="text-[10px] bg-background">
                                  {item.rejectionReasonCode}
                                </Badge>
                              )}
                            </div>
                            <p className="text-destructive/90 pl-6 leading-relaxed">
                              {item.rejectionReasonText}
                            </p>
                          </div>
                        )}

                        {/* Key Specs Pills */}
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground border-t border-border/40 pt-3">
                          <span className="bg-muted px-2 py-0.5 rounded">
                            Score {item.conditionScore}/100
                          </span>
                          <span className="bg-muted px-2 py-0.5 rounded">
                            {item.warrantyMonths > 0
                              ? `${item.warrantyMonths}m Warranty`
                              : "No Warranty"}
                          </span>
                          <span className="bg-muted px-2 py-0.5 rounded">
                            {item.accessories || "Device only"}
                          </span>
                          {item.batteryHealth && (
                            <span className="bg-muted px-2 py-0.5 rounded">
                              {item.batteryHealth}% Battery
                            </span>
                          )}
                        </div>

                        {/* Actions bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-border/40 gap-3">
                          <div className="flex items-center gap-2">
                            {token && (
                              <AuditHistorySheet
                                listingId={item.id}
                                productName={item.productName}
                                token={token}
                              />
                            )}
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {/* Draft or Rejected: Edit & Resubmit */}
                            {(isDraft || isRejected) && (
                              <Button
                                size="sm"
                                variant={isRejected ? "default" : "outline"}
                                onClick={() =>
                                  navigate({ to: "/sell", search: { editId: item.id } })
                                }
                                className="h-8 gap-1.5 text-xs font-semibold"
                              >
                                <Edit3 className="size-3.5" />
                                {isRejected ? "Edit & Resubmit" : "Continue Editing Draft"}
                              </Button>
                            )}

                            {/* Active: Pause button */}
                            {isActive && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleAvailability(item.id, "PAUSE")}
                                disabled={isBusy}
                                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                              >
                                <Pause className="size-3.5" />
                                Pause Listing
                              </Button>
                            )}

                            {/* Paused: Resume button */}
                            {isPaused && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleAvailability(item.id, "RESUME")}
                                disabled={isBusy}
                                className="h-8 gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 border-emerald-500/30"
                              >
                                <Play className="size-3.5" />
                                Resume Listing
                              </Button>
                            )}

                            {/* Active / Paused: Delist */}
                            {(isActive || isPaused) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Are you sure you want to delist this item permanently?",
                                    )
                                  ) {
                                    handleToggleAvailability(item.id, "DELIST");
                                  }
                                }}
                                disabled={isBusy}
                                className="h-8 gap-1 text-xs text-muted-foreground hover:text-destructive"
                              >
                                <Ban className="size-3.5" />
                                Delist
                              </Button>
                            )}
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
      </div>
    </ProtectedRoute>
  );
}
