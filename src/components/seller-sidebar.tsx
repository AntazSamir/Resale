import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BarChart3,
  Package,
  ShieldAlert,
  List,
  Wallet,
  Store,
  Sparkles,
  UploadCloud,
  Plus
} from "lucide-react";
import resaleLogo from "@/assets/resale-logo.svg";

export function SellerSidebar({
  active,
}: {
  active:
    | "dashboard"
    | "analytics"
    | "orders"
    | "disputes"
    | "listings"
    | "payouts"
    | "storefront"
    | "creator"
    | "bulk-import";
}) {
  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <nav className="space-y-1.5 sticky top-24">
        <Link
          to="/seller/dashboard"
          className="flex items-center gap-2 px-4 py-2 mb-4 border-b border-border text-foreground hover:opacity-90 transition-opacity"
        >
          <img src={resaleLogo} alt="Resale logo" className="h-6 w-auto object-contain shrink-0" />
          <span className="font-display font-bold text-sm tracking-tight">Seller Hub</span>
        </Link>
        <Link
          to="/seller/dashboard"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "dashboard" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <LayoutDashboard className="size-4" /> Dashboard
        </Link>
        <Link
          to="/seller/analytics"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "analytics" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <BarChart3 className="size-4" /> Analytics Intelligence
        </Link>
        <Link
          to="/seller/orders"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "orders" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <Package className="size-4" /> Orders &amp; Fulfillment
        </Link>
        <Link
          to="/seller/disputes"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "disputes" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <ShieldAlert className="size-4" /> Disputes &amp; Claims
        </Link>
        <Link
          to="/seller/listings"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "listings" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <List className="size-4" /> My Listings
        </Link>
        <Link
          to="/seller/payouts"
          className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "payouts" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
        >
          <Wallet className="size-4" /> Payouts &amp; Credits
        </Link>

        {/* Phase 3.4 Pro Merchant & Creator Suite */}
        <div className="pt-3 mt-3 border-t border-border/70 space-y-1">
          <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Pro &amp; Creator Suite
          </div>
          <Link
            to="/seller/storefront"
            className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "storefront" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
          >
            <Store className="size-4" /> Storefront Profile
          </Link>
          <Link
            to="/seller/creator-profile"
            className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "creator" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
          >
            <Sparkles className="size-4" /> Creator Hub
          </Link>
          <Link
            to="/seller/inventory/import"
            className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-md transition-colors ${active === "bulk-import" ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
          >
            <UploadCloud className="size-4" /> Bulk Inventory
          </Link>
        </div>

        <div className="pt-4 mt-4 border-t border-border">
          <Button asChild className="w-full text-xs">
            <Link to="/sell">
              <Plus className="size-4 mr-2" /> New Listing
            </Link>
          </Button>
        </div>
      </nav>
    </aside>
  );
}
