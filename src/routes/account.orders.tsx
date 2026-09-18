import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { taka } from "@/lib/utils";
import {
  getOrders,
  fetchOrdersAsync,
  onOrdersChange,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/order-store";
import { useAuth } from "@/lib/auth-store";

import { ProtectedRoute } from "@/components/protected-route";

export const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [{ title: "My Orders | Resale.com" }],
  }),
});
