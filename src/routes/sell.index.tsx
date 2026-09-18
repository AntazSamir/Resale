import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GradeSelector } from "@/components/grade-selector";
import { evaluateGrading, type GradingAnswers } from "@/data/grading";
import { products } from "@/data/catalog";
import { taka } from "@/lib/utils";
import { useAuth } from "@/lib/auth-store";
import { submitListingForReviewFn, saveListingDraftFn, getListingFn } from "@/lib/server-functions";
import {
  Check,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Recycle,
  Building2,
  Mail,
  ArrowDown,
  Layers,
  Sparkles,
  UploadCloud,
  Image as ImageIcon,
  X,
  Plus,
  Save,
  Send,
} from "lucide-react";
import resaleLogo from "@/assets/resale-logo.svg";

interface SellSearch {
  editId?: string | undefined;
}

export const Route = createFileRoute("/sell/")({
  validateSearch: (search: Record<string, unknown>): SellSearch => ({
    editId: typeof search["editId"] === "string" ? search["editId"] : undefined,
  }),
  head: () => ({
    meta: [{ title: "Sell with Us & Partner Program | Resale.com" }],
  }),
});
