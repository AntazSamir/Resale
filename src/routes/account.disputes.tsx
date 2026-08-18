import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/account/disputes")({
  head: () => ({
    meta: [{ title: "Report an Issue | Resale.com" }],
  }),
  component: DisputesPage,
});

function DisputesPage() {
  const [order, setOrder] = useState("");
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !reason) {
      setError("Please select an order and a reason for the dispute.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-2xl px-5 py-10 w-full">
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <div className="mx-auto bg-success/10 p-3 rounded-full w-fit">
                <CheckCircle2 className="size-8 text-success" />
              </div>
              <h2 className="text-xl font-semibold">Dispute Submitted</h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Your dispute for order <strong>{order}</strong> has been received. Our team will
                review within 24 hours and contact you.
              </p>
              <Button asChild className="mt-4">
                <Link to="/account/orders">Back to Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-2xl px-5 py-10 w-full">
        <h1 className="text-3xl mb-8">Report an Issue</h1>

        <Card>
          <CardHeader>
            <CardTitle>File a Return or Dispute</CardTitle>
            <CardDescription>
              You have 48 hours after delivery to report condition mismatches. Please provide clear
              evidence (photos/video) for the admin team to review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-md">
                  {error}
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="order-select">Select Order</Label>
                <Select value={order} onValueChange={setOrder}>
                  <SelectTrigger id="order-select">
                    <SelectValue placeholder="Choose a delivered order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ORD-71204">
                      ORD-71204 - Dell Ultrasharp 27 Monitor
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason-select">Reason for Dispute</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger id="reason-select">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="condition">Not as described (Condition mismatch)</SelectItem>
                    <SelectItem value="damaged">Damaged in transit</SelectItem>
                    <SelectItem value="defective">Defective / DOA</SelectItem>
                    <SelectItem value="missing">Missing accessory</SelectItem>
                    <SelectItem value="counterfeit">Suspected counterfeit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">Detailed Explanation</Label>
                <Textarea
                  id="explanation"
                  placeholder="Please describe exactly what doesn't match the condition report..."
                  className="min-h-30"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Evidence</Label>
                <div className="border-2 border-dashed border-border rounded-md p-6 text-center text-sm text-muted-foreground">
                  <p>Click or drag files here to upload</p>
                  <p className="mt-1 text-xs">JPG, PNG, or MP4 up to 50MB</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button type="button" variant="outline" asChild>
                  <Link to="/account/orders">Cancel</Link>
                </Button>
                <Button type="submit">Submit Dispute</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
