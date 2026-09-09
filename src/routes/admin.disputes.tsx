import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCw, Database } from "lucide-react";
import { taka } from "@/data/catalog";
import { useAuth } from "@/lib/auth-store";
import { getAdminDisputesFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/disputes")({
  head: () => ({
    meta: [{ title: "Dispute Mediation | Admin Console | Resale.com" }],
  }),
  component: AdminDisputesPage,
});

interface DisputeRow {
  id: string;
  orderId: string;
  reason: string;
  explanation: string;
  status: string;
  createdAt: string;
  amountBDT: number | null;
}

function statusBadgeClass(s: string) {
  const u = s.toUpperCase();
  if (u === "OPEN") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  if (u.startsWith("RESOLVED")) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  return "bg-muted text-muted-foreground border-border";
}

function AdminDisputesPage() {
  const { token } = useAuth() as { token?: string };
  const [rows, setRows] = useState<DisputeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminDisputesFn({ data: { token } });
      if (!res.success) {
        setError(res.error ?? "Failed to load");
        return;
      }
      setRows(res.data);
      setDataSource(res.dataSource);
    } catch {
      setError("Network error loading disputes.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCount = rows.filter((r) => r.status.toUpperCase() === "OPEN").length;
  const resolvedCount = rows.filter((r) => r.status.toUpperCase().startsWith("RESOLVED")).length;

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell active="disputes">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
                <ShieldAlert className="size-7 text-primary" />
                Dispute Mediation
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Manage and mediate order disputes between buyers and sellers.
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

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Disputes", count: rows.length, color: "text-foreground" },
              { label: "Open Cases", count: openCount, color: "text-amber-600" },
              { label: "Resolved", count: resolvedCount, color: "text-emerald-600" },
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
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {rows.length} dispute{rows.length !== 1 ? "s" : ""}
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
              ) : rows.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-12">
                  No disputes found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["ID", "Order ID", "Amount", "Reason", "Status", "Date"].map((h) => (
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
                      {rows.map((r) => (
                        <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2.5 font-mono text-muted-foreground text-[10px]">
                            {r.id.slice(0, 8)}…
                          </td>
                          <td className="px-4 py-2.5 font-mono text-foreground">
                            {r.orderId.slice(0, 12)}…
                          </td>
                          <td className="px-4 py-2.5 font-medium">
                            {r.amountBDT !== null ? taka(r.amountBDT * 100) : "—"}
                          </td>
                          <td className="px-4 py-2.5">
                            <p className="font-medium">{r.reason.replace(/_/g, " ")}</p>
                            <p className="text-muted-foreground truncate max-w-xs">
                              {r.explanation}
                            </p>
                          </td>
                          <td className="px-4 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0.5 ${statusBadgeClass(r.status)}`}
                            >
                              {r.status.replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString()}
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
