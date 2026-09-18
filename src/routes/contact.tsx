import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  HelpCircle,
  Mail,
  MessageSquare,
  Clock,
  Phone,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Building2,
  Send,
  Recycle,
  Check,
  DollarSign,
  Search,
  Eye,
  Award,
  Users,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GradeBadge } from "@/components/grade-badge";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us & Help Center | Resale.com" },
      {
        name: "description",
        content:
          "Have questions about buying, selling, condition grades or buyer protection on Resale? Contact support or read our comprehensive guide.",
      },
    ],
  }),
});
