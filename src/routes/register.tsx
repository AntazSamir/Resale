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
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [{ title: "Register | Resale.com" }],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nid, setNid] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      phone.length < 11 ||
      (nid.length !== 10 && nid.length !== 13 && nid.length !== 17) ||
      name.length < 2
    ) {
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await sendOtpFn({ data: { phone } });
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
          phone,
          otp,
          name,
          nid,
        },
      });

      if (res && res.success && res.user) {
        signIn(res.user);
        navigate({ to: "/" });
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center p-5">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              {step === "details"
                ? "Join Resale.com to buy or sell quality-checked electronics."
                : `We sent a 6-digit code to ${phone}. (Enter 123456 in dev/testing)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {step === "details" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                  <p className="text-[10px] text-muted-foreground">
                    Required for all users to ensure marketplace trust per PRD guidelines.
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending OTP…" : "Send OTP"}
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
                <Button type="submit" className="w-full" disabled={otp.length !== 6 || loading}>
                  {loading ? "Verifying…" : "Complete Registration"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("details");
                      setError(null);
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Change registration details
                  </button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t p-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
