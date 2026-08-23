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
  component: RegisterPage,
});

function RegisterPage() {
  const search = Route.useSearch();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === "phone" && phone.length < 11) {
      setError("Please enter a valid 11-digit phone number.");
      return;
    }
    if (authMethod === "email" && (!email || !email.includes("@") || !email.includes("."))) {
      setError("Please enter a valid email address.");
      return;
    }
    if ((nid.length !== 10 && nid.length !== 13 && nid.length !== 17) || name.length < 2) {
      setError("Please fill out all required fields with valid information.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await sendOtpFn({
        data: {
          phone: authMethod === "phone" ? phone : undefined,
          email: authMethod === "email" ? email : undefined,
        },
      });
      setStep("otp");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setError(null);
    setLoading(true);

    try {
      const res = await verifyOtpFn({
        data: {
          phone: authMethod === "phone" ? phone : undefined,
          email: authMethod === "email" ? email : undefined,
          otp,
          name,
          nid,
        },
      });

      if (res && res.success && res.user && res.token) {
        signIn({ token: res.token, user: res.user });
        if (search.redirect) {
          navigate({ to: search.redirect });
        } else {
          navigate({ to: "/" });
        }
      } else {
        setError(res?.error || "Invalid or expired verification code.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration verification failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const targetLabel = authMethod === "phone" ? phone : email;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center p-5">
        <Card className="w-full max-w-md shadow-md border-border/80">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <Link
                to="/"
                className="inline-flex items-center hover:opacity-90 transition-opacity"
                aria-label="Resale Home"
              >
                <img
                  src={resaleLogo}
                  alt="Resale logo"
                  className="h-9 w-auto object-contain shrink-0"
                />
              </Link>
            </div>
            <CardTitle className="text-2xl font-display font-bold">Create an account</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {search.redirect?.includes("checkout")
                ? "Register a verified account to place your order."
                : step === "details"
                  ? "Join Resale.com to buy or sell quality-checked electronics."
                  : `We sent a 6-digit code to ${targetLabel}. (Enter 123456 in dev/testing)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {search.redirect && (
              <div className="mb-4 p-2.5 bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
                <Lock className="size-3.5 shrink-0" />
                <span>
                  NID-verified registration protects buyer purchase &amp; warranty claims.
                </span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {step === "details" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {/* Method selector tab */}
                <div className="flex rounded-md bg-secondary p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("phone");
                      setError(null);
                    }}
                    className={`flex-1 py-1.5 font-medium rounded transition-colors ${
                      authMethod === "phone"
                        ? "bg-background text-foreground shadow-sm font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Mobile Number
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("email");
                      setError(null);
                    }}
                    className={`flex-1 py-1.5 font-medium rounded transition-colors ${
                      authMethod === "email"
                        ? "bg-background text-foreground shadow-sm font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Email Address
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Rafiq Islam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {authMethod === "phone" ? (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      pattern="01[3-9][0-9]{8}"
                      title="Valid Bangladesh mobile number starting with 01"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="nid">NID Number</Label>
                  <Input
                    id="nid"
                    placeholder="10, 13, or 17 digit NID number"
                    value={nid}
                    onChange={(e) => setNid(e.target.value.replace(/\D/g, ""))}
                    required
                    pattern="^\d{10}$|^\d{13}$|^\d{17}$"
                    title="Please enter a valid 10, 13, or 17 digit NID number"
                  />
                  <p className="text-[10.5px] text-muted-foreground">
                    Required for all users to ensure marketplace trust per PRD guidelines.
                  </p>
                </div>
                <Button type="submit" className="w-full font-semibold" disabled={loading}>
                  {loading ? "Sending OTP…" : "Send Verification Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2 flex flex-col items-center">
                  <Label htmlFor="otp">One-Time Password</Label>
                  <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={otp.length !== 6 || loading}
                >
                  {loading ? "Verifying…" : "Complete Registration"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("details");
                      setError(null);
                    }}
                    className="text-xs text-primary hover:underline cursor-pointer"
                  >
                    Change registration details
                  </button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t border-border/60 p-5">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              {search.redirect ? (
                <Link
                  to="/login"
                  search={{ redirect: search.redirect }}
                  className="text-primary hover:underline font-semibold"
                >
                  Sign in here
                </Link>
              ) : (
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Sign in here
                </Link>
              )}
            </p>
          </CardFooter>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

