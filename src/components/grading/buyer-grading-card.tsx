import { useState, useEffect } from "react";
import { GradeBadge } from "@/components/grade-badge";
import { GradeSelector } from "@/components/grade-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, CheckCircle2, AlertTriangle, FileCheck2, Sparkles } from "lucide-react";
import { type Grade } from "@/data/catalog";
import { type GradingAnswers, evaluateGrading } from "@/data/grading";
import {
  saveDeviceGradeFn,
  getDeviceGradesFn,
  type DeviceGradeRecord,
} from "@/lib/grading.functions";
import { useAuth } from "@/lib/auth-store";
import { Link } from "@tanstack/react-router";

interface BuyerGradingCardProps {
  orderId: string;
  listingId: string;
  itemTitle: string;
  sellerGrade: Grade;
  sellerConditionScore?: number | undefined;
  isOrderDeliveredOrCompleted: boolean;
}

export function BuyerGradingCard({
  orderId,
  listingId,
  itemTitle,
  sellerGrade,
  sellerConditionScore,
  isOrderDeliveredOrCompleted,
}: BuyerGradingCardProps) {
  const { token } = useAuth();
  const [buyerGrade, setBuyerGrade] = useState<DeviceGradeRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [answers, setAnswers] = useState<GradingAnswers>({
    physical: "pristine",
    screen: "original",
    functionality: "full",
    battery: "95",
    repairs: "none",
  });

  useEffect(() => {
    let active = true;
    getDeviceGradesFn({ data: { orderId } })
      .then((res) => {
        if (!active) return;
        if (res.success && Array.isArray(res.grades)) {
          const match = res.grades.find(
            (g) =>
              g.graderRole === "BUYER" && (g.listingId === listingId || res.grades.length === 1),
          );
          if (match) {
            setBuyerGrade(match);
          }
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [orderId, listingId]);

  if (!isOrderDeliveredOrCompleted) {
    return null;
  }

  const evaluation = evaluateGrading(answers);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Please sign in to submit your device verification.");
      return;
    }
    if (!evaluation.complete) {
      alert("Please answer all grading checklist criteria.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await saveDeviceGradeFn({
        data: {
          token,
          answers,
          productLabel: itemTitle,
          listingId,
          orderId,
          notes: notes.trim() || undefined,
          role: "BUYER",
        },
      });

      if (res.success) {
        setBuyerGrade(res.record);
        setShowForm(false);
        setFeedback("Device condition successfully graded and verified!");
        setTimeout(() => setFeedback(null), 5000);
      } else {
        alert(res.error || "Failed to save grade");
      }
    } catch (err: unknown) {
      console.error("Grading save error:", err);
      alert((err as { message?: string })?.message || "Failed to save verification");
    } finally {
      setSubmitting(false);
    }
  };

  // Check grade comparison
  const gradeRank: Record<Grade, number> = { "A+": 5, A: 4, B: 3, C: 2, D: 1 };
  const sellerRank = gradeRank[sellerGrade] || 3;
  const buyerRank = buyerGrade ? gradeRank[buyerGrade.grade] || 3 : 0;
  const hasMismatch = buyerGrade ? buyerRank < sellerRank : false;

  return (
    <Card className="border-border/80 shadow-xs mt-3 overflow-hidden">
      <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileCheck2 className="size-4 text-primary shrink-0" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Buyer Device Inspection &amp; Grading
            </CardTitle>
          </div>
          {buyerGrade && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
              <CheckCircle2 className="size-3" /> Graded by Buyer
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {feedback && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium text-xs flex items-center gap-2">
            <CheckCircle2 className="size-3.5 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Comparison section if buyer already graded */}
        {buyerGrade ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/40 border border-border/70">
              {/* Seller Grade Column */}
              <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-border/60 pb-2 sm:pb-0 sm:pr-3">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Seller Declared Grade
                </span>
                <div className="flex items-center gap-2">
                  <GradeBadge grade={sellerGrade} />
                  <span className="font-semibold text-foreground text-sm">Grade {sellerGrade}</span>
                  {sellerConditionScore && (
                    <span className="text-muted-foreground text-xs font-medium">
                      ({sellerConditionScore}/100 pts)
                    </span>
                  )}
                </div>
              </div>

              {/* Buyer Grade Column */}
              <div className="space-y-1.5 sm:pl-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Your Verified Grade
                </span>
                <div className="flex items-center gap-2">
                  <GradeBadge grade={buyerGrade.grade} />
                  <span className="font-semibold text-foreground text-sm">
                    Grade {buyerGrade.grade}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">
                    ({buyerGrade.conditionScore}/100 pts)
                  </span>
                </div>
              </div>
            </div>

            {/* Verdict statement */}
            {hasMismatch ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                  <span>Condition Discrepancy Detected</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Your verified evaluation (Grade {buyerGrade.grade}) is lower than the seller's
                  declared condition (Grade {sellerGrade}). Under our 48-hour doorstep inspection
                  guarantee, you are protected against undisclosed defects.
                </p>
                <div className="pt-1">
                  <Link
                    to="/account/disputes"
                    search={{
                      orderId,
                      reason: `Condition Mismatch: Seller declared Grade ${sellerGrade}, buyer verified Grade ${buyerGrade.grade}`,
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
                  >
                    Open Return / Dispute
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                <span className="text-[11px] font-medium">
                  Verified Condition Match: Your physical check aligns with the seller's original
                  declaration.
                </span>
              </div>
            )}

            {buyerGrade.notes && (
              <p className="text-[11px] text-muted-foreground italic border-t border-border/40 pt-2">
                &ldquo;{buyerGrade.notes}&rdquo;
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs leading-relaxed">
              Have you inspected your delivered device? Complete the authoritative 5-point grading
              checklist to record your verified condition on the server and check for any
              discrepancy.
            </p>

            {!showForm ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
                className="font-semibold text-xs border-primary/40 text-primary hover:bg-primary/10 gap-1.5"
              >
                <Sparkles className="size-3.5 text-primary" />
                Verify &amp; Grade This Device
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 border-t border-border/50 pt-4">
                <div className="flex items-center justify-between pb-1">
                  <span className="font-semibold text-foreground text-xs">
                    Standardized 100-Point Grading Form
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForm(false)}
                    className="text-xs h-7 px-2"
                  >
                    Cancel
                  </Button>
                </div>

                <GradeSelector answers={answers} onChange={setAnswers} />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Inspection Notes / Observations (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Screen and battery matched seller claims, small hairline on top bezel..."
                    className="w-full border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={submitting || !evaluation.complete}
                    className="font-semibold text-xs"
                  >
                    {submitting ? "Saving verification…" : "Submit & Lock Verified Grade"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
