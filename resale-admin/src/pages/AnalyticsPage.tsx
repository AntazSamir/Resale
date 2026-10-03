import { useState, useEffect, useCallback } from "react";
import { RefreshCw, BarChart3, TrendingUp, Package, Layers } from "lucide-react";
import { adminApi, type AnalyticsData } from "@/lib/api-client";
import { Button, Card, CardContent, CardHeader, CardTitle, Loader } from "@/components/ui";
import { taka } from "@/lib/utils";

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getAnalytics();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error ?? "Failed to load analytics.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Error loading analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  const timeline = data?.timeline ?? [];
  const categoryVolume = data?.categoryVolume ?? [];

  const totalGmv = timeline.reduce((sum, item) => sum + (item.gmvBDT || 0), 0);
  const totalOrders = timeline.reduce((sum, item) => sum + (item.orders || 0), 0);
  const totalListings = timeline.reduce((sum, item) => sum + (item.listings || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Platform performance metrics, monthly sales trends, and category distribution.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchAnalytics()}
          disabled={loading}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="py-24 flex items-center justify-center">
          <Loader label="Loading analytics data..." />
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-8 text-center text-destructive text-sm">{error}</CardContent>
        </Card>
      ) : data ? (
        <>
          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border border-border/60 p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-emerald-600" /> Total GMV
              </p>
              <p className="text-3xl font-bold font-display text-foreground">{taka(totalGmv)}</p>
            </div>
            <div className="bg-card rounded-xl border border-border/60 p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <BarChart3 className="size-3.5 text-blue-600" /> Total Orders
              </p>
              <p className="text-3xl font-bold font-display text-foreground">
                {totalOrders.toLocaleString()}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border/60 p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Package className="size-3.5 text-purple-600" /> New Listings
              </p>
              <p className="text-3xl font-bold font-display text-foreground">
                {totalListings.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Monthly Timeline Trend */}
          {timeline.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="size-4 text-muted-foreground" /> Monthly Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Month
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Orders
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          GMV (BDT)
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          New Listings
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Moderation Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeline.map((row, i) => (
                        <tr
                          key={row.month}
                          className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${
                            i % 2 === 0 ? "" : "bg-muted/10"
                          }`}
                        >
                          <td className="px-4 py-2.5 font-mono text-foreground">{row.month}</td>
                          <td className="px-4 py-2.5 text-right font-mono">{row.orders}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-medium text-emerald-600">
                            {taka(row.gmvBDT)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono">{row.listings}</td>
                          <td className="px-4 py-2.5 text-right font-mono">
                            {row.moderationActions}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category Volume */}
          {categoryVolume.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="size-4 text-muted-foreground" /> Volume by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Category
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          Orders
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                          GMV (BDT)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryVolume.map((c, i) => (
                        <tr
                          key={c.category}
                          className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${
                            i % 2 === 0 ? "" : "bg-muted/10"
                          }`}
                        >
                          <td className="px-4 py-2.5 font-medium text-foreground">{c.category}</td>
                          <td className="px-4 py-2.5 text-right font-mono">{c.orders}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-medium text-emerald-600">
                            {taka(c.gmvBDT)}
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
