import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
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
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 11 && nid.length >= 10 && name.length > 2) {
      setLoading(true);
      // Simulate/call OTP generation
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);
      setStep("otp");
      setLoading(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      navigate({ to: "/" });
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
                : `We sent a 6-digit code to ${phone}.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    placeholder="10 or 17 digit NID number"
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
                <Button type="submit" className="w-full">
                  Send OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-6">
                {generatedOtp && (
                  <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-lg text-center font-mono text-xs">
                    <p className="font-bold">SMS Sent via Gateway to {phone}</p>
                    <p className="text-base font-black tracking-widest mt-1">
                      OTP CODE: {generatedOtp}
                    </p>
                  </div>
                )}
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
                <Button type="submit" className="w-full" disabled={otp.length !== 6}>
                  Verify & Create Account
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="text-sm text-primary hover:underline"
                  >
                    Go back
                  </button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t p-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
