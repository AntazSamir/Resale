import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { products, listings, productFor, taka } from "@/data/catalog";
import hero from "@/assets/hero.jpg";

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

function Index() {
  return (
    <div className="min-h-screen bg-background border-x border-border mx-auto max-w-7xl">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="grid items-center divide-y md:divide-y-0 md:divide-x divide-border md:grid-cols-2 py-8 md:py-12">
          <div className="p-6 md:p-12">
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
              <a
                href="#browse"
                className="bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Browse listings
              </a>
              <span className="text-sm text-muted-foreground">2,400+ graded units live</span>
            </div>
          </div>
          <div className="p-6 md:p-12">
            <img
              src={hero}
              alt="Assorted pre-owned electronics laid out on a pale surface"
              width={1600}
              height={1000}
              className="w-full object-cover border border-border"
            />
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="py-8">
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

      {/* Slash Deal Flash Banner */}
      <section className="py-6 px-5">
        <div className="bg-card border border-border p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <span>⚡ Slash Deal of the Day</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-semibold tracking-tight text-foreground">
              Apple iPhone 15 Pro 256GB (Grade A+)
            </h2>
            <p className="text-subtle-foreground text-sm leading-relaxed">
              Mint Condition · Like New · Passed 13 Component Checks · 98% Battery Health. Backed by
              4 months remaining Apple warranty + Resale 48h protection.
            </p>
            <div className="flex flex-wrap items-baseline gap-3 pt-1">
              <span className="text-3xl font-display font-bold text-primary">৳95,000</span>
              <span className="text-base text-muted-foreground line-through">৳145,000</span>
              <span className="text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold px-2.5 py-1">
                Save ৳50,000 (34% OFF)
              </span>
            </div>
            <div className="pt-2">
              <a
                href="/listing/l-1"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground font-medium px-6 py-3 transition-opacity hover:opacity-90 text-sm shadow-xs"
              >
                Claim Deal Before Sold →
              </a>
            </div>
          </div>

          <div className="relative w-full max-w-xs aspect-square border border-border bg-muted shrink-0">
            <img
              src="/src/assets/p-phone.jpg"
              alt="iPhone 15 Pro Deal"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-red-600 text-white font-semibold text-xs px-2.5 py-1 shadow-xs">
              Only 1 Left!
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Banners */}
      <section className="py-8 px-5">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-semibold">
          Explore by Category
        </h2>
        <div className="hairline-grid grid grid-cols-2 sm:grid-cols-4 bg-card">
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
      </section>

      {/* Featured Brands */}
      <section className="py-6 px-5">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-semibold">
          Featured Brands
        </h2>
        <div className="hairline-grid grid grid-cols-3 sm:grid-cols-6 bg-card">
          {["Apple", "Samsung", "Sony", "Fujifilm", "Dell", "JBL"].map((brand) => (
            <div
              key={brand}
              className="py-5 text-center cursor-pointer transition-colors hover:bg-secondary"
            >
              <span className="font-bold text-sm text-foreground">{brand}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular products */}
      <section id="browse" className="pb-8 pt-6 px-5">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <h2 className="text-2xl">Popular products</h2>
          <p className="text-sm text-muted-foreground">Compare all sellers per product</p>
        </div>
        <div className="hairline-grid mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-card">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="py-8 px-5">
        <div className="hairline-grid grid md:grid-cols-3 bg-card">
          <div className="flex items-start gap-4 p-6">
            <div className="bg-primary text-primary-foreground p-3 font-bold text-lg">NID</div>
            <div>
              <h3 className="font-medium text-base">Verified Seller Network</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Every seller&apos;s national identity is verified before listing approval to prevent
                scams.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6">
            <div className="bg-primary text-primary-foreground p-3 font-bold text-lg">48h</div>
            <div>
              <h3 className="font-medium text-base">48-Hour Buyer Protection</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Inspect your order upon delivery. Full refund protection if the condition report
                doesn&apos;t match.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6">
            <div className="bg-primary text-primary-foreground p-3 font-bold text-lg">COD</div>
            <div>
              <h3 className="font-medium text-base">Nationwide Cash on Delivery</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Shipped via reliable courier partners across all 64 districts in Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently added listings */}
      <section className="pb-16 pt-8 px-5">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <h2 className="text-2xl">Recently added listings</h2>
          <p className="text-sm text-muted-foreground">Individual units ready for delivery</p>
        </div>
        <div className="mt-8 hairline-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-card">
          {listings.slice(0, 4).map((listing) => {
            const product = productFor(listing.productId);
            return (
              <a
                key={listing.id}
                href={`/listing/${listing.id}`}
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
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur text-xs font-medium px-2 py-1 border border-border shadow-xs">
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
              </a>
            );
          })}
        </div>
      </section>

      {/* Condition Grading Standard */}
      <section className="bg-muted/40 border-t border-border py-16 px-5">
        <div>
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl font-display mb-3">Our Objective Condition Grading Standard</h2>
            <p className="text-subtle-foreground text-sm">
              We eliminate vague classified descriptors like &quot;fresh condition&quot; or
              &quot;all ok&quot;. Every item is evaluated against standardized component criteria.
            </p>
          </div>

          <div className="hairline-grid grid sm:grid-cols-2 lg:grid-cols-5 bg-card">
            <div className="p-6">
              <span className="inline-block bg-emerald-500 text-white font-bold text-xs px-2.5 py-1 mb-3">
                Grade A+
              </span>
              <h3 className="font-medium text-sm mb-1">Like New</h3>
              <p className="text-xs text-muted-foreground">
                Flawless condition with zero signs of wear. 100% original parts &amp; complete
                original box/accessories.
              </p>
            </div>

            <div className="p-6">
              <span className="inline-block bg-blue-500 text-white font-bold text-xs px-2.5 py-1 mb-3">
                Grade A
              </span>
              <h3 className="font-medium text-sm mb-1">Excellent</h3>
              <p className="text-xs text-muted-foreground">
                Micro-scratches only visible under direct light. High battery health, zero
                functional defects.
              </p>
            </div>

            <div className="p-6">
              <span className="inline-block bg-amber-500 text-white font-bold text-xs px-2.5 py-1 mb-3">
                Grade B
              </span>
              <h3 className="font-medium text-sm mb-1">Good</h3>
              <p className="text-xs text-muted-foreground">
                Normal cosmetic wear (minor scuffs/scratches). Fully functional; any part repairs
                are explicitly listed.
              </p>
            </div>

            <div className="p-6">
              <span className="inline-block bg-orange-500 text-white font-bold text-xs px-2.5 py-1 mb-3">
                Grade C
              </span>
              <h3 className="font-medium text-sm mb-1">Fair</h3>
              <p className="text-xs text-muted-foreground">
                Noticeable cosmetic scratches or minor dents. Great value for budget buyers seeking
                100% functionality.
              </p>
            </div>

            <div className="p-6">
              <span className="inline-block bg-red-500 text-white font-bold text-xs px-2.5 py-1 mb-3">
                Grade D
              </span>
              <h3 className="font-medium text-sm mb-1">Heavy Wear</h3>
              <p className="text-xs text-muted-foreground">
                Heavy cosmetic wear or battery under 80%. Fully functional with deep discount
                pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-5 border-t border-border">
        <h2 className="text-3xl font-display text-center mb-12">How Resale.com Works</h2>
        <div className="hairline-grid grid md:grid-cols-2 bg-card">
          {/* For Buyers */}
          <div className="p-8">
            <h3 className="text-xl font-bold mb-6 text-primary">For Buyers</h3>
            <ol className="space-y-6">
              <li className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
                  1
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
                  2
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
                  3
                </span>
                <div>
                  <h4 className="font-medium text-sm">48-Hour Inspection Window</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Test your device. If it doesn&apos;t match the condition report, raise a dispute
                    for full resolution.
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
                  1
                </span>
                <div>
                  <h4 className="font-medium text-sm">Complete Guided 13-Step Checklist</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Provide honest details about battery, repairs, physical wear, and included
                    accessories.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center bg-muted-foreground text-background font-bold text-xs">
                  2
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
                  3
                </span>
                <div>
                  <h4 className="font-medium text-sm">Ship &amp; Fast Payout</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hand over to courier and receive cleared funds directly to your bKash or Bank
                    account.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
