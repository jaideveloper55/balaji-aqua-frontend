// src/components/layouts/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

import type { ReactNode } from "react";
import { useAuthStore } from "../store/auth.store";

interface ProtectedRouteProps {
  // Optional: when used as wrapper <ProtectedRoute><X /></ProtectedRoute>
  children?: ReactNode;
  // Optional: restrict to specific roles
  allowedRoles?: Array<"SUPER_ADMIN" | "ADMIN" | "STAFF" | "DELIVERY_BOY">;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  // Not logged in → redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but role doesn't match
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Render either passed children OR <Outlet /> (for nested routes)
  return children ? <>{children}</> : <Outlet />;
};
