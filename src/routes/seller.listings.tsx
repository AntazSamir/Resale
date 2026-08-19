import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SellerSidebar } from "./seller.dashboard";
import { Badge } from "@/components/ui/badge";
import { taka, listings } from "@/data/catalog";
import { GradeBadge } from "@/components/grade-badge";
import { readGradedDrafts, type GradedDraft } from "@/lib/grade-store";
import { answerLabel, gradingCriteria } from "@/data/grading";
import { ProtectedRoute } from "@/components/protected-route";

export const Route = createFileRoute("/seller/listings")({
  head: () => ({
    meta: [{ title: "My Listings | Resale.com" }],
  }),
  component: SellerListingsPage,
});

function SellerListingsPage() {
  // Use mock listings
  const myListings = listings.slice(0, 3);
  const [drafts, setDrafts] = useState<GradedDraft[]>([]);

  useEffect(() => {
    setDrafts(readGradedDrafts());
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex gap-10">
          <SellerSidebar active="listings" />

          <div className="flex-1">
            <h1 className="text-3xl mb-8">My Listings</h1>

            <div className="space-y-4">
              {drafts.map((draft) => {
                const dCategory = draft.answers["category"] ?? "";
                const dProductName = draft.answers["productName"] ?? draft.productLabel;
                const dDescription = draft.answers["description"] ?? "";
                const dWarranty = draft.answers["warranty"] ?? "";
                const dAccessories = draft.answers["accessoriesIncluded"] ?? "";

                const warrantyLabel: Record<string, string> = {
                  active: "Active Manufacturer Warranty",
                  expired: "Expired",
                  none: "No Warranty",
                };

                return (
                  <Card key={draft.id}>
                    <CardHeader className="bg-muted/30 py-4 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Pending Review</Badge>
                        {dCategory && (
                          <Badge variant="secondary" className="text-xs">
                            {dCategory}
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">ID: {draft.id}</span>
                      </div>
                      <div className="font-display font-medium text-lg">{taka(draft.price)}</div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base leading-tight">{dProductName}</p>
                          {dDescription && (
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                              {dDescription}
                            </p>
                          )}
                        </div>
                        <GradeBadge grade={draft.grade} />
                      </div>

                      {/* Key specs row */}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="bg-muted rounded px-2 py-0.5">
                          Score {draft.conditionScore}/100
                        </span>
                        {dWarranty && (
                          <span className="bg-muted rounded px-2 py-0.5">
                            {warrantyLabel[dWarranty] ?? dWarranty}
                          </span>
                        )}
                        {dAccessories && (
                          <span className="bg-muted rounded px-2 py-0.5">{dAccessories}</span>
                        )}
                      </div>

                      {/* Grading breakdown */}
                      <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2 text-xs border-t border-border pt-3">
                        {gradingCriteria.map((c) => (
                          <div
                            key={c.id}
                            className="flex justify-between gap-3 border-b border-border/60 py-1"
                          >
                            <dt className="text-muted-foreground">{c.label}</dt>
                            <dd className="text-right">
                              {answerLabel(
                                c.id,
                                draft.answers[c.id],
                                draft.answers["repairsDetail"],
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </CardContent>
                  </Card>
                );
              })}

              {myListings.map((listing) => (
                <Card key={listing.id}>
                  <CardHeader className="bg-muted/50 py-4 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={listing.grade === "A+" ? "default" : "secondary"}>
                        Approved
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Listing ID: {listing.id}
                      </span>
                    </div>
                    <div className="font-display font-medium text-lg">{taka(listing.price)}</div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <GradeBadge grade={listing.grade} />
                        </div>
                        <p className="font-medium">Score: {listing.conditionScore}/100</p>
                        <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                          {listing.sellerNote}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Draft Mock */}
              <Card className="opacity-70 border-dashed border-2">
                <CardHeader className="bg-muted/30 py-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Pending Review</Badge>
                    <span className="text-sm text-muted-foreground">Submitted 2 hours ago</span>
                  </div>
                  <div className="font-display font-medium text-lg">{taka(95000)}</div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <GradeBadge grade="A" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                        Sony PlayStation 5 Console (Disc Edition)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
