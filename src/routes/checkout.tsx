import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2 } from "lucide-react";
import { taka, listingFor, productFor } from "@/data/catalog";
import { useCart } from "@/lib/cart-store";
import { saveOrder, type OrderRecord } from "@/lib/order-store";
import { placeOrderFn } from "@/lib/server-functions";
import resaleLogo from "@/assets/resale-logo.png";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout | Resale.com" }],
  }),
  component: CheckoutPage,
});

const SHIPPING = 120;

function generateOrderId() {
  return `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

function CheckoutPage() {
  const [step, setStep] = useState<"address" | "identity" | "payment" | "success">("address");
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();

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

  const total = subtotal + SHIPPING;

  // Address State
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    division: "",
    district: "",
    addressLine: "",
  });

  // Identity State
  const [nid, setNid] = useState("");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("cod");

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
    if (submitting) return;
    setSubmitting(true);
    const id = generateOrderId();
    setOrderId(id);

    const orderItems = cartItems.map(({ listing, product }) => ({
      listingId: listing.id,
      productId: product.id,
      name: `${product.name} (Grade ${listing.grade})`,
      grade: listing.grade,
      price: listing.price,
      image: product.image,
      sellerName: listing.seller.name,
    }));

    const newOrder: OrderRecord = {
      id,
      date: new Date().toISOString().split("T")[0] || "",
      status: "CONFIRMED",
      items: orderItems,
      subtotal,
      deliveryFee: SHIPPING,
      total,
      paymentMethod,
      shippingAddress: {
        name: address.name,
        phone: address.phone,
        division: address.division,
        district: address.district,
        area: address.district,
        address: address.addressLine,
      },
      nidNumber: nid,
      createdAt: new Date().toISOString(),
    };

    saveOrder(newOrder);

    // Also notify server function
    try {
      if (cartItems[0]) {
        await placeOrderFn({
          data: {
            orderId: id,
            listingId: cartItems[0].listing.id,
            amount: total,
            paymentMethod,
            shippingAddress: address,
            nidNumber: nid,
          },
        });
      }
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
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="flex justify-center mb-3">
                <Link to="/" className="inline-flex items-center gap-1">
                  <img
                    src={resaleLogo}
                    alt="Resale logo"
                    className="h-10 w-auto object-contain shrink-0"
                  />
                  <span className="font-display text-xl font-bold tracking-tight text-foreground">
                    RESALE
                  </span>
                </Link>
              </div>
              <div className="mx-auto bg-success/10 p-3 rounded-full mb-3 w-fit">
                <CheckCircle2 className="size-8 text-success" />
              </div>
              <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
              <CardDescription>
                Your order #{orderId} has been confirmed. The seller will ship your item soon.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex-col gap-3">
              <Button
                onClick={() => navigate({ to: "/account/orders/$orderId", params: { orderId } })}
                className="w-full"
              >
                View Order Details
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/account/orders" })}
                className="w-full"
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
      <main className="flex-1 mx-auto max-w-5xl px-5 py-10 w-full grid lg:grid-cols-[1fr_350px] gap-10">
        {/* Checkout Form */}
        <div>
          <h1 className="text-3xl mb-8">Checkout</h1>

          <div className="space-y-6">
            {/* Step 1: Address */}
            <Card className={step !== "address" ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle>1. Delivery Address</CardTitle>
              </CardHeader>
              {step === "address" && (
                <CardContent>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Recipient Name</Label>
                        <Input
                          id="name"
                          required
                          value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          required
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="division">Division</Label>
                        <Input
                          id="division"
                          required
                          value={address.division}
                          onChange={(e) => setAddress({ ...address, division: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          required
                          value={address.district}
                          onChange={(e) => setAddress({ ...address, district: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine">Full Address</Label>
                      <Input
                        id="addressLine"
                        required
                        value={address.addressLine}
                        onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                      />
                    </div>
                    <Button type="submit">Continue to Identity Verification</Button>
                  </form>
                </CardContent>
              )}
            </Card>

            {/* Step 2: Identity */}
            <Card className={step !== "identity" ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle>2. Identity Verification</CardTitle>
                <CardDescription>
                  Per marketplace safety rules, all buyers must provide an NID number for high-value
                  orders.
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
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep("address")}>
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={nid.length !== 10 && nid.length !== 13 && nid.length !== 17}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>

            {/* Step 3: Payment */}
            <Card className={step !== "payment" ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle>3. Payment Method</CardTitle>
              </CardHeader>
              {step === "payment" && (
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 border p-4 rounded-md">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          Cash on Delivery (COD)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border p-4 rounded-md">
                        <RadioGroupItem value="bkash" id="bkash" />
                        <Label htmlFor="bkash" className="flex-1 cursor-pointer">
                          bKash
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border p-4 rounded-md">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          Credit / Debit Card
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep("identity")}>
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={submitting}>
                        {submitting ? "Placing order…" : `Place Order • ${taka(total)}`}
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
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.listing.id} className="flex justify-between">
                      <span className="text-muted-foreground">1× {item.product.name}</span>
                      <span>{taka(item.listing.price)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-xs">No items in cart.</p>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{taka(SHIPPING)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{taka(total)}</span>
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
