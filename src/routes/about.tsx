import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Eye,
  Scale,
  Leaf,
  Check,
  X,
  CheckCheck,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { BangladeshMapSVG } from "@/components/bangladesh-map";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Resale — Re-engineering Used Electronics Commerce in Bangladesh" },
      {
        name: "description",
        content:
          "Discover how Resale is making pre-owned electronics transparent, safe, and dignified across Bangladesh through 32-point standardized inspection, NID seller verification, and 48-hour buyer protection.",
      },
      {
        property: "og:title",
        content: "About Resale — Re-engineering Used Electronics Commerce in Bangladesh",
      },
      {
        property: "og:description",
        content:
          "Standardized condition grades, verified sellers, zero guesswork. Learn the story, mission, and technology behind Bangladesh's circular electronics marketplace.",
      },
    ],
  }),
});
