import { Navigate, Outlet } from "react-router";

import { useAuthContext } from "@/contexts";

export default function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
