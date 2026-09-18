import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  Trash2,
  Bookmark,
  ArrowRight,
  Shield,
  Truck,
  RotateCcw,
  CheckCircle2,
  Tag,
  Sparkles,
  Lock,
  ShoppingBag,
  Undo2,
  HelpCircle,
  Clock,
  Check,
  ChevronRight,
  Smartphone,
} from "lucide-react";
import { productFor, listingFor, products, cheapest } from "@/data/catalog";
import { type Grade } from "@/data/types";
import { taka } from "@/lib/utils";
import { gradeLabel } from "@/data/types";
import { GradeBadge } from "@/components/grade-badge";
import { useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your Cart | Resale.com - Certified Pre-Owned Devices" }],
  }),
});
