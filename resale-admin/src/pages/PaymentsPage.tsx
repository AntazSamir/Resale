import { useState, useEffect, useCallback } from "react";
import { RefreshCw, CreditCard, TrendingUp, TrendingDown } from "lucide-react";
import { adminApi, type PaymentSummary } from "@/lib/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Loader } from "@/components/ui";
import { taka, formatDate } from "@/lib/utils";

export function PaymentsPage() {
  const [data, setData] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getPayments();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error ?? "Failed to load payment data.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Error loading payment data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  const rows = data?.rows ?? [];
  const totalRevenue = data?.grandTotalBDT ?? data?.totalRevenueBDT ?? 0;
  const transactionCount =
    data?.grandTotalCount ?? data?.transactionCount ?? rows.reduce((s, r) => s + (r.count || 0), 0);
  const settledBDT =
    data?.settledBDT ??
    rows
      .filter((r) => {
        const s = (r.status || "").toUpperCase();
        return s === "SETTLED" || s === "COMPLETED" || s === "DELIVERED";
      })
      .reduce((acc, r) => acc + (r.amountBDT || 0), 0);

  const pendingBDT =
    data?.pendingBDT ??
    rows
      .filter((r) => {
        const s = (r.status || "").toUpperCase();
        return s === "PENDING" || s === "PLACED" || s === "PROCESSING";
      })
      .reduce((acc, r) => acc + (r.amountBDT || 0), 0);

  const refundedBDT =
    data?.refundedBDT ??
    rows
      .filter((r) => {
        const s = (r.status || "").toUpperCase();
        return s === "REFUNDED" || s === "CANCELLED";
      })
      .reduce((acc, r) => acc + (r.amountBDT || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Payments</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Platform revenue overview and transaction audit.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchPayments()}
          disabled={loading}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="py-24 flex items-center justify-center">
          <Loader label="Loading payment data..." />
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-8 text-center text-destructive text-sm">{error}</CardContent>
        </Card>
      ) : data ? (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: taka(totalRevenue), icon: CreditCard, color: "" },
              {
                label: "Settled / Delivered",
                value: taka(settledBDT),
                icon: TrendingUp,
                color: "text-emerald-600",
              },
              { label: "Pending", value: taka(pendingBDT), icon: null, color: "text-amber-600" },
              {
                label: "Refunded / Cancelled",
                value: taka(refundedBDT),
                icon: TrendingDown,
                color: "text-destructive",
              },
            ].map((card) => (
              <div key={card.label} className="bg-card rounded-xl border border-border/60 p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  {card.label}
                </p>
                <p className={`text-2xl font-bold font-display ${card.color || "text-foreground"}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Total Transactions
                </p>
                <p className="text-3xl font-bold font-display">
                  {transactionCount.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method / Status Breakdown */}
          {rows.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">
                  Payment Methods & Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Method
                        </th>
                        <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Status
                        </th>
                        <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Orders
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Volume
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr
                          key={`${r.paymentMethod}-${r.status}-${i}`}
                          className={`border-b border-border/40 hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                        >
                          <td className="px-4 py-2.5 font-medium text-foreground">
                            {r.paymentMethod}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <Badge
                              variant={
                                ["SETTLED", "COMPLETED", "DELIVERED"].includes(
                                  r.status.toUpperCase(),
                                )
                                  ? "success"
                                  : ["PENDING", "PLACED"].includes(r.status.toUpperCase())
                                    ? "warning"
                                    : "secondary"
                              }
                            >
                              {r.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-center font-mono">{r.count}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-medium">
                            {taka(r.amountBDT)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent transactions (if provided) */}
          {data.recentTransactions && data.recentTransactions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          ID
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Amount
                        </th>
                        <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentTransactions.map((t, i) => (
                        <tr
                          key={t.id}
                          className={`border-b border-border/40 hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                        >
                          <td className="px-4 py-2.5 font-mono text-foreground">
                            {(t.id || "—").slice(0, 12)}…
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-medium">
                            {taka(t.amountBDT)}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <Badge
                              variant={
                                t.status === "SETTLED"
                                  ? "success"
                                  : t.status === "PENDING"
                                    ? "warning"
                                    : "secondary"
                              }
                            >
                              {t.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {formatDate(t.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}
