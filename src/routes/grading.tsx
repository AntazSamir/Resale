import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Lock,
  Battery,
  Layers,
  Wrench,
  HelpCircle,
  Smartphone,
  Check,
  AlertTriangle,
  RotateCcw,
  Sliders,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { type Grade } from "@/data/catalog";
import { gradingCriteria, evaluateGrading, type GradingAnswers } from "@/data/grading";
import { GradeBadge } from "@/components/grade-badge";
import { ConditionScore } from "@/components/condition-score";

export const Route = createFileRoute("/grading")({
  head: () => ({
    meta: [
      { title: "Grading System (A+ to D) — Resale.com Standardized Condition Guide" },
      {
        name: "description",
        content:
          "Learn how Resale grades used and open-box electronics in Bangladesh. Objective 100-point scoring, 32-point inspection checks, and 48-hour buyer protection against condition mismatches.",
      },
      {
        property: "og:title",
        content: "Grading System (A+ to D) — Resale.com Standardized Condition Guide",
      },
      {
        property: "og:description",
        content:
          "Objective A+ to D condition tiers, 32-point hardware inspection standards, and real-time grading simulator.",
      },
    ],
  }),
  component: GradingPage,
});

const gradeTiers: {
  grade: Grade;
  name: string;
  badgeBg: string;
  scoreRange: string;
  summary: string;
  cosmetics: string;
  screen: string;
  battery: string;
  functionality: string;
  accessories: string;
}[] = [
  {
    grade: "A+",
    name: "Like New / Pristine",
    badgeBg: "bg-emerald-500",
    scoreRange: "95 – 100",
    summary:
      "Flawless physical and functional condition. Appears brand-new with zero signs of previous use.",
    cosmetics: "No scratches, scuffs, dents, or discolouration on frame or back panel.",
    screen: "Pristine factory original display with zero micro-scratches or dead pixels.",
    battery: "95% – 100% original capacity (or factory new replacement).",
    functionality: "100% tested across all 32 hardware inspection points.",
    accessories: "Includes original box, authentic charging brick, and cable.",
  },
  {
    grade: "A",
    name: "Excellent Condition",
    badgeBg: "bg-teal-500",
    scoreRange: "85 – 94",
    summary:
      "Near-mint device with faint micro-scratches only noticeable under direct light inspection.",
    cosmetics: "Micro-hairlines on bezel or edges invisible at 30cm viewing distance.",
    screen:
      "Original display with minimal hairline marks that disappear when screen is illuminated.",
    battery: "90% – 94% reported battery health capacity.",
    functionality: "100% fully functional with OEM internal components.",
    accessories: "Original or certified high-speed charger and cable included.",
  },
  {
    grade: "B",
    name: "Good Condition",
    badgeBg: "bg-amber-500",
    scoreRange: "72 – 84",
    summary:
      "Moderate, everyday cosmetic wear. 100% fully functional hardware offered at significant savings.",
    cosmetics:
      "Visible surface scratches, light pocket scuffs on corners; zero cracks or structural bends.",
    screen: "Visible surface scratches present; zero cracks, burn-in, or touch dead-zones.",
    battery: "80% – 89% reported battery health capacity.",
    functionality: "All cameras, biometric sensors, ports, and wireless bands 100% active.",
    accessories: "Includes functional certified charging cable; original box may be absent.",
  },
  {
    grade: "C",
    name: "Fair Condition",
    badgeBg: "bg-orange-500",
    scoreRange: "55 – 71",
    summary: "Heavy cosmetic wear or officially disclosed repairs. Core features 100% operational.",
    cosmetics: "Noticeable dents, corner nicks, paint chipping, or heavy chassis wear.",
    screen: "Heavily scratched or certified third-party replacement display (always disclosed).",
    battery: "Under 80% capacity or service notice (disclosed on listing).",
    functionality: "Core operating system and primary hardware fully operational.",
    accessories: "Device only or standard third-party charging cable.",
  },
  {
    grade: "D",
    name: "As-Is / Parts & Repair",
    badgeBg: "bg-rose-500",
    scoreRange: "Below 55",
    summary: "Known hardware limitation, minor component defect, or sold strictly as parts donor.",
    cosmetics: "Significant cosmetic damage, deep scratches, or casing cracks.",
    screen: "Defective display, touch anomaly, or cracked outer glass layer.",
    battery: "Degraded battery or requires AC adapter connection.",
    functionality: "Has specific functional limitations clearly detailed in seller report.",
    accessories: "Device only without accessories.",
  },
];

