import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SellerSidebar } from "./seller.dashboard";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import { getStores, getStoreByOwnerId, saveStore, isSlugAvailable } from "@/lib/store-store";
import { Storefront } from "@/data/storefront";
import {
  Store,
  ShieldCheck,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Clock,
  RefreshCw,
  Phone,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/seller/storefront")({
  head: () => ({
    meta: [{ title: "Storefront Settings | Seller Hub · Resale.com" }],
  }),
  component: SellerStorefrontPage,
});

function SellerStorefrontPage() {
  const { user } = useAuth();
  const sellerId = user?.id || (user?.phone ? `seller-${user.phone}` : "seller-me");

  const [store, setStore] = useState<Storefront | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [warrantyPolicy, setWarrantyPolicy] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [facebook, setFacebook] = useState("");

  useEffect(() => {
    const existing = getStoreByOwnerId(sellerId);
    if (existing) {
      setStore(existing);
      setName(existing.name);
      setSlug(existing.slug);
      setTagline(existing.tagline || "");
      setDescription(existing.description || "");
      setDistrict(existing.district || "Dhaka");
      setArea(existing.area || "");
      setAddress(existing.address || "");
      setPhone(existing.phone || "");
      setEmail(existing.email || "");
      setBusinessHours(existing.businessHours || "");
      setReturnPolicy(existing.returnPolicy || "");
      setWarrantyPolicy(existing.warrantyPolicy || "");
      setLogoUrl(existing.logoUrl || "");
      setBannerUrl(existing.bannerUrl || "");
      setWhatsapp(existing.socialLinks?.whatsapp || "");
      setFacebook(existing.socialLinks?.facebook || "");
    } else {
      setStore(null);
      setName(user?.name ? `${user.name}'s Store` : "");
      const autoSlug = user?.name
        ? user.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : "";
      setSlug(autoSlug);
      setTagline("");
      setDescription("");
      setDistrict("Dhaka");
      setArea("");
      setAddress("");
      setPhone(user?.phone || "");
      setEmail(user?.email || "");
      setBusinessHours("");
      setReturnPolicy("");
      setWarrantyPolicy("");
      setLogoUrl("");
      setBannerUrl("");
      setWhatsapp("");
      setFacebook("");
    }
  }, [sellerId, user?.name, user?.phone, user?.email]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!store) {
      // Auto generate slug if new store
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(autoSlug);
      if (autoSlug) {
        setSlugError(isSlugAvailable(autoSlug) ? null : "This store handle/slug is already taken.");
      }
    }
  };

  const handleSlugChange = (val: string) => {
    const cleanSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "")
      .replace(/--+/g, "-");
    setSlug(cleanSlug);
    if (cleanSlug) {
      setSlugError(isSlugAvailable(cleanSlug, store?.id) ? null : "This handle is already taken.");
    } else {
      setSlugError("Slug cannot be empty.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!slug.trim() || slugError) return;

    const storeId = store?.id || `store-${slug}-${Date.now().toString(36)}`;
    const updatedStore: Storefront = {
      id: storeId,
      ownerId: sellerId,
      name: name.trim(),
      slug: slug.trim(),
      tagline: tagline.trim() || undefined,
      description: description.trim() || undefined,
      district: district.trim() || "Dhaka",
      area: area.trim() || undefined,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      businessHours: businessHours.trim() || undefined,
      returnPolicy: returnPolicy.trim() || undefined,
      warrantyPolicy: warrantyPolicy.trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
      bannerUrl: bannerUrl.trim() || undefined,
      verified: store?.verified ?? false, // Remains false unless verified by admin
      rating: store?.rating ?? 5.0,
      totalSales: store?.totalSales ?? 0,
      socialLinks: {
        whatsapp: whatsapp.trim() || undefined,
        facebook: facebook.trim() || undefined,
      },
      createdAt: store?.createdAt || new Date().toISOString(),
    };

    saveStore(updatedStore);
    setStore(updatedStore);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 w-full flex gap-8">
          <SellerSidebar active="storefront" />

          <div className="flex-1 min-w-0 space-y-6">
            {/* Header & Preview button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                  <Store className="size-4" />
                  <span>Pro Merchant Storefront</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  Storefront Settings
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure your branded shop page, physical address, and custom warranty terms.
                </p>
              </div>

              {slug && !slugError && (
                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Link to="/store/$storeSlug" params={{ storeSlug: slug }} target="_blank">
                    <span>View Public Store</span>
                    <ExternalLink className="size-3.5" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Saved Notification */}
            {savedSuccess && (
              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                <span>
                  Storefront settings saved successfully. Live changes are published to /store/
                  {slug}.
                </span>
              </div>
            )}

            {/* Verification Status Banner */}
            <Card className="border-border bg-card">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                      store?.verified
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">
                        {store?.verified ? "Official Verified Pro Store" : "Standard Storefront"}
                      </span>
                      {store?.verified ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                          Active Verification
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          Pending Physical Trade Verification
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {store?.verified
                        ? "Your trade license and physical outlet have been authenticated by Resale Moderation."
                        : "Verified Pro Store badge is awarded after submitting shop trade license & physical address proof."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Form */}
            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Brand Info */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold">Brand &amp; Identity</CardTitle>
                  <CardDescription className="text-xs">
                    How your shop appears to buyers across Bangladesh.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="store-name" className="text-xs font-semibold">
                        Shop Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="store-name"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Apple Vault Banani"
                        required
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="store-slug" className="text-xs font-semibold">
                        Store Handle (URL Slug) <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex items-center">
                        <span className="px-3 py-2 bg-muted border border-r-0 border-border text-muted-foreground text-xs rounded-l-md font-mono">
                          resale.com/store/
                        </span>
                        <Input
                          id="store-slug"
                          value={slug}
                          onChange={(e) => handleSlugChange(e.target.value)}
                          placeholder="apple-vault"
                          required
                          className="rounded-l-none text-xs font-mono"
                        />
                      </div>
                      {slugError && (
                        <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="size-3" />
                          <span>{slugError}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="store-tagline" className="text-xs font-semibold">
                      Tagline / Catchphrase
                    </Label>
                    <Input
                      id="store-tagline"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Dhaka's Premier Graded Apple & Premium Tech Outlet"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="store-desc" className="text-xs font-semibold">
                      Shop Bio &amp; Specialty
                    </Label>
                    <Textarea
                      id="store-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your shop history, testing methodology, and warranty promises..."
                      rows={3}
                      className="text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="logo-url" className="text-xs font-semibold">
                        Logo Image URL
                      </Label>
                      <Input
                        id="logo-url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://.../logo.jpg"
                        className="text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="banner-url" className="text-xs font-semibold">
                        Banner Cover Image URL
                      </Label>
                      <Input
                        id="banner-url"
                        value={bannerUrl}
                        onChange={(e) => setBannerUrl(e.target.value)}
                        placeholder="https://.../banner.jpg"
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Physical Location & Hours */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold">Location &amp; Operations</CardTitle>
                  <CardDescription className="text-xs">
                    Help local buyers find your physical retail outlet.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="district" className="text-xs font-semibold">
                        District <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Dhaka"
                        required
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="area" className="text-xs font-semibold">
                        Area / Commercial Hub
                      </Label>
                      <Input
                        id="area"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. Banani, Elephant Road, GEC"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-semibold">
                      Full Physical Address
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Shop 408, Level 4, Multiplan Center, Elephant Road"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hours" className="text-xs font-semibold">
                      Business Hours
                    </Label>
                    <Input
                      id="hours"
                      value={businessHours}
                      onChange={(e) => setBusinessHours(e.target.value)}
                      placeholder="e.g. Saturday – Thursday: 10:30 AM – 8:30 PM"
                      className="text-xs"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Store Policies & Contacts */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold">
                    Policies &amp; Direct Support
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Custom warranty commitments and customer service channels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold">
                        Store Contact Phone
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+880 1711-234567"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="whatsapp" className="text-xs font-semibold">
                        WhatsApp Number for Buyers
                      </Label>
                      <Input
                        id="whatsapp"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+8801711234567"
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="warranty" className="text-xs font-semibold">
                      Shop Warranty Terms
                    </Label>
                    <Textarea
                      id="warranty"
                      value={warrantyPolicy}
                      onChange={(e) => setWarrantyPolicy(e.target.value)}
                      placeholder="e.g. 30-day in-house replacement warranty on logic board & display for Grade A+ units."
                      rows={2}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="return-policy" className="text-xs font-semibold">
                      Return &amp; Dispute Policy
                    </Label>
                    <Textarea
                      id="return-policy"
                      value={returnPolicy}
                      onChange={(e) => setReturnPolicy(e.target.value)}
                      placeholder="e.g. Standard 48-Hour Resale Platform Buyer Protection applies. Full exchange if specs differ."
                      rows={2}
                      className="text-xs"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="submit" className="gap-2 text-xs font-semibold px-6">
                  <Save className="size-4" />
                  <span>Save Storefront Settings</span>
                </Button>
              </div>
            </form>
          </div>
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
