import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  Check,
  CheckCircle2,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
  Send,
  AlertCircle,
  Package,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import resaleLogo from "@/assets/resale-logo.svg";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Partner with Resale | Turn Excess Inventory Into Revenue" },
      {
        name: "description",
        content:
          "Apply for the Resale B2B Partner Program. Turn excess, returned, open-box, refurbished, or pre-owned electronics inventory into revenue across Bangladesh.",
      },
    ],
  }),
});
