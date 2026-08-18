import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Package,
  Truck,
  Lock,
  Zap,
  Star,
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Plug,
  ArrowRight,
  ChevronRight,
  Check,
  Layers,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { products, listings, productFor, taka, cheapest, listingFor } from "@/data/catalog";
import hero from "@/assets/hero.jpg";
import pPhone from "@/assets/p-phone.jpg";
import pLaptop from "@/assets/p-laptop.jpg";
import pCamera from "@/assets/p-camera.jpg";
import pHeadphones from "@/assets/p-headphones.jpg";

const title = "Resale.com — Quality-checked pre-owned electronics in Bangladesh";
const description =
  "Buy and sell pre-owned, open-box and like-new electronics with objective condition grades, verified sellers, warranty status and cash on delivery.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

const trust = [
  {
    k: "01",
    t: "Objective grading",
    d: "Every unit graded A+ to D against structured component checks — never a vague label.",
  },
  {
    k: "02",
    t: "Verified sellers",
    d: "NID-verified accounts, public reputation, and sales history on every listing.",
  },
  {
    k: "03",
    t: "Cash on delivery",
    d: "Pay when it arrives. 48-hour dispute window backed by our resolution team.",
  },
];

const mobileCategories = [
  { label: "Smartphones", icon: Smartphone, to: "/#browse" },
  { label: "Laptops", icon: Laptop, to: "/#browse" },
  { label: "Cameras", icon: Camera, to: "/#browse" },
  { label: "Audio & Wearables", icon: Headphones, to: "/#browse" },
  { label: "Accessories", icon: Plug, to: "/#browse" },
];

