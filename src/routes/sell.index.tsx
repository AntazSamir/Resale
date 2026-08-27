import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
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
  UploadCloud,
  Image as ImageIcon,
  X,
  Plus,
} from "lucide-react";
import resaleLogo from "@/assets/resale-logo.svg";

export const Route = createFileRoute("/sell/")({
  head: () => ({
    meta: [{ title: "Sell with Us & Partner Program | Resale.com" }],
  }),
  component: SellWizardPage,
});

type UploadedPhoto = {
  id: string;
  name: string;
  url: string;
  size: number;
};

function SellWizardPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<GradingAnswers>({});
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [warranty, setWarranty] = useState("");
  const [accessories, setAccessories] = useState("");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step1Touched, setStep1Touched] = useState(false);
  const navigate = useNavigate();
  const grading = evaluateGrading(answers);

  const repairNeedsDetail =
    answers["repairs"] === "official" || answers["repairs"] === "third-party";
  const repairsComplete = !repairNeedsDetail || Boolean(answers["repairsDetail"]?.trim());

  // All 5 Step 1 fields must be filled
  const step1Valid =
    category.trim() !== "" &&
    productName.trim() !== "" &&
    description.trim() !== "" &&
    warranty !== "" &&
    accessories !== "";

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newPhotos: UploadedPhoto[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep1Touched(true);
      if (!step1Valid) return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    saveGradedDraft({
      productLabel: productName || category || "Untitled listing",
      price: Number(price) || 0,
      grade: grading.grade,
      conditionScore: grading.conditionScore,
      answers: {
        ...answers,
        category,
        productName,
        description,
        warranty,
        accessoriesIncluded: accessories,
      },
    });
    navigate({ to: "/seller/listings" });
  };

  return (
    <ProtectedRoute redirect="/sell">
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />

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
                  {/* Category */}
                  <div className="space-y-2">
                    <Label>
                      Product Category <span className="text-destructive">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger
                        className={
                          step1Touched && !category ? "border-destructive ring-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Smartphones">Smartphones</SelectItem>
                        <SelectItem value="Laptops & MacBooks">Laptops & MacBooks</SelectItem>
                        <SelectItem value="Cameras & Photography">Cameras & Photography</SelectItem>
                        <SelectItem value="Audio & Headphones">Audio & Headphones</SelectItem>
                        <SelectItem value="Tablets & iPads">Tablets & iPads</SelectItem>
                        <SelectItem value="Smartwatches & Wearables">
                          Smartwatches & Wearables
                        </SelectItem>
                        <SelectItem value="Gaming Consoles">Gaming Consoles</SelectItem>
                        <SelectItem value="Accessories & Chargers">
                          Accessories & Chargers
                        </SelectItem>
                        <SelectItem value="Home Products & Appliances">
                          Home Products & Appliances
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {step1Touched && !category && (
                      <p className="text-xs text-destructive">Please select a category.</p>
                    )}
                  </div>

                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label>
                      Product Name / Model <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. Apple iPhone 15 Pro (256GB) Natural Titanium"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className={step1Touched && !productName.trim() ? "border-destructive" : ""}
                    />
                    {step1Touched && !productName.trim() ? (
                      <p className="text-xs text-destructive">Product name is required.</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Include the brand, model, storage, or color for clarity.
                      </p>
                    )}
                  </div>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <Label>
                      Short Description / Seller Note <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      placeholder="e.g. Purchased 6 months ago, battery health 92%, always used with a protective case and screen protector. Fully functional."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className={step1Touched && !description.trim() ? "border-destructive" : ""}
                    />
                    {step1Touched && !description.trim() ? (
                      <p className="text-xs text-destructive">Please add a short description.</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Describe usage history, condition highlights, or reason for selling.
                      </p>
                    )}
                  </div>

                  {/* Warranty Status */}
                  <div className="space-y-2">
                    <Label>
                      Warranty Status <span className="text-destructive">*</span>
                    </Label>
                    <Select value={warranty} onValueChange={setWarranty}>
                      <SelectTrigger
                        className={step1Touched && !warranty ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select warranty status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active Manufacturer Warranty</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="none">No Warranty</SelectItem>
                      </SelectContent>
                    </Select>
                    {step1Touched && !warranty && (
                      <p className="text-xs text-destructive">Please select warranty status.</p>
                    )}
                  </div>

                  {/* Accessories Included */}
                  <div className="space-y-2">
                    <Label>
                      Accessories Included <span className="text-destructive">*</span>
                    </Label>
                    <Select value={accessories} onValueChange={setAccessories}>
                      <SelectTrigger
                        className={step1Touched && !accessories ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select accessories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Box and all original accessories">
                          Box and all original accessories
                        </SelectItem>
                        <SelectItem value="Some original accessories">
                          Some original accessories
                        </SelectItem>
                        <SelectItem value="Device only">Device only</SelectItem>
                      </SelectContent>
                    </Select>
                    {step1Touched && !accessories && (
                      <p className="text-xs text-destructive">
                        Please select accessories included.
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-end gap-2">
                  {step1Touched && !step1Valid && (
                    <p className="text-xs text-destructive self-start">
                      Please fill in all required fields before continuing.
                    </p>
                  )}
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
                  <Button type="submit" disabled={!grading.complete || !repairsComplete}>
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Upload Photos</Label>
                      <span className="text-xs text-muted-foreground">
                        {photos.length} {photos.length === 1 ? "photo" : "photos"} added
                      </span>
                    </div>

                    {/* Drag & Drop Upload Dropzone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handlePhotoUpload(e.dataTransfer.files);
                      }}
                      className={`border-2 border-dashed p-6 text-center transition-colors bg-background ${
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-foreground/40"
                      }`}
                    >
                      <UploadCloud className="size-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        Drag and drop your photos here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload photos showing front, back, sides, and screen on (PNG, JPG, WEBP)
                      </p>

                      <label className="mt-4 inline-flex items-center gap-2 border border-primary bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider px-4 py-2 cursor-pointer hover:opacity-90 transition-opacity">
                        <ImageIcon className="size-3.5" />
                        <span>Choose Photos</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e.target.files)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Photo checklist helper badges */}
                    <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground">Recommended:</span>
                      <span className="border border-border px-2 py-0.5 bg-muted/40">
                        1. Front View
                      </span>
                      <span className="border border-border px-2 py-0.5 bg-muted/40">
                        2. Back Panel
                      </span>
                      <span className="border border-border px-2 py-0.5 bg-muted/40">
                        3. Sides &amp; Ports
                      </span>
                      <span className="border border-border px-2 py-0.5 bg-muted/40">
                        4. Screen Turned On
                      </span>
                    </div>

                    {/* Uploaded Photos Grid */}
                    {photos.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                          Uploaded Photos ({photos.length})
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {photos.map((photo, i) => (
                            <div
                              key={photo.id}
                              className="relative group border border-border bg-muted/20 overflow-hidden"
                            >
                              <img
                                src={photo.url}
                                alt={photo.name}
                                className="h-28 w-full object-cover"
                              />
                              <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                #{i + 1}
                              </div>
                              <button
                                type="button"
                                onClick={() => removePhoto(photo.id)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground size-5 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity shadow"
                                title="Remove photo"
                              >
                                <X className="size-3 stroke-2" />
                              </button>
                              <div className="p-1.5 bg-background/95 border-t border-border">
                                <p className="text-[11px] truncate font-medium text-foreground">
                                  {photo.name}
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* Add more button */}
                          <label className="border-2 border-dashed border-border hover:border-foreground/40 flex flex-col items-center justify-center h-28 cursor-pointer transition-colors bg-muted/10 hover:bg-muted/30">
                            <Plus className="size-5 text-muted-foreground mb-1" />
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              Add More
                            </span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e.target.files)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    )}
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
                  <Button type="submit">Next Step</Button>
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
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-6 rounded-md space-y-4">
                    {category && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {category}
                      </p>
                    )}
                    <h3 className="text-lg font-semibold">{productName || "Untitled listing"}</h3>
                    {description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground border-t border-border pt-3">
                      <span className="font-medium text-foreground">Grade {grading.grade}</span>
                      <span>·</span>
                      <span>Score {grading.conditionScore}/100</span>
                      <span>·</span>
                      <span className="font-medium text-foreground">
                        {taka(Number(price) || 0)}
                      </span>
                    </div>

                    {photos.length > 0 && (
                      <div className="space-y-2 border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Attached Photos ({photos.length})
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {photos.map((p, i) => (
                            <img
                              key={p.id}
                              src={p.url}
                              alt={`Preview ${i + 1}`}
                              className="size-16 object-cover rounded border border-border shrink-0"
                            />
                          ))}
                        </div>
                      </div>
                    )}
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
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Submitting…" : "Submit for Moderation"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </main>

        {/* ── Partner & Excess Inventory Section ── */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-5xl px-5 py-14 space-y-12">
            {/* Main Hero Header */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-2">
                <Link
                  to="/"
                  className="inline-flex items-center hover:opacity-90 transition-opacity"
                  aria-label="Resale Home"
                >
                  <img
                    src={resaleLogo}
                    alt="Resale logo"
                    className="h-8 md:h-9 w-auto object-contain shrink-0"
                  />
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
                you turn unwanted stock into revenue through a trusted, structured resale
                marketplace in Bangladesh.
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
                  directly through Resale. Turn unused, returned, or surplus electronics into
                  revenue instead of letting them lose value in storage.
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
                  storage space while reducing the operational burden of managing unwanted
                  inventory.
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
                  them become waste, you help extend product lifecycles, reduce e-waste, and promote
                  a more sustainable electronics ecosystem in Bangladesh.
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
                    Have returned, excess, open-box, or unsold electronics sitting in your
                    inventory?
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
                    <span>📩 Direct partner desk: asr.resale@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
