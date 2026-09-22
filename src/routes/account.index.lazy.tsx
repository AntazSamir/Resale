import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import {
  ShieldCheck,
  Clock,
  XCircle,
  Upload,
  FileCheck2,
  Package,
  UserRound,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import {
  getMyVerificationFn,
  saveVerificationProfileFn,
  uploadVerificationDocumentFn,
  submitVerificationFn,
  type VerificationDocType,
  type VerificationRequest,
  type VerificationStatus,
} from "@/lib/verification.functions";

export const Route = createLazyFileRoute("/account/")({
  component: AccountPage,
});

const REQUIRED_DOCS: Array<{ type: VerificationDocType; label: string; help: string }> = [
  { type: "NID_FRONT", label: "NID — front side", help: "Clear photo, all four corners visible." },
  { type: "NID_BACK", label: "NID — back side", help: "Make sure the text is readable." },
  {
    type: "SELFIE_WITH_NID",
    label: "Selfie holding your NID",
    help: "Your face and the card in one photo.",
  },
];

const OPTIONAL_DOCS: Array<{ type: VerificationDocType; label: string; help: string }> = [
  {
    type: "TRADE_LICENSE",
    label: "Trade licence (shops)",
    help: "Only if you sell as a registered business.",
  },
  { type: "UTILITY_BILL", label: "Address proof", help: "Recent electricity or gas bill." },
];

function statusMeta(status: VerificationStatus) {
  switch (status) {
    case "APPROVED":
      return {
        label: "Verified seller",
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        icon: ShieldCheck,
        note: "Your identity has been checked by our team. Your listings show the verified badge.",
      };
    case "PENDING":
      return {
        label: "Under review",
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        icon: Clock,
        note: "We are checking your documents. This usually takes less than 24 hours.",
      };
    case "REJECTED":
      return {
        label: "Needs changes",
        className: "bg-red-500/10 text-red-600 border-red-500/20",
        icon: XCircle,
        note: "Fix the points below and send your documents again.",
      };
    default:
      return {
        label: "Not verified",
        className: "bg-muted text-muted-foreground border-border",
        icon: AlertTriangle,
        note: "Send your ID documents to sell as a verified seller.",
      };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

function AccountPage() {
  return (
    <ProtectedRoute redirect="/account">
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto w-full max-w-5xl px-5 py-10">
          <AccountContent />
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}

function AccountContent() {
  const { token } = useAuth() as { token?: string };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<VerificationDocType | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [request, setRequest] = useState<VerificationRequest | null>(null);
  const [status, setStatus] = useState<VerificationStatus>("NOT_STARTED");
  const [account, setAccount] = useState<{
    name: string | null;
    phone: string | null;
    email: string | null;
    role: string;
    verified: boolean;
  } | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    district: "",
    address: "",
    businessName: "",
    nidLast4: "",
  });

  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const applyRequest = useCallback((req: VerificationRequest | null) => {
    setRequest(req);
    if (req) {
      setStatus(req.status);
      setForm({
        fullName: req.fullName,
        phone: req.phone,
        email: req.email ?? "",
        district: req.district,
        address: req.address,
        businessName: req.businessName ?? "",
        nidLast4: req.nidLast4 ?? "",
      });
    }
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getMyVerificationFn({ data: { token } });
      if (!res.success) {
        setMessage({ kind: "error", text: res.error ?? "Could not load your account." });
        return;
      }
      setAccount(res.account);
      setStatus(res.status);
      applyRequest(res.request);
      if (!res.request) {
        setForm((f) => ({
          ...f,
          fullName: res.account.name ?? "",
          phone: res.account.phone ?? "",
          email: res.account.email ?? "",
        }));
      }
    } catch {
      setMessage({ kind: "error", text: "Could not load your account. Please try again." });
    } finally {
      setLoading(false);
    }
  }, [token, applyRequest]);

  useEffect(() => {
    void load();
  }, [load]);

  const locked = status === "APPROVED" || status === "PENDING";

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await saveVerificationProfileFn({
        data: {
          token,
          profile: {
            fullName: form.fullName,
            phone: form.phone,
            email: form.email || undefined,
            district: form.district,
            address: form.address,
            businessName: form.businessName || undefined,
            nidLast4: form.nidLast4 || undefined,
          },
        },
      });
      if (!res.success) {
        setMessage({ kind: "error", text: res.error });
        return;
      }
      applyRequest(res.request);
      setMessage({ kind: "ok", text: "Details saved." });
    } catch {
      setMessage({ kind: "error", text: "Could not save your details." });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(docType: VerificationDocType, file: File) {
    if (!token) return;
    setUploading(docType);
    setMessage(null);
    try {
      const dataBase64 = await fileToBase64(file);
      const res = await uploadVerificationDocumentFn({
        data: {
          token,
          docType,
          fileName: file.name,
          mimeType: file.type,
          dataBase64,
        },
      });
      if (!res.success) {
        setMessage({ kind: "error", text: res.error });
        return;
      }
      applyRequest(res.request);
      setMessage({ kind: "ok", text: "Document uploaded." });
    } catch {
      setMessage({ kind: "error", text: "Upload failed. Try a smaller file." });
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit() {
    if (!token) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await submitVerificationFn({ data: { token } });
      if (!res.success) {
        setMessage({ kind: "error", text: res.error });
        return;
      }
      applyRequest(res.request);
      setMessage({ kind: "ok", text: "Sent for review. We will get back to you shortly." });
    } catch {
      setMessage({ kind: "error", text: "Could not send your documents." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader />
      </div>
    );
  }

  const meta = statusMeta(status);
  const StatusIcon = meta.icon;
  const uploadedTypes = new Set((request?.documents ?? []).map((d) => d.docType));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight flex items-center gap-2">
            <UserRound className="size-7 text-primary" />
            My Account
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {account?.name || account?.phone || "Your Resale account"} · {account?.role ?? "BUYER"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`gap-1.5 ${meta.className}`}>
            <StatusIcon className="size-3.5" />
            {meta.label}
          </Badge>
          <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
            <Link to="/account/orders">
              <Package className="size-3.5" /> My Orders
            </Link>
          </Button>
        </div>
      </div>

      {message && (
        <p
          className={`text-sm rounded-md border px-3 py-2 ${
            message.kind === "ok"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
              : "border-destructive/20 bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" /> Verification status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">{meta.note}</p>
          {status === "REJECTED" && request?.reviewNote && (
            <p className="text-destructive text-sm">Reviewer note: {request.reviewNote}</p>
          )}
          {request?.submittedAt && (
            <p className="text-xs text-muted-foreground">
              Submitted {new Date(request.submittedAt).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Your details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name (as on NID)</Label>
            <Input
              id="fullName"
              value={form.fullName}
              disabled={locked}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              value={form.phone}
              disabled={locked}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              disabled={locked}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={form.district}
              disabled={locked}
              placeholder="Dhaka"
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              rows={2}
              value={form.address}
              disabled={locked}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="businessName">Shop name (optional)</Label>
            <Input
              id="businessName"
              value={form.businessName}
              disabled={locked}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nidLast4">Last 4 digits of NID</Label>
            <Input
              id="nidLast4"
              inputMode="numeric"
              maxLength={4}
              value={form.nidLast4}
              disabled={locked}
              onChange={(e) => setForm({ ...form, nidLast4: e.target.value })}
            />
            <p className="text-[11px] text-muted-foreground">
              We never show your full NID number anywhere on the site.
            </p>
          </div>
          <div className="sm:col-span-2">
            <Button onClick={handleSave} disabled={locked || saving} size="sm">
              {saving ? "Saving…" : "Save details"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Identity documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...REQUIRED_DOCS, ...OPTIONAL_DOCS].map((doc) => {
            const uploaded = (request?.documents ?? []).find((d) => d.docType === doc.type);
            const isRequired = REQUIRED_DOCS.some((r) => r.type === doc.type);
            return (
              <div
                key={doc.type}
                className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between rounded-md border border-border/60 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium flex items-center gap-2">
                    {doc.label}
                    {isRequired && (
                      <span className="text-[10px] uppercase text-muted-foreground">required</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{doc.help}</p>
                  {uploaded && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                      <FileCheck2 className="size-3.5" />
                      {uploaded.fileName} · {(uploaded.sizeBytes / 1024).toFixed(0)} KB
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  <input
                    ref={(el) => {
                      fileInputs.current[doc.type] = el;
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUpload(doc.type, file);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    disabled={locked || uploading !== null}
                    onClick={() => fileInputs.current[doc.type]?.click()}
                  >
                    <Upload className="size-3.5" />
                    {uploading === doc.type
                      ? "Uploading…"
                      : uploadedTypes.has(doc.type)
                        ? "Replace"
                        : "Upload"}
                  </Button>
                </div>
              </div>
            );
          })}
          <p className="text-[11px] text-muted-foreground">
            Documents are stored privately and only our verification team can open them.
          </p>
        </CardContent>
      </Card>

      {status !== "APPROVED" && (
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleSubmit} disabled={status === "PENDING" || saving}>
            {status === "PENDING" ? "Waiting for review" : "Send for verification"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Our team checks every seller before listings get the verified badge.
          </p>
        </div>
      )}
    </div>
  );
}
