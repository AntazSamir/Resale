import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { getListingAuditHistoryFn } from "@/lib/server-functions";
import type { ListingAuditEntry } from "@/lib/types";

interface AuditHistorySheetProps {
  listingId: string;
  productName: string;
  token: string;
}

export function AuditHistorySheet({ listingId, productName, token }: AuditHistorySheetProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<ListingAuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getListingAuditHistoryFn({ data: { token, listingId } });
      if (res.success && res.data) {
        setHistory(res.data as ListingAuditEntry[]);
      } else {
        setError(res.error || "Failed to load audit history.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchHistory();
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "APPROVED":
        return <CheckCircle2 className="size-4 text-emerald-500" />;
      case "REJECTED":
        return <XCircle className="size-4 text-destructive" />;
      case "SUBMITTED":
      case "RESUBMITTED":
        return <Clock className="size-4 text-amber-500" />;
      case "EDIT_TRIGGERED_REVIEW":
        return <AlertCircle className="size-4 text-orange-500" />;
      case "SEED_INGESTED":
        return <Shield className="size-4 text-primary" />;
      default:
        return <FileText className="size-4 text-muted-foreground" />;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <History className="size-3.5" />
          Audit Trail
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-base">
            <History className="size-4 text-primary" />
            Listing Lifecycle History
          </SheetTitle>
          <SheetDescription className="text-xs">
            Immutable server audit log for{" "}
            <strong className="text-foreground">{productName}</strong> ({listingId}).
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-2">
            <RefreshCw className="size-5 animate-spin" />
            <p className="text-xs">Loading audit events...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 text-destructive text-xs rounded-md">{error}</div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground space-y-2">
            <Shield className="size-8 mx-auto text-muted-foreground/40" />
            <p className="text-sm font-medium">No prior recorded moderation history</p>
            <p className="text-xs max-w-xs mx-auto">
              This listing predates Phase 5.1 governance tracking or has not yet recorded lifecycle
              events.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 border-l border-border space-y-6">
            {history.map((event) => (
              <div key={event.id} className="relative space-y-1.5">
                {/* Node icon */}
                <div className="absolute -left-7.75 top-0.5 bg-background p-1 rounded-full border border-border">
                  {getActionIcon(event.action)}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground tracking-tight">
                      {event.action.replace(/_/g, " ")}
                    </span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                      {event.actorRole}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formatTime(event.createdAt)}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  Status transitioned from{" "}
                  <span className="font-medium text-foreground">
                    {event.previousStatus || "Initial"}
                  </span>{" "}
                  &rarr; <span className="font-medium text-foreground">{event.newStatus}</span>
                </div>

                {event.reasonText && (
                  <div className="p-2.5 bg-muted/50 rounded text-xs border border-border/50 text-foreground/90 mt-1 leading-relaxed">
                    {event.reasonCode && (
                      <span className="font-semibold text-destructive block mb-0.5 text-[11px]">
                        [{event.reasonCode}]
                      </span>
                    )}
                    {event.reasonText}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