function Index() {
  const [activeTab, setActiveTab] = useState<"buyers" | "sellers">("buyers");

  return (
    <div className="min-h-screen bg-background border-x border-border mx-auto max-w-7xl pb-16 md:pb-0">
      <SiteHeader />

      {/* ════════════════════════════════════════════════════════════════
          1. HERO SECTION (Desktop 2-col vs Mobile 1-card)
      ════════════════════════════════════════════════════════════════ */}
      {/* Desktop Hero (md+) */}
      <section className="hidden md:block border-b border-border">
        <div
          className="relative flex items-center py-24 md:py-32 px-6 md:px-12 overflow-hidden"
          style={{
            backgroundImage: `url(${hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        >
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Pre-owned · Open-box · Like-new
            </p>
            <h1 className="mt-6 text-4xl leading-[1.05] md:text-6xl">
              Buy used electronics
              <br />
              without the guesswork.
            </h1>
            <p className="mt-6 max-w-md text-subtle-foreground">
              Bangladesh&apos;s marketplace where every listing carries a graded condition report,
              warranty status and a verified seller behind it.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Layers className="size-4" />
                <span>Browse listings</span>
              </Link>
              <span className="text-sm text-muted-foreground">2,400+ graded units live</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Hero Card (<= 768px - Matching Mockup) */}
      <section className="block md:hidden p-4">
        <div className="relative border border-border bg-card overflow-hidden p-5 sm:p-6 flex flex-col justify-between min-h-85">
          {/* Background image overlay */}
          <div className="absolute top-0 right-0 w-3/5 h-full opacity-35 dark:opacity-20 pointer-events-none overflow-hidden">
            <img
              src={hero}
              alt="Electronics background"
              className="size-full object-cover object-center"
            />
          </div>

          <div className="relative z-10 space-y-3">
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              PRE-OWNED • OPEN-BOX • LIKE-NEW
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold leading-tight text-foreground tracking-tight max-w-65">
              Buy used electronics without the guesswork.
            </h1>
            <p className="text-xs text-subtle-foreground max-w-57.5 leading-relaxed">
              Bangladesh&apos;s marketplace where every listing is graded, tested and verified.
            </p>

            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity"
              >
                <Layers className="size-3.5" />
                <span>Browse Products</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Carousel indicators dots */}
          <div className="relative z-10 flex items-center gap-1.5 pt-6">
            <span className="size-1.5 rounded-full bg-foreground" />
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2. TRUST FEATURES STRIP (Desktop 3-Box vs Mobile Compact Strip)
      ════════════════════════════════════════════════════════════════ */}
      {/* Desktop Trust Pillars */}
      <section className="hidden md:block py-8">
        <div className="hairline-grid grid md:grid-cols-3 bg-card">
          {trust.map((t) => (
            <div key={t.k} className="p-8">
              <p className="font-display text-xs text-muted-foreground">{t.k}</p>
              <h2 className="mt-4 text-lg font-medium">{t.t}</h2>
              <p className="mt-2 text-sm text-subtle-foreground">{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Compact 3-Column Strip (<= 768px) */}
      <section className="block md:hidden px-4 py-2">
        <div className="grid grid-cols-3 divide-x divide-border border border-border bg-card text-center p-3 text-[10px]">
          {/* Objective Grading */}
          <div className="flex flex-col items-center px-1 space-y-1">
            <ShieldCheck className="size-4 text-foreground mb-0.5" />
            <h3 className="font-bold text-foreground leading-tight text-[11px]">
              Objective Grading
            </h3>
            <p className="text-[10px] text-muted-foreground leading-snug">
              Every unit graded A+ to D.
            </p>
          </div>

          {/* Verified Sellers */}
          <div className="flex flex-col items-center px-1 space-y-1">
            <CheckCircle2 className="size-4 text-foreground mb-0.5" />
            <h3 className="font-bold text-foreground leading-tight text-[11px]">
              Verified Sellers
            </h3>
            <p className="text-[10px] text-muted-foreground leading-snug">
              ND-verified accounts only.
            </p>
          </div>

          {/* Cash on Delivery */}
          <div className="flex flex-col items-center px-1 space-y-1">
            <Package className="size-4 text-foreground mb-0.5" />
            <h3 className="font-bold text-foreground leading-tight text-[11px]">
              Cash on Delivery
            </h3>
            <p className="text-[10px] text-muted-foreground leading-snug">Pay when it arrives.</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          3. SLASH DEAL OF THE DAY (Desktop vs Mobile)
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-4 md:py-6 px-4 md:px-5">
        <div className="bg-card border border-border p-5 md:p-8 relative overflow-hidden">
          {/* Top header bar */}
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
              <Zap className="size-3.5 fill-current text-amber-600" />
              <span>SLASH DEAL OF THE DAY</span>
            </div>
            <span className="text-xs font-bold text-red-600">Only 1 Left!</span>
          </div>

          {/* Content Layout */}
          {(() => {
            const dealListing = listingFor("l-1");
            const dealProduct = dealListing ? productFor(dealListing.productId) : undefined;
            if (!dealListing || !dealProduct) return null;

            const saveAmount = dealProduct.retail - dealListing.price;
            const savePercent = Math.round((saveAmount / dealProduct.retail) * 100);

            return (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 w-full md:max-w-xl">
                  <h2 className="text-xl md:text-3xl font-display font-bold tracking-tight text-foreground">
                    {dealProduct.name} (Grade {dealListing.grade})
                  </h2>
                  <div className="text-xs text-subtle-foreground space-y-0.5">
                    <p className="font-medium">
                      Mint Condition • Like New •{" "}
                      {dealProduct.specs.find((s) => s.label === "Storage")?.value}
                    </p>
                    <p className="text-muted-foreground">
                      {dealListing.warrantyMonths} months warranty remaining
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="flex flex-wrap items-baseline gap-2.5 pt-1">
                    <span className="text-2xl md:text-3xl font-display font-bold text-primary">
                      {taka(dealListing.price)}
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground line-through">
                      {taka(dealProduct.retail)}
                    </span>
                    <span className="text-[11px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold px-2 py-0.5">
                      Save {taka(saveAmount)} ({savePercent}% OFF)
                    </span>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/listing/$listingId"
                      params={{ listingId: dealListing.id }}
                      className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold px-5 py-3 text-xs md:text-sm uppercase tracking-wider hover:opacity-90 w-full sm:w-auto"
                    >
                      Claim Deal Before Sold →
                    </Link>
                  </div>
                </div>

                {/* Product image */}
                <div className="relative w-full md:w-64 aspect-square border border-border bg-muted shrink-0 flex items-center justify-center p-4">
                  <img
                    src={dealProduct.image}
                    alt={dealProduct.name}
                    className="size-full object-contain"
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4. EXPLORE BY CATEGORY (Desktop Grid vs Mobile Horizontal Scroll)
      ════════════════════════════════════════════════════════════════ */}
      <section id="categories" className="py-6 px-4 md:px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">
            EXPLORE BY CATEGORY
          </h2>
          <a href="#browse" className="text-xs font-semibold text-primary hover:underline">
            View all →
          </a>
        </div>

        {/* Desktop 4-grid (md+) */}
        <div className="hidden md:grid hairline-grid grid-cols-4 bg-card">
          <div className="p-6 transition-all cursor-pointer flex flex-col justify-between h-36 group hover:bg-secondary">
            <div>
              <span className="font-display text-lg font-bold group-hover:text-primary transition-colors">
                Smartphones
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                iPhones, Samsung Galaxy, Google Pixel
              </p>
            </div>
            <span className="text-xs font-semibold text-primary">Min 30% Off MRP →</span>
          </div>
          <div className="p-6 transition-all cursor-pointer flex flex-col justify-between h-36 group hover:bg-secondary">
            <div>
              <span className="font-display text-lg font-bold group-hover:text-primary transition-colors">
                Laptops
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                MacBook M1/M2/M3, Dell XPS, ThinkPad
              </p>
            </div>
            <span className="text-xs font-semibold text-primary">Up to 45% Savings →</span>
          </div>
          <div className="p-6 transition-all cursor-pointer flex flex-col justify-between h-36 group hover:bg-secondary">
            <div>
              <span className="font-display text-lg font-bold group-hover:text-primary transition-colors">
                Cameras
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Fujifilm X100V, Sony Alpha, Canon
              </p>
            </div>
            <span className="text-xs font-semibold text-primary">Certified Inspection →</span>
          </div>
          <div className="p-6 transition-all cursor-pointer flex flex-col justify-between h-36 group hover:bg-secondary">
            <div>
              <span className="font-display text-lg font-bold group-hover:text-primary transition-colors">
                Audio &amp; Wearables
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                AirPods Pro, Sony XM5, Galaxy Watch
              </p>
            </div>
            <span className="text-xs font-semibold text-primary">Mint Condition →</span>
          </div>
        </div>

        {/* Mobile Horizontal Scrollable Row (<= 768px - Matching Mockup) */}
        <div className="grid grid-cols-5 md:hidden gap-2">
          {mobileCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.label}
                href={cat.to}
                className="flex flex-col items-center justify-center p-2.5 border border-border bg-card text-center hover:bg-secondary transition-colors"
              >
                <div className="size-8 flex items-center justify-center text-foreground mb-1.5">
                  <Icon className="size-5" />
                </div>
                <span className="text-[10px] font-semibold text-foreground leading-tight line-clamp-2">
                  {cat.label}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          5. POPULAR PRODUCTS (Desktop 4-col Grid vs Mobile 1.8-Card Carousel)
      ════════════════════════════════════════════════════════════════ */}
      <section id="browse" className="py-6 px-4 md:px-5">
        <div className="flex items-end justify-between border-b border-border pb-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold">Popular Products</h2>
            <p className="text-xs text-muted-foreground">Compare all verified listings per model</p>
          </div>
          <Link to="/products" className="text-xs font-semibold text-primary hover:underline">
            View all →
          </Link>
        </div>

        {/* Desktop 4-grid */}
        <div className="hidden md:grid hairline-grid grid-cols-4 bg-card">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Mobile Snap-Scroll Carousel (<= 768px - 1.8 cards visible) */}
        <div className="flex md:hidden gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
          {products.map((p) => {
            const best = cheapest(p.id);
            if (!best) return null;
            const discountPercent = Math.round(((p.retail - best.price) / p.retail) * 100);

            return (
              <Link
                key={p.id}
                to="/product/$productId"
                params={{ productId: p.id }}
                className="w-50 shrink-0 snap-start border border-border bg-card p-3 flex flex-col justify-between relative group"
              >
                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 z-10">
                    -{discountPercent}% OFF
                  </div>
                )}

                {/* Product Image */}
                <div className="aspect-square bg-muted flex items-center justify-center p-3 relative overflow-hidden">
                  <img src={p.image} alt={p.name} className="size-full object-contain" />
                </div>

                {/* Info */}
                <div className="pt-3 space-y-1">
                  <h3 className="font-semibold text-xs text-foreground line-clamp-2 leading-snug">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-1.5 pt-1">
                    <span className="font-display font-bold text-sm text-primary">
                      {taka(best.price)}
                    </span>
                    <span className="text-[10px] text-muted-foreground line-through">
                      {taka(p.retail)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1.5 border-t border-border/60">
                    <span className="text-emerald-600 font-medium">Grade {best.grade}</span>
                    <span className="flex items-center gap-0.5">
                      <Star className="size-2.5 fill-amber-400 text-amber-400" />
                      <span>4.8 (128)</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          6. TRUST & BENEFITS (4-Item Strip - Mobile & Desktop)
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-6 px-4 md:px-5">
        <div className="hairline-grid grid grid-cols-2 md:grid-cols-4 bg-card">
          <div className="p-4 md:p-6 flex items-start gap-3">
            <div className="bg-primary text-primary-foreground px-2 py-1 font-bold text-xs shrink-0">
              ND
            </div>
            <div>
              <h3 className="font-bold text-xs md:text-sm text-foreground">
                Verified Seller Network
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Every seller&apos;s identity is verified.
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6 flex items-start gap-3">
            <div className="bg-primary text-primary-foreground px-2 py-1 font-bold text-xs shrink-0">
              48h
            </div>
            <div>
              <h3 className="font-bold text-xs md:text-sm text-foreground">
                48-Hour Buyer Protection
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Full refund if not as described.
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6 flex items-start gap-3">
            <div className="bg-primary text-primary-foreground px-2 py-1 font-bold text-xs shrink-0">
              COD
            </div>
            <div>
              <h3 className="font-bold text-xs md:text-sm text-foreground">
                Nationwide Cash on Delivery
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Shipped via reliable partners.
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6 flex items-start gap-3">
            <div className="bg-primary text-primary-foreground p-1.5 font-bold text-xs shrink-0 flex items-center justify-center">
              <Lock className="size-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs md:text-sm text-foreground">Secure Payment</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">100% safe &amp; encrypted.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          7. RECENTLY ADDED LISTINGS (Desktop Grid vs Mobile Carousel)
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-8 px-4 md:px-5">
        <div className="flex items-end justify-between border-b border-border pb-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold">Recently added listings</h2>
            <p className="text-xs text-muted-foreground">
              Individual verified units ready for instant dispatch
            </p>
          </div>
        </div>

        {/* Desktop 4-grid */}
        <div className="hidden md:grid hairline-grid grid-cols-4 bg-card">
          {listings.slice(0, 4).map((listing) => {
            const product = productFor(listing.productId);
            return (
              <Link
                key={listing.id}
                to="/listing/$listingId"
                params={{ listingId: listing.id }}
                className="group block h-full p-5 hover:bg-secondary transition-all"
              >
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="aspect-square bg-muted relative border border-border">
                    <img
                      src={product?.image}
                      alt={product?.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-background text-xs font-medium px-2 py-1 border border-border">
                      Grade {listing.grade}
                    </div>
                  </div>
                  <div className="pt-4 flex flex-col flex-1">
                    <h3 className="font-medium leading-tight mb-2 group-hover:underline">
                      {product?.name}
                    </h3>
                    <p className="font-display text-xl mb-3 text-primary">{taka(listing.price)}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                      {listing.sellerNote}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span>{listing.seller.name}</span>
                      <span>{listing.seller.district}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Horizontal Snap Scroll */}
        <div className="flex md:hidden gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
          {listings.slice(0, 4).map((listing) => {
            const product = productFor(listing.productId);
            return (
              <Link
                key={listing.id}
                to="/listing/$listingId"
                params={{ listingId: listing.id }}
                className="w-55 shrink-0 snap-start border border-border bg-card p-3 flex flex-col justify-between"
              >
                <div className="aspect-square bg-muted relative border border-border mb-3 flex items-center justify-center p-2">
                  <img
                    src={product?.image}
                    alt={product?.name}
                    className="size-full object-contain"
                  />
                  <div className="absolute top-2 left-2 bg-background text-[10px] font-bold px-1.5 py-0.5 border border-border">
                    Grade {listing.grade}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-xs text-foreground line-clamp-1">
                    {product?.name}
                  </h3>
                  <p className="font-display text-base font-bold text-primary">
                    {taka(listing.price)}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {listing.sellerNote}
                  </p>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{listing.seller.name}</span>
                    <span>{listing.seller.district}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          8. CONDITION GRADING STANDARD (Desktop 5-col vs Mobile Swiper)
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-muted/40 border-t border-border py-12 md:py-16 px-4 md:px-5">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Our Condition Grading Standard
          </h2>
          <p className="text-subtle-foreground text-xs md:text-sm">
            Every item is evaluated against standardized component criteria — never vague terms.
          </p>
        </div>

        {/* Desktop 5-grid */}
        <div className="hidden md:grid hairline-grid grid-cols-5 bg-card">
          <div className="p-6">
            <span className="inline-block bg-emerald-500 text-white font-bold text-xs px-2.5 py-1 mb-3">
              Grade A+
            </span>
            <h3 className="font-medium text-sm mb-1">Like New</h3>
            <p className="text-xs text-muted-foreground">
              Flawless condition with zero signs of wear. 100% original parts &amp; complete
              original box.
            </p>
          </div>
          <div className="p-6">
            <span className="inline-block bg-blue-500 text-white font-bold text-xs px-2.5 py-1 mb-3">
              Grade A
            </span>
            <h3 className="font-medium text-sm mb-1">Excellent</h3>
            <p className="text-xs text-muted-foreground">
              Micro-scratches only visible under direct light. High battery health, zero functional
              defects.
            </p>
          </div>
          <div className="p-6">
            <span className="inline-block bg-amber-500 text-white font-bold text-xs px-2.5 py-1 mb-3">
              Grade B
            </span>
            <h3 className="font-medium text-sm mb-1">Good</h3>
            <p className="text-xs text-muted-foreground">
              Normal cosmetic wear. Fully functional; any part repairs are explicitly listed.
            </p>
          </div>
          <div className="p-6">
            <span className="inline-block bg-orange-500 text-white font-bold text-xs px-2.5 py-1 mb-3">
              Grade C
            </span>
            <h3 className="font-medium text-sm mb-1">Fair</h3>
            <p className="text-xs text-muted-foreground">
              Noticeable scratches or minor dents. Great value for budget buyers seeking 100%
              functionality.
            </p>
          </div>
          <div className="p-6">
            <span className="inline-block bg-red-500 text-white font-bold text-xs px-2.5 py-1 mb-3">
              Grade D
            </span>
            <h3 className="font-medium text-sm mb-1">Heavy Wear</h3>
            <p className="text-xs text-muted-foreground">
              Heavy cosmetic wear or battery under 80%. Fully functional with deep discount pricing.
            </p>
          </div>
        </div>

        {/* Mobile Horizontal Scrolling Row */}
        <div className="flex md:hidden gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
          {[
            {
              grade: "Grade A+",
              color: "bg-emerald-500",
              name: "Like New",
              desc: "Minimal or virtually no signs of use. Flawless original parts.",
            },
            {
              grade: "Grade A",
              color: "bg-blue-500",
              name: "Excellent",
              desc: "Very good condition with minor micro-scratches only visible up close.",
            },
            {
              grade: "Grade B",
              color: "bg-amber-500",
              name: "Good",
              desc: "Visible signs of normal use, while remaining 100% functional.",
            },
            {
              grade: "Grade C",
              color: "bg-orange-500",
              name: "Fair",
              desc: "More noticeable signs of use, clearly disclosed in listing.",
            },
            {
              grade: "Grade D",
              color: "bg-red-500",
              name: "Heavy Wear",
              desc: "Significant cosmetic signs of use sold with defect disclosures.",
            },
          ].map((item) => (
            <div
              key={item.grade}
              className="w-45 shrink-0 snap-start border border-border bg-card p-4 space-y-2"
            >
              <span
                className={`inline-block ${item.color} text-white font-bold text-[10px] px-2 py-0.5`}
              >
                {item.grade}
              </span>
              <h3 className="font-semibold text-xs text-foreground">{item.name}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          9. HOW IT WORKS (Desktop 2-col vs Mobile Tabs)
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 px-4 md:px-5 border-t border-border">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8 md:mb-12">
          How Resale.com Works
        </h2>

        {/* Mobile Tabs Switch */}
        <div className="flex md:hidden justify-center mb-6">
          <div className="inline-flex border border-border p-1 bg-muted">
            <button
              onClick={() => setActiveTab("buyers")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "buyers"
                  ? "bg-primary text-primary-foreground"
                  : "text-subtle-foreground"
              }`}
            >
              For Buyers
            </button>
            <button
              onClick={() => setActiveTab("sellers")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "sellers"
                  ? "bg-primary text-primary-foreground"
                  : "text-subtle-foreground"
              }`}
            >
              For Sellers
            </button>
          </div>
        </div>

        {/* Desktop 2-Column Grid */}
        <div className="hidden md:grid hairline-grid grid-cols-2 bg-card">
          {/* For Buyers */}
          <div className="p-8">
            <h3 className="text-xl font-bold mb-6 text-primary">For Buyers</h3>
            <ol className="space-y-6">
              <li className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
                  01
                </span>
                <div>
                  <h4 className="font-medium text-sm">Compare Graded Listings</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Filter by condition score, seller location, and warranty status.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
                  02
                </span>
                <div>
                  <h4 className="font-medium text-sm">Order with Cash on Delivery</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your money is protected until delivery. NID verification ensures safe
                    transactions.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
                  03
                </span>
                <div>
                  <h4 className="font-medium text-sm">48-Hour Inspection Window</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Test your device. If it doesn&apos;t match the report, raise a dispute for full
                    refund.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* For Sellers */}
          <div className="p-8">
            <h3 className="text-xl font-bold mb-6">For Sellers</h3>
            <ol className="space-y-6">
              <li className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center bg-muted-foreground text-background font-bold text-xs">
                  01
                </span>
                <div>
                  <h4 className="font-medium text-sm">Complete Guided Checklist</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Provide honest details about battery, repairs, wear, and included accessories.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center bg-muted-foreground text-background font-bold text-xs">
                  02
                </span>
                <div>
                  <h4 className="font-medium text-sm">Pass Human Moderation</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Our team verifies pricing and condition photos before your listing goes live.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center bg-muted-foreground text-background font-bold text-xs">
                  03
                </span>
                <div>
                  <h4 className="font-medium text-sm">Ship &amp; Fast Payout</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hand over to courier and receive cleared funds directly to bKash or Bank.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        {/* Mobile Tab Content */}
        <div className="block md:hidden border border-border bg-card p-5">
          {activeTab === "buyers" ? (
            <ol className="space-y-5">
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-[11px]">
                  01
                </span>
                <div>
                  <h4 className="font-bold text-xs text-foreground">Compare Graded Listings</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Filter by condition score, location, and verified warranty status.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-[11px]">
                  02
                </span>
                <div>
                  <h4 className="font-bold text-xs text-foreground">Order with Cash on Delivery</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Your money is protected until delivery with nationwide courier coverage.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-[11px]">
                  03
                </span>
                <div>
                  <h4 className="font-bold text-xs text-foreground">48-Hour Inspection Window</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Test your device. Full refund resolution if condition report does not match.
                  </p>
                </div>
              </li>
            </ol>
          ) : (
            <ol className="space-y-5">
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center bg-muted-foreground text-background font-bold text-[11px]">
                  01
                </span>
                <div>
                  <h4 className="font-bold text-xs text-foreground">Complete Guided Checklist</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Provide honest details about battery, repairs, and condition photos.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center bg-muted-foreground text-background font-bold text-[11px]">
                  02
                </span>
                <div>
                  <h4 className="font-bold text-xs text-foreground">Pass Moderation</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Our team reviews listings within 24h to ensure accurate pricing.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center bg-muted-foreground text-background font-bold text-[11px]">
                  03
                </span>
                <div>
                  <h4 className="font-bold text-xs text-foreground">Ship &amp; Fast Payout</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Cleared funds sent directly to your bKash, Nagad or bank account.
                  </p>
                </div>
              </li>
            </ol>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
