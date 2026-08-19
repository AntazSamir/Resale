import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GradeBadge } from "./grade-badge";
import { cheapest, listingsFor, taka, type Product } from "@/data/catalog";
import { useCart } from "@/lib/cart-store";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const best = cheapest(product.id);
  const count = listingsFor(product.id).length;
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);

  if (!best) return null;

  const inCart = isInCart(best.id);
  const discountPercent = Math.round(((product.retail - best.price) / product.retail) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(best.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(best.id);
    navigate({ to: "/cart" });
  };

  if (compact) {
    return (
      <div className="group relative flex flex-col justify-between h-full bg-card border border-border p-2 transition-colors hover:bg-secondary/40 select-none overflow-hidden rounded-none">
        <div>
          {/* Discount badge */}
          {discountPercent > 0 && (
            <div className="absolute top-1 left-1 bg-destructive text-destructive-foreground font-bold text-[8.5px] px-1 py-0.5 rounded-xs leading-none z-10 shadow-xs">
              -{discountPercent}%
            </div>
          )}

          {/* Product Image Link → listing */}
          <Link
            to="/listing/$listingId"
            params={{ listingId: best.id }}
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
          <div className="pt-1.5 flex flex-col">
            <span className="text-[8.5px] uppercase tracking-wider text-muted-foreground font-semibold truncate leading-none">
              {product.brand}
            </span>
            <Link
              to="/listing/$listingId"
              params={{ listingId: best.id }}
              className="mt-1 block text-[11px] font-semibold leading-[1.2] hover:underline line-clamp-2 text-foreground wrap-break-word min-h-6.5"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          {/* Pricing */}
          <div className="mt-1 flex flex-col">
            <span className="font-display text-xs font-bold text-primary leading-tight">
              {taka(best.price)}
            </span>
            {product.retail > best.price && (
              <span className="text-[9px] text-muted-foreground line-through leading-tight mt-0.5">
                {taka(product.retail)}
              </span>
            )}
          </div>
        </div>

        {/* Bottom meta & actions */}
        <div className="mt-1 pt-1 space-y-1 border-t border-border/40">
          <div className="flex items-center justify-between text-[9px] text-muted-foreground gap-1">
            <span className="truncate font-normal">{best.seller.district}</span>
            <span className="text-emerald-600 font-semibold shrink-0">Gr. {best.grade}</span>
          </div>

          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddToCart}
              className="h-6 px-1 text-[9.5px] rounded-none border-border font-medium flex items-center justify-center gap-1 hover:bg-muted w-full leading-none"
            >
              {inCart || justAdded ? (
                <>
                  <Check className="size-2.5 text-success shrink-0" />
                  <span className="truncate">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-2.5 shrink-0" />
                  <span className="truncate">Add to cart</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleBuyNow}
              className="h-6 px-1 text-[9.5px] rounded-none bg-primary text-primary-foreground font-semibold hover:opacity-90 flex items-center justify-center w-full leading-none"
            >
              <span className="truncate">Buy now</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col bg-card p-3.5 sm:p-4 transition-all hover:bg-secondary/40 relative overflow-hidden h-full">
      {/* Discount badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-sm z-10">
          -{discountPercent}% OFF
        </div>
      )}

      {/* Product Image Link → listing */}
      <Link
        to="/listing/$listingId"
        params={{ listingId: best.id }}
        className="block aspect-square overflow-hidden bg-muted rounded-none relative"
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
          <GradeBadge grade={best.grade} showLabel={false} />
        </div>
      </Link>

      {/* Brand & Name */}
      <div className="pt-2.5">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          {product.brand}
        </p>
        <Link
          to="/listing/$listingId"
          params={{ listingId: best.id }}
          className="mt-0.5 block text-sm font-medium leading-snug hover:underline line-clamp-1 text-foreground"
        >
          {product.name}
        </Link>
      </div>

      {/* Pricing */}
      <div className="mt-1 flex items-baseline gap-2">
        <p className="font-display text-lg font-bold text-primary">{taka(best.price)}</p>
        <p className="text-xs text-muted-foreground line-through">{taka(product.retail)}</p>
      </div>

      {/* Bottom meta & actions */}
      <div className="mt-2.5 pt-2 space-y-2 border-t border-border/50">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="truncate">
            {best.seller.name} · {best.seller.district}
          </span>
          <span className="text-emerald-600 font-medium shrink-0 ml-2">Grade {best.grade}</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            className="h-8 px-2 text-[11px] rounded-none border-border font-medium flex items-center justify-center gap-1 hover:bg-muted"
          >
            {inCart || justAdded ? (
              <>
                <Check className="size-3 text-success" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="size-3" />
                <span>Add to cart</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleBuyNow}
            className="h-8 px-2 text-[11px] rounded-none bg-primary text-primary-foreground font-semibold hover:opacity-90 flex items-center justify-center"
          >
            <span>Buy now</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
