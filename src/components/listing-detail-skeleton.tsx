import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export function ListingDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-12 animate-in fade-in duration-200">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-12" />
          <span className="text-muted-foreground text-xs">/</span>
          <Skeleton className="h-3.5 w-16" />
          <span className="text-muted-foreground text-xs">/</span>
          <Skeleton className="h-3.5 w-28" />
          <span className="text-muted-foreground text-xs">/</span>
          <Skeleton className="h-3.5 w-20" />
        </div>

        {/* Above the fold: 2-column grid */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1.15fr] items-start">
          {/* Left: Gallery Skeleton */}
          <div className="space-y-3 lg:sticky lg:top-24">
            <div className="aspect-square w-full bg-card border border-border/70 relative overflow-hidden">
              <Skeleton className="size-full" />
              <div className="absolute top-3 left-3">
                <Skeleton className="h-6 w-16 rounded-xs" />
              </div>
            </div>

            {/* Thumbnail Skeletons */}
            <div className="grid grid-cols-4 gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border border-border/70 p-1 bg-card space-y-1">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-2.5 w-10 mx-auto" />
                </div>
              ))}
            </div>

            <Skeleton className="h-3.5 w-3/4" />
          </div>

          {/* Right: Product & Offer Info Skeleton */}
          <div className="space-y-6">
            {/* Seller Line */}
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Brand & Title */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 sm:h-9 w-4/5" />
            </div>

            {/* Condition Score Gauge */}
            <div className="p-4 border border-border/80 bg-card/60 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Trust Pills */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-32" />
            </div>

            {/* Price Box & Action CTAs */}
            <div className="p-5 border border-border bg-card space-y-4">
              <div className="flex items-baseline justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-8 w-36" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Skeleton className="h-11 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3.5 w-32" />
              </div>
            </div>

            {/* Inspection Preview Skeleton */}
            <div className="border border-border/80 p-4 bg-card/40 space-y-3">
              <Skeleton className="h-4.5 w-44" />
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 p-2 border border-border/50">
                    <Skeleton className="size-4 shrink-0 rounded-xs" />
                    <Skeleton className="h-3.5 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
