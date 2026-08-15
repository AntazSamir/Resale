import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "./admin.index";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/admin/identity")({
  head: () => ({
    meta: [{ title: "Identity Verification | Resale.com" }],
  }),
  component: AdminIdentityPage,
});

function AdminIdentityPage() {
  const pendingDocs = [
    {
      id: "ID-9921",
      user: "Rafiq Islam",
      type: "Seller",
      nidNumber: "199526920199201",
      submittedAt: "2 hours ago",
    },
    {
      id: "ID-9922",
      user: "Nusrat Jahan",
      type: "Buyer",
      nidNumber: "8890218392",
      submittedAt: "5 hours ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex gap-10">
        <AdminSidebar active="identity" />

        <div className="flex-1">
          <h1 className="text-3xl mb-2">Identity Verification (NID)</h1>
          <p className="text-muted-foreground mb-8">
            Review uploaded NID documents against provided numbers to verify accounts.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {pendingDocs.map((doc) => (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{doc.user}</CardTitle>
                      <p className="text-sm text-muted-foreground">{doc.type} Account</p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded">{doc.submittedAt}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">NID Number Provided:</p>
                    <p className="font-mono text-lg">{doc.nidNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="h-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      NID Front Image
                    </div>
                    <div className="h-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      NID Back Image
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 text-success border-success hover:bg-success/10"
                    >
                      <Check className="size-4 mr-2" /> Verify
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                    >
                      <X className="size-4 mr-2" /> Reject
                    </Button>
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
