import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { products } from "@/data/catalog";
import {
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Tablet,
  Watch,
  Gamepad2,
  Plug,
  ChevronRight,
  Layers,
  ArrowRight,
  Search,
  Home,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Categories — Graded Pre-Owned Electronics | Resale.com" },
      {
        name: "description",
        content:
          "Browse all electronics categories on Resale.com: Smartphones, Laptops, Cameras, Audio, Tablets, Smartwatches, Home Products, Accessories, and Gaming Consoles with condition reports and cash on delivery.",
      },
    ],
  }),
  component: CategoriesPage,
});

interface SubCategory {
  label: string;
  q?: string;
  category?: string;
}

interface CategoryGroup {
  id: string;
  name: string;
  categoryQuery?: string;
  icon: typeof Smartphone;
  popularBrands: string[];
  subcategories?: SubCategory[];
}

/**
 * Full category directory — all catalog categories + parent/subcategory groupings
 * mirroring the complete site taxonomy and secondary navigation dropdowns.
 * Model counts are derived dynamically from catalog data.
 */
const categoryDirectory: CategoryGroup[] = [
  {
    id: "smartphones",
    name: "Smartphones & Flagships",
    categoryQuery: "Smartphones",
    icon: Smartphone,
    popularBrands: ["Apple", "Samsung", "Google Pixel", "OnePlus"],
    subcategories: [
      { label: "iPhones & iOS", q: "iPhone" },
      { label: "Samsung Galaxy", q: "Galaxy" },
      { label: "Google Pixel", q: "Pixel" },
      { label: "All Smartphones", category: "Smartphones" },
    ],
  },
  {
    id: "laptops",
    name: "Laptops & MacBooks",
    categoryQuery: "Laptops",
    icon: Laptop,
    popularBrands: ["MacBook", "Dell XPS", "ThinkPad", "HP"],
    subcategories: [
      { label: "Apple Silicon MacBooks", q: "MacBook" },
      { label: "Dell XPS & Windows Laptops", q: "Dell" },
      { label: "Lenovo ThinkPads", q: "ThinkPad" },
      { label: "All Laptops", category: "Laptops" },
    ],
  },
  {
    id: "cameras",
    name: "Cameras & Photography",
    categoryQuery: "Cameras",
    icon: Camera,
    popularBrands: ["Fujifilm", "Sony Alpha", "Canon", "Nikon"],
    subcategories: [
      { label: "Mirrorless Bodies", q: "Mirrorless" },
      { label: "Fujifilm X-Series", q: "Fujifilm" },
      { label: "Sony Alpha Full-Frame", q: "Sony" },
      { label: "All Cameras & Optics", category: "Cameras" },
    ],
  },
  {
    id: "tablets",
    name: "Tablets & iPads",
    categoryQuery: "Tablets",
    icon: Tablet,
    popularBrands: ["iPad Pro", "iPad Air", "Galaxy Tab"],
    subcategories: [
      { label: "iPad Pro & Air", q: "iPad" },
      { label: "Android Tablets", q: "Tab" },
      { label: "All Tablets", category: "Tablets" },
    ],
  },
  {
    id: "essentials",
    name: "Essentials & Smart Living",
    icon: Sparkles,
    popularBrands: ["Apple", "Sony", "Bose", "Google"],
    subcategories: [
      { label: "Smartwatches", q: "Smartwatch" },
      { label: "Earbuds & AirPods", q: "Earbuds" },
      { label: "Over-Ear Headphones", q: "Headphones" },
      { label: "Bluetooth Speakers", q: "Speaker" },
      { label: "Soundbars", q: "Soundbar" },
      { label: "Fitness Bands", q: "Fitness Band" },
      { label: "Smart Home Devices", q: "Smart Home" },
      { label: "Home Products", category: "Home Products" },
    ],
  },
  {
    id: "audio",
    name: "Audio & Headphones",
    categoryQuery: "Audio",
    icon: Headphones,
    popularBrands: ["Sony", "Bose", "AirPods", "Sennheiser"],
    subcategories: [
      { label: "True Wireless Earbuds", q: "Earbuds" },
      { label: "ANC Over-Ear Headphones", q: "Headphones" },
      { label: "Portable Bluetooth Speakers", q: "Speaker" },
      { label: "Home Soundbars", q: "Soundbar" },
      { label: "All Audio Devices", category: "Audio" },
    ],
  },
  {
    id: "smartwatches",
    name: "Smartwatches & Wearables",
    categoryQuery: "Smartwatches",
    icon: Watch,
    popularBrands: ["Apple Watch", "Galaxy Watch", "Fitbit"],
    subcategories: [
      { label: "Apple Watches", q: "Apple Watch" },
      { label: "Samsung Galaxy Watches", q: "Galaxy Watch" },
      { label: "Fitness Trackers", q: "Fitness Band" },
      { label: "All Smartwatches", category: "Smartwatches" },
    ],
  },
  {
    id: "home-products",
    name: "Home Products & Devices",
    categoryQuery: "Home Products",
    icon: Home,
    popularBrands: ["Google Nest", "Amazon Echo", "TP-Link", "Xiaomi"],
    subcategories: [
      { label: "Smart Speakers & Displays", q: "Nest" },
      { label: "Smart Security & Cameras", q: "Camera" },
      { label: "Wi-Fi Hubs & Plugs", q: "Smart Home" },
      { label: "All Home Products", category: "Home Products" },
    ],
  },
  {
    id: "accessories",
    name: "Accessories & Chargers",
    categoryQuery: "Accessories",
    icon: Plug,
    popularBrands: ["MagSafe", "Anker", "Apple Pencil", "Ugreen"],
    subcategories: [
      { label: "Chargers & Fast Cables", q: "Charger" },
      { label: "Power Banks & Batteries", q: "Power Bank" },
      { label: "Protective Cases & Covers", q: "Case" },
      { label: "Screen Protectors", q: "Screen Protector" },
      { label: "Stylus & Digital Pens", q: "Stylus" },
      { label: "USB Hubs & Docking Stations", q: "USB Hub" },
      { label: "SD & Memory Cards", q: "Memory Card" },
      { label: "Mounts & Desk Stands", q: "Stand" },
      { label: "Keyboard & Mouse", q: "Keyboard" },
      { label: "Camera Bags & Straps", q: "Camera Bag" },
      { label: "All Accessories", category: "Accessories" },
    ],
  },
  {
    id: "gaming",
    name: "Gaming Consoles & Gear",
    categoryQuery: "Gaming Consoles",
    icon: Gamepad2,
    popularBrands: ["PlayStation 5", "Xbox", "Nintendo", "DualSense"],
    subcategories: [
      { label: "PlayStation 5 Consoles", q: "PS5" },
      { label: "Controllers & Gamepads", q: "DualSense" },
      { label: "Handheld Gaming Hardware", q: "Gaming" },
      { label: "All Gaming Gear", category: "Gaming Consoles" },
    ],
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
        c.popularBrands.some((b) => b.toLowerCase().includes(q)) ||
        c.subcategories?.some((s) => s.label.toLowerCase().includes(q)),
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
          <span className="text-foreground font-semibold">All Categories</span>
        </nav>

        {/* Header & Filter Search Bar */}
        <div className="border-b border-border pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
              <Layers className="size-3.5" />
              <span>Catalog Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground">
              All Categories &amp; Gear
            </h1>
            <p className="text-xs sm:text-sm text-subtle-foreground mt-1">
              Browse all parent categories, sub-departments, and verified graded devices.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full sm:w-72 md:w-80 relative shrink-0">
            <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter categories or subcategories..."
              className="pl-10 h-10 text-xs sm:text-sm bg-card border-border rounded-none"
            />
          </div>
        </div>

        {/* Category Grid: 1-col mobile, 2-cols tablet, 3-cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            const modelCount = cat.categoryQuery
              ? products.filter((p) => p.category === cat.categoryQuery).length
              : products.filter((p) =>
                  ["Audio", "Smartwatches", "Home Products"].includes(p.category),
                ).length;
            const hasSubcats = cat.subcategories && cat.subcategories.length > 0;

            return (
              <div
                key={cat.id}
                className="border border-border bg-card flex flex-col justify-between hover:border-foreground/30 transition-colors p-4 sm:p-5"
              >
                <div>
                  {/* Top: Icon + Model Count */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="size-10 bg-muted flex items-center justify-center border border-border shrink-0">
                      <Icon className="size-5 text-foreground" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 border border-border">
                      {modelCount} {modelCount === 1 ? "model" : "models"}
                    </span>
                  </div>

                  {/* Category Title Link */}
                  {cat.categoryQuery ? (
                    <Link
                      to="/products"
                      search={{
                        category: cat.categoryQuery,
                        q: undefined,
                        brand: undefined,
                      }}
                      className="block text-base sm:text-lg font-display font-bold text-foreground hover:text-primary hover:underline transition-colors leading-snug"
                    >
                      {cat.name}
                    </Link>
                  ) : (
                    <h2 className="text-base sm:text-lg font-display font-bold text-foreground leading-snug">
                      {cat.name}
                    </h2>
                  )}

                  {/* Popular Brand Tags */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {cat.popularBrands.map((b) => (
                      <span
                        key={b}
                        className="text-xs font-medium bg-secondary text-subtle-foreground px-2 py-0.5 border border-border"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Subcategories Directory Links */}
                  {hasSubcats && (
                    <div className="mt-4 pt-3 border-t border-border/60 space-y-1.5">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        Subcategories &amp; Quick Links
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                        {cat.subcategories!.map((sub) => (
                          <Link
                            key={sub.label}
                            to="/products"
                            search={{
                              q: sub.q,
                              category: sub.category,
                              brand: undefined,
                            }}
                            className="text-xs text-subtle-foreground hover:text-primary hover:underline py-1 px-1.5 flex items-center gap-1.5 transition-colors rounded-none hover:bg-muted/40"
                          >
                            <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Main CTA */}
                <div className="mt-5 pt-3 border-t border-border">
                  {cat.categoryQuery ? (
                    <Link
                      to="/products"
                      search={{
                        category: cat.categoryQuery,
                        q: undefined,
                        brand: undefined,
                      }}
                      className="w-full flex items-center justify-between text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Browse All {cat.name}</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  ) : (
                    <Link
                      to="/products"
                      search={{
                        category: undefined,
                        q: undefined,
                        brand: undefined,
                      }}
                      className="w-full flex items-center justify-between text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="py-16 text-center border border-dashed border-border p-8 bg-card mt-6">
            <p className="text-sm text-muted-foreground">
              No categories match &ldquo;{search}&rdquo;.
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
