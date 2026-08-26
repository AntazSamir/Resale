import { useState, useEffect } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  Check,
  Truck,
  AlertTriangle,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Battery,
  Box,
  Play,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { useCart } from "@/lib/cart-store";
import { trackActiveEvent } from "@/lib/event-tracker";
import { GradeBadge } from "@/components/grade-badge";
import { ProductCard } from "@/components/product-card";
import { ConditionScore } from "@/components/condition-score";
import { InspectionReport } from "@/components/inspection-report";
import { RepairHistoryCard } from "@/components/repair-history";
import { DeviceVerificationCard } from "@/components/device-verification";
import { WhatsIncludedCard } from "@/components/whats-included";
import { SellerTrustLine } from "@/components/seller-trust-card";
import { getApprovedVideoForListing } from "@/lib/creator-store";
import { CreatorVideoModal } from "@/components/creator/creator-video-modal";
import {
  cheapest,
  galleryShots,
  gradeCriteria,
  gradeLabel,
  grades,
  listings,
  listingsFor,
  productFor,
  products,
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
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const active = galleryShots[shot] ?? galleryShots[0]!;
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const inCart = isInCart(listing.id);

  const exactVideo = getApprovedVideoForListing(listing.id);

  useEffect(() => {
    if (listing?.id) {
      trackActiveEvent({
        eventType: "LISTING_VIEWED",
        entityType: "listing",
        entityId: listing.id,
        metadata: {
          category: product?.category,
          brand: product?.brand,
          grade: listing?.grade,
          price: listing?.price,
        },
      }).catch(() => {});
    }
  }, [listing?.id, product?.category, product?.brand, listing?.grade, listing?.price]);

  // Check if there are known defects/issues to disclose
  const hasKnownIssues =
    (Array.isArray(listing.knownIssues) && listing.knownIssues.length > 0) ||
    (Boolean(listing.repairs) && listing.repairs.trim().toLowerCase() !== "none");

  // Format listing date
  const listedDate = new Date(listing.listedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // "You May Also Like" recommendations: same category & brand first, then same category, then others
  const otherProducts = products.filter((p) => p.id !== product.id && listingsFor(p.id).length > 0);
  const sameCategorySameBrand = otherProducts.filter(
    (p) => p.category === product.category && p.brand === product.brand,
  );
  const sameCategoryOtherBrand = otherProducts.filter(
    (p) => p.category === product.category && p.brand !== product.brand,
  );
  const otherCategories = otherProducts.filter((p) => p.category !== product.category);
  const recommendedProducts = [
    ...sameCategorySameBrand,
    ...sameCategoryOtherBrand,
    ...otherCategories,
  ].slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {exactVideo && (
        <CreatorVideoModal
          open={videoModalOpen}
          onOpenChange={setVideoModalOpen}
          video={exactVideo}
        />
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-12 sm:space-y-16">
        {/* Breadcrumb Navigation */}
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
            Products
          </Link>
          <span>/</span>
          <Link
            to="/product/$productId"
            params={{ productId: product.id }}
            className="hover:text-foreground transition-colors"
          >
            {product.name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">Listing {listing.id}</span>
        </nav>

        {/* ── Above the Fold: Main Product Layout ── */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1.15fr] items-start">
          {/* LEFT: Product Gallery Area */}
          <div className="space-y-3 lg:sticky lg:top-24">
            <div className="bg-muted/40 border border-border/70 overflow-hidden relative group aspect-square">
              <img
                src={product.image}
                alt={`${product.name} — ${active.label.toLowerCase()} view`}
                width={700}
                height={700}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ objectPosition: active.position }}
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <GradeBadge grade={listing.grade} />
              </div>
              <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-xs text-[10px] uppercase font-mono px-2 py-0.5 border border-border">
                {active.label} View
              </div>
            </div>

            {/* Thumbnail Buttons */}
            <div className="grid grid-cols-4 gap-2.5">
              {galleryShots.map((g, i) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setShot(i)}
                  aria-label={`Show ${g.label} photo`}
                  aria-pressed={i === shot}
                  className={`border p-1 bg-card transition-all text-left ${
                    i === shot
                      ? "border-primary ring-1 ring-primary shadow-xs"
                      : "border-border/70 hover:border-primary/40 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`${g.label} thumbnail`}
                    className="aspect-square w-full object-cover"
                    style={{ objectPosition: g.position }}
                    loading="lazy"
                  />
                  <span className="block pt-1 text-[9.5px] uppercase tracking-wider text-muted-foreground truncate text-center font-medium">
                    {g.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[11.5px] text-muted-foreground leading-relaxed pt-1">
              Photos represent this exact catalog unit, checked in seller moderation.
            </p>
          </div>

          {/* RIGHT: Progressive Information Column */}
          <div className="space-y-6">
            {/* 1. Seller Identity Line */}
            <div className="pb-1 border-b border-border/40">
              <SellerTrustLine
                seller={listing.seller}
                storeId={listing.storeId}
                storeName={listing.storeName}
              />
            </div>

            {/* Exact Unit Creator Video Review Feature Banner */}
            {exactVideo && (
              <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                    <Play className="size-4 fill-current ml-0.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <span>Featured in Creator Review</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-semibold">
                        Exact Unit Tested
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {exactVideo.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-background border border-border hover:border-primary text-foreground shrink-0 shadow-xs transition-colors"
                >
                  Watch Review
                </button>
              </div>
            )}

            {/* 2. Brand & 3. Product Title */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground block">
                {product.brand}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-3.5xl font-bold text-foreground tracking-tight leading-snug">
                {product.name}
              </h1>
            </div>

            {/* 4. Condition Score — full gauge matching brand design */}
            <ConditionScore score={listing.conditionScore} grade={listing.grade} />

            {/* 5. Quick trust pills — warranty, battery, invoice */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {listing.warrantyMonths > 0 && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                  <ShieldCheck className="size-3.5" />
                  <span>{listing.warrantyMonths} mo warranty</span>
                </div>
              )}
              {typeof listing.battery === "number" && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-secondary/60 border border-border/60 text-foreground font-medium">
                  <Battery className="size-3.5 text-emerald-500" />
                  <span>{listing.battery}% battery</span>
                </div>
              )}
              {listing.invoice && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-secondary/60 border border-border/60 text-foreground font-medium">
                  <FileText className="size-3.5 text-primary" />
                  <span>Invoice included</span>
                </div>
              )}
            </div>

            {/* 7. What's Included */}
            <div className="pt-1">
              <WhatsIncludedCard
                accessories={listing.accessories}
                includedItems={listing.includedItems}
              />
            </div>

            {/* 8. Repair History */}
            <div className="pt-1">
              <RepairHistoryCard repairs={listing.repairs} repairHistory={listing.repairHistory} />
            </div>

            {/* 9. Seller's Note */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-foreground block">
                Seller&apos;s Note
              </span>
              <blockquote className="border-l-2 border-primary bg-secondary/30 px-3.5 py-2.5 text-xs text-foreground italic leading-relaxed">
                &ldquo;{listing.sellerNote}&rdquo;
              </blockquote>
              <p className="text-[11px] text-muted-foreground">
                — Listed by {listing.seller.name} on {listedDate} · Reference: {listing.id}
              </p>
            </div>

            {/* 10. Known Issues / Defect Disclosure (Before Price & CTA) */}
            <div className="pt-1">
              {hasKnownIssues ? (
                <div className="border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                    <AlertTriangle className="size-4 shrink-0" />
                    <span>Known Issues &amp; Defect Disclosure</span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-foreground pl-1">
                    {Array.isArray(listing.knownIssues) && listing.knownIssues.length > 0 ? (
                      listing.knownIssues.map((issue, i) => <li key={i}>{issue}</li>)
                    ) : (
                      <li>{listing.repairs}</li>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="border border-border/60 bg-secondary/30 p-3 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    <span>No known issues reported by seller</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-5">
                    Cosmetic &amp; functional report confirmed in listing moderation.
                  </p>
                </div>
              )}
            </div>

            {/* 11. Price & 12. Purchase CTAs */}
            <div className="pt-3 border-t border-border/60 space-y-4">
              <div>
                <p className="font-display text-3xl sm:text-4xl font-bold text-primary">
                  {taka(listing.price)}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Truck className="size-3.5 text-muted-foreground shrink-0" />
                  <span>Cash on delivery available · ships from {listing.seller.district}</span>
                </p>
              </div>

              {/* Purchase Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(listing.id);
                    navigate({ to: "/cart" });
                  }}
                  className="flex-1 bg-primary text-primary-foreground font-semibold px-4 sm:px-6 py-3.5 text-sm transition-opacity hover:opacity-90 shadow-sm cursor-pointer text-center whitespace-nowrap"
                >
                  Buy now
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(listing.id);
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 2000);
                  }}
                  className="flex-1 border border-border bg-card hover:bg-secondary text-foreground font-semibold px-4 sm:px-6 py-3.5 text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  {inCart || addedToCart ? (
                    <>
                      <Check className="size-4 shrink-0 text-emerald-500" /> Added to cart
                    </>
                  ) : (
                    "Add to cart"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Below the Fold: Structured Full-Width Content Sections ── */}
        <div className="space-y-10 sm:space-y-12 border-t border-border/60 pt-10 sm:pt-14">
          {/* Section 16 & 17 & 18: 32-Point Standardized Inspection */}
          <section id="inspection-report">
            <InspectionReport inspection={listing.inspection} />
          </section>

          {/* Section 19: Device Verification */}
          <section id="device-verification">
            <DeviceVerificationCard
              deviceVerification={listing.deviceVerification}
              inspection={listing.inspection}
            />
          </section>

          {/* Section 20: Grade Criteria & Standards */}
          <section id="grade-criteria" className="border border-border/80 bg-card p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-border/60 pb-4">
              <Layers className="size-5 text-primary" />
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Grade Standards &amp; Criteria
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Standardized definitions for used device cosmetic &amp; functional tiers
                </p>
              </div>
            </div>

            <ul className="divide-y divide-border/40 border border-border/60 bg-background/50 text-xs">
              {grades.map((g) => {
                const isCurrent = g === listing.grade;
                return (
                  <li
                    key={g}
                    className={`p-3.5 transition-colors ${
                      isCurrent
                        ? "bg-primary/5 border-l-3 border-l-primary"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`grade-chip size-5.5 text-[10.5px] ${
                          isCurrent ? "font-bold" : ""
                        }`}
                      >
                        {g}
                      </span>
                      <span className="font-semibold text-foreground text-sm">
                        {gradeLabel[g]}
                        {isCurrent && (
                          <span className="ml-2 text-xs text-primary font-semibold">
                            (This Listing)
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 pl-7.5 leading-relaxed">
                      {gradeCriteria[g]}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Section 21: Full Technical Specifications */}
          <section
            id="technical-specifications"
            className="border border-border/80 bg-card p-6 space-y-6"
          >
            <div className="border-b border-border/60 pb-4">
              <h2 className="font-display text-xl font-bold text-foreground">
                Technical Specifications
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Standard manufacturer specifications for {product.name}
              </p>
            </div>

            {Array.isArray(product.fullSpecs) && product.fullSpecs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                          <dd className="text-xs text-foreground font-semibold">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            ) : (
              <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                {product.specs.map((spec, i) => (
                  <div key={i} className="p-3.5 border border-border/60 bg-background/50">
                    <dt className="text-muted-foreground font-medium">{spec.label}</dt>
                    <dd className="mt-1 font-semibold text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          {/* ── You May Also Like Section ── */}
          {recommendedProducts.length > 0 && (
            <section className="border-t border-border pt-10 sm:pt-14">
              <div className="flex items-end justify-between border-b border-border pb-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span>Recommended</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
                    You May Also Like
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Inspected alternatives &amp; top picks in {product.category}
                  </p>
                </div>
                <Link
                  to="/products"
                  search={{ category: product.category, q: undefined, brand: undefined }}
                  className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  Browse all {product.category} →
                </Link>
              </div>

              {/* Desktop 4-grid with website's hairline-grid style */}
              <div className="hidden md:grid hairline-grid grid-cols-4 bg-card">
                {recommendedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Mobile & tablet horizontal snap swipe */}
              <div className="block md:hidden">
                <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
                  {recommendedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="w-55 shrink-0 snap-start border border-border bg-card flex flex-col"
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
