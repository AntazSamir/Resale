import { Link } from "@tanstack/react-router";
import { GradeBadge } from "./grade-badge";
import { cheapest, listingsFor, taka, type Product } from "@/data/catalog";

export function ProductCard({ product }: { product: Product }) {
  const best = cheapest(product.id);
  const count = listingsFor(product.id).length;

  if (!best) return null;

  const discountPercent = Math.round(((product.retail - best.price) / product.retail) * 100);

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="group flex flex-col bg-card p-5 transition-all hover:bg-secondary relative overflow-hidden"
    >
      {/* Discount badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 bg-red-600 text-white font-bold text-xs px-2 py-0.5 rounded shadow-sm z-10">
          -{discountPercent}% OFF
        </div>
      )}

      <div className="aspect-square overflow-hidden bg-muted rounded-md relative">
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
      </div>

      <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground font-medium">
        {product.brand}
      </p>
      <h3 className="mt-1 text-base font-medium leading-tight group-hover:underline">
        {product.name}
      </h3>

      <div className="mt-3 flex items-baseline gap-2">
        <p className="font-display text-xl font-bold text-primary">{taka(best.price)}</p>
        <p className="text-xs text-muted-foreground line-through">{taka(product.retail)}</p>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
        <span>
          {count} unit{count > 1 ? "s" : ""} from {best.seller.district}
        </span>
        <span className="text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
          Grade {best.grade}
        </span>
      </div>
    </Link>
  );
}
