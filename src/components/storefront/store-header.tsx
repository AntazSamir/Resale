import { Storefront } from "@/data/storefront";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Star,
  Package,
  Phone,
  MessageCircle,
  ExternalLink,
  Store,
} from "lucide-react";
import { StorePoliciesDialog } from "./store-policies-dialog";

interface StoreHeaderProps {
  store: Storefront;
  totalListingsCount: number;
}

export function StoreHeader({ store, totalListingsCount }: StoreHeaderProps) {
  const initial = store.name.charAt(0).toUpperCase();

  return (
    <div className="relative rounded-xl border border-border bg-card overflow-hidden shadow-xs mb-8">
      {/* Banner Area */}
      <div
        className="h-44 sm:h-56 md:h-64 w-full bg-muted bg-cover bg-center relative"
        style={{
          backgroundImage: store.bannerUrl
            ? `url(${store.bannerUrl})`
            : "linear-gradient(to right, #18181b, #27272a)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/40 to-transparent" />

        {store.isDemo && (
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-xs border border-border px-2.5 py-1 text-[11px] text-muted-foreground rounded">
            Verified Pro Store Demo
          </div>
        )}
      </div>

      {/* Main Info Layer */}
      <div className="relative px-5 sm:px-8 pb-6 -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          {/* Logo + Identity */}
          <div className="flex items-end gap-4">
            <Avatar className="size-24 sm:size-28 rounded-xl border-4 border-background shadow-md bg-card shrink-0">
              <AvatarImage src={store.logoUrl} alt={store.name} className="object-cover" />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {initial}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground">
                  {store.name}
                </h1>
                {store.verified ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold gap-1">
                    <ShieldCheck className="size-3.5" />
                    <span>Verified Pro Store</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Storefront
                  </Badge>
                )}
              </div>

              {store.tagline && (
                <p className="text-xs sm:text-sm text-subtle-foreground font-medium line-clamp-1">
                  {store.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto pt-2 sm:pt-0">
            <StorePoliciesDialog store={store} />

            {store.socialLinks?.whatsapp && (
              <Button
                asChild
                size="sm"
                className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <a
                  href={`https://wa.me/${store.socialLinks.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-3.5" />
                  <span>WhatsApp Shop</span>
                </a>
              </Button>
            )}

            {store.phone && (
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                <a href={`tel:${store.phone}`}>
                  <Phone className="size-3.5" />
                  <span>Call Store</span>
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Description & Location/Hours Bar */}
        <div className="mt-5 pt-5 border-t border-border/70 space-y-4">
          {store.description && (
            <p className="text-xs sm:text-sm text-subtle-foreground max-w-4xl leading-relaxed">
              {store.description}
            </p>
          )}

          {/* Trust & Meta Row */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span>
                {store.area ? `${store.area}, ` : ""}
                {store.district}
              </span>
            </div>

            {store.businessHours && (
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-muted-foreground shrink-0" />
                <span>{store.businessHours}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Star className="size-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span className="font-semibold text-foreground">{store.rating.toFixed(1)}</span>
              <span>Rating</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Package className="size-3.5 text-primary shrink-0" />
              <span className="font-semibold text-foreground">{totalListingsCount}</span>
              <span>Active Listings</span>
            </div>

            {store.totalSales > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">{store.totalSales}+</span>
                <span>Verified Deliveries</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
