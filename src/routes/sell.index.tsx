import { createFileRoute, useNavigate } from "@tanstack/react-router";
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

export const Route = createFileRoute("/sell/")({
  head: () => ({
    meta: [{ title: "Create Listing | Resale.com" }],
  }),
  component: SellWizardPage,
});

function SellWizardPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((s) => s + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/seller/listings" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl px-5 py-10 w-full">
        <h1 className="text-3xl mb-2">Create a Listing</h1>
        <p className="text-muted-foreground mb-8">Step {step} of 4</p>

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
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="e.g. iPhone 15 Pro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iphone15pro">Apple iPhone 15 Pro (256GB)</SelectItem>
                      <SelectItem value="macbookm2">Apple MacBook Air M2</SelectItem>
                      <SelectItem value="s24">Samsung Galaxy S24 Ultra</SelectItem>
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
                <div className="space-y-2">
                  <Label>Overall Grade</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+ (Like New)</SelectItem>
                      <SelectItem value="A">A (Excellent)</SelectItem>
                      <SelectItem value="B">B (Good)</SelectItem>
                      <SelectItem value="C">C (Fair)</SelectItem>
                      <SelectItem value="D">D (Heavy Wear)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium">Component Checklist</h3>
                  <div className="space-y-2">
                    <Label>Screen Condition</Label>
                    <Input placeholder="e.g. Flawless, minor micro-scratches" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Battery Health %</Label>
                    <Input type="number" placeholder="e.g. 95" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Repairs / Replaced Parts</Label>
                    <Input placeholder="e.g. None, screen replaced by Apple" required />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit">Next Step</Button>
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
                  <Input type="number" placeholder="e.g. 85000" required />
                  <div className="bg-muted p-3 text-sm mt-2 rounded-md">
                    <span className="text-muted-foreground">Recommended Range: </span>
                    <span className="font-medium">৳82,000 - ৳88,000</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on condition A+ and active warranty.
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
                <Button type="submit">Review Listing</Button>
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
                  <h3 className="text-lg font-medium">Apple iPhone 15 Pro (256GB)</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Grade A+</span>
                    <span>৳85,000</span>
                    <span>Nationwide Delivery</span>
                  </div>
                  <p className="text-sm">
                    Includes original box and charging cable. Battery health is 95%. No scratches or
                    repairs.
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
