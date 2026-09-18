import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck2,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Lock,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { taka } from "@/lib/utils";
import { inspectionFramework } from "@/data/types";
import { getOrders, type OrderRecord } from "@/lib/order-store";
import { useAuth } from "@/lib/auth-store";
import {
  createDispute,
  getDisputesForBuyer,
  isOrderEligibleForDispute,
  getSellerSlaStatus,
  REASON_LABELS,
  DEFECT_CATEGORY_LABELS,
  type DisputeReason,
  type DefectCategory,
  type EvidenceItem,
  type DisputeRecord,
} from "@/lib/dispute-store";

export const Route = createFileRoute("/account/disputes")({
  head: () => ({
    meta: [
      {
        title: "Dispute Mediation & Issue Reporting | Resale.com",
      },
      {
        name: "description",
        content:
          "Report condition mismatches, battery health discrepancies, or missing accessories within the 48-hour inspection guarantee window.",
      },
    ],
  }),
});
