import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, RefreshCw, Database, Search, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { getAdminUsersFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [{ title: "Users | Admin Console | Resale.com" }],
  }),
  component: AdminUsersPage,
});

interface UserRow {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  role: string;
  verified: boolean;
  createdAt: string;
}

function roleBadgeClass(r: string) {
  const u = r.toUpperCase();
  if (u === "ADMIN") return "bg-primary text-primary-foreground border-primary";
  if (u === "SELLER") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  return "bg-muted text-muted-foreground border-border";
}

function AdminUsersPage() {
  const { token } = useAuth() as { token?: string };
  const [rows, setRows] = useState<UserRow[]>([]);
  const [filtered, setFiltered] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminUsersFn({ data: { token } });
      if (!res.success) {
        setError(res.error ?? "Failed to load");
        return;
      }
      setRows(res.data);
      setDataSource(res.dataSource);
    } catch {
      setError("Network error loading users.");
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
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.phone && r.phone.toLowerCase().includes(q)) ||
          (r.email && r.email.toLowerCase().includes(q)) ||
          r.id.toLowerCase().includes(q),
      );
    }
    setFiltered(out);
  }, [rows, search]);

  const buyers = rows.filter((r) => r.role === "BUYER").length;
  const sellers = rows.filter((r) => r.role === "SELLER").length;
  const admins = rows.filter((r) => r.role === "ADMIN").length;

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell active="users">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
                <Users className="size-7 text-primary" />
                User Management
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Directory of all registered buyers, sellers, and administrators.
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
              { label: "Total Users", count: rows.length, color: "text-foreground" },
              { label: "Buyers", count: buyers, color: "text-muted-foreground" },
              { label: "Sellers", count: sellers, color: "text-blue-600" },
              { label: "Admins", count: admins, color: "text-primary" },
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
                  {filtered.length} user{filtered.length !== 1 ? "s" : ""}
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
                  placeholder="Search name, phone, email…"
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
                <p className="text-center text-sm text-muted-foreground py-12">No users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["User", "Contact", "Role", "Verification", "Joined"].map((h) => (
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
                            <p className="font-medium text-foreground">{r.name || "—"}</p>
                            <p className="text-muted-foreground text-[10px] font-mono">{r.id}</p>
                          </td>
                          <td className="px-4 py-2.5">
                            <p className="text-foreground">{r.phone || "—"}</p>
                            <p className="text-muted-foreground">{r.email}</p>
                          </td>
                          <td className="px-4 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0.5 ${roleBadgeClass(r.role)}`}
                            >
                              {r.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5">
                            {r.verified ? (
                              <div className="flex items-center gap-1 text-emerald-600 font-medium">
                                <ShieldCheck className="size-3.5" /> Verified
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unverified</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length > 200 && (
                    <p className="text-center text-xs text-muted-foreground py-3">
                      Showing first 200 of {filtered.length} users.
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
