import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { getCreatorByHandle, fetchCreatorByHandleAsync, getVideosByCreator } from "@/lib/creator-store";
import { CreatorHero } from "@/components/creator/creator-hero";
import { CreatorVideoCard } from "@/components/creator/creator-video-card";
import { Sparkles, Video, PlaySquare } from "lucide-react";

export const Route = createFileRoute("/creator/$creatorSlug")({
  loader: async ({ params }) => {
    const creator =
      (await fetchCreatorByHandleAsync(params.creatorSlug)) ||
      getCreatorByHandle(params.creatorSlug);
    if (!creator) {
      throw notFound();
    }
    const videos = getVideosByCreator(creator.id);
    return { creator, videos };
  },
  head: ({ loaderData }) => {
    const displayName = loaderData?.creator?.displayName ?? "Tech Creator";
    const title = `${displayName} · Verified Tech Reviews & Graded Hardware | Resale.com`;
    const description = `Watch authentic gadget reviews, camera comparisons, and hardware battery tests by ${displayName} on Resale.com.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
      ],
    };
  },
  component: CreatorPage,
});

function CreatorPage() {
  const { creator, videos } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 w-full space-y-6">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5"
        >
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            search={{ q: undefined, category: undefined, brand: undefined }}
            className="hover:text-foreground transition-colors"
          >
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium flex items-center gap-1">
            <Sparkles className="size-3 text-primary" />
            <span>{creator.displayName}</span>
          </span>
        </nav>

        {/* Creator Hero Header */}
        <CreatorHero creator={creator} />

        {/* Published Reviews Portfolio */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-foreground flex items-center gap-2">
                <PlaySquare className="size-5 text-primary" />
                <span>Reviewed Electronics Portfolio</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                In-depth video diagnostics and sample units tested by {creator.displayName}
              </p>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {videos.length} {videos.length === 1 ? "Review" : "Reviews"}
            </span>
          </div>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
              {videos.map((video) => (
                <CreatorVideoCard key={video.id} video={video} showCreatorInfo={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border bg-muted/20">
              <Video className="size-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-semibold text-foreground">No public reviews yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {creator.displayName} has not published any verified video reviews yet.
              </p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
