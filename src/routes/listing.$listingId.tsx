import { useState, useEffect } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { type Grade, type Listing } from "@/data/types";
import {
  Check,
  Truck,
  AlertTriangle,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Battery,
  Box,
  Play,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { useCart } from "@/lib/cart-store";
import { trackActiveEvent } from "@/lib/event-tracker";
import { GradeBadge } from "@/components/grade-badge";
import { ProductCard } from "@/components/product-card";
import { ConditionScore } from "@/components/condition-score";
import { InspectionReport } from "@/components/inspection-report";
import { RepairHistoryCard } from "@/components/repair-history";
import { DeviceVerificationCard } from "@/components/device-verification";
import { WhatsIncludedCard } from "@/components/whats-included";
import { SellerTrustLine } from "@/components/seller-trust-card";
import { ListingDetailSkeleton } from "@/components/listing-detail-skeleton";
import { getApprovedVideoForListing } from "@/lib/creator-store";
import { CreatorVideoModal } from "@/components/creator/creator-video-modal";
import { getDeviceGradesFn, type DeviceGradeRecord } from "@/lib/grading.functions";
import { cheapest, listings, listingsFor, productFor, products } from "@/data/catalog";
import { taka } from "@/lib/utils";
import { galleryShots, gradeCriteria, gradeLabel, grades } from "@/data/types";

import { useAuth } from "@/lib/auth-store";
import { isListingPubliclyEligible } from "@/lib/listing-eligibility";
import { Eye, Clock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/listing/$listingId")({
  loader: async ({ params }) => {
    let listing = listings.find((l) => l.id === params.listingId);
    if (!listing) {
      const { db } = await import("@/db");
      const dbListing = db.listings.find((l) => l.id === params.listingId);
      if (dbListing) {
        listing = {
          id: dbListing.id,
          productId: dbListing.productId,
          conditionScore: dbListing.conditionScore,
          inspection: [],
          sellerNote: dbListing.sellerNote,
          listedAt: dbListing.listedAt,
          price: Math.round(dbListing.pricePoisha / 100),
          grade: dbListing.grade as Grade,
          warrantyMonths: dbListing.warrantyMonths,
          invoice: dbListing.hasInvoice,
          battery: dbListing.batteryHealth ?? undefined,
          accessories: dbListing.accessories || "Device only",
          repairs: dbListing.repairs || "None reported",
          physical: dbListing.physicalCondition || "Inspected",
          screen: dbListing.screenCondition || "Inspected",
          seller: {
            name: "Verified Seller",
            verified: true,
            rating: 5.0,
            sales: 12,
            district: "Dhaka",
          },
          sellerId: dbListing.sellerId,
          status: dbListing.status,
          moderationStatus: dbListing.moderationStatus,
          isSeed: dbListing.isSeed,
        } as Listing;
      }
    }
    const product = listing ? productFor(listing.productId) : undefined;
    if (!listing || !product) throw notFound();
    return { listing, product };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.product.name ?? "Listing";
    const grade = loaderData?.listing.grade ?? "A";
    const title = `${name} · Grade ${grade} — seller listing | Resale.com`;
    const description = `Condition-graded ${name} listed by a verified seller: full inspection report, warranty and invoice status, cash on delivery across Bangladesh.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  pendingComponent: ListingDetailSkeleton,
});
