import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, PauseCircle, Ban, Tag, FileEdit } from "lucide-react";

interface ListingStatusBadgeProps {
  status: string;
  moderationStatus?: string;
  className?: string;
}

export function ListingStatusBadge({
  status,
  moderationStatus,
  className = "",
}: ListingStatusBadgeProps) {
  // If explicitly under review or draft
  if (moderationStatus === "DRAFT" || status === "DRAFT") {
    return (
      <Badge
        variant="outline"
        className={`bg-muted/40 text-muted-foreground border-muted-foreground/30 gap-1.5 font-medium py-1 px-2.5 ${className}`}
      >
        <FileEdit className="size-3.5" />
        Draft
      </Badge>
    );
  }

  if (
    moderationStatus === "PENDING_REVIEW" ||
    status === "PENDING_REVIEW" ||
    status === "PENDING_MODERATION"
  ) {
    return (
      <Badge
        variant="outline"
        className={`bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1.5 font-medium py-1 px-2.5 ${className}`}
      >
        <Clock className="size-3.5 animate-pulse" />
        Pending Review
      </Badge>
    );
  }

  if (moderationStatus === "REJECTED" || status === "REJECTED") {
    return (
      <Badge
        variant="outline"
        className={`bg-destructive/10 text-destructive border-destructive/30 gap-1.5 font-medium py-1 px-2.5 ${className}`}
      >
        <XCircle className="size-3.5" />
        Revisions Required
      </Badge>
    );
  }

  if (status === "PAUSED") {
    return (
      <Badge
        variant="outline"
        className={`bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 gap-1.5 font-medium py-1 px-2.5 ${className}`}
      >
        <PauseCircle className="size-3.5" />
        Paused (Hidden)
      </Badge>
    );
  }

  if (status === "SOLD") {
    return (
      <Badge
        variant="outline"
        className={`bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 gap-1.5 font-medium py-1 px-2.5 ${className}`}
      >
        <Tag className="size-3.5" />
        Sold
      </Badge>
    );
  }

  if (status === "DELISTED") {
    return (
      <Badge
        variant="outline"
        className={`bg-zinc-500/10 text-zinc-500 border-zinc-500/30 gap-1.5 font-medium py-1 px-2.5 ${className}`}
      >
        <Ban className="size-3.5" />
        Delisted
      </Badge>
    );
  }

  // ACTIVE / PUBLISHED
  return (
    <Badge
      variant="outline"
      className={`bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1.5 font-medium py-1 px-2.5 ${className}`}
    >
      <CheckCircle2 className="size-3.5" />
      Active & Public
    </Badge>
  );
}
