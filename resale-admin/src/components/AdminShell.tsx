import { useState, useEffect, type ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  Package,
  ShieldAlert,
  Users,
  LogOut,
  ArrowUpRight,
  ShieldCheck,
  PackageSearch,
  Search,
  CreditCard,
  Wallet,
  Tags,
  PackageOpen,
  MessageSquare,
  Megaphone,
  BarChart3,
  Settings,
  Lock,
  Menu,
  X,
  RotateCcw,
  Handshake,
  Bell,
  Headphones,
  FileText,
} from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { Button, cn } from "@/components/ui";

export type AdminTab = string;

interface AdminShellProps {
  children: ReactNode;
}

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  isSoon?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Main",
    items: [{ id: "dashboard", label: "Overview", href: "/", icon: LayoutDashboard }],
  },
  {
    title: "Marketplace",
    items: [
      { id: "listings", label: "Listings", href: "/listings", icon: PackageSearch },
      { id: "moderation", label: "Moderation", href: "/moderation", icon: Shield },
      { id: "inspections", label: "Inspections", href: "/inspections", icon: Search },
      { id: "orders", label: "Orders", href: "/orders", icon: Package },
      { id: "disputes", label: "Disputes", href: "/disputes", icon: ShieldAlert },
      {
        id: "returns",
        label: "Returns & Refunds",
        href: "/returns",
        icon: RotateCcw,
        isSoon: true,
      },
    ],
  },
  {
    title: "People",
    items: [
      { id: "users", label: "Users", href: "/users", icon: Users },
      { id: "identity", label: "Seller Verification", href: "/identity", icon: ShieldCheck },
      { id: "partners", label: "Partners", href: "/partners", icon: Handshake, isSoon: true },
    ],
  },
  {
    title: "Finance",
    items: [
      { id: "payments", label: "Payments", href: "/payments", icon: CreditCard },
      { id: "payouts", label: "Seller Payouts", href: "/payouts", icon: Wallet, isSoon: true },
    ],
  },
  {
    title: "Catalog",
    items: [
      { id: "products", label: "Products", href: "/products", icon: PackageOpen, isSoon: true },
      {
        id: "categories",
        label: "Categories & Brands",
        href: "/categories",
        icon: Tags,
        isSoon: true,
      },
      { id: "reviews", label: "Reviews", href: "/reviews", icon: MessageSquare, isSoon: true },
    ],
  },
  {
    title: "Growth",
    items: [
      { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3 },
      { id: "promotions", label: "Promotions", href: "/promotions", icon: Megaphone, isSoon: true },
      {
        id: "notifications",
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
        isSoon: true,
      },
    ],
  },
  {
    title: "System",
    items: [
      { id: "support", label: "Support Tickets", href: "/support", icon: Headphones, isSoon: true },
      { id: "content", label: "Website Content", href: "/content", icon: FileText, isSoon: true },
      { id: "settings", label: "Settings", href: "/settings", icon: Settings, isSoon: true },
      { id: "roles", label: "Roles & Permissions", href: "/roles", icon: Lock, isSoon: true },
    ],
  },
];

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const location = useLocation();
  const isActive =
    item.href === "/" ? location.pathname === "/" : location.pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-medium shadow-xs"
          : item.isSoon
            ? "text-muted-foreground/70 hover:text-foreground hover:bg-muted/40"
            : "text-foreground/80 hover:text-foreground hover:bg-muted/60",
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon
          className={cn(
            "size-4 shrink-0 transition-colors",
            isActive
              ? "text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        />
        <span className="truncate">{item.label}</span>
      </div>
      {item.isSoon && (
        <span
          className={cn(
            "text-[9px] font-medium tracking-tight px-1.5 py-0.5 rounded transition-colors",
            isActive
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "text-muted-foreground/60 bg-muted/60",
          )}
        >
          Soon
        </span>
      )}
    </Link>
  );
}

function NavGroupSection({ group, onLinkClick }: { group: NavGroup; onLinkClick?: () => void }) {
  return (
    <div className="space-y-1">
      <p className="px-3 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
        {group.title}
      </p>
      <div className="space-y-0.5">
        {group.items.map((item) => (
          <NavLink key={item.id} item={item} onClick={onLinkClick} />
        ))}
      </div>
    </div>
  );
}

export function AdminShell({ children }: AdminShellProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Auto-close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-muted/15 flex flex-col font-sans text-foreground selection:bg-primary/20">
      {/* Top Navbar */}
      <header className="h-14 border-b border-border/70 bg-background/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden size-8 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>

          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
            aria-label="Admin Dashboard"
          >
            <div className="size-7 rounded-md bg-primary flex items-center justify-center">
              <Shield className="size-4 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm tracking-tight text-foreground">
                Resale
              </span>
              <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-muted-foreground/80 bg-muted px-1.5 py-0.5 rounded">
                Console
              </span>
            </div>
          </Link>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground hidden sm:inline-flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-muted/60"
          >
            Storefront <ArrowUpRight className="size-3" />
          </a>

          <div className="h-4 w-px bg-border/80 hidden sm:block" />

          {/* Admin User Chip */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted/40 border border-border/50 text-xs">
            <span className="size-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-500/20" />
            <span className="font-medium text-foreground truncate max-w-32 sm:max-w-44">
              {user?.name || user?.email || user?.phone || "Administrator"}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 px-2.5"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex w-full px-4 sm:px-6 lg:px-8 py-6 gap-6 lg:gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-56 lg:w-60 shrink-0">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 pb-8 space-y-6">
            {navGroups.map((g) => (
              <NavGroupSection key={g.title} group={g} />
            ))}
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-xs"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="relative w-64 max-w-[80vw] bg-background border-r border-border h-full p-4 overflow-y-auto space-y-6 z-10 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Navigation
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              {navGroups.map((g) => (
                <NavGroupSection
                  key={g.title}
                  group={g}
                  onLinkClick={() => setMobileNavOpen(false)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
