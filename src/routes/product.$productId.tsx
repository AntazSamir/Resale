import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, FileText, ShieldCheck, Sparkles, Star, Tag } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GradeBadge } from "@/components/grade-badge";
import { ProductCard } from "@/components/product-card";
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

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = productFor(params.productId);
    if (!product) throw notFound();
    return { product };
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
  const { product } = Route.useLoaderData();
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
      <div className="mx-auto max-w-7xl px-5 py-10">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="px-2">/</span>
          <span>{product.category}</span>
          <span className="px-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-12 md:grid-cols-2">
          <div className="bg-muted">
            <img
              src={product.image}
              alt={product.name}
              width={900}
              height={900}
              className="w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {product.brand}
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl">{product.name}</h1>

            {best ? (
              <>
                <p className="mt-6 font-display text-3xl">from {taka(best.price)}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {rows.length} seller listing{rows.length > 1 ? "s" : ""} · prices from{" "}
                  {taka(best.price)}
                  {high && high.id !== best.id ? ` to ${taka(high.price)}` : ""}
                </p>
              </>
            ) : (
              <div className="mt-6 p-4 rounded-md bg-muted/60 border border-border">
                <p className="font-display text-xl text-muted-foreground">Currently Out of Stock</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No active listings for this item right now. Have one to sell?{" "}
                  <Link to="/sell" className="text-primary underline">
                    List yours here
                  </Link>
                  .
                </p>
              </div>
            )}

            {available.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                {available.map((g) => (
                  <span key={g} className="inline-flex items-center gap-2 text-xs">
                    <span className="grade-chip size-6 text-[11px]">{g}</span>
                    <span className="text-subtle-foreground">
                      {gradeLabel[g]} · {rows.filter((l) => l.grade === g).length}
                    </span>
                  </span>
                ))}
              </div>
            )}

            <dl className="mt-8 border-t border-border">
              {product.specs.map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between border-b border-border py-3 text-sm"
                >
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section className="mt-20">
          <div className="flex items-end justify-between border-b border-border pb-4">
            <h2 className="text-2xl">All listings for this product</h2>
            <p className="text-sm text-muted-foreground">
              {rows.length > 0 ? "Sorted by price" : "No active listings"}
            </p>
          </div>

          {rows.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-border rounded-lg mt-6">
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
            <ul>
              {rows.map((l) => (
                <li
                  key={l.id}
                  className="grid grid-cols-1 gap-6 border-b border-border py-6 md:grid-cols-[72px_minmax(0,1fr)_auto_auto] md:items-center md:gap-4 lg:grid-cols-[88px_minmax(0,1fr)_auto_auto] lg:gap-6"
                >
                  <div className="hidden bg-muted md:block">
                    <img
                      src={product.image}
                      alt={`${product.name} unit listed by ${l.seller.name}`}
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-4">
                      <GradeBadge grade={l.grade} />
                      <span className="flex items-center gap-1 text-sm">
                        {l.seller.name}
                        {l.seller.verified && (
                          <ShieldCheck
                            className="size-4 text-success"
                            aria-label="Verified seller"
                          />
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="size-3.5 fill-current" />
                        {l.seller.rating} · {l.seller.sales} sales
                      </span>
                      <span className="text-sm text-muted-foreground">{l.seller.district}</span>
                    </div>
                    <p className="mt-2 text-sm text-subtle-foreground">
                      {l.warrantyMonths > 0 ? `${l.warrantyMonths} mo warranty` : "No warranty"} ·{" "}
                      {l.invoice ? "Invoice available" : "No invoice"}
                      {l.battery ? ` · Battery ${l.battery}%` : ""} · {l.accessories}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Condition score {l.conditionScore}/100 · {l.physical}
                    </p>
                  </div>
                  <p className="font-display text-2xl md:text-right">{taka(l.price)}</p>
                  <Link
                    to="/listing/$listingId"
                    params={{ listingId: l.id }}
                    className="inline-flex items-center justify-center border border-primary px-5 py-2.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    View listing
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="size-4" /> Every listing above passed listing moderation and carries a
            full condition report.
          </p>
        </section>

        <section className="mt-20">
          <div className="flex items-end justify-between border-b border-border pb-4">
            <h2 className="text-2xl">What the grades mean</h2>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="size-4" /> Same checklist for every seller
            </p>
          </div>
          <ul className="grid md:grid-cols-2">
            {grades.map((g) => (
              <li
                key={g}
                className="grid gap-4 border-b border-border py-5 sm:grid-cols-[auto_1fr]"
              >
                <span className="grade-chip size-7 text-xs">{g}</span>
                <span className="text-sm">
                  <span className="block font-medium">{gradeLabel[g]}</span>
                  <span className="mt-1 block text-muted-foreground">{gradeCriteria[g]}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Related Products & Deals ── */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between border-b border-border pb-4">
              <h2 className="text-2xl flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Related Products &amp; Deals
              </h2>
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse all →
              </Link>
            </div>

            {/* Best value banner */}
            {bestDealProduct && bestDealCheapest && (
              <div className="mt-6 flex items-center gap-4 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 px-5 py-4">
                <Tag className="size-5 shrink-0 text-amber-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                    🔥 Best Listed Price Right Now
                  </p>
                  <p className="mt-0.5 text-sm font-medium truncate">{bestDealProduct.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-xl font-bold text-amber-700 dark:text-amber-400">
                    {taka(bestDealCheapest.price)}
                  </p>
                </div>
                <Link
                  to="/product/$productId"
                  params={{ productId: bestDealProduct.id }}
                  className="shrink-0 inline-flex items-center justify-center border border-amber-600 text-amber-700 dark:text-amber-400 dark:border-amber-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-amber-600 hover:text-white"
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
