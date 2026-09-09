import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  Database,
  TrendingUp,
  MapPin,
  Phone,
} from "lucide-react";
import { taka } from "@/data/catalog";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAuth } from "@/lib/auth-store";
import { getAdminOrdersFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [{ title: "Admin Transactions & Orders | Resale.com" }],
  }),
  component: AdminOrdersPage,
});

interface AdminOrderRecord {
  id: string;
  listingId: string;
  productName: string;
  productImage: string;
  grade: string;
  conditionScore: number;
  amountBDT: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  shippingAddress: {
    name?: string;
    phone?: string;
    division?: string;
    district?: string;
    area?: string;
    address?: string;
  };
}

function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminOrdersFn({ data: { token } });
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data as AdminOrderRecord[]);
        setDataSource(res.dataSource || "PERSISTENT_STORE");
      } else {
        setError(res.error || "Failed to retrieve transaction records.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Error connecting to transaction store.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Settled volume strictly from DELIVERED or COMPLETED orders
  const settledGMV = orders
    .filter((o) => ["DELIVERED", "COMPLETED"].includes(o.status))
    .reduce((sum, o) => sum + o.amountBDT, 0);

  const activeOrdersCount = orders.filter((o) =>
    ["PENDING", "CONFIRMED", "PROCESSING", "READY_TO_SHIP", "SHIPPED"].includes(o.status),
  ).length;

  const deliveredCount = orders.filter((o) => ["DELIVERED", "COMPLETED"].includes(o.status)).length;

  const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;

  const filteredOrders = orders.filter((order) => {
    const term = search.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(term) ||
      order.buyerName.toLowerCase().includes(term) ||
      order.productName.toLowerCase().includes(term) ||
      (order.shippingAddress.district &&
        order.shippingAddress.district.toLowerCase().includes(term));

    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell active="orders">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
                Transactions &amp; Order Oversight
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Audit system-wide order lifecycles, payment states, and delivery milestones.
              </p>
            </div>

            {dataSource && (
              <Badge
                variant="outline"
                className="text-[11px] gap-1.5 py-1 px-2.5 self-start sm:self-auto font-mono"
              >
                <Database className="size-3 text-primary" />
                <span>
                  Source:{" "}
                  {dataSource === "SUPABASE_POSTGRESQL" ? "Supabase PostgreSQL" : "Local Store"}
                </span>
              </Badge>
            )}
          </div>

          {/* Metrics Summary Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Settled Revenue</span>
                  <TrendingUp className="size-4 text-success" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-display text-primary">
                  {taka(settledGMV)}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Delivered / Completed transactions
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Active In-Fulfillment</span>
                  <Clock className="size-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{activeOrdersCount}</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Pending, packing, or in transit
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Delivered &amp; Verified</span>
                  <CheckCircle2 className="size-4 text-emerald-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {deliveredCount}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Successful doorsteps</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Cancelled Orders</span>
                  <XCircle className="size-4 text-destructive" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{cancelledCount}</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Voided transactions</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3.5 bg-card border border-border rounded-lg">
            <div className="relative w-full sm:w-80">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID, Buyer, Product, District..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by order lifecycle status"
                className="border border-border bg-background px-3 py-1.5 text-xs rounded-md h-9 text-foreground"
              >
                <option value="ALL">All Lifecycle States</option>
                <option value="PENDING">PENDING (Awaiting Confirmation)</option>
                <option value="CONFIRMED">CONFIRMED (Seller Verified)</option>
                <option value="PROCESSING">PROCESSING (Packing)</option>
                <option value="READY_TO_SHIP">READY_TO_SHIP</option>
                <option value="SHIPPED">SHIPPED (In Transit)</option>
                <option value="DELIVERED">DELIVERED (Doorstep Completed)</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <Button variant="outline" size="sm" onClick={fetchOrders} className="h-9 text-xs">
                Refresh
              </Button>
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="py-20">
              <Loader label="Loading authentic order records from database..." />
            </div>
          ) : error ? (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="py-8 text-center text-xs text-destructive space-y-3">
                <AlertCircle className="size-8 mx-auto opacity-70" />
                <p className="font-medium">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchOrders} className="text-xs">
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-16 text-center text-muted-foreground space-y-2">
                <Package className="size-10 mx-auto opacity-40 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  No matching transactions found
                </p>
                <p className="text-xs">
                  {orders.length === 0
                    ? "Zero order records currently exist in the database."
                    : "Try adjusting your search query or filter selection."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-muted-foreground uppercase bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Item / Product</th>
                      <th className="px-4 py-3">Buyer Contact</th>
                      <th className="px-4 py-3">Destination</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredOrders.map((order) => {
                      const isDelivered =
                        order.status === "DELIVERED" || order.status === "COMPLETED";
                      const isCancelled = order.status === "CANCELLED";
                      const isPending = order.status === "PENDING";

                      return (
                        <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-mono font-semibold text-foreground whitespace-nowrap">
                            #{order.id}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-foreground block truncate max-w-50">
                              {order.productName}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Grade {order.grade} ({order.conditionScore} pts)
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-foreground block">
                              {order.buyerName}
                            </span>
                            {order.buyerPhone && (
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Phone className="size-2.5" /> {order.buyerPhone}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <MapPin className="size-3 shrink-0 text-muted-foreground" />
                              <span className="truncate max-w-35">
                                {order.shippingAddress.district
                                  ? `${order.shippingAddress.area || ""}, ${order.shippingAddress.district}`
                                  : "Standard Delivery"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-display font-bold text-foreground whitespace-nowrap">
                            {taka(order.amountBDT)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className="text-[10px] uppercase tracking-wider py-0 px-1.5 font-mono"
                            >
                              {order.paymentMethod}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Badge
                              variant={
                                isDelivered
                                  ? "default"
                                  : isCancelled
                                    ? "destructive"
                                    : isPending
                                      ? "outline"
                                      : "secondary"
                              }
                              className={`text-[10px] font-semibold py-0.5 px-2 ${
                                isPending
                                  ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                  : ""
                              }`}
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-[11px] font-mono whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}
