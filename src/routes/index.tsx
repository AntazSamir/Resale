import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Tablet,
  Watch,
  Gamepad2,
  Layers,
  ArrowRight,
  Check,
  Search,
  FileCheck2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { ListingCard } from "@/components/listing-card";
import {
  products,
  listings,
  productFor,
  taka,
  listingFor,
  inspectionFramework,
  TOTAL_INSPECTION_CHECKS,
} from "@/data/catalog";
import hero from "@/assets/hero.jpg";

const title = "Resale — Buy Used. Know Exactly What You're Getting.";
const description =
  "Bangladesh's trusted marketplace for graded pre-owned electronics. Transparent 32-point inspection reports, NID verified sellers, battery health disclosure, and 48-hour buyer protection.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const popularCategories = [
  {
    id: "Smartphones",
    label: "Smartphones",
    icon: Smartphone,
    count: "iPhones & Galaxy",
    tag: "Flagship Models",
  },
  {
    id: "Laptops",
    label: "Laptops",
    icon: Laptop,
    count: "MacBook & Windows",
    tag: "High Performance",
  },
  {
    id: "Cameras",
    label: "Cameras",
    icon: Camera,
    count: "Fujifilm & Sony Alpha",
    tag: "Pro Optics",
  },
  {
    id: "Audio",
    label: "Audio & Headphones",
    icon: Headphones,
    count: "ANC Earbuds & Over-ear",
    tag: "Clean & Tested",
  },
  {
    id: "Tablets",
    label: "Tablets",
    icon: Tablet,
    count: "iPad Pro & Air",
    tag: "Like New Condition",
  },
  {
    id: "Smartwatches",
    label: "Smartwatches",
    icon: Watch,
    count: "Apple Watch & Bands",
    tag: "Battery Graded",
  },
  {
    id: "Gaming Consoles",
    label: "Gaming",
    icon: Gamepad2,
    count: "PS5 & Handhelds",
    tag: "Tested Hardware",
  },
  {
    id: "Accessories",
    label: "Accessories",
    icon: Layers,
    count: "Chargers & Stylus",
    tag: "OEM Verified",
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
    title: "Resale Condition Grade (A+ to D)",
    description:
      "Objective algorithm-driven condition grades and transparent battery health percentages — never vague subjective descriptions.",
    icon: ShieldCheck,
  },
  {
    num: "03",
    title: "NID Verified Sellers",
    description:
      "Every seller account is authenticated with government National ID verification, visible ratings, and verified transaction histories.",
    icon: CheckCircle2,
  },
  {
    num: "04",
    title: "48-Hour Buyer Protection",
    description:
      "Inspect your device upon arrival. If undisclosed defects or non-matching specs exist, our Dhaka-based resolution team handles immediate returns and refunds.",
    icon: Lock,
  },
];

const faqs = [
  {
    q: "Is every device tested before purchase?",
    a: "Yes. All listings require a standardized 32-point inspection covering physical condition, display integrity, battery diagnostics, camera sensors, biometric sensors, and connectivity before going live.",
  },
  {
    q: "What does Resale Condition Grade A+ mean?",
    a: "Grade A+ (Like New) represents devices with zero visible signs of use, 100% original factory components, complete original accessories, and verified battery health.",
  },
  {
    q: "Are repaired devices allowed on Resale?",
    a: "Yes, but repairs must be transparently disclosed. Sellers must report whether replacement parts (such as screens or batteries) are official OEM or third-party, and supporting documentation is verified.",
  },
  {
    q: "How is battery health checked and reported?",
    a: "For smartphones and laptops, sellers report the exact operating system battery health percentage and cycle count, which is verified during listing moderation.",
  },
  {
    q: "How are sellers verified?",
    a: "All sellers must verify their identity with a valid Bangladeshi National ID (NID) and phone OTP. Verified sellers receive a prominent 'NID Verified' badge on all listings.",
  },
  {
    q: "What does the 48-Hour Buyer Protection cover?",
    a: "It covers items significantly different from the listing report, undisclosed functional defects, wrong models or specifications, and undisclosed third-party repairs. You have 48 hours after delivery to inspect and report any discrepancy.",
  },
  {
    q: "How does Cash on Delivery (COD) work?",
    a: "You place an order and pay the courier upon delivery in cash or digital wallet (bKash/Nagad). Your payment is held securely during the 48-hour inspection window.",
  },
];