const inspectionPoints = [
  {
    category: "Physical & Chassis",
    checks: [
      "Chassis structural integrity (zero bend/warp)",
      "Bezel, frame & corner drop impact evaluation",
      "Back glass & camera lens crack inspection",
      "SIM tray & physical button tactile click",
      "Hinge & keyboard alignment (for Laptops)",
      "Dust, port & speaker grille cleanliness",
    ],
  },
  {
    category: "Display & Touch Diagnostics",
    checks: [
      "Multi-touch digitized touch grid test",
      "RGB dead pixel & sub-pixel discoloration test",
      "OLED burn-in & backlight bleed evaluation",
      "Apple True Tone / True Color ambient sensor",
      "Auto-brightness ambient light sensor",
      "High refresh rate (120Hz ProMotion) smoothness",
    ],
  },
  {
    category: "Camera & Optical Sensors",
    checks: [
      "Primary, Ultrawide & Telephoto sensor focus",
      "Front-facing selfie camera & portrait depth",
      "Optical Image Stabilization (OIS) gyro test",
      "Microphone audio recording in video modes",
      "LED True Tone flash synchronization",
      "LiDAR / Time-of-Flight 3D scanner test",
    ],
  },
  {
    category: "Connectivity & Audio",
    checks: [
      "Dual SIM / eSIM cellular band registration",
      "Wi-Fi 6 / 6E throughput & 5GHz range test",
      "Bluetooth 5.3 pairing & accessory handshake",
      "Stereo speaker loudness & bass distortion test",
      "Earpiece receiver volume clarity",
      "GPS & digital compass direction calibration",
    ],
  },
  {
    category: "Security & Cloud Authentication",
    checks: [
      "iCloud / Apple ID Activation Lock removed",
      "Google Account FRP lock wiped clean",
      "Face ID / Touch ID / In-display fingerprint test",
      "Official Bangladesh BTRC IMEI registration check",
      "Carrier / SIM network unlock verification",
      "Diagnostic serial number authenticity audit",
    ],
  },
];

