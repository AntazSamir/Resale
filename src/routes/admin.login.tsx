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
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { user, signIn, signOut, hydrated } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && user) {
      if (user.isAdmin || user.role === "ADMIN") {
        navigate({ to: "/admin" });
      }
    }
  }, [user, hydrated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      setError("Please enter your admin credentials.");
      return;
    }

    try {
      setLoading(true);
      const isEmail = cleanIdentifier.includes("@");
      const phone = isEmail ? undefined : cleanIdentifier;
      const email = isEmail ? cleanIdentifier : undefined;

      const res = await loginFn({
        data: {
          phone,
          email,
          password,
        },
      });

      if (!res.success || !res.token || !res.user) {
        setError(res.error || "Invalid credentials.");
        return;
      }

      // Check if user has administrative privileges
      if (!res.user.isAdmin && res.user.role !== "ADMIN") {
        await signOut();
        setError("Access Denied: This account does not have administrator privileges.");
        return;
      }

      // Store authentic admin session
      signIn({ token: res.token, user: res.user });
      navigate({ to: "/admin" });
    } catch (err: unknown) {
      setError((err as Error)?.message || "An unexpected error occurred during admin sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-2 hover:opacity-90 transition-opacity"
            aria-label="Resale Home"
          >
            <img src={resaleLogo} alt="Resale" className="h-8 w-auto object-contain" />
          </Link>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="size-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
              Secure Operations Desk
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
            Admin Console Sign In
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in with an authorized administrative account to access platform governance.
          </p>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Lock className="size-4 text-muted-foreground" /> Admin Authentication
            </CardTitle>
            <CardDescription className="text-xs">
              Direct server-authoritative session verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 text-xs">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="identifier" className="text-xs font-medium">
                  Phone or Email Address
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="01765918998 or asr.resale@gmail.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium">
                  Admin Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  className="text-xs h-9"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-9 text-xs font-medium" disabled={loading}>
                {loading ? "Authenticating..." : "Sign In to Admin Console"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3" /> Return to Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
