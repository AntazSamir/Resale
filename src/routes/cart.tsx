import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  Trash2,
  Bookmark,
  ArrowRight,
  Shield,
  Truck,
  RotateCcw,
  CheckCircle2,
  Tag,
  Sparkles,
  Lock,
  ShoppingBag,
  Undo2,
  HelpCircle,
  Clock,
  Check,
  ChevronRight,
  Smartphone,
} from "lucide-react";
import {
  productFor,
  taka,
  listingFor,
  products,
  cheapest,
  gradeLabel,
  type Grade,
} from "@/data/catalog";
import { GradeBadge } from "@/components/grade-badge";
import { useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your Cart | Resale.com - Certified Pre-Owned Devices" }],
  }),
  component: CartPage,
});

const STANDARD_SHIPPING = 120;
const FREE_SHIPPING_THRESHOLD = 20000;
const CARE_PLUS_FEE = 499;

interface PromoCode {
  code: string;
  label: string;
  discountType: "flat" | "shipping";
  discountAmount: number;
  minSubtotal?: number;
}

const AVAILABLE_PROMOS: PromoCode[] = [
  {
    code: "RESALE500",
    label: "৳500 OFF",
    discountType: "flat",
    discountAmount: 500,
    minSubtotal: 10000,
  },
  {
    code: "DHAKAFREE",
    label: "Free Inspected Shipping",
    discountType: "shipping",
    discountAmount: STANDARD_SHIPPING,
  },
  {
    code: "EID1000",
    label: "৳1,000 OFF",
    discountType: "flat",
    discountAmount: 1000,
    minSubtotal: 30000,
  },
];