function GradingPage() {
  const [testAnswers, setTestAnswers] = useState<GradingAnswers>({
    physical: "pristine",
    screen: "original",
    functionality: "full",
    battery: "95",
    repairs: "none",
  });

  const [activeTab, setActiveTab] = useState<Grade>("A+");

  const result = evaluateGrading(testAnswers);

  const handleSelectOption = (criterionId: string, value: string) => {
    setTestAnswers((prev) => ({ ...prev, [criterionId]: value }));
  };

  const handleReset = () => {
    setTestAnswers({
      physical: "pristine",
      screen: "original",
      functionality: "full",
      battery: "95",
      repairs: "none",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* ════════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-border bg-card/60 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/25 px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="size-4" />
              <span>Standardized Quality Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.1]">
              Resale.com Condition Grading Standard (A+ to D)
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              In secondary electronics, vague descriptions like &ldquo;gently used&rdquo; or
              &ldquo;fresh condition&rdquo; lead to disputes. Resale replaces subjective claims with
              an objective 100-point condition matrix backed by a 32-point hardware inspection.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#interactive-evaluator"
                className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-sm"
              >
                <Sliders className="size-4" />
                <span>Try Live Grade Simulator</span>
              </a>
              <Link
                to="/products"
                search={{ q: undefined, category: undefined, brand: undefined }}
                className="inline-flex items-center gap-2 bg-background border border-border px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                <span>Browse Graded Catalog</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          KEY PILLARS (01–04)
      ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-border py-8 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: FileCheck2,
                title: "100-Point Formula",
                desc: "Weighted scoring across Chassis (25%), Screen (25%), Functionality (25%), Battery (15%) & Repairs (10%).",
              },
              {
                icon: Lock,
                title: "Worst-Case Capping",
                desc: "A single critical defect (e.g. cracked glass) strictly caps the maximum grade regardless of total score.",
              },
              {
                icon: Battery,
                title: "Battery Health Truth",
                desc: "Reported battery capacity is verified directly via diagnostic cycles — never estimated.",
              },
              {
                icon: RotateCcw,
                title: "48h Return Guarantee",
                desc: "If a device arrives in a lower condition than its certified grade, receive a full refund with zero hassle.",
              },
            ].map((p, i) => (
              <div key={p.title} className="border border-border bg-card p-4.5 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <span className="size-6 bg-primary/10 flex items-center justify-center rounded-xs">
                    0{i + 1}
                  </span>
                  <p className="text-foreground text-sm font-semibold">{p.title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          GRADE TIERS DEEP DIVE (Tabs + Detailed Breakdown)
      ════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Detailed Grade Specifications
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              Every listing on Resale is assigned one of five standard tiers based on strict
              physical and diagnostic thresholds.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex overflow-x-auto scrollbar-none gap-2 pb-2 mb-6 border-b border-border">
            {gradeTiers.map((t) => (
              <button
                key={t.grade}
                type="button"
                onClick={() => setActiveTab(t.grade)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all shrink-0 border-b-2 -mb-px ${
                  activeTab === t.grade
                    ? "border-primary text-foreground bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span className={`size-2 rounded-full ${t.badgeBg}`} />
                <span>Grade {t.grade}</span>
                <span className="text-[11px] font-normal text-muted-foreground hidden sm:inline">
                  ({t.scoreRange} pts)
                </span>
              </button>
            ))}
          </div>

          {/* Active Tier Card */}
          {(() => {
            const current = gradeTiers.find((g) => g.grade === activeTab) ?? gradeTiers[0]!;
            return (
              <div className="border border-border bg-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                  <div className="flex items-center gap-3.5">
                    <GradeBadge
                      grade={current.grade}
                      className="text-base px-3.5 py-1.5 font-bold"
                    />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                        {current.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Condition Score Target:{" "}
                        <span className="font-semibold text-foreground">
                          {current.scoreRange} / 100 points
                        </span>
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/products"
                    search={{ q: undefined, category: undefined, brand: undefined }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>View Grade {current.grade} Listings</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                <p className="text-sm text-foreground font-medium bg-muted/50 p-3.5 border border-border/80">
                  💡 {current.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 p-3.5 bg-background border border-border">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Layers className="size-3.5 text-primary" /> Body &amp; Frame Cosmetics
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{current.cosmetics}</p>
                  </div>

                  <div className="space-y-1.5 p-3.5 bg-background border border-border">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Smartphone className="size-3.5 text-primary" /> Display &amp; Touch Screen
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{current.screen}</p>
                  </div>

                  <div className="space-y-1.5 p-3.5 bg-background border border-border">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Battery className="size-3.5 text-primary" /> Battery Health Capacity
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{current.battery}</p>
                  </div>

                  <div className="space-y-1.5 p-3.5 bg-background border border-border">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-primary" /> 32-Point Functionality
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{current.functionality}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          INTERACTIVE LIVE GRADE EVALUATOR
      ════════════════════════════════════════════════════════════ */}
      <section
        id="interactive-evaluator"
        className="py-12 md:py-16 bg-card/40 border-b border-border"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 mb-2">
              <Sliders className="size-3.5" />
              <span>Interactive Simulator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Test the 100-Point Grading Algorithm
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              Select criteria values below to see how our deterministic algorithm calculates the
              condition score and applies grade caps in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Criteria Selectors (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              {gradingCriteria.map((crit) => (
                <div key={crit.id} className="border border-border bg-card p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{crit.label}</h3>
                      <p className="text-[11px] text-muted-foreground">{crit.help}</p>
                    </div>
                    <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5">
                      {crit.weight} pts
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {crit.options.map((opt) => {
                      const isSelected = testAnswers[crit.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectOption(crit.id, opt.value)}
                          className={`p-3 text-left border text-xs font-medium transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-foreground font-semibold shadow-xs"
                              : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{opt.label}</span>
                            <span className="text-[10.5px] opacity-75 font-mono">
                              +{opt.points}pts
                            </span>
                          </div>
                          {opt.cap && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                              ⚠️ Caps grade at {opt.cap}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Live Result Card (4 cols Sticky) */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="border border-border bg-card p-6 space-y-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Algorithm Output
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="size-3" /> Reset
                  </button>
                </div>

                <div className="text-center space-y-3 py-2">
                  <div className="inline-flex">
                    <GradeBadge grade={result.grade} className="text-2xl px-5 py-2 font-bold" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">
                      {result.conditionScore}{" "}
                      <span className="text-sm font-normal text-muted-foreground">/ 100</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Evaluated Grade:{" "}
                      <span className="font-bold text-foreground">Grade {result.grade}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <ConditionScore score={result.conditionScore} grade={result.grade} />
                </div>

                {result.reasons.length > 0 ? (
                  <div className="space-y-1.5 border-t border-border pt-3">
                    <span className="text-[10.5px] font-bold text-muted-foreground block uppercase">
                      Grade Constraints Applied:
                    </span>
                    {result.reasons.map((r, i) => (
                      <p
                        key={i}
                        className="text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-1 leading-tight"
                      >
                        <span>•</span> <span>{r}</span>
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="border-t border-border pt-3">
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="size-3.5" /> All criteria meet pristine A+ requirements.
                    </p>
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <Link
                    to="/sell"
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <span>List a Device with This Grade</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          32-POINT INSPECTION CHECKLIST
      ════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              32-Point Hardware Inspection Breakdown
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              Before any device is certified on Resale, every one of these 32 individual hardware
              checks is conducted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {inspectionPoints.map((cat, idx) => (
              <div key={cat.category} className="border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <span className="size-6 bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-foreground">{cat.category}</h3>
                </div>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {cat.checks.map((chk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{chk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CALL TO ACTION BANNER
      ════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-card/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Ready to buy with full condition confidence?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Every listing on Resale comes with full 32-point inspection disclosure, NID seller
            verification, and a 48-hour inspection guarantee.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/products"
              search={{ q: undefined, category: undefined, brand: undefined }}
              className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <span>Explore Graded Electronics</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 bg-background border border-border px-6 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted"
            >
              <span>Sell a Device</span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
