import { useState, useEffect, useCallback } from "react";
import { RefreshCw, AlertTriangle, Clock, User } from "lucide-react";
import { adminApi, type DisputeItem } from "@/lib/api-client";
import { Badge, Button, Card, CardContent, Loader } from "@/components/ui";
import { formatDate, taka } from "@/lib/utils";

function statusVariant(s: string): "destructive" | "warning" | "success" | "secondary" {
  if (s === "OPEN" || s === "ESCALATED") return "destructive";
  if (s === "UNDER_REVIEW" || s === "MEDIATION") return "warning";
  if (s === "RESOLVED" || s === "CLOSED") return "success";
  return "secondary";
}

export function DisputesPage() {
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getDisputes();
      if (res.success && res.data) {
        setDisputes(res.data);
      } else {
        setError(res.error ?? "Failed to load disputes.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Error loading disputes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDisputes();
  }, [fetchDisputes]);

  const statuses = ["ALL", ...Array.from(new Set(disputes.map((d) => d.status)))];
  const filtered = disputes.filter((d) => statusFilter === "ALL" || d.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Disputes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Buyer-seller mediation claims requiring administrative oversight.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchDisputes()}
          disabled={loading}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Open Disputes
          </p>
          <p className="text-2xl font-bold font-display text-destructive">
            {disputes.filter((d) => d.status === "OPEN" || d.status === "ESCALATED").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Under Review</p>
          <p className="text-2xl font-bold font-display">
            {disputes.filter((d) => d.status === "UNDER_REVIEW" || d.status === "MEDIATION").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Total Disputes
          </p>
          <p className="text-2xl font-bold font-display">{disputes.length}</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Loader className="mx-auto" label="Loading disputes..." />
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-8 text-center text-destructive text-sm">{error}</CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground text-sm">
            No disputes {statusFilter !== "ALL" ? `with status "${statusFilter}"` : "found"}.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <Card
              key={d.id}
              className={`border-border/70 ${d.status === "OPEN" || d.status === "ESCALATED" ? "border-destructive/30" : ""}`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-3.5 text-destructive shrink-0" />
                      <span className="text-xs font-semibold text-foreground">{d.reason}</span>
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      Order: {d.orderId.slice(0, 12)}…
                    </p>
                  </div>
                  <Badge variant={statusVariant(d.status)}>{d.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="size-3" /> Buyer:{" "}
                    <span className="text-foreground font-medium">{d.buyerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="size-3" /> Seller:{" "}
                    <span className="text-foreground font-medium">{d.sellerName}</span>
                  </div>
                  {d.amountBDT && (
                    <div className="text-muted-foreground">
                      Amount:{" "}
                      <span className="text-foreground font-mono font-medium">
                        {taka(d.amountBDT)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3" /> {formatDate(d.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
