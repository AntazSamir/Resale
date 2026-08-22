import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean | undefined;
  redirect?: string | undefined;
}

export function ProtectedRoute({ children, requireAdmin = false, redirect }: ProtectedRouteProps) {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      if (redirect) {
        navigate({
          to: "/login",
          search: { redirect },
        });
      } else {
        navigate({
          to: "/login",
        });
      }
    }
  }, [isLoggedIn, navigate, redirect]);

  if (!isLoggedIn) {
    return null;
  }

  if (requireAdmin && !user?.isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center py-32 px-5">
        <div className="text-center max-w-sm">
          <p className="text-5xl font-bold font-display mb-4">403</p>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm">
            You don&apos;t have permission to view this page. Admin access is required.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
