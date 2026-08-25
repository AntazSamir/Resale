import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  CheckCircle2,
  FileCheck2,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  Layers,
  Lock,
  MapPin,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  Wallet,
  Watch,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { products, listings, productFor, taka, type Product } from "@/data/catalog";
import { getCreators } from "@/lib/creator-store";
import { getStores } from "@/lib/store-store";
import { useCart } from "@/lib/cart-store";
import hero from "@/assets/hero.webp";
import banner1 from "@/assets/banner-1.webp";
import banner2 from "@/assets/banner-2.webp";

export const Route = createFileRoute("/")({
  head: () => {
    const title = "Resale — Buy Used. Know Exactly What You're Getting.";
    const description =
      "Bangladesh's trusted marketplace for verified second-hand electronics. 32-point inspections, transparent A+–D grading, NID-verified sellers, and 48-hour buyer protection.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: Index,
});

const popularCategories = [
  { id: "Smartphones", label: "Smartphones", icon: Smartphone },
  { id: "Laptops", label: "Laptops", icon: Laptop },
  { id: "Cameras", label: "Cameras", icon: Camera },
  { id: "Tablets", label: "Tablets", icon: Tablet },
  { id: "Audio", label: "Audio", icon: Headphones },
  { id: "Gaming Consoles", label: "Gaming", icon: Gamepad2 },
  { id: "Smartwatches", label: "Watches", icon: Watch },
  { id: "Accessories", label: "Accessories", icon: Layers },
];

const testimonials = [
  {
    stars: 5,
    quote:
      "The 32-point inspection matched the iPhone 15 Pro exactly. Battery health was reported at 96% and diagnostics were 100% accurate.",
    name: "Tanvir Ahmed",
    location: "Dhaka (Banani)",
  },
  {
    stars: 5,
    quote:
      "Sold my MacBook Air M2. The structured condition checklist removed all endless bargaining. Buyer inspected and payout cleared smoothly.",
    name: "Nusrat Jahan",
    location: "Chattogram (GEC)",
  },
  {
    stars: 5,
    quote:
      "Purchased a Fujifilm X100V with Cash on Delivery. 48-hour inspection window gave total peace of mind to verify sensor cleanliness.",
    name: "Shakil Hasan",
    location: "Sylhet (Zindabazar)",
  },
];

const whyResalePillars = [
  {
    num: "01",
    title: "32-Point Standardized Inspection",
    description:
      "Every listed device is checked across physical chassis, functional diagnostics, wireless connectivity, security locks, and OEM authenticity.",
    icon: FileCheck2,
  },
  {
    num: "02",
    title: "Transparent Grading (A+ to D)",
    description:
      "Objective condition grades and transparent battery health percentages — never vague subjective descriptions.",
    icon: ShieldCheck,
  },
  {
    num: "03",
    title: "NID Verified Sellers",
    description:
      "Every seller is authenticated with government National ID verification, visible ratings, and transaction histories.",
    icon: CheckCircle2,
  },
  {
    num: "04",
    title: "48-Hour Buyer Protection",
    description:
      "Inspect on arrival. If undisclosed defects exist, our Dhaka-based team handles immediate returns and refunds.",
    icon: Lock,
  },
];

const gradeCards = [
  {
    grade: "A+",
    label: "Like New",
    desc: "Zero visible signs of use. Original factory components with complete accessories.",
    tint: "bg-emerald-500",
  },
  {
    grade: "B",
    label: "Good Condition",
    desc: "Visible but clearly documented wear. Fully functional, priced lower.",
    tint: "bg-amber-500",
  },
  {
    grade: "C",
    label: "Fair Condition",
    desc: "More noticeable signs of use, priced accordingly. Inspected end-to-end.",
    tint: "bg-red-500",
  },
];

function conditionLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  return "As-Is";
}

