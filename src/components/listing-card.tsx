import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GradeBadge } from "./grade-badge";
import { taka, type Listing, type Product } from "@/data/catalog";
import { useCart } from "@/lib/cart-store";
import { ShoppingBag, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListingCardProps {
  listing: Listing;
  product: Product;
  compact?: boolean;
  layout?: "grid" | "list";
}

export function ListingCard({
  listing,
  product,
  compact = false,
  layout = "grid",
}: ListingCardProps) {
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = isInCart(listing.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(listing.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(listing.id);
    navigate({ to: "/cart" });
  };

  /* ── Compact variant (used in mobile swipe) ── */
  if (compact) {
    return (
      <div className="group relative flex flex-col justify-between h-full bg-card border border-border p-2.5 transition-colors hover:bg-secondary/40 select-none overflow-hidden rounded-none">
        <div>
          {/* Image */}
          <Link
            to="/listing/$listingId"
            params={{ listingId: listing.id }}
            className="relative block aspect-square w-full overflow-hidden bg-muted/40 rounded-none"
          >
            <img
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Brand & Name */}
          <div className="pt-2 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold truncate leading-none">
              {product.brand}
            </span>
            <Link
              to="/listing/$listingId"
              params={{ listingId: listing.id }}
              className="mt-1 block text-xs font-semibold leading-snug hover:underline line-clamp-2 text-foreground wrap-break-word"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          {/* Price */}
          <div className="mt-1.5 flex flex-col">
            <span className="font-display text-sm font-bold text-primary leading-tight">
              {taka(listing.price)}
            </span>
          </div>
        </div>

        {/* Bottom meta & actions */}
        <div className="mt-2 pt-1.5 space-y-1.5 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground gap-1">
            <span className="truncate font-normal">{listing.seller.district}</span>
            <span className="text-emerald-600 font-semibold shrink-0">Gr. {listing.grade}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Button
              type="button"
              size="sm"
              onClick={handleBuyNow}
              className="h-7 px-2 text-xs rounded-none bg-primary text-primary-foreground font-semibold hover:opacity-90 flex items-center justify-center w-full"
            >
              <span>Buy now</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddToCart}
              className="h-7 px-2 text-xs rounded-none border-border font-medium flex items-center justify-center gap-1.5 hover:bg-muted w-full"
            >
              {inCart || justAdded ? (
                <>
                  <Check className="size-3 text-success shrink-0" />
                  <span className="truncate">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-3 shrink-0" />
                  <span className="truncate">Add to cart</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── List Layout Variant ── */
  if (layout === "list") {
    return (
      <div className="group flex flex-col sm:flex-row bg-card p-3.5 sm:p-4 transition-all hover:bg-secondary/40 relative overflow-hidden border border-border gap-4 items-center">
        {/* Image */}
        <Link
          to="/listing/$listingId"
          params={{ listingId: listing.id }}
          className="size-28 sm:size-32 bg-muted shrink-0 overflow-hidden relative border border-border"
        >
          <img
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1.5 w-full">
          <div className="flex items-center gap-2">
            <GradeBadge grade={listing.grade} />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {product.brand} · {product.category}
            </span>
          </div>

          <Link
            to="/listing/$listingId"
            params={{ listingId: listing.id }}
            className="text-base font-semibold text-foreground hover:underline block truncate"
          >
            {product.name}
          </Link>

          <p className="text-xs text-subtle-foreground line-clamp-1">
            {listing.sellerNote ||
              `Condition score: ${listing.conditionScore}/100 · 32-Point Inspected`}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="size-3 fill-current" />
              {listing.seller.rating.toFixed(1)}
            </span>
            {listing.battery && (
              <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 border border-emerald-500/20 font-medium">
                🔋 {listing.battery}% Battery
              </span>
            )}
            {listing.seller.verified && (
              <span className="flex items-center gap-1 text-primary font-semibold">
                <Check className="size-2.5" />
                {listing.seller.name}
              </span>
            )}
          </div>
        </div>

        {/* Actions & Price */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
          <div className="text-left sm:text-right">
            <div className="font-display text-xl font-bold text-primary">{taka(listing.price)}</div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleBuyNow}
              className="h-8 px-3 text-xs rounded-none bg-primary text-primary-foreground font-semibold hover:opacity-90"
            >
              Buy now
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddToCart}
              className="h-8 px-3 text-xs rounded-none border-border font-medium flex items-center gap-1.5"
            >
              {inCart || justAdded ? (
                <>
                  <Check className="size-3 text-success" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-3" />
                  <span>Cart</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Full Grid Variant (desktop default) ── */
  return (
    <div className="group flex flex-col bg-card p-4 transition-all hover:bg-secondary/40 relative overflow-hidden border border-border h-full justify-between">
      <div>
        {/* Image */}
        <Link
          to="/listing/$listingId"
          params={{ listingId: listing.id }}
          className="block aspect-square overflow-hidden bg-muted rounded-none relative border border-border/40"
        >
          <img
            src={product.image}
            alt={product.name}
            width={900}
            height={900}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute bottom-2 right-2">
            <GradeBadge grade={listing.grade} showLabel={false} />
          </div>
        </Link>

        {/* Brand & Name */}
        <div className="pt-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {product.brand}
          </p>
          <Link
            to="/listing/$listingId"
            params={{ listingId: listing.id }}
            className="mt-1 block text-sm font-semibold leading-snug hover:underline line-clamp-1 text-foreground"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Features */}
        <div className="mt-1.5 flex items-baseline gap-2">
          <p className="font-display text-lg font-bold text-primary">{taka(listing.price)}</p>
        </div>

        {/* Badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
          {listing.battery && (
            <span className="bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 border border-emerald-500/20 font-medium">
              🔋 {listing.battery}%
            </span>
          )}
          <span className="bg-secondary text-subtle-foreground px-1.5 py-0.5 border border-border">
            32-Pt Inspected
          </span>
        </div>
      </div>

      {/* Bottom meta & actions */}
      <div className="mt-3 pt-2.5 space-y-2.5 border-t border-border/60">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1 text-foreground font-medium truncate">
            {listing.seller.name}
            {listing.seller.verified && <Check className="size-2.5 text-emerald-500 shrink-0" />}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {listing.seller.rating.toFixed(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleBuyNow}
            className="h-8 px-2 text-xs rounded-none bg-primary text-primary-foreground font-semibold hover:opacity-90 flex items-center justify-center"
          >
            <span>Buy now</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            className="h-8 px-2 text-xs rounded-none border-border font-medium flex items-center justify-center gap-1.5 hover:bg-muted"
          >
            {inCart || justAdded ? (
              <>
                <Check className="size-3 text-success shrink-0" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="size-3 shrink-0" />
                <span>Add to cart</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
