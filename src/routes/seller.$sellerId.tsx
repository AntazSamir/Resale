import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, Star, MapPin, CalendarDays, PackageX } from "lucide-react";
import { listings, productFor, taka } from "@/data/catalog";
import { GradeBadge } from "@/components/grade-badge";
import { useAuth } from "@/lib/auth-store";
import { getStoreByOwnerId } from "@/lib/store-store";

export const Route = createFileRoute("/seller/$sellerId")({
  head: () => ({
    meta: [{ title: "Seller Profile | Resale.com" }],
  }),
  component: SellerProfilePage,
});

function SellerProfilePage() {
  const { sellerId } = Route.useParams();
  const { user } = useAuth();

  // Look up store if registered
  const store = getStoreByOwnerId(sellerId);

  // Check if this seller matches catalog listing or authenticated user
  const catalogListing = listings.find((l) => l.seller.id === sellerId || l.sellerId === sellerId);

  const isCurrentUser = Boolean(
    user && (user.id === sellerId || sellerId === `seller-${user.phone}` || sellerId === "me"),
  );

  const sellerName =
    store?.name ||
    (isCurrentUser ? user?.name || user?.email?.split("@")[0] : null) ||
    catalogListing?.seller.name ||
    "Seller";

  const location =
    (store?.district ? `${store.district}${store.area ? `, ${store.area}` : ""}` : null) ||
    (catalogListing?.seller.district
      ? `${catalogListing.seller.district}${catalogListing.seller.area ? `, ${catalogListing.seller.area}` : ""}`
      : null) ||
    "Dhaka, Bangladesh";

  const isVerified = Boolean(
    store?.verified ||
    (isCurrentUser && (user?.isAdmin || user?.role === "SELLER")) ||
    catalogListing?.seller.verified,
  );

  const joinDate = isCurrentUser ? "Recently" : "2026";

  // Derive active listings for this seller
  const activeListings = listings
    .filter((l) => l.seller.id === sellerId || l.sellerId === sellerId)
    .map((l) => ({
      ...l,
      product: productFor(l.productId),
    }));

  const initials = sellerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-5xl px-4 sm:px-5 py-8 sm:py-10 w-full">
        {/* Profile Header */}
        <Card className="mb-10">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 text-3xl shrink-0">
              <AvatarImage
                src={
                  store?.logoUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sellerName)}`
                }
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-display">{sellerName}</h1>
                {isVerified && (
                  <ShieldCheck
                    className="size-5 sm:size-6 text-primary shrink-0"
                    aria-label="Verified Seller"
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> {location}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3.5" /> Member since {joinDate}
                </span>
                {catalogListing?.seller.rating ? (
                  <span className="flex items-center gap-1">
                    <Star className="size-3.5 text-amber-500 fill-amber-500" />{" "}
                    {catalogListing.seller.rating} Rating
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-display">
                    {activeListings.length}
                  </div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    Active Listings
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-display">
                    {isVerified ? "Verified" : "Pending"}
                  </div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    Identity Status
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-display">100%</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    Response Rate
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-display">0%</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    Cancel Rate
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Listings */}
        <h2 className="text-xl sm:text-2xl font-bold font-display mb-6">
          Active Listings ({activeListings.length})
        </h2>
        {activeListings.length > 0 ? (
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
                    <h3 className="font-medium text-base sm:text-lg leading-tight mb-2 group-hover:underline line-clamp-1">
                      {item.product?.name}
                    </h3>
                    <p className="font-display text-lg sm:text-xl font-bold text-primary mb-1.5">
                      {taka(item.price)}
                    </p>
                    {item.sellerNote && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.sellerNote}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="mb-12">
            <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground">
              <PackageX className="size-10 mb-3 text-muted-foreground/60" />
              <p className="font-medium text-sm text-foreground">No active listings available</p>
              <p className="text-xs text-muted-foreground mt-1">
                This seller currently has no items listed for sale.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Reviews */}
        <h2 className="text-xl sm:text-2xl font-bold font-display mb-6">Customer Reviews</h2>
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p className="text-sm font-medium text-foreground">No verified reviews recorded yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Verified reviews will appear here as orders are delivered and inspected.
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
