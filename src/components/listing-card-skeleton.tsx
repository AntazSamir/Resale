import { Skeleton } from "@/components/ui/skeleton";

interface ListingCardSkeletonProps {
  layout?: "grid" | "list";
  compact?: boolean;
}

export function ListingCardSkeleton({
  layout = "grid",
  compact = false,
}: ListingCardSkeletonProps) {
  if (compact) {
    return (
      <div className="flex flex-col justify-between h-full bg-card border border-border/70 p-3 select-none overflow-hidden rounded-md">
        <div>
          {/* Square Image Placeholder */}
          <div className="relative aspect-square w-full overflow-hidden bg-muted/30 rounded-sm">
            <Skeleton className="size-full" />
            <div className="absolute bottom-1.5 right-1.5">
              <Skeleton className="h-5 w-14 rounded-xs" />
            </div>
          </div>

          {/* Brand & Title */}
          <div className="pt-2.5 space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Price */}
          <div className="mt-2">
            <Skeleton className="h-4.5 w-20" />
          </div>
        </div>

        {/* Actions & Meta */}
        <div className="mt-2.5 pt-2 space-y-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-8 w-full rounded-sm" />
            <Skeleton className="h-8 w-full rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div className="flex flex-col sm:flex-row bg-card p-4 sm:p-5 relative overflow-hidden border border-border/80 rounded-xl gap-4 items-center">
        {/* Thumbnail */}
        <div className="size-28 sm:size-32 bg-muted/20 shrink-0 overflow-hidden relative rounded-lg border border-border/50">
          <Skeleton className="size-full" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2.5 w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-xs" />
            <Skeleton className="h-3 w-28" />
          </div>

          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />

          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-full" />
          </div>
        </div>

        {/* Actions & Price */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/60">
          <Skeleton className="h-6 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  /* Full Grid Mode (default) */
  return (
    <div className="flex flex-col bg-card p-4 relative overflow-hidden border border-border/80 rounded-xl h-full justify-between">
      <div>
        {/* Square Product Image */}
        <div className="aspect-square overflow-hidden bg-muted/20 rounded-lg relative border border-border/40">
          <Skeleton className="size-full" />
          <div className="absolute bottom-2.5 right-2.5">
            <Skeleton className="h-5.5 w-16 rounded-xs" />
          </div>
        </div>

        {/* Brand & Name */}
        <div className="pt-3.5 space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4.5 w-4/5" />
        </div>

        {/* Price */}
        <div className="mt-2.5">
          <Skeleton className="h-5.5 w-24" />
        </div>

        {/* Badges */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>

      {/* Footer Meta & Buttons */}
      <div className="mt-3.5 pt-3 space-y-3 border-t border-border/60">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-18" />
          <Skeleton className="h-3.5 w-24" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
