import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, RefreshCw, Database, TrendingUp, ShoppingCart, Shield } from "lucide-react";
import { taka } from "@/lib/utils";
import { useAuth } from "@/lib/auth-store";
import { getAdminAnalyticsFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [{ title: "Platform Analytics | Admin Console | Resale.com" }],
  }),
});
