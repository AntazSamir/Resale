import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { getCreators } from "@/lib/creator-store";
import { getStores } from "@/lib/store-store";
import {
  ShieldCheck,
  Star,
  MapPin,
  ArrowRight,
  Store,
  Video,
  Search,
  CheckCircle2,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/sellers")({
  head: () => ({
    meta: [
      { title: "Verified Pro Sellers & Tech Creators — Resale" },
      {
        name: "description",
        content:
          "Discover trusted pre-owned device shops and tech reviewer profiles across Bangladesh. 32-point inspection, transparent condition grading, and verified warranties.",
      },
    ],
  }),
  component: SellersPage,
});

type TabType = "all" | "sellers" | "creators";

function SellersPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const creators = useMemo(() => getCreators(), []);
  const stores = useMemo(() => getStores(), []);

  // Filtered lists
  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      const matchesSearch =
        c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.bio && c.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [creators, searchQuery]);

  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.tagline && s.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.area && s.area.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [stores, searchQuery]);

  const showSellers = activeTab === "all" || activeTab === "sellers";
  const showCreators = activeTab === "all" || activeTab === "creators";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Header / Hero Section */}
        <section className="border-b border-border/80 bg-card/40 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="font-semibold text-foreground">Sellers &amp; Creators</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Verified Directory
                </span>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-1">
                  Verified Pro Sellers &amp; Tech Creators
                </h1>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Browse authenticated gadget shops, certified refurbished outlets, and reputable
                  tech reviewers offering graded devices backed by physical store inspections.
                </p>
              </div>

              {/* Stats badges */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="border border-border/80 bg-card px-4 py-2.5 rounded-lg text-center shadow-2xs">
                  <p className="text-xs text-muted-foreground">Pro Stores</p>
                  <p className="text-lg font-bold text-foreground">{stores.length}</p>
                </div>
                <div className="border border-border/80 bg-card px-4 py-2.5 rounded-lg text-center shadow-2xs">
                  <p className="text-xs text-muted-foreground">Tech Creators</p>
                  <p className="text-lg font-bold text-foreground">{creators.length}</p>
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Category tabs */}
              <div className="inline-flex p-1 bg-secondary border border-border rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                    activeTab === "all"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({stores.length + creators.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("sellers")}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                    activeTab === "sellers"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Store className="size-3.5" />
                  <span>Pro Stores ({stores.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("creators")}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                    activeTab === "creators"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Video className="size-3.5" />
                  <span>Tech Creators ({creators.length})</span>
                </button>
              </div>

              {/* Search filter input */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stores, creators, cities..."
                  className="w-full bg-card border border-border rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Directory Content Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* Pro Stores */}
          {showSellers && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Store className="size-4.5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Verified Pro Stores</h2>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                    {filteredStores.length}
                  </span>
                </div>
              </div>

              {filteredStores.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border rounded-lg bg-card/50">
                  <p className="text-sm text-muted-foreground">
                    No stores found matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredStores.map((store) => (
                    <div
                      key={store.id}
                      className="group relative rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between hover:shadow-md hover:border-border transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="relative size-14 shrink-0">
                            {store.logoUrl ? (
                              <img
                                src={store.logoUrl}
                                alt={store.name}
                                className="size-14 rounded-full object-cover border border-border/60 shadow-xs"
                              />
                            ) : (
                              <div className="size-14 rounded-full bg-secondary text-foreground flex items-center justify-center font-bold text-base border border-border/60 shadow-xs">
                                {store.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded uppercase tracking-wider">
                            Pro Store
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {store.name}
                        </h3>

                        {store.tagline && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {store.tagline}
                          </p>
                        )}

                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-foreground">
                            {store.rating.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">({store.totalSales} sales)</span>
                          <span className="mx-0.5 text-muted-foreground/50">|</span>
                          <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
                            <ShieldCheck className="size-3.5 text-emerald-600" /> Verified
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                          <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">
                            {store.area ? `${store.area}, ` : ""}
                            {store.district}, Bangladesh
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">Inspected units</span>
                        <Link
                          to="/store/$storeSlug"
                          params={{ storeSlug: store.slug }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-emerald-600/40 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                        >
                          Visit Store <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tech Creators */}
          {showCreators && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Video className="size-4.5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    Tech Reviewers &amp; Creators
                  </h2>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                    {filteredCreators.length}
                  </span>
                </div>
              </div>

              {filteredCreators.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border rounded-lg bg-card/50">
                  <p className="text-sm text-muted-foreground">
                    No tech creators found matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredCreators.map((creator) => (
                    <div
                      key={creator.id}
                      className="group relative rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between hover:shadow-md hover:border-border transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="relative size-14 shrink-0">
                            {creator.avatarUrl ? (
                              <img
                                src={creator.avatarUrl}
                                alt={creator.displayName}
                                className="size-14 rounded-full object-cover border border-border/60 shadow-xs"
                              />
                            ) : (
                              <div className="size-14 rounded-full bg-black text-white flex items-center justify-center font-bold text-base border border-border/60 shadow-xs">
                                {creator.displayName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase tracking-wider">
                            Creator
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {creator.displayName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">@{creator.handle}</p>

                        {creator.bio && (
                          <p className="text-xs text-muted-foreground/90 mt-2.5 line-clamp-2 leading-relaxed">
                            {creator.bio}
                          </p>
                        )}

                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-foreground">4.8</span>
                          <span className="text-muted-foreground">
                            ({creator.totalReviews} reviews)
                          </span>
                          <span className="mx-0.5 text-muted-foreground/50">|</span>
                          <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
                            <ShieldCheck className="size-3.5 text-emerald-600" /> Verified
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">Curated Picks</span>
                        <Link
                          to="/creator/$creatorSlug"
                          params={{ creatorSlug: creator.handle }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-primary/40 text-primary hover:bg-primary/5 rounded transition-colors"
                        >
                          View Reviews <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
