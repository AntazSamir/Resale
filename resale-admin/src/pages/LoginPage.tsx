import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Alert,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import { useAuth } from "@/lib/auth-store";
import { adminApi } from "@/lib/api-client";

export function LoginPage() {
  const { user, hydrated, signIn } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && user && (user.isAdmin || user.role === "ADMIN")) {
      navigate("/", { replace: true });
    }
  }, [user, hydrated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = identifier.trim();
    if (!clean || !password) {
      setError("Please enter your admin credentials.");
      return;
    }

    try {
      setLoading(true);
      const res = await adminApi.login(clean, password);

      if (!res.success || !res.token || !res.user) {
        setError(res.error ?? "Invalid credentials.");
        return;
      }

      if (!res.user.isAdmin && res.user.role !== "ADMIN") {
        setError("Access Denied: This account does not have administrator privileges.");
        return;
      }

      signIn(res.token, res.user);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
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
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
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
                  placeholder="01765918998 or admin@resale.com"
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
            <ArrowLeft className="size-3" /> Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
