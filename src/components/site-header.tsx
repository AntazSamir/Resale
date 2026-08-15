import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User } from "lucide-react";

export function SiteHeader() {
  return (
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
          <button aria-label="Account" className="text-subtle-foreground hover:text-foreground">
            <User className="size-5" />
          </button>
          <button aria-label="Cart" className="text-subtle-foreground hover:text-foreground">
            <ShoppingBag className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="font-display text-foreground">RESALE.com</p>
        <p>Quality-checked pre-owned electronics · Bangladesh · Cash on delivery</p>
      </div>
    </footer>
  );
}