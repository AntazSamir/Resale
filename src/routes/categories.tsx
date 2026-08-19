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
  ChevronRight,
  Layers,
  ArrowRight,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

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
  popularBrands: string[];
}

const categoryDirectory: CategoryMeta[] = [
  {
    id: "smartphones",
    name: "Smartphones",
    categoryQuery: "Smartphones",
    icon: Smartphone,
    popularBrands: ["Apple", "Samsung", "Pixel"],
  },
  {
    id: "laptops",
    name: "Laptops & MacBooks",
    categoryQuery: "Laptops",
    icon: Laptop,
    popularBrands: ["MacBook", "Dell", "ThinkPad"],
  },
  {
    id: "cameras",
    name: "Cameras & Photography",
    categoryQuery: "Cameras",
    icon: Camera,
    popularBrands: ["Fujifilm", "Sony", "Canon"],
  },
  {
    id: "audio",
    name: "Audio & Headphones",
    categoryQuery: "Audio",
    icon: Headphones,
    popularBrands: ["Sony", "Bose", "AirPods"],
  },
  {
    id: "tablets",
    name: "Tablets & iPads",
    categoryQuery: "Tablets",
    icon: Tablet,
    popularBrands: ["iPad Pro", "iPad Air"],
  },
  {
    id: "smartwatches",
    name: "Smartwatches",
    categoryQuery: "Smartwatches",
    icon: Watch,
    popularBrands: ["Apple Watch", "Galaxy"],
  },
  {
    id: "gaming",
    name: "Gaming Consoles",
    categoryQuery: "Gaming Consoles",
    icon: Gamepad2,
    popularBrands: ["PlayStation 5", "DualSense"],
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
        c.popularBrands.some((b) => b.toLowerCase().includes(q)),
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-5 py-5 md:py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium">All Categories</span>
        </nav>

        {/* Compact Header & Search Bar */}
        <div className="border-b border-border pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
              <Layers className="size-3.5" />
              <span>Catalog Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground">
              All Categories
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select a category to browse verified, condition-graded listings.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full sm:w-64 md:w-72 relative shrink-0">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter categories..."
              className="pl-8.5 h-9 text-xs bg-card border-border rounded-none"
            />
          </div>
        </div>

        {/* Compact Category Grid: 2-cols mobile, 3-cols tablet, 4-cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4 items-stretch">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            const modelCount = products.filter((p) => p.category === cat.categoryQuery).length;

            return (
              <Link
                key={cat.id}
                to="/products"
                search={{
                  category: cat.categoryQuery,
                  q: undefined,
                  brand: undefined,
                }}
                className="group border border-border bg-card p-3 sm:p-4 flex flex-col justify-between hover:bg-secondary/50 hover:border-primary/60 transition-all cursor-pointer relative"
              >
                <div>
                  {/* Top: Icon + Model Count */}
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
                    <div className="size-8 sm:size-9 bg-muted flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                      <Icon className="size-4 sm:size-4.5 text-foreground group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground bg-muted/80 px-1.5 py-0.5 border border-border/40">
                      {modelCount} {modelCount === 1 ? "model" : "models"}
                    </span>
                  </div>

                  {/* Category Name */}
                  <h2 className="text-xs sm:text-sm font-display font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                    {cat.name}
                  </h2>

                  {/* Popular Brand Tags */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {cat.popularBrands.map((b) => (
                      <span
                        key={b}
                        className="text-[9.5px] sm:text-[10px] font-medium bg-secondary/80 text-muted-foreground px-1.5 py-0.5 border border-border/40 truncate max-w-full"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-primary">
                  <span>Browse</span>
                  <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="py-12 text-center border border-dashed border-border p-6 bg-card mt-4">
            <p className="text-xs text-muted-foreground">
              No categories match &ldquo;{search}&rdquo;.
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
