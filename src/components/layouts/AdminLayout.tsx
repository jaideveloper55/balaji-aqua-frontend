import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ORG_CONFIGS } from "../../config/orgConfig";
import { useAuthStore } from "../../store/auth.store";
import { logoutApi } from "../../modules/auth/api/auth.api";
import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";
import AppHeader from "./AppHeader";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}
interface AdminLayoutProps {
  children?: React.ReactNode;
  orgId?: string;
  onOrgSwitch?: (newOrgId: string) => void;
}

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 72;

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const companies = useAuthStore((s) => s.companies);
  const setActiveCompany = useAuthStore((s) => s.setActiveCompany);
  const getActiveCompany = useAuthStore((s) => s.getActiveCompany);

  const activeCompany = getActiveCompany();

  const allOrgs = Object.values(ORG_CONFIGS);

  const config: any =
    activeCompany?.type === "BEVERAGE" ? allOrgs[1] : allOrgs[0];

  const otherOrgs = allOrgs.filter((o: any) => o.id !== config.id);

  const { menuItems: items } = config as { menuItems: MenuItem[] };

  // Real user from auth store
  const user = useAuthStore((s) => s.user);

  // Logout mutation
  const logout = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => logoutApi().then((res) => res.data),
    onSuccess: () => {
      useAuthStore.getState().logout();
      navigate("/login");
    },
    onError: () => {
      useAuthStore.getState().logout();
      navigate("/login");
    },
  });

  const userName = user
    ? `${user.firstName} ${user.lastName}`.trim() || "User"
    : "User";
  const userEmail = user?.email ?? "";
  const userInitials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isLg, setIsLg] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Track lg breakpoint
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsLg(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Sync active menu with URL
  useEffect(() => {
    const found = items.find((item) => location.pathname.startsWith(item.href));
    if (found) setActiveMenu(found.id);
  }, [location.pathname, items]);

  // Lock body scroll on mobile drawer
  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Real logout — clears tokens, hits API, redirects
  const handleLogout = () => logout.mutate();

  const handleOrgSwitch = (orgConfigId: string) => {
    const targetType =
      orgConfigId === "royal-beverage" ? "BEVERAGE" : "WATER_PLANT";
    const realCompany = companies.find((c) => c.type === targetType);
    if (!realCompany) return;
    setActiveCompany(realCompany.id);
  };

  const handleMobileMenuClick = (id: string) => {
    setActiveMenu(id);
    setIsMobileSidebarOpen(false);
  };

  const handleMobileLogoClick = () => {
    navigate("/admin/dashboard");
    setIsMobileSidebarOpen(false);
  };

  const handleMobileLogout = () => {
    setIsMobileSidebarOpen(false);
    handleLogout();
  };

  const sidebarW = isSidebarOpen ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;
  const mainMarginLeft = isLg ? sidebarW : 0;

  const currentPage = items.find((m) => m.id === activeMenu);
  const pageTitle = currentPage?.label || "Dashboard";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DesktopSidebar
        config={config}
        expanded={isSidebarOpen}
        activeMenu={activeMenu}
        width={sidebarW}
        onExpand={() => setIsSidebarOpen(true)}
        onCollapse={() => setIsSidebarOpen(false)}
        onMenuClick={setActiveMenu}
        onLogoClick={() => navigate("/admin/dashboard")}
        onLogout={handleLogout}
      />

      <MobileSidebar
        open={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        config={config}
        otherOrgs={otherOrgs}
        activeMenu={activeMenu}
        userName={userName}
        userEmail={userEmail}
        userInitials={userInitials}
        onMenuClick={handleMobileMenuClick}
        onLogoClick={handleMobileLogoClick}
        onOrgSwitch={handleOrgSwitch}
        onLogout={handleMobileLogout}
      />

      <div
        className="flex-1 flex flex-col min-w-0"
        style={{
          marginLeft: mainMarginLeft,
          transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <AppHeader
          config={config}
          otherOrgs={otherOrgs}
          pageTitle={pageTitle}
          isProfileOpen={isProfileOpen}
          profileMenuRef={profileMenuRef}
          onToggleProfile={() => setIsProfileOpen((p) => !p)}
          onCloseProfile={() => setIsProfileOpen(false)}
          onOrgSwitch={handleOrgSwitch}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 lg:p-6 custom-scrollbar">
          {children ?? <Outlet />}
          <p className="mt-8 pb-2 text-center text-gray-600 text-[11px]">
            &copy; {new Date().getFullYear()} JAI Dev. All Rights Reserved.
          </p>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
