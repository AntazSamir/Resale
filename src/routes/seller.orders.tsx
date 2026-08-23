import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SellerSidebar } from "./seller.dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { taka } from "@/data/catalog";
import { ProtectedRoute } from "@/components/protected-route";
import {
  getOrders,
  fetchOrdersAsync,
  onOrdersChange,
  transitionOrderStatus,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/order-store";

export const Route = createFileRoute("/seller/orders")({
  head: () => ({
    meta: [{ title: "Seller Orders Fulfillment | Resale.com" }],
  }),
  component: SellerOrdersPage,
});

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-secondary text-foreground border-border gap-1 text-xs"
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
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1 text-xs"
        >
          <Package className="size-3" /> Processing / Packing
        </Badge>
      );
    case "READY_TO_SHIP":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1 text-xs"
        >
          <Clock className="size-3" /> Ready for Courier Handover
        </Badge>
      );
    case "SHIPPED":
      return (
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20 gap-1 font-semibold text-xs"
        >
          <Truck className="size-3 text-primary" /> Dispatched / In Transit
        </Badge>
      );
    case "DELIVERED":
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 font-semibold text-xs"
        >
          <CheckCircle2 className="size-3" /> {status === "COMPLETED" ? "Completed" : "Delivered"}
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20 gap-1 text-xs"
        >
          <XCircle className="size-3" /> Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function SellerOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "IN_PROGRESS" | "SHIPPED" | "COMPLETED" | "CANCELLED"
  >("ALL");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const refresh = () => {
    setOrders(getOrders());
    fetchOrdersAsync()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) setOrders(res);
      })
      .catch(() => {});
  };

  useEffect(() => {
    refresh();
    const unsubscribe = onOrdersChange(setOrders);
    return () => unsubscribe();
  }, []);

  const handleTransition = (orderId: string, nextStatus: OrderStatus, label: string) => {
    const res = transitionOrderStatus(orderId, nextStatus, "SELLER");
    if (res.success) {
      setActionFeedback(`Order #${orderId} updated to: ${label}`);
      setTimeout(() => setActionFeedback(null), 3000);
      refresh();
    } else {
      alert(res.error || "Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "PENDING") return order.orderStatus === "PENDING";
    if (filter === "IN_PROGRESS")
      return ["CONFIRMED", "PROCESSING", "READY_TO_SHIP"].includes(order.orderStatus);
    if (filter === "SHIPPED") return order.orderStatus === "SHIPPED";
    if (filter === "COMPLETED") return ["DELIVERED", "COMPLETED"].includes(order.orderStatus);
    if (filter === "CANCELLED") return ["CANCELLED", "REFUNDED"].includes(order.orderStatus);
    return true;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 w-full flex gap-8 lg:gap-10">
          <SellerSidebar active="orders" />

          <div className="flex-1 space-y-6 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  Order Management &amp; Fulfillment
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Confirm orders, prepare packages, and advance lifecycle stages through courier
                  dispatch
                </p>
              </div>
            </div>

            {actionFeedback && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{actionFeedback}</span>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-border/60 pb-3 text-xs overflow-x-auto">
              {(
                [
                  { key: "ALL", label: `All Orders (${orders.length})` },
                  { key: "PENDING", label: "New (Pending)" },
                  { key: "IN_PROGRESS", label: "Processing & Packing" },
                  { key: "SHIPPED", label: "In Transit" },
                  { key: "COMPLETED", label: "Delivered / Done" },
                  { key: "CANCELLED", label: "Cancelled" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={`px-3 py-1.5 font-medium transition-colors cursor-pointer rounded-none text-xs ${
                    filter === tab.key
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <Card className="p-12 text-center border-border/70">
                <p className="text-muted-foreground text-sm">No orders matching this filter.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="border-border/80 shadow-xs overflow-hidden">
                    <CardHeader className="bg-muted/40 py-3.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 text-xs">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[10.5px] text-muted-foreground uppercase tracking-wider font-medium">
                            Order ID
                          </p>
                          <p className="font-mono font-bold text-foreground text-sm">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-[10.5px] text-muted-foreground uppercase tracking-wider font-medium">
                            Order Date
                          </p>
                          <p className="font-medium text-foreground">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-[10.5px] text-muted-foreground uppercase tracking-wider font-medium">
                            Total Value
                          </p>
                          <p className="font-display font-bold text-primary">{taka(order.total)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.isSampleData && (
                          <span className="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 bg-secondary text-muted-foreground border border-border/40">
                            Demo Order
                          </span>
                        )}
                        {getStatusBadge(order.orderStatus)}
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6 space-y-4 text-xs">
                      {/* Items Row */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
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
                              <div>
                                <p className="font-semibold text-foreground text-sm">{item.name}</p>
                                <p className="text-muted-foreground text-[11px]">
                                  Grade {item.grade} · Listing: {item.listingId}
                                </p>
                              </div>
                            </div>
                            <span className="font-display font-bold text-foreground">
                              {taka(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery & Payment details summary */}
                      <div className="grid sm:grid-cols-2 gap-3 p-3 bg-secondary/30 border border-border/50 text-xs">
                        <div>
                          <span className="text-muted-foreground block text-[11px]">
                            Shipping Destination:
                          </span>
                          <span className="font-medium text-foreground">
                            {order.shippingAddress?.district}, {order.shippingAddress?.division}{" "}
                            (Recipient: {order.shippingAddress?.name || "Buyer"})
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[11px]">
                            Payment Collection:
                          </span>
                          <span className="font-medium text-foreground">
                            {order.paymentMethod} (
                            {order.paymentStatus === "PAID"
                              ? "Settled"
                              : "Pending Courier Doorstep Collection"}
                            )
                          </span>
                        </div>
                      </div>

                      {/* Action Stage Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
                        <div className="text-[11px] text-muted-foreground">
                          {order.timeline.length > 0 && (
                            <span>
                              Latest event:{" "}
                              <strong>{order.timeline[order.timeline.length - 1]?.title}</strong>
                            </span>
                          )}
                        </div>

                        {/* Status Transition Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          {order.orderStatus === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleTransition(order.id, "CONFIRMED", "Confirmed")}
                                className="font-semibold"
                              >
                                <CheckCircle2 className="size-3.5 mr-1.5" /> Confirm Order
                              </Button>
                            </>
                          )}

                          {order.orderStatus === "CONFIRMED" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleTransition(order.id, "PROCESSING", "Processing & Packing")
                              }
                              className="font-semibold"
                            >
                              <Package className="size-3.5 mr-1.5" /> Start Packing Device
                            </Button>
                          )}

                          {order.orderStatus === "PROCESSING" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleTransition(order.id, "READY_TO_SHIP", "Ready for Courier")
                              }
                              className="font-semibold"
                            >
                              <Clock className="size-3.5 mr-1.5" /> Mark Ready for Courier
                            </Button>
                          )}

                          {order.orderStatus === "READY_TO_SHIP" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleTransition(order.id, "SHIPPED", "Handed over to Courier")
                              }
                              className="font-semibold"
                            >
                              <Truck className="size-3.5 mr-1.5" /> Hand to Courier (Dispatched)
                            </Button>
                          )}

                          {order.orderStatus === "SHIPPED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTransition(order.id, "DELIVERED", "Delivered")}
                              className="font-semibold text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                            >
                              <CheckCircle2 className="size-3.5 mr-1.5" /> Confirm Doorstep Delivery
                            </Button>
                          )}

                          <Button size="sm" variant="ghost" asChild>
                            <Link to="/account/orders/$orderId" params={{ orderId: order.id }}>
                              View Audit Details <ChevronRight className="size-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
