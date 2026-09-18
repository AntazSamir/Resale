import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SellerSidebar } from "@/components/seller-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { taka } from "@/lib/utils";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import {
  getOrders,
  fetchOrdersAsync,
  onOrdersChange,
  transitionOrderStatus,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/order-store";
import { confirmOrderAsSellerFn } from "@/lib/server-functions";

export const Route = createFileRoute("/seller/orders")({
  head: () => ({
    meta: [{ title: "Seller Orders Fulfillment | Resale.com" }],
  }),
});
