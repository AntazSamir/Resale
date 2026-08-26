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
      <div className="group relative flex flex-col justify-between h-full bg-card border border-border p-2.5 transition-colors hover:bg-secondary/40 select-none overflow-hidden rounded-none press-feedback">
        <div>
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
              className="size-full object-cover transition-none group-hover:scale-105"
            />
          </Link>

          {/* Brand & Name */}
          <div className="pt-2 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold truncate leading-none">
              {product.brand}
            </span>
            <Link
              to="/listing/$listingId"
              params={{ listingId: best.id }}
              className="mt-1 block text-xs font-semibold leading-snug hover:underline line-clamp-2 text-foreground wrap-break-word"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          {/* Pricing */}
          <div className="mt-1.5 flex flex-col">
            <span className="font-display text-sm font-bold text-primary leading-tight">
              {taka(best.price)}
            </span>
          </div>
        </div>

        {/* Bottom meta & actions */}
        <div className="mt-2 pt-1.5 space-y-1.5 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground gap-1">
            <span className="truncate font-normal">{best.seller.district}</span>
            <span className="text-emerald-600 font-semibold shrink-0">Gr. {best.grade}</span>
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

  return (
    <div className="group flex flex-col bg-card p-4 press-feedback card-hover-lift relative overflow-hidden h-full justify-between">
      <div>
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
        <div className="pt-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {product.brand}
          </p>
          <Link
            to="/listing/$listingId"
            params={{ listingId: best.id }}
            className="mt-1 block text-sm font-semibold leading-snug hover:underline line-clamp-1 text-foreground"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing */}
        <div className="mt-1.5 flex items-baseline gap-2">
          <p className="font-display text-lg font-bold text-primary">{taka(best.price)}</p>
        </div>
      </div>

      {/* Bottom meta & actions */}
      <div className="mt-3 pt-2.5 space-y-2.5 border-t border-border/60">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate font-normal">{best.seller.district}</span>
          <span className="text-emerald-600 font-semibold shrink-0 ml-2">Grade {best.grade}</span>
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
