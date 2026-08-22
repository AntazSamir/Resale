import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Eye,
  Scale,
  Leaf,
  Check,
  X,
  CheckCheck,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { BangladeshMapSVG } from "@/components/bangladesh-map";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Resale — Re-engineering Used Electronics Commerce in Bangladesh" },
      {
        name: "description",
        content:
          "Discover how Resale is making pre-owned electronics transparent, safe, and dignified across Bangladesh through 32-point standardized inspection, NID seller verification, and 48-hour buyer protection.",
      },
      {
        property: "og:title",
        content: "About Resale — Re-engineering Used Electronics Commerce in Bangladesh",
      },
      {
        property: "og:description",
        content:
          "Standardized condition grades, verified sellers, zero guesswork. Learn the story, mission, and technology behind Bangladesh's circular electronics marketplace.",
      },
    ],
  }),
  component: AboutPage,
});

const inspectionCategories = [
  {
    id: "phone",
    label: "Smartphones",
    icon: Smartphone,
    checks: [
      {
        name: "Display OEM Authenticity & True Tone",
        status: "Passed",
        desc: "No third-party LCD replacement, touch response 100% active",
      },
      {
        name: "Battery Health & Cycle Count",
        status: "Passed",
        desc: "Factory capacity disclosed (e.g. 88% Original Apple battery)",
      },
      {
        name: "Camera Sensor & OIS Stabilization",
        status: "Passed",
        desc: "No dust specks, laser autofocus & 4K 60fps video calibrated",
      },
      {
        name: "Biometric Sensors (Face ID / Fingerprint)",
        status: "Passed",
        desc: "Hardware security enclave intact, instant unlock verified",
      },
      {
        name: "Motherboard & Cellular IC Diagnostics",
        status: "Passed",
        desc: "BTRC registration clear, dual SIM network band testing",
      },
      {
        name: "Liquid Intrusion Indicators (LDI)",
        status: "Passed",
        desc: "Internal moisture indicators verified untriggered",
      },
    ],
  },
  {
    id: "laptop",
    label: "Laptops & MacBooks",
    icon: Laptop,
    checks: [
      {
        name: "Thermal Throttling & Fan Diagnostics",
        status: "Passed",
        desc: "Stress-tested CPU/GPU temperatures under full benchmark load",
      },
      {
        name: "Battery Cycle & Retention Rate",
        status: "Passed",
        desc: "Cycle count verified with 4-hour continuous video playback",
      },
      {
        name: "Keyboard Matrix & Trackpad Force",
        status: "Passed",
        desc: "All 78+ key switches registered without double-typing",
      },
      {
        name: "Storage Drive Health & SMART Metrics",
        status: "Passed",
        desc: "NVMe SSD health > 90% with 0 bad sectors or read errors",
      },
      {
        name: "Thunderbolt / USB-C & HDMI Port Bus",
        status: "Passed",
        desc: "Power delivery & external 4K 60Hz display output verified",
      },
      {
        name: "Hinge Tension & Chassis Alignment",
        status: "Passed",
        desc: "Smooth opening torque, no structural hairline stress cracks",
      },
    ],
  },
  {
    id: "camera",
    label: "Cameras & Lenses",
    icon: Camera,
    checks: [
      {
        name: "Shutter Count Verification",
        status: "Passed",
        desc: "Actuations matched against mechanical rated lifecycle",
      },
      {
        name: "Full-Frame Sensor Clarity & Dead Pixels",
        status: "Passed",
        desc: "Long-exposure sensor test with zero hot or stuck pixels",
      },
      {
        name: "Lens Optics, Fungus & Hazing Check",
        status: "Passed",
        desc: "Ultra-violet inspection for pristine internal glass elements",
      },
      {
        name: "Autofocus Motor & Aperture Blades",
        status: "Passed",
        desc: "Linear motor responsiveness & oil-free snappy blades",
      },
      {
        name: "In-Body Image Stabilization (IBIS)",
        status: "Passed",
        desc: "5-axis mechanical gyro sensor calibration confirmed",
      },
      {
        name: "SD / CFexpress Dual Card Slot Pins",
        status: "Passed",
        desc: "High-speed write buffer test without corruption",
      },
    ],
  },
  {
    id: "audio",
    label: "Audio & Wearables",
    icon: Headphones,
    checks: [
      {
        name: "Frequency Response Balance (L / R)",
        status: "Passed",
        desc: "Decibel symmetry across 20Hz - 20,000Hz acoustic spectrum",
      },
      {
        name: "Active Noise Cancellation (ANC) Microphones",
        status: "Passed",
        desc: "External noise reduction inverse-phase verification",
      },
      {
        name: "Earbud Battery Drain Discrepancy",
        status: "Passed",
        desc: "Left and right pods calibrated to < 4% drain variance",
      },
      {
        name: "Water & Sweat Resistance Seals",
        status: "Passed",
        desc: "Acoustic mesh and charging pin corrosion audit",
      },
    ],
  },
];

