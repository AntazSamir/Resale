import { useState, useEffect, useCallback } from "react";
import { Check, X, AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { adminApi, type ModerationItem, type ListingRejectionReasonCode } from "@/lib/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Loader } from "@/components/ui";
import { taka, formatDate } from "@/lib/utils";

const REJECTION_REASONS: { code: ListingRejectionReasonCode; label: string }[] = [
  { code: "INCOMPLETE_INFO", label: "Incomplete / Missing Information" },
  { code: "MISLEADING_PRICE", label: "Misleading / Incorrect Pricing" },
  { code: "COUNTERFEIT", label: "Counterfeit or Fake Device" },
  { code: "PROHIBITED_ITEM", label: "Prohibited / Banned Item" },
  { code: "LOW_QUALITY_IMAGES", label: "Low Quality / Missing Images" },
  { code: "WRONG_CATEGORY", label: "Incorrect Category" },
  { code: "OTHER", label: "Other (specify below)" },
];

function RejectionDialog({
  item,
  onClose,
  onConfirm,
}: {
  item: ModerationItem;
  onClose: () => void;
  onConfirm: (code: ListingRejectionReasonCode, text: string) => Promise<void>;
}) {
  const [code, setCode] = useState<ListingRejectionReasonCode>("INCOMPLETE_INFO");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(code, text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-background border border-border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 z-10">
        <div>
          <h2 className="text-base font-bold text-foreground">Reject Listing</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{item.productName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Rejection Reason</label>
            {REJECTION_REASONS.map((r) => (
              <label key={r.code} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="rejectionCode"
                  value={r.code}
                  checked={code === r.code}
                  onChange={() => setCode(r.code)}
                  className="accent-primary"
                />
                <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                  {r.label}
                </span>
              </label>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Additional Notes (optional)
            </label>
            <textarea
              className="w-full h-20 text-xs rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              placeholder="Describe the specific issue..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" size="sm" disabled={loading}>
              {loading ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ModerationPage() {
  const [queue, setQueue] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<Record<string, boolean>>({});
  const [rejectItem, setRejectItem] = useState<ModerationItem | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getModerationQueue();
      if (res.success && res.data) {
        setQueue(res.data);
      } else {
        setError(res.error ?? "Failed to fetch moderation queue.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Error fetching queue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchQueue();
  }, [fetchQueue]);

  const handleApprove = async (listingId: string) => {
    try {
      setActionInProgress((prev) => ({ ...prev, [listingId]: true }));
      const res = await adminApi.moderateListing(listingId, "APPROVE");
      if (res.success) {
        setQueue((prev) => prev.filter((i) => i.id !== listingId));
      } else {
        alert(res.error ?? "Failed to approve listing.");
      }
    } catch (err: unknown) {
      alert((err as Error)?.message ?? "Error approving listing.");
    } finally {
      setActionInProgress((prev) => ({ ...prev, [listingId]: false }));
    }
  };

  const handleConfirmReject = async (
    reasonCode: ListingRejectionReasonCode,
    reasonText: string,
  ) => {
    if (!rejectItem) return;
    const listingId = rejectItem.id;
    try {
      setActionInProgress((prev) => ({ ...prev, [listingId]: true }));
      const res = await adminApi.moderateListing(listingId, "REJECT", reasonCode, reasonText);
      if (res.success) {
        setQueue((prev) => prev.filter((i) => i.id !== listingId));
      } else {
        alert(res.error ?? "Failed to reject listing.");
      }
    } finally {
      setActionInProgress((prev) => ({ ...prev, [listingId]: false }));
      setRejectItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-display font-bold">Listing Moderation Workbench</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Inspect and approve seller listings before they become publicly discoverable.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchQueue()}
          disabled={loading}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant="secondary" className="font-mono text-xs">
          {queue.length} Pending Review
        </Badge>
        <span className="text-xs text-muted-foreground">
          All submissions undergo mandatory 32-point check review.
        </span>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Loader className="mx-auto" label="Loading moderation queue from database..." />
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-8 text-center text-destructive space-y-2">
            <AlertTriangle className="size-6 mx-auto" />
            <p className="text-sm font-medium">{error}</p>
          </CardContent>
        </Card>
      ) : queue.length === 0 ? (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="py-16 text-center space-y-2">
            <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <Check className="size-6" />
            </div>
            <p className="text-lg font-semibold text-foreground">Moderation Queue is Clear</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There are currently no seller listings waiting in{" "}
              <code className="text-xs">PENDING_REVIEW</code> status.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {queue.map((item) => {
            const discountVsRetail =
              item.retailPrice > 0
                ? Math.round(((item.retailPrice - item.price) / item.retailPrice) * 100)
                : 0;
            const isBusy = actionInProgress[item.id];

            return (
              <Card key={item.id} className="overflow-hidden border-border/80 shadow-sm">
                <CardHeader className="bg-muted/40 py-4 px-6 flex-row items-center justify-between border-b border-border/50 gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <CardTitle className="text-base font-bold tracking-tight">
                        {item.productName}
                      </CardTitle>
                      <Badge variant="outline">{item.grade}</Badge>
                      <Badge variant="secondary">Score {item.conditionScore}/100</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span>
                        ID:{" "}
                        <strong className="font-mono text-foreground">
                          {item.id.slice(0, 8)}…
                        </strong>
                      </span>
                      <span>·</span>
                      <span>
                        Seller: <strong className="text-foreground">{item.sellerName}</strong>
                        {item.sellerVerified ? " ✓" : ""}
                      </span>
                      <span>·</span>
                      <span>Submitted: {formatDate(item.submittedAt)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-bold text-xl text-primary">
                      {taka(item.price)}
                    </p>
                    {discountVsRetail > 0 && (
                      <p className="text-[11px] text-muted-foreground">
                        {discountVsRetail}% below retail
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  {/* Metadata strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-muted/20 rounded-md border border-border/40 text-xs">
                    {[
                      {
                        label: "Warranty",
                        value:
                          item.warrantyMonths > 0 ? `${item.warrantyMonths} Months` : "No Warranty",
                      },
                      {
                        label: "Original Invoice",
                        value: item.hasInvoice ? "Available" : "Not Provided",
                      },
                      {
                        label: "Battery Health",
                        value: item.batteryHealth ? `${item.batteryHealth}%` : "— Not recorded",
                      },
                      { label: "Accessories", value: item.accessories || "Device only" },
                    ].map((f) => (
                      <div key={f.label}>
                        <span className="text-muted-foreground block text-[11px]">{f.label}</span>
                        <span
                          className="font-medium text-foreground truncate block"
                          title={f.value}
                        >
                          {f.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Expanded details */}
                  {expanded === item.id && (
                    <div className="p-4 bg-muted/40 rounded-md space-y-3 border border-border text-xs">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <span className="font-semibold block mb-1">Seller Notes:</span>
                          <p className="text-muted-foreground bg-background p-2.5 rounded border border-border leading-relaxed">
                            {item.sellerNote || "No specific notes."}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">Repairs & Servicing:</span>
                          <p className="text-muted-foreground bg-background p-2.5 rounded border border-border leading-relaxed">
                            {item.repairs || "No repair history disclosed."}
                          </p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border flex items-center justify-between text-muted-foreground text-[11px]">
                        <span>
                          Seller Phone:{" "}
                          <strong className="text-foreground">
                            {item.sellerPhone || "Private"}
                          </strong>
                        </span>
                        <span>
                          Category: <strong className="text-foreground">{item.category}</strong>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpanded((c) => (c === item.id ? null : item.id))}
                      className="h-8 text-xs gap-1"
                    >
                      {expanded === item.id ? (
                        <>
                          <ChevronUp className="size-3.5" /> Less Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-3.5" /> Full Inspection Details
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setRejectItem(item)}
                        disabled={isBusy}
                        className="h-9 px-4 gap-1.5 text-xs font-semibold"
                      >
                        <X className="size-3.5" />
                        Reject / Request Fixes
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => void handleApprove(item.id)}
                        disabled={isBusy}
                        className="h-9 px-5 gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Check className="size-3.5 stroke-[2.5]" />
                        {isBusy ? "Approving..." : "Approve & Publish"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {rejectItem && (
        <RejectionDialog
          item={rejectItem}
          onClose={() => setRejectItem(null)}
          onConfirm={handleConfirmReject}
        />
      )}
    </div>
  );
}
