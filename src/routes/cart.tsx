import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Trash2 } from "lucide-react";
import { productFor, taka, listingFor } from "@/data/catalog";
import { GradeBadge } from "@/components/grade-badge";
import { useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your Cart | Resale.com" }],
  }),
  component: CartPage,
});

const SHIPPING = 120;

function CartPage() {
  const { items, removeFromCart, subtotal } = useCart();

  const cartItems = items
    .map((item) => {
      const listing = listingFor(item.listingId);
      if (!listing) return null;
      const product = productFor(listing.productId);
      if (!product) return null;
      return { listing, product };
    })
    .filter(Boolean) as { listing: ReturnType<typeof listingFor> & {}; product: ReturnType<typeof productFor> & {} }[];

  const total = subtotal + (cartItems.length > 0 ? SHIPPING : 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full">
        <h1 className="text-3xl mb-8">Your Cart</h1>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-[1fr_350px] gap-10">
            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <Card key={item.listing.id}>
                  <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
                    <div className="w-24 h-24 shrink-0 bg-muted rounded-md overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <GradeBadge grade={item.listing.grade} />
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">
                              {item.product.brand}
                            </span>
                          </div>
                          <Link
                            to="/listing/$listingId"
                            params={{ listingId: item.listing.id }}
                            className="text-lg font-medium hover:underline"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                        <p className="font-display text-xl">{taka(item.listing.price)}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-sm text-muted-foreground">
                          Seller: {item.listing.seller.name}
                          {item.listing.seller.verified && (
                            <ShieldCheck className="size-3.5 inline ml-1 text-success" />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeFromCart(item.listing.id)}
                        >
                          <Trash2 className="size-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="text-lg font-medium mb-6">Order Summary</h2>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{taka(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping Estimate</span>
                      <span>{taka(SHIPPING)}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{taka(total)}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full mt-6" size="lg">
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    NID will be required during checkout for all purchases.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl mb-4">Your cart is empty</h2>
            <Button asChild>
              <Link to="/">Browse products</Link>
            </Button>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
