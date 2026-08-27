import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/lib/cart-store";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Building2,
  Phone,
  HelpCircle,
  Package,
  History,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  Battery,
  Shield,
  MemoryStick,
  MonitorSmartphone,
  Cable,
  Gamepad2,
  Watch,
  Headphones,
  Speaker,
  Radio,
  Activity,
  Home,
  LucideIcon,
} from "lucide-react";
import { BangladeshMapSVG } from "./bangladesh-map";
import resaleLogo from "@/assets/resale-logo.svg";
import { products, taka, cheapest } from "@/data/catalog";

type NavItem = {
  label: string;
  to: "/" | "/products" | "/sell" | "/partner" | "/contact" | "/categories" | "/about";
  search?: {
    q?: string;
    category?: string;
    brand?: string;
  };
};

type DropdownItem = { label: string; q?: string; category?: string; icon: LucideIcon; color: string };
type DesktopNavItem = NavItem | { label: string; dropdown: DropdownItem[] };

const desktopCategoryNav: DesktopNavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Smartphones",
    to: "/products",
    search: { category: "Smartphones" },
  },
  {
    label: "Laptops",
    to: "/products",
    search: { category: "Laptops" },
  },
  {
    label: "Cameras",
    to: "/products",
    search: { category: "Cameras" },
  },
  {
    label: "Tablets",
    to: "/products",
    search: { category: "Tablets" },
  },
  {
    label: "Accessories",
    dropdown: [
      { label: "Chargers & Cables", q: "Charger",         icon: Cable,            color: "#f97316" },
      { label: "Power Banks",       q: "Power Bank",      icon: Battery,          color: "#22c55e" },
      { label: "Cases & Covers",    q: "Case",            icon: Shield,           color: "#3b82f6" },
      { label: "Screen Protectors", q: "Screen Protector",icon: MonitorSmartphone,color: "#8b5cf6" },
      { label: "Stylus & Pens",     q: "Stylus",          icon: Sparkles,         color: "#ec4899" },
      { label: "USB Hubs & Docks",  q: "USB Hub",         icon: Zap,              color: "#eab308" },
      { label: "Memory Cards",      q: "Memory Card",     icon: MemoryStick,      color: "#14b8a6" },
      { label: "Mounts & Stands",   q: "Stand",           icon: Package,          color: "#6366f1" },
      { label: "Keyboard & Mouse",  q: "Keyboard",        icon: Activity,         color: "#f43f5e" },
      { label: "Camera Bags",       q: "Camera Bag",      icon: ShieldCheck,      color: "#0ea5e9" },
      { label: "All Accessories",   category: "Accessories", icon: ArrowRight,    color: "#a855f7" },
    ],
  },
  {
    label: "Essentials",
    dropdown: [
      { label: "Smartwatches",         q: "Smartwatch",  icon: Watch,       color: "#f97316" },
      { label: "Earbuds",              q: "Earbuds",     icon: Radio,       color: "#3b82f6" },
      { label: "Headphones",           q: "Headphones",  icon: Headphones,  color: "#8b5cf6" },
      { label: "Bluetooth Speakers",   q: "Speaker",     icon: Speaker,     color: "#22c55e" },
      { label: "Soundbars",            q: "Soundbar",    icon: Activity,    color: "#ec4899" },
      { label: "Fitness Bands",        q: "Fitness Band",icon: Activity,    color: "#eab308" },
      { label: "Smart Home Devices",   q: "Smart Home",  icon: Home,        color: "#14b8a6" },
      { label: "Home Products",        category: "Home Products", icon: Building2, color: "#6366f1" },
    ],
  },
  { label: "Gaming", to: "/products", search: { category: "Gaming Consoles" } },
  { label: "Sell with Us", to: "/sell" },
  { label: "Partner Program", to: "/partner" },
];

type MobileCategoryItem =
  | NavItem
  | {
      label: string;
      dropdown: { label: string; q?: string; category?: string }[];
    };

