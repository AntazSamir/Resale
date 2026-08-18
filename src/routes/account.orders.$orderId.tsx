import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Truck, PackageCheck, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { taka } from "@/data/catalog";
import { getOrderById, type OrderRecord } from "@/lib/order-store";

export const Route = createFileRoute("/account/orders/$orderId")({
  head: ({ params }) => ({
    meta: [{ title: `Order ${params.orderId} Details | Resale.com` }],
  }),
  component: OrderDetailsPage,
});

function OrderDetailsPage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<OrderRecord | null | undefined>(undefined);

  useEffect(() => {
    setOrder(getOrderById(orderId) || null);
  }, [orderId]);

  if (order === undefined) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-4xl px-5 py-10 w-full text-center">
          <p className="text-muted-foreground">Loading order details…</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-4xl px-5 py-10 w-full text-center">
          <h1 className="text-2xl mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't locate order #{orderId}. It may have been placed under a different session.
          </p>
          <Button asChild>
            <Link to="/account/orders">Back to My Orders</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const isDelivered = order.status === "DELIVERED";
  const isShipped = order.status === "SHIPPED" || isDelivered;
  const isConfirmed = order.status === "CONFIRMED" || isShipped;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-4xl px-5 py-10 w-full">
        <nav className="text-xs text-muted-foreground mb-6">
          <Link to="/account/orders" className="hover:text-foreground">
            My Orders
          </Link>
          <span className="px-2">/</span>
          <span className="text-foreground">{order.id}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display">Order #{order.id}</h1>
            <p className="text-sm text-muted-foreground mt-1">Placed on {order.date}</p>
          </div>
          <Badge
            variant={
              order.status === "DELIVERED"
                ? "default"
                : order.status === "SHIPPED"
                  ? "secondary"
                  : "outline"
            }
            className="w-fit text-sm px-3 py-1"
          >
            Status: {order.status}
          </Badge>
        </div>

        <div className="grid md:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            {/* Items Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Items in this Order</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Grade {item.grade} {item.sellerName ? `· Sold by ${item.sellerName}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-medium text-sm">{taka(item.price)}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Subtotal</span>
                    <span>{taka(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Delivery Fee</span>
                    <span>{taka(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-display font-bold text-base pt-2 border-t">
                    <span>Total Amount</span>
                    <span className="text-primary">{taka(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery &amp; Courier Tracking</CardTitle>
                <CardDescription>
                  Courier Partner: RedX Bangladesh · Standard Insured
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 border-l-2 border-primary space-y-8 my-2">
                  <div className="relative">
                    <div className="absolute -left-8.25 bg-background p-1">
                      <CheckCircle2 className="size-4 text-success fill-success/20" />
                    </div>
                    <p className="font-medium text-sm">Order Placed &amp; Escrow Locked</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>

                  <div className={`relative ${!isConfirmed ? "opacity-40" : ""}`}>
                    <div className="absolute -left-8.25 bg-background p-1">
                      <CheckCircle2
                        className={`size-4 ${isConfirmed ? "text-success fill-success/20" : "text-muted-foreground"}`}
                      />
                    </div>
                    <p className="font-medium text-sm">Seller Confirmed &amp; Packed</p>
                    <p className="text-xs text-muted-foreground">Condition checklist verified</p>
                  </div>

                  <div className={`relative ${!isShipped ? "opacity-40" : ""}`}>
                    <div className="absolute -left-8.25 bg-background p-1">
                      <Truck
                        className={`size-4 ${isShipped ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <p className={`font-medium text-sm ${isShipped ? "text-primary" : ""}`}>
                      Shipped &amp; In Transit
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isShipped ? "Handed over to courier hub" : "Pending dispatch"}
                    </p>
                  </div>

                  <div className={`relative ${!isDelivered ? "opacity-40" : ""}`}>
                    <div className="absolute -left-8.25 bg-background p-1">
                      <PackageCheck
                        className={`size-4 ${isDelivered ? "text-success" : "text-muted-foreground"}`}
                      />
                    </div>
                    <p className="font-medium text-sm">Delivered &amp; 48-Hour Inspection Window</p>
                    <p className="text-xs text-muted-foreground">
                      {isDelivered ? "Completed" : "Pending final doorstep delivery"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Delivery Address Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress?.name || "Recipient"}</p>
                <p className="text-muted-foreground">{order.shippingAddress?.phone}</p>
                <p className="text-muted-foreground">{order.shippingAddress?.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress?.district}, {order.shippingAddress?.division}
                </p>
                <div className="pt-3 border-t mt-3 text-xs text-muted-foreground">
                  <p>
                    <strong>Payment:</strong> {order.paymentMethod.toUpperCase()}
                  </p>
                  <p>
                    <strong>NID Verified:</strong> {order.nidNumber || "Yes"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-primary" /> Buyer Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your payment is safely held in escrow until 48 hours after delivery. If the
                  product differs from the condition report, you are eligible for an instant return
                  &amp; full refund.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive hover:bg-destructive/10"
                  asChild
                >
                  <Link to="/account/disputes">
                    <AlertCircle className="size-3.5 mr-2" /> Report an Issue
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
