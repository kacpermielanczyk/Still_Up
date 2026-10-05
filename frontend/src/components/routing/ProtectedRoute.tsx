import { Navigate, Outlet } from "react-router";

import { useAuthContext } from "@/contexts";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="rounded-2xl border border-border bg-surface px-5 py-4 text-sm font-semibold text-text-muted shadow-sm">
          Checking session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
