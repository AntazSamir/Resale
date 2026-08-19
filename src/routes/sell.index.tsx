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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GradeSelector } from "@/components/grade-selector";
import { evaluateGrading, type GradingAnswers } from "@/data/grading";
import { saveGradedDraft } from "@/lib/grade-store";
import { taka } from "@/data/catalog";
import {
  Check,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Recycle,
  Building2,
  Mail,
  ArrowDown,
  Layers,
  Sparkles,
} from "lucide-react";
import resaleLogo from "@/assets/resale-logo.png";

export const Route = createFileRoute("/sell/")({
  head: () => ({
    meta: [{ title: "Sell with Us & Partner Program | Resale.com" }],
  }),
  component: SellWizardPage,
});

function SellWizardPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<GradingAnswers>({});
  const [productLabel, setProductLabel] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const grading = evaluateGrading(answers);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((s) => s + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    saveGradedDraft({
      productLabel: productLabel || "Untitled listing",
      price: Number(price) || 0,
      grade: grading.grade,
      conditionScore: grading.conditionScore,
      answers,
    });
    navigate({ to: "/seller/listings" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {/* ── Partner & Excess Inventory Section ── */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-5 py-14 space-y-12">
          {/* Main Hero Header */}
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <img
                  src={resaleLogo}
                  alt="Resale logo"
                  className="h-10 md:h-12 w-auto object-contain shrink-0"
                />
                <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                  RESALE
                </span>
              </Link>
            </div>
            <div className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Building2 className="size-3.5" />
              For Brands, Retailers &amp; Businesses
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground">
              Sell Your Excess &amp; Pre-Owned Inventory — Partner with Resale
            </h1>
            <p className="text-sm md:text-base text-subtle-foreground leading-relaxed">
              Are you a brand owner, authorized retailer, or business with excess, returned,
              open-box, or unsold electronics? Don’t let valuable inventory sit idle. Resale helps
              you turn unwanted stock into revenue through a trusted, structured resale marketplace
              in Bangladesh.
            </p>
          </div>

          {/* 4 Feature Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border p-6 bg-background space-y-2.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>Maximize Your Recovery</span>
              </div>
              <p className="text-xs md:text-sm text-subtle-foreground leading-relaxed">
                Get better value from your excess inventory by reaching value-conscious consumers
                directly through Resale. Turn unused, returned, or surplus electronics into revenue
                instead of letting them lose value in storage.
              </p>
            </div>

            <div className="border border-border p-6 bg-background space-y-2.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>Simple, Hassle-Free Selling</span>
              </div>
              <p className="text-xs md:text-sm text-subtle-foreground leading-relaxed">
                From listing and product verification to buyer discovery and order fulfillment,
                Resale is designed to make the selling process simple and transparent. Free up
                storage space while reducing the operational burden of managing unwanted inventory.
              </p>
            </div>

            <div className="border border-border p-6 bg-background space-y-2.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>Build Trust Through Transparency</span>
              </div>
              <p className="text-xs md:text-sm text-subtle-foreground leading-relaxed">
                Every product can be presented with structured specifications, condition grades,
                warranty information, invoice availability, and detailed product information,
                helping buyers make confident purchasing decisions.
              </p>
            </div>

            <div className="border border-border p-6 bg-background space-y-2.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>Support the Circular Economy</span>
              </div>
              <p className="text-xs md:text-sm text-subtle-foreground leading-relaxed">
                Give electronics a second life. By reselling quality products instead of letting
                them become waste, you help extend product lifecycles, reduce e-waste, and promote a
                more sustainable electronics ecosystem in Bangladesh.
              </p>
            </div>
          </div>

          {/* Built for electronics banner */}
          <div className="text-center py-2 space-y-1">
            <p className="font-display font-semibold text-lg text-foreground">
              Built for electronics. Designed for trust.
            </p>
            <p className="text-xs text-subtle-foreground">
              Join Resale and turn excess, returned, open-box, and like-new inventory into new
              opportunities.
            </p>
          </div>

          {/* ── Compact Highlight Card (Shorter, website-friendly version) ── */}
          <div className="border-2 border-[#ea580c] bg-orange-50/40 dark:bg-orange-950/20 p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ea580c]">
                  <Sparkles className="size-4 text-[#ea580c]" />
                  Turn Excess Inventory Into Revenue
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Have returned, excess, open-box, or unsold electronics sitting in your inventory?
                </h2>
                <p className="text-sm text-subtle-foreground">
                  Resale helps brands and authorized sellers reach consumers looking for quality
                  electronics at better prices.
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs md:text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-[#ea580c] shrink-0 stroke-3" />
                    <span>Recover more value from unwanted inventory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-[#ea580c] shrink-0 stroke-3" />
                    <span>Simplify your resale process with structured listings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-[#ea580c] shrink-0 stroke-3" />
                    <span>Build buyer confidence with transparent condition info</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-[#ea580c] shrink-0 stroke-3" />
                    <span>Give products a second life and reduce e-waste</span>
                  </li>
                </ul>

                <p className="text-xs md:text-sm font-medium text-foreground pt-1">
                  Your excess inventory shouldn&apos;t sit in a warehouse. Give it a second life
                  with Resale.
                </p>
              </div>

              {/* Bold Orange CTA Button */}
              <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
                <Link
                  to="/partner"
                  className="inline-flex items-center justify-center bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-base px-8 py-4 uppercase tracking-wider transition-colors border border-[#ea580c]"
                >
                  Become a Partner
                </Link>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Mail className="size-3 text-[#ea580c]" />
                  <span>📩 Direct partner desk: partners@resale.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Create Individual Listing Section ── */}
      <main id="create-listing" className="flex-1 mx-auto max-w-3xl px-5 py-12 w-full">
        <div className="mb-8 border-b border-border pb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Create a Listing</h2>
            <p className="text-sm text-muted-foreground mt-1">
              List individual items directly on the marketplace
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Step {step} of 4
          </p>
        </div>

        <Card>
          {step === 1 && (
            <form onSubmit={handleNext}>
              <CardHeader>
                <CardTitle>Product & Details</CardTitle>
                <CardDescription>What are you selling?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Search Product Catalog</Label>
                  <Select required value={productLabel} onValueChange={setProductLabel}>
                    <SelectTrigger>
                      <SelectValue placeholder="e.g. iPhone 15 Pro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apple iPhone 15 Pro (256GB)">
                        Apple iPhone 15 Pro (256GB)
                      </SelectItem>
                      <SelectItem value="Apple MacBook Air M2">Apple MacBook Air M2</SelectItem>
                      <SelectItem value="Samsung Galaxy S24 Ultra">
                        Samsung Galaxy S24 Ultra
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select an existing product to auto-fill specs.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Warranty Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warranty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active Manufacturer Warranty</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="none">No Warranty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Accessories Included</Label>
                  <Input placeholder="e.g. Original box, charging cable" required />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">Next Step</Button>
              </CardFooter>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext}>
              <CardHeader>
                <CardTitle>Condition Grading</CardTitle>
                <CardDescription>
                  Be honest. Our moderation team reviews every listing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <GradeSelector answers={answers} onChange={setAnswers} />
              </CardContent>
              <CardFooter className="justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={!grading.complete}>
                  Next Step
                </Button>
              </CardFooter>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleNext}>
              <CardHeader>
                <CardTitle>Media & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Upload Photos</Label>
                  <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Upload at least 4 photos (front, back, sides, screen on)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Selling Price (৳)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 85000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <div className="bg-muted p-3 text-sm mt-2 rounded-md">
                    <span className="text-muted-foreground">Recommended Range: </span>
                    <span className="font-medium">৳82,000 - ৳88,000</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on condition {grading.grade} and active warranty.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Delivery Options</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Nationwide Delivery & Local Pickup</SelectItem>
                      <SelectItem value="delivery">Nationwide Delivery Only</SelectItem>
                      <SelectItem value="pickup">Local Pickup Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Publishing…" : "Publish Listing"}
                </Button>
              </CardFooter>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Preview & Submit</CardTitle>
                <CardDescription>
                  Your listing will be reviewed by our moderation team before going live.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-6 rounded-md space-y-4">
                  <h3 className="text-lg font-medium">{productLabel || "Untitled listing"}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>Grade {grading.grade}</span>
                    <span>Condition score {grading.conditionScore}/100</span>
                    <span>{taka(Number(price) || 0)}</span>
                  </div>
                  <p className="text-sm">
                    The grade above is calculated from your answers to the standard grading
                    checklist and is stored with the listing.
                  </p>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    Note: Submitting will consume 1 Seller Credit.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button type="submit">Submit for Moderation</Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
