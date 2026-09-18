import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Smartphone,
  Tag,
  Clock,
  RefreshCw,
} from "lucide-react";
import { type Grade } from "@/data/types";
import { taka } from "@/lib/utils";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import { getModerationQueueFn, moderateListingFn } from "@/lib/server-functions";
import { RejectionDialog } from "@/components/moderation/rejection-dialog";
import { AuditHistorySheet } from "@/components/moderation/audit-history-sheet";
import { GradeBadge } from "@/components/grade-badge";
import type { ListingRejectionReasonCode } from "@/lib/types";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({
    meta: [{ title: "Listing Moderation Workbench | Resale.com" }],
  }),
});
