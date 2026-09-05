import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BarChart3,
  List,
  Wallet,
  Plus,
  Star,
  Package,
  ChevronRight,
  Store,
  Sparkles,
  UploadCloud,
  ShieldAlert,
  ArrowUpRight,
  Eye,
  ShoppingCart,
  Percent,
  CheckCircle2,
} from "lucide-react";
import { taka } from "@/data/catalog";
import { ProtectedRoute } from "@/components/protected-route";
import {
  getOrders,
  fetchOrdersAsync,
  onOrdersChange,
  transitionOrderStatus,
  type OrderRecord,
} from "@/lib/order-store";
import {
  getSellerAnalyticsFn,
  confirmOrderAsSellerFn,
  type SellerAnalyticsData,
} from "@/lib/server-functions";
import { useAuth } from "@/lib/auth-store";
import { Badge } from "@/components/ui/badge";
import resaleLogo from "@/assets/resale-logo.svg";

export const Route = createFileRoute("/seller/dashboard")({
  head: () => ({
    meta: [{ title: "Seller Dashboard | Resale.com" }],
  }),
  component: SellerDashboardPage,
});

export function SellerSidebar({
  active,
}: {
  active:
    | "dashboard"
    | "analytics"
    | "orders"
    | "disputes"
    | "listings"
    | "payouts"
    | "storefront"
    | "creator"
    | "bulk-import";
}) {
  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <nav className="space-y-1.5 sticky top-24">
        <Link
          to="/seller/dashboard"
          className="flex items-center gap-2 px-4 py-2 mb-4 border-b border-border text-foreground hover:opacity-90 transition-opacity"
        >
          <img src={resaleLogo} alt="Resale logo" className="h-6 w-auto object-contain shrink-0" />
          <span className="font-display font-bold text-sm tracking-tight">Seller Hub</span>
        </Link>
        <Link
          to="/seller/dashboard"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "dashboard" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <LayoutDashboard className="size-4" /> Dashboard
        </Link>
        <Link
          to="/seller/analytics"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "analytics" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <BarChart3 className="size-4" /> Analytics Intelligence
        </Link>
        <Link
          to="/seller/orders"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "orders" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <Package className="size-4" /> Orders &amp; Fulfillment
        </Link>
        <Link
          to="/seller/disputes"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "disputes" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <ShieldAlert className="size-4" /> Disputes &amp; Claims
        </Link>
        <Link
          to="/seller/listings"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "listings" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <List className="size-4" /> My Listings
        </Link>
        <Link
          to="/seller/payouts"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "payouts" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <Wallet className="size-4" /> Payouts &amp; Credits
        </Link>

        {/* Phase 3.4 Pro Merchant & Creator Suite */}
        <div className="pt-3 mt-3 border-t border-border/70 space-y-1">
          <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Pro &amp; Creator Suite
          </div>
          <Link
            to="/seller/storefront"
            className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "storefront" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
          >
            <Store className="size-4" /> Storefront Profile
          </Link>
          <Link
            to="/seller/creator-profile"
            className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "creator" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
          >
            <Sparkles className="size-4" /> Creator Hub
          </Link>
          <Link
            to="/seller/inventory/import"
            className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "bulk-import" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
          >
            <UploadCloud className="size-4" /> Bulk Inventory
          </Link>
        </div>

        <div className="pt-4 mt-4 border-t border-border">
          <Button asChild className="w-full text-xs">
            <Link to="/sell">
              <Plus className="size-4 mr-2" /> New Listing
            </Link>
          </Button>
        </div>
      </nav>
    </aside>
  );
}

function SellerDashboardPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [analytics, setAnalytics] = useState<SellerAnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    setOrders(getOrders().filter((o) => !o.isSampleData));
    fetchOrdersAsync()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setOrders(res.filter((o) => !o.isSampleData));
        }
      })
      .catch(() => {});
    const unsubscribe = onOrdersChange((updated) => {
      setOrders(updated.filter((o) => !o.isSampleData));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (token) {
      setLoadingAnalytics(true);
      getSellerAnalyticsFn({ data: { token } })
        .then((res) => {
          if (res.success && res.data) {
            setAnalytics(res.data);
          }
        })
        .catch(() => {})
        .finally(() => {
          setLoadingAnalytics(false);
        });
    }
  }, [token]);

  // Filter orders strictly belonging to this authenticated seller (or all for admins)
  const sellerOrders = useMemo(() => {
    if (!user) return [];
    if (user.isAdmin) {
      return orders.filter((o) => !o.isSampleData);
    }
    const ids = new Set<string>();
    if (user.id) {
      ids.add(user.id);
      ids.add(user.id.toLowerCase());
    }
    if (user.phone) {
      ids.add(user.phone);
      ids.add(`seller-${user.phone}`);
      ids.add(`u-${user.phone.replace(/\D/g, "")}`);
    }

    return orders.filter((o) => {
      if (o.isSampleData) return false;
      return o.items.some((item) => {
        if (item.sellerId && ids.has(item.sellerId)) return true;
        if (
          user.name &&
          item.sellerName &&
          item.sellerName.toLowerCase() === user.name.toLowerCase()
        )
          return true;
        return false;
      });
    });
  }, [orders, user]);

  const totalSales = sellerOrders
    .filter((o) => o.orderStatus === "DELIVERED" || o.orderStatus === "COMPLETED")
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrdersCount = sellerOrders.filter((o) =>
    ["PENDING", "CONFIRMED", "PROCESSING", "READY_TO_SHIP"].includes(o.orderStatus),
  ).length;

  const displayGmv = analytics?.deliveredGMV ?? totalSales;
  const activeOrdersCount = analytics
    ? analytics.ordersBreakdown.placedOrPending
    : pendingOrdersCount;

  const handleQuickConfirm = (orderId: string) => {
    const res = transitionOrderStatus(orderId, "CONFIRMED", "SELLER");
    if (res.success) {
      confirmOrderAsSellerFn({
        data: {
          orderId,
          ...(user?.id ? { sellerId: user.id } : {}),
          note: "Seller confirmed order from dashboard.",
        },
      }).catch(() => {});
      setOrders(getOrders().filter((o) => !o.isSampleData));
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex gap-10">
          <SellerSidebar active="dashboard" />

          <div className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground">
                  Seller Dashboard
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Overview of live inventory fulfillment and verified performance metrics.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
                <Link to="/seller/analytics">
                  <BarChart3 className="size-4 text-primary" />
                  <span>View Full Analytics</span>
                  <ArrowUpRight className="size-3.5 ml-0.5" />
                </Link>
              </Button>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Delivered GMV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-display font-bold text-primary">
                    {taka(displayGmv)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {displayGmv > 0 ? "Actual cleared sales" : "No completed sales yet"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{pendingOrdersCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting dispatch/delivery</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Listing Views (Total)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Eye className="size-5 text-muted-foreground" />
                    {analytics ? analytics.viewsTotal : 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics?.views7d !== undefined
                      ? `${analytics.views7d} in last 7 days`
                      : "Recorded traffic"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Store Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {analytics?.conversionRate !== null && analytics?.conversionRate !== undefined
                      ? `${analytics.conversionRate}%`
                      : "—"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics?.conversionRate !== null && analytics?.conversionRate !== undefined
                      ? "Delivered ÷ recorded views"
                      : "Not enough recorded data"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Intelligence Teaser Banner */}
            <div className="border border-border/80 bg-linear-to-r from-primary/5 via-card to-card p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-wider">
                  <Sparkles className="size-3.5" />
                  <span>Phase 4.4 Seller Analytics Intelligence</span>
                </div>
                <h3 className="font-display font-bold text-base text-foreground">
                  Evidence-Based Performance &amp; Real-Time Listing Telemetry
                </h3>
                <p className="text-xs text-muted-foreground max-w-2xl">
                  Deep breakdown of 7d/30d listing views, cart additions, days to sale, dispute
                  rates, and deterministic rule-based advice.
                </p>
              </div>
              <Button asChild size="sm" className="shrink-0 gap-1.5">
                <Link to="/seller/analytics">
                  Open Analytics Intelligence
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-display">Recent Fulfillment Pipeline</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/seller/orders">
                    View All Orders <ChevronRight className="size-3.5 ml-1" />
                  </Link>
                </Button>
              </div>

              <Card className="border-border/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] text-muted-foreground uppercase bg-muted/50 border-b border-border/60">
                      <tr>
                        <th className="px-6 py-3.5">Order ID</th>
                        <th className="px-6 py-3.5">Item Snapshot</th>
                        <th className="px-6 py-3.5">Destination</th>
                        <th className="px-6 py-3.5">Amount</th>
                        <th className="px-6 py-3.5">Order Status</th>
                        <th className="px-6 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {sellerOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                            No fulfillment orders yet. When customers purchase your listings, orders
                            will appear here.
                          </td>
                        </tr>
                      ) : (
                        sellerOrders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-muted/20">
                            <td className="px-6 py-4 font-mono font-semibold text-foreground">
                              {order.id}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-foreground block">
                                {order.items[0]?.name || "Catalog Product"}
                              </span>
                              {order.items[0]?.grade && (
                                <span className="text-[11px] text-muted-foreground">
                                  Grade {order.items[0].grade}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {order.shippingAddress?.district || "Dhaka"}
                            </td>
                            <td className="px-6 py-4 font-display font-bold text-primary">
                              {taka(order.total)}
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                variant="outline"
                                className={`text-[10.5px] ${
                                  order.orderStatus === "CONFIRMED"
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : order.orderStatus === "PENDING"
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                      : ""
                                }`}
                              >
                                {order.orderStatus}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {order.orderStatus === "PENDING" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleQuickConfirm(order.id)}
                                    className="text-xs h-7 px-2.5 bg-primary text-primary-foreground font-semibold"
                                  >
                                    <CheckCircle2 className="size-3 mr-1" /> Confirm
                                  </Button>
                                )}
                                <Button size="sm" variant="ghost" asChild className="text-xs h-7">
                                  <Link to="/seller/orders">Manage</Link>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
