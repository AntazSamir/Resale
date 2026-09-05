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
import { sendOtpFn, loginFn, changePasswordFn } from "@/lib/server-functions";
import { AlertCircle, Lock, Eye, EyeOff, KeyRound, X, CheckCircle2 } from "lucide-react";
import resaleLogo from "@/assets/resale-logo.svg";
import { GoogleAuthButton, AuthDivider } from "@/components/google-auth-button";

interface LoginSearch {
  redirect?: string | undefined;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const raw = search["redirect"];
    return {
      redirect: typeof raw === "string" ? raw : undefined,
    };
  },
  head: () => ({
    meta: [{ title: "Login | Resale.com" }],
  }),
  component: LoginPage,
});

// ── Change‑Password Modal ─────────────────────────────────────────────────────
type FpStep = "id" | "otp" | "newpw" | "done";

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<FpStep>("id");
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const target = authMethod === "phone" ? phone : email;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === "phone" && phone.length < 11) {
      setError("Please enter a valid 11-digit mobile number.");
      return;
    }
    if (authMethod === "email" && (!email || !email.includes("@"))) {
      setError("Please enter a valid email address.");
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
    } catch {
      setError("Failed to send OTP. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setError(null);
    setStep("newpw");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await changePasswordFn({
        data: {
          phone: authMethod === "phone" ? phone : undefined,
          email: authMethod === "email" ? email : undefined,
          otp,
          newPassword,
        },
      });
      if (res?.success) {
        setStep("done");
      } else {
        setError(res?.error || "Failed to change password. Please try again.");
      }
    } catch {
      setError("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-background border border-border shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            <span className="font-semibold text-sm">Change Password</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Step indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            {(["id", "otp", "newpw"] as FpStep[]).map((s, i) => (
              <span key={s} className="flex items-center gap-1.5">
                <span
                  className={`size-5 rounded-full flex items-center justify-center font-semibold text-[10px] ${
                    step === s
                      ? "bg-primary text-primary-foreground"
                      : i < ["id", "otp", "newpw"].indexOf(step)
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                {i < 2 && <span className="w-4 h-px bg-border" />}
              </span>
            ))}
            <span className="ml-1">
              {step === "id"
                ? "Enter your ID"
                : step === "otp"
                  ? "Verify OTP"
                  : step === "newpw"
                    ? "Set new password"
                    : "Done"}
            </span>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1 — Enter ID */}
          {step === "id" && (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div className="flex rounded-md bg-secondary p-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("phone");
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 font-medium rounded transition-colors ${authMethod === "phone" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("email");
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 font-medium rounded transition-colors ${authMethod === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  Email
                </button>
              </div>
              {authMethod === "phone" ? (
                <Input
                  id="fp-phone"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              ) : (
                <Input
                  id="fp-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending OTP…" : "Send Verification Code"}
              </Button>
            </form>
          )}

          {/* Step 2 — OTP */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-foreground">{target}</span>.{" "}
                <span className="text-subtle-foreground">(Use 123456 in dev)</span>
              </p>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={(v) => setOtp(v)}>
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
              <Button type="submit" className="w-full" disabled={otp.length !== 6}>
                Verify Code
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep("id");
                  setOtp("");
                  setError(null);
                }}
                className="w-full text-xs text-primary hover:underline"
              >
                ← Change {authMethod === "phone" ? "phone number" : "email"}
              </button>
            </form>
          )}

          {/* Step 3 — New password */}
          {step === "newpw" && (
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="fp-newpw" className="text-xs">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="fp-newpw"
                    type={showNewPw ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showNewPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fp-confirmpw" className="text-xs">
                  Confirm Password
                </Label>
                <Input
                  id="fp-confirmpw"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving…" : "Set New Password"}
              </Button>
            </form>
          )}

          {/* Step 4 — Done */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="size-10 text-success" />
              <p className="font-semibold text-sm">Password changed successfully!</p>
              <p className="text-xs text-muted-foreground">
                You can now log in with your new password.
              </p>
              <Button onClick={onClose} className="w-full mt-1">
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Login Page ─────────────────────────────────────────────────────────────────
function LoginPage() {
  const search = Route.useSearch();
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === "phone" && phone.length < 11) {
      setError("Please enter a valid 11-digit mobile number.");
      return;
    }
    if (authMethod === "email" && (!email || !email.includes("@"))) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await loginFn({
        data: {
          phone: authMethod === "phone" ? phone : undefined,
          email: authMethod === "email" ? email : undefined,
          password,
        },
      });
      if (res?.success && res.user && res.token) {
        signIn({ token: res.token, user: res.user });
        navigate({ to: search.redirect ?? "/" });
      } else {
        setError(res?.error || "Login failed. Please check your credentials.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

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
            <CardTitle className="text-2xl font-display font-bold">Welcome back</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {search.redirect?.includes("checkout")
                ? "Please sign in to proceed with your order checkout."
                : "Sign in to your Resale account."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {search.redirect && (
              <div className="mb-4 p-2.5 bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
                <Lock className="size-3.5 shrink-0" />
                <span>Account login required for order placement &amp; buyer protection.</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Method tab */}
              <div className="flex rounded-md bg-secondary p-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("phone");
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 font-medium rounded transition-colors ${authMethod === "phone" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Mobile Number
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("email");
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 font-medium rounded transition-colors ${authMethod === "email" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Email Address
                </button>
              </div>

              {/* ID field */}
              <div className="space-y-2">
                <Label htmlFor="login-id">
                  {authMethod === "phone" ? "Phone Number" : "Email Address"}
                </Label>
                {authMethod === "phone" ? (
                  <Input
                    id="login-id"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="01[3-9][0-9]{8}"
                    title="Valid Bangladesh mobile number starting with 01"
                  />
                ) : (
                  <Input
                    id="login-id"
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Forgot / Change Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Dev credentials: <span className="font-mono">Admin@1234</span> (admin) ·{" "}
                  <span className="font-mono">Seller@1234</span> (sellers)
                </p>
              </div>

              <Button type="submit" className="w-full font-semibold" disabled={loading}>
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>

            <AuthDivider />
            <GoogleAuthButton redirect={search.redirect} onError={setError} />
          </CardContent>

          <CardFooter className="justify-center border-t border-border/60 p-5">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              {search.redirect ? (
                <Link
                  to="/register"
                  search={{ redirect: search.redirect }}
                  className="text-primary hover:underline font-semibold"
                >
                  Register here
                </Link>
              ) : (
                <Link to="/register" className="text-primary hover:underline font-semibold">
                  Register here
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
