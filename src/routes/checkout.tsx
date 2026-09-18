import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  Clock,
  AlertCircle,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { listingFor, productFor } from "@/data/catalog";
import { taka } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-store";
import { ProtectedRoute } from "@/components/protected-route";
import {
  saveOrder,
  calculateOrderTotals,
  createOrderTimelineEvent,
  DEFAULT_DELIVERY_FEE,
  type OrderRecord,
  type OrderItemSnapshot,
} from "@/lib/order-store";
import { placeOrderFn } from "@/lib/server-functions";
import resaleLogo from "@/assets/resale-logo.svg";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout | Resale.com" }],
  }),
});
