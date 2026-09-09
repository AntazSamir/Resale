import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PackageOpen, Clock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [{ title: "Product Management | Admin Console | Resale.com" }],
  }),
  component: DeferredAdminModule,
});

function DeferredAdminModule() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminShell active="products">
        <div className="space-y-6 max-w-4xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
              <PackageOpen className="size-8 text-primary" />
              Product Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              This module is reserved for a future implementation phase.
            </p>
          </div>

          <Card className="border-dashed border-2 bg-muted/30">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-muted p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Clock className="size-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">Not Implemented Yet</CardTitle>
              <CardDescription className="max-w-md mx-auto mt-2">
                The backend infrastructure for the <strong>Product Management</strong> module does
                not yet exist in the current marketplace architecture.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <p className="text-sm text-muted-foreground mb-4">
                We strictly adhere to the Core Data-Truth Rule. Fake data, mock CRUD systems, and
                fabricated statistics are not permitted.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full">
                <AlertCircle className="size-3.5" />
                No backend data fabricated
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}
