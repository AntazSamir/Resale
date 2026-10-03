import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  User,
  CheckCircle2,
  XCircle,
  FileImage,
  Clock,
  X,
  Eye,
  Search,
} from "lucide-react";
import { adminApi, type SellerVerificationItem } from "@/lib/api-client";
import { Badge, Button, Card, CardContent, Loader } from "@/components/ui";
import { formatDate } from "@/lib/utils";

type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
type FilterTab = "ALL" | "PENDING" | "VERIFIED" | "REJECTED" | "UNVERIFIED";

function statusBadge(status: VerificationStatus) {
  if (status === "VERIFIED")
    return (
      <Badge variant="success" className="gap-1">
        <ShieldCheck className="size-2.5" /> Verified
      </Badge>
    );
  if (status === "PENDING")
    return (
      <Badge variant="warning" className="gap-1">
        <Clock className="size-2.5" /> Pending Review
      </Badge>
    );
  if (status === "REJECTED")
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="size-2.5" /> Rejected
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1">
      <AlertCircle className="size-2.5" /> Unverified
    </Badge>
  );
}

function RejectNoteModal({
  seller,
  onClose,
  onConfirm,
}: {
  seller: SellerVerificationItem;
  onClose: () => void;
  onConfirm: (note: string) => Promise<void>;
}) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(note);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Reject Verification</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{seller.name ?? seller.phone}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Reason for Rejection <span className="text-muted-foreground">(shown to seller)</span>
            </label>
            <textarea
              className="w-full h-24 text-xs rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              placeholder="e.g. NID photo is blurry. Please re-upload a clearer photo."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={loading || !note.trim()}
            >
              {loading ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DocumentPreviewPanel({
  seller,
  onClose,
  onApprove,
  onReject,
  actionInProgress,
}: {
  seller: SellerVerificationItem;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  actionInProgress: boolean;
}) {
  const status = (seller.verificationStatus ?? "UNVERIFIED") as VerificationStatus;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-background border-l border-border h-full overflow-y-auto z-10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-background z-10">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-foreground">{seller.name ?? "—"}</h2>
            <p className="text-[11px] text-muted-foreground font-mono">{seller.phone}</p>
          </div>
          <div className="flex items-center gap-2">
            {statusBadge(status)}
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground ml-1 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-5 space-y-5">
          {/* Seller info */}
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
              {[
                { label: "Email", value: seller.email ?? "—" },
                { label: "Joined", value: formatDate(seller.createdAt) },
                { label: "Listings", value: String(seller.listingCount ?? 0) },
                { label: "Status", value: status },
              ].map((f) => (
                <div key={f.label}>
                  <span className="text-muted-foreground text-[10px] block">{f.label}</span>
                  <span className="font-medium text-foreground">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NID Document */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <FileImage className="size-3.5 text-primary" />
              NID Document
            </h3>
            {seller.nidDocUrl ? (
              <div className="rounded-lg border border-border overflow-hidden bg-muted/20">
                <img
                  src={seller.nidDocUrl}
                  alt="NID Document"
                  className="w-full object-contain max-h-48"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <div className="hidden p-4 text-center text-xs text-muted-foreground">
                  Preview not available (non-image format)
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <FileImage className="size-6 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">No NID document uploaded</p>
              </div>
            )}
          </div>

          {/* Selfie */}
          {seller.selfieUrl && (
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <User className="size-3.5 text-primary" />
                Selfie / Business Document
              </h3>
              <div className="rounded-lg border border-border overflow-hidden bg-muted/20">
                <img
                  src={seller.selfieUrl}
                  alt="Selfie or Business Document"
                  className="w-full object-contain max-h-48"
                />
              </div>
            </div>
          )}

          {/* Rejection note if rejected */}
          {status === "REJECTED" && seller.verificationNote && (
            <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
              <p className="text-[11px] font-semibold text-destructive mb-1">
                Previous Rejection Note
              </p>
              <p className="text-xs text-foreground">{seller.verificationNote}</p>
            </div>
          )}

          {seller.verificationReviewedAt && (
            <p className="text-[10px] text-muted-foreground">
              Last reviewed: {formatDate(seller.verificationReviewedAt)}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {status !== "VERIFIED" && (
          <div className="p-5 border-t border-border space-y-2 sticky bottom-0 bg-background">
            {!seller.nidDocUrl && (
              <p className="text-[10px] text-amber-600 text-center mb-2">
                No documents uploaded yet — cannot approve.
              </p>
            )}
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-9"
              disabled={actionInProgress || !seller.nidDocUrl}
              onClick={onApprove}
            >
              <CheckCircle2 className="size-3.5" />
              {actionInProgress ? "Processing..." : "Approve & Verify Seller"}
            </Button>
            <Button
              variant="destructive"
              className="w-full gap-1.5 text-xs font-semibold h-9"
              disabled={actionInProgress}
              onClick={onReject}
            >
              <XCircle className="size-3.5" />
              Reject with Note
            </Button>
          </div>
        )}
        {status === "VERIFIED" && (
          <div className="p-5 border-t border-border">
            <div className="flex items-center gap-2 justify-center text-emerald-600 text-xs">
              <ShieldCheck className="size-4" />
              <span className="font-semibold">Seller is fully verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Extended type for internal use with all the new fields
interface SellerRow extends SellerVerificationItem {
  verificationStatus: VerificationStatus;
}

export function IdentityPage() {
  const [sellers, setSellers] = useState<SellerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>("ALL");
  const [search, setSearch] = useState("");
  const [previewSeller, setPreviewSeller] = useState<SellerRow | null>(null);
  const [rejectSeller, setRejectSeller] = useState<SellerRow | null>(null);
  const [actionInProgress, setActionInProgress] = useState<Record<string, boolean>>({});

  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getSellerVerification();
      if (res.success && res.data) {
        setSellers(
          res.data.map((s) => ({
            ...s,
            verificationStatus: (s.verificationStatus ?? "UNVERIFIED") as VerificationStatus,
          })),
        );
      } else {
        setError(res.error ?? "Failed to load seller verification data.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Error loading data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSellers();
  }, [fetchSellers]);

  const handleApprove = async (seller: SellerRow) => {
    setActionInProgress((p) => ({ ...p, [seller.id]: true }));
    try {
      const res = await adminApi.actOnSellerVerification(seller.id, "APPROVE");
      if (res.success) {
        setSellers((prev) =>
          prev.map((s) =>
            s.id === seller.id ? { ...s, verificationStatus: "VERIFIED", isVerified: true } : s,
          ),
        );
        setPreviewSeller(null);
      } else {
        alert(res.error ?? "Failed to approve seller.");
      }
    } catch (err: unknown) {
      alert((err as Error)?.message ?? "Error approving seller.");
    } finally {
      setActionInProgress((p) => ({ ...p, [seller.id]: false }));
    }
  };

  const handleConfirmReject = async (note: string) => {
    if (!rejectSeller) return;
    const seller = rejectSeller;
    setActionInProgress((p) => ({ ...p, [seller.id]: true }));
    try {
      const res = await adminApi.actOnSellerVerification(seller.id, "REJECT", note);
      if (res.success) {
        setSellers((prev) =>
          prev.map((s) =>
            s.id === seller.id
              ? { ...s, verificationStatus: "REJECTED", isVerified: false, verificationNote: note }
              : s,
          ),
        );
        setPreviewSeller(null);
        setRejectSeller(null);
      } else {
        alert(res.error ?? "Failed to reject seller.");
      }
    } catch (err: unknown) {
      alert((err as Error)?.message ?? "Error rejecting seller.");
    } finally {
      setActionInProgress((p) => ({ ...p, [seller.id]: false }));
    }
  };

  const filteredSellers = sellers.filter((s) => {
    const matchesFilter =
      filter === "ALL" ||
      (filter === "PENDING" && s.verificationStatus === "PENDING") ||
      (filter === "VERIFIED" && s.verificationStatus === "VERIFIED") ||
      (filter === "REJECTED" && s.verificationStatus === "REJECTED") ||
      (filter === "UNVERIFIED" && s.verificationStatus === "UNVERIFIED");
    if (!matchesFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (s.name ?? "").toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    );
  });

  const counts = {
    total: sellers.length,
    verified: sellers.filter((s) => s.verificationStatus === "VERIFIED").length,
    pending: sellers.filter((s) => s.verificationStatus === "PENDING").length,
    rejected: sellers.filter((s) => s.verificationStatus === "REJECTED").length,
    unverified: sellers.filter((s) => s.verificationStatus === "UNVERIFIED").length,
  };

  const TABS: { key: FilterTab; label: string; count: number }[] = [
    { key: "ALL", label: "All", count: counts.total },
    { key: "PENDING", label: "Pending Review", count: counts.pending },
    { key: "VERIFIED", label: "Verified", count: counts.verified },
    { key: "REJECTED", label: "Rejected", count: counts.rejected },
    { key: "UNVERIFIED", label: "Unverified", count: counts.unverified },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <ShieldCheck className="size-7 text-primary" />
            Seller Identity Verification
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review uploaded NID documents and approve or reject seller accounts. Only verified
            sellers gain trust badges visible to buyers.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchSellers()}
          disabled={loading}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Sellers", count: counts.total, color: "text-foreground", bg: "bg-card" },
          {
            label: "Pending Review",
            count: counts.pending,
            color: "text-amber-600",
            bg: "bg-amber-500/5 border-amber-500/30",
          },
          {
            label: "Verified",
            count: counts.verified,
            color: "text-emerald-600",
            bg: "bg-emerald-500/5 border-emerald-500/30",
          },
          {
            label: "Rejected",
            count: counts.rejected,
            color: "text-red-600",
            bg: "bg-red-500/5 border-red-500/30",
          },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border ${s.bg} p-4`}>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilter(t.key)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                filter === t.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span
                  className={`text-[9px] rounded-full px-1.5 py-0.5 font-bold ${
                    filter === t.key
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto w-full sm:w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            className="w-full h-8 pl-8 pr-3 text-xs rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Search seller name, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Loader className="mx-auto" label="Loading seller verification data..." />
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
                      Seller
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Phone
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Verification Status
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Documents
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Listings
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map((s, i) => {
                    const isBusy = actionInProgress[s.id];
                    const status = s.verificationStatus;
                    return (
                      <tr
                        key={s.id}
                        className={`border-b border-border/40 transition-colors ${
                          i % 2 === 0 ? "" : "bg-muted/10"
                        } hover:bg-muted/20`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{s.name ?? "—"}</div>
                          <div className="text-muted-foreground text-[10px]">
                            {s.email || (s.id ? s.id.slice(0, 12) : "—")}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell font-mono text-foreground">
                          {s.phone}
                        </td>
                        <td className="px-4 py-3 text-center">{statusBadge(status)}</td>
                        <td className="px-4 py-3 text-center">
                          {s.nidDocUrl ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                              <FileImage className="size-3.5" /> NID
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                          {s.selfieUrl && (
                            <span className="inline-flex items-center gap-1 text-blue-600 font-medium ml-2">
                              <User className="size-3.5" /> Selfie
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right hidden md:table-cell font-mono">
                          {s.listingCount ?? 0}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2.5 text-[11px] gap-1"
                              onClick={() => setPreviewSeller(s)}
                            >
                              <Eye className="size-3" /> Review
                            </Button>
                            {status === "PENDING" && (
                              <>
                                <Button
                                  size="sm"
                                  className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                  disabled={isBusy}
                                  onClick={() => void handleApprove(s)}
                                >
                                  <CheckCircle2 className="size-3" />
                                  {isBusy ? "…" : "Approve"}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-7 px-2.5 text-[11px] gap-1"
                                  disabled={isBusy}
                                  onClick={() => setRejectSeller(s)}
                                >
                                  <XCircle className="size-3" /> Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredSellers.length === 0 && (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No sellers match your filter.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Preview Panel */}
      {previewSeller && (
        <DocumentPreviewPanel
          seller={previewSeller}
          onClose={() => setPreviewSeller(null)}
          onApprove={() => void handleApprove(previewSeller)}
          onReject={() => {
            setRejectSeller(previewSeller);
          }}
          actionInProgress={!!actionInProgress[previewSeller.id]}
        />
      )}

      {/* Reject Note Modal */}
      {rejectSeller && (
        <RejectNoteModal
          seller={rejectSeller}
          onClose={() => setRejectSeller(null)}
          onConfirm={handleConfirmReject}
        />
      )}
    </div>
  );
}
