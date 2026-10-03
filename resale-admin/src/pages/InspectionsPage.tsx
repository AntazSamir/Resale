import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Search, ShieldCheck, AlertCircle } from "lucide-react";
import { adminApi, type InspectionItem } from "@/lib/api-client";
import { Badge, Button, Card, CardContent, Input, Loader } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export function InspectionsPage() {
  const [items, setItems] = useState<InspectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchInspections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getInspections();
      if (res.success && res.data) {
        setItems(res.data);
      } else {
        setError(res.error ?? "Failed to load inspections.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Error loading inspections.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInspections();
  }, [fetchInspections]);

  const filtered = items.filter((i) => {
    const q = search.toLowerCase();
    return !q || i.productName.toLowerCase().includes(q) || i.id.toLowerCase().includes(q);
  });

  const passed = items.filter((i) => i.passed).length;
  const failed = items.filter((i) => !i.passed).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Inspections</h1>
          <p className="text-muted-foreground text-sm mt-1">
            32-point quality inspection records for all submitted listings.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchInspections()}
          disabled={loading}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border/60 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total</p>
          <p className="text-2xl font-bold font-display">{items.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
            <ShieldCheck className="size-3.5" /> Passed
          </p>
          <p className="text-2xl font-bold font-display text-emerald-600">{passed}</p>
        </div>
        <div className="bg-card rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
            <AlertCircle className="size-3.5" /> Failed
          </p>
          <p className="text-2xl font-bold font-display text-destructive">{failed}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by product or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-9 text-xs"
        />
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Loader className="mx-auto" label="Loading inspection records..." />
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
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Grade
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Score
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Result
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Inspector
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => (
                    <tr
                      key={item.id}
                      className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{item.productName}</div>
                        <div className="text-muted-foreground font-mono text-[10px]">
                          {item.id.slice(0, 8)}…
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline">{item.grade}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">{item.conditionScore}/100</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={item.passed ? "success" : "destructive"}>
                          {item.passed ? "Passed" : "Failed"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                        {item.inspector ?? "System"}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                        {item.inspectedAt ? formatDate(item.inspectedAt) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No inspection records found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
