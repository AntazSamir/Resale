import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PackageSearch, Search, RefreshCw, Database, Filter } from "lucide-react";
import { taka } from "@/data/catalog";
import { useAuth } from "@/lib/auth-store";
import { getAdminListingsFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/listings")({
  head: () => ({
    meta: [{ title: "Listings Inventory | Admin Console | Resale.com" }],
  }),
  component: AdminListingsPage,
});

interface ListingRow {
  id: string;
  productName: string;
  productId: string;
  sellerId: string;
  sellerName: string;
  grade: string;
  conditionScore: number;
  priceBDT: number;
  moderationStatus: string;
  status: string;
  isSeed: boolean;
  listedAt: string;
  submittedAt: string | null;
}

function modBadgeClass(s: string) {
  if (s === "APPROVED") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (s === "PENDING_REVIEW" || s === "PENDING_MODERATION")
    return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  if (s === "REJECTED") return "bg-red-500/10 text-red-600 border-red-500/20";
  return "bg-muted text-muted-foreground border-border";
}

function statusBadgeClass(s: string) {
  if (s === "PUBLISHED" || s === "ACTIVE") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  if (s === "SOLD") return "bg-violet-500/10 text-violet-600 border-violet-500/20";
  if (s === "PAUSED" || s === "RESERVED")
    return "bg-orange-500/10 text-orange-600 border-orange-500/20";
  if (s === "REJECTED" || s === "DELISTED") return "bg-red-500/10 text-red-600 border-red-500/20";
  return "bg-muted text-muted-foreground border-border";
}

function AdminListingsPage() {
  const { token } = useAuth() as { token?: string };
  const [rows, setRows] = useState<ListingRow[]>([]);
  const [filtered, setFiltered] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filterMod, setFilterMod] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminListingsFn({ data: { token } });
      if (!res.success) {
        setError(res.error ?? "Failed to load");
        return;
      }
      setRows(res.data);
      setDataSource(res.dataSource);
    } catch {
      setError("Network error loading listings.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let out = rows;
    if (filterMod !== "ALL") out = out.filter((r) => r.moderationStatus === filterMod);
    if (filterStatus !== "ALL") out = out.filter((r) => r.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (r) =>
          r.productName.toLowerCase().includes(q) ||
          r.sellerName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }
    setFiltered(out);
  }, [rows, search, filterMod, filterStatus]);

  const MOD_STATUSES = ["ALL", "PENDING_REVIEW", "APPROVED", "REJECTED"];
  const OP_STATUSES = [
    "ALL",
    "PUBLISHED",
    "ACTIVE",
    "PAUSED",
    "RESERVED",
    "SOLD",
    "REJECTED",
    "DELISTED",
  ];

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell active="listings">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
                <PackageSearch className="size-7 text-primary" />
                Listings Inventory
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Full marketplace inventory — read-only. Use Moderation Queue to approve/reject.
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

          {/* Filters */}
          <Card className="border-border/60">
            <CardContent className="pt-4 pb-4 flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-48">
                <label className="text-xs text-muted-foreground block mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    className="pl-8 h-8 text-xs"
                    placeholder="Product, seller, ID…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  <Filter className="size-3 inline mr-1" />
                  Moderation
                </label>
                <select
                  className="h-8 text-xs border border-input rounded-md px-2 bg-background"
                  value={filterMod}
                  onChange={(e) => setFilterMod(e.target.value)}
                >
                  {MOD_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  <Filter className="size-3 inline mr-1" />
                  Status
                </label>
                <select
                  className="h-8 text-xs border border-input rounded-md px-2 bg-background"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {OP_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total", count: rows.length, color: "text-foreground" },
              {
                label: "Pending",
                count: rows.filter((r) => r.moderationStatus === "PENDING_REVIEW").length,
                color: "text-amber-600",
              },
              {
                label: "Approved",
                count: rows.filter((r) => r.moderationStatus === "APPROVED").length,
                color: "text-emerald-600",
              },
              {
                label: "Rejected",
                count: rows.filter((r) => r.moderationStatus === "REJECTED").length,
                color: "text-red-600",
              },
            ].map((s) => (
              <Card key={s.label} className="border-border/60">
                <CardContent className="pt-3 pb-3 text-center">
                  <p className={`text-2xl font-bold font-display ${s.color}`}>{s.count}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table */}
          <Card className="border-border/60">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
              </CardTitle>
              {dataSource && (
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Database className="size-3" />
                  {dataSource === "SUPABASE_POSTGRESQL" ? "Supabase" : "In-Memory"}
                </span>
              )}
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
                  No listings match your filters.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {[
                          "Product",
                          "Seller",
                          "Grade",
                          "Price",
                          "Moderation",
                          "Status",
                          "Listed",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-2.5 font-semibold text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filtered.slice(0, 200).map((r) => (
                        <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2.5">
                            <p className="font-medium text-foreground truncate max-w-40">
                              {r.productName}
                            </p>
                            <p className="text-muted-foreground text-[10px] font-mono">
                              {r.id.slice(0, 12)}…
                            </p>
                            {r.isSeed && (
                              <span className="text-[9px] bg-muted px-1 py-0.5 rounded text-muted-foreground">
                                SEED
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground truncate max-w-28">
                            {r.sellerName}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="font-mono font-bold text-primary">{r.grade}</span>
                            <span className="text-muted-foreground ml-1">({r.conditionScore})</span>
                          </td>
                          <td className="px-4 py-2.5 font-medium">{taka(r.priceBDT * 100)}</td>
                          <td className="px-4 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0.5 ${modBadgeClass(r.moderationStatus)}`}
                            >
                              {r.moderationStatus.replace("_", " ")}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0.5 ${statusBadgeClass(r.status)}`}
                            >
                              {r.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {r.listedAt ? new Date(r.listedAt).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length > 200 && (
                    <p className="text-center text-xs text-muted-foreground py-3">
                      Showing first 200 of {filtered.length} listings.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}
