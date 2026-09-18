import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { SellerSidebar } from "@/components/seller-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BarChart3,
  List,
  Wallet,
  Plus,
  Star,
  Package,
  ChevronRight,
  Store,
  Sparkles,
  UploadCloud,
  ShieldAlert,
  ArrowUpRight,
  Eye,
  ShoppingCart,
  Percent,
  CheckCircle2,
} from "lucide-react";
import { taka } from "@/lib/utils";
import { ProtectedRoute } from "@/components/protected-route";
import {
  getOrders,
  fetchOrdersAsync,
  onOrdersChange,
  transitionOrderStatus,
  type OrderRecord,
} from "@/lib/order-store";
import {
  getSellerAnalyticsFn,
  confirmOrderAsSellerFn,
  type SellerAnalyticsData,
} from "@/lib/server-functions";
import { useAuth } from "@/lib/auth-store";
import { Badge } from "@/components/ui/badge";
import resaleLogo from "@/assets/resale-logo.svg";

export const Route = createFileRoute("/seller/dashboard")({
  head: () => ({
    meta: [{ title: "Seller Dashboard | Resale.com" }],
  }),
});
