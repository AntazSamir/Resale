import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, FileText, ShieldCheck, Star } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GradeBadge } from "@/components/grade-badge";
import { ProductCard } from "@/components/product-card";
import { ConditionScore } from "@/components/condition-score";
import { cheapest, listingsFor, productFor, products } from "@/data/catalog";
import { taka } from "@/lib/utils";
import { gradeCriteria, gradeLabel, grades } from "@/data/types";

import { getApprovedVideosForProduct } from "@/lib/creator-store";
import { CreatorReviewStrip } from "@/components/creator/creator-review-strip";
import { StoreBadge } from "@/components/storefront/store-badge";
import { getProductRecommendations } from "@/lib/recommendation-engine";
import { ProductDetailSkeleton } from "@/components/product-detail-skeleton";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = productFor(params.productId);
    if (!product) throw notFound();
    const videos = getApprovedVideosForProduct(params.productId);
    return { product, videos };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.product.name ?? "Product";
    const title = `${name} — compare seller listings | Resale.com`;
    const description = `Compare graded pre-owned ${name} listings from verified sellers in Bangladesh, with condition reports, warranty status and cash on delivery.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  pendingComponent: ProductDetailSkeleton,
});