const timelineMilestones = [
  {
    year: "2024",
    quarter: "Q1",
    tag: "The Catalyst",
    title: "Frustration With Broken Classifieds",
    desc: "Our founders experienced the wild west of buying used electronics in Dhaka: fake condition claims, altered battery health, unverified sellers, and dangerous cash handoffs in parking lots.",
  },
  {
    year: "2024",
    quarter: "Q3",
    tag: "Framework",
    title: "The 32-Point Inspection Standard",
    desc: "We engineered Bangladesh's first comprehensive hardware diagnostic framework with objective condition scores (A+ to D), turning subjective opinions into hard, verifiable data.",
  },
  {
    year: "2025",
    quarter: "Q2",
    tag: "Platform Launch",
    title: "NID Verification & 48H Buyer Protection",
    desc: "Launched Resale with election-commission grade National ID merchant screening and automated escrow protection. Over 5,000 verified devices exchanged in the first 6 months.",
  },
  {
    year: "2026",
    quarter: "Present",
    tag: "National Scale",
    title: "Circular Electronics at Scale",
    desc: "Expanding nationwide across all 8 divisions with B2B retail liquidation, cash on delivery, and diverting over 14,000 kg of electronics from premature e-waste landfills.",
  },
];

const impactStats = [
  {
    number: "32",
    unit: "Points",
    label: "Standardized Inspection Protocol",
    detail: "Every component scored before listing approval",
  },
  {
    number: "100%",
    unit: "NID",
    label: "Verified Merchant Identity",
    detail: "Zero anonymous burner accounts or scam listings",
  },
  {
    number: "48h",
    unit: "Window",
    label: "Buyer Protection & Return Guarantee",
    detail: "Funds held safely until you inspect your delivery",
  },
  {
    number: "14.2k",
    unit: "kg",
    label: "E-Waste Prevented Nationwide",
    detail: "Quality electronics kept in continuous circulation",
  },
];

