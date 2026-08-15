import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SellerSidebar } from "./seller.dashboard";
import { Badge } from "@/components/ui/badge";
import { taka, listings } from "@/data/catalog";
import { GradeBadge } from "@/components/grade-badge";

export const Route = createFileRoute("/seller/listings")({
  head: () => ({
    meta: [{ title: "My Listings | Resale.com" }],
  }),
  component: SellerListingsPage,
});

function SellerListingsPage() {
  // Use mock listings
  const myListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex gap-10">
        <SellerSidebar active="listings" />

        <div className="flex-1">
          <h1 className="text-3xl mb-8">My Listings</h1>

          <div className="space-y-4">
            {myListings.map((listing) => (
              <Card key={listing.id}>
                <CardHeader className="bg-muted/50 py-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={listing.grade === "A+" ? "default" : "secondary"}>
                      Approved
                    </Badge>
                    <span className="text-sm text-muted-foreground">Listing ID: {listing.id}</span>
                  </div>
                  <div className="font-display font-medium text-lg">{taka(listing.price)}</div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <GradeBadge grade={listing.grade} />
                      </div>
                      <p className="font-medium">Score: {listing.conditionScore}/100</p>
                      <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                        {listing.sellerNote}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Draft Mock */}
            <Card className="opacity-70 border-dashed border-2">
              <CardHeader className="bg-muted/30 py-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Pending Review</Badge>
                  <span className="text-sm text-muted-foreground">Submitted 2 hours ago</span>
                </div>
                <div className="font-display font-medium text-lg">{taka(95000)}</div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <GradeBadge grade="A" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                      Sony PlayStation 5 Console (Disc Edition)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
