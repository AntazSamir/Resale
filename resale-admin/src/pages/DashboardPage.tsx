import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  PackageSearch,
  Package,
  TrendingUp,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ArrowRight,
  MapPin,
  ArrowUpDown,
} from "lucide-react";
import {
  adminApi,
  type DashboardMetrics,
  type GeographicData,
  type GeoTimeRange,
} from "@/lib/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Loader } from "@/components/ui";
import { taka, timeAgo } from "@/lib/utils";

export function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [geoTimeRange, setGeoTimeRange] = useState<GeoTimeRange>("all");
  const [geoSortBy, setGeoSortBy] = useState<"orders" | "sales">("orders");
  const [geoData, setGeoData] = useState<GeographicData | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getDashboard();
      if (res.success && res.data) {
        setMetrics(res.data);
      } else {
        setError(res.error ?? "Failed to load admin metrics.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Error connecting to telemetry service.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGeoAnalytics = useCallback(async (timeRange: GeoTimeRange) => {
    try {
      setGeoLoading(true);
      const res = await adminApi.getGeography(timeRange);
      if (res.success && res.data) setGeoData(res.data);
    } catch {
      // non-fatal
    } finally {
      setGeoLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMetrics();
    void fetchGeoAnalytics(geoTimeRange);
  }, [fetchMetrics, fetchGeoAnalytics, geoTimeRange]);

  const attentionItems = useMemo(() => {
    if (!metrics) return [];
    const items: Array<{
      id: string;
      title: string;
      description: string;
      badge: string;
      badgeVariant: "warning" | "destructive" | "default";
      href: string;
      actionText: string;
    }> = [];

    if (metrics.pendingModerationCount > 0) {
      items.push({
        id: "moderation",
        title: `${metrics.pendingModerationCount} listing${metrics.pendingModerationCount > 1 ? "s" : ""} awaiting review`,
        description:
          "Seller-submitted inventory pending 32-point inspection check & catalog approval.",
        badge: "Requires Action",
        badgeVariant: "warning",
        href: "/moderation",
        actionText: "Open Moderation Queue",
      });
    }

    const disputesCount = metrics.openDisputesCount ?? 0;
    if (disputesCount > 0) {
      items.push({
        id: "disputes",
        title: `${disputesCount} unresolved customer dispute${disputesCount > 1 ? "s" : ""}`,
        description:
          "Open mediation claims between buyers and sellers requiring administrative review.",
        badge: "High Priority",
        badgeVariant: "destructive",
        href: "/disputes",
        actionText: "Mediate Disputes",
      });
    }

    const orderBreakdown = metrics.orderStatusBreakdown ?? {};
    const placedOrProcessing =
      (orderBreakdown["PLACED"] ?? 0) +
      (orderBreakdown["PENDING"] ?? 0) +
      (orderBreakdown["PROCESSING"] ?? 0);
    if (placedOrProcessing > 0) {
      items.push({
        id: "orders",
        title: `${placedOrProcessing} order${placedOrProcessing > 1 ? "s" : ""} in processing pipeline`,
        description: "Transactions awaiting merchant fulfillment, packaging, or courier handoff.",
        badge: "In Progress",
        badgeVariant: "default",
        href: "/orders",
        actionText: "Inspect Orders",
      });
    }

    const unverifiedSellers = metrics.unverifiedSellersCount ?? 0;
    if (unverifiedSellers > 0) {
      items.push({
        id: "sellers",
        title: `${unverifiedSellers} seller${unverifiedSellers > 1 ? "s" : ""} awaiting trust verification`,
        description: "Merchant profiles pending identity and store document validation.",
        badge: "Verification",
        badgeVariant: "default",
        href: "/identity",
        actionText: "Review Sellers",
      });
    }

    return items;
  }, [metrics]);

  const sortedDistricts = useMemo(() => {
    if (!geoData?.districts) return [];
    return [...geoData.districts].sort((a, b) =>
      geoSortBy === "sales" ? b.settledSalesBDT - a.settledSalesBDT : b.orders - a.orders,
    );
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
    <div className="space-y-8">
      {/* Header */}
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
            onClick={() => {
              void fetchMetrics();
              void fetchGeoAnalytics(geoTimeRange);
            }}
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchMetrics()}
            className="text-xs"
          >
            Retry Query
          </Button>
        </div>
      ) : metrics ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Active Listings",
                value: metrics.activeListingsCount.toLocaleString(),
                sub: "Published & verified in catalog",
                href: "/listings",
                linkText: "View inventory",
                icon: <PackageSearch className="size-4 text-blue-500" />,
              },
              {
                label: "Pending Moderation",
                value: metrics.pendingModerationCount.toLocaleString(),
                sub:
                  metrics.pendingModerationCount === 0
                    ? "Review queue is clear"
                    : `${metrics.pendingModerationCount} awaiting inspection`,
                href: "/moderation",
                linkText: "Open queue",
                icon: (
                  <Shield
                    className={`size-4 ${metrics.pendingModerationCount > 0 ? "text-amber-500" : "text-emerald-500"}`}
                  />
                ),
              },
              {
                label: "Total Orders",
                value: metrics.totalOrdersCount.toLocaleString(),
                sub: "Recorded buyer transactions",
                href: "/orders",
                linkText: "Manage orders",
                icon: <Package className="size-4 text-foreground/70" />,
              },
              {
                label: "Settled GMV",
                value: taka(metrics.settledGmvBDT),
                sub: "Delivered & completed orders",
                href: "/payments",
                linkText: "Payment audit",
                icon: <TrendingUp className="size-4 text-emerald-600" />,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-card rounded-xl border border-border/60 p-5 space-y-3 hover:border-border transition-colors"
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium uppercase tracking-wider">{card.label}</span>
                  {card.icon}
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold font-display text-foreground tracking-tight">
                    {card.value}
                  </div>
                  <p className="text-xs text-muted-foreground">{card.sub}</p>
                </div>
                <div className="pt-1">
                  <Link
                    to={card.href}
                    className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {card.linkText} <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Needs Attention */}
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
                  {attentionItems.length} actionable item{attentionItems.length > 1 ? "s" : ""}
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
                          variant={
                            item.badgeVariant === "destructive"
                              ? "destructive"
                              : item.badgeVariant === "warning"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {item.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <Link
                      to={item.href}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {item.actionText} <ArrowRight className="size-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom section: Order Status + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Status Breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Package className="size-4 text-muted-foreground" /> Order Status Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(metrics.orderStatusBreakdown ?? {})
                  .sort(([, a], [, b]) => b - a)
                  .map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-mono">{status}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                {Object.keys(metrics.orderStatusBreakdown ?? {}).length === 0 && (
                  <p className="text-xs text-muted-foreground py-4 text-center">No order data.</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Audit Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="size-4 text-muted-foreground" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {metrics.recentAuditFeed.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <span className="font-mono text-foreground/80">{item.action}</span>
                      {item.reasonText && (
                        <span className="text-muted-foreground truncate block">
                          {item.reasonText}
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground shrink-0 font-mono">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                ))}
                {metrics.recentAuditFeed.length === 0 && (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    No recent activity.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Geographic Analytics */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <h2 className="text-base font-bold font-display text-foreground">
                  Geographic Performance
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  {(Object.keys(timeRangeLabels) as GeoTimeRange[]).map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setGeoTimeRange(range)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        geoTimeRange === range
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      {timeRangeLabels[range]}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setGeoSortBy((s) => (s === "orders" ? "sales" : "orders"))}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/60"
                >
                  <ArrowUpDown className="size-3" />
                  Sort: {geoSortBy === "orders" ? "Orders" : "Sales"}
                </button>
              </div>
            </div>

            {geoLoading ? (
              <div className="py-8 flex items-center justify-center">
                <Loader label="Loading geographic data..." />
              </div>
            ) : sortedDistricts.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/60 bg-muted/30">
                          <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                            District
                          </th>
                          <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                            Orders
                          </th>
                          <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                            Settled Sales
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedDistricts.slice(0, 10).map((d, i) => (
                          <tr
                            key={d.district}
                            className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                          >
                            <td className="px-4 py-2.5 font-medium text-foreground">
                              {d.district}
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono">{d.orders}</td>
                            <td className="px-4 py-2.5 text-right font-mono text-emerald-600">
                              {taka(d.settledSalesBDT)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground text-xs">
                  No geographic data for selected time range.
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
