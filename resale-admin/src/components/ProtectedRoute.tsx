import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-store";
import { Loader } from "@/components/ui";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader label="Verifying session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin && user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
