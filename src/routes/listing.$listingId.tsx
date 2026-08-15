import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ShieldCheck, Star, Truck } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GradeBadge } from "@/components/grade-badge";
import { gradeLabel, listings, productFor, taka } from "@/data/catalog";

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
      ],
    };
  },
  component: ListingPage,
});

function ListingPage() {
  const { listing, product } = Route.useLoaderData();

  const condition = [
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
            to="/product/$productId"
            params={{ productId: product.id }}
            className="hover:text-foreground"
          >
            {product.name}
          </Link>
          <span className="px-2">/</span>
          <span className="text-foreground">Listing {listing.id}</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="bg-muted">
            <img
              src={product.image}
              alt={`${product.name} unit sold by ${listing.seller.name}`}
              width={900}
              height={900}
              className="w-full object-cover"
            />
          </div>

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
              <button className="flex-1 bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                Buy now
              </button>
              <button className="flex-1 border border-primary px-6 py-3.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground">
                Add to cart
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

            <section className="mt-10">
              <h2 className="text-lg">Condition report</h2>
              <dl className="mt-4 border-t border-border">
                {condition.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-6 border-b border-border py-3 text-sm">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">
                IMEI and serial number are collected at listing time and shared with the buyer after
                purchase only.
              </p>
            </section>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}