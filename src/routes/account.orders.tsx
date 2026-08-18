import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { taka } from "@/data/catalog";
import { getOrders, type OrderRecord } from "@/lib/order-store";

export const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [{ title: "My Orders | Resale.com" }],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-5xl px-5 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl">My Orders</h1>
          <Button variant="outline" asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link to="/">Browse Catalog</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="bg-muted/50 py-4 flex flex-row items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Order Placed
                    </p>
                    <p className="font-medium text-sm">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
                    <p className="font-medium text-sm text-primary">{taka(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Order #
                    </p>
                    <p className="font-mono text-sm font-medium">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        order.status === "DELIVERED"
                          ? "default"
                          : order.status === "SHIPPED"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="font-medium text-sm">
                        {item.name}{" "}
                        <span className="text-muted-foreground font-normal ml-2">
                          Grade {item.grade} · {taka(item.price)}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground">
                      Payment: {order.paymentMethod.toUpperCase()} · Delivery to{" "}
                      {order.shippingAddress?.district || "Dhaka"}
                    </p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <Button variant="outline" asChild>
                      <Link to="/account/orders/$orderId" params={{ orderId: order.id }}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
