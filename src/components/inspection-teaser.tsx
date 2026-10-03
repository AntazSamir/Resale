import { Link } from "@tanstack/react-router";
import { BadgeCheck, Battery, Camera, Smartphone, ArrowRight } from "lucide-react";
import { listingFor, productFor } from "@/data/catalog";
import { gradeLabel, gradeHint } from "@/data/types";
import { GradePill } from "./grade-pill";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function find(items: { component: string; status: string; notes?: string }[], key: RegExp) {
  return items.find((i) => key.test(i.component));
}

export function InspectionTeaser({ listingId }: { listingId: string }) {
  const listing = listingFor(listingId);
  if (!listing) return null;
  const product = productFor(listing.productId);
  const items = listing.inspection ?? [];
  const total = listing.totalChecks ?? 32;
  const rows = [
    {
      icon: Battery,
      label: "Battery health",
      value:
        listing.battery != null
          ? `${listing.battery}%`
          : (find(items, /battery/i)?.status ?? "Not applicable"),
    },
    {
      icon: Camera,
      label: "Camera test",
      value: find(items, /camera/i)?.status ?? "Not applicable",
    },
    {
      icon: Smartphone,
      label: "Display",
      value: find(items, /screen|display/i)?.status ?? listing.screen ?? "Checked",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-success hover:underline"
        >
          <BadgeCheck className="size-3 shrink-0" />
          {total}-point report verified
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Inspection report preview</SheetTitle>
        </SheetHeader>
        <div className="px-4 space-y-5">
          <div className="flex gap-3 items-center">
            {product && (
              <img
                src={product.image}
                alt={product.name}
                className="size-16 object-cover border border-border"
              />
            )}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">{product?.name}</p>
              <GradePill grade={listing.grade} />
              <p className="text-[11px] text-muted-foreground">
                {gradeLabel[listing.grade]}: {gradeHint[listing.grade]}
              </p>
            </div>
          </div>
          <ul className="divide-y divide-border border border-border">
            {rows.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center justify-between gap-3 p-3 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="size-4" /> {label}
                </span>
                <span className="font-semibold text-foreground text-right">{value}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            Condition score {listing.conditionScore}/100 · {listing.passedChecks ?? total}/{total}{" "}
            checks passed
          </p>
          <Link
            to="/listing/$listingId"
            params={{ listingId }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View full report <ArrowRight className="size-4" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
