import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminSidebar } from "./admin.index";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { taka } from "@/data/catalog";
import { ProtectedRoute } from "@/components/protected-route";
import {
  getOrders,
  type OrderRecord,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/order-store";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [{ title: "Admin Transactions & Orders | Resale.com" }],
  }),
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter((o) =>
    ["PENDING", "CONFIRMED", "PROCESSING", "READY_TO_SHIP", "SHIPPED"].includes(o.orderStatus),
  ).length;
  const deliveredCount = orders.filter((o) =>
    ["DELIVERED", "COMPLETED"].includes(o.orderStatus),
  ).length;
  const disputeCount = orders.filter((o) =>
    ["DISPUTED", "REFUND_REQUESTED"].includes(o.orderStatus),
  ).length;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((it) => it.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === "ALL" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 w-full flex gap-8 lg:gap-10">
          <AdminSidebar active="orders" />

          <div className="flex-1 space-y-6 min-w-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Transactions &amp; Order Oversight
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Audit system-wide order lifecycles, payment states, and buyer protection events
              </p>
            </div>

            {/* Platform Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total Order Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-display font-bold text-primary">
                    {taka(totalGMV)}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {orders.length} total orders
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Active Fulfillment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{activeOrdersCount}</div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">In progress / transit</p>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Delivered &amp; Settled
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {deliveredCount}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Completed deliveries</p>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Disputes / Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">{disputeCount}</div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Requiring mediation</p>
                </CardContent>
              </Card>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 bg-card border border-border/70">
              <div className="relative w-full sm:w-72">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search Order ID or Buyer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by order lifecycle status"
                  className="border border-border bg-background px-3 py-1.5 text-xs rounded-none"
                >
                  <option value="ALL">All Order States</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="READY_TO_SHIP">READY_TO_SHIP</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  aria-label="Filter by payment status"
                  className="border border-border bg-background px-3 py-1.5 text-xs rounded-none"
                >
                  <option value="ALL">All Payment States</option>
                  <option value="PENDING">PENDING (COD Due)</option>
                  <option value="PAID">PAID</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <Card className="border-border/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-muted-foreground uppercase bg-muted/50 border-b border-border/60">
                    <tr>
                      <th className="px-4 py-3.5">Order ID</th>
                      <th className="px-4 py-3.5">Buyer (NID)</th>
                      <th className="px-4 py-3.5">Items &amp; Seller</th>
                      <th className="px-4 py-3.5">Amount</th>
                      <th className="px-4 py-3.5">Payment</th>
                      <th className="px-4 py-3.5">Order Status</th>
                      <th className="px-4 py-3.5 text-right">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3.5 font-mono font-semibold text-foreground">
                          {order.id}
                          {order.isSampleData && (
                            <span className="block text-[9.5px] uppercase tracking-wider text-muted-foreground font-sans">
                              Demo
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-foreground block">
                            {order.shippingAddress?.name || order.buyerContact?.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            NID: {order.buyerContact?.nidNumber || order.nidNumber || "Verified"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-medium text-foreground block truncate max-w-xs">
                            {order.items[0]?.name || "Catalog Product"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Seller: {order.items[0]?.sellerName || "Verified Seller"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-display font-bold text-primary">
                          {taka(order.total)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-medium block">{order.paymentMethod}</span>
                          <span
                            className={`text-[10px] uppercase tracking-wider font-semibold ${
                              order.paymentStatus === "PAID"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {order.paymentStatus === "PAID" ? "Settled" : "Pending (COD)"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant="outline" className="text-[10.5px]">
                            {order.orderStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Button size="sm" variant="ghost" asChild className="text-xs">
                            <Link to="/account/orders/$orderId" params={{ orderId: order.id }}>
                              Audit Log <ChevronRight className="size-3 ml-1" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
