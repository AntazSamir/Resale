import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, RefreshCw, Database } from "lucide-react";
import { taka } from "@/data/catalog";
import { useAuth } from "@/lib/auth-store";
import { getAdminPaymentSummaryFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({
    meta: [{ title: "Payments Audit | Admin Console | Resale.com" }],
  }),
  component: AdminPaymentsPage,
});

interface PaymentMethodSummary {
  totalBDT: number;
  count: number;
}

interface PaymentSummaryData {
  rows: Array<{
    paymentMethod: string;
    status: string;
    amountBDT: number;
    count: number;
  }>;
  byMethod: Record<string, PaymentMethodSummary>;
  grandTotalBDT: number;
  grandTotalCount: number;
}

function AdminPaymentsPage() {
  const { token } = useAuth() as { token?: string };
  const [data, setData] = useState<PaymentSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminPaymentSummaryFn({ data: { token } });
      if (!res.success) {
        setError(res.error ?? "Failed to load");
        return;
      }
      setData(res.data);
      setDataSource(res.dataSource);
    } catch {
      setError("Network error loading payments data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell active="payments">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
                <CreditCard className="size-7 text-primary" />
                Payments Audit
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Aggregated order volume broken down by payment method and order status.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={load}
              disabled={loading}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader />
            </div>
          ) : error ? (
            <p className="text-center text-sm text-destructive py-12">{error}</p>
          ) : !data ? (
            <p className="text-center text-sm text-muted-foreground py-12">No data available.</p>
          ) : (
            <>
              {/* Grand Totals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6 pb-6 text-center">
                    <p className="text-sm text-primary font-semibold mb-1 uppercase tracking-wider">
                      Total Payment Volume Processed
                    </p>
                    <p className="text-4xl font-bold font-display text-primary">
                      {taka(data.grandTotalBDT * 100)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border/60">
                  <CardContent className="pt-6 pb-6 text-center">
                    <p className="text-sm text-muted-foreground font-semibold mb-1 uppercase tracking-wider">
                      Total Transactions
                    </p>
                    <p className="text-4xl font-bold font-display text-foreground">
                      {data.grandTotalCount}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* By Method Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(data.byMethod).map(([method, summary]) => (
                  <Card key={method} className="border-border/60">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <CreditCard className="size-4" />
                        {method}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-foreground mb-1">
                        {taka(summary.totalBDT * 100)}
                      </p>
                      <p className="text-xs text-muted-foreground">{summary.count} transactions</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Detailed Breakdown */}
              <Card className="border-border/60">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Volume by Order Status</CardTitle>
                  {dataSource && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Database className="size-3" />
                      {dataSource === "SUPABASE_POSTGRESQL" ? "Supabase" : "In-Memory"}
                    </span>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">
                            Payment Method
                          </th>
                          <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">
                            Order Status
                          </th>
                          <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground">
                            Transactions
                          </th>
                          <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground">
                            Volume
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {data.rows
                          .sort((a, b) => b.amountBDT - a.amountBDT)
                          .map((r, i) => (
                            <tr key={i} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-2.5 font-semibold text-foreground">
                                {r.paymentMethod}
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                <Badge variant="outline" className="text-[10px] bg-muted/50">
                                  {r.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-2.5 text-right font-medium">{r.count}</td>
                              <td className="px-4 py-2.5 text-right font-bold text-foreground">
                                {taka(r.amountBDT * 100)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}
