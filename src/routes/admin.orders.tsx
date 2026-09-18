import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  Database,
  TrendingUp,
  MapPin,
  Phone,
} from "lucide-react";
import { taka } from "@/lib/utils";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAuth } from "@/lib/auth-store";
import { getAdminOrdersFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [{ title: "Admin Transactions & Orders | Resale.com" }],
  }),
});
