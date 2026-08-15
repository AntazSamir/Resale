import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { taka } from "@/data/catalog";

export const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [{ title: "My Orders | Resale.com" }],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const mockOrders = [
    {
      id: "ORD-84392",
      date: "2026-08-14",
      status: "SHIPPED",
      total: 124000,
      items: [{ name: "iPhone 15 Pro 256GB - Titanium", grade: "A+" }],
    },
    {
      id: "ORD-71204",
      date: "2026-07-20",
      status: "DELIVERED",
      total: 45000,
      items: [{ name: "Dell Ultrasharp 27 Monitor", grade: "A" }],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-5xl px-5 py-10 w-full">
        <h1 className="text-3xl mb-8">My Orders</h1>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="bg-muted/50 py-4 flex flex-row items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order Placed</p>
                  <p className="font-medium">{order.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-medium">{taka(order.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order #</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div className="text-right">
                  <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  {order.items.map((item, i) => (
                    <div key={i} className="font-medium">
                      {item.name}{" "}
                      <span className="text-muted-foreground font-normal ml-2">
                        Grade {item.grade}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
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
      </main>
      <SiteFooter />
    </div>
  );
}
