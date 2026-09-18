import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  RefreshCw,
  Database,
  Search,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { getAdminSellerVerificationFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/identity")({
  head: () => ({
    meta: [{ title: "Seller Verification | Admin Console | Resale.com" }],
  }),
});
