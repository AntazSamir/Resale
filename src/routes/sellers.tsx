import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { getCreators } from "@/lib/creator-store";
import { getStores } from "@/lib/store-store";
import {
  ShieldCheck,
  Star,
  MapPin,
  ArrowRight,
  Store,
  Video,
  Search,
  CheckCircle2,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/sellers")({
  head: () => ({
    meta: [
      { title: "Verified Pro Sellers & Tech Creators — Resale" },
      {
        name: "description",
        content:
          "Discover trusted pre-owned device shops and tech reviewer profiles across Bangladesh. 32-point inspection, transparent condition grading, and verified warranties.",
      },
    ],
  }),
});
