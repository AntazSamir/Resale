import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Shield,
  PackageSearch,
  Package,
  TrendingUp,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  XCircle,
  Activity,
  ShoppingCart,
  Layers,
  MapPin,
  Users,
  Info,
  ArrowUpDown,
  ShoppingBag,
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAuth } from "@/lib/auth-store";
import {
  getAdminDashboardMetricsFn,
  getAdminGeographicAnalyticsFn,
  type GeoTimeRange,
  type GeographicAnalyticsResult,
} from "@/lib/server-functions";
import { taka } from "@/lib/utils";
import { BangladeshAdminMap } from "@/components/bangladesh-map";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Marketplace Overview | Admin Console | Resale.com" }],
  }),
});
