import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, RefreshCw, Database, TrendingUp, ShoppingCart, Shield } from "lucide-react";
import { taka } from "@/data/catalog";
import { useAuth } from "@/lib/auth-store";
import { getAdminAnalyticsFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [{ title: "Platform Analytics | Admin Console | Resale.com" }],
  }),
  component: AdminAnalyticsPage,
});

interface AnalyticsData {
  timeline: Array<{
    month: string;
    orders: number;
    gmvBDT: number;
    listings: number;
    moderationActions: number;
  }>;
  categoryVolume: Array<{
    category: string;
    orders: number;
    gmvBDT: number;
  }>;
}

function AdminAnalyticsPage() {
  const { token } = useAuth() as { token?: string };
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminAnalyticsFn({ data: { token } });
      if (!res.success) {
        setError(res.error ?? "Failed to load");
        return;
      }
      setData(res.data);
      setDataSource(res.dataSource);
    } catch {
      setError("Network error loading analytics.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell active="analytics">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
                <BarChart className="size-7 text-primary" />
                Platform Analytics
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Aggregated business intelligence derived from marketplace activity.
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
          ) : !data || data.timeline.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12">
              No analytics data available yet.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Timeline */}
                <Card className="border-border/60">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-border/40">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <TrendingUp className="size-4 text-primary" />
                      Monthly Trend
                    </CardTitle>
                    {dataSource && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Database className="size-3" />
                        {dataSource === "SUPABASE_POSTGRESQL" ? "Supabase" : "In-Memory"}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/20">
                          <th className="text-left px-4 py-2 font-semibold text-muted-foreground">
                            Month
                          </th>
                          <th className="text-right px-4 py-2 font-semibold text-muted-foreground">
                            Orders
                          </th>
                          <th className="text-right px-4 py-2 font-semibold text-muted-foreground">
                            Settled GMV
                          </th>
                          <th className="text-right px-4 py-2 font-semibold text-muted-foreground">
                            New Listings
                          </th>
                          <th className="text-right px-4 py-2 font-semibold text-muted-foreground">
                            Mod Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {data.timeline.map((r) => (
                          <tr key={r.month} className="hover:bg-muted/10">
                            <td className="px-4 py-2.5 font-medium">{r.month}</td>
                            <td className="px-4 py-2.5 text-right font-medium text-blue-600">
                              {r.orders}
                            </td>
                            <td className="px-4 py-2.5 text-right font-bold text-emerald-600">
                              {taka(r.gmvBDT * 100)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-muted-foreground">
                              {r.listings}
                            </td>
                            <td className="px-4 py-2.5 text-right text-muted-foreground">
                              {r.moderationActions}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                {/* Category Volume */}
                <Card className="border-border/60">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-border/40">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <ShoppingCart className="size-4 text-primary" />
                      Category Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/20">
                          <th className="text-left px-4 py-2 font-semibold text-muted-foreground">
                            Category
                          </th>
                          <th className="text-right px-4 py-2 font-semibold text-muted-foreground">
                            Total Orders
                          </th>
                          <th className="text-right px-4 py-2 font-semibold text-muted-foreground">
                            Total GMV
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {data.categoryVolume.map((r) => (
                          <tr key={r.category} className="hover:bg-muted/10">
                            <td className="px-4 py-2.5 font-medium uppercase tracking-wider">
                              {r.category}
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium">{r.orders}</td>
                            <td className="px-4 py-2.5 text-right font-bold text-foreground">
                              {taka(r.gmvBDT * 100)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="size-5 text-primary" />
                      <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                        Moderation Activity
                      </p>
                    </div>
                    <p className="text-3xl font-display font-bold text-foreground">
                      {data.timeline.reduce((acc, curr) => acc + curr.moderationActions, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total audit log entries recorded
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}
