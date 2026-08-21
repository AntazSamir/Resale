import { Package, Plug, Battery, Check, Box } from "lucide-react";

interface WhatsIncludedProps {
  accessories: string;
  includedItems?: string[] | undefined;
  className?: string | undefined;
}

function getItemIcon(name: string) {
  const norm = name.toLowerCase();
  if (norm.includes("box") || norm.includes("packaging")) {
    return <Box className="size-3 text-primary shrink-0" />;
  }
  if (
    norm.includes("cable") ||
    norm.includes("charger") ||
    norm.includes("adapter") ||
    norm.includes("plug") ||
    norm.includes("supervooc") ||
    norm.includes("magsafe") ||
    norm.includes("power")
  ) {
    return <Plug className="size-3 text-amber-500 shrink-0" />;
  }
  if (norm.includes("battery") || norm.includes("cell")) {
    return <Battery className="size-3 text-emerald-500 shrink-0" />;
  }
  return <Check className="size-3 text-muted-foreground shrink-0" />;
}

export function WhatsIncludedCard({
  accessories,
  includedItems,
  className = "",
}: WhatsIncludedProps) {
  // Parse items
  let items: string[] = [];
  if (Array.isArray(includedItems) && includedItems.length > 0) {
    items = includedItems;
  } else if (accessories && accessories.trim()) {
    items = accessories
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const isDeviceOnly =
    items.length === 0 || (items.length === 1 && items[0]?.toLowerCase() === "device only");

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <Package className="size-3.5 text-primary" />
        <span>What&apos;s Included</span>
      </div>

      {isDeviceOnly ? (
        <div className="px-3 py-2 bg-secondary/50 border border-border/50 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Device only</span> — no original box,
          charging brick, or additional accessories.
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/40 border border-border/60 text-xs font-medium text-foreground rounded-none"
            >
              {getItemIcon(item)}
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
