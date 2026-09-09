import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Shield,
  PackageSearch,
  Package,
  TrendingUp,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  XCircle,
  Activity,
  ShoppingCart,
  Layers,
  MapPin,
  Users,
  Info,
  ArrowUpDown,
  ShoppingBag,
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAuth } from "@/lib/auth-store";
import {
  getAdminDashboardMetricsFn,
  getAdminGeographicAnalyticsFn,
  type GeoTimeRange,
  type GeographicAnalyticsResult,
} from "@/lib/server-functions";
import { taka } from "@/data/catalog";
import { BangladeshAdminMap } from "@/components/bangladesh-map";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Marketplace Overview | Admin Console | Resale.com" }],
  }),
  component: AdminDashboardPage,
});

interface AuditItem {
  id: string;
  listingId: string;
  action: string;
  actorRole: string;
  previousStatus: string | null;
  newStatus: string;
  reasonText: string | null;
  createdAt: string;
}

interface RecentOrderItem {
  id: string;
  status: string;
  amountBDT: number;
  district: string;
  createdAt: string;
}

interface DashboardMetrics {
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

export function AdminDashboardPage() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // Geographic Analytics State
  const [geoTab, setGeoTab] = useState<"sales" | "users">("sales");
  const [geoTimeRange, setGeoTimeRange] = useState<GeoTimeRange>("all");
  const [geoSortBy, setGeoSortBy] = useState<"orders" | "sales">("orders");
  const [geoData, setGeoData] = useState<GeographicAnalyticsResult | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // Fetch primary dashboard metrics
  const fetchMetrics = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminDashboardMetricsFn({ data: { token } });
      if (res.success && res.data) {
        setMetrics(res.data as DashboardMetrics);
      } else {
        setError(res.error || "Failed to load admin metrics.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Error connecting to telemetry service.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch geographic analytics
  const fetchGeoAnalytics = useCallback(
    async (timeRange: GeoTimeRange) => {
      if (!token) return;
      try {
        setGeoLoading(true);
        const res = await getAdminGeographicAnalyticsFn({ data: { token, timeRange } });
        if (res.success && res.data) {
          setGeoData(res.data);
        }
      } catch (err) {
        console.warn("Failed to fetch geographic analytics:", err);
      } finally {
        setGeoLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    fetchMetrics();
    fetchGeoAnalytics(geoTimeRange);
  }, [fetchMetrics, fetchGeoAnalytics, geoTimeRange]);

  const handleRefreshAll = () => {
    fetchMetrics();
    fetchGeoAnalytics(geoTimeRange);
  };

  // Derive Attention Items strictly from recorded data
  const attentionItems = useMemo(() => {
    if (!metrics) return [];
    const items: Array<{
      id: string;
      title: string;
      description: string;
      badge: string;
      badgeVariant: "warning" | "destructive" | "default" | "outline";
      href: string;
      actionText: string;
    }> = [];

    // 1. Pending Moderation Queue
    if (metrics.pendingModerationCount > 0) {
      items.push({
        id: "moderation",
        title: `${metrics.pendingModerationCount} listing${metrics.pendingModerationCount > 1 ? "s" : ""} awaiting review`,
        description:
          "Seller-submitted inventory pending 32-point inspection check & catalog approval.",
        badge: "Requires Action",
        badgeVariant: "warning",
        href: "/admin/moderation",
        actionText: "Open Moderation Queue",
      });
    }

    // 2. Unresolved Disputes
    const disputesCount = metrics.openDisputesCount || 0;
    if (disputesCount > 0) {
      items.push({
        id: "disputes",
        title: `${disputesCount} unresolved customer dispute${disputesCount > 1 ? "s" : ""}`,
        description:
          "Open mediation claims between buyers and sellers requiring administrative review.",
        badge: "High Priority",
        badgeVariant: "destructive",
        href: "/admin/disputes",
        actionText: "Mediate Disputes",
      });
    }

    // 3. Orders requiring fulfillment attention
    const orderBreakdown = metrics.orderStatusBreakdown || {};
    const placedOrProcessing =
      (orderBreakdown["PLACED"] || 0) +
      (orderBreakdown["PENDING"] || 0) +
      (orderBreakdown["PROCESSING"] || 0);

    if (placedOrProcessing > 0) {
      items.push({
        id: "orders",
        title: `${placedOrProcessing} order${placedOrProcessing > 1 ? "s" : ""} in processing pipeline`,
        description: "Transactions awaiting merchant fulfillment, packaging, or courier handoff.",
        badge: "In Progress",
        badgeVariant: "default",
        href: "/admin/orders",
        actionText: "Inspect Orders",
      });
    }

    // 4. Unverified Sellers
    const unverifiedSellers = metrics.unverifiedSellersCount || 0;
    if (unverifiedSellers > 0) {
      items.push({
        id: "sellers",
        title: `${unverifiedSellers} seller${unverifiedSellers > 1 ? "s" : ""} awaiting trust verification`,
        description: "Merchant profiles pending identity and store document validation.",
        badge: "Verification",
        badgeVariant: "outline",
        href: "/admin/identity",
        actionText: "Review Sellers",
      });
    }

    return items;
  }, [metrics]);

  // Activity Feed: Prioritize governance events over seed ingestions
  const prioritizedActivity = useMemo(() => {
    if (!metrics || !metrics.recentAuditFeed) return [];
    const feed = [...metrics.recentAuditFeed];
    const liveEvents = feed.filter((i) => i.action !== "SEED_INGESTED");
    const seedEvents = feed.filter((i) => i.action === "SEED_INGESTED");
    return [...liveEvents, ...seedEvents];
  }, [metrics]);

  const compactActivity = useMemo(() => {
    return prioritizedActivity.slice(0, 5);
  }, [prioritizedActivity]);

  // Sorted District rows for Geographic Performance
  const sortedDistricts = useMemo(() => {
    if (!geoData || !geoData.districts) return [];
    const list = [...geoData.districts];
    if (geoSortBy === "sales") {
      return list.sort((a, b) => b.settledSalesBDT - a.settledSalesBDT);
    }
    return list.sort((a, b) => b.orders - a.orders);
  }, [geoData, geoSortBy]);

  const timeRangeLabels: Record<GeoTimeRange, string> = {
    today: "Today",
    "7d": "7 Days",
    "30d": "30 Days",
    "90d": "90 Days",
    this_year: "This Year",
    all: "All Time",
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell active="dashboard">
        <div className="space-y-8">
          {/* 1. Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
                Marketplace Overview
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Monitor listings, orders, sellers, and platform activity.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {metrics && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border/60">
                  <Database className="size-3.5 text-primary" />
                  <span className="font-mono text-[11px]">
                    {metrics.dataSource === "SUPABASE_POSTGRESQL"
                      ? "Supabase PostgreSQL"
                      : "Local Store"}
                  </span>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshAll}
                disabled={loading || geoLoading}
                className="h-8 gap-1.5 text-xs border-border/70 hover:bg-muted/60"
              >
                <RefreshCw className={`size-3.5 ${loading || geoLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <Loader />
              <p className="text-xs text-muted-foreground font-mono">
                Connecting to marketplace telemetry...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center space-y-3">
              <AlertTriangle className="size-8 text-destructive mx-auto" />
              <p className="text-sm font-medium text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchMetrics} className="text-xs">
                Retry Query
              </Button>
            </div>
          ) : metrics ? (
            <>
              {/* 2. Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Listings */}
                <div className="bg-card rounded-xl border border-border/60 p-5 space-y-3 hover:border-border transition-colors">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Active Listings
                    </span>
                    <PackageSearch className="size-4 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold font-display text-foreground tracking-tight">
                      {metrics.activeListingsCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Published &amp; verified in catalog
                    </p>
                  </div>
                  <div className="pt-1">
                    <Link
                      to="/admin/listings"
                      className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View inventory <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>

                {/* Pending Moderation */}
                <div className="bg-card rounded-xl border border-border/60 p-5 space-y-3 hover:border-border transition-colors">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Pending Moderation
                    </span>
                    <Shield
                      className={`size-4 ${
                        metrics.pendingModerationCount > 0 ? "text-amber-500" : "text-emerald-500"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold font-display text-foreground tracking-tight">
                      {metrics.pendingModerationCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metrics.pendingModerationCount === 0
                        ? "Review queue is clear"
                        : `${metrics.pendingModerationCount} awaiting inspection check`}
                    </p>
                  </div>
                  <div className="pt-1">
                    <Link
                      to="/admin/moderation"
                      className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Open queue <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-card rounded-xl border border-border/60 p-5 space-y-3 hover:border-border transition-colors">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Total Orders
                    </span>
                    <Package className="size-4 text-foreground/70" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold font-display text-foreground tracking-tight">
                      {metrics.totalOrdersCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Recorded buyer transactions</p>
                  </div>
                  <div className="pt-1">
                    <Link
                      to="/admin/orders"
                      className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Manage orders <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>

                {/* Settled GMV */}
                <div className="bg-card rounded-xl border border-border/60 p-5 space-y-3 hover:border-border transition-colors">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Settled GMV
                    </span>
                    <TrendingUp className="size-4 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold font-display text-foreground tracking-tight">
                      {taka(metrics.settledGmvBDT)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Delivered &amp; completed orders
                    </p>
                  </div>
                  <div className="pt-1">
                    <Link
                      to="/admin/payments"
                      className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Payment audit <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* 3. Needs Attention */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-primary" />
                    <h2 className="text-base font-bold font-display text-foreground">
                      Needs Attention
                    </h2>
                  </div>
                  {attentionItems.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {attentionItems.length} actionable item
                      {attentionItems.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {attentionItems.length === 0 ? (
                  <div className="bg-card rounded-xl border border-border/60 p-6 flex items-center gap-4">
                    <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="size-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Everything is up to date.
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        No listings awaiting moderation, no unresolved customer disputes, and order
                        queues are operational.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {attentionItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-card rounded-xl border border-border/60 p-4 flex flex-col justify-between gap-3 hover:border-border transition-colors"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-xs font-semibold text-foreground line-clamp-1">
                              {item.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 font-medium shrink-0 ${
                                item.badgeVariant === "destructive"
                                  ? "bg-red-500/10 text-red-600 border-red-500/20"
                                  : item.badgeVariant === "warning"
                                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    : "bg-muted text-muted-foreground border-border/70"
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <div>
                          <Link
                            to={item.href}
                            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {item.actionText} <ArrowRight className="size-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Marketplace Health (Balanced Two-Column) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Order Activity */}
                <div className="bg-card rounded-xl border border-border/60 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div>
                      <h2 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                        <ShoppingCart className="size-4 text-blue-500" />
                        Order Activity
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Actual lifecycle distribution across recorded orders
                      </p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-foreground bg-muted px-2 py-0.5 rounded">
                      {metrics.totalOrdersCount} Total
                    </span>
                  </div>

                  {Object.keys(metrics.orderStatusBreakdown).length === 0 ? (
                    <p className="text-xs text-muted-foreground py-6 text-center">
                      No order lifecycle events recorded yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {/* Segmented bar */}
                      <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden flex">
                        {Object.entries(metrics.orderStatusBreakdown).map(([status, count], i) => {
                          const pct =
                            metrics.totalOrdersCount > 0
                              ? (count / metrics.totalOrdersCount) * 100
                              : 0;
                          const colors = [
                            "bg-emerald-500",
                            "bg-blue-500",
                            "bg-indigo-500",
                            "bg-amber-500",
                            "bg-zinc-400",
                            "bg-red-400",
                          ];
                          return (
                            <div
                              key={status}
                              style={{ width: `${pct}%` }}
                              title={`${status}: ${count} (${Math.round(pct)}%)`}
                              className={`${colors[i % colors.length]} h-full transition-all`}
                            />
                          );
                        })}
                      </div>

                      {/* Status Rows */}
                      <div className="divide-y divide-border/40 pt-1">
                        {Object.entries(metrics.orderStatusBreakdown).map(([status, count]) => {
                          const pct =
                            metrics.totalOrdersCount > 0
                              ? Math.round((count / metrics.totalOrdersCount) * 100)
                              : 0;
                          return (
                            <div
                              key={status}
                              className="py-2 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-foreground font-medium">
                                  {status}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-muted-foreground font-mono">
                                  {pct}%
                                </span>
                                <span className="text-xs font-bold font-mono text-foreground min-w-8 text-right">
                                  {count}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Listing Health */}
                <div className="bg-card rounded-xl border border-border/60 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div>
                      <h2 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                        <Layers className="size-4 text-emerald-500" />
                        Listing Health
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Inventory distribution across moderation &amp; catalog states
                      </p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-foreground bg-muted px-2 py-0.5 rounded">
                      {Object.values(metrics.listingStatusBreakdown || {}).reduce(
                        (a, b) => a + b,
                        0,
                      ) || metrics.activeListingsCount}{" "}
                      Total
                    </span>
                  </div>

                  {metrics.listingStatusBreakdown &&
                  Object.keys(metrics.listingStatusBreakdown).length > 0 ? (
                    <div className="space-y-3">
                      {/* Segmented bar */}
                      {(() => {
                        const totalListings = Object.values(metrics.listingStatusBreakdown).reduce(
                          (a, b) => a + b,
                          0,
                        );
                        return (
                          <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden flex">
                            {Object.entries(metrics.listingStatusBreakdown).map(
                              ([status, count], i) => {
                                const pct = totalListings > 0 ? (count / totalListings) * 100 : 0;
                                const colors = [
                                  "bg-emerald-500",
                                  "bg-amber-500",
                                  "bg-blue-500",
                                  "bg-violet-500",
                                  "bg-red-400",
                                ];
                                return (
                                  <div
                                    key={status}
                                    style={{ width: `${pct}%` }}
                                    title={`${status}: ${count} (${Math.round(pct)}%)`}
                                    className={`${colors[i % colors.length]} h-full transition-all`}
                                  />
                                );
                              },
                            )}
                          </div>
                        );
                      })()}

                      {/* Status rows */}
                      <div className="divide-y divide-border/40 pt-1">
                        {(() => {
                          const totalListings = Object.values(
                            metrics.listingStatusBreakdown,
                          ).reduce((a, b) => a + b, 0);
                          return Object.entries(metrics.listingStatusBreakdown).map(
                            ([status, count]) => {
                              const pct =
                                totalListings > 0 ? Math.round((count / totalListings) * 100) : 0;
                              return (
                                <div
                                  key={status}
                                  className="py-2 flex items-center justify-between text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[11px] text-foreground font-medium">
                                      {status.replace("_", " ")}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-[11px] text-muted-foreground font-mono">
                                      {pct}%
                                    </span>
                                    <span className="text-xs font-bold font-mono text-foreground min-w-8 text-right">
                                      {count}
                                    </span>
                                  </div>
                                </div>
                              );
                            },
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="divide-y divide-border/40">
                        <div className="py-2 flex items-center justify-between text-xs">
                          <span className="font-mono text-[11px] text-foreground font-medium">
                            ACTIVE / APPROVED
                          </span>
                          <span className="font-bold font-mono text-foreground">
                            {metrics.activeListingsCount}
                          </span>
                        </div>
                        <div className="py-2 flex items-center justify-between text-xs">
                          <span className="font-mono text-[11px] text-foreground font-medium">
                            PENDING REVIEW
                          </span>
                          <span className="font-bold font-mono text-foreground">
                            {metrics.pendingModerationCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Geographic Performance Section */}
              <div className="bg-card rounded-xl border border-border/60 p-5 space-y-5">
                {/* Section Header with Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      <h2 className="text-base font-bold font-display text-foreground">
                        Geographic Performance
                      </h2>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Real recorded district-level sales volume and regional user distribution
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Sales | Users Mode Toggle */}
                    <div className="inline-flex rounded-lg border border-border/70 p-0.5 bg-muted/40 text-xs">
                      <button
                        type="button"
                        onClick={() => setGeoTab("sales")}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                          geoTab === "sales"
                            ? "bg-background text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Sales
                      </button>
                      <button
                        type="button"
                        onClick={() => setGeoTab("users")}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                          geoTab === "users"
                            ? "bg-background text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Users
                      </button>
                    </div>

                    {/* Time Filter */}
                    <div className="flex items-center rounded-lg border border-border/70 p-0.5 bg-muted/40 text-[11px]">
                      {(["today", "7d", "30d", "90d", "this_year", "all"] as GeoTimeRange[]).map(
                        (t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setGeoTimeRange(t)}
                            className={`px-2 py-1 rounded-md transition-colors ${
                              geoTimeRange === t
                                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {timeRangeLabels[t]}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Content Area: Sales vs Users Mode */}
                {geoLoading ? (
                  <div className="py-12 flex items-center justify-center">
                    <Loader label="Loading geographic analytics..." />
                  </div>
                ) : geoTab === "sales" ? (
                  /* ─── SALES MODE ─── */
                  <div className="space-y-4">
                    {/* Map + Table side-by-side on lg, stacked on mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      {/* Bangladesh Map */}
                      <div className="lg:col-span-4 flex flex-col">
                        <span className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                          Division Activity
                        </span>
                        <div className="flex-1 flex items-start justify-center">
                          <BangladeshAdminMap
                            districts={geoData?.districts ?? []}
                            mode={geoSortBy === "sales" ? "sales" : "orders"}
                            formatBDT={taka}
                          />
                        </div>
                      </div>

                      {/* Table */}
                      <div className="lg:col-span-8 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-foreground">
                              Top Selling Districts
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Total Period Volume:{" "}
                              <strong className="text-foreground">
                                {taka(geoData?.totalSettledSalesBDT ?? 0)}
                              </strong>{" "}
                              ({geoData?.totalOrders ?? 0} orders)
                            </span>
                          </div>

                          {/* Sort Toggle */}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <ArrowUpDown className="size-3" />
                            <span>Sort by:</span>
                            <button
                              type="button"
                              onClick={() => setGeoSortBy("orders")}
                              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                                geoSortBy === "orders"
                                  ? "bg-muted text-foreground font-semibold"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              Orders
                            </button>
                            <span className="text-muted-foreground/40">|</span>
                            <button
                              type="button"
                              onClick={() => setGeoSortBy("sales")}
                              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                                geoSortBy === "sales"
                                  ? "bg-muted text-foreground font-semibold"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              Settled Sales
                            </button>
                          </div>
                        </div>

                        {sortedDistricts.length === 0 ? (
                          <div className="py-10 text-center text-xs text-muted-foreground">
                            No recorded transactions in this time period.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                                  <th className="text-left py-2.5 px-3 w-16">Rank</th>
                                  <th className="text-left py-2.5 px-3">District</th>
                                  <th className="text-right py-2.5 px-3">Orders</th>
                                  <th className="text-right py-2.5 px-3">Settled Sales</th>
                                  <th className="text-right py-2.5 px-3 w-40">Share of Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/40">
                                {sortedDistricts.map((item, idx) => {
                                  const sharePct =
                                    geoSortBy === "sales"
                                      ? item.salesSharePct
                                      : item.ordersSharePct;
                                  return (
                                    <tr
                                      key={item.district}
                                      className="hover:bg-muted/30 transition-colors"
                                    >
                                      <td className="py-2.5 px-3 font-mono font-medium text-muted-foreground">
                                        #{idx + 1}
                                      </td>
                                      <td className="py-2.5 px-3 font-medium text-foreground">
                                        <div className="flex items-center gap-2">
                                          <span>{item.district}</span>
                                          {item.isUnknown && (
                                            <Badge
                                              variant="outline"
                                              className="text-[9px] px-1.5 py-0 bg-muted/60 text-muted-foreground border-border"
                                            >
                                              Not Recorded
                                            </Badge>
                                          )}
                                        </div>
                                      </td>
                                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-foreground">
                                        {item.orders.toLocaleString()}
                                      </td>
                                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600">
                                        {taka(item.settledSalesBDT)}
                                      </td>
                                      <td className="py-2.5 px-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden hidden sm:block">
                                            <div
                                              className="h-full bg-primary rounded-full transition-all"
                                              style={{ width: `${Math.min(100, sharePct)}%` }}
                                            />
                                          </div>
                                          <span className="font-mono text-muted-foreground text-[11px] min-w-10 text-right">
                                            {sharePct}%
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                      {/* end table col */}
                    </div>
                    {/* end map+table grid */}
                  </div>
                ) : (
                  /* ─── USERS MODE (Transparent Unavailability Statement) ─── */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">
                        Top User Districts
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {geoTimeRange === "all"
                          ? `Total Registered Users: ${geoData?.userAnalytics.totalUsers ?? 0}`
                          : `New Users (${timeRangeLabels[geoTimeRange]}): ${geoData?.userAnalytics.newUsersInPeriod ?? 0}`}
                      </span>
                    </div>

                    <div className="bg-muted/30 border border-border/60 rounded-xl p-6 text-center space-y-3">
                      <div className="size-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                        <Users className="size-5" />
                      </div>
                      <div className="space-y-1 max-w-md mx-auto">
                        <h3 className="text-sm font-bold text-foreground">
                          District-level user analytics unavailable
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          The current user registry stores credentials and role authorizations
                          without requiring a normalized district attribute. Per platform Data-Truth
                          guidelines, user locations are not inferred from IP addresses or telecom
                          codes.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1.5">
                          <Info className="size-3 text-primary" />
                          <span>District telemetry is sourced from verified order delivery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Recent Orders Section */}
              <div className="bg-card rounded-xl border border-border/60 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <h2 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                      <ShoppingBag className="size-4 text-primary" />
                      Recent Orders
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Latest customer transactions recorded across the marketplace
                    </p>
                  </div>
                  <Link
                    to="/admin/orders"
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View all orders <ArrowRight className="size-3" />
                  </Link>
                </div>

                {!metrics.recentOrders || metrics.recentOrders.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-8">
                    No orders recorded yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                          <th className="text-left py-2 px-3">Order ID</th>
                          <th className="text-left py-2 px-3">Date</th>
                          <th className="text-left py-2 px-3">District</th>
                          <th className="text-right py-2 px-3">Amount</th>
                          <th className="text-right py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {metrics.recentOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-medium text-foreground">
                              {ord.id}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground font-mono text-[11px]">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2.5 px-3 text-foreground font-medium">
                              {ord.district}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-foreground">
                              {taka(ord.amountBDT)}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 font-medium ${
                                  ord.status === "DELIVERED" || ord.status === "COMPLETED"
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : ord.status === "CANCELLED"
                                      ? "bg-red-500/10 text-red-600 border-red-500/20"
                                      : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                }`}
                              >
                                {ord.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 7. Recent Activity Feed */}
              <div className="bg-card rounded-xl border border-border/60 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <h2 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                      <Clock className="size-4 text-primary" />
                      Recent Activity
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Prioritized governance and lifecycle event telemetry
                    </p>
                  </div>

                  {/* View Full Audit History Dialog */}
                  <Dialog open={auditModalOpen} onOpenChange={setAuditModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1 border-border/70 hover:bg-muted/60"
                      >
                        <span>View full audit history</span>
                        <ArrowRight className="size-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                      <DialogHeader className="pb-3 border-b border-border/40">
                        <DialogTitle className="text-base font-bold font-display">
                          Full Platform Audit History
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                          Recorded event log of listing approvals, rejections, submissions, and
                          lifecycle transitions.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="overflow-y-auto flex-1 divide-y divide-border/40 pr-2">
                        {prioritizedActivity.length === 0 ? (
                          <p className="py-8 text-center text-xs text-muted-foreground">
                            No audit history entries recorded.
                          </p>
                        ) : (
                          prioritizedActivity.map((item) => (
                            <div key={item.id} className="py-3 text-xs space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] px-1.5 py-0 font-medium ${
                                      item.action === "APPROVED"
                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                        : item.action === "REJECTED"
                                          ? "bg-red-500/10 text-red-600 border-red-500/20"
                                          : item.action === "SUBMITTED"
                                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {item.action}
                                  </Badge>
                                  <span className="font-mono text-foreground font-medium">
                                    Listing #{item.listingId}
                                  </span>
                                  <span className="text-muted-foreground text-[11px]">
                                    by {item.actorRole}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  {new Date(item.createdAt).toLocaleString()}
                                </span>
                              </div>
                              {item.reasonText && (
                                <p className="text-[11px] text-muted-foreground italic pl-1">
                                  &ldquo;{item.reasonText}&rdquo;
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {compactActivity.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-8">
                    No administrative activity recorded yet.
                  </p>
                ) : (
                  <div className="divide-y divide-border/40">
                    {compactActivity.map((item) => {
                      const isSeed = item.action === "SEED_INGESTED";
                      return (
                        <div
                          key={item.id}
                          className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-start sm:items-center gap-3 min-w-0">
                            <div className="mt-0.5 sm:mt-0">
                              {item.action === "APPROVED" ? (
                                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                              ) : item.action === "REJECTED" ? (
                                <XCircle className="size-4 text-red-500 shrink-0" />
                              ) : item.action === "SUBMITTED" ? (
                                <Clock className="size-4 text-blue-500 shrink-0" />
                              ) : (
                                <Package className="size-4 text-muted-foreground shrink-0" />
                              )}
                            </div>

                            <div className="space-y-0.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-semibold text-foreground">
                                  Listing #{item.listingId}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-1.5 py-0 font-medium ${
                                    item.action === "APPROVED"
                                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                      : item.action === "REJECTED"
                                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                                        : item.action === "SUBMITTED"
                                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                          : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {item.action.replace("_", " ")}
                                </Badge>
                                {isSeed && (
                                  <span className="text-[9px] font-mono text-muted-foreground/60 bg-muted px-1 rounded">
                                    SEED
                                  </span>
                                )}
                                <span className="text-muted-foreground text-[11px]">
                                  by {item.actorRole}
                                </span>
                              </div>

                              {item.reasonText && (
                                <p className="text-[11px] text-muted-foreground italic truncate max-w-md">
                                  &ldquo;{item.reasonText}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-[11px] text-muted-foreground font-mono shrink-0 pl-7 sm:pl-0">
                            {new Date(item.createdAt).toLocaleDateString()}{" "}
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}
