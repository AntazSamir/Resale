import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { SellerSidebar } from "@/components/seller-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  AlertCircle,
  Clock,
  XCircle,
  UploadCloud,
  FileImage,
  User,
  CheckCircle2,
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { getMyVerificationStatusFn, submitSellerVerificationFn } from "@/lib/server-functions";
import { useAuth } from "@/lib/auth-store";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";

export const Route = createLazyFileRoute("/seller/account")({
  component: SellerAccountPage,
});

type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";

interface VerificationData {
  verificationStatus: VerificationStatus;
  verificationNote: string | null;
  nidDocUrl: string | null;
  selfieUrl: string | null;
  verificationReviewedAt: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

function SellerAccountPage() {
  const { token } = useAuth();
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [nidFile, setNidFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const fetchStatus = () => {
    if (!token) return;
    setLoading(true);
    getMyVerificationStatusFn({ data: { token } })
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.error ?? "Failed to load verification status.");
        }
      })
      .catch((err) => {
        setError(err.message ?? "Network error.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !nidFile) return;

    setSubmitting(true);
    try {
      const nidBase64 = await fileToBase64(nidFile);
      let selfieBase64 = undefined;
      if (selfieFile) {
        selfieBase64 = await fileToBase64(selfieFile);
      }

      const res = await submitSellerVerificationFn({
        data: {
          token,
          nidDocUrl: nidBase64,
          ...(selfieBase64 !== undefined && { selfieUrl: selfieBase64 }),
        },
      });

      if (res.success) {
        alert(res.message || "Submitted successfully!");
        setNidFile(null);
        setSelfieFile(null);
        fetchStatus();
      } else {
        alert(res.error || "Failed to submit documents.");
      }
    } catch (err: unknown) {
      alert("Error reading files or submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  const status = data?.verificationStatus ?? "UNVERIFIED";

  return (
    <ProtectedRoute redirect="/seller/account">
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <div className="border-b border-border bg-muted/30">
          <div className="container py-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link to="/seller/dashboard" className="hover:text-foreground">
              Seller Hub
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Account & Verification</span>
          </div>
        </div>

        <div className="flex-1 container py-8 flex flex-col md:flex-row gap-8">
          <SellerSidebar active="account" />

          <main className="flex-1 min-w-0 space-y-6">
            <div>
              <h1 className="text-2xl font-display font-bold">My Account & Verification</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your seller profile and identity verification status.
              </p>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader />
              </div>
            ) : error ? (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="py-8 text-center text-destructive">{error}</CardContent>
              </Card>
            ) : data ? (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                  {/* Status Banner */}
                  <Card
                    className={`overflow-hidden border ${
                      status === "VERIFIED"
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : status === "PENDING"
                          ? "border-amber-500/50 bg-amber-500/5"
                          : status === "REJECTED"
                            ? "border-destructive/50 bg-destructive/5"
                            : "border-border"
                    }`}
                  >
                    <CardContent className="p-6 flex items-start gap-4">
                      <div
                        className={`mt-0.5 size-10 rounded-full flex items-center justify-center shrink-0 ${
                          status === "VERIFIED"
                            ? "bg-emerald-500/20 text-emerald-600"
                            : status === "PENDING"
                              ? "bg-amber-500/20 text-amber-600"
                              : status === "REJECTED"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {status === "VERIFIED" && <ShieldCheck className="size-5" />}
                        {status === "PENDING" && <Clock className="size-5" />}
                        {status === "REJECTED" && <XCircle className="size-5" />}
                        {status === "UNVERIFIED" && <AlertCircle className="size-5" />}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold font-display">
                          {status === "VERIFIED" && "Your account is verified"}
                          {status === "PENDING" && "Verification pending review"}
                          {status === "REJECTED" && "Verification rejected"}
                          {status === "UNVERIFIED" && "Account unverified"}
                        </h2>
                        <p className="text-sm mt-1 text-muted-foreground/80">
                          {status === "VERIFIED" &&
                            "You have full access to marketplace features and your listings will display a Verified badge."}
                          {status === "PENDING" &&
                            "An administrator is reviewing your uploaded documents. This usually takes 24-48 hours."}
                          {status === "REJECTED" &&
                            "Your documents were not accepted. Please review the note below and resubmit."}
                          {status === "UNVERIFIED" &&
                            "Verify your identity to build trust with buyers and unlock premium seller features."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {status === "REJECTED" && data.verificationNote && (
                    <Card className="border-destructive/40 bg-destructive/10">
                      <CardHeader className="py-3 px-4 border-b border-destructive/20">
                        <CardTitle className="text-sm font-semibold text-destructive flex items-center gap-2">
                          <AlertCircle className="size-4" /> Admin Rejection Note
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 text-sm text-foreground">
                        {data.verificationNote}
                      </CardContent>
                    </Card>
                  )}

                  {/* Upload Form (only show if not verified and not pending) */}
                  {(status === "UNVERIFIED" || status === "REJECTED") && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Submit Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form
                          onSubmit={(e) => {
                            void handleSubmit(e);
                          }}
                          className="space-y-6"
                        >
                          <div className="space-y-3">
                            <label className="text-sm font-medium">
                              National ID (NID) Card <span className="text-destructive">*</span>
                            </label>
                            <p className="text-xs text-muted-foreground">
                              Please upload a clear photo of your NID card.
                            </p>
                            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/30 transition-colors">
                              <input
                                type="file"
                                id="nid"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => setNidFile(e.target.files?.[0] ?? null)}
                              />
                              <label
                                htmlFor="nid"
                                className="cursor-pointer flex flex-col items-center"
                              >
                                <FileImage className="size-8 text-muted-foreground mb-3" />
                                <span className="text-sm font-medium text-primary hover:underline">
                                  Choose a file
                                </span>
                                <span className="text-xs text-muted-foreground mt-1">
                                  {nidFile ? nidFile.name : "JPEG, PNG, WebP up to 5MB"}
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-sm font-medium">
                              Selfie or Business Document{" "}
                              <span className="text-muted-foreground">(Optional)</span>
                            </label>
                            <p className="text-xs text-muted-foreground">
                              A clear selfie holding your NID, or a trade license if you are a
                              business.
                            </p>
                            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/30 transition-colors">
                              <input
                                type="file"
                                id="selfie"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)}
                              />
                              <label
                                htmlFor="selfie"
                                className="cursor-pointer flex flex-col items-center"
                              >
                                <User className="size-8 text-muted-foreground mb-3" />
                                <span className="text-sm font-medium text-primary hover:underline">
                                  Choose a file
                                </span>
                                <span className="text-xs text-muted-foreground mt-1">
                                  {selfieFile ? selfieFile.name : "JPEG, PNG, WebP up to 5MB"}
                                </span>
                              </label>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={submitting || !nidFile}
                          >
                            {submitting ? "Uploading..." : "Submit for Verification"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {status === "VERIFIED" && (
                    <Card>
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="size-8" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">You're all set!</h3>
                          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                            Your identity has been verified by our team. Your listings now show a
                            trust badge to buyers, increasing your sales potential.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Sidebar Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Name</p>
                        <p className="font-medium">{data.name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Phone</p>
                        <p className="font-mono">{data.phone || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <p>{data.email || "—"}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ShieldCheck className="size-4 text-primary" /> Why verify?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                        <li>Builds trust with buyers and speeds up sales</li>
                        <li>Required for premium seller badges and featured listings</li>
                        <li>Enables secure payout methods</li>
                        <li>Protects our marketplace from fraud</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
          </main>
        </div>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
