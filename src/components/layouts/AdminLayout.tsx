import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrgConfig, ORG_CONFIGS } from "../../config/orgConfig";
import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";
import AppHeader from "./AppHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
  orgId?: string;
  onOrgSwitch?: (newOrgId: string) => void;
}

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 72;

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  orgId,
  onOrgSwitch,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const config = getOrgConfig(orgId);
  const { menuItems: items } = config;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isLg, setIsLg] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // TODO: replace with your actual auth context
  const userName = "Admin";
  const userEmail = `admin@${config.id.replace("-", "")}.com`;
  const userInitials = userName[0].toUpperCase();
  const userRole = "Plant Admin";

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

  const handleLogout = () => navigate("/login");

  const otherOrgs = Object.values(ORG_CONFIGS).filter(
    (c) => c.id !== config.id
  );

  const handleOrgSwitch = (newOrgId: string) => {
    setIsProfileOpen(false);
    setIsMobileSidebarOpen(false);
    if (onOrgSwitch) {
      onOrgSwitch(newOrgId);
    } else {
      localStorage.setItem("orgId", newOrgId);
      window.location.href = "/admin/dashboard";
    }
  };

  const handleMobileMenuClick = (id: string) => {
    setActiveMenu(id);
    setIsMobileSidebarOpen(false);
  };

  const handleMobileLogoClick = () => {
    navigate("/");
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
        onLogoClick={() => navigate("/")}
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
          userName={userName}
          userEmail={userEmail}
          userInitials={userInitials}
          userRole={userRole}
          isProfileOpen={isProfileOpen}
          profileMenuRef={profileMenuRef}
          onToggleProfile={() => setIsProfileOpen((p) => !p)}
          onCloseProfile={() => setIsProfileOpen(false)}
          onOrgSwitch={handleOrgSwitch}
          onLogout={handleLogout}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 lg:p-6 custom-scrollbar">
          {children}
          <p className="mt-8 pb-2 text-center text-gray-600 text-[11px]">
            &copy; {new Date().getFullYear()} JAI Dev. All Rights Reserved.
          </p>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
