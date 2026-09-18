import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Database, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { getAdminInspectionsFn } from "@/lib/server-functions";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/admin/inspections")({
  head: () => ({
    meta: [{ title: "Inspections | Admin Console | Resale.com" }],
  }),
});
