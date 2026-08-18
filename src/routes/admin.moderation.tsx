import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "./admin.index";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { taka } from "@/data/catalog";
import { ProtectedRoute } from "@/components/protected-route";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({
    meta: [{ title: "Listing Moderation | Resale.com" }],
  }),
  component: AdminModerationPage,
});

type Listing = {
  id: string;
  product: string;
  seller: string;
  price: number;
  grade: string;
  risk: string;
  reason: string;
};

function AdminModerationPage() {
  const [pendingListings, setPendingListings] = useState<Listing[]>([
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
      price: 45000,
      grade: "A",
      risk: "CRITICAL",
      reason: "Suspiciously low price (-45% below market)",
    },
  ]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actioned, setActioned] = useState<Record<string, "approved" | "rejected">>({});

  const approve = (id: string) => {
    setActioned((prev) => ({ ...prev, [id]: "approved" }));
    setTimeout(() => setPendingListings((prev) => prev.filter((l) => l.id !== id)), 800);
  };

  const reject = (id: string) => {
    setActioned((prev) => ({ ...prev, [id]: "rejected" }));
    setTimeout(() => setPendingListings((prev) => prev.filter((l) => l.id !== id)), 800);
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex gap-10">
          <AdminSidebar active="moderation" />

          <div className="flex-1">
            <h1 className="text-3xl mb-2">Listing Moderation Queue</h1>
            <p className="text-muted-foreground mb-8">
              Review and approve listings before they go live on the marketplace.
            </p>

            {pendingListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p className="text-lg font-medium">Queue is clear ✓</p>
                  <p className="text-sm mt-1">No listings pending review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingListings.map((l) => {
                  const action = actioned[l.id];
                  return (
                    <Card
                      key={l.id}
                      className={[
                        l.risk === "CRITICAL" ? "border-destructive" : "",
                        action === "approved" ? "opacity-50" : "",
                        action === "rejected" ? "opacity-50" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
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

                        {expanded === l.id && (
                          <div className="mb-6 p-4 bg-muted/50 rounded-md text-sm space-y-2 border">
                            <p><span className="font-medium">Seller:</span> {l.seller}</p>
                            <p><span className="font-medium">Listed Price:</span> {taka(l.price)}</p>
                            <p><span className="font-medium">Grade:</span> {l.grade}</p>
                            <p><span className="font-medium">Risk Level:</span> <Badge variant={l.risk === "CRITICAL" ? "destructive" : "secondary"}>{l.risk}</Badge></p>
                            <p><span className="font-medium">Flag Reason:</span> {l.reason}</p>
                          </div>
                        )}

                        {action ? (
                          <p className={`text-sm font-medium ${action === "approved" ? "text-success" : "text-destructive"}`}>
                            {action === "approved" ? "✓ Approved — going live shortly" : "✗ Rejected — seller will be notified"}
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-4 mt-6 border-t pt-6">
                            <Button
                              variant="outline"
                              className="text-success border-success hover:bg-success/10"
                              onClick={() => approve(l.id)}
                            >
                              <Check className="size-4 mr-2" /> Approve
                            </Button>
                            <Button
                              variant="outline"
                              className="text-destructive border-destructive hover:bg-destructive/10"
                              onClick={() => reject(l.id)}
                            >
                              <X className="size-4 mr-2" /> Reject
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                            >
                              {expanded === l.id ? (
                                <><ChevronUp className="size-4 mr-2" /> Hide Details</>
                              ) : (
                                <><ChevronDown className="size-4 mr-2" /> View Full Details</>
                              )}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
