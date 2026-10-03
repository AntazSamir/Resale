import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Users, Search, ShieldCheck, AlertCircle } from "lucide-react";
import { adminApi, type AdminUser } from "@/lib/api-client";
import { Badge, Button, Card, CardContent, Input, Loader } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      } else {
        setError(res.error ?? "Failed to load users.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Error loading users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const roles = ["ALL", ...Array.from(new Set(users.map((u) => u.role)))];

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (u.name?.toLowerCase().includes(q) ?? false) ||
      u.phone.toLowerCase().includes(q) ||
      (u.email?.toLowerCase().includes(q) ?? false);
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">
            All registered platform accounts and their roles.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchUsers()}
          disabled={loading}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border/60 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <Users className="size-3.5" /> Total Users
          </p>
          <p className="text-2xl font-bold font-display">{users.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" /> Admin Users
          </p>
          <p className="text-2xl font-bold font-display">
            {users.filter((u) => u.isAdmin || u.role === "ADMIN").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <AlertCircle className="size-3.5" /> Sellers
          </p>
          <p className="text-2xl font-bold font-display">
            {users.filter((u) => u.role === "SELLER").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, phone, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                roleFilter === r
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Loader className="mx-auto" label="Loading users..." />
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
                      User
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Phone
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Role
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Listings
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Orders
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr
                      key={u.id}
                      className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{u.name ?? "—"}</div>
                        <div className="text-muted-foreground text-[10px]">
                          {u.email ?? u.id.slice(0, 12)}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell font-mono text-foreground">
                        {u.phone}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={
                            u.isAdmin || u.role === "ADMIN"
                              ? "warning"
                              : u.role === "SELLER"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell font-mono">
                        {u.listingCount ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell font-mono">
                        {u.orderCount ?? 0}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                        {formatDate(u.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No users match your filters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground font-mono">
        Showing {filtered.length} of {users.length} users
      </div>
    </div>
  );
}
