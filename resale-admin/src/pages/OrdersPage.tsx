import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Package, MapPin, Phone } from "lucide-react";
import { adminApi } from "@/lib/api-client";
import { Badge, Button, Card, CardContent, Input, Loader } from "@/components/ui";
import { taka, formatDate } from "@/lib/utils";

interface AdminOrderRecord {
  id: string;
  listingId?: string;
  productName?: string;
  grade?: string;
  amountBDT: number;
  paymentMethod?: string;
  status: string;
  createdAt: string;
  buyerName?: string;
  buyerPhone?: string;
  shippingAddress?: {
    district?: string;
    division?: string;
    address?: string;
  };
}

function statusVariant(s: string): "success" | "warning" | "destructive" | "secondary" | "default" {
  if (s === "DELIVERED" || s === "COMPLETED") return "success";
  if (s === "SHIPPED") return "default";
  if (s === "PLACED" || s === "PENDING" || s === "PROCESSING") return "warning";
  if (s === "CANCELLED" || s === "REFUNDED") return "destructive";
  return "secondary";
}

export function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getOrders();
      if (res.success && res.data) {
        setOrders(res.data as AdminOrderRecord[]);
      } else {
        setError(res.error ?? "Failed to retrieve transaction records.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Error connecting to transaction store.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const statusOptions = ["ALL", ...Array.from(new Set(orders.map((o) => o.status)))];

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      (o.buyerName?.toLowerCase().includes(q) ?? false) ||
      (o.productName?.toLowerCase().includes(q) ?? false);
    return matchStatus && matchSearch;
  });

  const totalRevenue = filtered.reduce((sum, o) => sum + (o.amountBDT ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            All buyer transactions and fulfillment pipeline status.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchOrders()}
          disabled={loading}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: filtered.length.toLocaleString(), icon: Package },
          { label: "Revenue (Filtered)", value: taka(totalRevenue), icon: null },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border/60 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-xl font-bold font-display text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by order ID, buyer, product…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {statusOptions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Loader className="mx-auto" label="Loading orders..." />
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-8 text-center text-destructive text-sm">{error}</CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Order
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Buyer
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Location
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, i) => (
                    <tr
                      key={o.id}
                      className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-foreground">{o.id.slice(0, 12)}…</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-foreground">
                        {o.productName ?? "—"}
                        {o.grade && <span className="ml-1 text-muted-foreground">({o.grade})</span>}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="text-foreground">{o.buyerName ?? "—"}</div>
                        {o.buyerPhone && (
                          <div className="text-muted-foreground flex items-center gap-0.5">
                            <Phone className="size-2.5" /> {o.buyerPhone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                        {o.shippingAddress?.district ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {o.shippingAddress.district}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium">
                        {taka(o.amountBDT)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                        {formatDate(o.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  {search || statusFilter !== "ALL"
                    ? "No orders match your filters."
                    : "No orders found."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground font-mono">
        Showing {filtered.length} of {orders.length} orders
      </div>
    </div>
  );
}
