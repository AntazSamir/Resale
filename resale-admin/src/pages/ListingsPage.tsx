import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Database, Filter, Pause, Play, Trash2 } from "lucide-react";
import { adminApi, type AdminListing } from "@/lib/api-client";
import { Badge, Button, Card, CardContent, Input, Loader } from "@/components/ui";
import { taka, formatDate } from "@/lib/utils";

function statusBadgeVariant(s: string): "default" | "secondary" | "warning" | "destructive" {
  if (s === "PUBLISHED" || s === "ACTIVE") return "default";
  if (s === "SOLD") return "secondary";
  if (s === "PAUSED" || s === "RESERVED") return "warning";
  if (s === "REJECTED" || s === "DELISTED") return "destructive";
  return "secondary";
}

export function ListingsPage() {
  const [rows, setRows] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [actionInProgress, setActionInProgress] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getListings();
      if (res.success && res.data) {
        setRows(res.data);
        setDataSource((res as { dataSource?: string }).dataSource ?? "");
      } else {
        setError(res.error ?? "Failed to load listings.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Network error loading listings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAvailability = async (id: string, action: "PAUSE" | "RESUME" | "DELIST") => {
    setActionInProgress((p) => ({ ...p, [id]: true }));
    try {
      const res = await adminApi.setListingAvailability(id, action);
      if (res.success) {
        await load();
      } else {
        alert(res.error ?? `Failed to ${action.toLowerCase()} listing.`);
      }
    } catch (err: unknown) {
      alert((err as Error)?.message ?? "Error.");
    } finally {
      setActionInProgress((p) => ({ ...p, [id]: false }));
    }
  };

  const filtered = rows.filter((r) => {
    const matchStatus =
      filterStatus === "ALL" || r.status === filterStatus || r.availability === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.productName.toLowerCase().includes(q) ||
      r.sellerName.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const statuses = ["ALL", ...Array.from(new Set(rows.map((r) => r.status)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            All marketplace inventory with availability and moderation controls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dataSource && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background px-2.5 py-1.5 rounded-lg border border-border/60">
              <Database className="size-3.5 text-primary" />
              <span className="font-mono">
                {dataSource === "SUPABASE_POSTGRESQL" ? "Supabase" : "Local"}
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => void load()}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by product, seller, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="size-3.5 text-muted-foreground" />
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                filterStatus === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Loader className="mx-auto" label="Loading listings from database..." />
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
                      Product
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Seller
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Grade
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Price
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Listed
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const busy = actionInProgress[r.id];
                    const isPaused = r.status === "PAUSED" || r.availability === "PAUSED";
                    return (
                      <tr
                        key={r.id}
                        className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground line-clamp-1">
                            {r.productName}
                          </div>
                          <div className="text-muted-foreground font-mono text-[10px]">
                            {r.id.slice(0, 8)}…
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-foreground">
                          {r.sellerName}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge variant="outline">{r.grade}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-medium">
                          {taka(r.price)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={statusBadgeVariant(r.status)}>{r.status}</Badge>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                          {formatDate(r.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {isPaused ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[10px] gap-1"
                                disabled={busy}
                                onClick={() => void handleAvailability(r.id, "RESUME")}
                              >
                                <Play className="size-3" /> Resume
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[10px] gap-1"
                                disabled={busy}
                                onClick={() => void handleAvailability(r.id, "PAUSE")}
                              >
                                <Pause className="size-3" /> Pause
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-[10px] gap-1 text-destructive hover:bg-destructive/10"
                              disabled={busy}
                              onClick={() => void handleAvailability(r.id, "DELIST")}
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  {search || filterStatus !== "ALL"
                    ? "No listings match your filters."
                    : "No listings found."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground font-mono">
        Showing {filtered.length} of {rows.length} listings
      </div>
    </div>
  );
}
