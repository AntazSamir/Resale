import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SellerSidebar } from "@/components/seller-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Grade } from "@/data/types";
import { taka } from "@/lib/utils";
import { GradeBadge } from "@/components/grade-badge";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import { getSellerListingsFn, updateListingAvailabilityFn } from "@/lib/server-functions";
import { ListingStatusBadge } from "@/components/seller/listing-status-badge";
import { AuditHistorySheet } from "@/components/moderation/audit-history-sheet";
import { Loader } from "@/components/ui/loader";
import {
  Plus,
  RefreshCw,
  Pause,
  Play,
  Ban,
  Edit3,
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/seller/listings")({
  head: () => ({
    meta: [{ title: "My Inventory & Listings | Resale.com" }],
  }),
});