function Index() {
  const [activeHowItWorksTab, setActiveHowItWorksTab] = useState<"buyers" | "sellers">("buyers");
  const [activeInspectionTab, setActiveInspectionTab] = useState<string>("Physical");
  const [faqSearch, setFaqSearch] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [homeSearchInput, setHomeSearchInput] = useState("");
  const navigate = useNavigate();

  const handleHomeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearchInput.trim()) {
      navigate({
        to: "/products",
        search: { q: homeSearchInput.trim(), category: undefined, brand: undefined },
      });
    } else {
      navigate({
        to: "/products",
        search: { q: undefined, category: undefined, brand: undefined },
      });
    }
  };

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return faqs;
    const query = faqSearch.toLowerCase();
    return faqs.filter(
      (f) => f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query),
    );
  }, [faqSearch]);

  const featuredDealListing = listingFor("l-1");
  const featuredDealProduct = featuredDealListing
    ? productFor(featuredDealListing.productId)
    : undefined;

  // Curated subsets for product shelves with 0 duplication
  const featuredProducts = useMemo(
    () =>
      [
        products.find((p) => p.id === "iphone-15-pro-256")!,
        products.find((p) => p.id === "macbook-pro-14-m3")!,
        products.find((p) => p.id === "sony-a7-iv")!,
        products.find((p) => p.id === "apple-ipad-pro-11-m2")!,
      ].filter(Boolean),
    [],
  );

  const smartphoneProducts = useMemo(
    () => products.filter((p) => p.category === "Smartphones").slice(0, 8),
    [],
  );

  const laptopProducts = useMemo(
    () => products.filter((p) => p.category === "Laptops").slice(0, 8),
    [],
  );

  const cameraAudioProducts = useMemo(
    () =>
      products.filter((p) => ["Cameras", "Audio", "Smartwatches"].includes(p.category)).slice(0, 8),
    [],
  );

  const tabletGamingProducts = useMemo(
    () =>
      products
        .filter((p) => ["Tablets", "Gaming Consoles", "Accessories"].includes(p.category))
        .slice(0, 8),
    [],
  );

  return (
    <div className="min-h-screen bg-background border-x border-border mx-auto max-w-7xl pb-16 md:pb-0 overflow-x-hidden">
      {/* ════════════════════════════════════════════════════════════════
          1. TOP NAVIGATION & STANDARDIZED TRUST BAR
      ════════════════════════════════════════════════════════════════ */}
      <SiteHeader />

      {/* ════════════════════════════════════════════════════════════════
          2. HERO & QUICK DISCOVERY
      ════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-border bg-card">
        {/* Desktop Hero */}
        <div className="hidden md:grid md:grid-cols-[1.2fr_0.8fr] items-stretch">
          <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-5">
                <ShieldCheck className="size-4" />
                <span>Bangladesh&apos;s Trusted Electronics Marketplace</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tight text-foreground">
                Buy Used.
                <br />
                Know Exactly What You&apos;re Getting.
              </h1>
              <p className="mt-4 text-sm lg:text-base text-subtle-foreground max-w-xl leading-relaxed">
                Verified pre-owned electronics with transparent condition reports, standardized
                32-point inspections, battery health disclosures, and 48-hour buyer protection.
              </p>

              {/* Search input in hero */}
              <form onSubmit={handleHomeSearch} className="mt-6 flex gap-2 max-w-lg">
                <div className="flex-1 flex items-center gap-2 border border-border bg-background px-3.5 py-2.5 focus-within:border-foreground transition-colors">
                  <Search className="size-4 text-muted-foreground shrink-0" />
                  <input
                    value={homeSearchInput}
                    onChange={(e) => setHomeSearchInput(e.target.value)}
                    placeholder="Search iPhone, MacBook, Sony camera, Audio..."
                    className="w-full bg-transparent outline-none text-xs md:text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-semibold px-5 py-2.5 text-xs md:text-sm hover:opacity-90 shrink-0"
                >
                  Search
                </button>
              </form>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  search={{ q: undefined, category: undefined, brand: undefined }}
                  className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-xs md:text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Layers className="size-4 text-orange-500" />
                  <span>Shop Devices</span>
                </Link>
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground border border-border px-5 py-2.5 text-xs md:text-sm font-semibold hover:bg-muted transition-colors"
                >
                  <span>Sell Your Device</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Side Visual */}
          <div
            className="hidden md:block relative bg-muted border-l border-border overflow-hidden"
            style={{
              backgroundImage: `url(${hero})`,
              backgroundSize: "cover",
              backgroundPosition: "center right",
            }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/30 to-transparent p-6 flex flex-col justify-end">
              <div className="bg-card/95 backdrop-blur-xs border border-border p-4 space-y-2 max-w-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Demo Inspection Report</span>
                  <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 border border-emerald-500/20">
                    31/32 Checks Passed
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  OEM Display &middot; 94% Battery Health &middot; Genuine Serial Match
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Hero */}
        <div className="block md:hidden p-4 pb-2">
          <div className="relative border border-border bg-card p-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="size-3.5" />
              <span>Verified Marketplace</span>
            </div>
            <h1 className="text-2xl font-display font-bold leading-tight text-foreground tracking-tight">
              Buy Used.
              <br />
              Know Exactly What You&apos;re Getting.
            </h1>
            <p className="text-xs text-subtle-foreground leading-relaxed">
              Verified pre-owned electronics with transparent condition reports, 32-point inspection
              checks, and 48-hour buyer protection.
            </p>

            <form onSubmit={handleHomeSearch} className="flex gap-1.5">
              <div className="flex-1 flex items-center gap-2 border border-border bg-background px-3 py-2">
                <Search className="size-3.5 text-muted-foreground shrink-0" />
                <input
                  value={homeSearchInput}
                  onChange={(e) => setHomeSearchInput(e.target.value)}
                  placeholder="Search devices..."
                  className="w-full bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground font-semibold px-3.5 py-2 text-xs"
              >
                Go
              </button>
            </form>

            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/products"
                search={{ q: undefined, category: undefined, brand: undefined }}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-xs font-semibold py-2.5 hover:opacity-90"
              >
                <Layers className="size-3.5 text-orange-500" />
                <span>Shop Devices</span>
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center justify-center gap-1.5 bg-secondary text-secondary-foreground border border-border text-xs font-semibold py-2 hover:bg-muted"
              >
                <span>Sell Your Device</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4-Item Trust Feature Strip (Matching User Reference) */}
        <div className="px-4 md:px-5 py-3 md:py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border border border-border bg-card text-center p-3 sm:p-5">
            {/* Transparent Grading */}
            <div className="flex flex-col items-center px-2 py-2 sm:py-0 space-y-1">
              <ShieldCheck className="size-5 text-foreground mb-0.5" />
              <h3 className="font-bold text-foreground text-xs sm:text-sm leading-tight">
                Transparent Grading
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">
                Every unit graded A+ to D.
              </p>
            </div>

            {/* NID Verified Sellers */}
            <div className="flex flex-col items-center px-2 py-2 sm:py-0 space-y-1">
              <CheckCircle2 className="size-5 text-foreground mb-0.5" />
              <h3 className="font-bold text-foreground text-xs sm:text-sm leading-tight">
                NID Verified Sellers
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">
                NID-verified accounts only.
              </p>
            </div>

            {/* 32-Point Inspection */}
            <div className="flex flex-col items-center px-2 py-2 sm:py-0 space-y-1">
              <FileCheck2 className="size-5 text-foreground mb-0.5" />
              <h3 className="font-bold text-foreground text-xs sm:text-sm leading-tight">
                32-Point Inspection
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">
                Comprehensive component test.
              </p>
            </div>

            {/* 48h Buyer Protection */}
            <div className="flex flex-col items-center px-2 py-2 sm:py-0 space-y-1">
              <Lock className="size-5 text-foreground mb-0.5" />
              <h3 className="font-bold text-foreground text-xs sm:text-sm leading-tight">
                48h Buyer Protection
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">
                Pay on arrival &amp; dispute window.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          3. POPULAR CATEGORIES / TRENDING MODELS
      ════════════════════════════════════════════════════════════════ */}
      <section id="categories" className="py-6 sm:py-8 px-4 md:px-5">
        {/* Mobile Header & 5-Card Row (Matching Reference Screenshot) */}
        <div className="block md:hidden mb-2">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
              Explore by Category
            </span>
            <Link
              to="/categories"
              className="text-xs font-semibold text-foreground hover:text-primary transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="flex gap-2.5 overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-4 px-4 pb-1">
            {popularCategories.map((cat) => {
              const Icon = cat.icon;
              const displayLabel =
                cat.label === "Audio & Headphones"
                  ? "Audio"
                  : cat.label === "Gaming Consoles"
                    ? "Gaming"
                    : cat.label;
              return (
                <Link
                  key={cat.id}
                  to="/products"
                  search={{ category: cat.id, q: undefined, brand: undefined }}
                  className="w-20 xs:w-22 shrink-0 snap-start border border-border bg-card p-2.5 flex flex-col items-center justify-center text-center aspect-square hover:border-primary transition-colors group"
                >
                  <Icon className="size-5 text-foreground group-hover:text-primary mb-1.5 transition-colors" />
                  <span className="text-[10px] font-semibold text-foreground truncate w-full leading-tight">
                    {displayLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Header & Full 8-Grid */}
        <div className="hidden md:block">
          <div className="flex items-end justify-between border-b border-border pb-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold">Explore by Category</h2>
              <p className="text-xs text-muted-foreground">
                Browse graded pre-owned devices by electronics category
              </p>
            </div>
            <Link to="/categories" className="text-xs font-semibold text-primary hover:underline">
              View all categories →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 hairline-grid bg-card">
            {popularCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to="/products"
                  search={{ category: cat.id, q: undefined, brand: undefined }}
                  className="group p-5 sm:p-6 flex flex-col justify-between h-36 sm:h-40 hover:bg-secondary/70 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="size-9 bg-muted border border-border flex items-center justify-center text-foreground group-hover:border-primary transition-colors">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5">
                      {cat.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold group-hover:text-primary transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4. FEATURED PRODUCTS (Curated Cross-Category Flagships)
      ════════════════════════════════════════════════════════════════ */}
      <section id="featured-products" className="py-8 px-4 md:px-5 border-t border-border">
        <div className="flex items-end justify-between border-b border-border pb-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Editor&apos;s Pick</span>
            </div>
            <h2 className="text-xl md:text-2xl font-display font-bold">Featured Products</h2>
            <p className="text-xs text-muted-foreground">
              Hand-curated top models across smartphones, MacBooks, audio, and cameras
            </p>
          </div>
          <Link
            to="/products"
            search={{ q: undefined, category: undefined, brand: undefined }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Browse all catalog →
          </Link>
        </div>

        {/* Desktop 4-grid */}
        <div className="hidden lg:grid hairline-grid grid-cols-4 bg-card">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Mobile Swipe */}
        <div className="block lg:hidden">
          <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
            {featuredProducts.map((p) => (
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

      {/* ════════════════════════════════════════════════════════════════
          5. SMARTPHONES & FLAGSHIPS PRODUCT SHELF
      ════════════════════════════════════════════════════════════════ */}
      <section id="smartphones-shelf" className="py-8 px-4 md:px-5 border-t border-border">
        <div className="flex items-end justify-between border-b border-border pb-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold">
              Smartphones &amp; Flagships
            </h2>
            <p className="text-xs text-muted-foreground">
              Apple iPhones, Samsung Galaxy S-Series, and Google Pixels with graded condition
              reports
            </p>
          </div>
          <Link
            to="/products"
            search={{ category: "Smartphones", q: undefined, brand: undefined }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View all Smartphones →
          </Link>
        </div>

        {/* Desktop 4-grid */}
        <div className="hidden lg:grid hairline-grid grid-cols-4 bg-card">
          {smartphoneProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Mobile Swipe */}
        <div className="block lg:hidden">
          <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
            {smartphoneProducts.map((p) => (
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

      {/* ════════════════════════════════════════════════════════════════
          6. BEST DEALS / BEST VALUE
      ════════════════════════════════════════════════════════════════ */}
      {featuredDealListing && featuredDealProduct && (
        <section className="py-6 px-4 md:px-5 border-t border-border bg-card">
          <div className="border border-border p-5 md:p-8 relative overflow-hidden bg-background">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                <Zap className="size-3.5 fill-current text-amber-600" />
                <span>Featured Listing (Sample Demo)</span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5">
                Sample Catalog Data
              </span>
            </div>

            <div className="flex flex-row items-center justify-between gap-3.5 sm:gap-6 md:gap-8">
              <div className="space-y-2 sm:space-y-3.5 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="bg-emerald-500 text-white font-bold text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                    Grade {featuredDealListing.grade}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold truncate">
                    {featuredDealProduct.brand} &middot; {featuredDealProduct.category}
                  </span>
                </div>

                <h2 className="text-sm sm:text-xl md:text-3xl font-display font-bold text-foreground leading-tight line-clamp-2">
                  {featuredDealProduct.name}
                </h2>

                <p className="text-[11px] sm:text-xs md:text-sm text-subtle-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
                  {featuredDealListing.sellerNote ||
                    "32-point tested with original display, high battery health, and verified NID seller."}
                </p>

                {/* Price */}
                <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2.5 pt-0.5 sm:pt-1">
                  <span className="text-base sm:text-2xl md:text-3xl font-display font-bold text-primary">
                    {taka(featuredDealListing.price)}
                  </span>
                  {featuredDealProduct.retail > featuredDealListing.price && (
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      Ref. New: {taka(featuredDealProduct.retail)} (Sample)
                    </span>
                  )}
                </div>

                <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                  <Link
                    to="/listing/$listingId"
                    params={{ listingId: featuredDealListing.id }}
                    className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold px-3 sm:px-5 py-2 sm:py-3 text-[11px] sm:text-xs md:text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    View Verified Listing →
                  </Link>
                  <Link
                    to="/products"
                    search={{
                      category: featuredDealProduct.category,
                      q: undefined,
                      brand: undefined,
                    }}
                    className="hidden sm:inline-flex items-center justify-center bg-secondary text-secondary-foreground border border-border font-medium px-4 py-3 text-xs md:text-sm hover:bg-muted transition-colors"
                  >
                    Compare Similar Models
                  </Link>
                </div>
              </div>

              {/* Product Visual - Increased size on mobile with side-by-side presentation */}
              <div className="relative w-36 xs:w-44 sm:w-64 md:w-80 lg:w-96 aspect-square border border-border bg-muted shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src={featuredDealProduct.image}
                  alt={featuredDealProduct.name}
                  className="size-full object-cover"
                />
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-background/90 backdrop-blur-xs text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 border border-border">
                  32-Pt Inspected
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════
          7. RECENTLY ADDED VERIFIED LISTINGS
      ════════════════════════════════════════════════════════════════ */}
      <section id="recent-listings" className="py-8 px-4 md:px-5 border-t border-border">
        <div className="flex items-end justify-between border-b border-border pb-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold">
              Recently Added Verified Units
            </h2>
            <p className="text-xs text-muted-foreground">
              Individual units graded and listed by verified sellers across Bangladesh
            </p>
          </div>
          <Link
            to="/products"
            search={{ q: undefined, category: undefined, brand: undefined }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View all listings →
          </Link>
        </div>

        {/* Desktop 4-grid */}
        <div className="hidden lg:grid hairline-grid grid-cols-4 bg-card">
          {listings.slice(0, 8).map((listing) => {
            const product = productFor(listing.productId);
            if (!product) return null;
            return <ListingCard key={listing.id} listing={listing} product={product} />;
          })}
        </div>

        {/* Mobile Swipe Carousel */}
        <div className="block lg:hidden">
          <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
            {listings.slice(0, 8).map((listing) => {
              const product = productFor(listing.productId);
              if (!product) return null;
              return (
                <div
                  key={listing.id}
                  className="w-55 shrink-0 snap-start border border-border bg-card flex flex-col"
                >
                  <ListingCard listing={listing} product={product} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          8. WHY RESALE IS DIFFERENT
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 md:px-5 border-t border-border bg-card">
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Marketplace Transparency</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Why Resale Is Different</h2>
          <p className="text-xs md:text-sm text-subtle-foreground mt-1">
            Built from the ground up to eliminate fraud, hidden defects, and ambiguous grading in
            Bangladesh electronics resale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 hairline-grid bg-card">
          {whyResalePillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.num}
                className="p-6 md:p-7 flex flex-col justify-between space-y-4 hover:bg-secondary/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-muted-foreground">
                      {p.num}
                    </span>
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground leading-snug">{p.title}</h3>
                  <p className="text-xs text-subtle-foreground leading-relaxed">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          9. LAPTOPS & MACBOOKS PRODUCT SHELF
      ════════════════════════════════════════════════════════════════ */}
      <section id="laptops-shelf" className="py-8 px-4 md:px-5 border-t border-border">
        <div className="flex items-end justify-between border-b border-border pb-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold">Laptops &amp; MacBooks</h2>
            <p className="text-xs text-muted-foreground">
              Apple Silicon MacBooks, Dell XPS, and Lenovo ThinkPads tested for battery and thermals
            </p>
          </div>
          <Link
            to="/products"
            search={{ category: "Laptops", q: undefined, brand: undefined }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View all Laptops →
          </Link>
        </div>

        {/* Desktop 4-grid */}
        <div className="hidden lg:grid hairline-grid grid-cols-4 bg-card">
          {laptopProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Mobile Swipe */}
        <div className="block lg:hidden">
          <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
            {laptopProducts.map((p) => (
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

      {/* ════════════════════════════════════════════════════════════════
          10. RESALE 32-POINT INSPECTION SHOWCASE
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 md:px-5 border-t border-border">
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider mb-2">
            <FileCheck2 className="size-3.5" />
            <span>Standardized Checklist</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            Resale 32-Point Inspection
          </h2>
          <p className="text-xs md:text-sm text-subtle-foreground mt-1">
            Every device listed on Resale is evaluated against our 5 core inspection categories.
          </p>
        </div>

        <div className="border border-border bg-card p-5 md:p-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-6">
            {inspectionFramework.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveInspectionTab(cat.name)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border ${
                  activeInspectionTab === cat.name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-subtle-foreground border-border hover:text-foreground"
                }`}
              >
                {cat.name} Checks ({cat.checks.length})
              </button>
            ))}
          </div>

          {/* Active Checklist Items */}
          {(() => {
            const activeCategory = inspectionFramework.find((c) => c.name === activeInspectionTab);
            if (!activeCategory) return null;
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {activeCategory.checks.map((check) => (
                    <div
                      key={check}
                      className="p-3 bg-secondary/70 border border-border flex items-start gap-2.5 text-xs"
                    >
                      <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground block">{check}</span>
                        <span className="text-[10px] text-muted-foreground">
                          Standardized Inspection item
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>
                    Inspection Framework: {TOTAL_INSPECTION_CHECKS} Total Component Checks
                  </span>
                  <Link
                    to="/products"
                    search={{ q: undefined, category: undefined, brand: undefined }}
                    className="text-primary font-semibold hover:underline"
                  >
                    Explore inspected listings →
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          11. CAMERAS, AUDIO & WEARABLES PRODUCT SHELF
      ════════════════════════════════════════════════════════════════ */}
      <section id="cameras-audio-shelf" className="py-8 px-4 md:px-5 border-t border-border">
        <div className="flex items-end justify-between border-b border-border pb-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold">
              Cameras, Audio &amp; Wearables
            </h2>
            <p className="text-xs text-muted-foreground">
              Fujifilm &amp; Sony cameras, ANC headphones, and Apple Watches
            </p>
          </div>
          <Link
            to="/products"
            search={{ q: undefined, category: "Audio", brand: undefined }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View Audio &amp; Cameras →
          </Link>
        </div>

        {/* Desktop 4-grid */}
        <div className="hidden lg:grid hairline-grid grid-cols-4 bg-card">
          {cameraAudioProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Mobile Swipe */}
        <div className="block lg:hidden">
          <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
            {cameraAudioProducts.map((p) => (
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

      {/* ════════════════════════════════════════════════════════════════
          12. HOW RESALE WORKS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 md:px-5 border-t border-border bg-card">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">How Resale Works</h2>
          <p className="text-xs md:text-sm text-subtle-foreground">
            A transparent 3-step process for safe buyer transactions and verified seller payouts.
          </p>

          <div className="inline-flex border border-border p-1 bg-muted mt-5">
            <button
              onClick={() => setActiveHowItWorksTab("buyers")}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeHowItWorksTab === "buyers"
                  ? "bg-primary text-primary-foreground"
                  : "text-subtle-foreground hover:text-foreground"
              }`}
            >
              For Buyers
            </button>
            <button
              onClick={() => setActiveHowItWorksTab("sellers")}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeHowItWorksTab === "sellers"
                  ? "bg-primary text-primary-foreground"
                  : "text-subtle-foreground hover:text-foreground"
              }`}
            >
              For Sellers
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto border border-border bg-background p-6 md:p-8">
          {activeHowItWorksTab === "buyers" ? (
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <li className="space-y-2">
                <span className="flex size-7 items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
                  01
                </span>
                <h4 className="font-bold text-sm text-foreground">Compare Graded Listings</h4>
                <p className="text-xs text-subtle-foreground leading-relaxed">
                  Review the 32-point inspection findings, battery health %, high-resolution angle
                  photos, and seller NID status.
                </p>
              </li>
              <li className="space-y-2">
                <span className="flex size-7 items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
                  02
                </span>
                <h4 className="font-bold text-sm text-foreground">Order with Cash on Delivery</h4>
                <p className="text-xs text-subtle-foreground leading-relaxed">
                  Pay upon delivery across Bangladesh. Funds are protected during your post-delivery
                  inspection window.
                </p>
              </li>
              <li className="space-y-2">
                <span className="flex size-7 items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
                  03
                </span>
                <h4 className="font-bold text-sm text-foreground">48-Hour Inspection Window</h4>
                <p className="text-xs text-subtle-foreground leading-relaxed">
                  Test every component. If any undisclosed fault or mismatch exists, initiate a
                  dispute for a full refund.
                </p>
              </li>
            </ol>
          ) : (
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <li className="space-y-2">
                <span className="flex size-7 items-center justify-center bg-muted-foreground text-background font-bold text-xs">
                  01
                </span>
                <h4 className="font-bold text-sm text-foreground">Guided 32-Point Listing</h4>
                <p className="text-xs text-subtle-foreground leading-relaxed">
                  Enter device model, upload clear angle photos, report battery health, and disclose
                  any prior repairs honestly.
                </p>
              </li>
              <li className="space-y-2">
                <span className="flex size-7 items-center justify-center bg-muted-foreground text-background font-bold text-xs">
                  02
                </span>
                <h4 className="font-bold text-sm text-foreground">Human Moderation Check</h4>
                <p className="text-xs text-subtle-foreground leading-relaxed">
                  Our moderation team verifies condition photos, IMEI validity, and pricing realism
                  before your listing goes live.
                </p>
              </li>
              <li className="space-y-2">
                <span className="flex size-7 items-center justify-center bg-muted-foreground text-background font-bold text-xs">
                  03
                </span>
                <h4 className="font-bold text-sm text-foreground">Dispatch &amp; Direct Payout</h4>
                <p className="text-xs text-subtle-foreground leading-relaxed">
                  Hand over the packaged device to our courier partner. Receive payout directly via
                  bKash, Nagad, or Bank.
                </p>
              </li>
            </ol>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          13. TABLETS, GAMING & ACCESSORIES PRODUCT SHELF
      ════════════════════════════════════════════════════════════════ */}
      <section id="tablets-gaming-shelf" className="py-8 px-4 md:px-5 border-t border-border">
        <div className="flex items-end justify-between border-b border-border pb-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold">
              Tablets, Gaming &amp; Accessories
            </h2>
            <p className="text-xs text-muted-foreground">
              Apple iPad Pro &amp; Air, PlayStation 5 Slim, ROG Ally, and OEM accessories
            </p>
          </div>
          <Link
            to="/products"
            search={{ category: "Tablets", q: undefined, brand: undefined }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View Tablets &amp; Gaming →
          </Link>
        </div>

        {/* Desktop 4-grid */}
        <div className="hidden lg:grid hairline-grid grid-cols-4 bg-card">
          {tabletGamingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Mobile Swipe */}
        <div className="block lg:hidden">
          <div className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
            {tabletGamingProducts.map((p) => (
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

      {/* ════════════════════════════════════════════════════════════════
          14. SELL YOUR DEVICE VALUATION BANNER
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-8 px-4 md:px-5 border-t border-border">
        <div className="border border-border bg-card p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>Seller Program</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Ready to resell your pre-owned smartphone or laptop?
            </h3>
            <p className="text-xs md:text-sm text-subtle-foreground leading-relaxed">
              List your device in under 3 minutes with our structured condition grading tool. NID
              verified buyers with direct digital payouts.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              to="/sell"
              className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3.5 text-xs md:text-sm uppercase tracking-wider hover:opacity-90"
            >
              <span>Start Selling Now</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/partner"
              className="w-full sm:w-auto text-center inline-flex items-center justify-center bg-secondary text-secondary-foreground border border-border font-medium px-5 py-3.5 text-xs md:text-sm hover:bg-muted"
            >
              Partner Merchant Program
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          15. WHAT BUYERS & SELLERS VALUE (SAMPLE DEMO)
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-8 px-4 md:px-5 border-t border-border bg-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-secondary text-subtle-foreground border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Sample Community Feedback (Demo)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-display font-bold">
              What Buyers &amp; Sellers Value
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 hairline-grid bg-background">
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-1 text-amber-500 text-xs">{"★".repeat(5)}</div>
            <p className="text-xs text-subtle-foreground leading-relaxed">
              &ldquo;The 32-point inspection matched the iPhone 15 Pro exactly. Battery health was
              reported at 96% and diagnostics were 100% accurate.&rdquo;
            </p>
            <div className="text-[11px] pt-2 border-t border-border text-muted-foreground">
              <span className="font-semibold text-foreground">Tanvir Ahmed</span> &middot; Dhaka
              (Banani)
            </div>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-1 text-amber-500 text-xs">{"★".repeat(5)}</div>
            <p className="text-xs text-subtle-foreground leading-relaxed">
              &ldquo;Sold my MacBook Air M2. The structured condition checklist removed all endless
              bargaining. Buyer inspected and payout cleared smoothly.&rdquo;
            </p>
            <div className="text-[11px] pt-2 border-t border-border text-muted-foreground">
              <span className="font-semibold text-foreground">Nusrat Jahan</span> &middot;
              Chattogram (GEC)
            </div>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-1 text-amber-500 text-xs">{"★".repeat(5)}</div>
            <p className="text-xs text-subtle-foreground leading-relaxed">
              &ldquo;Purchased a Fujifilm X100V with Cash on Delivery. 48-hour inspection window
              gave total peace of mind to verify sensor cleanliness.&rdquo;
            </p>
            <div className="text-[11px] pt-2 border-t border-border text-muted-foreground">
              <span className="font-semibold text-foreground">Shakil Hasan</span> &middot; Sylhet
              (Zindabazar)
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          16. FREQUENTLY ASKED QUESTIONS
      ════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-12 px-4 md:px-5 border-t border-border">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-subtle-foreground">
            Clear, honest answers about our inspection, condition grading, and buyer protection.
          </p>

          <div className="mt-4 flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs max-w-md mx-auto">
            <Search className="size-3.5 text-muted-foreground shrink-0" />
            <input
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Filter questions (e.g. grading, COD, return)..."
              className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-xs"
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-2">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={faq.q} className="border border-border bg-card transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs md:text-sm font-semibold text-foreground hover:bg-secondary/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-3 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-subtle-foreground leading-relaxed border-t border-border/40 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          17. BANGLADESH DISTRICT COVERAGE & DELIVERY INFO
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-8 px-4 md:px-5 border-t border-border bg-card">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
          <h3 className="text-lg md:text-xl font-display font-bold">
            Delivering Across Bangladesh
          </h3>
          <p className="text-xs text-muted-foreground">
            Standard delivery across all 8 administrative divisions with cash on delivery and
            verified courier tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto text-xs">
          {[
            "Dhaka",
            "Chattogram",
            "Sylhet",
            "Rajshahi",
            "Khulna",
            "Barishal",
            "Rangpur",
            "Mymensingh",
          ].map((d) => (
            <span
              key={d}
              className="bg-secondary border border-border px-3 py-1 text-foreground font-medium"
            >
              📍 {d}
            </span>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          18. SITE FOOTER
      ════════════════════════════════════════════════════════════════ */}
      <SiteFooter />
    </div>
  );
}
