import { useState, useMemo } from "react";
import { Listing, productFor } from "@/data/catalog";
import { ListingCard } from "@/components/listing-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, PackageX } from "lucide-react";

interface StoreCatalogProps {
  listings: Listing[];
  storeName: string;
}

export function StoreCatalog({ listings, storeName }: StoreCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Derive categories present in this store's listings
  const categories = useMemo(() => {
    const cats = new Set<string>();
    listings.forEach((l) => {
      const prod = productFor(l.productId);
      if (prod?.category) cats.add(prod.category);
    });
    return Array.from(cats);
  }, [listings]);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const product = productFor(listing.productId);
      if (!product) return false;

      // Grade match
      if (selectedGrade !== "ALL" && listing.grade !== selectedGrade) {
        return false;
      }

      // Category match
      if (selectedCategory !== "ALL" && product.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesNote = listing.sellerNote?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesBrand && !matchesNote) return false;
      }

      return true;
    });
  }, [listings, search, selectedGrade, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-card">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${storeName} inventory...`}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Grade Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">Grade:</span>
          {["ALL", "A+", "A", "B", "C"].map((grade) => (
            <Button
              key={grade}
              variant={selectedGrade === grade ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGrade(grade)}
              className="h-8 px-2.5 text-xs font-semibold"
            >
              {grade === "ALL" ? "All Grades" : `Grade ${grade}`}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedCategory === "ALL" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory("ALL")}
            className="text-xs h-7 px-3"
          >
            All Categories ({listings.length})
          </Button>
          {categories.map((cat) => {
            const count = listings.filter((l) => productFor(l.productId)?.category === cat).length;
            return (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="text-xs h-7 px-3"
              >
                {cat} ({count})
              </Button>
            );
          })}
        </div>
      )}

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredListings.map((listing) => {
            const product = productFor(listing.productId);
            if (!product) return null;
            return (
              <div key={listing.id} className="border border-border bg-card overflow-hidden">
                <ListingCard listing={listing} product={product} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border bg-muted/20">
          <PackageX className="size-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground">No units found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {search || selectedGrade !== "ALL" || selectedCategory !== "ALL"
              ? "No items match your active search or filter criteria in this store."
              : `${storeName} currently has no active inventory listings.`}
          </p>
          {(search || selectedGrade !== "ALL" || selectedCategory !== "ALL") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setSelectedGrade("ALL");
                setSelectedCategory("ALL");
              }}
              className="mt-4 text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
