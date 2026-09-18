import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  FileCheck2,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  Layers,
  Lock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  Wallet,
  Watch,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { products, listings, productFor } from "@/data/catalog";
import { type Product, type Grade } from "@/data/types";
import { taka } from "@/lib/utils";
import { inspectionFramework, gradeCriteria, gradeLabel, grades } from "@/data/types";
import { isListingPubliclyEligible } from "@/lib/listing-eligibility";
import { getCreators } from "@/lib/creator-store";
import { getStores } from "@/lib/store-store";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-store";
import { getOrders, onOrdersChange, fetchOrdersAsync, type OrderRecord } from "@/lib/order-store";
import { getUserPersonalizedShelves } from "@/lib/recommendation-engine";
import heroBanner from "@/assets/hero-banner.webp";
import banner2 from "@/assets/banner-2.png";
import bannerImage1 from "@/assets/image-1.webp";
import bannerImage2 from "@/assets/image-2.webp";

const HERO_BANNERS = [
  {
    id: "banner-2",
    src: banner2,
    alt: "Standardized 32-Point Inspection & Diagnostics on Every Unit",
    link: "/products",
  },
  {
    id: "hero-banner",
    src: heroBanner,
    alt: "Premium Tech at Smarter Prices — Tested, Inspected & Guaranteed",
    link: "/products",
  },
];

export const Route = createFileRoute("/")({
  head: () => {
    const title = "Resale — Buy Used. Know Exactly What You're Getting.";
    const description =
      "Bangladesh's trusted marketplace for verified second-hand electronics. Standardized 32-point inspections, transparent A+–D grading, verified sellers, and 48-hour return window with Cash on Delivery.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
      ],
    };
  },
});
