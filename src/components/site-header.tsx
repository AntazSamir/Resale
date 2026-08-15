import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User } from "lucide-react";
import { BangladeshMapSVG } from "./bangladesh-map";

export function SiteHeader() {
  return (
    <div>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-6 overflow-hidden">
        <span>⚡ OPEN-BOX &amp; PRE-OWNED ELECTRONICS AT FACTORY PRICES</span>
        <span className="hidden md:inline font-normal opacity-80">|</span>
        <span className="hidden md:inline">PASSES 13+ COMPONENT CHECKS</span>
        <span className="hidden md:inline font-normal opacity-80">|</span>
        <span className="hidden lg:inline">NID-VERIFIED SELLERS &amp; 48H BUYER PROTECTION</span>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight">
            RESALE<span className="text-muted-foreground">.com</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-subtle-foreground md:flex">
            <Link to="/" className="transition-colors hover:text-foreground">
              Browse
            </Link>
            <span className="cursor-default">Smartphones</span>
            <span className="cursor-default">Laptops</span>
            <span className="cursor-default">Cameras</span>
          </nav>
          <div className="ml-auto hidden flex-1 items-center gap-2 border border-border px-3 py-2 text-sm md:flex md:max-w-sm">
            <Search className="size-4 text-muted-foreground" />
            <input
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="Search products, brands, models"
              aria-label="Search listings"
            />
          </div>
          <div className="ml-auto flex items-center gap-4 md:ml-0">
            <Link
              to="/sell"
              className="hidden md:block text-sm font-medium text-primary hover:underline"
            >
              Sell an item
            </Link>
            <Link
              to="/login"
              aria-label="Account"
              className="text-subtle-foreground hover:text-foreground"
            >
              <User className="size-5" />
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="text-subtle-foreground hover:text-foreground"
            >
              <ShoppingBag className="size-5" />
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card/60">
      {/* Newsletter & Deal Alerts Header */}
      <div className="border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-display font-semibold text-foreground">
              Never miss a Grade A+ open-box drop
            </h3>
            <p className="text-xs text-subtle-foreground mt-1">
              Get notified when high-demand iPhones, MacBooks, and cameras are listed at verified
              discount prices.
            </p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2 max-w-md">
            <input
              type="email"
              placeholder="Enter your phone or email address"
              className="bg-background border border-border px-4 py-2.5 text-sm rounded-lg outline-none focus:border-primary flex-1 min-w-60"
            />
            <button className="bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      {/* Light Mode Giant Watermark Banner Section */}
      <div className="border-b border-border bg-muted/40 pt-16 pb-6 px-5 text-center relative overflow-hidden select-none">
        <div className="mx-auto max-w-7xl relative z-10 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <span className="font-display font-black text-foreground/30 text-[13vw] md:text-[11vw] tracking-tighter leading-none uppercase mask-[linear-gradient(to_bottom,black_30%,transparent_100%)]">
              RESALE
            </span>
            <BangladeshMapSVG />
          </div>
        </div>
      </div>{" "}
      {/* Main Footer Links Grid with Hairline Border Grid */}
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="hairline-grid grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 bg-card">
          {/* Brand Info Column */}
          <div className="col-span-1 lg:col-span-2 p-6 md:p-8 space-y-4">
            <Link
              to="/"
              className="font-display text-xl font-bold tracking-tight text-foreground block"
            >
              RESALE<span className="text-primary">.com</span>
            </Link>
            <p className="text-xs text-subtle-foreground leading-relaxed max-w-sm">
              Bangladesh&apos;s premier C2C marketplace for quality-checked pre-owned, open-box, and
              like-new electronics. Powered by NID verification, objective 13-point condition
              grading, and 48-hour buyer protection.
            </p>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-primary/10 text-primary border border-primary/20 font-medium px-2.5 py-1 rounded">
                ✓ NID Verified Sellers
              </span>
              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium px-2.5 py-1 rounded">
                ✓ 48-Hour Dispute Protection
              </span>
            </div>
          </div>

          {/* Explore Categories */}
          <div className="p-6 md:p-8 space-y-2.5">
            <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/70">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Smartphones &amp; iPhones
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Laptops &amp; MacBooks
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Cameras &amp; Lenses
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Audio &amp; Earbuds
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Smartwatches
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Gaming Consoles
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div className="p-6 md:p-8 space-y-2.5">
            <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/70">
              Sellers
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  to="/sell"
                  className="hover:text-foreground transition-colors font-medium text-primary"
                >
                  List an Item
                </Link>
              </li>
              <li>
                <Link to="/seller/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/seller/listings" className="hover:text-foreground transition-colors">
                  My Listings
                </Link>
              </li>
              <li>
                <Link to="/seller/payouts" className="hover:text-foreground transition-colors">
                  Payouts
                </Link>
              </li>
              <li>
                <Link to="/seller/dashboard" className="hover:text-foreground transition-colors">
                  NID Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="p-6 md:p-8 space-y-2.5">
            <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/70">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Grading System (A+ – D)
                </Link>
              </li>
              <li>
                <Link to="/account/disputes" className="hover:text-foreground transition-colors">
                  48-Hr Dispute Policy
                </Link>
              </li>
              <li>
                <Link to="/account/disputes" className="hover:text-foreground transition-colors">
                  Moderation Rules
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Anti-Fraud Protection
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Coverage Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground text-[11px] uppercase tracking-wider">
              Payments:
            </span>
            <span className="bg-background border border-border px-2 py-1 rounded text-[11px] font-semibold text-rose-600">
              bKash
            </span>
            <span className="bg-background border border-border px-2 py-1 rounded text-[11px] font-semibold text-amber-600">
              Nagad
            </span>
            <span className="bg-background border border-border px-2 py-1 rounded text-[11px] font-semibold text-purple-600">
              Rocket
            </span>
            <span className="bg-background border border-border px-2 py-1 rounded text-[11px]">
              Cash on Delivery
            </span>
            <span className="bg-background border border-border px-2 py-1 rounded text-[11px]">
              Visa / Mastercard
            </span>
          </div>
          <div className="text-subtle-foreground text-[11px] shrink-0">
            Nationwide · Dhaka · Chattogram · Sylhet · Rajshahi · Khulna · All 64 Districts
          </div>
        </div>
      </div>
      {/* Unique Bottom Bar */}
      <div className="border-t border-border bg-background py-6 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span>© 2026 Resale.com Limited</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              🇧🇩 Bangladesh (BDT ৳)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
            <span>·</span>
            <span>Version 3.0 Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
