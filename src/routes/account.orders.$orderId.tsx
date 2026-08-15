import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Truck, PackageCheck, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/account/orders/$orderId")({
  head: () => ({
    meta: [{ title: "Order Details | Resale.com" }],
  }),
  component: OrderDetailsPage,
});

function OrderDetailsPage() {
  const { orderId } = Route.useParams();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-4xl px-5 py-10 w-full">
        <nav className="text-xs text-muted-foreground mb-6">
          <Link to="/account/orders" className="hover:text-foreground">
            My Orders
          </Link>
          <span className="px-2">/</span>
          <span className="text-foreground">{orderId}</span>
        </nav>

        <h1 className="text-3xl mb-8">Order Details</h1>

        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 border-l-2 border-primary space-y-8">
                  <div className="relative">
                    <div className="absolute -left-8.25 bg-background p-1">
                      <div className="size-3 rounded-full bg-primary" />
                    </div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">Aug 14, 2026 10:00 AM</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8.25 bg-background p-1">
                      <div className="size-3 rounded-full bg-primary" />
                    </div>
                    <p className="font-medium">Seller Confirmed</p>
                    <p className="text-sm text-muted-foreground">Aug 14, 2026 02:30 PM</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8.25 bg-background p-1">
                      <Truck className="size-5 text-primary bg-background -ml-1 -mt-1" />
                    </div>
                    <p className="font-medium text-primary">Shipped</p>
                    <p className="text-sm text-muted-foreground">
                      Aug 15, 2026 09:15 AM - Handed over to RedX
                    </p>
                  </div>
                  <div className="relative opacity-40">
                    <div className="absolute -left-8.25 bg-background p-1">
                      <PackageCheck className="size-5 -ml-1 -mt-1" />
                    </div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You have a 48-hour window after delivery to raise a dispute if the item doesn't
                  match the condition report.
                </p>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:bg-destructive/10"
                  asChild
                >
                  <Link to="/account/disputes">
                    <AlertCircle className="size-4 mr-2" /> Report an Issue
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
