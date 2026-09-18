import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldCheck, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-store";
import { loginFn } from "@/lib/server-functions";
import resaleLogo from "@/assets/resale-logo.svg";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Sign In | Resale.com" }],
  }),
});
