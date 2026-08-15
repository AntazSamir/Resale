import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, FileText, ShieldCheck, Star } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GradeBadge } from "@/components/grade-badge";
import {
  cheapest,
  gradeCriteria,
  gradeLabel,
  grades,
  listingsFor,
  productFor,
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
  const high = rows[rows.length - 1] ?? best;
  const available = grades.filter((g) => rows.some((l) => l.grade === g));

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
            <p className="mt-6 font-display text-3xl">from {taka(best.price)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {rows.length} seller listings · {taka(best.price)} – {taka(high.price)} · new retail{" "}
              {taka(product.retail)}
            </p>

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
            <p className="text-sm text-muted-foreground">Sorted by price</p>
          </div>

          <ul>
            {rows.map((l) => (
              <li
                key={l.id}
                className="grid grid-cols-1 gap-6 border-b border-border py-6 md:grid-cols-[88px_1fr_auto_auto] md:items-center"
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
                        <ShieldCheck className="size-4 text-success" aria-label="Verified seller" />
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
      </div>
      <SiteFooter />
    </div>
  );
}
