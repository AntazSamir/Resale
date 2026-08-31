import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, CheckCircle, AlertCircle, TrendingUp, ShieldCheck } from "lucide-react";
import type { SellerTrustScoreData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SellerTrustBreakdownProps {
  data: SellerTrustScoreData;
  className?: string;
}

export function SellerTrustBreakdownDialog({ data, className }: SellerTrustBreakdownProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground",
            className,
          )}
        >
          <Info className="w-3 h-3 mr-1" />
          View Trust Math
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Seller Trust Breakdown
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Score Summary */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
            <div>
              <p className="text-sm font-medium text-slate-500">Current Trust Tier</p>
              <p className="text-lg font-bold text-slate-900">{data.tier.replace("_", " ")}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500">Trust Score</p>
              <p className="text-2xl font-black text-primary">
                {data.score !== null ? `${data.score}/100` : "N/A"}
              </p>
            </div>
          </div>

          {/* Calculation Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Deterministic Components
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Fulfillment Ratio (45 pts)</span>
                </div>
                <span className="text-sm font-bold">{data.breakdown.fulfillmentScore}/45</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Dispute-Free Record (35 pts)</span>
                </div>
                <span className="text-sm font-bold">{data.breakdown.disputeScore}/35</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Identity Verification (20 pts)</span>
                </div>
                <span className="text-sm font-bold">{data.breakdown.identityScore}/20</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                <Info className="w-3 h-3" />
                {data.dataCoverageStatement}
              </div>
            </div>
          </div>

          {/* Telemetry Evidence */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border">
              <p className="text-[10px] uppercase font-bold text-slate-400">Completed Orders</p>
              <p className="text-sm font-bold">{data.completedOrdersCount}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border">
              <p className="text-[10px] uppercase font-bold text-slate-400">Upheld Disputes</p>
              <p className="text-sm font-bold text-red-500">{data.upheldDisputesCount}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
