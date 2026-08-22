import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, FileText, ShieldCheck, Sparkles, Star, Tag, ChevronRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GradeBadge } from "@/components/grade-badge";
import { ProductCard } from "@/components/product-card";
import { ConditionScore } from "@/components/condition-score";
import {
  cheapest,
  gradeCriteria,
  gradeLabel,
  grades,
  listingsFor,
  productFor,
  products,
  taka,
} from "@/data/catalog";

import { getApprovedVideosForProduct } from "@/lib/creator-store";
import { CreatorReviewStrip } from "@/components/creator/creator-review-strip";
import { StoreBadge } from "@/components/storefront/store-badge";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = productFor(params.productId);
    if (!product) throw notFound();
    const videos = getApprovedVideosForProduct(params.productId);
    return { product, videos };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.product.name ?? "Product";
    const title = `${name} — compare seller listings | Resale.com`;
    const description = `Compare graded pre-owned ${name} listings from verified sellers in Bangladesh, with condition reports, warranty status and cash on delivery.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, videos } = Route.useLoaderData();
  const rows = listingsFor(product.id);
  const best = cheapest(product.id);
  const high = rows.length > 0 ? rows[rows.length - 1] : undefined;
  const available = grades.filter((g) => rows.some((l) => l.grade === g));

  // Related products: same category first, then others
  const others = products.filter((p) => p.id !== product.id && listingsFor(p.id).length > 0);
  const sameCategory = others.filter((p) => p.category === product.category);
  const different = others.filter((p) => p.category !== product.category);
  const related = [...sameCategory, ...different].slice(0, 3);

  // Best value: product with lowest listing price among products with listings
  const productsWithListings = products.filter((p) => listingsFor(p.id).length > 0);
  const bestDealProduct =
    productsWithListings.length > 0
      ? productsWithListings.reduce((acc, p) => {
          const c1 = cheapest(acc.id);
          const c2 = cheapest(p.id);
          if (!c1) return p;
          if (!c2) return acc;
          return c2.price < c1.price ? p : acc;
        }, productsWithListings[0]!)
      : undefined;

  const bestDealCheapest = bestDealProduct ? cheapest(bestDealProduct.id) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 sm:px-5 py-8 sm:py-10">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="px-2">/</span>
          <span>{product.category}</span>
          <span className="px-2">/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 md:grid-cols-2 items-start">
          <div className="bg-muted border border-border/60 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              width={900}
              height={900}
              className="w-full aspect-square object-cover"
            />
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-muted-foreground">
              {product.brand}
            </p>
            <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold text-foreground">
              {product.name}
            </h1>

            {/* Price band or best price */}
            {best ? (
              <div className="pt-2">
                <span className="font-display text-2xl md:text-3xl font-bold text-primary">
                  {taka(best.price)}
                </span>
                {high && high.price !== best.price && (
                  <span className="ml-2 text-sm text-muted-foreground font-display">
                    – {taka(high.price)}
                  </span>
                )}
                <span className="ml-3 text-xs text-muted-foreground">
                  (Ref. new: {taka(product.retail)})
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No listings currently available</p>
            )}

            {/* Quick specs pill row */}
            <div className="flex flex-wrap gap-2 pt-2">
              {product.specs.map((s) => (
                <span
                  key={s.label}
                  className="bg-secondary text-subtle-foreground px-2.5 py-1 text-xs font-mono font-medium border border-border/60"
                >
                  <span className="text-muted-foreground">{s.label}: </span>
                  {s.value}
                </span>
              ))}
            </div>

            {/* Grades in stock */}
            {available.length > 0 && (
              <div className="pt-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Condition Grades Available
                </p>
                <div className="flex flex-wrap gap-2">
                  {available.map((g) => {
                    const count = rows.filter((l) => l.grade === g).length;
                    const fromPrice = rows.filter((l) => l.grade === g)[0]?.price;
                    return (
                      <div
                        key={g}
                        className="flex items-center gap-2 border border-border/80 px-3 py-1.5 bg-card/60"
                      >
                        <GradeBadge grade={g} />
                        <div className="text-xs">
                          <span className="font-semibold text-foreground">
                            {fromPrice ? taka(fromPrice) : ""}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            ({count} {count === 1 ? "unit" : "units"})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Creator Hands-On Video Reviews Strip ── */}
        {videos && videos.length > 0 && (
          <div className="mt-12">
            <CreatorReviewStrip videos={videos} productName={product.name} />
          </div>
        )}

        {/* ── All Listings Table with Condition Score Pills & Verified Badges ── */}
        <section className="mt-12 sm:mt-16">
          <div className="flex items-end justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                All listings for this product
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every unit is individually inspected and documented with an exact condition grade.
              </p>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              {rows.length > 0 ? "Sorted by price" : "No active listings"}
            </p>
          </div>

          {rows.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-border mt-6">
              <p className="text-muted-foreground text-sm">
                There are no units of {product.name} currently available.
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <Link
                  to="/"
                  className="text-xs uppercase tracking-wider font-semibold border border-border px-4 py-2 hover:bg-secondary"
                >
                  Browse Other Electronics
                </Link>
                <Link
                  to="/sell"
                  className="text-xs uppercase tracking-wider font-semibold bg-primary text-primary-foreground px-4 py-2 hover:opacity-90"
                >
                  Sell This Item
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {rows.map((l) => (
                <li
                  key={l.id}
                  className="grid grid-cols-1 gap-4 py-6 md:grid-cols-[72px_minmax(0,1fr)_auto_auto] md:items-center md:gap-4 lg:grid-cols-[88px_minmax(0,1fr)_auto_auto] lg:gap-6 hover:bg-card/40 transition-colors px-2"
                >
                  <div className="hidden bg-muted md:block overflow-hidden border border-border/40">
                    <img
                      src={product.image}
                      alt={`${product.name} unit listed by ${l.seller.name}`}
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-2">
                    {/* Header line: Condition Pill + Seller + NID Badge + Optional Store Badge */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <ConditionScore score={l.conditionScore} grade={l.grade} compact />

                      <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        {l.seller.name}
                        {l.seller.verified ? (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9.5px] font-semibold"
                            title="NID Verified Seller"
                          >
                            <ShieldCheck className="size-2.5" />
                            <span>NID Verified</span>
                          </span>
                        ) : (
                          <span className="text-[9.5px] text-muted-foreground bg-secondary px-1.5 py-0.5 border border-border/40">
                            Not Verified
                          </span>
                        )}
                        {(l.storeId || l.storeName) && (
                          <StoreBadge storeId={l.storeId} storeName={l.storeName} />
                        )}
                      </span>

                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        <span>{l.seller.rating.toFixed(1)}</span>
                        <span>({l.seller.sales} sales)</span>
                      </span>

                      <span className="text-xs text-muted-foreground">· {l.seller.district}</span>
                    </div>

                    {/* Secondary meta */}
                    <p className="text-xs text-subtle-foreground leading-relaxed">
                      {l.warrantyMonths > 0 ? `${l.warrantyMonths} mo warranty` : "No warranty"} ·{" "}
                      {l.invoice ? "Invoice included" : "No invoice"}
                      {typeof l.battery === "number" ? ` · Battery ${l.battery}%` : ""} ·{" "}
                      {l.accessories}
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      Physical: {l.physical} · Screen: {l.screen}
                      {l.repairs && l.repairs.toLowerCase() !== "none"
                        ? ` · Repairs: ${l.repairs}`
                        : ""}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="font-display text-2xl font-bold text-primary">{taka(l.price)}</p>
                  </div>

                  <Link
                    to="/listing/$listingId"
                    params={{ listingId: l.id }}
                    className="inline-flex items-center justify-center border border-primary bg-primary/5 px-5 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground text-center"
                  >
                    View unit →
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="size-4 text-emerald-500 shrink-0" /> Every listing above has passed
            moderation and includes a standardized 32-point inspection report.
          </p>
        </section>

        {/* ── Full Technical Specifications Section (Grouped) ── */}
        <section className="mt-16 sm:mt-20 border border-border bg-card/60 p-6 space-y-6">
          <div className="border-b border-border/40 pb-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              Full Technical Specifications
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Standard manufacturer specifications for {product.name}
            </p>
          </div>

          {Array.isArray(product.fullSpecs) && product.fullSpecs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.fullSpecs.map((group) => (
                <div
                  key={group.group}
                  className="border border-border/60 bg-background/50 p-4 space-y-3"
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/40 pb-2">
                    {group.group}
                  </h3>
                  <dl className="space-y-2 text-xs">
                    {group.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-0.5">
                        <dt className="text-[11px] text-muted-foreground font-medium">
                          {item.label}
                        </dt>
                        <dd className="text-xs text-foreground font-medium">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          ) : (
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {product.specs.map((spec, i) => (
                <div key={i} className="p-3 border border-border/60 bg-background/50">
                  <dt className="text-muted-foreground font-medium">{spec.label}</dt>
                  <dd className="mt-1 font-semibold text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* ── What the Grades Mean ── */}
        <section className="mt-16 sm:mt-20">
          <div className="flex items-end justify-between border-b border-border pb-4">
            <h2 className="font-display text-2xl font-bold text-foreground">
              What the grades mean
            </h2>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="size-3.5" /> Same standardized checklist for every seller
            </p>
          </div>
          <ul className="grid md:grid-cols-2 gap-x-8">
            {grades.map((g) => (
              <li
                key={g}
                className="grid gap-3 border-b border-border py-4 sm:grid-cols-[auto_1fr] items-start"
              >
                <span className="grade-chip size-7 text-xs shrink-0">{g}</span>
                <div className="text-xs">
                  <span className="font-semibold text-foreground block">{gradeLabel[g]}</span>
                  <span className="text-muted-foreground mt-0.5 block leading-relaxed">
                    {gradeCriteria[g]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Related Products & Deals ── */}
        {related.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <div className="flex items-end justify-between border-b border-border pb-4">
              <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Related Products &amp; Deals
              </h2>
              <Link
                to="/products"
                search={{ q: undefined, category: undefined, brand: undefined }}
                className="text-xs font-semibold text-primary hover:underline transition-colors flex items-center gap-0.5"
              >
                Browse all <ChevronRight className="size-3.5" />
              </Link>
            </div>

            {/* Best value banner */}
            {bestDealProduct && bestDealCheapest && (
              <div className="mt-6 flex items-center gap-4 border border-amber-500/30 bg-amber-500/10 px-5 py-4">
                <Tag className="size-5 shrink-0 text-amber-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-bold uppercase tracking-widest text-amber-500">
                    🔥 Best Listed Price Right Now
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground truncate">
                    {bestDealProduct.name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-xl font-bold text-amber-500">
                    {taka(bestDealCheapest.price)}
                  </p>
                </div>
                <Link
                  to="/product/$productId"
                  params={{ productId: bestDealProduct.id }}
                  className="shrink-0 inline-flex items-center justify-center border border-amber-500 text-amber-500 px-4 py-2 text-xs font-semibold transition-colors hover:bg-amber-500 hover:text-black"
                >
                  View
                </Link>
              </div>
            )}

            {/* Related product cards */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-3 items-stretch auto-rows-fr">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