function CartPage() {
  const { items, removeFromCart, addToCart, subtotal } = useCart();

  // Add-ons & Promo states
  const [carePlusItems, setCarePlusItems] = useState<Record<string, boolean>>({});
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [savedForLater, setSavedForLater] = useState<string[]>([]);
  const [recentlyRemoved, setRecentlyRemoved] = useState<{ id: string; name: string } | null>(null);

  const cartItems = useMemo(() => {
    return items
      .map((item) => {
        const listing = listingFor(item.listingId);
        if (!listing) return null;
        const product = productFor(listing.productId);
        if (!product) return null;
        return { listing, product };
      })
      .filter(Boolean) as {
      listing: ReturnType<typeof listingFor> & {};
      product: ReturnType<typeof productFor> & {};
    }[];
  }, [items]);

  const savedItems = useMemo(() => {
    return savedForLater
      .map((listingId) => {
        const listing = listingFor(listingId);
        if (!listing) return null;
        const product = productFor(listing.productId);
        if (!product) return null;
        return { listing, product };
      })
      .filter(Boolean) as {
      listing: ReturnType<typeof listingFor> & {};
      product: ReturnType<typeof productFor> & {};
    }[];
  }, [savedForLater]);

  // Shipping calculation
  const isFreeShippingByThreshold = subtotal >= FREE_SHIPPING_THRESHOLD;
  const isFreeShippingByPromo = appliedPromo?.discountType === "shipping";
  const shippingFee =
    cartItems.length === 0
      ? 0
      : isFreeShippingByThreshold || isFreeShippingByPromo
        ? 0
        : STANDARD_SHIPPING;

  // Care+ fee calculation
  const activeCarePlusCount = Object.entries(carePlusItems).filter(([id, active]) => {
    return active && items.some((i) => i.listingId === id);
  }).length;
  const carePlusTotal = activeCarePlusCount * CARE_PLUS_FEE;

  // Promo discount calculation
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === "flat") {
      promoDiscount = appliedPromo.discountAmount;
    } else if (appliedPromo.discountType === "shipping") {
      promoDiscount = 0; // Already zeroed in shipping fee
    }
  }

  const finalTotal = Math.max(0, subtotal + shippingFee + carePlusTotal - promoDiscount);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyPromo = (codeToApply?: string) => {
    const target = (codeToApply || promoInput).trim().toUpperCase();
    setPromoError(null);

    const found = AVAILABLE_PROMOS.find((p) => p.code === target);
    if (!found) {
      setPromoError("Invalid promo voucher code.");
      return;
    }

    if (found.minSubtotal && subtotal < found.minSubtotal) {
      setPromoError(`Code ${target} requires a minimum order of ${taka(found.minSubtotal)}.`);
      return;
    }

    setAppliedPromo(found);
    setPromoInput("");
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const toggleCarePlus = (listingId: string) => {
    setCarePlusItems((prev) => ({
      ...prev,
      [listingId]: !prev[listingId],
    }));
  };

  const handleSaveForLater = (listingId: string) => {
    const item = cartItems.find((c) => c.listing.id === listingId);
    if (item) {
      removeFromCart(listingId);
      setSavedForLater((prev) => (prev.includes(listingId) ? prev : [...prev, listingId]));
    }
  };

  const handleMoveBackToCart = (listingId: string) => {
    addToCart(listingId);
    setSavedForLater((prev) => prev.filter((id) => id !== listingId));
  };

  const handleRemoveItem = (listingId: string, name: string) => {
    removeFromCart(listingId);
    setRecentlyRemoved({ id: listingId, name });
    setTimeout(() => {
      setRecentlyRemoved((current) => (current?.id === listingId ? null : current));
    }, 6000);
  };

  const handleUndoRemove = () => {
    if (recentlyRemoved) {
      addToCart(recentlyRemoved.id);
      setRecentlyRemoved(null);
    }
  };

  // Recommended products for empty or cross-sell
  const recommendedProducts = useMemo(() => {
    return products.slice(0, 4);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <SiteHeader />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Checkout Steps Indicator */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <span className="flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                1
              </span>
              <span>Review Cart</span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-primary/30" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="flex items-center justify-center size-6 rounded-full border border-border text-xs">
                2
              </span>
              <span className="hidden sm:inline">Identity & Address</span>
              <span className="sm:hidden">Address</span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="flex items-center justify-center size-6 rounded-full border border-border text-xs">
                3
              </span>
              <span>Escrow Payment</span>
            </div>
          </div>
        </div>

        {/* Undo Toast Notification */}
        {recentlyRemoved && (
          <div className="mb-6 p-4 bg-muted/90 backdrop-blur-md border border-border rounded-lg flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 text-sm">
              <span className="size-2 rounded-full bg-destructive" />
              <span>
                Removed <strong>{recentlyRemoved.name}</strong> from your cart.
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndoRemove}
              className="gap-1.5 h-8 font-medium text-primary hover:text-primary"
            >
              <Undo2 className="size-3.5" />
              Undo
            </Button>
          </div>
        )}

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 items-start">
            {/* Left Column: Cart Items & Promotions */}
            <div className="space-y-6">
              {/* Header Title & Item Count */}
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight">
                    Shopping Cart
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {cartItems.length} certified pre-owned{" "}
                    {cartItems.length === 1 ? "device" : "devices"} reserved for you
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Verified 32-Point Inspected</span>
                </div>
              </div>

              {/* Free Shipping Progress Alert */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <Truck className="size-4 text-primary" />
                    {isFreeShippingByThreshold ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="size-4 text-emerald-600" />
                        You've unlocked FREE Inspected Express Delivery!
                      </span>
                    ) : (
                      <span>
                        Add{" "}
                        <strong className="text-foreground">{taka(amountToFreeShipping)}</strong>{" "}
                        more to unlock{" "}
                        <strong className="text-primary">FREE Inspected Courier Delivery</strong>
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {progressPercent}%
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-primary/15" />
              </div>

              {/* Cart Item Cards */}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const hasCarePlus = !!carePlusItems[item.listing.id];
                  const retailEstimate = Math.round(item.listing.price * 1.32);
                  const savings = retailEstimate - item.listing.price;

                  return (
                    <Card
                      key={item.listing.id}
                      className="overflow-hidden border border-border/70 hover:border-border hover:shadow-sm transition-all duration-200"
                    >
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-5">
                          {/* Image Box */}
                          <div className="relative w-full sm:w-32 h-36 sm:h-32 shrink-0 bg-muted/50 rounded-lg overflow-hidden border border-border/50 group">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 sm:hidden">
                              <Badge variant="secondary" className="text-[10px] font-bold">
                                {gradeLabel[item.listing.grade as Grade] || item.listing.grade}
                              </Badge>
                            </div>
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              {/* Top Bar: Grade Badge, Brand, Price */}
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <div className="hidden sm:flex items-center gap-2 mb-1.5">
                                    <GradeBadge grade={item.listing.grade as Grade} size="sm" />
                                    <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                      {item.product.brand}
                                    </span>
                                  </div>
                                  <Link
                                    to="/listing/$listingId"
                                    params={{ listingId: item.listing.id }}
                                    className="text-base sm:text-lg font-semibold hover:text-primary transition-colors line-clamp-1"
                                  >
                                    {item.product.name}
                                  </Link>
                                </div>

                                <div className="text-right">
                                  <p className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                    {taka(item.listing.price)}
                                  </p>
                                  {savings > 0 && (
                                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                                      Save {taka(savings)} vs new
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Highlights & Seller Trust Info */}
                              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <Check className="size-3.5 text-emerald-600" />
                                  <span>Passed 32-Point Diagnostic Test</span>
                                </div>
                                <span className="text-border">•</span>
                                <div className="flex items-center gap-1">
                                  <span>Seller:</span>
                                  <strong className="text-foreground">
                                    {item.listing.seller.name}
                                  </strong>
                                  {item.listing.seller.verified && (
                                    <ShieldCheck className="size-3.5 text-emerald-600 inline" />
                                  )}
                                </div>
                                <span className="text-border">•</span>
                                <div className="flex items-center gap-1">
                                  <Clock className="size-3 text-muted-foreground" />
                                  <span>Dispatches in 24h</span>
                                </div>
                              </div>

                              {/* Protection Add-On Option */}
                              <div className="mt-4 pt-3 border-t border-border/60">
                                <label
                                  className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                                    hasCarePlus
                                      ? "bg-primary/5 border-primary/40 text-foreground"
                                      : "bg-muted/30 border-border/60 hover:bg-muted/60 text-muted-foreground"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={hasCarePlus}
                                    onChange={() => toggleCarePlus(item.listing.id)}
                                    className="mt-0.5 rounded border-border text-primary focus:ring-primary size-4"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                                        <Shield className="size-3.5 text-primary" />
                                        Resale Care+ Protection (6 Months)
                                      </span>
                                      <span className="font-semibold text-foreground">
                                        +{taka(CARE_PLUS_FEE)}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                      Covers display breakage, internal hardware defects & 100%
                                      replacement guarantee.
                                    </p>
                                  </div>
                                </label>
                              </div>
                            </div>

                            {/* Actions Bottom Bar */}
                            <div className="mt-4 pt-3 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  onClick={() => handleSaveForLater(item.listing.id)}
                                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors"
                                >
                                  <Bookmark className="size-3.5" />
                                  Save for later
                                </button>
                                <span className="text-border">|</span>
                                <div className="inline-flex items-center gap-1 text-muted-foreground">
                                  <RotateCcw className="size-3.5 text-emerald-600" />
                                  <span>7-day returns</span>
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10 text-xs font-medium"
                                onClick={() => handleRemoveItem(item.listing.id, item.product.name)}
                              >
                                <Trash2 className="size-3.5 mr-1.5" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Saved For Later Section */}
              {savedItems.length > 0 && (
                <div className="mt-10 pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Bookmark className="size-4 text-primary" />
                      Saved For Later ({savedItems.length})
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      Items reserved for consideration
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {savedItems.map((s) => (
                      <div
                        key={s.listing.id}
                        className="p-4 rounded-lg border border-border bg-card/60 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={s.product.image}
                            alt={s.product.name}
                            className="size-14 rounded object-cover bg-muted shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{s.product.name}</p>
                            <p className="text-xs font-bold text-primary mt-0.5">
                              {taka(s.listing.price)}
                            </p>
                            <span className="text-[10px] text-muted-foreground">
                              Grade {s.listing.grade} • {s.listing.seller.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs px-2.5"
                            onClick={() => handleMoveBackToCart(s.listing.id)}
                          >
                            Move to Cart
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[11px] text-muted-foreground hover:text-destructive px-2"
                            onClick={() =>
                              setSavedForLater((prev) => prev.filter((id) => id !== s.listing.id))
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Promo Code & Voucher Input */}
              <div className="p-5 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Have a Voucher or Discount Code?</h3>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. RESALE500 or DHAKAFREE"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    className="text-sm uppercase tracking-wider font-mono h-10"
                  />
                  <Button
                    type="button"
                    onClick={() => handleApplyPromo()}
                    className="h-10 px-5 font-medium shrink-0"
                  >
                    Apply
                  </Button>
                </div>

                {promoError && (
                  <p className="text-xs text-destructive flex items-center gap-1.5 font-medium">
                    <HelpCircle className="size-3.5" />
                    {promoError}
                  </p>
                )}

                {/* Available Quick Promos */}
                <div className="pt-2">
                  <span className="text-[11px] text-muted-foreground block mb-1.5">
                    Available vouchers for you (click to apply):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_PROMOS.map((p) => {
                      const isApplied = appliedPromo?.code === p.code;
                      return (
                        <button
                          key={p.code}
                          type="button"
                          onClick={() => handleApplyPromo(p.code)}
                          className={`text-xs px-2.5 py-1 rounded-md border transition-all flex items-center gap-1.5 ${
                            isApplied
                              ? "bg-emerald-600/10 border-emerald-500 text-emerald-700 font-semibold"
                              : "bg-muted/40 border-border hover:border-primary/50 text-foreground"
                          }`}
                        >
                          <span className="font-mono uppercase font-bold">{p.code}</span>
                          <span className="text-[10px] text-muted-foreground">({p.label})</span>
                          {isApplied && <Check className="size-3 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Order Summary & Trust Anchors */}
            <div className="space-y-6">
              <Card className="sticky top-20 border border-border shadow-sm overflow-hidden">
                <div className="bg-muted/40 p-5 border-b border-border/70">
                  <h2 className="text-lg font-semibold tracking-tight">Order Summary</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Inspected & packaged by Resale.com Hub
                  </p>
                </div>

                <CardContent className="p-5 space-y-5">
                  <div className="space-y-3 text-sm">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Items Subtotal</span>
                      <span className="font-medium">{taka(subtotal)}</span>
                    </div>

                    {/* Inspected Courier Delivery */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Inspected Delivery</span>
                        {shippingFee === 0 && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-emerald-600/10 text-emerald-700 border-emerald-200"
                          >
                            FREE
                          </Badge>
                        )}
                      </div>
                      <span
                        className={
                          shippingFee === 0 ? "text-emerald-700 font-semibold" : "font-medium"
                        }
                      >
                        {shippingFee === 0 ? "৳0" : taka(shippingFee)}
                      </span>
                    </div>

                    {/* Care+ Total */}
                    {carePlusTotal > 0 && (
                      <div className="flex justify-between items-center text-primary">
                        <span className="flex items-center gap-1">
                          <Shield className="size-3.5" />
                          Resale Care+ ({activeCarePlusCount}x)
                        </span>
                        <span className="font-semibold">+{taka(carePlusTotal)}</span>
                      </div>
                    )}

                    {/* Applied Promo Discount */}
                    {appliedPromo && (
                      <div className="flex justify-between items-center text-emerald-700 bg-emerald-500/10 p-2 rounded-md">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Tag className="size-3.5" />
                          <span>Voucher ({appliedPromo.code})</span>
                          <button
                            type="button"
                            onClick={handleRemovePromo}
                            className="text-muted-foreground hover:text-destructive ml-1 text-xs"
                          >
                            ×
                          </button>
                        </div>
                        <span className="font-bold text-xs">
                          -
                          {appliedPromo.discountType === "flat"
                            ? taka(appliedPromo.discountAmount)
                            : "Free Delivery"}
                        </span>
                      </div>
                    )}

                    <Separator className="my-2" />

                    {/* Grand Total */}
                    <div className="flex justify-between items-baseline pt-1">
                      <div>
                        <span className="font-semibold text-base">Total Amount</span>
                        <p className="text-[11px] text-muted-foreground">
                          All VAT & inspection fees included
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-2xl font-bold text-foreground">
                          {taka(finalTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout CTA Button */}
                  <Button
                    asChild
                    className="w-full h-12 text-base font-semibold shadow-md gap-2"
                    size="lg"
                  >
                    <Link to="/checkout">
                      <Lock className="size-4" />
                      Proceed to Checkout ({cartItems.length})
                      <ArrowRight className="size-4 ml-auto" />
                    </Link>
                  </Button>

                  {/* NID Notice */}
                  <div className="text-[11px] text-center text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/50">
                    🔒 Bangladesh National ID (NID) verification is required during checkout to
                    combat device fraud.
                  </div>

                  {/* Trust & Guarantee Badges */}
                  <div className="pt-2 space-y-3 border-t border-border/70 text-xs">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground block font-medium">
                          Buyer Escrow Protection
                        </strong>
                        <span className="text-muted-foreground text-[11px]">
                          Your payment is securely held until you inspect & accept the device.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <RotateCcw className="size-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground block font-medium">
                          7-Day Money-Back Guarantee
                        </strong>
                        <span className="text-muted-foreground text-[11px]">
                          Device doesn't match description? Full refund with zero hassle.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Truck className="size-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground block font-medium">
                          Insured Doorstep Delivery
                        </strong>
                        <span className="text-muted-foreground text-[11px]">
                          Delivered via dedicated courier with live tracking in 64 districts.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Supported Payment Icons */}
                  <div className="pt-2 border-t border-border/60">
                    <span className="text-[10px] text-muted-foreground block text-center mb-2">
                      Secure payment via bKash, Nagad, Cards & Cash on Inspection
                    </span>
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground/70">
                      <span className="px-2 py-1 bg-muted rounded border text-[10px]">bKash</span>
                      <span className="px-2 py-1 bg-muted rounded border text-[10px]">Nagad</span>
                      <span className="px-2 py-1 bg-muted rounded border text-[10px]">Rocket</span>
                      <span className="px-2 py-1 bg-muted rounded border text-[10px]">
                        Visa / MC
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center py-12 px-6 rounded-2xl border border-dashed border-border bg-card/50">
              <div className="size-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5 shadow-inner">
                <ShoppingBag className="size-10 stroke-[1.5]" />
              </div>
              <h2 className="text-2xl font-display font-semibold mb-2 text-foreground">
                Your shopping cart is empty
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Discover tested, verified, and certified pre-owned smartphones, laptops, and cameras
                backed by 32-point inspection and buyer escrow.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="gap-2 font-medium">
                  <Link to="/products">
                    <Smartphone className="size-4" />
                    Browse Certified Devices
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/categories">Explore Categories</Link>
                </Button>
              </div>
            </div>

            {/* Curated Recommendations for Empty Cart */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    Trending Certified Deals
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Popular refurbished devices hand-picked with verified inspection
                  </p>
                </div>
                <Link
                  to="/products"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View all catalog <ChevronRight className="size-3.5" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedProducts.map((prod) => {
                  const cheapestListing = cheapest(prod.id);
                  const minPrice = cheapestListing?.price ?? 0;
                  return (
                    <Card
                      key={prod.id}
                      className="group overflow-hidden border border-border/80 hover:border-primary/50 hover:shadow-md transition-all duration-300"
                    >
                      <div className="aspect-square bg-muted/60 overflow-hidden relative">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge
                          variant="secondary"
                          className="absolute top-2.5 left-2.5 text-[10px] uppercase font-bold tracking-wider"
                        >
                          {prod.brand}
                        </Badge>
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <h4 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {prod.name}
                        </h4>
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">
                              Starting from
                            </span>
                            <span className="font-display font-bold text-sm text-foreground">
                              {taka(minPrice)}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[10px] text-emerald-700 border-emerald-200"
                          >
                            Inspected
                          </Badge>
                        </div>
                        <Button
                          asChild
                          variant="secondary"
                          size="sm"
                          className="w-full text-xs mt-2 font-medium"
                        >
                          <Link to="/products" search={{ q: prod.name }}>
                            View Listings
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
