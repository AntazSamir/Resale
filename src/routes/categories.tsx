import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Smartphone,
  Laptop,
  Camera,
  Tablet,
  Headphones,
  Gamepad2,
  Watch,
  Layers,
  Sparkles,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { products } from "@/data/catalog";

const categories = [
  { id: "Smartphones", label: "Smartphones", icon: Smartphone },
  { id: "Laptops", label: "Laptops", icon: Laptop },
  { id: "Cameras", label: "Cameras", icon: Camera },
  { id: "Tablets", label: "Tablets", icon: Tablet },
  { id: "Audio", label: "Audio", icon: Headphones },
  { id: "Gaming Consoles", label: "Gaming", icon: Gamepad2 },
  { id: "Smartwatches", label: "Watches", icon: Watch },
  { id: "Accessories", label: "Accessories", icon: Layers },
  { id: "Essentials", label: "Essentials", icon: Sparkles },
];

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Categories — Resale" },
      {
        name: "description",
        content:
          "Browse all device categories on Resale — verified second-hand smartphones, laptops, cameras, tablets, audio, gaming consoles, smartwatches and accessories.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-4 md:px-5 py-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-foreground">Categories</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            All Categories
          </h1>
          <p className="mt-2 text-sm text-subtle-foreground max-w-xl leading-relaxed">
            Explore every device category on Resale. All listings are inspected, graded and sold by
            NID-verified sellers.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const catProducts = products.filter((p) => p.category === cat.id);
              const brands = [...new Set(catProducts.map((p) => p.brand))];
              const image = catProducts[0]?.image;
              return (
                <Link
                  key={cat.id}
                  to="/products"
                  search={{ category: cat.id, q: undefined, brand: undefined }}
                  className="group border border-border bg-card transition-all hover:shadow-md hover:border-primary/40"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-secondary">
                    {image ? (
                      <img
                        src={image}
                        alt={cat.label}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-muted-foreground">
                        <cat.icon className="size-12" />
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-sm font-bold text-foreground">{cat.label}</h2>
                      <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {catProducts.length} items
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground truncate">
                      {brands.slice(0, 4).join(" · ")}
                      {brands.length > 4 ? ` +${brands.length - 4}` : ""}
                    </p>
                    {(() => {
                      const subs = [
                        ...new Set(
                          catProducts
                            .map((p) => p.subcategory)
                            .filter((s): s is string => Boolean(s)),
                        ),
                      ];
                      if (subs.length === 0) return null;
                      return (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {subs.map((sub) => (
                            <Link
                              key={sub}
                              to="/products"
                              search={{ category: cat.id, sub, q: undefined, brand: undefined }}
                              className="border border-orange-500/30 bg-orange-500/5 px-2 py-0.5 text-[10px] font-semibold text-primary transition-colors hover:bg-orange-500/15"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
