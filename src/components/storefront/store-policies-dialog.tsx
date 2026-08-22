import { useState } from "react";
import { Storefront } from "@/data/storefront";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, ShieldCheck, RefreshCw, Clock } from "lucide-react";

interface StorePoliciesDialogProps {
  store: Storefront;
  trigger?: React.ReactNode | undefined;
}

export function StorePoliciesDialog({ store, trigger }: StorePoliciesDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <FileText className="size-3.5" />
            <span>Store Policies</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="size-5 text-primary" />
            <span>{store.name} — Store Policies</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Official shop warranty, return terms, and buyer inspection coverage.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-sm">
          {/* Return Policy */}
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-foreground text-xs uppercase tracking-wider">
              <RefreshCw className="size-4 text-primary" />
              <span>Return &amp; Dispute Policy</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {store.returnPolicy ||
                "Standard 48-Hour Resale Platform Buyer Protection applies. If any undisclosed physical or functional defect is found upon delivery, a full refund or exchange is processed."}
            </p>
          </div>

          {/* Warranty Policy */}
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-foreground text-xs uppercase tracking-wider">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Shop Warranty Terms</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {store.warrantyPolicy ||
                "Covered by manufacturer warranty if active, plus standard verification check support from the merchant."}
            </p>
          </div>

          {/* Business Hours */}
          {store.businessHours && (
            <div className="p-3.5 rounded-lg border border-border bg-card space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-foreground text-xs uppercase tracking-wider">
                <Clock className="size-4 text-amber-500" />
                <span>Operating Hours</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{store.businessHours}</p>
            </div>
          )}

          {/* Location note */}
          {store.address && (
            <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/60">
              <span className="font-semibold text-foreground">Physical Store Location: </span>
              {store.address}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
