import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/catalog";
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
  { k: "01", t: "Objective grading", d: "Every unit graded A+ to D against structured component checks — never a vague label." },
  { k: "02", t: "Verified sellers", d: "NID-verified accounts, public reputation, and sales history on every listing." },
  { k: "03", t: "Cash on delivery", d: "Pay when it arrives. 48-hour dispute window backed by our resolution team." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Pre-owned · Open-box · Like-new
            </p>
            <h1 className="mt-6 text-4xl leading-[1.05] md:text-6xl">
              Buy used electronics
              <br />
              without the guesswork.
            </h1>
            <p className="mt-6 max-w-md text-subtle-foreground">
              Bangladesh's marketplace where every listing carries a graded condition report,
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
          <img
            src={hero}
            alt="Assorted pre-owned electronics laid out on a pale surface"
            width={1600}
            height={1000}
            className="w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="hairline-grid grid md:grid-cols-3">
          {trust.map((t) => (
            <div key={t.k} className="p-8">
              <p className="font-display text-xs text-muted-foreground">{t.k}</p>
              <h2 className="mt-4 text-lg font-medium">{t.t}</h2>
              <p className="mt-2 text-sm text-subtle-foreground">{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="browse" className="mx-auto max-w-7xl px-5 pb-8">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <h2 className="text-2xl">Popular products</h2>
          <p className="text-sm text-muted-foreground">Compare all sellers per product</p>
        </div>
        <div className="hairline-grid mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
