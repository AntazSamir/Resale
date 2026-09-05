import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SellerSidebar } from "./seller.dashboard";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import { getStoreByOwnerId } from "@/lib/store-store";
import {
  parseCsvText,
  validateImportBatch,
  commitValidImportRows,
  ImportValidationReport,
} from "@/lib/bulk-importer";
import { ImportDropzone } from "@/components/inventory/import-dropzone";
import { ImportPreviewTable } from "@/components/inventory/import-preview-table";
import {
  UploadCloud,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Store,
  List,
} from "lucide-react";

export const Route = createFileRoute("/seller/inventory/import")({
  head: () => ({
    meta: [{ title: "Bulk Inventory Import | Seller Hub · Resale.com" }],
  }),
  component: SellerBulkImportPage,
});

function SellerBulkImportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sellerId = user?.id || (user?.phone ? `seller-${user.phone}` : "");

  // Check if seller has a storefront
  const store = sellerId ? getStoreByOwnerId(sellerId) : null;

  const [fileName, setFileName] = useState("");
  const [report, setReport] = useState<ImportValidationReport | null>(null);
  const [committedCount, setCommittedCount] = useState<number | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);

  const handleFileLoaded = (csvText: string, name: string) => {
    setFileName(name);
    setCommittedCount(null);
    const parsedRows = parseCsvText(csvText);
    const validationReport = validateImportBatch(parsedRows);
    setReport(validationReport);
  };

  const handleCommit = () => {
    if (!report || report.validRowsCount === 0) return;
    setIsCommitting(true);

    setTimeout(() => {
      const validRows = report.rows.filter((r) => r.isValid);
      const count = commitValidImportRows(validRows, store?.id, store?.name);
      setCommittedCount(count);
      setIsCommitting(false);
      setReport(null);
    }, 400);
  };

  const handleReset = () => {
    setReport(null);
    setFileName("");
    setCommittedCount(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 w-full flex gap-8">
          <SellerSidebar active="bulk-import" />

          <div className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                  <UploadCloud className="size-4" />
                  <span>Pro Inventory Ingestion</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  Bulk CSV Inventory Importer
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload spreadsheets of pre-owned electronics. Batch validate against master
                  catalog and condition grades.
                </p>
              </div>

              {store?.slug && (
                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Link to="/store/$storeSlug" params={{ storeSlug: store.slug }} target="_blank">
                    <Store className="size-3.5" />
                    <span>View Store Inventory</span>
                    <ExternalLink className="size-3" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Post-Commit Success Notification */}
            {committedCount !== null && (
              <Card className="border-emerald-500/30 bg-emerald-500/10">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                    <span>
                      Successfully imported {committedCount}{" "}
                      {committedCount === 1 ? "unit" : "units"} into active inventory!
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    All valid items have been created with diagnostic specifications and assigned to
                    your storefront.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button asChild size="sm" className="text-xs">
                      <Link to="/seller/listings">
                        <List className="size-3.5 mr-1.5" />
                        <span>Manage in My Listings</span>
                      </Link>
                    </Button>
                    {store?.slug && (
                      <Button asChild variant="outline" size="sm" className="text-xs">
                        <Link to="/store/$storeSlug" params={{ storeSlug: store.slug }}>
                          <span>Browse Live Storefront</span>
                        </Link>
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="text-xs ml-auto"
                    >
                      Upload Another Batch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Workflow Step */}
            {!report && committedCount === null && (
              <ImportDropzone onFileLoaded={handleFileLoaded} />
            )}

            {report && (
              <ImportPreviewTable
                report={report}
                fileName={fileName}
                onCommit={handleCommit}
                onReset={handleReset}
                isCommitting={isCommitting}
              />
            )}
          </div>
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
