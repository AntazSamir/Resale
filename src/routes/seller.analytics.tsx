import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { SellerSidebar } from "./seller.dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import { getSellerAnalyticsFn, type SellerAnalyticsData } from "@/lib/server-functions";
import { taka, type Grade } from "@/data/catalog";
import { GradeBadge } from "@/components/grade-badge";
import {
  Eye,
  ShoppingCart,
  Heart,
  Package,
  Wallet,
  Percent,
  Clock,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Search,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/seller/analytics")({
  head: () => ({
    meta: [
      { title: "Seller Analytics Intelligence | Resale.com" },
      {
        name: "description",
        content:
          "Evidence-based seller performance metrics derived strictly from actual recorded Resale data.",
      },
    ],
  }),
  component: SellerAnalyticsPage,
});

function SellerAnalyticsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<SellerAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadAnalytics = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getSellerAnalyticsFn({ data: { token } });
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error || "Unable to load analytics. Please try again.");
      }
    } catch (err: unknown) {
      const msg = (err as Error)?.message || String(err);
      setError(msg || "Unable to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Filter listings by search query
  const filteredListings = useMemo(() => {
    if (!data || !data.listings) return [];
    if (!searchQuery.trim()) return data.listings;
    const q = searchQuery.toLowerCase();
    return data.listings.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.brand.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.listingId.toLowerCase().includes(q),
    );
  }, [data, searchQuery]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />

        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-5 py-8 sm:py-10 w-full flex gap-8 lg:gap-10">
          <SellerSidebar active="analytics" />

          <div className="flex-1 min-w-0 space-y-8">
            {/* Header Title & Refresh Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded-md">
                  <TrendingUp className="size-3.5" />
                  <span>Phase 4.4 Analytics Intelligence</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  Seller Analytics Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Evidence-based performance metrics derived strictly from actual recorded Resale
                  data.
                </p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadAnalytics}
                  disabled={loading}
                  className="gap-2 text-xs"
                >
                  <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && !data && (
              <div className="p-12 text-center border border-border rounded-lg bg-card space-y-3">
                <div className="flex justify-center">
                  <RefreshCw className="size-8 text-primary animate-spin" />
                </div>
                <h3 className="text-base font-semibold text-foreground">Loading analytics...</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Aggregating verified behavioral events, orders, and dispute telemetry.
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="p-8 text-center border border-destructive/30 rounded-lg bg-destructive/5 space-y-3">
                <div className="flex justify-center">
                  <AlertTriangle className="size-8 text-destructive" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  Unable to load analytics
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadAnalytics}
                  className="mt-2 text-xs"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Success State Content */}
            {data && !loading && (
              <>
                {/* ════════════════════════════════════════════════════════
                    OVERVIEW METRICS
                ════════════════════════════════════════════════════════ */}
                <section aria-labelledby="overview-metrics-heading">
                  <div className="flex items-center justify-between mb-4">
                    <h2 id="overview-metrics-heading" className="text-lg font-bold font-display">
                      Overview Metrics
                    </h2>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {data.totalListingsCount} Active Listings
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. Listing Views */}
                    <Card className="border-border/80 shadow-xs">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                          <span>Listing Views</span>
                          <Eye className="size-4 text-primary" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1.5">
                        <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                          {data.viewsTotal}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="bg-muted px-1.5 py-0.5 rounded font-mono">
                            7d: {data.views7d}
                          </span>
                          <span className="bg-muted px-1.5 py-0.5 rounded font-mono">
                            30d: {data.views30d}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Actual recorded LISTING_VIEWED events
                        </p>
                      </CardContent>
                    </Card>

                    {/* 2. Cart Additions */}
                    <Card className="border-border/80 shadow-xs">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                          <span>Cart Additions</span>
                          <ShoppingCart className="size-4 text-primary" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1.5">
                        <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                          {data.cartAddsTotal}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="bg-muted px-1.5 py-0.5 rounded font-mono">
                            7d: {data.cartAdds7d}
                          </span>
                          <span className="bg-muted px-1.5 py-0.5 rounded font-mono">
                            30d: {data.cartAdds30d}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Actual recorded CART_ADDED events
                        </p>
                      </CardContent>
                    </Card>

                    {/* 3. Favorites Status */}
                    <Card className="border-border/80 shadow-xs">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                          <span>Favorites</span>
                          <Heart className="size-4 text-muted-foreground" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1.5">
                        <div className="text-sm font-semibold text-muted-foreground py-1.5">
                          {data.favoritesStatus}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Phase 4.3 Favorites foundation pending
                        </p>
                      </CardContent>
                    </Card>

                    {/* 4. Total Orders Breakdown */}
                    <Card className="border-border/80 shadow-xs">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                          <span>Total Orders</span>
                          <Package className="size-4 text-primary" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1.5">
                        <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                          {data.ordersBreakdown.total}
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                            {data.ordersBreakdown.deliveredOrCompleted} Delivered
                          </span>
                          <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">
                            {data.ordersBreakdown.placedOrPending + data.ordersBreakdown.confirmed}{" "}
                            Active
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          From verified seller order records
                        </p>
                      </CardContent>
                    </Card>

                    {/* 5. Delivered GMV */}
                    <Card className="border-border/80 shadow-xs">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                          <span>Delivered GMV</span>
                          <Wallet className="size-4 text-emerald-600" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1.5">
                        <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400">
                          {taka(data.deliveredGMV)}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {data.deliveredGMV > 0
                            ? "Strictly from delivered/completed sales"
                            : "No completed sales yet (Pending COD excluded)"}
                        </p>
                      </CardContent>
                    </Card>

                    {/* 6. Conversion Rate */}
                    <Card className="border-border/80 shadow-xs">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                          <span>Conversion Rate</span>
                          <Percent className="size-4 text-primary" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1.5">
                        <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                          {data.conversionRate !== null ? `${data.conversionRate}%` : "—"}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {data.conversionRate !== null
                            ? "Delivered orders ÷ recorded listing views"
                            : "Not enough recorded data (0 views)"}
                        </p>
                      </CardContent>
                    </Card>

                    {/* 7. Avg Days to Sale */}
                    <Card className="border-border/80 shadow-xs">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                          <span>Avg Days to Sale</span>
                          <Clock className="size-4 text-primary" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1.5">
                        <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                          {data.avgDaysToSale !== null ? `${data.avgDaysToSale}d` : "—"}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {data.avgDaysToSale !== null
                            ? "Listed timestamp to completed order"
                            : "No completed sales yet"}
                        </p>
                      </CardContent>
                    </Card>

                    {/* 8. Dispute Rate */}
                    <Card className="border-border/80 shadow-xs">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                          <span>Dispute Rate</span>
                          <ShieldAlert className="size-4 text-amber-500" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1.5">
                        <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                          {data.disputeRate !== null ? `${data.disputeRate}%` : "—"}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {data.disputeRate !== null
                            ? `${data.totalDisputesCount} recorded disputes ÷ orders`
                            : "Not enough recorded data (0 orders)"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* ════════════════════════════════════════════════════════
                    RULE-BASED INTELLIGENT INSIGHTS
                ════════════════════════════════════════════════════════ */}
                <section aria-labelledby="insights-heading" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <h2 id="insights-heading" className="text-lg font-bold font-display">
                      Rule-Based Intelligent Insights
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.insights.map((ins) => {
                      const badgeClasses = {
                        INFO: "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-400",
                        WARNING:
                          "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400",
                        SUCCESS:
                          "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400",
                        ACTION: "border-primary/30 bg-primary/5 text-primary",
                      }[ins.type];

                      const IconComp = {
                        INFO: Info,
                        WARNING: AlertTriangle,
                        SUCCESS: CheckCircle2,
                        ACTION: TrendingUp,
                      }[ins.type];

                      return (
                        <div
                          key={ins.id}
                          className={`p-4 border rounded-lg flex items-start gap-3 transition-colors ${badgeClasses}`}
                        >
                          <IconComp className="size-5 shrink-0 mt-0.5" />
                          <div className="space-y-1 text-xs">
                            <h4 className="font-semibold text-foreground">{ins.title}</h4>
                            <p className="text-muted-foreground leading-relaxed">{ins.message}</p>
                            {ins.listingId && (
                              <span className="inline-block text-[10px] font-mono opacity-80 pt-1">
                                Target Listing: #{ins.listingId}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* ════════════════════════════════════════════════════════
                    LISTING PERFORMANCE (DESKTOP TABLE & MOBILE CARDS)
                ════════════════════════════════════════════════════════ */}
                <section aria-labelledby="listing-performance-heading" className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2
                        id="listing-performance-heading"
                        className="text-lg font-bold font-display"
                      >
                        Listing Performance Telemetry
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Itemized breakdown of views, cart activity, and checkout velocity.
                      </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search listings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 text-xs h-8"
                      />
                    </div>
                  </div>

                  {filteredListings.length === 0 ? (
                    <div className="p-8 text-center border border-border rounded-lg bg-card space-y-2">
                      <p className="text-sm font-semibold text-foreground">
                        {searchQuery ? "No matching listings found." : "No recorded listings yet."}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {searchQuery
                          ? "Try searching for another device name or model."
                          : "Published listings will automatically populate telemetry here."}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden lg:block border border-border rounded-lg overflow-hidden bg-card shadow-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="text-[11px] text-muted-foreground uppercase bg-muted/60 border-b border-border">
                              <tr>
                                <th scope="col" className="px-4 py-3">
                                  Listing
                                </th>
                                <th scope="col" className="px-3 py-3 text-center">
                                  Grade
                                </th>
                                <th scope="col" className="px-3 py-3 text-right">
                                  Price
                                </th>
                                <th scope="col" className="px-3 py-3 text-center">
                                  Views (7d / 30d)
                                </th>
                                <th scope="col" className="px-3 py-3 text-center">
                                  Views (Total)
                                </th>
                                <th scope="col" className="px-3 py-3 text-center">
                                  Cart Adds
                                </th>
                                <th scope="col" className="px-3 py-3 text-center">
                                  Favorites
                                </th>
                                <th scope="col" className="px-3 py-3 text-center">
                                  Orders
                                </th>
                                <th scope="col" className="px-3 py-3 text-right">
                                  Delivered GMV
                                </th>
                                <th scope="col" className="px-3 py-3 text-center">
                                  Conversion
                                </th>
                                <th scope="col" className="px-3 py-3 text-center">
                                  Days to Sale
                                </th>
                                <th scope="col" className="px-3 py-3 text-center">
                                  Dispute Rate
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                              {filteredListings.map((lr) => (
                                <tr
                                  key={lr.listingId}
                                  className="hover:bg-muted/20 transition-colors"
                                >
                                  <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={lr.image}
                                        alt={lr.title}
                                        className="size-9 object-cover rounded border border-border shrink-0 bg-muted"
                                      />
                                      <div className="min-w-0 max-w-56">
                                        <Link
                                          to="/listing/$listingId"
                                          params={{ listingId: lr.listingId }}
                                          className="font-semibold text-foreground hover:text-primary transition-colors truncate block"
                                        >
                                          {lr.title}
                                        </Link>
                                        <span className="text-[10px] text-muted-foreground font-mono">
                                          ID: {lr.listingId}
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-3 py-3.5 text-center">
                                    <GradeBadge grade={lr.grade as Grade} />
                                  </td>

                                  <td className="px-3 py-3.5 text-right font-display font-semibold text-foreground">
                                    {taka(lr.price)}
                                  </td>

                                  <td className="px-3 py-3.5 text-center font-mono">
                                    {lr.views7d} / {lr.views30d}
                                  </td>

                                  <td className="px-3 py-3.5 text-center font-bold font-mono">
                                    {lr.viewsTotal}
                                  </td>

                                  <td className="px-3 py-3.5 text-center font-mono">
                                    {lr.cartAddsTotal}
                                  </td>

                                  <td className="px-3 py-3.5 text-center text-muted-foreground text-[10.5px]">
                                    —
                                  </td>

                                  <td className="px-3 py-3.5 text-center">
                                    <span className="font-semibold">{lr.deliveredOrders}</span>
                                    <span className="text-muted-foreground">/{lr.totalOrders}</span>
                                  </td>

                                  <td className="px-3 py-3.5 text-right font-display font-bold text-emerald-600 dark:text-emerald-400">
                                    {lr.deliveredGMV > 0 ? taka(lr.deliveredGMV) : "৳0"}
                                  </td>

                                  <td className="px-3 py-3.5 text-center">
                                    {lr.conversionRate !== null ? (
                                      <Badge variant="outline" className="text-[10px] font-mono">
                                        {lr.conversionRate}%
                                      </Badge>
                                    ) : (
                                      <span className="text-[10px] text-muted-foreground">N/A</span>
                                    )}
                                  </td>

                                  <td className="px-3 py-3.5 text-center font-mono">
                                    {lr.avgDaysToSale !== null ? `${lr.avgDaysToSale}d` : "—"}
                                  </td>

                                  <td className="px-3 py-3.5 text-center">
                                    {lr.disputeRate !== null ? (
                                      <span
                                        className={`font-mono text-xs font-semibold ${
                                          lr.disputeRate > 0
                                            ? "text-destructive"
                                            : "text-muted-foreground"
                                        }`}
                                      >
                                        {lr.disputeRate}%
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-muted-foreground">N/A</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Mobile & Tablet Card Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
                        {filteredListings.map((lr) => (
                          <Card key={lr.listingId} className="border-border/80 shadow-xs">
                            <CardHeader className="p-4 pb-3 flex flex-row items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={lr.image}
                                  alt={lr.title}
                                  className="size-11 object-cover rounded border border-border shrink-0 bg-muted"
                                />
                                <div className="min-w-0">
                                  <Link
                                    to="/listing/$listingId"
                                    params={{ listingId: lr.listingId }}
                                    className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                                  >
                                    {lr.title}
                                  </Link>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-display font-bold text-foreground">
                                      {taka(lr.price)}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                      #{lr.listingId}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <GradeBadge grade={lr.grade as Grade} />
                            </CardHeader>

                            <CardContent className="p-4 pt-0 space-y-3 text-xs">
                              <div className="grid grid-cols-2 gap-2 bg-muted/30 p-2.5 rounded border border-border/40">
                                <div>
                                  <span className="text-[10px] text-muted-foreground block">
                                    Views (7d / 30d / Total)
                                  </span>
                                  <span className="font-mono font-bold text-foreground">
                                    {lr.views7d} / {lr.views30d} / {lr.viewsTotal}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-muted-foreground block">
                                    Cart Additions
                                  </span>
                                  <span className="font-mono font-bold text-foreground">
                                    {lr.cartAddsTotal} adds
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-muted-foreground block">
                                    Delivered GMV
                                  </span>
                                  <span className="font-display font-bold text-emerald-600 dark:text-emerald-400">
                                    {taka(lr.deliveredGMV)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-muted-foreground block">
                                    Conversion Rate
                                  </span>
                                  <span className="font-mono font-semibold text-foreground">
                                    {lr.conversionRate !== null
                                      ? `${lr.conversionRate}%`
                                      : "No views"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                                <span>
                                  Orders: <strong>{lr.deliveredOrders}</strong> delivered (
                                  {lr.totalOrders} total)
                                </span>
                                <span>
                                  Days to Sale:{" "}
                                  <strong>
                                    {lr.avgDaysToSale !== null ? `${lr.avgDaysToSale}d` : "None"}
                                  </strong>
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </section>
              </>
            )}
          </div>
        </main>

        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
