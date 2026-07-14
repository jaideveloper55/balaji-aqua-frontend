import { Navigate, Outlet, useLocation } from "react-router-dom";

import type { ReactNode } from "react";
import { useAuthStore } from "../store/auth.store";

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: Array<"SUPER_ADMIN" | "ADMIN" | "STAFF" | "DELIVERY_BOY">;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
