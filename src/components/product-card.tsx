import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GradeBadge } from "./grade-badge";
import { cheapest, listingsFor, taka, type Product } from "@/data/catalog";
import { useCart } from "@/lib/cart-store";
import { ShoppingBag, Check, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const best = cheapest(product.id);
  const count = listingsFor(product.id).length;
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);

  if (!best) return null;

  const inCart = isInCart(best.id);
  const savingsPct =
    product.retail > best.price ? Math.round((1 - best.price / product.retail) * 100) : 0;

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
      <div className="group relative flex flex-col justify-between h-full bg-card border border-border/70 p-3 transition-all duration-200 hover:shadow-md hover:border-primary/40 select-none overflow-hidden rounded-md">
        <div>
          {/* Product Image Link → listing */}
          <Link
            to="/listing/$listingId"
            params={{ listingId: best.id }}
            className="relative block aspect-square w-full overflow-hidden bg-muted/30 rounded-sm"
          >
            <img
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {savingsPct > 0 && (
              <span className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs">
                -{savingsPct}%
              </span>
            )}
            <div className="absolute bottom-1.5 right-1.5">
              <span className="bg-card/95 backdrop-blur-xs text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-xs border border-border/60 shadow-xs">
                Grade {best.grade}
              </span>
            </div>
          </Link>

          {/* Brand & Name */}
          <div className="pt-2.5 flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold truncate leading-none">
              {product.brand}
            </span>
            <Link
              to="/listing/$listingId"
              params={{ listingId: best.id }}
              className="mt-1 block text-xs font-semibold leading-snug hover:underline line-clamp-2 text-foreground"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          {/* Pricing */}
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-display text-sm font-bold text-primary leading-tight">
              {taka(best.price)}
            </span>
            {savingsPct > 0 && (
              <span className="text-[11px] text-muted-foreground line-through">
                {taka(product.retail)}
              </span>
            )}
          </div>
        </div>

        {/* Bottom meta & actions */}
        <div className="mt-2.5 pt-2 space-y-2 border-t border-border/50">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground gap-1">
            <span className="truncate flex items-center gap-1">
              <MapPin className="size-3 shrink-0" />
              {best.seller.district}
            </span>
            {best.seller.verified && (
              <span className="text-emerald-600 font-semibold shrink-0 flex items-center gap-0.5 text-[10px]">
                <ShieldCheck className="size-3" />
                Verified
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Button
              type="button"
              size="sm"
              onClick={handleBuyNow}
              className="h-8 px-2 text-xs rounded-sm bg-primary text-primary-foreground font-semibold hover:opacity-90 flex items-center justify-center w-full shadow-xs"
            >
              <span>Buy now</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddToCart}
              className="h-8 px-2 text-xs rounded-sm border-border/80 font-medium flex items-center justify-center gap-1.5 hover:bg-muted w-full"
            >
              {inCart || justAdded ? (
                <>
                  <Check className="size-3 text-emerald-600 shrink-0" />
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
    <div className="group flex flex-col bg-card p-4 transition-all duration-200 hover:shadow-lg hover:border-primary/40 relative overflow-hidden border border-border/80 rounded-lg h-full justify-between">
      <div>
        {/* Product Image Link → listing */}
        <Link
          to="/listing/$listingId"
          params={{ listingId: best.id }}
          className="block aspect-square overflow-hidden bg-muted/20 rounded-md relative border border-border/40"
        >
          <img
            src={product.image}
            alt={product.name}
            width={900}
            height={900}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {savingsPct > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-primary text-primary-foreground text-[11px] font-bold px-2 py-0.5 rounded-xs shadow-xs">
              -{savingsPct}%
            </span>
          )}
          <div className="absolute bottom-2.5 right-2.5">
            <span className="bg-card/95 backdrop-blur-xs text-foreground text-xs font-bold px-2 py-0.5 rounded-xs border border-border/60 shadow-xs">
              Grade {best.grade}
            </span>
          </div>
        </Link>

        {/* Brand & Name */}
        <div className="pt-3.5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            {product.brand} · {product.category}
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
        <div className="mt-2 flex items-baseline gap-2">
          <p className="font-display text-lg font-bold text-primary">{taka(best.price)}</p>
          {savingsPct > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              {taka(product.retail)}
            </span>
          )}
        </div>
      </div>

      {/* Bottom meta & actions */}
      <div className="mt-3.5 pt-3 space-y-3 border-t border-border/60">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate flex items-center gap-1 font-medium">
            <MapPin className="size-3 shrink-0" />
            {best.seller.district}
          </span>
          {best.seller.verified ? (
            <span className="text-emerald-600 font-semibold shrink-0 flex items-center gap-1 text-xs">
              <ShieldCheck className="size-3.5" />
              Verified Seller
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">
              {count} {count === 1 ? "unit" : "units"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleBuyNow}
            className="h-9 px-2 text-xs rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 flex items-center justify-center shadow-xs"
          >
            <span>Buy now</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            className="h-9 px-2 text-xs rounded-md border-border/80 font-medium flex items-center justify-center gap-1.5 hover:bg-muted"
          >
            {inCart || justAdded ? (
              <>
                <Check className="size-3.5 text-emerald-600 shrink-0" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="size-3.5 shrink-0" />
                <span>Add to cart</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
