import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { SellerSidebar } from "@/components/seller-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import { getSellerAnalyticsFn, type SellerAnalyticsData } from "@/lib/server-functions";
import { type Grade } from "@/data/types";
import { taka } from "@/lib/utils";
import { GradeBadge } from "@/components/grade-badge";
import { Loader } from "@/components/ui/loader";
import {
  Eye,
  ShoppingCart,
  Heart,
  Package,
  Wallet,
  Percent,
  Clock,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Search,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/seller/analytics")({
  head: () => ({
    meta: [
      { title: "Seller Analytics Intelligence | Resale.com" },
      {
        name: "description",
        content:
          "Evidence-based seller performance metrics derived strictly from actual recorded Resale data.",
      },
    ],
  }),
});
