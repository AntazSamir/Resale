import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { taka } from "@/data/catalog";
import { getOrders, type OrderRecord, type OrderStatus } from "@/lib/order-store";

import { ProtectedRoute } from "@/components/protected-route";

export const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [{ title: "My Orders | Resale.com" }],
  }),
  component: OrdersPageWrapper,
});

function OrdersPageWrapper() {
  return (
    <ProtectedRoute redirect="/account/orders">
      <OrdersPage />
    </ProtectedRoute>
  );
}

function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-secondary/80 text-foreground border-border gap-1 font-medium text-xs"
        >
          <Clock className="size-3 text-amber-500" /> Pending Confirmation
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20 gap-1 font-semibold text-xs"
        >
          <CheckCircle2 className="size-3 text-primary" /> Confirmed
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1 font-medium text-xs"
        >
          <Package className="size-3" /> Processing / Packing
        </Badge>
      );
    case "READY_TO_SHIP":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1 font-medium text-xs"
        >
          <Clock className="size-3" /> Ready for Courier
        </Badge>
      );
    case "SHIPPED":
      return (
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20 gap-1 font-semibold text-xs"
        >
          <Truck className="size-3 text-primary" /> In Transit / Shipped
        </Badge>
      );
    case "DELIVERED":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 font-semibold text-xs"
        >
          <CheckCircle2 className="size-3" /> Delivered
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 font-semibold text-xs"
        >
          <CheckCircle2 className="size-3" /> Completed
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20 gap-1 font-medium text-xs"
        >
          <XCircle className="size-3" /> Cancelled
        </Badge>
      );
    case "REFUND_REQUESTED":
    case "DISPUTED":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1 font-medium text-xs"
        >
          <AlertCircle className="size-3" /> In Review / Dispute
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge
          variant="outline"
          className="bg-secondary text-muted-foreground border-border gap-1 font-medium text-xs"
        >
          Refunded
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED">("ALL");

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "ACTIVE") {
      return ["PENDING", "CONFIRMED", "PROCESSING", "READY_TO_SHIP", "SHIPPED"].includes(
        order.orderStatus,
      );
    }
    if (filter === "COMPLETED") {
      return ["DELIVERED", "COMPLETED"].includes(order.orderStatus);
    }
    if (filter === "CANCELLED") {
      return ["CANCELLED", "REFUNDED"].includes(order.orderStatus);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Track status, delivery timelines, and device condition records
            </p>
          </div>
          <Button variant="outline" asChild size="sm">
            <Link to="/products" search={{ q: undefined, category: undefined, brand: undefined }}>
              Browse Catalog
            </Link>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-border/60 pb-3 text-xs overflow-x-auto">
          {(["ALL", "ACTIVE", "COMPLETED", "CANCELLED"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 font-medium transition-colors cursor-pointer rounded-none text-xs ${
                filter === tab
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {tab === "ALL"
                ? `All Orders (${orders.length})`
                : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <Card className="p-12 text-center border-border/70">
            <p className="text-muted-foreground mb-4 text-sm">No orders found in this category.</p>
            <Button asChild size="sm">
              <Link to="/products" search={{ q: undefined, category: undefined, brand: undefined }}>
                Browse Available Listings
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-border/80 shadow-xs overflow-hidden">
                <CardHeader className="bg-muted/40 py-3.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10.5px] text-muted-foreground uppercase tracking-wider font-medium">
                        Order Placed
                      </p>
                      <p className="font-semibold text-foreground">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-[10.5px] text-muted-foreground uppercase tracking-wider font-medium">
                        Total Amount
                      </p>
                      <p className="font-display font-bold text-primary">{taka(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-[10.5px] text-muted-foreground uppercase tracking-wider font-medium">
                        Order #
                      </p>
                      <p className="font-mono font-medium text-foreground">{order.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.isSampleData && (
                      <span className="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 bg-secondary text-muted-foreground border border-border/40">
                        Demo Data
                      </span>
                    )}
                    {getOrderStatusBadge(order.orderStatus)}
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs">
                        <div className="size-10 bg-muted border border-border/60 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="size-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-muted-foreground text-[11px] mt-0.5">
                            Grade {item.grade} · Sold by {item.sellerName || "Verified Seller"} ·{" "}
                            {taka(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground pt-1">
                      <span>
                        Payment: <strong>{order.paymentMethod}</strong> (
                        {order.paymentStatus === "PAID" ? "Paid" : "Pending on Delivery"})
                      </span>
                      <span>·</span>
                      <span>Delivery: {order.shippingAddress?.district || "Dhaka"}</span>
                      {order.timeline.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-foreground font-medium">
                            Latest update: {order.timeline[order.timeline.length - 1]?.title}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2.5 shrink-0 sm:self-center">
                    <Button variant="outline" size="sm" asChild className="font-medium">
                      <Link to="/account/orders/$orderId" params={{ orderId: order.id }}>
                        Track &amp; View Details
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
