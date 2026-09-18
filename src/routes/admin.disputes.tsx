import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCw, Database } from "lucide-react";
import { taka } from "@/lib/utils";
import { useAuth } from "@/lib/auth-store";
import { getAdminDisputesFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/disputes")({
  head: () => ({
    meta: [{ title: "Dispute Mediation | Admin Console | Resale.com" }],
  }),
});
