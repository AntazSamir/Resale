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
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import {
  products,
  listings,
  productFor,
  taka,
  type Product,
  inspectionFramework,
  gradeCriteria,
  gradeLabel,
  grades,
  type Grade,
} from "@/data/catalog";
import { isListingPubliclyEligible } from "@/lib/listing-eligibility";
import { getCreators } from "@/lib/creator-store";
import { getStores } from "@/lib/store-store";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-store";
import { getOrders, onOrdersChange, fetchOrdersAsync, type OrderRecord } from "@/lib/order-store";
import { getUserPersonalizedShelves } from "@/lib/recommendation-engine";
import banner1 from "@/assets/banner-1.png";
import bannerImage1 from "@/assets/image-1.webp";
import bannerImage2 from "@/assets/image-2.webp";

export const Route = createFileRoute("/")({
  head: () => {
    const title = "Resale — Buy Used. Know Exactly What You're Getting.";
    const description =
      "Bangladesh's trusted marketplace for verified second-hand electronics. Standardized 32-point inspections, transparent A+–D grading, verified sellers, and 48-hour return window with Cash on Delivery.";
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

const customerExperiences = [
  {
    stars: 5,
    quote:
      "The 32-point inspection report matched the iPhone 15 Pro exactly. Battery health was reported at 96% and all diagnostics were completely accurate.",
    name: "Tanvir Ahmed",
    location: "Banani, Dhaka",
    item: "iPhone 15 Pro",
  },
  {
    stars: 5,
    quote:
      "Sold my MacBook Air M2 without endless back-and-forth haggling. The structured condition checklist set clear expectations and payout was smooth.",
    name: "Nusrat Jahan",
    location: "GEC, Chattogram",
    item: "MacBook Air M2",
  },
  {
    stars: 5,
    quote:
      "Purchased a Fujifilm X100V with Cash on Delivery. The 48-hour inspection window gave me total peace of mind to verify sensor cleanliness in person.",
    name: "Shakil Hasan",
    location: "Zindabazar, Sylhet",
    item: "Fujifilm X100V",
  },
  {
    stars: 5,
    quote:
      "Quick inspection verification and honest grade grading made the process stress-free. The device arrived exactly in described Grade A condition.",
    name: "Ayesha Khan",
    location: "Khalishpur, Khulna",
    item: "Galaxy S24 Ultra",
  },
  {
    stars: 5,
    quote:
      "Bought an inspected MacBook Pro. Arrived clean with documented battery cycles and charging test. Very transparent pre-owned tech shopping.",
    name: "Rahim Uddin",
    location: "Sadar, Barishal",
    item: "MacBook Pro 14",
  },
];

function Index() {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [activeInspectionTab, setActiveInspectionTab] = useState<number>(0);
  const [heroSearch, setHeroSearch] = useState("");

  useEffect(() => {
    setOrders(getOrders());
    fetchOrdersAsync()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) setOrders(res);
      })
      .catch(() => {});
    const unsubscribe = onOrdersChange(setOrders);
    return () => unsubscribe();
  }, []);

  // Phase 4.6 Strict Data-Truth Personalized Shelves (Only renders if genuine qualifying order exists)
  const personalizedResult = getUserPersonalizedShelves(user, orders, { limit: 4 });
  const recentOrderShelf = personalizedResult.recentOrderShelf;

  // Real eligible listings filtered strictly via Phase 5.1 rules
  const eligibleListings = listings.filter(isListingPubliclyEligible);

  // Recent arrivals sorted by actual listedAt timestamp
  const latestArrivals = [...eligibleListings]
    .sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime())
    .flatMap((l) => {
      const p = productFor(l.productId);
      return p ? [{ listing: l, product: p }] : [];
    })
    .slice(0, 8);

  // Top savings calculated strictly against original retail price
  const valueDeals = [...eligibleListings]
    .flatMap((l) => {
      const p = productFor(l.productId);
      if (!p || p.retail <= l.price) return [];
      const pct = Math.round((1 - l.price / p.retail) * 100);
      return [{ listing: l, product: p, pct }];
    })
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8);

  const creators = getCreators().slice(0, 3);
  const stores = getStores().slice(0, 3);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBuyNow = (listingId: string) => {
    addToCart(listingId);
    navigate({ to: "/cart" });
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/products",
      search: { q: heroSearch.trim() || undefined, category: undefined, brand: undefined },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <SiteHeader />

      {/* ════════════════════════════════════════════════════════════
          1. HERO SPOTLIGHT: Modern, high-impact asymmetric tech centerpiece
      ════════════════════════════════════════════════════════════ */}
      <section className="relative w-full border-b border-border/80 overflow-hidden">
        {/* Image drives the section height — scales proportionally with viewport width */}
        <img src={banner1} alt="" aria-hidden="true" className="w-full h-auto block" />

        {/* Content overlaid on the image */}
        <div className="absolute inset-0 z-10 flex items-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl w-full">
            <div className="lg:max-w-[58%] space-y-4 sm:space-y-6">
              {/* Pillar Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-semibold rounded-full shadow-xs backdrop-blur-xs">
                <BadgeCheck className="size-3.5 shrink-0" />
                <span>Standardized 32-Point Diagnostics</span>
                <span className="text-primary/60">·</span>
                <span className="text-foreground/80 font-medium">A+ to D Graded</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.35rem] font-display font-bold leading-[1.12] tracking-tight text-foreground">
                Buy Verified Used Tech. <br />
                <span className="text-muted-foreground">Know Exactly</span>{" "}
                <span className="text-primary">What You&apos;re Getting.</span>
              </h1>

              {/* Subtitle — hidden on very small screens to avoid overflow */}
              <p className="hidden sm:block text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                Inspected pre-owned smartphones, laptops, and cameras from verified sellers in
                Bangladesh. Standardized condition checklists with 48-hour return protection on
                delivery.
              </p>

              {/* Quick Search Form */}
              <form onSubmit={handleHeroSearchSubmit} className="max-w-xl">
                <div className="relative flex items-center shadow-sm rounded-lg overflow-hidden border border-border bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Search className="size-4.5 text-muted-foreground ml-3.5 shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search iPhone 15, MacBook M2, Sony XM5..."
                    className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground font-semibold text-xs sm:text-sm px-5 py-3 hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5"
                  >
                    <span>Search</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </form>

              {/* CTAs — hidden on very small screens */}
              <div className="hidden sm:flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  search={{ q: undefined, category: undefined, brand: undefined }}
                  className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground rounded-md transition-all hover:opacity-95 active:scale-[0.98] shadow-sm"
                >
                  <span>Explore All Devices</span>
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/sell"
                  className="inline-flex items-center justify-center gap-2 bg-card hover:bg-secondary text-foreground border border-border px-6 py-3 text-sm font-semibold rounded-md transition-all active:scale-[0.98]"
                >
                  <span>Sell a Device</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Guarantee Strip — below the hero image */}
      <div className="border-b border-border/80 bg-card/60 px-4 sm:px-6 lg:px-8 py-5">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: ShieldCheck,
              title: "32-Point Diagnostics",
              sub: "Standardized inspection on every unit",
            },
            {
              icon: FileCheck2,
              title: "Transparent A+–D Grading",
              sub: "Clear condition standards",
            },
            { icon: Lock, title: "48-Hour Return Window", sub: "Inspect device on arrival" },
            { icon: Wallet, title: "Cash on Delivery", sub: "Pay after courier verification" },
          ].map((pillar) => (
            <div key={pillar.title} className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <pillar.icon className="size-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground leading-snug">{pillar.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{pillar.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SHOP BY CATEGORY
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-8 border-b border-border">
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
          3. BASED ON YOUR RECENT ORDER (Personalized Discovery - Phase 4.6)
          Strict Data-Truth rule: Rendered strictly when user has genuine qualifying history
      ════════════════════════════════════════════════════════════ */}
      {recentOrderShelf && recentOrderShelf.items.length > 0 && (
        <section className="px-4 md:px-6 lg:px-8 py-12 border-b border-border/80 bg-card/40">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2 uppercase tracking-wider">
                  <Sparkles className="size-3" />
                  <span>Personalized Recommendation</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  {recentOrderShelf.shelfTitle}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {recentOrderShelf.subtitle}
                </p>
              </div>
              <Link
                to="/account/orders"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline whitespace-nowrap"
              >
                View Order History
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {recentOrderShelf.items.map(({ listing: l, product: p, reason }) => (
                <FeaturedDeviceCard
                  key={l.id}
                  listingId={l.id}
                  product={p}
                  grade={l.grade}
                  price={l.price}
                  retail={p.retail}
                  seller={l.seller}
                  saved={savedIds.has(l.id)}
                  inCart={isInCart(l.id)}
                  onToggleSaved={() => toggleSaved(l.id)}
                  onBuyNow={() => handleBuyNow(l.id)}
                  recommendationBadge={
                    reason === "same-category-and-brand"
                      ? "Same Brand Match"
                      : reason === "same-category"
                        ? "Category Alternative"
                        : undefined
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          4. RECENT ARRIVALS: 4-Col Desktop & 2-Col Mobile Balanced Grid
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-6 lg:px-8 py-12 border-b border-border/80">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Recent Arrivals
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Latest inspected pre-owned listings published across Bangladesh.
              </p>
            </div>
            <Link
              to="/products"
              search={{ q: undefined, category: undefined, brand: undefined }}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline whitespace-nowrap"
            >
              Browse All ({eligibleListings.length})
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {latestArrivals.map(({ listing: l, product: p }) => (
              <FeaturedDeviceCard
                key={l.id}
                listingId={l.id}
                product={p}
                grade={l.grade}
                price={l.price}
                retail={p.retail}
                seller={l.seller}
                saved={savedIds.has(l.id)}
                inCart={isInCart(l.id)}
                onToggleSaved={() => toggleSaved(l.id)}
                onBuyNow={() => handleBuyNow(l.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PROMOTIONAL PHOTO BANNERS (Side-by-Side Dual Banners)
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-6 lg:px-8 py-6 sm:py-8 border-b border-border/80 bg-card/20">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Photo Banner 1 */}
          <Link
            to="/products"
            search={{ q: undefined, category: undefined, brand: undefined }}
            className="relative block overflow-hidden rounded-xl border border-border/80 bg-card"
          >
            <div className="w-full overflow-hidden bg-muted/30 aspect-16/7 sm:aspect-21/9">
              <img
                src={bannerImage1}
                alt="Browse Inspected Devices"
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          </Link>

          {/* Photo Banner 2 */}
          <Link
            to="/sell"
            className="relative block overflow-hidden rounded-xl border border-border/80 bg-card"
          >
            <div className="w-full overflow-hidden bg-muted/30 aspect-16/7 sm:aspect-21/9">
              <img
                src={bannerImage2}
                alt="Sell Your Pre-Owned Device"
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          5. TOP VALUE DEALS VS. BRAND NEW RETAIL
      ════════════════════════════════════════════════════════════ */}

      {valueDeals.length > 0 && (
        <section className="px-4 md:px-6 lg:px-8 py-12 border-b border-border/80 bg-secondary/30">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  Top Value Deals vs. New Retail
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Substantial savings compared to brand-new box price, backed by full 32-point
                  inspection.
                </p>
              </div>
              <Link
                to="/products"
                search={{ q: undefined, category: undefined, brand: undefined }}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline whitespace-nowrap"
              >
                View All Deals
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {valueDeals.map(({ listing: l, product: p, pct }) => (
                <FeaturedDeviceCard
                  key={l.id}
                  listingId={l.id}
                  product={p}
                  grade={l.grade}
                  price={l.price}
                  retail={p.retail}
                  seller={l.seller}
                  saved={savedIds.has(l.id)}
                  inCart={isInCart(l.id)}
                  discountPct={pct}
                  onToggleSaved={() => toggleSaved(l.id)}
                  onBuyNow={() => handleBuyNow(l.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          6. UNIFIED TRUST ANCHOR: The 32-Point Inspection Standard & Objective Grading
          Consolidates 4 redundant sections into 1 clear, authoritative transparency benchmark.
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-6 lg:px-8 py-16 border-b border-border/80 bg-card">
        <div className="mx-auto max-w-7xl space-y-10">
          {/* Header */}
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              The Resale Standard
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mt-1">
              Know Exactly What You Buy Before Delivery
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              Every listed device goes through our structured 32-point inspection framework. No
              hidden defects, no ambiguous descriptions, no guesswork.
            </p>
          </div>

          {/* Bento Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (7 cols): The 32-Point Inspection Framework */}
            <div className="lg:col-span-7 rounded-xl border border-border/80 bg-background p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="size-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">
                    32-Point Diagnostic Inspection
                  </h3>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  5 Categories
                </span>
              </div>

              {/* Category selector tabs */}
              <div className="flex flex-wrap gap-1.5">
                {inspectionFramework.map((cat, idx) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setActiveInspectionTab(idx)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                      activeInspectionTab === idx
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.name} ({cat.checks.length})
                  </button>
                ))}
              </div>

              {/* Active Category Checklist */}
              <div className="bg-card rounded-lg border border-border/60 p-4">
                <p className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>{inspectionFramework[activeInspectionTab]?.name} Diagnostic Checks:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {inspectionFramework[activeInspectionTab]?.checks.map((check) => (
                    <div
                      key={check}
                      className="flex items-center gap-2 text-subtle-foreground bg-secondary/40 p-2 rounded-md"
                    >
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): The Objective Grading Standard */}
            <div className="lg:col-span-5 rounded-xl border border-border/80 bg-background p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    <h3 className="text-base font-bold text-foreground">
                      Standardized Condition Grades
                    </h3>
                  </div>
                  <Link
                    to="/grading"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Full Criteria →
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {grades.slice(0, 4).map((g: Grade) => (
                    <div
                      key={g}
                      className="flex items-start gap-3 p-2.5 rounded-lg border border-border/50 bg-card hover:bg-secondary/40 transition-colors"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md font-bold text-xs bg-primary/10 text-primary border border-primary/20">
                        {g}
                      </span>
                      <div className="text-xs">
                        <span className="font-bold text-foreground block">{gradeLabel[g]}</span>
                        <span className="text-muted-foreground text-[11px] leading-tight block mt-0.5">
                          {gradeCriteria[g]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/grading"
                className="block text-center text-xs font-semibold bg-secondary hover:bg-muted text-foreground py-2.5 rounded-md border border-border transition-colors mt-2"
              >
                Learn How We Grade &amp; Test Electronics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          7. PRO STORES & TECH CREATORS
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-6 lg:px-8 py-12 border-b border-border/80">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Verified Pro Sellers &amp; Tech Creators
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Explore curated devices from established shops and tech reviewer profiles.
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
            {creators.map((c) => (
              <Link
                key={c.id}
                to="/creator/$creatorSlug"
                params={{ creatorSlug: c.handle }}
                className="group w-40 shrink-0 sm:w-auto rounded-xl border border-border/80 bg-card p-4 text-center transition-all duration-200 hover:shadow-md hover:border-primary/40 flex flex-col items-center justify-between"
              >
                <div className="relative size-14 mb-2.5 rounded-full overflow-hidden border border-border/80 bg-secondary">
                  {c.avatarUrl ? (
                    <img
                      src={c.avatarUrl}
                      alt={c.displayName}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center font-bold text-primary">
                      {c.displayName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  {c.verified && (
                    <span className="absolute bottom-0 right-0 size-4 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center text-white">
                      <Check className="size-2.5" />
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-foreground truncate w-full">
                  {c.displayName}
                </h3>
                <span className="text-[10px] text-muted-foreground mt-0.5">Tech Reviewer</span>
                <span className="text-[11px] font-bold text-primary mt-1.5">
                  {c.totalReviews} reviews
                </span>
              </Link>
            ))}

            {stores.map((s) => (
              <Link
                key={s.id}
                to="/store/$storeSlug"
                params={{ storeSlug: s.slug }}
                className="group w-40 shrink-0 sm:w-auto rounded-xl border border-border/80 bg-card p-4 text-center transition-all duration-200 hover:shadow-md hover:border-primary/40 flex flex-col items-center justify-between"
              >
                <div className="relative size-14 mb-2.5 rounded-full overflow-hidden border border-border/80 bg-secondary">
                  {s.logoUrl ? (
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center font-bold text-primary">
                      {s.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  {s.verified && (
                    <span className="absolute bottom-0 right-0 size-4 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center text-white">
                      <Check className="size-2.5" />
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-foreground truncate w-full">{s.name}</h3>
                <span className="text-[10px] text-muted-foreground mt-0.5">Pro Store</span>
                <span className="text-[11px] font-bold text-primary mt-1.5">
                  {s.totalSales} sales
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          8. EDITORIAL SELL CTA CARD: Clean structured action
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="relative rounded-2xl overflow-hidden bg-linear-to-r from-orange-600 to-orange-500 text-white p-6 sm:p-8 lg:p-10 shadow-lg">
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                  Sell Your Device
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold">
                  Turn Unused Electronics Into Cash
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  List your phone, laptop, or camera in 3 easy steps. Transparent condition grading
                  removes endless bargaining and connects you directly to verified buyers.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-white/80">
                  <span className="flex items-center gap-1.5">
                    <Check className="size-3.5" /> 1. Select Model
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="size-3.5" /> 2. Complete 32-Pt Checklist
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="size-3.5" /> 3. Connect with Buyers
                  </span>
                </div>
              </div>

              <Link
                to="/sell"
                className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-white/95 px-6 py-3.5 rounded-lg text-sm font-bold shadow-md transition-all active:scale-[0.98] shrink-0"
              >
                <span>List Your Device</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          9. CUSTOMER EXPERIENCES: Verified quotes with real location context
      ════════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-6 lg:px-8 py-12 border-t border-border/80 bg-secondary/30">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Customer Experiences
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              What buyers and sellers across Bangladesh say about the Resale inspection process.
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FeaturedDeviceCard({
  listingId,
  product,
  grade,
  price,
  retail,
  seller,
  saved,
  inCart,
  discountPct,
  recommendationBadge,
  onToggleSaved,
  onBuyNow,
}: {
  listingId: string;
  product: Product;
  grade: string;
  price: number;
  retail: number;
  seller: {
    name: string;
    verified: boolean;
    rating: number;
    district: string;
    [key: string]: unknown;
  };
  saved: boolean;
  inCart: boolean;
  discountPct?: number | undefined;
  recommendationBadge?: string | undefined;
  onToggleSaved: () => void;
  onBuyNow: () => void;
}) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const savings = discountPct ?? (retail > price ? Math.round((1 - price / retail) * 100) : 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(listingId);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col bg-card p-3 sm:p-4 transition-all duration-200 hover:shadow-lg hover:border-primary/40 relative overflow-hidden border border-border/80 rounded-xl h-full justify-between">
      <div>
        {/* Image Container with 1:1 square canvas */}
        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted/20 border border-border/40">
          <Link to="/listing/$listingId" params={{ listingId }} className="block size-full">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Top Left Badge: Recommendation kicker or Grade */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {recommendationBadge ? (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                {recommendationBadge}
              </span>
            ) : savings > 0 ? (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                -{savings}% vs New
              </span>
            ) : null}
          </div>

          {/* Top Right Save Toggle */}
          <button
            type="button"
            onClick={onToggleSaved}
            aria-label={saved ? "Remove from saved" : "Save device"}
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-card/90 backdrop-blur-xs border border-border/60 text-muted-foreground transition-colors hover:text-primary shadow-xs"
          >
            <Heart className={`size-3.5 ${saved ? "fill-primary text-primary" : ""}`} />
          </button>

          {/* Bottom Right Grade Badge */}
          <div className="absolute bottom-2 right-2">
            <span className="bg-card/95 backdrop-blur-xs text-foreground text-[10px] font-bold px-2 py-0.5 rounded-md border border-border/60 shadow-xs">
              Grade {grade}
            </span>
          </div>
        </div>

        {/* Info Block */}
        <div className="pt-3 space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold truncate">
            {product.brand} · {product.category}
          </p>
          <Link
            to="/listing/$listingId"
            params={{ listingId }}
            className="text-xs sm:text-sm font-semibold text-foreground hover:underline line-clamp-1 block"
          >
            {product.name}
          </Link>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-sm sm:text-base font-bold text-primary font-display">
              {taka(price)}
            </span>
            {savings > 0 && (
              <span className="text-[11px] text-muted-foreground line-through">{taka(retail)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Meta & Actions */}
      <div className="mt-3 pt-2.5 border-t border-border/50 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="truncate flex items-center gap-1 font-medium">
            <MapPin className="size-3 shrink-0" />
            {seller.district}
          </span>
          {seller.verified ? (
            <span className="text-emerald-600 font-semibold shrink-0 flex items-center gap-0.5 text-[10px]">
              <ShieldCheck className="size-3" />
              Verified Seller
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground">★ {seller.rating.toFixed(1)}</span>
          )}
        </div>

        {/* Dual Actions with min 44px touch targets on mobile */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onBuyNow}
            className="h-9 min-h-11 sm:min-h-9 bg-primary text-primary-foreground text-xs font-semibold rounded-md transition-all hover:opacity-90 flex items-center justify-center shadow-xs"
          >
            <span>Buy now</span>
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className={`h-9 min-h-11 sm:min-h-9 border rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
              justAdded || inCart
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {justAdded || inCart ? (
              <>
                <Check className="size-3.5 text-emerald-600" />
                <span className="text-[11px]">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="size-3.5" />
                <span className="text-[11px]">Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
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
        const next = (prev + 1) % customerExperiences.length;
        const el = scrollRef.current;
        if (el) {
          const child = el.children[next] as HTMLElement | undefined;
          if (child) {
            el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
          }
        }
        return next;
      });
    }, 4500);
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
    timerRef.current = setTimeout(() => startTimer(), 6000) as unknown as ReturnType<
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
        {customerExperiences.map((t) => (
          <div
            key={t.name}
            className="min-w-[85%] sm:min-w-[46%] lg:min-w-[31.5%] snap-start rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="size-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/15">
                  {t.item}
                </span>
              </div>
              <p className="text-xs text-subtle-foreground leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2.5 border-t border-border/60 pt-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div className="text-xs">
                <span className="block font-semibold text-foreground">{t.name}</span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-2.5" />
                  {t.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {customerExperiences.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to customer experience ${i + 1}`}
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
