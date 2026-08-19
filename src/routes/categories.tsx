import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { products, listings, productFor, taka, cheapest } from "@/data/catalog";
import {
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Tablet,
  Watch,
  Gamepad2,
  ChevronRight,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Tag,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Categories — Graded Pre-Owned Electronics | Resale.com" },
      {
        name: "description",
        content:
          "Browse all electronics categories on Resale.com: Smartphones, Laptops, Cameras, Audio, Tablets, Smartwatches, and Gaming Consoles with condition reports and cash on delivery.",
      },
    ],
  }),
  component: CategoriesPage,
});

interface CategoryMeta {
  id: string;
  name: string;
  categoryQuery: string;
  icon: typeof Smartphone;
  description: string;
  popularBrands: string[];
  bannerHighlight: string;
}

const categoryDirectory: CategoryMeta[] = [
  {
    id: "smartphones",
    name: "Smartphones",
    categoryQuery: "Smartphones",
    icon: Smartphone,
    description: "Flagship Apple iPhones, Samsung Galaxy, Google Pixel, OnePlus & Xiaomi devices.",
    popularBrands: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"],
    bannerHighlight: "Save up to 45% off retail MRP",
  },
  {
    id: "laptops",
    name: "Laptops & Computers",
    categoryQuery: "Laptops",
    icon: Laptop,
    description: "Apple MacBook Pro & Air, Dell XPS, Lenovo ThinkPad, HP EliteBook & ASUS ZenBook.",
    popularBrands: ["Apple", "Dell", "Lenovo", "HP", "ASUS"],
    bannerHighlight: "Battery health & thermals verified",
  },
  {
    id: "cameras",
    name: "Cameras & Photography",
    categoryQuery: "Cameras",
    icon: Camera,
    description: "Fujifilm X100V, Sony Alpha mirrorless bodies, Canon EOS R & Nikon Z systems.",
    popularBrands: ["Fujifilm", "Sony", "Canon", "Nikon"],
    bannerHighlight: "Sensor inspection & low shutter count",
  },
  {
    id: "audio",
    name: "Audio & Headphones",
    categoryQuery: "Audio",
    icon: Headphones,
    description: "Sony WH-1000XM5, Bose QuietComfort Ultra, Apple AirPods Pro 2 & JBL speakers.",
    popularBrands: ["Sony", "Bose", "Apple", "Samsung", "JBL"],
    bannerHighlight: "Active Noise Cancelling tested",
  },
  {
    id: "tablets",
    name: "Tablets & iPads",
    categoryQuery: "Tablets",
    icon: Tablet,
    description: "Apple iPad Pro M2, iPad Air & Android high-performance creative tablets.",
    popularBrands: ["Apple"],
    bannerHighlight: "ProMotion display & stylus tested",
  },
  {
    id: "smartwatches",
    name: "Smartwatches & Wearables",
    categoryQuery: "Smartwatches",
    icon: Watch,
    description: "Apple Watch Series 9, Galaxy Watches & fitness health monitoring gear.",
    popularBrands: ["Apple"],
    bannerHighlight: "ECG, battery & sensors verified",
  },
  {
    id: "gaming",
    name: "Gaming Consoles",
    categoryQuery: "Gaming Consoles",
    icon: Gamepad2,
    description: "Sony PlayStation 5 Slim Disc Edition, Xbox Series X & gaming hardware.",
    popularBrands: ["Sony"],
    bannerHighlight: "DualSense controllers & 4K gaming",
  },
];

function CategoriesPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categoryDirectory;
    const q = search.toLowerCase().trim();
    return categoryDirectory.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.popularBrands.some((b) => b.toLowerCase().includes(q)),
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-5 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium">All Categories</span>
        </nav>

        {/* Header Hero */}
        <div className="border-b border-border pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider mb-3">
                <Layers className="size-3.5" />
                <span>Marketplace Catalog</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
                All Product Categories
              </h1>
              <p className="text-sm md:text-base text-subtle-foreground mt-2 leading-relaxed">
                Explore Bangladesh&apos;s verified pre-owned electronics catalog. Every category
                includes condition-graded items backed by inspection reports and cash on delivery.
              </p>
            </div>

            {/* Quick search input */}
            <div className="w-full md:w-72 relative">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a category or brand..."
                className="pl-9 h-10 text-xs md:text-sm bg-card border-border rounded-none"
              />
            </div>
          </div>
        </div>

        {/* Categories Bento / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            const catProducts = products.filter((p) =>
              cat.categoryQuery === "Tablets"
                ? p.category === "Tablets"
                : p.category === cat.categoryQuery,
            );
            const catListings = listings.filter((l) => {
              const prod = productFor(l.productId);
              return prod && prod.category === cat.categoryQuery;
            });

            // Find lowest price
            const minPrice = catProducts.reduce<number | null>((min, p) => {
              const best = cheapest(p.id);
              if (!best) return min;
              return min === null ? best.price : Math.min(min, best.price);
            }, null);

            return (
              <div
                key={cat.id}
                className="group border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/60 hover:shadow-sm transition-all relative overflow-hidden"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="size-12 bg-muted flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="size-6 text-foreground group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5">
                      {cat.bannerHighlight}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Quick Brand Tags */}
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">
                      Popular Brands
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.popularBrands.map((b) => (
                        <Link
                          key={b}
                          to="/products"
                          search={{ brand: b, category: cat.categoryQuery, q: undefined }}
                          className="text-[11px] bg-secondary/80 hover:bg-primary hover:text-primary-foreground px-2 py-0.5 transition-colors border border-border/40"
                        >
                          {b}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Meta & Action */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    {minPrice !== null ? (
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Starting from</span>
                        <span className="font-display text-base font-bold text-primary">
                          {taka(minPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {catProducts.length} models
                      </span>
                    )}
                  </div>

                  <Link
                    to="/products"
                    search={{ category: cat.categoryQuery, q: undefined, brand: undefined }}
                    className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <span>Browse All</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Guarantee Strip */}
        <div className="mt-12 p-6 md:p-8 bg-card border border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                All Categories Include Standardized Inspection
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                Regardless of the device type you choose, every listing has undergone physical,
                functional, battery and components inspection before going live.
              </p>
            </div>
          </div>
          <Link
            to="/products"
            search={{ q: undefined, category: undefined, brand: undefined }}
            className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-secondary transition-colors shrink-0"
          >
            <Package className="size-4 text-primary" />
            <span>Browse All Listings</span>
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
