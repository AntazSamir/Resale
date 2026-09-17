import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 sm:py-8 space-y-12 sm:space-y-16 animate-in fade-in duration-200">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-12" />
          <span className="text-muted-foreground text-xs">/</span>
          <Skeleton className="h-3.5 w-20" />
          <span className="text-muted-foreground text-xs">/</span>
          <Skeleton className="h-3.5 w-32" />
        </div>

        {/* Product Hero Grid */}
        <div className="grid gap-8 md:gap-12 md:grid-cols-[380px_1fr] lg:grid-cols-[460px_1fr] items-start">
          {/* Product Image */}
          <div className="aspect-square bg-card border border-border/80 overflow-hidden relative">
            <Skeleton className="size-full" />
          </div>

          {/* Product Meta */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 sm:h-10 w-4/5" />
            </div>

            {/* Price Range */}
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Spec Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-7 w-24 border border-border/60" />
              ))}
            </div>

            {/* Grade Availability Strip */}
            <div className="pt-2 space-y-2.5">
              <Skeleton className="h-3 w-36" />
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 border border-border/80 p-2 bg-card/60"
                  >
                    <Skeleton className="h-5 w-10 rounded-xs" />
                    <Skeleton className="h-4 w-18" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Listings Comparison Table Skeleton */}
        <section className="mt-12 sm:mt-16 space-y-4">
          <div className="flex items-end justify-between border-b border-border pb-4">
            <div className="space-y-1.5">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-3.5 w-96" />
            </div>
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="divide-y divide-border/60 border border-border/60 bg-card/20">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-[72px_minmax(0,1fr)_auto_auto] gap-4 p-4 items-center"
              >
                <Skeleton className="hidden md:block size-18 rounded-xs" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-14 rounded-xs" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <Skeleton className="h-3.5 w-48" />
                </div>
                <Skeleton className="h-7 w-28" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-20 rounded-md" />
                  <Skeleton className="h-9 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
