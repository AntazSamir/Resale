import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "./admin.index";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle } from "lucide-react";
import { taka } from "@/data/catalog";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({
    meta: [{ title: "Listing Moderation | Resale.com" }],
  }),
  component: AdminModerationPage,
});

function AdminModerationPage() {
  const pendingListings = [
    {
      id: "LST-8829",
      product: "Apple iPhone 15 Pro (256GB)",
      seller: "Rafiq Islam",
      price: 85000,
      grade: "A+",
      risk: "MEDIUM",
      reason: "New seller account",
    },
    {
      id: "LST-8830",
      product: "Samsung Galaxy S24 Ultra",
      seller: "Tanvir Hasan",
      price: 45000, // suspiciously low
      grade: "A",
      risk: "CRITICAL",
      reason: "Suspiciously low price (-45% below market)",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex gap-10">
        <AdminSidebar active="moderation" />

        <div className="flex-1">
          <h1 className="text-3xl mb-2">Listing Moderation Queue</h1>
          <p className="text-muted-foreground mb-8">
            Review and approve listings before they go live on the marketplace.
          </p>

          <div className="space-y-4">
            {pendingListings.map((l) => (
              <Card key={l.id} className={l.risk === "CRITICAL" ? "border-destructive" : ""}>
                <CardHeader className="bg-muted/50 py-4 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{l.product}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Listing {l.id} by {l.seller}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl">{taka(l.price)}</p>
                    <p className="text-sm font-medium">Grade {l.grade}</p>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {l.risk !== "LOW" && (
                    <div className="flex items-start gap-3 bg-destructive/10 text-destructive p-3 rounded-md mb-6">
                      <AlertTriangle className="size-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Risk Flag: {l.risk}</p>
                        <p className="text-sm">{l.reason}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 mt-6 border-t pt-6">
                    <Button
                      variant="outline"
                      className="text-success border-success hover:bg-success/10"
                    >
                      <Check className="size-4 mr-2" /> Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      <X className="size-4 mr-2" /> Reject
                    </Button>
                    <Button variant="secondary">View Full Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
