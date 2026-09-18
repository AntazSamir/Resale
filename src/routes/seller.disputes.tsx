import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SellerSidebar } from "@/components/seller-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileCheck2,
  XCircle,
  HelpCircle,
  Eye,
  X,
  MessageSquare,
  Lock,
} from "lucide-react";
import { taka } from "@/lib/utils";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import {
  getDisputes,
  getDisputesForSeller,
  submitSellerResponse,
  getSellerSlaStatus,
  REASON_LABELS,
  DEFECT_CATEGORY_LABELS,
  type DisputeRecord,
  type EvidenceItem,
} from "@/lib/dispute-store";

export const Route = createFileRoute("/seller/disputes")({
  head: () => ({
    meta: [{ title: "Dispute Mediation & Claims | Seller Hub" }],
  }),
});
