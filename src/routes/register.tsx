import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { sendOtpFn, verifyOtpFn } from "@/lib/server-functions";
import { AlertCircle, Lock } from "lucide-react";
import resaleLogo from "@/assets/resale-logo.svg";
import { GoogleAuthButton, AuthDivider } from "@/components/google-auth-button";

interface RegisterSearch {
  redirect?: string | undefined;
}

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => {
    const raw = search["redirect"];
    return {
      redirect: typeof raw === "string" ? raw : undefined,
    };
  },
  head: () => ({
    meta: [{ title: "Register | Resale.com" }],
  }),
});
