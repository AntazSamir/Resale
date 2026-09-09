import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  RefreshCw,
  Database,
  Search,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { getAdminSellerVerificationFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/identity")({
  head: () => ({
    meta: [{ title: "Seller Verification | Admin Console | Resale.com" }],
  }),
  component: AdminSellerVerificationPage,
});

interface SellerReputationRow {
  sellerId: string;
  sellerName: string | null;
  sellerPhone: string | null;
  trustScore: number | null;
  trustTier: string | null;
  nidVerified: boolean;
  storeVerified: boolean;
  completedOrdersCount: number;
  upheldDisputesCount: number;
  calculatedAt: string;
}

function trustTierBadgeClass(t: string | null) {
  if (!t) return "bg-muted text-muted-foreground border-border";
  if (t === "TOP_RATED") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  if (t === "VERIFIED_MERCHANT") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  if (t === "RISING") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  return "bg-muted text-muted-foreground border-border";
}

function AdminSellerVerificationPage() {
  const { token } = useAuth() as { token?: string };
  const [rows, setRows] = useState<SellerReputationRow[]>([]);
  const [filtered, setFiltered] = useState<SellerReputationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminSellerVerificationFn({ data: { token } });
      if (!res.success) {
        setError(res.error ?? "Failed to load");
        return;
      }
      setRows(res.data);
      setDataSource(res.dataSource);
    } catch {
      setError("Network error loading seller verification data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let out = rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (r) =>
          (r.sellerName && r.sellerName.toLowerCase().includes(q)) ||
          (r.sellerPhone && r.sellerPhone.toLowerCase().includes(q)) ||
          r.sellerId.toLowerCase().includes(q),
      );
    }
    setFiltered(out);
  }, [rows, search]);

  const topRated = rows.filter((r) => r.trustTier === "TOP_RATED").length;
  const nidVerified = rows.filter((r) => r.nidVerified).length;
  const withDisputes = rows.filter((r) => r.upheldDisputesCount > 0).length;

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell active="identity">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
                <ShieldCheck className="size-7 text-primary" />
                Seller Verification & Trust
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Monitor seller reputation, trust tiers, and identity verification status. (Note: NID
                documents are never exposed here).
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Sellers", count: rows.length, color: "text-foreground" },
              { label: "Top Rated", count: topRated, color: "text-amber-600" },
              { label: "NID Verified", count: nidVerified, color: "text-emerald-600" },
              { label: "With Disputes", count: withDisputes, color: "text-red-600" },
            ].map((s) => (
              <Card key={s.label} className="border-border/60">
                <CardContent className="pt-3 pb-3 text-center">
                  <p className={`text-2xl font-bold font-display ${s.color}`}>{s.count}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border/60">
            <CardHeader className="pb-2 pt-4 flex flex-row flex-wrap gap-3 items-center justify-between border-b border-border/40">
              <div className="flex items-center gap-4">
                <CardTitle className="text-sm font-semibold">
                  {filtered.length} seller{filtered.length !== 1 ? "s" : ""}
                </CardTitle>
                {dataSource && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Database className="size-3" />
                    {dataSource === "SUPABASE_POSTGRESQL" ? "Supabase" : "In-Memory"}
                  </span>
                )}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  className="pl-8 h-8 text-xs"
                  placeholder="Search name, phone…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader />
                </div>
              ) : error ? (
                <p className="text-center text-sm text-destructive py-12">{error}</p>
              ) : filtered.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-12">
                  No sellers match your search.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["Seller", "Trust Score & Tier", "Verification", "Orders", "Disputes"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-2.5 font-semibold text-muted-foreground"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filtered.map((r) => (
                        <tr key={r.sellerId} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2.5">
                            <p className="font-medium text-foreground">{r.sellerName || "—"}</p>
                            <p className="text-muted-foreground">{r.sellerPhone}</p>
                            <p className="text-muted-foreground text-[9px] font-mono mt-0.5">
                              {r.sellerId}
                            </p>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2 mb-1">
                              <Star
                                className={`size-3.5 ${r.trustScore && r.trustScore > 80 ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
                              />
                              <span className="font-semibold text-foreground">
                                {r.trustScore ?? "—"}/100
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-[9px] px-1.5 py-0 rounded uppercase ${trustTierBadgeClass(r.trustTier)}`}
                            >
                              {r.trustTier?.replace("_", " ") || "UNRATED"}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 space-y-1">
                            <div className="flex items-center gap-1.5">
                              {r.nidVerified ? (
                                <CheckCircle2 className="size-3.5 text-emerald-500" />
                              ) : (
                                <XCircle className="size-3.5 text-muted-foreground" />
                              )}
                              <span
                                className={
                                  r.nidVerified
                                    ? "text-emerald-700 font-medium"
                                    : "text-muted-foreground"
                                }
                              >
                                NID Identity
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {r.storeVerified ? (
                                <CheckCircle2 className="size-3.5 text-blue-500" />
                              ) : (
                                <XCircle className="size-3.5 text-muted-foreground" />
                              )}
                              <span
                                className={
                                  r.storeVerified
                                    ? "text-blue-700 font-medium"
                                    : "text-muted-foreground"
                                }
                              >
                                Physical Store
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 font-medium text-foreground text-center sm:text-left">
                            {r.completedOrdersCount}
                          </td>
                          <td className="px-4 py-2.5">
                            {r.upheldDisputesCount > 0 ? (
                              <div className="flex items-center gap-1.5 text-red-600 font-medium">
                                <AlertTriangle className="size-3.5" />
                                {r.upheldDisputesCount} Upheld
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}
