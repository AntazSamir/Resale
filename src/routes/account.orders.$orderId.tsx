import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Truck,
  PackageCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
  UserCheck,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { taka } from "@/data/catalog";
import {
  getOrderById,
  canCancelOrder,
  cancelOrder,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/order-store";
import resaleLogo from "@/assets/resale-logo.svg";

import { ProtectedRoute } from "@/components/protected-route";

export const Route = createFileRoute("/account/orders/$orderId")({
  head: ({ params }) => ({
    meta: [{ title: `Order #${params.orderId} Details | Resale.com` }],
  }),
  component: OrderDetailsPageWrapper,
});

function OrderDetailsPageWrapper() {
  return (
    <ProtectedRoute redirect="/account/orders">
      <OrderDetailsPage />
    </ProtectedRoute>
  );
}

function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-secondary text-foreground border-border gap-1 font-medium text-xs"
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
          <Package className="size-3" /> Processing
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

function OrderDetailsPage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<OrderRecord | null | undefined>(undefined);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("Change of mind");
  const [customReason, setCustomReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setOrder(getOrderById(orderId) || null);
  }, [orderId]);

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setCancelling(true);
    const finalReason =
      cancelReason === "Other" ? customReason.trim() || "Other reason" : cancelReason;
    const res = cancelOrder(order.id, finalReason, "BUYER");
    if (res.success && res.order) {
      setOrder(res.order);
      setShowCancelModal(false);
    }
    setCancelling(false);
  };

  if (order === undefined) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-4xl px-5 py-10 w-full text-center">
          <p className="text-muted-foreground text-sm">Loading order details…</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-4xl px-5 py-10 w-full text-center space-y-4">
          <h1 className="text-2xl font-display font-bold">Order Not Found</h1>
          <p className="text-muted-foreground text-sm">
            We couldn't locate order #{orderId}. It may belong to another session.
          </p>
          <Button asChild>
            <Link to="/account/orders">Back to My Orders</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const isCancellable = canCancelOrder(order);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 w-full space-y-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link to="/account/orders" className="hover:text-foreground">
            My Orders
          </Link>
          <span>/</span>
          <span className="text-foreground font-mono font-medium">{order.id}</span>
        </nav>

        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div className="flex items-center gap-3">
            <img
              src={resaleLogo}
              alt="Resale logo"
              className="h-9 w-auto object-contain shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                  Order #{order.id}
                </h1>
                {order.isSampleData && (
                  <span className="text-[10.5px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-secondary text-muted-foreground border border-border/60">
                    Sample / Demo Order
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Placed on {order.date} · Cash on Delivery Transaction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">{getOrderStatusBadge(order.orderStatus)}</div>
        </div>

        {/* Cancellation Notice if Cancelled */}
        {order.orderStatus === "CANCELLED" && order.cancellation && (
          <div className="border border-destructive/30 bg-destructive/5 p-4 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-destructive font-semibold">
              <XCircle className="size-4 shrink-0" />
              <span>Order Cancelled by {order.cancellation.actor}</span>
            </div>
            <p className="text-muted-foreground pl-5.5">
              Reason: <strong>{order.cancellation.reason}</strong> on{" "}
              {new Date(order.cancellation.timestamp).toLocaleString("en-GB")}.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="space-y-6">
            {/* Items Snapshot Card */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold">
                  Purchased Items &amp; Condition Snapshot
                </CardTitle>
                <CardDescription className="text-xs">
                  Listing data preserved as documented at time of order placement
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/40 text-xs">
                {order.items.map((item, i) => (
                  <div key={i} className="py-4 first:pt-3 last:pb-3 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="size-12 bg-muted border border-border/60 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="size-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{item.name}</p>
                          <div className="flex flex-wrap items-center gap-2 text-muted-foreground mt-1 text-[11px]">
                            <span className="font-medium text-foreground">Grade {item.grade}</span>
                            {item.conditionScore && <span>· Score: {item.conditionScore}/100</span>}
                            {item.sellerName && <span>· Seller: {item.sellerName}</span>}
                            {item.warrantyMonths ? (
                              <span>· {item.warrantyMonths} mo warranty</span>
                            ) : null}
                          </div>
                          {item.includedItems && item.includedItems.length > 0 && (
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Included: {item.includedItems.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-display font-bold text-sm text-foreground shrink-0">
                        {taka(item.price)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Totals Breakdown */}
                <div className="pt-4 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="text-foreground">{taka(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured Delivery Fee</span>
                    <span className="text-foreground">{taka(order.deliveryFee)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-{taka(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-display font-bold text-base text-foreground pt-2.5 border-t border-border/60">
                    <span>Total Amount</span>
                    <span className="text-primary">{taka(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Event Timeline */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold">
                  Order Lifecycle &amp; Event Timeline
                </CardTitle>
                <CardDescription className="text-xs">
                  Audited timeline of verified application events for this transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                {order.timeline && order.timeline.length > 0 ? (
                  <div className="relative pl-6 border-l-2 border-primary space-y-6 my-1 text-xs">
                    {order.timeline.map((evt, idx) => {
                      const isLast = idx === order.timeline.length - 1;
                      const dateStr = new Date(evt.timestamp).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div key={evt.id || idx} className="relative">
                          <div className="absolute -left-8.25 bg-background p-1">
                            {evt.type === "ORDER_CANCELLED" ? (
                              <XCircle className="size-4 text-destructive" />
                            ) : evt.type === "ORDER_DELIVERED" || evt.type === "ORDER_COMPLETED" ? (
                              <CheckCircle2 className="size-4 text-emerald-500 fill-emerald-500/20" />
                            ) : (
                              <CheckCircle2 className="size-4 text-primary fill-primary/20" />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p
                                className={`font-semibold text-sm ${isLast ? "text-primary" : "text-foreground"}`}
                              >
                                {evt.title}
                              </p>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                {dateStr}
                              </span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {evt.description}
                            </p>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block pt-0.5">
                              Logged by {evt.actor}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs">No timeline events recorded.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Delivery Info & Actions */}
          <div className="space-y-6">
            {/* Delivery Address Card */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 pt-3">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Recipient</span>
                  <span className="font-semibold text-foreground text-sm">
                    {order.shippingAddress?.name || order.buyerContact?.name}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Phone</span>
                  <span className="text-foreground">
                    {order.shippingAddress?.phone || order.buyerContact?.phone}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Address</span>
                  <span className="text-foreground">{order.shippingAddress?.address}</span>
                  <span className="text-muted-foreground block mt-0.5">
                    {order.shippingAddress?.district}, {order.shippingAddress?.division}
                  </span>
                </div>
                <div className="pt-2 border-t border-border/40 text-[11px] space-y-1">
                  <p>
                    <strong>Payment Method:</strong> {order.paymentMethod} (Cash on Delivery)
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span
                      className={
                        order.paymentStatus === "PAID"
                          ? "text-emerald-600 font-semibold"
                          : "text-amber-600 font-semibold"
                      }
                    >
                      {order.paymentStatus === "PAID"
                        ? "Paid / Settled"
                        : "Pending Doorstep Collection"}
                    </span>
                  </p>
                  <p>
                    <strong>Buyer NID Verified:</strong>{" "}
                    {order.buyerContact?.nidNumber || order.nidNumber || "Verified on registration"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Management Actions */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Order Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-3 text-xs">
                {isCancellable ? (
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      You can cancel this order while it is in pending or confirmed stage before
                      physical dispatch.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCancelModal(true)}
                      className="w-full text-destructive hover:bg-destructive/10 border-destructive/30"
                    >
                      <XCircle className="size-3.5 mr-1.5" /> Cancel This Order
                    </Button>
                  </div>
                ) : (
                  <div className="text-[11px] text-muted-foreground space-y-1">
                    {order.orderStatus === "CANCELLED" ? (
                      <p className="text-destructive font-medium">This order has been cancelled.</p>
                    ) : (
                      <p>
                        Cancellation is locked because the order has progressed past the
                        confirmation stage ({order.orderStatus}).
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Buyer Protection Card */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-primary" /> Buyer Protection &amp; Returns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-3 text-xs">
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Every device is protected by the Resale condition guarantee. If the physical item
                  received does not match the documented 32-point inspection report, you have a
                  48-hour return window.
                </p>
                <Button variant="outline" size="sm" asChild className="w-full text-xs">
                  <Link to="/account/disputes">
                    <AlertCircle className="size-3.5 mr-1.5 text-primary" /> Resolution &amp;
                    Disputes Center
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controlled Cancellation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-border/80 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-display font-bold text-destructive flex items-center gap-2">
                  <AlertTriangle className="size-5" /> Cancel Order #{order.id}
                </CardTitle>
                <CardDescription className="text-xs">
                  Please select a reason for cancelling this order. The seller will be notified.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCancelSubmit}>
                <CardContent className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Cancellation Reason</label>
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full border border-border bg-background px-3 py-2 text-xs rounded-none"
                    >
                      <option value="Change of mind">Change of mind</option>
                      <option value="Found alternative / better price">
                        Found alternative / better price
                      </option>
                      <option value="Incorrect shipping address entered">
                        Incorrect shipping address entered
                      </option>
                      <option value="Estimated delivery duration too long">
                        Estimated delivery duration too long
                      </option>
                      <option value="Other">Other reason</option>
                    </select>
                  </div>

                  {cancelReason === "Other" && (
                    <div className="space-y-1.5">
                      <label className="font-medium text-foreground">Please describe</label>
                      <input
                        type="text"
                        required
                        placeholder="Explain cancellation reason…"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-xs rounded-none"
                      />
                    </div>
                  )}

                  <div className="p-3 bg-destructive/5 border border-destructive/20 text-[11px] text-destructive leading-relaxed">
                    This action will update the order status to <strong>CANCELLED</strong> and
                    record this event in the transaction audit log.
                  </div>
                </CardContent>
                <div className="p-4 bg-muted/30 border-t border-border/60 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCancelModal(false)}
                    disabled={cancelling}
                  >
                    Keep Order
                  </Button>
                  <Button type="submit" variant="destructive" size="sm" disabled={cancelling}>
                    {cancelling ? "Cancelling…" : "Confirm Cancellation"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