function Index() {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const featuredListings = listings.slice(0, 4);
  const justListed = listings.slice(4, 10);

  const featured = featuredListings.flatMap((l) => {
    const p = productFor(l.productId);
    return p ? [{ listing: l, product: p }] : [];
  });

  const justListedCards = justListed.flatMap((l) => {
    const p = productFor(l.productId);
    return p ? [{ listing: l, product: p }] : [];
  });

  const biggestSavings = listings
    .flatMap((l) => {
      const p = productFor(l.productId);
      if (!p || p.retail <= l.price) return [];
      const pct = Math.round((1 - l.price / p.retail) * 100);
      return [{ listing: l, product: p, pct }];
    })
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8);

  const availableBrands = [...new Set(products.map((p) => p.brand))].sort();

  const creators = getCreators().slice(0, 3);
  const stores = getStores().slice(0, 3);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBuyNow = (listingId: string) => {
    addToCart(listingId);
    navigate({ to: "/cart" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-linear-to-br from-orange-50 via-background to-orange-100/60 dark:from-orange-950/25 dark:via-background dark:to-orange-950/15">
        <div className="max-w-7xl mx-auto px-4 md:px-5 py-10 md:py-16 grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/25 px-3 py-1.5 text-[11px] md:text-xs font-bold uppercase tracking-wider">
              <BadgeCheck className="size-3.5" />
              <span>Verified Second-Hand Electronics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-display font-bold leading-[1.06] tracking-tight text-foreground">
              Buy Used.
              <br />
              Know Exactly
              <br />
              What You&apos;re Getting.
            </h1>

            <p className="text-sm md:text-base text-subtle-foreground max-w-md leading-relaxed">
              Inspected devices from trusted sellers, with transparent condition grades and real
              product details.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                search={{ q: undefined, category: undefined, brand: undefined }}
                className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-md active:scale-[0.98]"
              >
                <span>Shop Devices</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 bg-card text-foreground border border-border px-6 py-3 text-sm font-semibold transition-all hover:border-border-strong hover:shadow-sm active:scale-[0.98]"
              >
                <span>Sell Your Device</span>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-lg">
              {[
                { icon: ShieldCheck, value: "100%", label: "Inspected Listings" },
                { icon: Star, value: "4.8/5", label: "Buyer Rating" },
                { icon: Lock, value: "48h", label: "Buyer Protection" },
                { icon: Wallet, value: "COD", label: "Secure Payments" },
              ].map((s) => (
                <div key={s.label} className="flex items-start gap-2">
                  <s.icon className="size-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-foreground leading-none">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative border border-border bg-card shadow-xl overflow-hidden">
              <img
                src={hero}
                alt="Verified second-hand electronics"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>

            {/* Floating badges */}
            <div className="absolute top-4 -right-2 md:-right-4 border border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="size-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-foreground leading-none">Grade A</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Quality Assured</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 left-4 md:left-8 border border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="size-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-foreground leading-none">Inspected</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">32-Point Check</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 right-4 md:right-10 hidden sm:block border border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="size-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-foreground leading-none">
                    Verified Seller
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Trusted &amp; Rated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TRUST CARDS (01–04)
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-10">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: "01",
              icon: ShieldCheck,
              title: "Inspected Devices",
              desc: "Every eligible device goes through standardized inspection.",
            },
            {
              num: "02",
              icon: FileCheck2,
              title: "Transparent Grading",
              desc: "Know the actual condition before buying.",
            },
            {
              num: "03",
              icon: CheckCircle2,
              title: "Verified Sellers",
              desc: "NID-verified accounts. Buy with more confidence.",
            },
            {
              num: "04",
              icon: FileCheck2,
              title: "Real Product Details",
              desc: "Clear specifications, photos and condition information.",
            },
          ].map((t) => (
            <div
              key={t.num}
              className="flex items-start gap-3.5 border border-border bg-card p-4.5 transition-all hover:shadow-md"
            >
              <span className="relative flex size-11 shrink-0 items-center justify-center bg-orange-500/10 text-primary">
                <t.icon className="size-5" />
                <span className="absolute -top-1.5 -left-1.5 bg-primary text-primary-foreground text-[8px] font-bold px-1 py-px">
                  {t.num}
                </span>
              </span>
              <div>
                <h2 className="text-sm font-bold text-foreground">{t.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SHOP BY CATEGORY
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-8 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Shop by Category
              </h2>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                Find the device you&apos;re looking for.
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline whitespace-nowrap"
            >
              View all categories
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0 lg:grid-cols-8">
            {popularCategories.map((cat) => {
              const catProducts = products.filter((p) => p.category === cat.id);
              const image = catProducts[0]?.image;
              return (
                <Link
                  key={cat.id}
                  to="/products"
                  search={{ category: cat.id, q: undefined, brand: undefined }}
                  className="group w-32 shrink-0 snap-start sm:w-auto border border-border bg-card p-3 text-center transition-all hover:shadow-md hover:border-primary/40"
                >
                  <div className="aspect-square w-full overflow-hidden bg-secondary mb-2.5">
                    {image ? (
                      <img
                        src={image}
                        alt={cat.label}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-muted-foreground">
                        <cat.icon className="size-8" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-foreground">{cat.label}</h3>
                  <p className="text-[10px] font-semibold text-primary mt-0.5">
                    {catProducts.length} items
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          JUST LISTED
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-10 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Just Listed
              </h2>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                New arrivals from our marketplace.
              </p>
            </div>
            <Link
              to="/products"
              search={{ q: undefined, category: undefined, brand: undefined }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline whitespace-nowrap"
            >
              View all
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x pb-2">
              {justListedCards.map(({ listing: l, product: p }) => (
                <div key={l.id} className="w-40 shrink-0 snap-start sm:w-52">
                  <FeaturedDeviceCard
                    listingId={l.id}
                    product={p}
                    grade={l.grade}
                    price={l.price}
                    retail={p.retail}
                    sellerDistrict={l.seller.district}
                    saved={savedIds.has(l.id)}
                    inCart={isInCart(l.id)}
                    newArrival
                    onToggleSaved={() => toggleSaved(l.id)}
                    onBuyNow={() => handleBuyNow(l.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          BANNERS
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-2">
        <div className="mx-auto max-w-7xl">
          {/* Desktop banner - full width on desktop */}
          <div className="w-full md:w-auto bg-secondary/80 backdrop-blur-sm rounded-t-2xl rounded-b-2xl overflow-hidden md:rounded-none md:rounded-t-0 md:rounded-b-0 md:max-w-7xl">
            <img
              src={banner1}
              alt="Resale featured banner desktop"
              loading="lazy"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          {/* Mobile banner - full width on mobile */}
          <div className="hidden md:block w-full bg-secondary/80 backdrop-blur-sm rounded-t-2xl rounded-b-2xl overflow-hidden md:rounded-none md:rounded-t-0 md:rounded-b-0 md:max-w-7xl">
            <img
              src={banner2}
              alt="Resale featured banner mobile"
              loading="lazy"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FEATURED DEVICES
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-10 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Featured Devices
              </h2>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                Recently listed and carefully selected.
              </p>
            </div>
            <Link
              to="/products"
              search={{ q: undefined, category: undefined, brand: undefined }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline whitespace-nowrap"
            >
              View all devices
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
            {featured.map(({ listing: l, product: p }) => (
              <div key={l.id} className="w-40 shrink-0 snap-start sm:w-auto">
                <FeaturedDeviceCard
                  listingId={l.id}
                  product={p}
                  grade={l.grade}
                  price={l.price}
                  retail={p.retail}
                  sellerDistrict={l.seller.district}
                  saved={savedIds.has(l.id)}
                  inCart={isInCart(l.id)}
                  onToggleSaved={() => toggleSaved(l.id)}
                  onBuyNow={() => handleBuyNow(l.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          BIGGEST SAVINGS RAIL
      ════════════════════════════════════════════════════════════ */}
      {biggestSavings.length > 0 && (
        <section className="px-4 md:px-5 py-10 border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Biggest Savings
                </h2>
                <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                  Verified devices at steep discounts vs. brand-new retail.
                </p>
              </div>
              <Link
                to="/products"
                search={{ q: undefined, category: undefined, brand: undefined }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline whitespace-nowrap"
              >
                View all
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x pb-2">
              {biggestSavings.map(({ listing: l, product: p, pct }) => (
                <div key={l.id} className="w-40 shrink-0 snap-start sm:w-52">
                  <FeaturedDeviceCard
                    listingId={l.id}
                    product={p}
                    grade={l.grade}
                    price={l.price}
                    retail={p.retail}
                    sellerDistrict={l.seller.district}
                    saved={savedIds.has(l.id)}
                    inCart={isInCart(l.id)}
                    onToggleSaved={() => toggleSaved(l.id)}
                    onBuyNow={() => handleBuyNow(l.id)}
                  />
                  {pct >= 40 && (
                    <p className="mt-1 text-center text-[10px] font-bold text-primary">
                      Save {taka(p.retail - l.price)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          AVAILABLE BRANDS
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-10 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Available Brands
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mb-6">
            Shop verified devices from the world's leading electronics brands.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {availableBrands.map((brand) => (
              <Link
                key={brand}
                to="/products"
                search={{ brand, q: undefined, category: undefined }}
                className="border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:text-primary hover:shadow-sm"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          KNOW THE CONDITION BEFORE YOU BUY
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-10 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
            Know the Condition Before You Buy
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {gradeCards.map((g) => (
              <div
                key={g.grade}
                className="border border-border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`flex size-9 items-center justify-center text-white text-sm font-bold ${g.tint}`}
                  >
                    {g.grade}
                  </span>
                  <h3 className="text-sm font-bold text-foreground">Grade {g.grade}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{g.desc}</p>
              </div>
            ))}

            <div className="border border-orange-500/25 bg-orange-500/5 p-5 flex flex-col justify-between">
              <span className="flex size-9 items-center justify-center bg-orange-500/15 text-primary mb-3">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="text-xs text-subtle-foreground leading-relaxed">
                  Our grading is backed by a standardized 32-point inspection on every eligible
                  device.
                </p>
                <Link
                  to="/products"
                  search={{ q: undefined, category: undefined, brand: undefined }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Learn about grading
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          WHY RESALE IS DIFFERENT (BENTO)
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-10 border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 md:mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
              Why Resale
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Why Resale Is Different
            </h2>
            <p className="mt-2 text-sm text-subtle-foreground leading-relaxed">
              Four systems that make every transaction verifiable — from listing to delivery.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {whyResalePillars.map((pillar, i) => (
              <div
                key={pillar.num}
                className={`group relative overflow-hidden border border-border bg-card p-4 md:p-6 transition-all hover:shadow-lg ${
                  i === 0
                    ? "col-span-2 lg:col-span-2 bg-linear-to-br from-orange-500/8 via-card to-card"
                    : "lg:col-span-1"
                } ${i === 3 ? "col-span-2 lg:col-span-1" : ""}`}
              >
                <span
                  aria-hidden
                  className="absolute -top-2 right-3 text-5xl md:text-6xl font-display font-bold text-foreground/5 select-none"
                >
                  {pillar.num}
                </span>
                <span className="mb-3 md:mb-4 flex size-10 md:size-12 items-center justify-center bg-orange-500/10 text-primary transition-transform group-hover:scale-110">
                  <pillar.icon className="size-5 md:size-6" />
                </span>
                <h3 className="text-sm md:text-lg font-display font-bold text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 md:mt-2 text-[11px] md:text-sm text-subtle-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TRUSTED SELLERS & CREATORS
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-10 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Shop From Trusted Sellers &amp; Creators
              </h2>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                Discover curated collections from trusted sellers, tech creators and professional
                storefronts.
              </p>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-6 sm:gap-4 mt-6">
            {creators.map((c) => (
              <Link
                key={c.id}
                to="/creator/$creatorSlug"
                params={{ creatorSlug: c.handle }}
                className="group w-36 shrink-0 snap-start sm:w-auto border border-border bg-card px-3 py-5 text-center transition-all hover:shadow-md hover:border-primary/40"
              >
                <div className="relative w-16 h-16 mx-auto mb-3">
                  {c.avatarUrl ? (
                    <img
                      src={c.avatarUrl}
                      alt={c.displayName}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center bg-orange-500/10 text-base font-bold text-primary">
                      {c.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}
                  {c.verified && (
                    <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-card">
                      <Check className="size-2.5" />
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-foreground truncate">{c.displayName}</h3>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  Tech Creator
                </p>
                <p className="text-[11px] font-bold text-primary mt-1.5">
                  {c.totalReviews} reviews
                </p>
              </Link>
            ))}

            {stores.map((s) => (
              <Link
                key={s.id}
                to="/store/$storeSlug"
                params={{ storeSlug: s.slug }}
                className="group w-36 shrink-0 snap-start sm:w-auto border border-border bg-card px-3 py-5 text-center transition-all hover:shadow-md hover:border-primary/40"
              >
                <div className="relative w-16 h-16 mx-auto mb-3">
                  {s.logoUrl ? (
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center bg-orange-500/10 text-base font-bold text-primary">
                      {s.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}
                  {s.verified && (
                    <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-card">
                      <Check className="size-2.5" />
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-foreground truncate">{s.name}</h3>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  Pro Seller
                </p>
                <p className="text-[11px] font-bold text-primary mt-1.5">{s.totalSales} sales</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SELL CTA BANNER
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden bg-linear-to-r from-orange-500 to-orange-600 px-6 py-8 md:px-10 md:py-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -bottom-16 opacity-15"
            >
              <Smartphone className="size-48 text-white" />
            </div>
            <div className="relative flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
              <span className="flex size-12 items-center justify-center bg-white/20 text-white shrink-0">
                <Sparkles className="size-6" />
              </span>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white">
                  Have a Device You Don&apos;t Use?
                </h2>
                <p className="text-xs md:text-sm text-white/85 mt-1">
                  Turn your unused electronics into cash.
                </p>
                <p className="text-[10px] text-white/70 mt-2">
                  Simple listing &middot; Transparent pricing &middot; Trusted marketplace
                </p>
              </div>
              <Link
                to="/sell"
                className="inline-flex w-fit items-center gap-2 bg-white text-orange-600 px-6 py-3 text-sm font-bold transition-all hover:shadow-lg active:scale-[0.98] shrink-0"
              >
                <span>Sell Your Device</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          WHY BUY ON RESALE
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-10 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-8">
            Why Buy on RESALE?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: FileCheck2,
                title: "Transparent",
                desc: "See condition, grading and product details before buying.",
              },
              {
                icon: ShieldCheck,
                title: "Trusted",
                desc: "Know exactly who you're buying from.",
              },
              {
                icon: Wallet,
                title: "Better Value",
                desc: "Get quality electronics without paying full retail prices.",
              },
            ].map((w) => (
              <div key={w.title} className="flex items-start gap-3.5">
                <span className="flex size-11 shrink-0 items-center justify-center bg-orange-500/10 text-primary">
                  <w.icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{w.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CUSTOMER TESTIMONIALS (AUTO CAROUSEL — ALL DEVICES)
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-10 border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Our Customers Speak For Us
            </h2>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Don't believe us? Hear from buyers and sellers about their experience.
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToIndex = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
    setActive(idx);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % testimonials.length;
        const el = scrollRef.current;
        if (el) {
          const child = el.children[next] as HTMLElement | undefined;
          if (child) {
            el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
          }
        }
        return next;
      });
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleUserScroll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const el = scrollRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    const idx = children.reduce((best, child, i) => {
      const dist = Math.abs(child.offsetLeft - el.offsetLeft - el.scrollLeft);
      const bestDist = Math.abs((children[best]?.offsetLeft ?? 0) - el.offsetLeft - el.scrollLeft);
      return dist < bestDist ? i : best;
    }, 0);
    setActive(idx);
    timerRef.current = setTimeout(() => startTimer(), 5000) as unknown as ReturnType<
      typeof setInterval
    >;
  };

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleUserScroll}
        className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
      >
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="min-w-[85%] sm:min-w-[46%] lg:min-w-[31.5%] snap-start border border-border bg-card p-5 flex flex-col"
          >
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {Array.from({ length: t.stars }).map((_, s) => (
                <Star key={s} className="size-3.5 fill-current" />
              ))}
              <span className="ml-1 text-[10px] font-bold text-foreground">5/5</span>
            </div>
            <p className="flex-1 text-xs text-subtle-foreground leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-2.5 border-t border-border/60 pt-3">
              <span className="flex size-8 items-center justify-center bg-orange-500/10 text-[10px] font-bold text-primary">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div className="text-[11px]">
                <span className="block font-semibold text-foreground">{t.name}</span>
                <span className="text-muted-foreground">{t.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i ? "w-6 bg-primary" : "w-1.5 bg-border-strong"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedDeviceCard({
  listingId,
  product,
  grade,
  price,
  retail,
  sellerDistrict,
  saved,
  inCart,
  newArrival,
  onToggleSaved,
  onBuyNow,
}: {
  listingId: string;
  product: Product;
  grade: string;
  price: number;
  retail: number;
  sellerDistrict: string;
  saved: boolean;
  inCart: boolean;
  newArrival?: boolean;
  onToggleSaved: () => void;
  onBuyNow: () => void;
}) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const savingsPct = retail > price ? Math.round((1 - price / retail) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(listingId);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group border border-border bg-card transition-all hover:shadow-md hover:border-primary/40 flex flex-col h-full">
      {/* Image */}
      <div className="relative">
        <Link
          to="/listing/$listingId"
          params={{ listingId }}
          className="block aspect-square overflow-hidden bg-secondary"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Badge: discount, NEW, or grade */}
        {savingsPct > 0 ? (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5">
            -{savingsPct}%
          </span>
        ) : newArrival ? (
          <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5">
            NEW
          </span>
        ) : (
          <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5">
            GRADE {grade}
          </span>
        )}

        {/* Save button */}
        <button
          type="button"
          onClick={onToggleSaved}
          aria-label={saved ? "Remove from saved" : "Save device"}
          className="absolute top-2 right-2 flex size-7 items-center justify-center bg-card/90 border border-border text-muted-foreground transition-colors hover:text-primary"
        >
          <Heart className={`size-3.5 ${saved ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link
          to="/listing/$listingId"
          params={{ listingId }}
          className="text-xs font-semibold text-foreground hover:underline line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-primary">{taka(price)}</span>
          {savingsPct > 0 && (
            <span className="text-[10px] text-muted-foreground line-through">{taka(retail)}</span>
          )}
        </div>

        <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="size-2.5" />
          {sellerDistrict} · Grade {grade}
        </p>

        {/* Actions */}
        <div className="mt-auto pt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onBuyNow}
            className="h-8 bg-primary text-primary-foreground text-xs font-semibold transition-all hover:opacity-90 flex items-center justify-center whitespace-nowrap"
          >
            <span>Buy now</span>
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className={`h-8 border bg-card text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              justAdded || inCart
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            {justAdded || inCart ? (
              <Check className="size-4" />
            ) : (
              <ShoppingBag className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
