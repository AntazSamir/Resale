import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, Truck, Clock, AlertCircle, UserCheck } from "lucide-react";
import { taka, listingFor, productFor } from "@/data/catalog";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-store";
import { ProtectedRoute } from "@/components/protected-route";
import {
  saveOrder,
  calculateOrderTotals,
  createOrderTimelineEvent,
  DEFAULT_DELIVERY_FEE,
  type OrderRecord,
  type OrderItemSnapshot,
} from "@/lib/order-store";
import { placeOrderFn } from "@/lib/server-functions";
import resaleLogo from "@/assets/resale-logo.svg";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout | Resale.com" }],
  }),
  component: CheckoutPageWrapper,
});

function generateOrderId() {
  return `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

function CheckoutPageWrapper() {
  return (
    <ProtectedRoute redirect="/checkout">
      <CheckoutPage />
    </ProtectedRoute>
  );
}

function CheckoutPage() {
  const [step, setStep] = useState<"address" | "identity" | "payment" | "success">("address");
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { user } = useAuth();

  const cartItems = items
    .map((item) => {
      const listing = listingFor(item.listingId);
      if (!listing) return null;
      const product = productFor(listing.productId);
      if (!product) return null;
      return { listing, product };
    })
    .filter(Boolean) as {
    listing: NonNullable<ReturnType<typeof listingFor>>;
    product: NonNullable<ReturnType<typeof productFor>>;
  }[];

  const totals = calculateOrderTotals({
    items: cartItems.map((c) => ({ price: c.listing.price, quantity: 1 })),
    deliveryFee: DEFAULT_DELIVERY_FEE,
  });

  // Address State (prefill from logged-in user if available)
  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    division: "Dhaka",
    district: "Dhaka",
    addressLine: "",
  });

  // Identity State
  const [nid, setNid] = useState("");

  useEffect(() => {
    if (user?.name) {
      setAddress((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("identity");
  };

  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || cartItems.length === 0) return;
    setSubmitting(true);
    const id = generateOrderId();
    setOrderId(id);

    // Full snapshot preservation of listing information
    const orderItems: OrderItemSnapshot[] = cartItems.map(({ listing, product }) => ({
      listingId: listing.id,
      productId: product.id,
      name: `${product.name} (Grade ${listing.grade})`,
      grade: listing.grade,
      conditionScore: listing.conditionScore,
      price: listing.price,
      image: product.image,
      sellerId:
        (listing as { sellerId?: string }).sellerId ||
        (listing.seller?.name
          ? `seller-${listing.seller.name.toLowerCase().replace(/\s+/g, "-")}`
          : undefined),
      sellerName: listing.seller.name,
      sellerDistrict: listing.seller.district,
      warrantyMonths: listing.warrantyMonths,
      accessories: listing.accessories,
      includedItems: listing.includedItems ?? undefined,
    }));

    const now = new Date().toISOString();

    const initialEvent = createOrderTimelineEvent(
      "ORDER_CREATED",
      "Order Placed (Cash on Delivery)",
      `Order #${id} placed by ${address.name} (${user?.phone || address.phone}). Payment of ${taka(totals.total)} is due in cash upon delivery and inspection.`,
      "BUYER",
      { total: totals.total, itemsCount: orderItems.length },
    );

    const effectiveBuyerId =
      user?.id || (address.phone ? `u-${address.phone.replace(/\D/g, "")}` : "u-admin");

    const newOrder: OrderRecord = {
      id,
      date: now.split("T")[0] || "",
      orderStatus: "PENDING",
      status: "PENDING",
      paymentStatus: "PENDING", // Correct: COD payment is pending until delivery
      paymentMethod: "COD",
      items: orderItems,
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      discount: totals.discount,
      total: totals.total,
      currency: "BDT",
      shippingAddress: {
        name: address.name,
        phone: address.phone,
        division: address.division,
        district: address.district,
        area: address.district,
        address: address.addressLine,
      },
      buyerId: effectiveBuyerId,
      buyerEmail: user?.email,
      buyerContact: {
        name: address.name,
        phone: address.phone,
        email: user?.email,
        buyerId: effectiveBuyerId,
        nidNumber: nid,
      },
      nidNumber: nid,
      timeline: [initialEvent],
      createdAt: now,
      updatedAt: now,
    };

    saveOrder(newOrder);

    // Notify server function and reserve all items atomically
    try {
      const allListingIds = cartItems.map((c) => c.listing.id);
      await placeOrderFn({
        data: {
          orderId: id,
          listingId: cartItems[0]?.listing.id,
          listingIds: allListingIds,
          buyerId: effectiveBuyerId,
          buyerEmail: user?.email,
          amount: totals.total,
          paymentMethod: "cod",
          shippingAddress: address,
          nidNumber: nid,
        },
      });
    } catch (err) {
      console.error("Server order sync notice:", err);
    }

    clearCart();
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-5">
          <Card className="w-full max-w-lg text-center border-border/80 shadow-md">
            <CardHeader className="space-y-3">
              <div className="flex justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center hover:opacity-90 transition-opacity"
                  aria-label="Resale Home"
                >
                  <img
                    src={resaleLogo}
                    alt="Resale logo"
                    className="h-8.5 w-auto object-contain shrink-0"
                  />
                </Link>
              </div>
              <div className="mx-auto bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-full w-fit">
                <CheckCircle2 className="size-8" />
              </div>
              <CardTitle className="text-2xl font-display font-bold">
                Order Placed Successfully!
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Your order <span className="font-mono font-bold text-foreground">#{orderId}</span>{" "}
                has been submitted to the seller for confirmation.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-left border-y border-border/60 py-4 bg-muted/20 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Account:</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <UserCheck className="size-3 text-emerald-500" />
                  {user?.name || address.name || "Verified Buyer"} (
                  {user?.phone || address.phone || "Doorstep Contact"})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-semibold text-foreground">Cash on Delivery (COD)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Status:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20">
                  Pending Delivery (Due on Doorstep)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order Status:</span>
                <span className="font-semibold text-foreground bg-secondary px-2 py-0.5 border border-border">
                  Pending Seller Confirmation
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Payable Amount:</span>
                <span className="font-display text-base font-bold text-primary">
                  {taka(totals.total)}
                </span>
              </div>

              <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground space-y-1">
                <p className="flex items-center gap-1.5">
                  <Clock className="size-3 text-primary shrink-0" />
                  <span>The seller will confirm availability within 24 hours.</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3 text-emerald-500 shrink-0" />
                  <span>48-hour return window activates upon doorstep delivery.</span>
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex-col sm:flex-row gap-3 pt-6">
              <Button
                onClick={() => navigate({ to: "/account/orders/$orderId", params: { orderId } })}
                className="w-full sm:flex-1 font-semibold"
              >
                Track Order &amp; Details
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/account/orders" })}
                className="w-full sm:flex-1"
              >
                View All My Orders
              </Button>
            </CardFooter>
          </Card>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-5xl px-5 py-8 sm:py-10 w-full grid lg:grid-cols-[1fr_350px] gap-8">
        {/* Checkout Form */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Checkout
            </h1>
            {user && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/80 px-3 py-1.5 border border-border/60">
                <UserCheck className="size-3.5 text-emerald-500 shrink-0" />
                <span>
                  Signed in as <strong>{user.name || user.phone}</strong>
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Step 1: Address */}
            <Card className={step !== "address" ? "opacity-60 border-border/60" : "border-border"}>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">1. Delivery Address</CardTitle>
                <CardDescription className="text-xs">
                  Where should we deliver your device?
                </CardDescription>
              </CardHeader>
              {step === "address" && (
                <CardContent>
                  <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Recipient Name</Label>
                        <Input
                          id="name"
                          required
                          placeholder="e.g. Tanvir Ahmed"
                          value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone Number (11-digit Bangladesh)</Label>
                        <Input
                          id="phone"
                          required
                          placeholder="e.g. 01712345678"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="division">Division</Label>
                        <Input
                          id="division"
                          required
                          value={address.division}
                          onChange={(e) => setAddress({ ...address, division: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          required
                          value={address.district}
                          onChange={(e) => setAddress({ ...address, district: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="addressLine">
                        Full Delivery Address (Street / House / Flat)
                      </Label>
                      <Input
                        id="addressLine"
                        required
                        placeholder="e.g. Road 11, House 45, Flat 4B, Banani"
                        value={address.addressLine}
                        onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto font-semibold">
                      Continue to Identity Verification
                    </Button>
                  </form>
                </CardContent>
              )}
            </Card>

            {/* Step 2: Identity */}
            <Card className={step !== "identity" ? "opacity-60 border-border/60" : "border-border"}>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">2. Identity Verification</CardTitle>
                <CardDescription className="text-xs">
                  Per marketplace safety standards, all buyers provide an NID number for high-value
                  secondhand electronics orders.
                </CardDescription>
              </CardHeader>
              {step === "identity" && (
                <CardContent>
                  <form onSubmit={handleIdentitySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nid">National ID (NID) Number</Label>
                      <Input
                        id="nid"
                        required
                        placeholder="10, 13 or 17 digit NID"
                        inputMode="numeric"
                        value={nid}
                        onChange={(e) => setNid(e.target.value.replace(/\D/g, ""))}
                      />
                      {nid && nid.length !== 10 && nid.length !== 13 && nid.length !== 17 && (
                        <p className="text-xs text-destructive">
                          NID must be exactly 10, 13, or 17 digits.
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setStep("address")}>
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={nid.length !== 10 && nid.length !== 13 && nid.length !== 17}
                        className="font-semibold"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>

            {/* Step 3: Payment */}
            <Card className={step !== "payment" ? "opacity-60 border-border/60" : "border-border"}>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">3. Payment Method</CardTitle>
                <CardDescription className="text-xs">
                  Select your payment method for this transaction
                </CardDescription>
              </CardHeader>
              {step === "payment" && (
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Active Payment Option */}
                    <div className="border-2 border-primary bg-primary/5 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                          <Truck className="size-4 text-primary" />
                          <span>Cash on Delivery (COD)</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-primary text-primary-foreground px-2 py-0.5">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Pay in cash upon doorstep delivery after inspecting package condition.
                        Payment is pending until delivery is completed.
                      </p>
                    </div>

                    {/* Notice regarding future payment methods */}
                    <div className="flex items-start gap-2 p-3 bg-secondary/40 border border-border/50 text-xs text-muted-foreground">
                      <AlertCircle className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                      <span>
                        Digital payment gateways (bKash, Nagad, Cards) and escrow protection are
                        currently in development for Phase 3.
                      </span>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setStep("identity")}>
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 font-semibold" disabled={submitting}>
                        {submitting ? "Placing order…" : `Place COD Order • ${taka(totals.total)}`}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <Card className="sticky top-24 border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              {cartItems.length > 0 ? (
                <div className="space-y-3 divide-y divide-border/40">
                  {cartItems.map((item) => (
                    <div
                      key={item.listing.id}
                      className="pt-2 first:pt-0 flex justify-between gap-2"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{item.product.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Grade {item.listing.grade} · Sold by {item.listing.seller.name}
                        </p>
                      </div>
                      <span className="font-medium text-foreground shrink-0">
                        {taka(item.listing.price)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-xs">No items in cart.</p>
              )}

              <div className="space-y-1.5 pt-3 border-t border-border/40 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-foreground">{taka(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Delivery</span>
                  <span className="text-foreground">{taka(totals.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border/60 font-display">
                  <span>Total Amount</span>
                  <span className="text-primary">{taka(totals.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
