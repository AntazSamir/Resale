import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  List,
  Wallet,
  Plus,
  Star,
  Package,
  ChevronRight,
  Store,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { taka } from "@/data/catalog";
import { ProtectedRoute } from "@/components/protected-route";
import { getOrders, type OrderRecord } from "@/lib/order-store";
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
    "dashboard" | "orders" | "listings" | "payouts" | "storefront" | "creator" | "bulk-import";
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
          to="/seller/orders"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "orders" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <Package className="size-4" /> Orders &amp; Fulfillment
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
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const totalSales = orders
    .filter((o) => o.orderStatus === "DELIVERED" || o.orderStatus === "COMPLETED")
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrdersCount = orders.filter((o) =>
    ["PENDING", "CONFIRMED", "PROCESSING", "READY_TO_SHIP"].includes(o.orderStatus),
  ).length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex gap-10">
          <SellerSidebar active="dashboard" />

          <div className="flex-1 space-y-8">
            <h1 className="text-3xl font-display font-bold text-foreground">Seller Dashboard</h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Delivered GMV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-display font-bold text-primary">
                    {taka(totalSales > 0 ? totalSales : 207120)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Cleared sales</p>
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
                    Seller Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-2 text-foreground">
                    4.9 <Star className="size-5 fill-amber-400 text-amber-400" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Verified seller score</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Listing Credits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">4</div>
                  <p className="text-xs text-muted-foreground mt-1">Available to use</p>
                </CardContent>
              </Card>
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
                      {orders.slice(0, 5).map((order) => (
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
                            <Badge variant="outline" className="text-[10.5px]">
                              {order.orderStatus}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button size="sm" variant="ghost" asChild className="text-xs">
                              <Link to="/seller/orders">Manage</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
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