export default function AboutPage() {
  const [activeInspectionTab, setActiveInspectionTab] = useState("phone");
  const [activeComparison, setActiveComparison] = useState<"before" | "resale">("resale");

  const currentInspection =
    inspectionCategories.find((c) => c.id === activeInspectionTab) ?? inspectionCategories[0]!;

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-primary-foreground">
      <SiteHeader />

      {/* ── 1. Page Hero Banner ── */}
      <section className="relative border-b border-border bg-card overflow-hidden">
        {/* Subtle grid background accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-24 space-y-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              <span>About Resale · Bangladesh&apos;s Circular Tech Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.1]">
              Pre-Owned Electronics Deserve{" "}
              <span className="text-primary underline decoration-primary/40 underline-offset-8">
                Absolute Trust.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-subtle-foreground leading-relaxed font-normal">
              Resale is re-engineering how Bangladesh buys and sells second-hand technology. We
              replace shady classifieds and guesswork with rigorous 32-point diagnostic scoring,
              NID-verified merchants, and an e-commerce buying experience backed by 48-hour buyer
              protection.
            </p>
          </div>

          {/* Impact Stats Strip */}
          <div className="pt-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {impactStats.map((stat) => (
                <div
                  key={stat.label}
                  className="border border-border bg-background p-4 sm:p-5 flex flex-col justify-between space-y-2 group hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                      {stat.number}
                    </span>
                    <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                      {stat.unit}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-display font-bold text-foreground">
                      {stat.label}
                    </h2>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{stat.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. The Broken Classifieds vs The Resale Standard (Interactive Contrast) ── */}
      <section className="border-b border-border bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              The Genesis
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
              Why We Rebuilt the Marketplace from Scratch
            </h2>
            <p className="text-xs sm:text-sm text-subtle-foreground leading-relaxed">
              Buying used electronics in Bangladesh has historically been plagued by anxiety, hidden
              faults, and unreliable strangers. We designed Resale to eliminate every single
              friction point.
            </p>
          </div>

          {/* Interactive Mode Toggle */}
          <div className="flex items-center gap-2 p-1 bg-muted border border-border w-fit">
            <button
              onClick={() => setActiveComparison("before")}
              className={`px-4 py-2 text-xs font-display font-bold uppercase tracking-wider transition-all ${
                activeComparison === "before"
                  ? "bg-destructive text-destructive-foreground"
                  : "text-subtle-foreground hover:text-foreground"
              }`}
            >
              ⚠️ Traditional Classifieds (Old Way)
            </button>
            <button
              onClick={() => setActiveComparison("resale")}
              className={`px-4 py-2 text-xs font-display font-bold uppercase tracking-wider transition-all ${
                activeComparison === "resale"
                  ? "bg-primary text-primary-foreground"
                  : "text-subtle-foreground hover:text-foreground"
              }`}
            >
              ✨ The Resale Standard (Our Way)
            </button>
          </div>

          {/* Contrast Display Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old Way Card */}
            <div
              className={`border p-6 sm:p-8 space-y-6 transition-all duration-200 ${
                activeComparison === "before"
                  ? "border-destructive/60 bg-destructive/5 ring-2 ring-destructive/20"
                  : "border-border bg-card/50 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-destructive uppercase block">
                    Legacy Classifieds
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mt-0.5">
                    Subjective &amp; Risky
                  </h3>
                </div>
                <div className="size-10 bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center font-bold">
                  <X className="size-5" />
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-subtle-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold text-base leading-none">✕</span>
                  <span>
                    <strong className="text-foreground font-semibold">Vague descriptions:</strong>{" "}
                    &ldquo;Fresh condition, 10/10, no internal issues&rdquo; with no objective
                    proof.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold text-base leading-none">✕</span>
                  <span>
                    <strong className="text-foreground font-semibold">Anonymous sellers:</strong>{" "}
                    Fake profiles, SIM card burner accounts, and zero legal recourse.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold text-base leading-none">✕</span>
                  <span>
                    <strong className="text-foreground font-semibold">
                      Hidden hardware defects:
                    </strong>{" "}
                    Replaced low-grade LCDs, failing motherboard chips, and bloated batteries.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold text-base leading-none">✕</span>
                  <span>
                    <strong className="text-foreground font-semibold">
                      Stressful street meetups:
                    </strong>{" "}
                    High-risk cash handoffs in busy intersections with no return policy.
                  </span>
                </li>
              </ul>
            </div>

            {/* Resale Standard Card */}
            <div
              className={`border p-6 sm:p-8 space-y-6 transition-all duration-200 ${
                activeComparison === "resale"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-card/50 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase block">
                    Resale Architecture
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mt-0.5">
                    Scientific &amp; Guaranteed
                  </h3>
                </div>
                <div className="size-10 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                  <Check className="size-5" />
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-subtle-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
                  <span>
                    <strong className="text-foreground font-semibold">32-point inspection:</strong>{" "}
                    Condition grades (A+ to D) generated with component diagnostic test results.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
                  <span>
                    <strong className="text-foreground font-semibold">
                      NID-verified identities:
                    </strong>{" "}
                    Every seller is authenticated with National ID and phone verification.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
                  <span>
                    <strong className="text-foreground font-semibold">
                      Component-level honesty:
                    </strong>{" "}
                    Battery health %, repair history, and replaced parts explicitly listed.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
                  <span>
                    <strong className="text-foreground font-semibold">
                      48-hour buyer protection:
                    </strong>{" "}
                    Safe escrow with Cash on Delivery and dispute resolution nationwide.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Interactive 32-Point Blueprint / Inspection Visualizer ── */}
      <section className="border-b border-border bg-card py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <ShieldCheck className="size-4 text-primary" />
                <span>The Diagnostic Standard</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
                How We Inspect Every Single Device
              </h2>
              <p className="text-xs sm:text-sm text-subtle-foreground leading-relaxed">
                Click a category below to explore the exact hardware checklist our moderation and
                diagnostic engine uses before any listing is allowed to go live.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2.5 text-xs font-display font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-colors shrink-0"
            >
              <span>Explore Verified Catalog</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Inspection Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-4">
            {inspectionCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.id === activeInspectionTab;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveInspectionTab(cat.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-display font-bold tracking-wider uppercase transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground border-b-2 border-primary"
                      : "bg-background border border-border text-subtle-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Inspection Checklist Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentInspection.checks.map((chk, i) => (
              <div
                key={chk.name}
                className="border border-border bg-background p-5 space-y-3 flex flex-col justify-between group hover:border-primary/40 transition-colors relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                    CHECK #0{i + 1}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    <CheckCheck className="size-3" />
                    {chk.status}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <h4 className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {chk.name}
                  </h4>
                  <p className="text-xs text-subtle-foreground leading-relaxed">{chk.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-border bg-muted/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-subtle-foreground">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                A+
              </div>
              <p>
                <strong className="text-foreground font-semibold">Standardized Grading:</strong>{" "}
                Every check contributes to the final Grade rating (A+, A, B, C, or D) displayed
                prominently on the product card.
              </p>
            </div>
            <Link
              to="/contact"
              className="text-xs font-display font-bold uppercase tracking-wider text-primary hover:underline shrink-0"
            >
              Read Full Grading Rubric →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Creative Bento Grid: 4 Pillars of Resale ── */}
      <section className="border-b border-border bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Core Principles
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Built on 4 Uncompromising Pillars
            </h2>
            <p className="text-xs sm:text-sm text-subtle-foreground">
              Every design, policy, and code deployment at Resale answers to these non-negotiable
              principles.
            </p>
          </div>

          {/* 4 Pillars Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-5 text-left">
            {/* Pillar 1: Radical Transparency (Span 3) */}
            <div className="md:col-span-3 border border-border bg-card p-6 sm:p-8 flex flex-col justify-between space-y-4 group hover:border-primary/40 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Eye className="size-5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase">
                  Pillar 01
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
                  Radical Transparency
                </h3>
                <p className="text-xs sm:text-sm text-subtle-foreground leading-relaxed">
                  We require sellers to photograph real cosmetic imperfections and disclose exact
                  battery health percentages, repair histories, and included accessories. No stock
                  photos, no sugarcoating.
                </p>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <span>• True Condition Score</span>
                <span>• Unaltered Photos</span>
                <span>• Diagnostic Logs</span>
              </div>
            </div>

            {/* Pillar 2: NID Verification & Accountability (Span 3) */}
            <div className="md:col-span-3 border border-border bg-card p-6 sm:p-8 flex flex-col justify-between space-y-4 group hover:border-primary/40 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="size-5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                  Pillar 02
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
                  National ID Verification
                </h3>
                <p className="text-xs sm:text-sm text-subtle-foreground leading-relaxed">
                  Anonymous fraud ends here. Individual and merchant sellers undergo National
                  Identity Card (NID) and verified phone binding before publishing listings,
                  establishing true trust.
                </p>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <span>• Verified Citizen Identity</span>
                <span>• Merchant Reputation</span>
                <span>• 0 Stolen Devices</span>
              </div>
            </div>

            {/* Pillar 3: 48-Hour Buyer Protection & Fair Escrow (Span 3) */}
            <div className="md:col-span-3 border border-border bg-card p-6 sm:p-8 flex flex-col justify-between space-y-4 group hover:border-primary/40 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ea580c]">
                  <Scale className="size-5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#ea580c] uppercase">
                  Pillar 03
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
                  48-Hour Protection &amp; Escrow
                </h3>
                <p className="text-xs sm:text-sm text-subtle-foreground leading-relaxed">
                  When you purchase on Resale, seller funds are held in secure escrow. You have a
                  full 48-hour testing window upon delivery to verify every hardware claim before
                  payouts are released.
                </p>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <span>• Cash on Delivery</span>
                <span>• Dispute Mediation</span>
                <span>• Guaranteed Refunds</span>
              </div>
            </div>

            {/* Pillar 4: Environmental Circularity (Span 3) */}
            <div className="md:col-span-3 border border-border bg-card p-6 sm:p-8 flex flex-col justify-between space-y-4 group hover:border-primary/40 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
                  <Leaf className="size-5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
                  Pillar 04
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
                  E-Waste Reduction &amp; Circularity
                </h3>
                <p className="text-xs sm:text-sm text-subtle-foreground leading-relaxed">
                  Every pre-owned device bought on Resale extends electronic lifecycle by 2.8+
                  years, directly reducing raw cobalt and rare-earth mining demand while preventing
                  toxic landfill pollution.
                </p>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <span>• 14,000+ kg Saved</span>
                <span>• Carbon Offset</span>
                <span>• Circular Economy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Origin Story & Interactive Timeline ── */}
      <section className="border-b border-border bg-card py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              From a Dhaka Living Room to Nationwide Standard
            </h2>
            <p className="text-xs sm:text-sm text-subtle-foreground leading-relaxed">
              How a team of Bangladeshi engineers and e-commerce veterans set out to fix pre-owned
              tech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {timelineMilestones.map((item, idx) => (
              <div
                key={item.year + item.quarter}
                className="border border-border bg-background p-6 space-y-4 flex flex-col justify-between relative group hover:border-primary/40 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-foreground">
                      {item.year}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        {item.quarter}
                      </span>
                    </span>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 px-2 py-0.5">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground pt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-subtle-foreground leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-3 border-t border-border/60 text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                  <span>Step 0{idx + 1}</span>
                  <span className="text-primary font-bold">●</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Nationwide Logistics & Ecosystem Reach ── */}
      <section className="border-b border-border bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Nationwide Coverage
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                Connecting Buyers and Sellers in All 64 Districts
              </h2>
              <p className="text-xs sm:text-sm text-subtle-foreground leading-relaxed">
                Whether you are in Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur,
                or Mymensingh, Resale provides door-to-door courier pickup, condition-verified
                packaging, and insured delivery.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="border border-border p-3.5 bg-card">
                <span className="font-mono text-lg font-bold text-foreground block">
                  8 Divisions
                </span>
                <span className="text-xs text-muted-foreground">
                  Full regional logistics hub connectivity
                </span>
              </div>
              <div className="border border-border p-3.5 bg-card">
                <span className="font-mono text-lg font-bold text-foreground block">
                  24-48 Hours
                </span>
                <span className="text-xs text-muted-foreground">
                  Average delivery time across major metro areas
                </span>
              </div>
              <div className="border border-border p-3.5 bg-card">
                <span className="font-mono text-lg font-bold text-foreground block">
                  bKash &amp; COD
                </span>
                <span className="text-xs text-muted-foreground">
                  Cash on delivery and instant mobile payments
                </span>
              </div>
              <div className="border border-border p-3.5 bg-card">
                <span className="font-mono text-lg font-bold text-foreground block">
                  B2B Liquidation
                </span>
                <span className="text-xs text-muted-foreground">
                  Official partner program for brands &amp; retailers
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/partner"
                className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-[#ea580c] hover:underline"
              >
                <span>Learn about our B2B Inventory &amp; Partner Program</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 border border-border p-6 bg-card flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-full max-w-sm">
              <BangladeshMapSVG />
            </div>
            <p className="text-[11px] font-mono text-muted-foreground">
              Resale Nationwide Hubs · Dhaka HQ · Chattogram Port Depot · Sylhet Tech Center
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. Our Cultural Manifesto ── */}
      <section className="border-b border-border bg-card py-16 md:py-20 text-center">
        <div className="mx-auto max-w-4xl px-5 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Our Manifesto
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
              &ldquo;Technology Shouldn&apos;t Expire Just Because It Got Upgraded.&rdquo;
            </h2>
          </div>

          <p className="text-sm sm:text-base text-subtle-foreground leading-relaxed max-w-2xl mx-auto">
            We believe that every smartphone, laptop, camera, and console has multiple lives to
            live. When we make resale transparent, safe, and dignified, everyone wins: buyers get
            premium devices at factory prices, sellers monetize unused gear, and Bangladesh takes a
            meaningful leap forward in circular commerce.
          </p>

          <div className="border-t border-border pt-8 max-w-lg mx-auto flex items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
            <span>Built with ❤️ in Bangladesh</span>
            <span>·</span>
            <span>Resale.com Limited</span>
          </div>
        </div>
      </section>

      {/* ── 8. Call to Action Banner ── */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="border-2 border-primary bg-primary/5 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Join the Movement
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Ready to Experience Transparent Resale?
              </h3>
              <p className="text-xs sm:text-sm text-subtle-foreground">
                Browse thousands of inspected listings or turn your idle devices into cash today.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground font-display font-semibold text-xs px-6 py-3.5 uppercase tracking-wider hover:opacity-90 transition-opacity text-center shadow-xs"
              >
                Browse Verified Devices
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center justify-center border border-border bg-background text-foreground font-display font-semibold text-xs px-6 py-3.5 uppercase tracking-wider hover:bg-muted transition-colors text-center"
              >
                Sell an Item →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
