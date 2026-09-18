import { createFileRoute, Link, useSearch, useRouter } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { ListingCard } from "@/components/listing-card";
import { ListingCardSkeleton } from "@/components/listing-card-skeleton";
import { products, listings, productFor } from "@/data/catalog";
import { type Grade } from "@/data/types";
import { taka } from "@/lib/utils";
import { grades, gradeLabel } from "@/data/types";
import { isListingPubliclyEligible } from "@/lib/listing-eligibility";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  RotateCcw,
  Package,
  LayoutGrid,
  List,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

interface ProductsSearch {
  q?: string | undefined;
  category?: string | undefined;
  brand?: string | undefined;
  sub?: string | undefined;
}

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    brand: typeof search["brand"] === "string" ? search["brand"] : undefined,
    sub: typeof search["sub"] === "string" ? search["sub"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse Graded Electronics | Resale.com" },
      {
        name: "description",
        content:
          "Browse all available graded pre-owned electronics from verified sellers in Bangladesh. 32-point inspection, NID verification, and 48-hour buyer protection.",
      },
    ],
  }),
});
