import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SellerSidebar } from "@/components/seller-sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import { getStores, getStoreByOwnerId, saveStore, isSlugAvailable } from "@/lib/store-store";
import { Storefront } from "@/data/storefront";
import {
  Store,
  ShieldCheck,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Clock,
  RefreshCw,
  Phone,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/seller/storefront")({
  head: () => ({
    meta: [{ title: "Storefront Settings | Seller Hub · Resale.com" }],
  }),
});
