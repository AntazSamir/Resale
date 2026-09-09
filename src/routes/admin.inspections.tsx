import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Database, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { getAdminInspectionsFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/inspections")({
  head: () => ({
    meta: [{ title: "Inspections | Admin Console | Resale.com" }],
  }),
  component: AdminInspectionsPage,
});

interface InspectionRow {
  id: string;
  listingId: string;
  productName: string;
  component: string;
  status: string;
  notes: string | null;
}

function statusIcon(s: string) {
  const u = s.toUpperCase();
  if (u === "PASS" || u === "PASSED") return <CheckCircle2 className="size-4 text-emerald-500" />;
  if (u === "FAIL" || u === "FAILED") return <XCircle className="size-4 text-red-500" />;
  return <MinusCircle className="size-4 text-muted-foreground" />;
}

function AdminInspectionsPage() {
  const { token } = useAuth() as { token?: string };
  const [rows, setRows] = useState<InspectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");
  const [expandedListing, setExpandedListing] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminInspectionsFn({ data: { token } });
      if (!res.success) {
        setError(res.error ?? "Failed to load");
        return;
      }
      setRows(res.data);
      setDataSource(res.dataSource);
    } catch {
      setError("Network error loading inspections.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  // Group by listingId
  const byListing = rows.reduce<Record<string, { productName: string; items: InspectionRow[] }>>(
    (acc, r) => {
      if (!acc[r.listingId]) acc[r.listingId] = { productName: r.productName, items: [] };
      acc[r.listingId]!.items.push(r);
      return acc;
    },
    {},
  );

  const listingEntries = Object.entries(byListing);
  const totalPass = rows.filter(
    (r) => r.status.toUpperCase() === "PASS" || r.status.toUpperCase() === "PASSED",
  ).length;
  const totalFail = rows.filter(
    (r) => r.status.toUpperCase() === "FAIL" || r.status.toUpperCase() === "FAILED",
  ).length;

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell active="inspections">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
                <Search className="size-7 text-primary" />
                Inspections
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                32-point inspection records stored against each listing.
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
              { label: "Inspections", count: rows.length, color: "text-foreground" },
              { label: "Listings", count: listingEntries.length, color: "text-blue-600" },
              { label: "Pass", count: totalPass, color: "text-emerald-600" },
              { label: "Fail", count: totalFail, color: "text-red-600" },
            ].map((s) => (
              <Card key={s.label} className="border-border/60">
                <CardContent className="pt-3 pb-3 text-center">
                  <p className={`text-2xl font-bold font-display ${s.color}`}>{s.count}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader />
            </div>
          ) : error ? (
            <p className="text-center text-sm text-destructive py-12">{error}</p>
          ) : rows.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/30">
              <CardContent className="text-center py-12">
                <Search className="size-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="font-semibold text-foreground mb-1">No Inspection Records</p>
                <p className="text-sm text-muted-foreground">
                  The <code>inspection_items</code> table exists but contains no records yet.
                  Inspection data will appear here once listings go through the 32-point
                  verification workflow.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/60">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  {listingEntries.length} listing{listingEntries.length !== 1 ? "s" : ""} inspected
                </CardTitle>
                {dataSource && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Database className="size-3" />
                    {dataSource === "SUPABASE_POSTGRESQL" ? "Supabase" : "In-Memory"}
                  </span>
                )}
              </CardHeader>
              <CardContent className="p-0 divide-y divide-border/60">
                {listingEntries.map(([listingId, { productName, items }]) => {
                  const isOpen = expandedListing === listingId;
                  const passCount = items.filter((i) =>
                    i.status.toUpperCase().startsWith("PASS"),
                  ).length;
                  return (
                    <div key={listingId}>
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-left"
                        onClick={() => setExpandedListing(isOpen ? null : listingId)}
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{productName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {listingId.slice(0, 16)}…
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          >
                            {passCount}/{items.length} Pass
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {isOpen ? "▲" : "▼"}
                          </span>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="border-t border-border/60 bg-muted/10">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-border/40 bg-muted/20">
                                <th className="text-left px-6 py-2 text-muted-foreground font-semibold">
                                  Component
                                </th>
                                <th className="text-left px-4 py-2 text-muted-foreground font-semibold">
                                  Result
                                </th>
                                <th className="text-left px-4 py-2 text-muted-foreground font-semibold">
                                  Notes
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                              {items.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/20">
                                  <td className="px-6 py-2 font-medium text-foreground">
                                    {item.component}
                                  </td>
                                  <td className="px-4 py-2">
                                    <div className="flex items-center gap-1.5">
                                      {statusIcon(item.status)}
                                      <span className="uppercase font-semibold text-[10px]">
                                        {item.status}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2 text-muted-foreground">
                                    {item.notes || "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}
