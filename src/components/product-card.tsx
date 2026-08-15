import { Link } from "@tanstack/react-router";
import { GradeBadge } from "./grade-badge";
import { cheapest, listingsFor, taka, type Product } from "@/data/catalog";

export function ProductCard({ product }: { product: Product }) {
  const best = cheapest(product.id);
  const count = listingsFor(product.id).length;

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="group flex flex-col bg-card p-5 transition-colors hover:bg-secondary"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          width={900}
          height={900}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">{product.brand}</p>
      <h3 className="mt-1 text-base font-medium">{product.name}</h3>
      <div className="mt-3 flex items-center justify-between">
        <p className="font-display text-lg">{taka(best.price)}</p>
        <GradeBadge grade={best.grade} showLabel={false} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {count} listing{count > 1 ? "s" : ""} · from {best.seller.district}
      </p>
    </Link>
  );
}