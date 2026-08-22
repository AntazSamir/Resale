import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { getStoreBySlug, getListingsForStore } from "@/lib/store-store";
import { StoreHeader } from "@/components/storefront/store-header";
import { StoreCatalog } from "@/components/storefront/store-catalog";
import { ShieldCheck, ArrowLeft, Store } from "lucide-react";

export const Route = createFileRoute("/store/$storeSlug")({
  loader: ({ params }) => {
    const store = getStoreBySlug(params.storeSlug);
    if (!store) {
      throw notFound();
    }
    const listings = getListingsForStore(store.id);
    return { store, listings };
  },
  head: ({ loaderData }) => {
    const storeName = loaderData?.store?.name ?? "Verified Pro Store";
    const district = loaderData?.store?.district ?? "Bangladesh";
    const title = `${storeName} · Verified Graded Electronics in ${district} | Resale.com`;
    const description = `${storeName} storefront on Resale.com. 32-point tested devices, transparent condition grades, physical location in ${district}, and 48-hour buyer protection.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
      ],
    };
  },
  component: StorefrontPage,
});

function StorefrontPage() {
  const { store, listings } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 w-full space-y-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5"
        >
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            search={{ q: undefined, category: undefined, brand: undefined }}
            className="hover:text-foreground transition-colors"
          >
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium flex items-center gap-1">
            <Store className="size-3" />
            <span>{store.name}</span>
          </span>
        </nav>

        {/* Store Header Hero */}
        <StoreHeader store={store} totalListingsCount={listings.length} />

        {/* Store Catalog Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-foreground">
                Available Inventory
              </h2>
              <p className="text-xs text-muted-foreground">
                Direct stock from {store.name} tested with 32-point inspection
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>48h Buyer Protection Guaranteed</span>
            </div>
          </div>

          <StoreCatalog listings={listings} storeName={store.name} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
