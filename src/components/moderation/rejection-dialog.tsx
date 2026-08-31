import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LISTING_REJECTION_REASONS, type ListingRejectionReasonCode } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface RejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  productName: string;
  onConfirmReject: (reasonCode: ListingRejectionReasonCode, reasonText: string) => Promise<void>;
}

export function RejectionDialog({
  open,
  onOpenChange,
  listingId,
  productName,
  onConfirmReject,
}: RejectionDialogProps) {
  const [reasonCode, setReasonCode] = useState<ListingRejectionReasonCode | "">("");
  const [reasonText, setReasonText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedReasonMeta = LISTING_REJECTION_REASONS.find((r) => r.code === reasonCode);

  const handleSelectCode = (val: string) => {
    setReasonCode(val as ListingRejectionReasonCode);
    const meta = LISTING_REJECTION_REASONS.find((r) => r.code === val);
    if (meta && !reasonText) {
      setReasonText(meta.description);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonCode) {
      setError("Please select a standardized rejection reason code.");
      return;
    }
    if (!reasonText.trim() || reasonText.trim().length < 5) {
      setError("Please provide constructive explanation for the seller (min 5 chars).");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirmReject(reasonCode, reasonText.trim());
      setReasonCode("");
      setReasonText("");
      onOpenChange(false);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to process rejection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-1">
              <AlertTriangle className="size-5" />
              <DialogTitle>Request Listing Revisions</DialogTitle>
            </div>
            <DialogDescription>
              Provide structured rejection feedback for{" "}
              <strong className="text-foreground">{productName}</strong> ({listingId}). The seller
              will be notified to revise and resubmit.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-md border border-destructive/20 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason-code">
                Rejection Reason Category <span className="text-destructive">*</span>
              </Label>
              <Select value={reasonCode} onValueChange={handleSelectCode}>
                <SelectTrigger id="reason-code">
                  <SelectValue placeholder="Select a reason category" />
                </SelectTrigger>
                <SelectContent>
                  {LISTING_REJECTION_REASONS.map((r) => (
                    <SelectItem key={r.code} value={r.code}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedReasonMeta && (
                <p className="text-xs text-muted-foreground italic">
                  {selectedReasonMeta.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason-text">
                Feedback & Required Fixes <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason-text"
                rows={4}
                placeholder="Specify what the seller needs to correct before approval (e.g. upload sharper chassis photos, disclose screen repair)..."
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                className="resize-none text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting || !reasonCode || !reasonText.trim()}
            >
              {isSubmitting ? "Rejecting..." : "Send Rejection Notice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
