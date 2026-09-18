import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Lock,
  Battery,
  Layers,
  Wrench,
  HelpCircle,
  Smartphone,
  Check,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Copy,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { type Grade } from "@/data/types";
import { gradingCriteria, evaluateGrading, type GradingAnswers } from "@/data/grading";
import { GradeBadge } from "@/components/grade-badge";
import { ConditionScore } from "@/components/condition-score";
import { useAuth } from "@/lib/auth-store";
import {
  saveDeviceGradeFn,
  getDeviceGradesFn,
  type DeviceGradeRecord,
} from "@/lib/grading.functions";

export const Route = createFileRoute("/grading")({
  head: () => ({
    meta: [
      { title: "Grading System (A+ to D) — Resale.com Standardized Condition Guide" },
      {
        name: "description",
        content:
          "Learn how Resale grades used and open-box electronics in Bangladesh. Objective 100-point scoring, 32-point inspection checks, and 48-hour buyer protection against condition mismatches.",
      },
      {
        property: "og:title",
        content: "Grading System (A+ to D) — Resale.com Standardized Condition Guide",
      },
      {
        property: "og:description",
        content:
          "Objective A+ to D condition tiers, 32-point hardware inspection standards, and real-time grading simulator.",
      },
    ],
  }),
});
