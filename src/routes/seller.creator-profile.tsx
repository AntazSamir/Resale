import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SellerSidebar } from "@/components/seller-sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import {
  getCreators,
  getCreatorByUserId,
  saveCreator,
  isHandleAvailable,
  getProductVideos,
  getVideosByCreator,
  saveProductVideo,
} from "@/lib/creator-store";
import { CreatorProfile, ProductVideo, ReviewType } from "@/data/creator";
import { parseAndValidateVideoUrl } from "@/lib/video-parser";
import { products, listings } from "@/data/catalog";
import {
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Video,
  Plus,
  Play,
  Youtube,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/seller/creator-profile")({
  head: () => ({
    meta: [{ title: "Creator Hub | Seller · Resale.com" }],
  }),
});
