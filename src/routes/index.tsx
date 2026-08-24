import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  BadgeCheck,
  Users,
  FileText,
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Tablet,
  Gamepad2,
  Plug,
  ArrowRight,
  Search,
  Scale,
  ShoppingBag,
  Heart,
  Check,
  Star,
  Clock,
  Lock,
  MapPin,
  Repeat,
  Wallet,
  Tag,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import {
  products,
  listings,
  productFor,
  listingsFor,
  cheapest,
  taka,
  type Listing,
  type Product,
} from "@/data/catalog";
import { useCart } from "@/lib/cart-store";
import hero from "@/assets/hero.jpg";

const title = "Resale — Buy Used Electronics You Can Actually Trust in Bangladesh";
const description =
  "Inspected second-hand phones, laptops, cameras and audio from verified Bangladeshi sellers — transparent condition grades, real product details and cash on delivery.";

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

/* ────────────────────────────── static content ────────────────────────────── */

const trustPoints = [
  {
    num: "01",
    title: "Inspected Devices",
    body: "Every eligible device goes through standardized inspection.",
    icon: ShieldCheck,
  },
  {
    num: "02",
    title: "Transparent Grading",
    body: "Know the actual condition before buying.",
    icon: BadgeCheck,
  },
  {
    num: "03",
    title: "Verified Sellers",
    body: "Buy with more confidence.",
    icon: Users,
  },
  {
    num: "04",
    title: "Real Product Details",
    body: "Clear specifications, photos and condition information.",
    icon: FileText,
  },
];

const categoryTiles = [
  { id: "Smartphones", label: "Smartphones", icon: Smartphone },
  { id: "Laptops", label: "Laptops", icon: Laptop },
  { id: "Cameras", label: "Cameras", icon: Camera },
  { id: "Tablets", label: "Tablets", icon: Tablet },
  { id: "Audio", label: "Audio", icon: Headphones },
  { id: "Gaming Consoles", label: "Gaming", icon: Gamepad2 },
  { id: "Accessories", label: "Accessories", icon: Plug },
];

const conditionCards = [
  {
    grade: "A",
    title: "Grade A",
    heading: "Excellent condition",
    body: "Minimal signs of use.",
    tone: "bg-grade-a",
  },
  {
    grade: "B",
    title: "Grade B",
    heading: "Good condition",
    body: "Visible but clearly documented wear.",
    tone: "bg-grade-b",
  },
  {
    grade: "C",
    title: "Grade C",
    heading: "Fair condition",
    body: "More noticeable signs of use, priced accordingly.",
    tone: "bg-grade-c",
  },
];

const howItWorks = [
  { num: "01", icon: Search, title: "Find", body: "Browse inspected second-hand devices." },
  { num: "02", icon: Scale, title: "Compare", body: "Compare condition, price and seller info." },
  { num: "03", icon: ShoppingBag, title: "Buy", body: "Choose the device that fits your needs." },
];

const whyBuy = [
  {
    icon: Tag,
    title: "Transparent",
    body: "See condition, grading and product details before buying.",
  },
  { icon: Repeat, title: "Trusted", body: "Know who you're buying from." },
  {
    icon: Wallet,
    title: "Better Value",
    body: "Get quality electronics without paying full retail prices.",
  },
];

const heroStats = [
  { icon: Users, value: "100K+", label: "Happy Buyers" },
  { icon: Star, value: "4.8/5", label: "Buyer Rating" },
  { icon: Clock, value: "7 Days", label: "Easy Returns" },
  { icon: Lock, value: "Secure", label: "Payments" },
];

/* ────────────────────────────── local cards ────────────────────────────── */

