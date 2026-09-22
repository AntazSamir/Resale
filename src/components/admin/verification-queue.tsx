import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/ui/loader";
import { FileSearch, RefreshCw, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import {
  getVerificationQueueFn,
  getVerificationDocumentUrlFn,
  reviewVerificationFn,
  type VerificationRequest,
} from "@/lib/verification.functions";

const DOC_LABELS: Record<string, string> = {
  NID_FRONT: "NID front",
  NID_BACK: "NID back",
  SELFIE_WITH_NID: "Selfie with NID",
  TRADE_LICENSE: "Trade licence",
  UTILITY_BILL: "Address proof",
};

function statusClass(status: string) {
  if (status === "APPROVED") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (status === "REJECTED") return "bg-red-500/10 text-red-600 border-red-500/20";
  return "bg-amber-500/10 text-amber-600 border-amber-500/20";
}

export function VerificationQueue() {
  const { token } = useAuth() as { token?: string };
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getVerificationQueueFn({ data: { token } });
      if (!res.success) {
        setError(res.error ?? "Failed to load verification requests.");
        return;
      }
      setRequests(res.requests);
    } catch {
      setError("Network error loading verification requests.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function openDocument(documentId: string) {
    if (!token) return;
    const res = await getVerificationDocumentUrlFn({ data: { token, documentId } });
    if (res.success) {
      window.open(res.url, "_blank", "noopener,noreferrer");
    } else {
      setError(res.error);
    }
  }

  async function review(userId: string, decision: "APPROVE" | "REJECT") {
    if (!token) return;
    setBusy(userId);
    setError(null);
    try {
      const res = await reviewVerificationFn({
        data: { token, userId, decision, note: notes[userId] ?? "" },
      });
      if (!res.success) {
        setError(res.error);
        return;
      }
      await load();
    } finally {
      setBusy(null);
    }
  }

  const pending = requests.filter((r) => r.status === "PENDING");
  const reviewed = requests.filter((r) => r.status !== "PENDING");

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between border-b border-border/40">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <FileSearch className="size-4 text-primary" />
          Identity review queue
          <span className="text-muted-foreground font-normal">
            ({pending.length} waiting · {reviewed.length} reviewed)
          </span>
        </CardTitle>
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
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader />
          </div>
        ) : requests.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No sellers have submitted documents yet.
          </p>
        ) : (
          [...pending, ...reviewed].map((r) => (
            <div key={r.id} className="rounded-md border border-border/60 p-3 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{r.fullName || "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.phone} {r.email ? `· ${r.email}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.district}
                    {r.address ? ` · ${r.address}` : ""}
                    {r.businessName ? ` · ${r.businessName}` : ""}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    {r.userId} {r.nidLast4 ? `· NID ••••${r.nidLast4}` : ""}
                  </p>
                </div>
                <Badge variant="outline" className={`text-[10px] ${statusClass(r.status)}`}>
                  {r.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {r.documents.length === 0 ? (
                  <span className="text-xs text-muted-foreground">No documents attached.</span>
                ) : (
                  r.documents.map((d) => (
                    <Button
                      key={d.id}
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-[11px] h-7"
                      onClick={() => void openDocument(d.id)}
                    >
                      <ExternalLink className="size-3" />
                      {DOC_LABELS[d.docType] ?? d.docType}
                    </Button>
                  ))
                )}
              </div>

              {r.status === "PENDING" ? (
                <div className="space-y-2">
                  <Textarea
                    rows={2}
                    placeholder="Reason (required when rejecting)"
                    value={notes[r.userId] ?? ""}
                    onChange={(e) => setNotes({ ...notes, [r.userId]: e.target.value })}
                    className="text-xs"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="gap-1.5 text-xs"
                      disabled={busy === r.userId}
                      onClick={() => void review(r.userId, "APPROVE")}
                    >
                      <CheckCircle2 className="size-3.5" /> Approve seller
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs text-destructive"
                      disabled={busy === r.userId}
                      onClick={() => void review(r.userId, "REJECT")}
                    >
                      <XCircle className="size-3.5" /> Reject
                    </Button>
                  </div>
                </div>
              ) : (
                r.reviewNote && (
                  <p className="text-xs text-muted-foreground">Note: {r.reviewNote}</p>
                )
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
