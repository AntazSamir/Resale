import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  Check,
  CheckCircle2,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
  Send,
  AlertCircle,
  Package,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import resaleLogo from "@/assets/resale-logo.png";
import Lanyard from "@/components/lanyard/Lanyard";
import partnerCardImg from "@/assets/lanyard/partner-card.png";
import lanyardStripImg from "@/assets/lanyard/lanyard-strip.jpg";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Partner with Resale | Turn Excess Inventory Into Revenue" },
      {
        name: "description",
        content:
          "Apply for the Resale B2B Partner Program. Turn excess, returned, open-box, refurbished, or pre-owned electronics inventory into revenue across Bangladesh.",
      },
    ],
  }),
  component: PartnerPage,
});

export default function PartnerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    businessTypes: [] as string[],
    businessTypeOther: "",
    partnerInterests: [] as string[],
    partnerInterestOther: "",
    productCategories: [] as string[],
    productCategoryOther: "",
    brands: "",
    inventoryTypes: [] as string[],
    inventoryTypeOther: "",
    averagePrice: "",
    monthlyUnits: "",
    inventoryValue: "",
    inventoryConditions: [] as string[],
    hasInvoices: "",
    hasWarranty: "",
    supplyFrequency: "",
    companyName: "",
    companyType: "",
    companyTypeOther: "",
    yearEstablished: "",
    website: "",
    socialPage: "",
    tradeLicense: "",
    hasETIN: "",
    etinNumber: "",
    hasBIN: "",
    binNumber: "",
    brandAuthorization: "",
    division: "",
    district: "",
    area: "",
    handoverPreference: "",
    contactName: "",
    designation: "",
    designationOther: "",
    mobile: "",
    whatsapp: "",
    email: "",
    partnerGoals: [] as string[],
    partnerGoalOther: "",
    creatorPlatforms: [] as string[],
    creatorHandle: "",
    details: "",
    confirmAccuracy: false,
    confirmContact: false,
  });

  const handleCheckboxToggle = (
    field:
      | "businessTypes"
      | "partnerInterests"
      | "productCategories"
      | "inventoryTypes"
      | "inventoryConditions"
      | "partnerGoals"
      | "creatorPlatforms",
    value: string,
  ) => {
    setFormData((prev) => {
      const current = prev[field];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    setUploadedFiles((prev) => [...prev, ...names]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirmAccuracy || !formData.confirmContact) {
      alert("Please confirm the verification and agreement checkboxes before submitting.");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const divisions = [
    "Dhaka",
    "Chattogram",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Rangpur",
    "Mymensingh",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {/* ── Hero Banner with 3D Lanyard hanging from secondary nav ── */}
      <section className="border-b border-border bg-card" style={{ overflow: 'visible' }}>
        <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column (7 cols): Content & Highlights */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <img
                    src={resaleLogo}
                    alt="Resale logo"
                    className="h-8 md:h-9 w-auto object-contain shrink-0"
                  />
                  <span className="font-display text-xl font-bold tracking-tight text-foreground">
                    RESALE
                  </span>
                </Link>
                <div className="inline-flex items-center gap-1.5 border border-[#ea580c]/30 bg-[#ea580c]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                  <Building2 className="size-3.5" />
                  Official B2B Partner Program
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.1]">
                Turn Your Excess &amp; Pre-Owned Inventory Into Guaranteed Revenue
              </h1>

              <p className="text-sm md:text-base text-subtle-foreground leading-relaxed">
                Are you an authorized brand, distributor, retailer, refurbisher, or professional
                seller in Bangladesh? Partner with Resale to instantly access thousands of verified
                buyers nationwide, backed by 48-hour escrow protection and automated diagnostics.
              </p>

              {/* Value Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="border border-border/80 bg-background p-3 space-y-1">
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <ShieldCheck className="size-3.5" /> Verified ID
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Official Resale Partner badge &amp; credentials
                  </p>
                </div>
                <div className="border border-border/80 bg-background p-3 space-y-1">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> 64 Districts
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Doorstep pickup &amp; nationwide courier reach
                  </p>
                </div>
                <div className="border border-border/80 bg-background p-3 space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Sparkles className="size-3.5" /> Same-Day
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Bulk ingestion &amp; swift payout settlement
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#partner-form"
                  className="bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider px-6 py-3 hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  Start Partner Application <Send className="size-3.5" />
                </a>
                <span className="text-xs text-muted-foreground">
                  ⚡ 24–48 hour application review
                </span>
              </div>
            </div>

            {/* Right Column (5 cols): Lanyard hangs from secondary nav — no container */}
            <div
              className="hidden lg:block lg:col-span-5"
              style={{ marginTop: '-48px', height: '600px', position: 'relative', zIndex: 1 }}
            >
              <Lanyard
                position={[0, 0, 20]}
                gravity={[0, -40, 0]}
                frontImage={partnerCardImg}
                backImage={partnerCardImg}
                imageFit="cover"
                lanyardImage={lanyardStripImg}
                lanyardWidth={0.8}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Form or Success View ── */}
      <main id="partner-form" className="flex-1 mx-auto max-w-4xl px-5 py-12 w-full">
        {submitted ? (
          <div className="border-2 border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20 p-8 md:p-12 space-y-8 text-center">
            <div className="size-16 bg-emerald-600 text-white flex items-center justify-center mx-auto">
              <Check className="size-10 stroke-3" />
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Application Successfully Submitted
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Thank you for applying to partner with Resale
              </h2>
              <p className="text-sm text-subtle-foreground leading-relaxed">
                We have received the partnership application for{" "}
                <strong className="text-foreground">
                  {formData.companyName || "your business"}
                </strong>
                . Our B2B Partnership Desk is reviewing your details and uploaded documents.
              </p>
            </div>

            {/* Next steps breakdown */}
            <div className="hairline-grid grid grid-cols-1 md:grid-cols-3 bg-background text-left max-w-2xl mx-auto">
              <div className="p-5 space-y-1.5">
                <span className="text-xs font-bold text-primary">STEP 1</span>
                <h4 className="font-semibold text-sm text-foreground">Review &amp; Verification</h4>
                <p className="text-xs text-subtle-foreground">
                  Our verification team validates trade credentials and catalog scope within 24h.
                </p>
              </div>
              <div className="p-5 space-y-1.5">
                <span className="text-xs font-bold text-primary">STEP 2</span>
                <h4 className="font-semibold text-sm text-foreground">Partnership Call</h4>
                <p className="text-xs text-subtle-foreground">
                  A dedicated account manager contacts you to discuss pricing, logistics, and terms.
                </p>
              </div>
              <div className="p-5 space-y-1.5">
                <span className="text-xs font-bold text-primary">STEP 3</span>
                <h4 className="font-semibold text-sm text-foreground">Inventory Onboarding</h4>
                <p className="text-xs text-subtle-foreground">
                  Seamless bulk ingestion, condition tagging, and live listing across Bangladesh.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/"
                className="bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider px-6 py-3 hover:opacity-90"
              >
                Return to Marketplace
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="border border-border bg-card font-semibold text-xs uppercase tracking-wider px-6 py-3 hover:bg-muted"
              >
                Edit or Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* ════════════════════════════════════════════════════════════════
                SECTION 1: Business & Partnership Information
            ════════════════════════════════════════════════════════════════ */}
            <div className="border border-border bg-card p-6 md:p-8 space-y-8">
              <div className="border-b border-border pb-4 flex items-center gap-3">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1">
                  01
                </span>
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Business &amp; Partnership Information
                  </h2>
                  <p className="text-xs text-subtle-foreground">
                    Tell us about your business profile and partnership scope
                  </p>
                </div>
              </div>

              {/* Q1 */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">
                  1. Which best describes your business? <span className="text-[#ea580c]">*</span>
                </label>
                <p className="text-xs text-muted-foreground">Select all that apply</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {[
                    "Brand Owner / Manufacturer",
                    "Authorized Distributor",
                    "Authorized Retailer",
                    "E-commerce Business",
                    "Electronics Retailer",
                    "Professional Reseller",
                    "Refurbisher",
                    "Importer",
                    "Corporate / Business Seller",
                    "Content Creator",
                  ].map((type) => (
                    <label
                      key={type}
                      className={`flex items-center gap-2.5 border p-3 cursor-pointer text-xs transition-colors ${
                        formData.businessTypes.includes(type)
                          ? "border-primary bg-primary/5 font-semibold text-foreground"
                          : "border-border bg-background text-subtle-foreground hover:border-foreground/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.businessTypes.includes(type)}
                        onChange={() => handleCheckboxToggle("businessTypes", type)}
                        className="size-4 accent-primary"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>

                {/* Conditional Platform Question for Content Creators */}
                {formData.businessTypes.includes("Content Creator") && (
                  <div className="border border-[#ea580c]/40 bg-orange-50/40 dark:bg-orange-950/20 p-4 space-y-3 mt-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                      Which platform? <span className="text-[#ea580c]">*</span>
                    </label>
                    <p className="text-xs text-muted-foreground">Select all that apply</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {["Youtube", "Facebook", "Instagram", "Tiktok"].map((platform) => (
                        <label
                          key={platform}
                          className={`flex items-center gap-2 border p-2.5 cursor-pointer text-xs transition-colors bg-background ${
                            formData.creatorPlatforms.includes(platform)
                              ? "border-[#ea580c] text-foreground font-semibold"
                              : "border-border text-subtle-foreground hover:border-foreground/40"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.creatorPlatforms.includes(platform)}
                            onChange={() => handleCheckboxToggle("creatorPlatforms", platform)}
                            className="size-4 accent-[#ea580c]"
                          />
                          <span>{platform}</span>
                        </label>
                      ))}
                    </div>
                    <div className="pt-1">
                      <input
                        type="text"
                        placeholder="Your channel / profile link (e.g. youtube.com/@yourchannel or @handle)"
                        value={formData.creatorHandle}
                        onChange={(e) =>
                          setFormData({ ...formData, creatorHandle: e.target.value })
                        }
                        className="w-full bg-background border border-border px-3 py-1.5 text-xs outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">Other:</span>
                  <input
                    type="text"
                    placeholder="Specify other business description"
                    value={formData.businessTypeOther}
                    onChange={(e) =>
                      setFormData({ ...formData, businessTypeOther: e.target.value })
                    }
                    className="flex-1 bg-background border border-border px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground italic bg-muted/60 p-2 border-l-2 border-primary">
                  Note: If you are a Brand Owner, Distributor, or Authorized Retailer, you may be
                  asked to provide proof of authorization.
                </p>
              </div>

              {/* Q2 */}
              <div className="space-y-3 border-t border-border pt-6">
                <label className="block text-sm font-semibold text-foreground">
                  2. What are you interested in partnering with Resale for?{" "}
                  <span className="text-[#ea580c]">*</span>
                </label>
                <p className="text-xs text-muted-foreground">Select all that apply</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {[
                    "Sell Excess Inventory",
                    "Sell Customer Returns",
                    "Sell Open-Box Products",
                    "Sell Pre-Owned Products",
                    "Sell Refurbished Products",
                    "Sell Unsold / Clearance Stock",
                    "Regular Inventory Partnership",
                    "Bulk Inventory Partnership",
                  ].map((item) => (
                    <label
                      key={item}
                      className={`flex items-center gap-2.5 border p-3 cursor-pointer text-xs transition-colors ${
                        formData.partnerInterests.includes(item)
                          ? "border-primary bg-primary/5 font-semibold text-foreground"
                          : "border-border bg-background text-subtle-foreground hover:border-foreground/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.partnerInterests.includes(item)}
                        onChange={() => handleCheckboxToggle("partnerInterests", item)}
                        className="size-4 accent-primary"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">Other:</span>
                  <input
                    type="text"
                    placeholder="Specify other partnership interest"
                    value={formData.partnerInterestOther}
                    onChange={(e) =>
                      setFormData({ ...formData, partnerInterestOther: e.target.value })
                    }
                    className="flex-1 bg-background border border-border px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Q3 */}
              <div className="space-y-3 border-t border-border pt-6">
                <label className="block text-sm font-semibold text-foreground">
                  3. Which product categories do you currently have available?{" "}
                  <span className="text-[#ea580c]">*</span>
                </label>
                <p className="text-xs text-muted-foreground">Select all that apply</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
                  {[
                    "Smartphones",
                    "Laptops",
                    "Tablets",
                    "Headphones",
                    "Earbuds",
                    "Smartwatches",
                    "Cameras",
                    "Gaming Consoles",
                    "Monitors",
                    "TVs",
                    "Speakers",
                    "Computer Accessories",
                    "Mobile Accessories",
                  ].map((cat) => (
                    <label
                      key={cat}
                      className={`flex items-center gap-2 border p-2.5 cursor-pointer text-xs transition-colors ${
                        formData.productCategories.includes(cat)
                          ? "border-primary bg-primary/5 font-semibold text-foreground"
                          : "border-border bg-background text-subtle-foreground hover:border-foreground/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.productCategories.includes(cat)}
                        onChange={() => handleCheckboxToggle("productCategories", cat)}
                        className="size-4 accent-primary"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">Other Electronics:</span>
                  <input
                    type="text"
                    placeholder="e.g. Drones, VR headsets, Projectors"
                    value={formData.productCategoryOther}
                    onChange={(e) =>
                      setFormData({ ...formData, productCategoryOther: e.target.value })
                    }
                    className="flex-1 bg-background border border-border px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Q4 */}
              <div className="space-y-2 border-t border-border pt-6">
                <label className="block text-sm font-semibold text-foreground">
                  4. Which brands do you currently carry? <span className="text-[#ea580c]">*</span>
                </label>
                <p className="text-xs text-muted-foreground">
                  Please list the brands you currently own, distribute, retail, or have inventory
                  for (e.g. Apple, Samsung, Xiaomi, Sony, ASUS, Lenovo).
                </p>
                <input
                  required
                  type="text"
                  placeholder="Enter brands separated by commas"
                  value={formData.brands}
                  onChange={(e) => setFormData({ ...formData, brands: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Q5 */}
              <div className="space-y-3 border-t border-border pt-6">
                <label className="block text-sm font-semibold text-foreground">
                  5. What type of inventory are you looking to sell through Resale?{" "}
                  <span className="text-[#ea580c]">*</span>
                </label>
                <p className="text-xs text-muted-foreground">Select all that apply</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {[
                    "Excess Inventory",
                    "Customer Returns",
                    "Open-Box Products",
                    "Pre-Owned Products",
                    "Refurbished Products",
                    "Unsold Inventory",
                    "Clearance Stock",
                    "Demo / Display Units",
                    "Review / Used Units",
                  ].map((item) => (
                    <label
                      key={item}
                      className={`flex items-center gap-2 border p-2.5 cursor-pointer text-xs transition-colors ${
                        formData.inventoryTypes.includes(item)
                          ? "border-primary bg-primary/5 font-semibold text-foreground"
                          : "border-border bg-background text-subtle-foreground hover:border-foreground/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.inventoryTypes.includes(item)}
                        onChange={() => handleCheckboxToggle("inventoryTypes", item)}
                        className="size-4 accent-primary"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">Other:</span>
                  <input
                    type="text"
                    placeholder="Specify other inventory type"
                    value={formData.inventoryTypeOther}
                    onChange={(e) =>
                      setFormData({ ...formData, inventoryTypeOther: e.target.value })
                    }
                    className="flex-1 bg-background border border-border px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Q6, Q7, Q8 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-6">
                {/* Q6 */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    6. Avg. Selling Price <span className="text-[#ea580c]">*</span>
                  </label>
                  <select
                    required
                    value={formData.averagePrice}
                    onChange={(e) => setFormData({ ...formData, averagePrice: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="">Select price bracket</option>
                    <option value="under-5k">Under ৳5,000</option>
                    <option value="5k-15k">৳5,000 – ৳15,000</option>
                    <option value="15k-30k">৳15,000 – ৳30,000</option>
                    <option value="30k-50k">৳30,000 – ৳50,000</option>
                    <option value="50k-100k">৳50,000 – ৳100,000</option>
                    <option value="100k-plus">৳100,000+</option>
                  </select>
                </div>

                {/* Q7 */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    7. Monthly Units Capacity <span className="text-[#ea580c]">*</span>
                  </label>
                  <select
                    required
                    value={formData.monthlyUnits}
                    onChange={(e) => setFormData({ ...formData, monthlyUnits: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="">Select supply volume</option>
                    <option value="1-10">1–10 units</option>
                    <option value="11-50">11–50 units</option>
                    <option value="51-100">51–100 units</option>
                    <option value="101-500">101–500 units</option>
                    <option value="501-1000">501–1,000 units</option>
                    <option value="1000-5000">1,000–5,000 units</option>
                    <option value="5000-plus">5,000+ units</option>
                  </select>
                </div>

                {/* Q8 */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    8. Total Inventory Value <span className="text-[#ea580c]">*</span>
                  </label>
                  <select
                    required
                    value={formData.inventoryValue}
                    onChange={(e) => setFormData({ ...formData, inventoryValue: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="">Select total inventory</option>
                    <option value="under-1l">Under ৳1 Lakh</option>
                    <option value="1l-5l">৳1 Lakh – ৳5 Lakh</option>
                    <option value="5l-10l">৳5 Lakh – ৳10 Lakh</option>
                    <option value="10l-50l">৳10 Lakh – ৳50 Lakh</option>
                    <option value="50l-1c">৳50 Lakh – ৳1 Crore</option>
                    <option value="1c-plus">৳1 Crore+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 2: Product & Inventory Details
            ════════════════════════════════════════════════════════════════ */}
            <div className="border border-border bg-card p-6 md:p-8 space-y-8">
              <div className="border-b border-border pb-4 flex items-center gap-3">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1">
                  02
                </span>
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Product &amp; Inventory Details
                  </h2>
                  <p className="text-xs text-subtle-foreground">
                    Condition grading, proof of ownership, and supply cadence
                  </p>
                </div>
              </div>

              {/* Q9 */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">
                  9. What is the general condition of your inventory?{" "}
                  <span className="text-[#ea580c]">*</span>
                </label>
                <p className="text-xs text-muted-foreground">Select all that apply</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {[
                    "Brand New",
                    "Open Box",
                    "Like New",
                    "Excellent",
                    "Good",
                    "Fair",
                    "Customer Returned",
                    "Refurbished",
                    "Damaged / For Parts",
                  ].map((cond) => (
                    <label
                      key={cond}
                      className={`flex items-center gap-2 border p-2.5 cursor-pointer text-xs transition-colors ${
                        formData.inventoryConditions.includes(cond)
                          ? "border-primary bg-primary/5 font-semibold text-foreground"
                          : "border-border bg-background text-subtle-foreground hover:border-foreground/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.inventoryConditions.includes(cond)}
                        onChange={() => handleCheckboxToggle("inventoryConditions", cond)}
                        className="size-4 accent-primary"
                      />
                      <span>{cond}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q10, Q11, Q12 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-6">
                {/* Q10 */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    10. Invoices / Ownership Proof <span className="text-[#ea580c]">*</span>
                  </label>
                  <select
                    required
                    value={formData.hasInvoices}
                    onChange={(e) => setFormData({ ...formData, hasInvoices: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="">Select invoice status</option>
                    <option value="all">Yes, for all inventory</option>
                    <option value="some">Yes, for some inventory</option>
                    <option value="no">No</option>
                    <option value="depends">Depends on the inventory</option>
                  </select>
                </div>

                {/* Q11 */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    11. Warranty Coverage <span className="text-[#ea580c]">*</span>
                  </label>
                  <select
                    required
                    value={formData.hasWarranty}
                    onChange={(e) => setFormData({ ...formData, hasWarranty: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="">Select warranty coverage</option>
                    <option value="all">Yes, all products</option>
                    <option value="some">Yes, some products</option>
                    <option value="no">No</option>
                    <option value="depends">Depends on the product</option>
                    <option value="unsure">Not sure</option>
                  </select>
                </div>

                {/* Q12 */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    12. Supply Frequency <span className="text-[#ea580c]">*</span>
                  </label>
                  <select
                    required
                    value={formData.supplyFrequency}
                    onChange={(e) => setFormData({ ...formData, supplyFrequency: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="">Select frequency</option>
                    <option value="one-time">One-time inventory sale</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="on-demand">On-demand</option>
                    <option value="regular">Regular / Ongoing partnership</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 3: Company Information
            ════════════════════════════════════════════════════════════════ */}
            <div className="border border-border bg-card p-6 md:p-8 space-y-6">
              <div className="border-b border-border pb-4 flex items-center gap-3">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1">
                  03
                </span>
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Company Information
                  </h2>
                  <p className="text-xs text-subtle-foreground">
                    Your business entity and online presence
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Q13 */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    13. Company / Business Name <span className="text-[#ea580c]">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Enter company or registered trade name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Q14 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    14. Business Type <span className="text-[#ea580c]">*</span>
                  </label>
                  <select
                    required
                    value={formData.companyType}
                    onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Select legal structure</option>
                    <option value="sole">Sole Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="pvt-ltd">Private Limited Company</option>
                    <option value="ltd">Limited Company</option>
                    <option value="brand">Brand / Manufacturer</option>
                    <option value="distributor">Distributor</option>
                    <option value="retailer">Retailer</option>
                    <option value="ecommerce">E-commerce Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Q15 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    15. Year Established
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2020"
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Q16 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    16. Business Website{" "}
                    <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Q17 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    17. Facebook / Instagram Page{" "}
                    <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://facebook.com/yourbrand"
                    value={formData.socialPage}
                    onChange={(e) => setFormData({ ...formData, socialPage: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 4: Business Registration & Verification
            ════════════════════════════════════════════════════════════════ */}
            <div className="border border-border bg-card p-6 md:p-8 space-y-6">
              <div className="border-b border-border pb-4 flex items-center gap-3">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1">
                  04
                </span>
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Business Registration &amp; Verification
                  </h2>
                  <p className="text-xs text-subtle-foreground">
                    Trade license, tax identification, and brand authority
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Q18 */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    18. Valid Trade License? <span className="text-[#ea580c]">*</span>
                  </label>
                  <div className="flex gap-4">
                    {["Yes", "No", "Not Applicable"].map((opt) => (
                      <label key={opt} className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="tradeLicense"
                          value={opt}
                          checked={formData.tradeLicense === opt}
                          onChange={(e) =>
                            setFormData({ ...formData, tradeLicense: e.target.value })
                          }
                          className="accent-primary"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q19 */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    19. Do you have an e-TIN? <span className="text-[#ea580c]">*</span>
                  </label>
                  <div className="flex gap-4">
                    {["Yes", "No", "Not Applicable"].map((opt) => (
                      <label key={opt} className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="hasETIN"
                          value={opt}
                          checked={formData.hasETIN === opt}
                          onChange={(e) => setFormData({ ...formData, hasETIN: e.target.value })}
                          className="accent-primary"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  {formData.hasETIN === "Yes" && (
                    <input
                      type="text"
                      placeholder="Enter e-TIN number"
                      value={formData.etinNumber}
                      onChange={(e) => setFormData({ ...formData, etinNumber: e.target.value })}
                      className="w-full bg-background border border-border px-3 py-1.5 text-xs outline-none focus:border-primary mt-2"
                    />
                  )}
                </div>

                {/* Q20 */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    20. BIN / VAT Registration? <span className="text-[#ea580c]">*</span>
                  </label>
                  <div className="flex gap-4">
                    {["Yes", "No", "Not Applicable"].map((opt) => (
                      <label key={opt} className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="hasBIN"
                          value={opt}
                          checked={formData.hasBIN === opt}
                          onChange={(e) => setFormData({ ...formData, hasBIN: e.target.value })}
                          className="accent-primary"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  {formData.hasBIN === "Yes" && (
                    <input
                      type="text"
                      placeholder="Enter 9/13-digit BIN"
                      value={formData.binNumber}
                      onChange={(e) => setFormData({ ...formData, binNumber: e.target.value })}
                      className="w-full bg-background border border-border px-3 py-1.5 text-xs outline-none focus:border-primary mt-2"
                    />
                  )}
                </div>

                {/* Q21 */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    21. Authorization to sell listed brands?{" "}
                    <span className="text-[#ea580c]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {["Yes", "No", "Some of them", "Not Applicable"].map((opt) => (
                      <label key={opt} className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="brandAuth"
                          value={opt}
                          checked={formData.brandAuthorization === opt}
                          onChange={(e) =>
                            setFormData({ ...formData, brandAuthorization: e.target.value })
                          }
                          className="accent-primary"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 5: Inventory Location & Operations
            ════════════════════════════════════════════════════════════════ */}
            <div className="border border-border bg-card p-6 md:p-8 space-y-6">
              <div className="border-b border-border pb-4 flex items-center gap-3">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1">
                  05
                </span>
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Inventory Location &amp; Operations
                  </h2>
                  <p className="text-xs text-subtle-foreground">
                    Warehouse location and preferred handover logistics
                  </p>
                </div>
              </div>

              {/* Q22 */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">
                  22. Where is your inventory located? <span className="text-[#ea580c]">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Division
                    </span>
                    <select
                      required
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      className="w-full bg-background border border-border px-3 py-2 text-xs outline-none focus:border-primary"
                    >
                      <option value="">Select Division</option>
                      {divisions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      District
                    </span>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dhaka North, Gazipur, Chattogram"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-background border border-border px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Area / Thana / Hub
                    </span>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Uttara Sector 4, Agrabad"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full bg-background border border-border px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Q23 */}
              <div className="space-y-2 border-t border-border pt-6">
                <label className="block text-sm font-semibold text-foreground">
                  23. How would you prefer to hand over inventory to Resale?{" "}
                  <span className="text-[#ea580c]">*</span>
                </label>
                <select
                  required
                  value={formData.handoverPreference}
                  onChange={(e) => setFormData({ ...formData, handoverPreference: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="">Select handover preference</option>
                  <option value="resale-pickup">Resale-arranged pickup</option>
                  <option value="seller-delivery">Seller-arranged delivery</option>
                  <option value="warehouse-dropoff">Warehouse / Hub drop-off</option>
                  <option value="depends">Depends on order size</option>
                  <option value="discussion">Open to discussion</option>
                </select>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 6: Contact Information
            ════════════════════════════════════════════════════════════════ */}
            <div className="border border-border bg-card p-6 md:p-8 space-y-6">
              <div className="border-b border-border pb-4 flex items-center gap-3">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1">
                  06
                </span>
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Contact Information
                  </h2>
                  <p className="text-xs text-subtle-foreground">
                    Direct liaison for partnership communication
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Q24 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    24. Contact Person Name <span className="text-[#ea580c]">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Q25 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    25. Position / Designation <span className="text-[#ea580c]">*</span>
                  </label>
                  <select
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Select Designation</option>
                    <option value="owner">Owner</option>
                    <option value="founder">Founder</option>
                    <option value="director">Director</option>
                    <option value="manager">Manager</option>
                    <option value="sales-manager">Sales Manager</option>
                    <option value="ops-manager">Operations Manager</option>
                    <option value="biz-dev">Business Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Q26 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    26. Mobile Number <span className="text-[#ea580c]">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+880 1XXXXXXXXX"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Q27 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    27. WhatsApp Number{" "}
                    <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 1XXXXXXXXX"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Q28 */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    28. Business Email <span className="text-[#ea580c]">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 7: Tell Us About Your Partnership
            ════════════════════════════════════════════════════════════════ */}
            <div className="border border-border bg-card p-6 md:p-8 space-y-6">
              <div className="border-b border-border pb-4 flex items-center gap-3">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1">
                  07
                </span>
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Tell Us About Your Partnership
                  </h2>
                  <p className="text-xs text-subtle-foreground">
                    Your expectations, targets, and special inventory considerations
                  </p>
                </div>
              </div>

              {/* Q29 */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">
                  29. What are you looking for from Resale?{" "}
                  <span className="text-[#ea580c]">*</span>
                </label>
                <p className="text-xs text-muted-foreground">Select all that apply</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {[
                    "Help selling excess inventory",
                    "Help selling returned products",
                    "Access to new customers",
                    "Bulk inventory liquidation",
                    "Long-term resale partnership",
                    "Better recovery from unsold inventory",
                    "Help managing slow-moving stock",
                  ].map((goal) => (
                    <label
                      key={goal}
                      className={`flex items-center gap-2.5 border p-3 cursor-pointer text-xs transition-colors ${
                        formData.partnerGoals.includes(goal)
                          ? "border-primary bg-primary/5 font-semibold text-foreground"
                          : "border-border bg-background text-subtle-foreground hover:border-foreground/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.partnerGoals.includes(goal)}
                        onChange={() => handleCheckboxToggle("partnerGoals", goal)}
                        className="size-4 accent-primary"
                      />
                      <span>{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q30 */}
              <div className="space-y-2 border-t border-border pt-6">
                <label className="block text-sm font-semibold text-foreground">
                  30. Tell us more about your inventory and business.
                </label>
                <p className="text-xs text-muted-foreground">
                  Please share any additional information that could help us understand your
                  partnership opportunity (products, inventory volume, brands, challenges, or
                  expectations).
                </p>
                <textarea
                  rows={4}
                  placeholder="Tell us about your products, inventory volume, brands, current challenges, or partnership expectations..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
                />
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 8: Supporting Documents
            ════════════════════════════════════════════════════════════════ */}
            <div className="border border-border bg-card p-6 md:p-8 space-y-6">
              <div className="border-b border-border pb-4 flex items-center gap-3">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1">
                  08
                </span>
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Supporting Documents
                  </h2>
                  <p className="text-xs text-subtle-foreground">
                    Upload credentials to expedite partnership verification and approval
                  </p>
                </div>
              </div>

              {/* Q31 */}
              <div className="space-y-4">
                <div className="text-xs text-subtle-foreground space-y-1">
                  <p className="font-semibold text-foreground">Upload any applicable documents:</p>
                  <p className="text-[11px] text-muted-foreground">
                    Trade License · Brand Authorization Letter · Distributor Authorization ·
                    Trademark Certificate · Purchase Invoice · Business Registration Document · BIN
                    / VAT Certificate · Other Supporting Documents
                  </p>
                </div>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  className={`border-2 border-dashed p-8 text-center transition-colors bg-background ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/50"
                  }`}
                >
                  <UploadCloud className="size-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    Drag and drop your documents here, or click below
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports PDF, PNG, JPG, JPEG (Max 25MB per file)
                  </p>

                  <label className="mt-4 inline-flex items-center gap-2 border border-primary bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider px-5 py-2.5 cursor-pointer hover:opacity-90 transition-opacity">
                    <span>Upload Documents</span>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Uploaded files preview list */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Attached Files ({uploadedFiles.length})
                    </p>
                    <ul className="divide-y divide-border border border-border bg-background">
                      {uploadedFiles.map((file, i) => (
                        <li key={i} className="flex items-center justify-between p-2.5 text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="size-4 text-primary shrink-0" />
                            <span className="truncate">{file}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="text-muted-foreground hover:text-destructive p-1"
                          >
                            <X className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 9: Partnership Confirmation & Submission
            ════════════════════════════════════════════════════════════════ */}
            <div className="border-2 border-border bg-card p-6 md:p-8 space-y-6">
              <div className="border-b border-border pb-4 flex items-center gap-3">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1">
                  09
                </span>
                <h2 className="font-display font-bold text-xl text-foreground">
                  32. Partnership Confirmation <span className="text-[#ea580c]">*</span>
                </h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer text-xs md:text-sm text-foreground">
                  <input
                    required
                    type="checkbox"
                    checked={formData.confirmAccuracy}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmAccuracy: e.target.checked })
                    }
                    className="size-4.5 accent-primary mt-0.5"
                  />
                  <span>
                    I confirm that the information provided is accurate and that I have the legal
                    right or authorization to sell the products and inventory submitted to Resale.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-xs md:text-sm text-foreground">
                  <input
                    required
                    type="checkbox"
                    checked={formData.confirmContact}
                    onChange={(e) => setFormData({ ...formData, confirmContact: e.target.checked })}
                    className="size-4.5 accent-primary mt-0.5"
                  />
                  <span>
                    I agree that Resale may contact me regarding this partnership application.
                  </span>
                </label>
              </div>

              {/* Submit Banner & Button */}
              <div className="border-t border-border pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1 max-w-md">
                  <h4 className="font-display font-bold text-lg text-foreground">
                    Submit Partnership Application
                  </h4>
                  <p className="text-xs text-subtle-foreground">
                    Ready to turn your inventory into new opportunities? Submit your details and our
                    partnership team will review your application and contact you to discuss next
                    steps.
                  </p>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm md:text-base px-8 py-4 uppercase tracking-wider transition-colors border border-[#ea580c] shadow-none shrink-0"
                >
                  <Send className="size-4" />
                  Apply to Become a Resale Partner
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