const mobileCategoryNav: MobileCategoryItem[] = [
  {
    label: "Smartphones & iPhones",
    to: "/products",
    search: { category: "Smartphones" },
  },
  {
    label: "Laptops & MacBooks",
    to: "/products",
    search: { category: "Laptops" },
  },
  {
    label: "Cameras & Lenses",
    to: "/products",
    search: { category: "Cameras" },
  },
  {
    label: "Tablets & iPads",
    to: "/products",
    search: { category: "Tablets" },
  },
  {
    label: "Accessories",
    dropdown: [
      { label: "Chargers & Cables", q: "Charger" },
      { label: "Power Banks", q: "Power Bank" },
      { label: "Cases & Covers", q: "Case" },
      { label: "Screen Protectors", q: "Screen Protector" },
      { label: "Stylus & Pens", q: "Stylus" },
      { label: "USB Hubs & Docks", q: "USB Hub" },
      { label: "Memory Cards", q: "Memory Card" },
      { label: "Mounts & Stands", q: "Stand" },
      { label: "Keyboard & Mouse", q: "Keyboard" },
      { label: "Camera Bags & Straps", q: "Camera Bag" },
      { label: "All Accessories", category: "Accessories" },
    ],
  },
  {
    label: "Essentials",
    dropdown: [
      { label: "Smartwatches", q: "Smartwatch" },
      { label: "Earbuds", q: "Earbuds" },
      { label: "Headphones", q: "Headphones" },
      { label: "Bluetooth Speakers", q: "Speaker" },
      { label: "Soundbars", q: "Soundbar" },
      { label: "Wearable Fitness Bands", q: "Fitness Band" },
      { label: "Smart Home Devices", q: "Smart Home" },
      { label: "Home Products", category: "Home Products" },
    ],
  },
  {
    label: "Gaming Consoles",
    to: "/products",
    search: { category: "Gaming Consoles" },
  },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const catScrollRef = useRef<HTMLDivElement | null>(null);
  const [catFade, setCatFade] = useState({ left: false, right: false });

  const updateCatFade = useCallback(() => {
    const el = catScrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCatFade({
      left: el.scrollLeft > 4,
      right: max > 4 && el.scrollLeft < max - 4,
    });
  }, []);

  useEffect(() => {
    updateCatFade();
    const el = catScrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateCatFade);
    ro.observe(el);
    window.addEventListener("resize", updateCatFade);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateCatFade);
    };
  }, [updateCatFade]);

  useEffect(() => {
    if (!openDropdown) return;
    const handleScrollOrResize = () => setOpenDropdown(null);
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [openDropdown]);

  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("resale_recent_searches");
      if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5));
    } catch {
      // ignore
    }
  }, []);

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    try {
      const next = [
        query.trim(),
        ...recentSearches.filter((s) => s.toLowerCase() !== query.trim().toLowerCase()),
      ].slice(0, 5);
      setRecentSearches(next);
      localStorage.setItem("resale_recent_searches", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const popularSearches = [
    "iPhone 15 Pro",
    "MacBook Air M2",
    "Sony Alpha A7 IV",
    "Sony WH-1000XM5",
    "Google Pixel 8 Pro",
  ];

  const matchingProducts = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 4)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery !== undefined ? customQuery : searchQuery;
    if (queryToUse.trim()) {
      saveRecentSearch(queryToUse.trim());
      navigate({
        to: "/products",
        search: { q: queryToUse.trim(), category: undefined, brand: undefined },
      });
      setMobileSearchOpen(false);
      setSearchFocused(false);
    } else {
      navigate({
        to: "/products",
        search: { q: undefined, category: undefined, brand: undefined },
      });
      setMobileSearchOpen(false);
      setSearchFocused(false);
    }
  };

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [scrolledPastHero, setScrolledPastHero] = useState(!isHomePage);

  useEffect(() => {
    if (!isHomePage) {
      setScrolledPastHero(true);
      return;
    }
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 280);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnnouncement(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const isLogoCentered = isHomePage && !scrolledPastHero;

  return (
    <div className="sticky top-0 z-40 w-full bg-background">
      {/* Announcement Bar (Shows for 3 seconds, then smoothly closes) */}
      <div
        className={`bg-primary text-primary-foreground text-xs text-center font-medium tracking-wide flex items-center justify-center gap-6 overflow-hidden transition-all duration-500 ease-in-out ${
          showAnnouncement
            ? "max-h-12 py-2 px-4 opacity-100"
            : "max-h-0 py-0 px-4 opacity-0 border-0 pointer-events-none"
        }`}
      >
        <span>⚡ Open-Box &amp; Pre-Owned Electronics at Direct Prices</span>
        <span className="hidden md:inline font-normal opacity-80">|</span>
        <span className="hidden md:inline">32-Point Standardized Inspection</span>
        <span className="hidden md:inline font-normal opacity-80">|</span>
        <span className="hidden lg:inline">NID Verified Sellers &amp; 48h Buyer Protection</span>
      </div>

      {/* Main Header Bar */}
      <header className="relative z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="relative mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between md:justify-start gap-4 md:gap-6 px-4 md:px-5">
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

          {/* Brand Logo - Centered at initial top state when search is hidden, slides to left on scroll */}
          <Link
            to="/"
            className={`inline-flex items-center shrink-0 hover:opacity-90 transition-all duration-300 ease-out absolute left-1/2 -translate-x-1/2 ${
              isLogoCentered ? "md:left-1/2 md:-translate-x-1/2" : "md:left-5 md:translate-x-0"
            }`}
            aria-label="Resale Home"
          >
            <img
              src={resaleLogo}
              alt="Resale logo"
              className="h-9 md:h-11 w-auto object-contain shrink-0"
            />
          </Link>

          {/* Desktop Center: Search Bar with Autocomplete (Smoothly collapses when Hero search is in view on Homepage) */}
          <div
            ref={searchContainerRef}
            className={`ml-auto md:ml-36 md:mr-auto hidden relative flex-1 md:flex md:max-w-md transition-all duration-300 ease-out ${
              isLogoCentered
                ? "opacity-0 pointer-events-none -translate-y-1 invisible"
                : "opacity-100 pointer-events-auto translate-y-0 visible"
            }`}
          >
            <form
              onSubmit={(e) => handleSearchSubmit(e)}
              className="w-full flex items-center gap-2 border border-border bg-card px-3.5 py-2 text-sm focus-within:border-foreground transition-colors"
            >
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchFocused(false);
                }}
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground text-foreground text-xs md:text-sm"
                placeholder="Search iPhone, MacBook, Sony camera..."
                aria-label="Search listings"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </form>

            {/* Desktop Autocomplete Popover */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border z-50 p-3 space-y-3 shadow-xl">
                {searchQuery.trim() ? (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                      <span>Matching Devices</span>
                      <span className="text-[10px] font-normal text-subtle-foreground">
                        {matchingProducts.length} results
                      </span>
                    </div>
                    {matchingProducts.length > 0 ? (
                      <div className="space-y-1.5">
                        {matchingProducts.map((p) => {
                          const deal = cheapest(p.id);
                          return deal ? (
                            <Link
                              key={p.id}
                              to="/listing/$listingId"
                              params={{ listingId: deal.id }}
                              onClick={() => {
                                saveRecentSearch(p.name);
                                setSearchFocused(false);
                              }}
                              className="flex items-center justify-between p-2 hover:bg-secondary/70 transition-colors text-xs border border-transparent hover:border-border"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="size-8 object-cover border border-border bg-muted shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-foreground truncate">{p.name}</p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {p.category} · {p.brand}
                                  </p>
                                </div>
                              </div>
                              <span className="font-display font-bold text-primary shrink-0 ml-2">
                                {taka(deal.price)}
                              </span>
                            </Link>
                          ) : (
                            <Link
                              key={p.id}
                              to="/products"
                              search={{ q: p.name, category: undefined, brand: undefined }}
                              onClick={() => {
                                saveRecentSearch(p.name);
                                setSearchFocused(false);
                              }}
                              className="flex items-center justify-between p-2 hover:bg-secondary/70 transition-colors text-xs border border-transparent hover:border-border"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="size-8 object-cover border border-border bg-muted shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-foreground truncate">{p.name}</p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {p.category} · {p.brand}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit(undefined, searchQuery)}
                      className="w-full text-center text-xs font-semibold text-primary pt-2 hover:underline block"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo; →
                    </button>
                  </div>
                ) : (
                  <>
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                          <History className="size-3 text-muted-foreground" />
                          <span>Recent Searches</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {recentSearches.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setSearchQuery(s);
                                handleSearchSubmit(undefined, s);
                              }}
                              className="text-xs bg-muted hover:bg-secondary border border-border px-2.5 py-1 text-foreground transition-colors"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <TrendingUp className="size-3 text-primary" />
                        <span>Popular Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => {
                              setSearchQuery(term);
                              handleSearchSubmit(undefined, term);
                            }}
                            className="text-xs bg-secondary/80 hover:bg-secondary border border-border px-2.5 py-1 text-foreground transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Desktop Right: Actions */}
          <div className="ml-auto hidden md:flex items-center gap-5">
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
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
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
              {itemCount > 0 && (
                <span className="absolute top-1 right-0.5 size-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Input Overlay / Drawer */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-border bg-card p-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <form
              onSubmit={(e) => handleSearchSubmit(e)}
              className="flex items-center gap-2 border border-border bg-background px-3 py-2 text-sm"
            >
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search iPhone, MacBook, Sony..."
                className="w-full bg-transparent outline-none text-xs text-foreground"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </form>

            {/* Mobile Popular / Matching suggestions */}
            {searchQuery.trim() ? (
              <div className="space-y-1 pt-1">
                {matchingProducts.map((p) => {
                  const deal = cheapest(p.id);
                  return deal ? (
                    <Link
                      key={p.id}
                      to="/listing/$listingId"
                      params={{ listingId: deal.id }}
                      onClick={() => {
                        saveRecentSearch(p.name);
                        setMobileSearchOpen(false);
                      }}
                      className="flex items-center justify-between p-2 hover:bg-muted text-xs border border-border/50"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="size-7 object-cover bg-muted shrink-0"
                        />
                        <span className="font-medium text-foreground truncate">{p.name}</span>
                      </div>
                      <span className="font-display font-bold text-primary shrink-0 ml-1.5">
                        {taka(deal.price)}
                      </span>
                    </Link>
                  ) : (
                    <Link
                      key={p.id}
                      to="/products"
                      search={{ q: p.name, category: undefined, brand: undefined }}
                      onClick={() => {
                        saveRecentSearch(p.name);
                        setMobileSearchOpen(false);
                      }}
                      className="flex items-center justify-between p-2 hover:bg-muted text-xs border border-border/50"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="size-7 object-cover bg-muted shrink-0"
                        />
                        <span className="font-medium text-foreground truncate">{p.name}</span>
                      </div>
                    </Link>
                  );
                })}
                <button
                  type="button"
                  onClick={() => handleSearchSubmit(undefined, searchQuery)}
                  className="w-full text-center text-xs font-semibold text-primary py-2 hover:underline block"
                >
                  Search for &ldquo;{searchQuery}&rdquo; →
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearchSubmit(undefined, term);
                      }}
                      className="text-[11px] bg-secondary border border-border px-2.5 py-1 text-foreground"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                  className="inline-flex items-center shrink-0 hover:opacity-90 transition-opacity pl-1"
                  aria-label="Resale Home"
                >
                  <img
                    src={resaleLogo}
                    alt="Resale logo"
                    className="h-9 w-auto object-contain shrink-0"
                  />
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
                  to="/products"
                  search={{ q: undefined, category: undefined, brand: undefined }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 hover:bg-muted text-foreground"
                >
                  Browse Products
                </Link>
                <Link
                  to="/sell"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 hover:bg-muted text-primary font-bold"
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
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 hover:bg-muted text-foreground"
                >
                  About Us
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
                  {mobileCategoryNav.map((cat) => {
                    if ("dropdown" in cat) {
                      const isExpanded = mobileExpandedCategory === cat.label;
                      return (
                        <div key={cat.label} className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => setMobileExpandedCategory(isExpanded ? null : cat.label)}
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-foreground hover:bg-muted font-medium transition-colors"
                          >
                            <span>{cat.label}</span>
                            <ChevronDown
                              className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-primary" : ""
                              }`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="pl-3 ml-3 border-l border-border/80 space-y-0.5 py-1">
                              {cat.dropdown.map((sub, idx) => (
                                <Link
                                  key={sub.label}
                                  to="/products"
                                  search={{
                                    category: sub.category,
                                    q: sub.q,
                                    brand: undefined,
                                  }}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center px-2.5 py-1.5 hover:bg-muted hover:text-foreground text-muted-foreground transition-colors group"
                                >
                                  <div className="relative flex items-center gap-2">
                                    {/* Mobile Tree Connector */}
                                    <div className="absolute -left-2 top-1/2 w-2 h-px bg-border group-hover:bg-primary transition-colors" />
                                    <div
                                      className={`absolute -left-1 top-1/2 -translate-y-1/2 size-1 rounded-full bg-border group-hover:bg-primary transition-colors ${idx === 0 ? "hidden" : ""}`}
                                    />
                                    {sub.label}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    const navItem = cat as NavItem;
                    return (
                      <Link
                        key={navItem.label}
                        to="/products"
                        search={{
                          category: navItem.search?.category,
                          q: navItem.search?.q,
                          brand: undefined,
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 hover:bg-muted hover:text-foreground"
                      >
                        {navItem.label}
                      </Link>
                    );
                  })}
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

      {/* Secondary Category Navigation Bar (Hidden on mobile, desktop only) */}
      <nav
        className="relative z-10 hidden md:block border-b border-border bg-background/95 backdrop-blur shadow-none"
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <div className="relative mx-auto max-w-7xl">
          <div
            ref={catScrollRef}
            onScroll={updateCatFade}
            className="overflow-x-auto scrollbar-none px-3 lg:px-5 [scroll-snap-type:x_proximity] touch-pan-x overscroll-x-contain scroll-smooth [-webkit-overflow-scrolling:touch] scroll-px-3 lg:scroll-px-5"
            role="group"
            aria-label="Category navigation"
          >
            <ul className="flex w-max items-center gap-1 text-xs font-medium whitespace-nowrap">
              {desktopCategoryNav.map((item) => {
                // Dropdown item
                if ("dropdown" in item) {
                  const isOpen = openDropdown === item.label;
                  return (
                    <li key={item.label} className="shrink-0 snap-start">
                      <button
                        type="button"
                        ref={(el) => {
                          dropdownRefs.current[item.label] = el;
                        }}
                        onMouseEnter={() => setOpenDropdown(item.label)}
                        onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                        className={`flex min-h-11 items-center gap-1 px-3 sm:px-3.5 lg:px-4 transition-colors border-b-2 ${
                          isOpen
                            ? "text-foreground font-semibold border-primary bg-muted/40"
                            : "text-subtle-foreground hover:text-foreground hover:bg-muted/60 border-transparent hover:border-primary"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`size-3 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </li>
                  );
                }

                // Regular nav item
                const navItem = item as NavItem;
                return (
                  <li key={navItem.label} className="shrink-0 snap-start">
                    {navItem.search ? (
                      <Link
                        to="/products"
                        search={{
                          category: navItem.search.category,
                          q: navItem.search.q,
                          brand: undefined,
                        }}
                        onMouseEnter={() => setOpenDropdown(null)}
                        className="flex min-h-11 items-center px-3 sm:px-3.5 lg:px-4 text-subtle-foreground hover:text-foreground hover:bg-muted/60 transition-colors border-b-2 border-transparent hover:border-primary text-xs font-medium"
                        activeProps={{
                          className: "!text-foreground !border-primary !font-semibold bg-muted/40",
                        }}
                      >
                        {navItem.label}
                      </Link>
                    ) : navItem.to === "/" ? (
                      <Link
                        to="/"
                        activeOptions={{ exact: true }}
                        onMouseEnter={() => setOpenDropdown(null)}
                        className="flex min-h-11 items-center px-3 sm:px-3.5 lg:px-4 text-subtle-foreground hover:text-foreground hover:bg-muted/60 transition-colors border-b-2 border-transparent hover:border-primary text-xs font-medium"
                        activeProps={{
                          className: "!text-foreground !border-primary !font-semibold bg-muted/40",
                        }}
                      >
                        {navItem.label}
                      </Link>
                    ) : (
                      <Link
                        to={navItem.to}
                        onMouseEnter={() => setOpenDropdown(null)}
                        className="flex min-h-11 items-center px-3 sm:px-3.5 lg:px-4 text-subtle-foreground hover:text-foreground hover:bg-muted/60 transition-colors border-b-2 border-transparent hover:border-primary text-xs font-medium"
                        activeProps={{
                          className: "!text-foreground !border-primary !font-semibold bg-muted/40",
                        }}
                      >
                        {navItem.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Dropdown panels — rendered into document.body via Portal to escape all stacking contexts & backdrop-filters */}
          {typeof document !== "undefined" &&
            desktopCategoryNav.map((item) => {
              if (!("dropdown" in item)) return null;
              if (openDropdown !== item.label) return null;
              const btnEl = dropdownRefs.current[item.label];
              const rect = btnEl?.getBoundingClientRect();
              if (!rect) return null;
              return createPortal(
                <div
                  key={item.label}
                  style={{
                    position: "fixed",
                    top: rect.bottom,
                    left: rect.left,
                    zIndex: 99999,
                  }}
                  className="min-w-50 bg-background border border-border border-t-0 shadow-2xl py-2 animate-in fade-in slide-in-from-top-2"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {/* Tree root — vertical spine */}
                  <div className="relative pl-8 pr-3">
                    {/* Full-height vertical spine */}
                    <div
                      className="absolute left-4.5 top-0 bottom-0 w-px bg-border/60"
                      style={{ top: "12px", bottom: "12px" }}
                    />

                    {(item as { label: string; dropdown: DropdownItem[] }).dropdown.map((sub, idx, arr) => {
                      const Icon = sub.icon;
                      const isLast = idx === arr.length - 1;
                      return (
                        <Link
                          key={sub.label}
                          to="/products"
                          search={{ q: sub.q, category: sub.category, brand: undefined }}
                          onClick={() => setOpenDropdown(null)}
                          className="group relative flex items-center gap-2.5 py-1.75 text-[12px] text-subtle-foreground hover:text-foreground transition-colors"
                        >
                          {/* L-branch connector */}
                          <span
                            className="absolute -left-5.5 top-1/2 flex items-center"
                            style={{ transform: "translateY(-50%)" }}
                          >
                            {/* vertical segment for this row (only up to center, stop for last) */}
                            {!isLast && (
                              <span
                                className="absolute w-px bg-border/60"
                                style={{ left: 0, top: "50%", bottom: "-50%" }}
                              />
                            )}
                            {/* horizontal arm */}
                            <span className="block w-3.5 h-px bg-border/70 group-hover:bg-primary transition-colors" />
                          </span>

                          {/* Colored icon */}
                          <span
                            className="shrink-0 flex items-center justify-center size-6 rounded"
                            style={{ backgroundColor: sub.color + "18" }}
                          >
                            <Icon size={13} style={{ color: sub.color }} strokeWidth={2} />
                          </span>

                          <span className="font-medium leading-tight">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>,
                document.body,
              );
            })}

          {catFade.left && (
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background to-transparent" />
          )}
          {catFade.right && (
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-background via-background/80 to-transparent" />
          )}
        </div>
      </nav>
    </div>
  );
}

export function SiteFooter() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterDone(true);
    }
  };

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
    <footer className="mt-20 md:mt-24 border-t border-border bg-card/60">
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
                  Get notified when high-demand iPhones, MacBooks, and cameras are listed by NID
                  Verified sellers — with full condition reports and grade transparency.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-2 max-w-md">
                {newsletterDone ? (
                  <p className="text-sm text-success font-medium py-2.5">
                    ✓ You&apos;re subscribed!
                  </p>
                ) : (
                  <form
                    onSubmit={handleNewsletter}
                    className="flex flex-col sm:flex-row gap-2 w-full"
                  >
                    <input
                      type="email"
                      aria-label="Email or phone for newsletter"
                      placeholder="Enter your phone or email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      className="bg-background border border-border px-4 py-2.5 text-sm outline-none focus:border-primary flex-1 min-w-60"
                    />
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 hover:opacity-90 transition-opacity shrink-0"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Giant Watermark Banner (Home only, all screen sizes) */}
          <div className="border-b border-border bg-muted/40 pt-12 pb-4 px-5 text-center relative overflow-hidden select-none">
            <div className="mx-auto max-w-7xl relative z-10 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-3 md:gap-6">
                <span className="font-display font-black text-foreground/30 text-[17vw] md:text-[11vw] tracking-tighter leading-none uppercase mask-[linear-gradient(to_bottom,black_30%,transparent_100%)]">
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
              className="inline-flex items-center shrink-0 hover:opacity-90 transition-opacity"
              aria-label="Resale Home"
            >
              <img
                src={resaleLogo}
                alt="Resale logo"
                className="h-9 md:h-10 w-auto object-contain shrink-0"
              />
            </Link>
            <p className="text-xs text-subtle-foreground leading-relaxed max-w-sm">
              Bangladesh&apos;s premier marketplace for quality-checked pre-owned, open-box, and
              like-new electronics. Powered by NID verification, objective 32-point standardized
              inspection, and 48-hour buyer protection.
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
                <Link
                  to="/products"
                  search={{ category: "Smartphones", q: undefined, brand: undefined }}
                  className="hover:text-foreground transition-colors"
                >
                  Smartphones &amp; iPhones
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "Laptops", q: undefined, brand: undefined }}
                  className="hover:text-foreground transition-colors"
                >
                  Laptops &amp; MacBooks
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "Cameras", q: undefined, brand: undefined }}
                  className="hover:text-foreground transition-colors"
                >
                  Cameras &amp; Lenses
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ q: "Earbuds", category: undefined, brand: undefined }}
                  className="hover:text-foreground transition-colors"
                >
                  Audio &amp; Earbuds
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ q: "Smartwatch", category: undefined, brand: undefined }}
                  className="hover:text-foreground transition-colors"
                >
                  Smartwatches
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "Gaming Consoles", q: undefined, brand: undefined }}
                  className="hover:text-foreground transition-colors"
                >
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

          {/* Company & Trust */}
          <div className="p-6 md:p-8 space-y-2.5">
            <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/70">
              Company &amp; Trust
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-foreground transition-colors font-medium">
                  About Us
                </Link>
              </li>
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
            Nationwide · Dhaka · Chattogram · Sylhet · Rajshahi · Khulna
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
              type="button"
              onClick={() => toggleAccordion("categories")}
              className="w-full py-4 flex items-center justify-between text-sm font-semibold text-foreground text-left cursor-pointer touch-manipulation"
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
                  <Link
                    to="/products"
                    search={{ category: "Smartphones", q: undefined, brand: undefined }}
                    className="block py-1.5 hover:text-foreground transition-colors"
                  >
                    Smartphones &amp; iPhones
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    search={{ category: "Laptops", q: undefined, brand: undefined }}
                    className="block py-1.5 hover:text-foreground transition-colors"
                  >
                    Laptops &amp; MacBooks
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    search={{ category: "Cameras", q: undefined, brand: undefined }}
                    className="block py-1.5 hover:text-foreground transition-colors"
                  >
                    Cameras &amp; Lenses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    search={{ q: "Earbuds", category: undefined, brand: undefined }}
                    className="block py-1.5 hover:text-foreground transition-colors"
                  >
                    Audio &amp; Earbuds
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    search={{ q: "Smartwatch", category: undefined, brand: undefined }}
                    className="block py-1.5 hover:text-foreground transition-colors"
                  >
                    Smartwatches &amp; Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    search={{ category: "Gaming Consoles", q: undefined, brand: undefined }}
                    className="block py-1.5 hover:text-foreground transition-colors"
                  >
                    Gaming Consoles
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* For Sellers */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion("sellers")}
              className="w-full py-4 flex items-center justify-between text-sm font-semibold text-foreground text-left cursor-pointer touch-manipulation"
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
                  <Link to="/sell" className="block py-1.5 font-semibold text-primary">
                    List an Item
                  </Link>
                </li>
                <li>
                  <Link to="/partner" className="block py-1.5 font-bold text-[#ea580c]">
                    Partner with Resale (B2B)
                  </Link>
                </li>
                <li>
                  <Link to="/seller/dashboard" className="block py-1.5 hover:text-foreground">
                    Seller Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/seller/listings" className="block py-1.5 hover:text-foreground">
                    My Listings
                  </Link>
                </li>
                <li>
                  <Link to="/seller/payouts" className="block py-1.5 hover:text-foreground">
                    Payouts &amp; Earnings
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Trust & Company */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion("trust")}
              className="w-full py-4 flex items-center justify-between text-sm font-semibold text-foreground text-left cursor-pointer touch-manipulation"
            >
              <span>Trust &amp; Company</span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                  openAccordions.trust ? "rotate-180 text-foreground" : ""
                }`}
              />
            </button>
            {openAccordions.trust && (
              <ul className="pb-4 space-y-2 text-xs text-subtle-foreground pl-2">
                <li>
                  <Link to="/about" className="block py-1.5 font-semibold text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="block py-1.5 hover:text-foreground">
                    Condition Grading (A+ – D)
                  </Link>
                </li>
                <li>
                  <Link to="/account/disputes" className="block py-1.5 hover:text-foreground">
                    48-Hour Dispute Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="block py-1.5 hover:text-foreground">
                    Moderation Standards
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Help & Support */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion("support")}
              className="w-full py-4 flex items-center justify-between text-sm font-semibold text-foreground text-left cursor-pointer touch-manipulation"
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
                  <Link to="/contact" className="block py-1.5 hover:text-foreground">
                    Contact Helpdesk
                  </Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/8801700000000"
                    target="_blank"
                    rel="noreferrer"
                    className="block py-1.5 text-emerald-600 font-medium"
                  >
                    WhatsApp Support (+880 1700-000000)
                  </a>
                </li>
                <li>
                  <Link to="/contact" className="block py-1.5 hover:text-foreground">
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
            className="inline-flex items-center shrink-0 hover:opacity-90 transition-opacity"
            aria-label="Resale Home"
          >
            <img
              src={resaleLogo}
              alt="Resale logo"
              className="h-7.5 w-auto object-contain shrink-0"
            />
          </Link>
          <p className="text-xs text-subtle-foreground leading-relaxed">
            Bangladesh&apos;s marketplace for quality-checked pre-owned electronics with 32-point
            standardized inspection, NID verification, and 48-hour buyer protection.
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
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>© 2026 Resale.com Limited</span>
            <span>·</span>
            <Link to="/about" className="hover:text-foreground transition-colors font-medium">
              About Us
            </Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
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
    </footer>
  );
}
