import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/auth.store";
import type { MenuKey } from "../modules/uam/types/Uam";

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: Array<"SUPER_ADMIN" | "ADMIN" | "STAFF" | "DELIVERY_BOY">;
  // If set, this route also requires the logged-in user's role to have
  // this menuKey enabled (same RoleMenuPermission data SidebarNav reads).
  // Mirrors the sidebar's own gate, so a hidden link and a blocked route
  // are always the same decision — never one without the other.
  menuKey?: MenuKey;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  menuKey,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const enabledMenuKeys = useAuthStore((s) => s.enabledMenuKeys);

  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Super Admin bypasses this gate entirely — same unconditional rule
  // as SidebarNav and UamService ("Super Admin always has full access").
  if (
    menuKey &&
    user.role !== "SUPER_ADMIN" &&
    !enabledMenuKeys.includes(menuKey)
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
