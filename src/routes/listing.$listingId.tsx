import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Check, Lock, ShieldCheck, Star, Truck } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { useCart } from "@/lib/cart-store";
import { GradeBadge } from "@/components/grade-badge";
import {
  galleryShots,
  gradeCriteria,
  gradeLabel,
  grades,
  listings,
  productFor,
  taka,
} from "@/data/catalog";

export const Route = createFileRoute("/listing/$listingId")({
  loader: ({ params }) => {
    const listing = listings.find((l) => l.id === params.listingId);
    const product = listing ? productFor(listing.productId) : undefined;
    if (!listing || !product) throw notFound();
    return { listing, product };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.product.name ?? "Listing";
    const grade = loaderData?.listing.grade ?? "A";
    const title = `${name} · Grade ${grade} — seller listing | Resale.com`;
    const description = `Condition-graded ${name} listed by a verified seller: full inspection report, warranty and invoice status, cash on delivery across Bangladesh.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ListingPage,
});

function ListingPage() {
  const { listing, product } = Route.useLoaderData();
  const [shot, setShot] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const active = galleryShots[shot] ?? galleryShots[0]!;
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const inCart = isInCart(listing.id);

  const transparency = [
    ["Overall condition", `${listing.grade} — ${gradeLabel[listing.grade]}`],
    ["Physical", listing.physical],
    ["Screen", listing.screen],
    ["Battery", listing.battery ? `${listing.battery}%` : "Not applicable"],
    ["Repairs", listing.repairs],
    ["Accessories", listing.accessories],
    ["Invoice", listing.invoice ? "Available" : "Not available"],
    [
      "Warranty",
      listing.warrantyMonths > 0 ? `${listing.warrantyMonths} months remaining` : "Expired",
    ],
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-5 py-10">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link
            to="/products"
            search={{ q: undefined, category: undefined, brand: undefined }}
            className="hover:text-foreground"
          >
            Products
          </Link>
          <span className="px-2">/</span>
          <span className="text-foreground">
            {product.name} &middot; Grade {listing.grade}
          </span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* Gallery */}
          <div>
            <div className="bg-muted">
              <img
                src={product.image}
                alt={`${product.name} — ${active.label.toLowerCase()} view of the unit sold by ${listing.seller.name}`}
                width={900}
                height={900}
                className="aspect-square w-full object-cover"
                style={{ objectPosition: active.position }}
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {galleryShots.map((g, i) => (
                <button
                  key={g.label}
                  onClick={() => setShot(i)}
                  aria-label={`Show ${g.label} photo`}
                  aria-pressed={i === shot}
                  className={`border p-px transition-colors ${
                    i === shot ? "border-primary" : "border-border hover:border-primary/40"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`${g.label} thumbnail`}
                    className="aspect-square w-full object-cover"
                    style={{ objectPosition: g.position }}
                    loading="lazy"
                  />
                  <span className="block py-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {g.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Photos are of this exact unit, uploaded by the seller and checked in moderation.
            </p>
          </div>

          {/* Buy box */}
          <div>
            <div className="flex items-center gap-4">
              <GradeBadge grade={listing.grade} />
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {product.brand}
              </span>
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl">{product.name}</h1>
            <p className="mt-6 font-display text-4xl">{taka(listing.price)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New retail {taka(product.retail)} ·{" "}
              {Math.round((1 - listing.price / product.retail) * 100)}% below retail
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  addToCart(listing.id);
                  navigate({ to: "/cart" });
                }}
                className="flex-1 bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Buy now
              </button>
              <button
                onClick={() => {
                  addToCart(listing.id);
                  setAddedToCart(true);
                }}
                className="flex-1 border border-primary px-6 py-3.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground flex items-center justify-center gap-2"
              >
                {inCart || addedToCart ? (
                  <>
                    <Check className="size-4" /> Added to cart
                  </>
                ) : (
                  "Add to cart"
                )}
              </button>
            </div>

            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="size-4" /> Cash on delivery available · ships from{" "}
              {listing.seller.district}
            </p>

            <div className="mt-8 border border-border p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    {listing.seller.name}
                    {listing.seller.verified && (
                      <ShieldCheck className="size-4 text-success" aria-label="Verified seller" />
                    )}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="size-3.5 fill-current" />
                    {listing.seller.rating} · {listing.seller.sales} completed sales
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">{listing.seller.district}</span>
              </div>
            </div>

            {/* 13.3 transparency block */}
            <section className="mt-10">
              <div className="flex items-end justify-between">
                <h2 className="text-lg">Condition report</h2>
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Score {listing.conditionScore}/100
                </span>
              </div>
              <div className="mt-3 h-px w-full bg-border">
                <div className="h-px bg-primary" style={{ width: `${listing.conditionScore}%` }} />
              </div>
              <dl className="mt-4 border-t border-border">
                {transparency.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-6 border-b border-border py-3 text-sm"
                  >
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                <Lock className="mt-0.5 size-3.5 shrink-0" />
                IMEI and serial number are collected at listing time and shared with the buyer after
                purchase only.
              </p>
            </section>
          </div>
        </div>

        {/* Component-level inspection */}
        <section className="mt-20 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-2xl">Component inspection</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Every listing is graded against a fixed checklist for its category, so the letter
              grade is always backed by structured data.
            </p>
            <dl className="mt-8 border-t border-border">
              {listing.inspection.map((item) => (
                <div
                  key={item.component}
                  className="grid gap-1 border-b border-border py-4 sm:grid-cols-[200px_1fr]"
                >
                  <dt className="text-sm text-muted-foreground">{item.component}</dt>
                  <dd className="text-sm">
                    {item.status}
                    {item.notes && (
                      <span className="mt-1 block text-xs text-subtle-foreground">
                        {item.notes}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="text-2xl">Seller notes</h2>
            <p className="mt-6 border-l border-primary pl-5 text-sm leading-relaxed">
              {listing.sellerNote}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Listed on{" "}
              {new Date(listing.listedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              · Listing {listing.id}
            </p>

            <h3 className="mt-12 text-lg">How grades are assigned</h3>
            <ul className="mt-4 border-t border-border">
              {grades.map((g) => (
                <li
                  key={g}
                  className={`grid gap-3 border-b border-border py-3 sm:grid-cols-[auto_1fr] ${
                    g === listing.grade ? "" : "opacity-55"
                  }`}
                >
                  <span className="grade-chip size-6 text-[11px]">{g}</span>
                  <span className="text-xs">
                    <span className="mr-2 font-medium">{gradeLabel[g]}</span>
                    <span className="text-muted-foreground">{gradeCriteria[g]}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
