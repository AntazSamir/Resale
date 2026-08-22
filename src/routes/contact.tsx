import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  HelpCircle,
  Mail,
  MessageSquare,
  Clock,
  Phone,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Building2,
  Send,
  Recycle,
  Check,
  DollarSign,
  Search,
  Eye,
  Award,
  Users,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GradeBadge } from "@/components/grade-badge";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us & Help Center | Resale.com" },
      {
        name: "description",
        content:
          "Have questions about buying, selling, condition grades or buyer protection on Resale? Contact support or read our comprehensive guide.",
      },
    ],
  }),
  component: ContactPage,
});

export default function ContactPage() {
  const [formSent, setFormSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const faqItems = [
    {
      question: "What is Resale?",
      answer: (
        <div className="space-y-3 text-sm text-subtle-foreground leading-relaxed">
          <p>
            Resale is Bangladesh&apos;s marketplace for quality-checked pre-owned, open-box, and
            like-new electronics.
          </p>
          <p>
            You can discover products from individual sellers and verified sellers, compare
            listings, review product condition, check seller information, and purchase through a
            structured e-commerce experience.
          </p>
          <p>
            Unlike traditional classifieds platforms, Resale is designed around transparent product
            information, condition grading, seller reputation, and buyer protection.
          </p>
        </div>
      ),
    },
    {
      question: "Where do Resale products come from?",
      answer: (
        <div className="space-y-4 text-sm text-subtle-foreground leading-relaxed">
          <p>
            Products listed on Resale can come from people and sellers who are looking to sell
            electronics they no longer need.
          </p>
          <p className="font-medium text-foreground">This may include:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Smartphones",
              "Laptops",
              "Tablets",
              "Headphones & earbuds",
              "Smartwatches",
              "Cameras",
              "Gaming consoles",
              "Monitors & TVs",
              "Speakers",
              "Computer accessories",
              "Mobile accessories",
              "Other electronics",
            ].map((cat) => (
              <span
                key={cat}
                className="border border-border bg-muted px-2.5 py-1 text-xs text-foreground font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
          <p>
            Each seller provides information about their specific product, including its condition,
            specifications, images, warranty status, invoice availability, and included accessories.
          </p>
        </div>
      ),
    },
    {
      question: "What Does the Condition Grade Mean?",
      answer: (
        <div className="space-y-4 text-sm text-subtle-foreground leading-relaxed">
          <p>
            At Resale, we don&apos;t want you to rely on vague descriptions like &quot;good
            condition&quot; or &quot;looks new.&quot;
          </p>
          <p className="font-medium text-foreground">
            Every listing uses a structured condition grading system:
          </p>
          <div className="space-y-2 border-t border-border pt-3">
            {[
              {
                grade: "A+",
                label: "Like New",
                desc: "Minimal or virtually no signs of use.",
              },
              {
                grade: "A",
                label: "Excellent",
                desc: "Very good condition with minor signs of use.",
              },
              {
                grade: "B",
                label: "Good",
                desc: "Visible signs of normal use, while remaining functional.",
              },
              {
                grade: "C",
                label: "Fair",
                desc: "More noticeable signs of use, clearly described in the listing.",
              },
              {
                grade: "D",
                label: "Heavy Wear / Limited",
                desc: "Significant signs of use or limitations that are clearly disclosed.",
              },
            ].map((item) => (
              <div
                key={item.grade}
                className="flex items-start gap-3 border-b border-border/60 pb-2.5 last:border-b-0"
              >
                <span className="grade-chip size-7 text-xs shrink-0">{item.grade}</span>
                <div>
                  <span className="font-semibold text-foreground">{item.label}: </span>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs italic text-muted-foreground">
            Condition grades must be supported by component-level information, rather than being
            just a subjective letter.
          </p>
        </div>
      ),
    },
    {
      question: "What Do You Check Before Buying?",
      answer: (
        <div className="space-y-4 text-sm text-subtle-foreground leading-relaxed">
          <p>
            Every listing is designed to provide buyers with useful information about the actual
            unit being sold. Depending on the product category, information can include:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="border border-border p-4 bg-muted/20 space-y-2">
              <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">
                Physical Condition
              </h4>
              <ul className="text-xs space-y-1 text-subtle-foreground">
                <li>• Screen</li>
                <li>• Body / frame</li>
                <li>• Back panel</li>
                <li>• Camera lenses</li>
                <li>• Buttons &amp; Dials</li>
                <li>• Ports &amp; charging</li>
              </ul>
            </div>
            <div className="border border-border p-4 bg-muted/20 space-y-2">
              <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">
                Performance
              </h4>
              <ul className="text-xs space-y-1 text-subtle-foreground">
                <li>• Battery health</li>
                <li>• Charging speed</li>
                <li>• Speaker &amp; mic</li>
                <li>• Wi-Fi &amp; Bluetooth</li>
                <li>• Cellular connectivity</li>
                <li>• Thermals</li>
              </ul>
            </div>
            <div className="border border-border p-4 bg-muted/20 space-y-2">
              <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">
                Product History
              </h4>
              <ul className="text-xs space-y-1 text-subtle-foreground">
                <li>• Repairs disclosure</li>
                <li>• Replaced parts</li>
                <li>• Water damage check</li>
                <li>• Warranty months</li>
                <li>• Purchase date</li>
                <li>• Invoice availability</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            For smartphones, additional information includes battery health percentage,
            activation-lock status, network-lock status, and full repair history.
          </p>
        </div>
      ),
    },
    {
      question: "Why Buy on Resale?",
      answer: (
        <div className="space-y-3 text-sm text-subtle-foreground leading-relaxed">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="font-bold text-foreground shrink-0">💰 Better Value:</span>
              <span>
                Get quality electronics at resale prices instead of always paying the price of a
                brand-new product.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-foreground shrink-0">🔍 Transparent Condition:</span>
              <span>
                Know what you&apos;re buying before you pay. Product condition, specifications,
                warranty information, and accessories are presented clearly.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-foreground shrink-0">🛡️ Trusted Sellers:</span>
              <span>
                Review seller information, NID verification, and reputation before choosing a
                listing.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-foreground shrink-0">
                📋 Detailed Product Information:
              </span>
              <span>
                Compare multiple listings for the same product and choose the one that offers the
                best combination of price, condition, warranty, and seller reputation.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-foreground shrink-0">
                ♻️ Give Electronics a Second Life:
              </span>
              <span>
                Buying and selling pre-owned electronics helps keep products in circulation for
                longer and reduces unnecessary electronic waste.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "How Does Resale Build Trust?",
      answer: (
        <div className="space-y-3 text-sm text-subtle-foreground leading-relaxed">
          <p>
            Buying a used electronic product online can feel risky. That&apos;s why transparency is
            at the heart of Resale:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="border border-border p-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">
                🔍 Condition Transparency
              </p>
              <p className="text-xs">
                Every product has a defined condition grade supported by detailed inspection
                information.
              </p>
            </div>
            <div className="border border-border p-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">
                👤 Seller Information
              </p>
              <p className="text-xs">
                Buyers can review seller information, sales counts, and verified status before
                purchasing.
              </p>
            </div>
            <div className="border border-border p-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">
                📸 Real Product Information
              </p>
              <p className="text-xs">
                Sellers provide product images and relevant specifications so buyers can understand
                what they&apos;re purchasing.
              </p>
            </div>
            <div className="border border-border p-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">
                🧾 Warranty &amp; Invoice Info
              </p>
              <p className="text-xs">
                Where applicable, sellers disclose warranty status, purchase information, and
                invoice availability.
              </p>
            </div>
            <div className="border border-border p-3 sm:col-span-2">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">
                🛡️ Moderated Marketplace
              </p>
              <p className="text-xs">
                Listings go through a moderation process before becoming live on the marketplace:
                draft → pending review → approved → live.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      question: "How Safe Is Buying on Resale?",
      answer: (
        <div className="space-y-3 text-sm text-subtle-foreground leading-relaxed">
          <p>
            Resale is designed to provide buyers with an e-commerce-style purchasing experience
            rather than a simple &quot;message the seller and negotiate&quot; marketplace.
          </p>
          <p className="font-medium text-foreground">You can seamlessly:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-foreground">
            <span className="border border-border bg-muted/40 p-2 text-center">✓ Add to Cart</span>
            <span className="border border-border bg-muted/40 p-2 text-center">✓ Buy Directly</span>
            <span className="border border-border bg-muted/40 p-2 text-center">
              ✓ Choose Address
            </span>
            <span className="border border-border bg-muted/40 p-2 text-center">
              ✓ Pay (COD/Online)
            </span>
            <span className="border border-border bg-muted/40 p-2 text-center">✓ Track Order</span>
            <span className="border border-border bg-muted/40 p-2 text-center">
              ✓ 48h Protection
            </span>
            <span className="border border-border bg-muted/40 p-2 text-center">✓ Report Issue</span>
            <span className="border border-border bg-muted/40 p-2 text-center">
              ✓ Review Seller
            </span>
          </div>
          <p className="font-semibold text-foreground pt-1">
            Your confidence matters to us at every step.
          </p>
        </div>
      ),
    },
    {
      question: "Why Choose Pre-Owned Electronics?",
      answer: (
        <div className="space-y-3 text-sm text-subtle-foreground leading-relaxed">
          <p>Buying pre-owned doesn&apos;t have to mean compromising.</p>
          <p>
            A product that no longer works for its original owner can still be the perfect device
            for someone else.
          </p>
          <p>
            Instead of leaving electronics unused in drawers, warehouses, or landfills, Resale helps
            keep them in circulation and in use.
          </p>
          <div className="border border-border bg-card p-4 text-center font-display font-bold text-foreground text-sm uppercase tracking-wider space-y-1">
            <p>Buy smarter.</p>
            <p>Sell easier.</p>
            <p className="text-primary">Keep technology moving.</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {/* ── Page Hero ── */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <HelpCircle className="size-3.5" />
              Customer Support &amp; Knowledge Base
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground">
              How Can We Help?
            </h1>
            <p className="text-base md:text-lg text-subtle-foreground leading-relaxed">
              Have a question about buying, selling, product condition, or your order? Our support
              team is here to help you get the most out of Resale.
            </p>
            <p className="text-sm text-muted-foreground">
              Whether you&apos;re buying your next device or selling one you no longer need,
              we&apos;re here to make the process simple, transparent, and trustworthy.
            </p>
          </div>
        </div>
      </section>

      {/* ── Direct Contact Cards Grid ── */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <div className="hairline-grid grid grid-cols-1 md:grid-cols-3 bg-card">
            {/* WhatsApp */}
            <div className="p-6 space-y-3">
              <div className="size-10 border border-border flex items-center justify-center bg-muted text-emerald-600">
                <MessageSquare className="size-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground">WhatsApp Support</h3>
              <p className="text-xs text-subtle-foreground">
                Chat live with our customer support team for urgent order assistance or verification
                questions.
              </p>
              <p className="font-mono text-sm font-semibold text-foreground">+880 1700-000000</p>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 hover:underline pt-1"
              >
                Open WhatsApp →
              </a>
            </div>

            {/* Email */}
            <div className="p-6 space-y-3">
              <div className="size-10 border border-border flex items-center justify-center bg-muted text-primary">
                <Mail className="size-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground">Email Inquiries</h3>
              <p className="text-xs text-subtle-foreground">
                Send general questions, condition dispute reports, or feedback directly to our
                helpdesk.
              </p>
              <p className="font-mono text-sm font-semibold text-foreground">support@resale.com</p>
              <a
                href="mailto:support@resale.com"
                className="inline-block text-xs font-bold uppercase tracking-wider text-primary hover:underline pt-1"
              >
                Send Email →
              </a>
            </div>

            {/* Support Hours */}
            <div className="p-6 space-y-3">
              <div className="size-10 border border-border flex items-center justify-center bg-muted text-amber-600">
                <Clock className="size-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground">Support Hours</h3>
              <p className="text-xs text-subtle-foreground">
                Our moderation and customer service teams operate 6 days a week across all
                Bangladesh timezones.
              </p>
              <p className="text-sm font-semibold text-foreground">Sat – Thu: 9:00 AM – 9:00 PM</p>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium pt-1">
                <span className="size-2 bg-emerald-500 animate-pulse" />
                Moderation queue active
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content: FAQs + Contact Form ── */}
      <section className="py-14 bg-background">
        <div className="mx-auto max-w-7xl px-5 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FAQ Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-xs md:text-sm text-subtle-foreground mt-1">
                Everything you need to know about purchasing, listing, grading, and safety on
                Resale.
              </p>
            </div>

            <div className="border-t border-border">
              {faqItems.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.question} className="border-b border-border">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full py-4 text-left flex items-center justify-between gap-4 group transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display font-semibold text-base text-foreground group-hover:text-primary">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-foreground" : ""
                        }`}
                      />
                    </button>
                    {isOpen && <div className="pb-5 pt-1 pr-4">{item.answer}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Message Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-border p-6 md:p-8 bg-card space-y-5">
              <div>
                <h3 className="text-xl font-display font-bold text-foreground">
                  Send Us a Message
                </h3>
                <p className="text-xs text-subtle-foreground mt-1">
                  Have an order ID or account question? Fill out the form and our team will get back
                  to you within 4 hours.
                </p>
              </div>

              {formSent ? (
                <div className="border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
                  <CheckCircle2 className="size-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-foreground text-base">Message Received</h4>
                  <p className="text-xs text-subtle-foreground">
                    Thank you! Our support team has logged your ticket and will respond via email
                    shortly.
                  </p>
                  <button
                    onClick={() => setFormSent(false)}
                    className="border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-muted"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-foreground">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-foreground">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="tanvir@example.com"
                      className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-foreground">
                      Subject / Topic
                    </label>
                    <select
                      required
                      className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Tracking &amp; Delivery</option>
                      <option value="dispute">Condition Report &amp; Dispute</option>
                      <option value="selling">Selling &amp; Listing Moderation</option>
                      <option value="verification">Seller NID Verification</option>
                      <option value="partnership">Brand &amp; Inventory Partnership</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-foreground">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your question or issue in detail..."
                      className="w-full bg-background border border-border px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider py-3 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Send className="size-4" />
                    Submit Request
                  </button>
                </form>
              )}
            </div>

            {/* Quick Partner Box */}
            <div className="border border-border p-6 bg-muted/30 space-y-3">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <Building2 className="size-4 text-primary" />
                <span>Bulk &amp; Retailer Inquiries</span>
              </div>
              <p className="text-xs text-subtle-foreground">
                For brand excess inventory, bulk liquidation, or authorized retail partnerships:
              </p>
              <Link
                to="/partner"
                className="inline-block text-xs font-bold uppercase tracking-wider text-primary hover:underline"
              >
                Become a Resale Partner →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Mission Section ── */}
      <section className="border-t border-b border-border bg-card py-16">
        <div className="mx-auto max-w-5xl px-5 space-y-10 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Make Quality Technology More Accessible.
            </h2>
            <p className="text-sm md:text-base text-subtle-foreground leading-relaxed">
              We believe great technology shouldn&apos;t become worthless just because it has been
              previously owned.
            </p>
            <p className="text-xs md:text-sm text-subtle-foreground leading-relaxed">
              Resale connects people who want to sell electronics they no longer need with people
              looking for quality products at better prices. Our goal is to create a resale
              marketplace where buyers can make informed decisions and sellers can get fair value
              for their products.
            </p>
          </div>

          {/* 5 Beliefs Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 text-left pt-4">
            {/* Bento Card 1: Trust Over Guesswork */}
            <div className="col-span-2 md:col-span-3 border border-border bg-background p-5 sm:p-6 flex flex-col justify-between space-y-3 group hover:border-primary/40 transition-all duration-200 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg shrink-0">
                  🤝
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase">
                  01 / Foundation
                </span>
              </div>
              <div className="space-y-1.5 pt-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-foreground tracking-tight">
                  Trust Over Guesswork
                </h3>
                <p className="text-xs sm:text-sm text-subtle-foreground leading-relaxed">
                  We believe buyers deserve clear information before making a purchase.
                </p>
              </div>
            </div>

            {/* Bento Card 2: Transparency Over Vague Descriptions */}
            <div className="col-span-2 md:col-span-3 border border-border bg-background p-5 sm:p-6 flex flex-col justify-between space-y-3 group hover:border-primary/40 transition-all duration-200 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="size-9 rounded-lg bg-muted border border-border flex items-center justify-center text-lg shrink-0">
                  🔍
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase">
                  02 / Clarity
                </span>
              </div>
              <div className="space-y-1.5 pt-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-foreground tracking-tight">
                  Transparency Over Vague Descriptions
                </h3>
                <p className="text-xs sm:text-sm text-subtle-foreground leading-relaxed">
                  Every product should tell its own story — condition, specs, warranty, repairs, and
                  accessories.
                </p>
              </div>
            </div>

            {/* Bento Card 3: Fair Value */}
            <div className="col-span-1 md:col-span-2 border border-border bg-background p-4 sm:p-5 flex flex-col justify-between space-y-3 group hover:border-primary/40 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-base shrink-0">
                  💰
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                  03
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <h3 className="font-display font-bold text-sm sm:text-base text-foreground tracking-tight">
                  Fair Value
                </h3>
                <p className="text-[11px] sm:text-xs text-subtle-foreground leading-relaxed">
                  Buyers want a good deal. Sellers want a fair price. Resale brings both sides
                  together.
                </p>
              </div>
            </div>

            {/* Bento Card 4: More Than One Life */}
            <div className="col-span-1 md:col-span-2 border border-border bg-background p-4 sm:p-5 flex flex-col justify-between space-y-3 group hover:border-primary/40 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="size-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-base shrink-0">
                  ♻️
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
                  04
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <h3 className="font-display font-bold text-sm sm:text-base text-foreground tracking-tight">
                  More Than One Life
                </h3>
                <p className="text-[11px] sm:text-xs text-subtle-foreground leading-relaxed">
                  A device doesn&apos;t stop being useful just because its first owner has upgraded.
                </p>
              </div>
            </div>

            {/* Bento Card 5: Better Resale Experience */}
            <div className="col-span-2 md:col-span-2 border border-border bg-background p-4 sm:p-5 flex flex-col justify-between space-y-3 group hover:border-primary/40 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="size-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-base shrink-0">
                  🚀
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#ea580c] uppercase">
                  05 / Vision
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <h3 className="font-display font-bold text-sm sm:text-base text-foreground tracking-tight">
                  Better Resale Experience
                </h3>
                <p className="text-[11px] sm:text-xs text-subtle-foreground leading-relaxed">
                  We&apos;re building resale to feel like modern e-commerce — not an old-fashioned
                  classifieds marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Have More Questions / Final Callout Banner ── */}
      <section className="bg-background py-14">
        <div className="mx-auto max-w-5xl px-5">
          <div className="border-2 border-[#ea580c] bg-orange-50/40 dark:bg-orange-950/20 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ea580c]">
                Still Have Questions?
              </span>
              <h3 className="text-2xl font-display font-bold text-foreground">
                Can&apos;t find the answer you&apos;re looking for?
              </h3>
              <p className="text-sm text-subtle-foreground">
                We&apos;re here to help. Reach out directly via WhatsApp, email, or explore partner
                options.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href="mailto:support@resale.com"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-sm px-5 py-3 uppercase tracking-wider transition-opacity hover:opacity-90"
              >
                Email Support
              </a>
              <Link
                to="/partner"
                className="inline-flex items-center justify-center bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm px-6 py-3 uppercase tracking-wider transition-colors border border-[#ea580c]"
              >
                Become a Partner →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
