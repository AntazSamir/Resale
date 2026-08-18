import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/catalog";
import { ChevronRight, Filter } from "lucide-react";

export const Route = createFileRoute("/category/$categorySlug")({
  loader: ({ params }) => {
    // Basic slug to category name mapping
    const slug = params.categorySlug.toLowerCase();
    const allCategories = Array.from(new Set(products.map((p) => p.category)));
    const matchedCategory = allCategories.find((c) => c.toLowerCase() === slug);

    if (!matchedCategory) {
      throw notFound();
    }

    return {
      category: matchedCategory,
      slug,
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category ?? "Category"} | Resale.com` },
      {
        name: "description",
        content: `Shop pre-owned ${loaderData?.category ?? "electronics"} in Bangladesh.`,
      },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const categoryProducts = products.filter((p) => p.category === category);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-5 py-8">
        <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{category}</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold tracking-tight">{category}</h1>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Filter className="size-4" />
            <span>{categoryProducts.length} models available</span>
          </div>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No products available in this category yet.</p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
