import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Home,
  LayoutGrid,
  Plus,
  MessageSquare,
  ChevronDown,
  ShieldCheck,
  Building2,
  Phone,
  HelpCircle,
  Package,
} from "lucide-react";
import { BangladeshMapSVG } from "./bangladesh-map";
import resaleLogo from "@/assets/resale-logo.png";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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

      {/* Main Header Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between md:justify-start gap-4 md:gap-6 px-4 md:px-5">
          {/* Mobile Left: Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-foreground focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="size-6" />
            </button>
          </div>

          {/* Brand Logo & Name (No Bangladesh map on header) */}
          <Link
            to="/"
            className="inline-flex items-center gap-0.5 font-display text-xl font-bold tracking-tight text-foreground"
          >
            <img
              src={resaleLogo}
              alt="Resale logo"
              className="h-8 md:h-10 w-auto object-contain shrink-0"
            />
            <span className="leading-none flex items-center">RESALE</span>
          </Link>

          {/* Desktop Center: Search Bar */}
          <div className="ml-auto hidden flex-1 items-center gap-2 border border-border px-3 py-2 text-sm md:flex md:max-w-sm">
            <Search className="size-4 text-muted-foreground" />
            <input
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="Search products, brands, models"
              aria-label="Search listings"
            />
          </div>

          {/* Desktop Right: Actions */}
          <div className="ml-auto hidden md:flex items-center gap-4">
            <Link to="/sell" className="text-sm font-medium text-primary hover:underline">
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
              className="relative text-subtle-foreground hover:text-foreground p-1"
            >
              <ShoppingBag className="size-5" />
              <span className="absolute -top-1 -right-1 size-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </Link>
          </div>

          {/* Mobile Right: Search & Cart Icons */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Search"
              className="p-2 text-foreground"
            >
              <Search className="size-5" />
            </button>
            <Link to="/cart" aria-label="Cart" className="relative p-2 text-foreground">
              <ShoppingBag className="size-5" />
              <span className="absolute top-1 right-0.5 size-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Input Dropdown */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-border bg-card p-3">
            <div className="flex items-center gap-2 border border-border bg-background px-3 py-2 text-sm">
              <Search className="size-4 text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search phones, laptops, brands..."
                className="w-full bg-transparent outline-none text-xs text-foreground"
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer / Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-card border-r border-border h-full flex flex-col justify-between overflow-y-auto p-6 z-10 shadow-none">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1 font-display text-lg font-bold tracking-tight"
                >
                  <img
                    src={resaleLogo}
                    alt="Resale logo"
                    className="h-8 w-auto object-contain shrink-0"
                  />
                  <span className="leading-none flex items-center">RESALE</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-foreground hover:bg-muted"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Quick Navigation */}
              <div className="space-y-1 text-sm font-medium">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 hover:bg-muted text-foreground"
                >
                  Home
                </Link>
                <Link
                  to="/sell"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 hover:bg-muted text-[#ea580c] font-bold"
                >
                  Sell an Item
                </Link>
                <Link
                  to="/partner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 hover:bg-muted text-foreground font-semibold"
                >
                  Partner With Resale
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 hover:bg-muted text-foreground"
                >
                  Contact &amp; Help Center
                </Link>
              </div>

              {/* Categories */}
              <div className="border-t border-border pt-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block px-3">
                  Categories
                </span>
                <div className="space-y-1 text-xs text-subtle-foreground">
                  {[
                    { label: "Smartphones & iPhones", to: "/" },
                    { label: "Laptops & MacBooks", to: "/" },
                    { label: "Cameras & Lenses", to: "/" },
                    { label: "Audio & Wearables", to: "/" },
                    { label: "Accessories", to: "/" },
                    { label: "Tablets", to: "/" },
                    { label: "Gaming Consoles", to: "/" },
                  ].map((cat) => (
                    <Link
                      key={cat.label}
                      to={cat.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-muted hover:text-foreground"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Seller Tools */}
              <div className="border-t border-border pt-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block px-3">
                  Sellers &amp; Account
                </span>
                <div className="space-y-1 text-xs text-subtle-foreground">
                  <Link
                    to="/seller/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 hover:bg-muted hover:text-foreground"
                  >
                    Seller Dashboard
                  </Link>
                  <Link
                    to="/seller/listings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 hover:bg-muted hover:text-foreground"
                  >
                    My Listings
                  </Link>
                  <Link
                    to="/seller/payouts"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 hover:bg-muted hover:text-foreground"
                  >
                    Payouts
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Account Button */}
            <div className="border-t border-border pt-4 mt-6">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider py-3 flex items-center justify-center gap-2 hover:opacity-90"
              >
                <User className="size-4" />
                Sign In / Register
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Secondary Category Navigation Bar (Hidden on mobile) */}
      <nav className="hidden md:block sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur shadow-none">
        <div className="mx-auto max-w-7xl px-5 overflow-x-auto scrollbar-none">
          <ul className="flex items-center gap-0 text-[12px] font-medium whitespace-nowrap">
            {[
              { label: "Home", to: "/" },
              { label: "Accessories", to: "/" },
              { label: "Earbuds", to: "/" },
              { label: "Headphones", to: "/" },
              { label: "Home Products", to: "/" },
              { label: "Speakers", to: "/" },
              { label: "Tablets", to: "/" },
              { label: "Wearables", to: "/" },
              { label: "Sell with us", to: "/sell" },
              { label: "Partner Program", to: "/partner" },
              { label: "Contact Us", to: "/contact" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="block px-3 py-2.5 text-subtle-foreground hover:text-foreground hover:bg-muted/60 transition-colors border-b-2 border-transparent hover:border-primary"
                  activeProps={{ className: "text-primary border-b-2 border-primary bg-muted/40" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export function SiteFooter() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Mobile footer accordion state
  const [openAccordions, setOpenAccordions] = useState({
    categories: false,
    sellers: false,
    trust: false,
    support: false,
  });

  const toggleAccordion = (key: "categories" | "sellers" | "trust" | "support") => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <footer className="mt-20 md:mt-24 border-t border-border bg-card/60 pb-20 md:pb-0">
      {/* ── Desktop & Mobile Newsletter Banner (Home only) ── */}
      {isHomePage && (
        <>
          <div className="border-b border-border py-10 md:py-12">
            <div className="mx-auto max-w-7xl px-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-display font-semibold text-foreground">
                  Never miss a Grade A+ open-box drop
                </h3>
                <p className="text-xs text-subtle-foreground mt-1 max-w-md leading-relaxed">
                  Get notified when high-demand iPhones, MacBooks, and cameras are listed at
                  verified discount prices.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your phone or email address"
                  className="bg-background border border-border px-4 py-2.5 text-sm outline-none focus:border-primary flex-1 min-w-60"
                />
                <button className="bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 hover:opacity-90 transition-opacity shrink-0">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Giant Watermark Banner (Home only, hidden on small mobile) */}
          <div className="border-b border-border bg-muted/40 pt-16 pb-6 px-5 text-center relative overflow-hidden select-none hidden md:block">
            <div className="mx-auto max-w-7xl relative z-10 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-4 md:gap-6">
                <span className="font-display font-black text-foreground/30 text-[13vw] md:text-[11vw] tracking-tighter leading-none uppercase mask-[linear-gradient(to_bottom,black_30%,transparent_100%)]">
                  RESALE
                </span>
                <BangladeshMapSVG />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP FOOTER GRID (Hidden on mobile)
      ════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block mx-auto max-w-7xl px-5 py-12">
        <div className="hairline-grid grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 bg-card">
          {/* Brand Info Column */}
          <div className="col-span-1 lg:col-span-2 p-6 md:p-8 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-0.5 font-display text-2xl font-bold tracking-tight text-foreground"
            >
              <img
                src={resaleLogo}
                alt="Resale logo"
                className="h-11 w-auto object-contain shrink-0"
              />
              <span className="leading-none flex items-center">RESALE</span>
            </Link>
            <p className="text-xs text-subtle-foreground leading-relaxed max-w-sm">
              Bangladesh&apos;s premier C2C marketplace for quality-checked pre-owned, open-box, and
              like-new electronics. Powered by NID verification, objective 13-point condition
              grading, and 48-hour buyer protection.
            </p>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-primary/10 text-primary border border-primary/20 font-medium px-2.5 py-1">
                ✓ NID Verified Sellers
              </span>
              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium px-2.5 py-1">
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
                <Link
                  to="/partner"
                  className="hover:text-foreground transition-colors font-semibold text-[#ea580c]"
                >
                  Become a Partner
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
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="p-6 md:p-8 space-y-2.5">
            <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/70">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Grading System (A+ – D)
                </Link>
              </li>
              <li>
                <Link to="/account/disputes" className="hover:text-foreground transition-colors">
                  48-Hr Dispute Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/partner" className="hover:text-foreground transition-colors">
                  B2B Excess Program
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
            <span className="bg-background border border-border px-2 py-1 text-[11px] font-semibold text-rose-600">
              bKash
            </span>
            <span className="bg-background border border-border px-2 py-1 text-[11px] font-semibold text-amber-600">
              Nagad
            </span>
            <span className="bg-background border border-border px-2 py-1 text-[11px] font-semibold text-purple-600">
              Rocket
            </span>
            <span className="bg-background border border-border px-2 py-1 text-[11px]">
              Cash on Delivery
            </span>
            <span className="bg-background border border-border px-2 py-1 text-[11px]">
              Visa / Mastercard
            </span>
          </div>
          <div className="text-subtle-foreground text-[11px] shrink-0">
            Nationwide · Dhaka · Chattogram · Sylhet · Rajshahi · Khulna · All 64 Districts
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MOBILE ACCORDION FOOTER (Visible on <= 768px)
      ════════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden px-4 py-8 space-y-6">
        {/* Accordions */}
        <div className="border-t border-border divide-y divide-border">
          {/* Explore Categories */}
          <div>
            <button
              onClick={() => toggleAccordion("categories")}
              className="w-full py-4 flex items-center justify-between text-sm font-semibold text-foreground text-left"
            >
              <span>Explore Categories</span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                  openAccordions.categories ? "rotate-180 text-foreground" : ""
                }`}
              />
            </button>
            {openAccordions.categories && (
              <ul className="pb-4 space-y-2 text-xs text-subtle-foreground pl-2">
                <li>
                  <Link to="/" className="block py-1">
                    Smartphones &amp; iPhones
                  </Link>
                </li>
                <li>
                  <Link to="/" className="block py-1">
                    Laptops &amp; MacBooks
                  </Link>
                </li>
                <li>
                  <Link to="/" className="block py-1">
                    Cameras &amp; Lenses
                  </Link>
                </li>
                <li>
                  <Link to="/" className="block py-1">
                    Audio &amp; Earbuds
                  </Link>
                </li>
                <li>
                  <Link to="/" className="block py-1">
                    Smartwatches &amp; Accessories
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* For Sellers */}
          <div>
            <button
              onClick={() => toggleAccordion("sellers")}
              className="w-full py-4 flex items-center justify-between text-sm font-semibold text-foreground text-left"
            >
              <span>For Sellers</span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                  openAccordions.sellers ? "rotate-180 text-foreground" : ""
                }`}
              />
            </button>
            {openAccordions.sellers && (
              <ul className="pb-4 space-y-2 text-xs text-subtle-foreground pl-2">
                <li>
                  <Link to="/sell" className="block py-1 font-semibold text-primary">
                    List an Item
                  </Link>
                </li>
                <li>
                  <Link to="/partner" className="block py-1 font-bold text-[#ea580c]">
                    Partner with Resale (B2B)
                  </Link>
                </li>
                <li>
                  <Link to="/seller/dashboard" className="block py-1">
                    Seller Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/seller/listings" className="block py-1">
                    My Listings
                  </Link>
                </li>
                <li>
                  <Link to="/seller/payouts" className="block py-1">
                    Payouts &amp; Earnings
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Trust & Legal */}
          <div>
            <button
              onClick={() => toggleAccordion("trust")}
              className="w-full py-4 flex items-center justify-between text-sm font-semibold text-foreground text-left"
            >
              <span>Trust &amp; Legal</span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                  openAccordions.trust ? "rotate-180 text-foreground" : ""
                }`}
              />
            </button>
            {openAccordions.trust && (
              <ul className="pb-4 space-y-2 text-xs text-subtle-foreground pl-2">
                <li>
                  <Link to="/contact" className="block py-1">
                    Condition Grading (A+ – D)
                  </Link>
                </li>
                <li>
                  <Link to="/account/disputes" className="block py-1">
                    48-Hour Dispute Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="block py-1">
                    Moderation Standards
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Help & Support */}
          <div>
            <button
              onClick={() => toggleAccordion("support")}
              className="w-full py-4 flex items-center justify-between text-sm font-semibold text-foreground text-left"
            >
              <span>Help &amp; Support</span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                  openAccordions.support ? "rotate-180 text-foreground" : ""
                }`}
              />
            </button>
            {openAccordions.support && (
              <ul className="pb-4 space-y-2 text-xs text-subtle-foreground pl-2">
                <li>
                  <Link to="/contact" className="block py-1">
                    Contact Helpdesk
                  </Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/8801700000000"
                    target="_blank"
                    rel="noreferrer"
                    className="block py-1 text-emerald-600 font-medium"
                  >
                    WhatsApp Support (+880 1700-000000)
                  </a>
                </li>
                <li>
                  <Link to="/contact" className="block py-1">
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Mobile Brand Info */}
        <div className="pt-4 space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-0.5 font-display text-xl font-bold tracking-tight text-foreground"
          >
            <img
              src={resaleLogo}
              alt="Resale logo"
              className="h-8 w-auto object-contain shrink-0"
            />
            <span className="leading-none flex items-center">RESALE</span>
          </Link>
          <p className="text-xs text-subtle-foreground leading-relaxed">
            Bangladesh&apos;s marketplace for quality-checked pre-owned electronics with 13+
            component checks, NID verification, and 48-hour buyer protection.
          </p>

          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
            <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 font-medium">
              ✓ NID Verified
            </span>
            <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 font-medium">
              ✓ 48h Protection
            </span>
          </div>

          {/* Payment Badges */}
          <div className="pt-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Accepted Payments
            </span>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
              <span className="border border-border bg-background px-2 py-1 text-rose-600">
                bKash
              </span>
              <span className="border border-border bg-background px-2 py-1 text-amber-600">
                Nagad
              </span>
              <span className="border border-border bg-background px-2 py-1 text-purple-600">
                Rocket
              </span>
              <span className="border border-border bg-background px-2 py-1 text-foreground">
                COD
              </span>
              <span className="border border-border bg-background px-2 py-1 text-foreground">
                Cards
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Global Bottom Bar ── */}
      <div className="border-t border-border bg-background py-5 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 md:px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>© 2026 Resale.com Limited</span>
            <span>·</span>
            <span className="font-medium text-foreground">🇧🇩 Bangladesh</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <span className="size-1.5 bg-emerald-500 animate-pulse" />
              All Systems Live
            </span>
          </div>
        </div>
      </div>

      {/* ── Fixed Mobile Bottom Navigation Bar (Fixed for <= 768px) ── */}
      <MobileBottomNav />
    </footer>
  );
}

export function MobileBottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border md:hidden">
      <div className="grid grid-cols-5 items-center h-16 px-1 text-[10px] sm:text-[11px] font-medium">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            path === "/" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="size-5" />
          <span>Home</span>
        </Link>

        {/* Categories */}
        <a
          href="/#categories"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LayoutGrid className="size-5" />
          <span>Categories</span>
        </a>

        {/* Sell Button (Elevated Circular Black Button) */}
        <Link
          to="/sell"
          className="flex flex-col items-center justify-center -mt-4 group"
          aria-label="Sell an item"
        >
          <div className="size-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-background shadow-none transition-transform group-hover:scale-105">
            <Plus className="size-6 stroke-3" />
          </div>
          <span className="text-[10px] font-bold text-foreground mt-0.5">Sell</span>
        </Link>

        {/* Inbox / Help */}
        <Link
          to="/contact"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            path === "/contact"
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="size-5" />
          <span>Inbox</span>
        </Link>

        {/* Account */}
        <Link
          to="/login"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            path.startsWith("/login") || path.startsWith("/seller") || path.startsWith("/account")
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="size-5" />
          <span>Account</span>
        </Link>
      </div>
    </nav>
  );
}
