import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, Star, MapPin, CalendarDays, CheckCircle2 } from "lucide-react";
import { listings, productFor, taka } from "@/data/catalog";
import { GradeBadge } from "@/components/grade-badge";

export const Route = createFileRoute("/seller/$sellerId")({
  head: () => ({
    meta: [{ title: "Seller Profile | Resale.com" }],
  }),
  component: SellerProfilePage,
});

function SellerProfilePage() {
  const { sellerId } = Route.useParams();

  // Mock seller data based on PRD Section 9.3
  const seller = {
    id: sellerId,
    name: "Rafiq Islam",
    joinDate: "January 2026",
    location: "Dhaka",
    verified: true,
    rating: 4.8,
    sales: 32,
    completionRate: 98,
    cancellationRate: 2,
    returnRate: 0,
    disputeRate: 0,
    responseRate: 100,
  };

  // Mock listings for this seller
  const activeListings = listings.slice(0, 3).map((l) => ({
    ...l,
    product: productFor(l.productId),
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-5xl px-5 py-10 w-full">
        {/* Demo Data Notice */}
        <div className="text-[11px] bg-muted/60 text-muted-foreground px-3 py-1.5 border border-border mb-4 flex items-center justify-between">
          <span>Demo Seller Profile &middot; Sample Performance &amp; Metrics</span>
          <span className="font-semibold">NID Verified Sample</span>
        </div>

        {/* Profile Header */}
        <Card className="mb-10">
          <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <Avatar className="w-32 h-32 text-4xl">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${seller.name}`} />
              <AvatarFallback>RI</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold">{seller.name}</h1>
                {seller.verified && (
                  <ShieldCheck className="size-6 text-success" aria-label="Verified Seller" />
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" /> {seller.location}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-4" /> Joined {seller.joinDate}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-4 text-primary fill-primary" /> {seller.rating} Rating
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t">
                <div>
                  <div className="text-2xl font-bold">{seller.sales}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Successful Sales
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{seller.completionRate}%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Completion Rate
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{seller.responseRate}%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Response Rate
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{seller.cancellationRate}%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Cancel Rate
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Listings */}
        <h2 className="text-2xl mb-6">Active Listings ({activeListings.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeListings.map((item) => (
            <Link
              key={item.id}
              to="/listing/$listingId"
              params={{ listingId: item.id }}
              className="group"
            >
              <Card className="h-full overflow-hidden hover:border-primary transition-colors">
                <div className="aspect-square bg-muted">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <GradeBadge grade={item.grade} />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                      {item.product?.brand}
                    </span>
                  </div>
                  <h3 className="font-medium text-lg leading-tight mb-2 group-hover:underline">
                    {item.product?.name}
                  </h3>
                  <p className="font-display text-xl mb-1.5">{taka(item.price)}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.sellerNote}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Reviews */}
        <h2 className="text-2xl mb-6">Recent Reviews</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="size-4 text-primary fill-primary" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">Buyer {i}402</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-success" /> Verified Purchase
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">August {10 - i}, 2026</span>
                </div>
                <p className="text-sm">
                  Item arrived exactly as described in the condition report. Great seller, very
                  responsive!
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