function FeaturedCard({ product, listing }: { product: Product; listing: Listing }) {
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const inCart = isInCart(listing.id);

  const specLine = [
    product.specs[0]?.value,
    listing.battery ? `${listing.battery}% battery` : listing.accessories,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-shadow hover:shadow-md">
      <div className="relative bg-secondary/60 p-4">
        <span className="absolute left-3 top-3 z-10 rounded-md bg-grade-a/12 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-grade-a">
          Grade {listing.grade}
        </span>
        <button
          type="button"
          aria-label="Save device"
          onClick={() => setSaved((s) => !s)}
          className="absolute right-3 top-3 z-10 grid size-7 place-items-center rounded-full bg-background/90 text-muted-foreground transition-colors hover:text-primary"
        >
          <Heart className={`size-3.5 ${saved ? "fill-primary text-primary" : ""}`} />
        </button>
        <Link to="/listing/$listingId" params={{ listingId: listing.id }} className="block">
          <img
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            loading="lazy"
            className="mx-auto aspect-square w-full max-w-[220px] rounded-lg object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[10px] font-semibold text-grade-a shadow-xs">
          <BadgeCheck className="size-3" />
          Inspected
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          to="/listing/$listingId"
          params={{ listingId: listing.id }}
          className="line-clamp-1 text-sm font-semibold text-foreground hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="line-clamp-1 text-xs text-muted-foreground">{specLine}</p>
        <p className="font-display text-lg font-bold text-primary">{taka(listing.price)}</p>

        <div className="mt-auto flex min-w-0 items-center gap-2 pt-1 text-xs text-muted-foreground">
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-[9px] font-bold text-foreground">
            {listing.seller.name.charAt(0)}
          </span>
          <span className="truncate font-medium text-foreground">{listing.seller.name}</span>
          {listing.seller.verified && <BadgeCheck className="size-3.5 shrink-0 text-grade-a" />}
          <span className="ml-auto shrink-0">{listing.seller.district}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={() => addToCart(listing.id)}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-primary/40 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            {inCart ? <Check className="size-3.5" /> : null}
            {inCart ? "Added" : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={() => {
              addToCart(listing.id);
              navigate({ to: "/cart" });
            }}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Buy now <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function SectionHead({
  title: heading,
  sub,
  href,
  linkLabel,
  search,
}: {
  title: string;
  sub: string;
  href: "/products" | "/categories";
  linkLabel: string;
  search?: { q?: string | undefined; category?: string | undefined; brand?: string | undefined };
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {heading}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{sub}</p>
      </div>
      {href === "/products" ? (
        <Link
          to="/products"
          search={{
            q: search?.q,
            category: search?.category,
            brand: search?.brand,
          }}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary hover:underline sm:text-sm"
        >
          {linkLabel} <ArrowRight className="size-3.5" />
        </Link>
      ) : (
        <Link
          to="/categories"
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary hover:underline sm:text-sm"
        >
          {linkLabel} <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}

/* ────────────────────────────── page ────────────────────────────── */

function Index() {
  const featured = useMemo(() => {
    const picks = ["iphone-15-pro-256", "macbook-air-m2-256", "sony-a7iii", "sony-wh1000xm4"];
    const rows = picks
      .map((id) => productFor(id))
      .filter((p): p is Product => Boolean(p))
      .map((p) => ({ product: p, listing: cheapest(p.id) }))
      .filter((r): r is { product: Product; listing: Listing } => Boolean(r.listing));
    if (rows.length >= 4) return rows.slice(0, 4);
    const fallback = products
      .map((p) => ({ product: p, listing: cheapest(p.id) }))
      .filter((r): r is { product: Product; listing: Listing } => Boolean(r.listing));
    return fallback.slice(0, 4);
  }, []);

  const justListed = useMemo(
    () =>
      [...listings]
        .sort((a, b) => (a.listedAt < b.listedAt ? 1 : -1))
        .slice(0, 8)
        .map((l) => ({ listing: l, product: productFor(l.productId) }))
        .filter((r): r is { listing: Listing; product: Product } => Boolean(r.product)),
    [],
  );

  const topSellers = useMemo(() => {
    const map = new Map<string, { name: string; verified: boolean; count: number; role: string }>();
    for (const l of listings) {
      const cur = map.get(l.seller.name);
      if (cur) cur.count += 1;
      else
        map.set(l.seller.name, {
          name: l.seller.name,
          verified: l.seller.verified,
          count: 1,
          role: l.storeName ?? l.seller.district,
        });
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 6);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return counts;
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col bg-background">
      <SiteHeader />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-linear-to-br from-brand-soft via-background to-brand-soft/60">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:py-14">
          <div className="min-w-0 space-y-5">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="size-4" />
              Verified Second-Hand Electronics
            </div>
            <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Buy Used.
              <br />
              Know Exactly
              <br />
              What You&apos;re Getting.
            </h1>
            <p className="max-w-md text-sm text-subtle-foreground">
              Inspected devices from trusted sellers, with transparent condition grades and real
              product details.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                search={{ q: undefined, category: undefined, brand: undefined }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                Shop Devices <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 rounded-lg border border-primary bg-background px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                Sell Your Device
              </Link>
            </div>

            <dl className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
              {heroStats.map((s) => (
                <div key={s.label} className="flex min-w-0 items-center gap-2">
                  <s.icon className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="truncate text-sm font-bold text-foreground">{s.value}</dt>
                    <dd className="truncate text-[11px] text-muted-foreground">{s.label}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <img
              src={hero}
              alt="Inspected pre-owned smartphones, laptops, cameras and headphones"
              width={900}
              height={700}
              className="w-full rounded-2xl object-cover shadow-lg"
            />
            <div className="absolute -left-2 bottom-6 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-md sm:flex">
              <BadgeCheck className="size-5 text-grade-a" />
              <div>
                <p className="text-xs font-bold text-foreground">Inspected</p>
                <p className="text-[10px] text-muted-foreground">67 Point Check</p>
              </div>
            </div>
            <div className="absolute -right-2 top-6 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-md sm:flex">
              <ShieldCheck className="size-5 text-grade-a" />
              <div>
                <p className="text-xs font-bold text-foreground">Grade A</p>
                <p className="text-[10px] text-muted-foreground">Quality Assured</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="-mt-6 grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-md sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((t) => (
            <div key={t.num} className="flex min-w-0 items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <t.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-primary/70">{t.num}</p>
                <p className="text-sm font-semibold text-foreground">{t.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <SectionHead
          title="Shop by Category"
          sub="Find the device you're looking for."
          href="/categories"
          linkLabel="View all categories"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categoryTiles.map((c) => (
            <Link
              key={c.id}
              to="/products"
              search={{ category: c.id, q: undefined, brand: undefined }}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-shadow hover:shadow-md"
            >
              <span className="grid size-14 place-items-center rounded-xl bg-secondary text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <c.icon className="size-6" />
              </span>
              <span className="text-xs font-semibold text-foreground">{c.label}</span>
              <span className="text-[11px] text-muted-foreground">
                {categoryCounts[c.id] ?? 0} models
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED DEVICES ───────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6">
        <SectionHead
          title="Featured Devices"
          sub="Recently listed and carefully selected."
          href="/products"
          linkLabel="View all devices"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(({ product, listing }) => (
            <FeaturedCard key={listing.id} product={product} listing={listing} />
          ))}
        </div>
      </section>

      {/* ── CONDITION ──────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6">
        <h2 className="mb-5 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Know the Condition Before You Buy
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {conditionCards.map((c) => (
            <div key={c.grade} className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`grid size-8 place-items-center rounded-full ${c.tone} font-display text-sm font-bold text-white`}
                >
                  {c.grade}
                </span>
                <span className="text-sm font-semibold text-foreground">{c.title}</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">{c.heading}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.body}</p>
            </div>
          ))}
          <div className="rounded-xl border border-border bg-secondary/60 p-4">
            <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-foreground">
              Our grading is backed by 67-point inspection.
            </p>
            <Link
              to="/about"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Learn about grading <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6">
        <h2 className="mb-5 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          How RESALE Works
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((s) => (
            <div
              key={s.num}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-xs"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                {s.num}
              </span>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-foreground">
                <s.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SELLERS ────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6">
        <SectionHead
          title="Shop From Trusted Sellers & Creators"
          sub="Curated collections from trusted sellers and professional storefronts."
          href="/products"
          linkLabel="Explore sellers"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {topSellers.map((s) => (
            <div
              key={s.name}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-4 text-center"
            >
              <span className="relative grid size-12 place-items-center rounded-full bg-secondary font-display text-sm font-bold text-foreground">
                {s.name.charAt(0)}
                {s.verified && (
                  <BadgeCheck className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-background text-grade-a" />
                )}
              </span>
              <span className="w-full truncate text-xs font-semibold text-foreground">
                {s.name}
              </span>
              <span className="w-full truncate text-[11px] text-muted-foreground">{s.role}</span>
              <span className="text-[11px] font-semibold text-primary">{s.count} listings</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── JUST LISTED ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6">
        <SectionHead
          title="Just Listed"
          sub="New arrivals from our marketplace."
          href="/products"
          linkLabel="View all"
        />
        <div className="scrollbar-none flex snap-x gap-3 overflow-x-auto pb-1">
          {justListed.map(({ listing, product }) => (
            <Link
              key={listing.id}
              to="/listing/$listingId"
              params={{ listingId: listing.id }}
              className="flex w-60 shrink-0 snap-start items-center gap-3 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-md"
            >
              <img
                src={product.image}
                alt={product.name}
                width={120}
                height={120}
                loading="lazy"
                className="size-14 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">{product.name}</p>
                <p className="font-display text-sm font-bold text-primary">{taka(listing.price)}</p>
                <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                  <MapPin className="size-3 shrink-0" />
                  {listing.seller.district}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SELL CTA ───────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6">
        <div className="grid items-center gap-4 rounded-2xl bg-primary px-6 py-7 text-primary-foreground sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-w-0 items-center gap-4">
            <Tag className="hidden size-10 shrink-0 sm:block" />
            <div className="min-w-0">
              <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                Have a Device You Don&apos;t Use?
              </h2>
              <p className="mt-1 text-sm opacity-90">Turn your unused electronics into cash.</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 rounded-lg bg-background px-5 py-3 text-sm font-semibold text-primary shadow-sm transition-opacity hover:opacity-90"
            >
              Sell Your Device <ArrowRight className="size-4" />
            </Link>
            <p className="mt-2 text-[11px] opacity-90">
              Simple listing · Transparent pricing · Trusted marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY BUY ────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6">
        <h2 className="mb-5 text-center font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Why Buy on RESALE?
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {whyBuy.map((w) => (
            <div key={w.title} className="flex min-w-0 items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <w.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{w.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{w.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export { listingsFor };
