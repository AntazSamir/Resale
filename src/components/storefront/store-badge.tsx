import { Link } from "@tanstack/react-router";
import { Store, ShieldCheck } from "lucide-react";
import { getStoreById, getStoreBySlug } from "@/lib/store-store";

interface StoreBadgeProps {
  storeId?: string | undefined;
  storeName?: string | undefined;
  className?: string | undefined;
  showIcon?: boolean | undefined;
}

export function StoreBadge({
  storeId,
  storeName,
  className = "",
  showIcon = true,
}: StoreBadgeProps) {
  if (!storeId && !storeName) return null;

  // Real lookup: prefer id, then try slug derived from storeName as fallback
  const store =
    (storeId ? getStoreById(storeId) : undefined) ||
    (storeName ? getStoreBySlug(storeName.toLowerCase().replace(/\s+/g, "-")) : undefined);

  const displayName = store?.name || storeName || "Verified Store";
  // Only use slug from a confirmed store record — never guess it
  const slug = store?.slug;

  const badgeContent = (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors ${className}`}
    >
      {showIcon && <Store className="size-3 shrink-0" />}
      <span className="truncate max-w-35">{displayName}</span>
      {store?.verified && (
        <ShieldCheck
          className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0"
          aria-label="Verified Store"
        />
      )}
    </span>
  );

  if (slug) {
    return (
      <Link to="/store/$storeSlug" params={{ storeSlug: slug }} className="inline-flex">
        {badgeContent}
      </Link>
    );
  }

  // Graceful fallback: render badge without link when store can't be resolved
  return badgeContent;
}
