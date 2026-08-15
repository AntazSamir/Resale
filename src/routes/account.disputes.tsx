import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
            <form className="space-y-6">
              <div className="space-y-2">
                <Label>Select Order</Label>
                <Select>
                  <SelectTrigger>
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
                <Label>Reason for Dispute</Label>
                <Select>
                  <SelectTrigger>
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
                <Label>Detailed Explanation</Label>
                <Textarea
                  placeholder="Please describe exactly what doesn't match the condition report..."
                  className="min-h-30"
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
