import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { ListingCard } from "@/components/listing-card";
import {
  products,
  listings,
  productFor,
  grades,
  gradeLabel,
  taka,
  type Grade,
} from "@/data/catalog";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  RotateCcw,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    brand: typeof search["brand"] === "string" ? search["brand"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse Listings | Resale.com" },
      {
        name: "description",
        content:
          "Browse all available graded pre-owned electronics from verified sellers in Bangladesh. Filter by brand, category, grade, price, and location.",
      },
    ],
  }),
  component: ProductsPage,
});

type SortOption = "relevance" | "price-asc" | "price-desc" | "name-asc" | "newest";

const MAX_CATALOG_PRICE = 300000;

function ProductsPage() {
  const urlSearch = useSearch({ from: "/products" });

  // Filter states
  const [searchQuery, setSearchQuery] = useState(urlSearch.q || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    urlSearch.category ? [urlSearch.category] : [],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    urlSearch.brand ? [urlSearch.brand] : [],
  );
  const [selectedGrades, setSelectedGrades] = useState<Grade[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(MAX_CATALOG_PRICE);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Sync with URL query when it changes
  useEffect(() => {
    if (urlSearch.q !== undefined) setSearchQuery(urlSearch.q);
    if (urlSearch.category !== undefined) setSelectedCategories([urlSearch.category]);
    if (urlSearch.brand !== undefined) setSelectedBrands([urlSearch.brand]);
  }, [urlSearch.q, urlSearch.category, urlSearch.brand]);

  // Facet value lists — categories/brands from product catalog, districts from actual listings
  const allCategories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), []);
  const allBrands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), []);
  const allDistricts = useMemo(
    () => Array.from(new Set(listings.map((l) => l.seller.district))).sort(),
    [],
  );

  // Toggle helpers
  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );

  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );

  const toggleGrade = (grade: Grade) =>
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade],
    );

  const toggleDistrict = (district: string) =>
    setSelectedDistricts((prev) =>
      prev.includes(district) ? prev.filter((d) => d !== district) : [...prev, district],
    );

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedGrades([]);
    setSelectedDistricts([]);
    setPriceMax(MAX_CATALOG_PRICE);
    setSortBy("relevance");
  };

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    selectedCategories.length +
    selectedBrands.length +
    selectedGrades.length +
    selectedDistricts.length +
    (priceMax < MAX_CATALOG_PRICE ? 1 : 0);

  // ── Listing filter engine ──────────────────────────────────────────────────
  // We now iterate over individual listings, not products.
  // Product fields (name, brand, category, specs) are joined for search/filter.
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const product = productFor(listing.productId);
      if (!product) return false;

      // 1. Text search across product fields
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesSpecs = product.specs.some(
          (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q),
        );
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSpecs) return false;
      }

      // 2. Category
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category))
        return false;

      // 3. Brand
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;

      // 4. Grade — now directly on the listing
      if (selectedGrades.length > 0 && !selectedGrades.includes(listing.grade)) return false;

      // 5. Price — listing's actual selling price
      if (listing.price > priceMax) return false;

      // 6. Seller district
      if (
        selectedDistricts.length > 0 &&
        !selectedDistricts.includes(listing.seller.district)
      )
        return false;

      return true;
    });
  }, [searchQuery, selectedCategories, selectedBrands, selectedGrades, selectedDistricts, priceMax]);

  // ── Sorting engine ─────────────────────────────────────────────────────────
  const sortedListings = useMemo(() => {
    const list = [...filteredListings];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => {
          const pa = productFor(a.productId)?.name ?? "";
          const pb = productFor(b.productId)?.name ?? "";
          return pa.localeCompare(pb);
        });
      case "newest":
        return list.sort(
          (a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime(),
        );
      case "relevance":
      default:
        return list;
    }
  }, [filteredListings, sortBy]);

  // ── Filter panel (shared between desktop sidebar & mobile drawer) ──────────
  const FilterContent = (
    <div className="space-y-6 text-sm">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Category
        </h3>
        <div className="space-y-2">
          {allCategories.map((cat) => {
            const count = listings.filter((l) => productFor(l.productId)?.category === cat).length;
            const checked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center justify-between cursor-pointer py-1 px-1.5 hover:bg-muted/60 transition-colors text-foreground"
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleCategory(cat)}
                    id={`cat-${cat}`}
                  />
                  <span>{cat}</span>
                </div>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Brand */}
      <div className="border-t border-border pt-5">
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Brand
        </h3>
        <div className="space-y-2">
          {allBrands.map((brand) => {
            const count = listings.filter(
              (l) => productFor(l.productId)?.brand === brand,
            ).length;
            const checked = selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center justify-between cursor-pointer py-1 px-1.5 hover:bg-muted/60 transition-colors text-foreground"
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleBrand(brand)}
                    id={`brand-${brand}`}
                  />
                  <span>{brand}</span>
                </div>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Condition Grade */}
      <div className="border-t border-border pt-5">
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Condition Grade
        </h3>
        <div className="space-y-2">
          {grades.map((grade) => {
            const count = listings.filter((l) => l.grade === grade).length;
            const checked = selectedGrades.includes(grade);
            return (
              <label
                key={grade}
                className="flex items-center justify-between cursor-pointer py-1 px-1.5 hover:bg-muted/60 transition-colors text-foreground"
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleGrade(grade)}
                    id={`grade-${grade}`}
                  />
                  <span className="font-medium">Grade {grade}</span>
                  <span className="text-xs text-muted-foreground">({gradeLabel[grade]})</span>
                </div>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Max Price */}
      <div className="border-t border-border pt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
            Max Price
          </h3>
          <span className="font-display font-medium text-xs text-primary">{taka(priceMax)}</span>
        </div>
        <input
          type="range"
          min={10000}
          max={MAX_CATALOG_PRICE}
          step={5000}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
          <span>৳10k</span>
          <span>৳150k</span>
          <span>৳300k</span>
        </div>
      </div>

      {/* Seller District */}
      <div className="border-t border-border pt-5">
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Seller District
        </h3>
        <div className="space-y-2">
          {allDistricts.map((district) => {
            const count = listings.filter((l) => l.seller.district === district).length;
            const checked = selectedDistricts.includes(district);
            return (
              <label
                key={district}
                className="flex items-center justify-between cursor-pointer py-1 px-1.5 hover:bg-muted/60 transition-colors text-foreground"
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleDistrict(district)}
                    id={`dist-${district}`}
                  />
                  <span>{district}</span>
                </div>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-5 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium">Browse Listings</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
              Browse Listings
            </h1>
            <p className="text-xs md:text-sm text-subtle-foreground mt-1">
              Individual verified units from sellers across Bangladesh — each card is a specific
              offer.
            </p>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2 shrink-0">
            <Package className="size-4 text-primary" />
            <span>
              <strong>{sortedListings.length}</strong> listing
              {sortedListings.length !== 1 ? "s" : ""} available
            </span>
          </div>
        </div>

        {/* Search & Controls Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, brand, or specs..."
              className="pl-9 pr-8 text-xs md:text-sm border-border bg-background h-9 rounded-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mobile Filters Sheet */}
            <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden h-9 text-xs flex items-center gap-1.5 rounded-none border-border"
                >
                  <SlidersHorizontal className="size-3.5" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="size-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto p-6 bg-card border-border">
                <SheetHeader className="pb-4 border-b border-border mb-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-base font-display">Filters</SheetTitle>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-primary hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </SheetHeader>
                {FilterContent}
                <SheetFooter className="mt-8 pt-4 border-t border-border">
                  <SheetClose asChild>
                    <Button className="w-full rounded-none" size="sm">
                      Apply Filters ({sortedListings.length} Results)
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline text-xs text-muted-foreground font-medium">
                Sort by:
              </span>
              <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                <SelectTrigger className="w-40 md:w-44 h-9 text-xs rounded-none border-border bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-border bg-card">
                  <SelectItem value="relevance">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Model Name (A–Z)</SelectItem>
                  <SelectItem value="newest">Newest Listed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground font-medium mr-1">Active filters:</span>

            {searchQuery && (
              <Badge variant="secondary" className="text-xs font-normal gap-1 rounded-none py-1">
                <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-destructive"
                  aria-label="Remove search filter"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {selectedCategories.map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="text-xs font-normal gap-1 rounded-none py-1"
              >
                <span>Category: {cat}</span>
                <button
                  onClick={() => toggleCategory(cat)}
                  className="hover:text-destructive"
                  aria-label={`Remove ${cat} category filter`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}

            {selectedBrands.map((brand) => (
              <Badge
                key={brand}
                variant="secondary"
                className="text-xs font-normal gap-1 rounded-none py-1"
              >
                <span>Brand: {brand}</span>
                <button
                  onClick={() => toggleBrand(brand)}
                  className="hover:text-destructive"
                  aria-label={`Remove ${brand} brand filter`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}

            {selectedGrades.map((grade) => (
              <Badge
                key={grade}
                variant="secondary"
                className="text-xs font-normal gap-1 rounded-none py-1"
              >
                <span>Grade {grade}</span>
                <button
                  onClick={() => toggleGrade(grade)}
                  className="hover:text-destructive"
                  aria-label={`Remove grade ${grade} filter`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}

            {selectedDistricts.map((dist) => (
              <Badge
                key={dist}
                variant="secondary"
                className="text-xs font-normal gap-1 rounded-none py-1"
              >
                <span>Location: {dist}</span>
                <button
                  onClick={() => toggleDistrict(dist)}
                  className="hover:text-destructive"
                  aria-label={`Remove ${dist} district filter`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}

            {priceMax < MAX_CATALOG_PRICE && (
              <Badge variant="secondary" className="text-xs font-normal gap-1 rounded-none py-1">
                <span>Under {taka(priceMax)}</span>
                <button
                  onClick={() => setPriceMax(MAX_CATALOG_PRICE)}
                  className="hover:text-destructive"
                  aria-label="Remove price ceiling filter"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs text-primary hover:underline font-semibold ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Layout: Desktop sidebar + listing grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block border border-border bg-card p-5 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-5">
              <h2 className="font-display font-bold text-sm tracking-tight">Refine Results</h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
            {FilterContent}
          </aside>

          {/* Listing Grid */}
          <div className="space-y-6 overflow-hidden">
            {sortedListings.length > 0 ? (
              <>
                {/* ═══════════════════════════════════════════════════════
                    MOBILE: flat 3-card horizontal swipe (no category groups)
                ═══════════════════════════════════════════════════════ */}
                <div className="block md:hidden space-y-2">
                  <div className="flex items-center justify-between px-1 text-xs text-muted-foreground gap-2">
                    <span className="font-medium">{sortedListings.length} listings</span>
                    <span className="text-primary font-medium text-[11px] shrink-0">
                      ← Swipe →
                    </span>
                  </div>
                  <div className="flex overflow-x-auto snap-x snap-mandatory scroll-px-4 gap-1.5 pb-2 pt-1 -mx-4 px-4 scrollbar-none touch-pan-x overscroll-x-contain">
                    {sortedListings.map((listing) => {
                      const product = productFor(listing.productId);
                      if (!product) return null;
                      return (
                        <div
                          key={listing.id}
                          className="w-[calc((100vw-44px)/3)] min-w-22.5 max-w-35 shrink-0 snap-start flex flex-col"
                        >
                          <ListingCard listing={listing} product={product} compact={true} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════════
                    DESKTOP/TABLET: responsive listing grid
                ═══════════════════════════════════════════════════════ */}
                <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 items-stretch auto-rows-fr">
                  {sortedListings.map((listing) => {
                    const product = productFor(listing.productId);
                    if (!product) return null;
                    return (
                      <ListingCard key={listing.id} listing={listing} product={product} />
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="border border-dashed border-border bg-card p-12 text-center">
                <div className="mx-auto size-12 bg-muted flex items-center justify-center mb-4">
                  <Search className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-1">
                  No matching listings found
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                  We couldn&apos;t find any listings matching your current filters.
                </p>
                <Button onClick={clearAllFilters} size="sm" className="rounded-none gap-2">
                  <RotateCcw className="size-3.5" />
                  <span>Reset All Filters</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
