import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { getOrgConfig, ORG_CONFIGS } from "../config/orgConfig";
import type { OrgConfig, OrgTheme } from "../config/orgConfig";
import { BsArrowLeftRight } from "react-icons/bs";

// ══════════════════════════════════════════════════════════════════
//  HELPER — build nav item classes with theme
// ══════════════════════════════════════════════════════════════════
const navItemClasses = (
  isActive: boolean,
  expanded: boolean,
  theme: OrgTheme
): string => {
  const base =
    "relative flex items-center gap-3 mx-2.5 rounded-xl transition-all duration-200 group/item";
  const sizing = expanded ? "px-3 py-2.5" : "justify-center px-0 py-2.5";
  const state = isActive
    ? `${theme.activeBg} text-white shadow-lg ${theme.activeShadow}`
    : `text-gray-500 ${theme.hoverBg} hover:text-gray-700`;
  return `${base} ${sizing} ${state}`;
};

// ══════════════════════════════════════════════════════════════════
//  MOBILE DRAWER
// ══════════════════════════════════════════════════════════════════
const MobileDrawer = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div
    className="fixed inset-0 z-50 flex lg:hidden"
    style={{ pointerEvents: open ? "all" : "none" }}
  >
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
      style={{ opacity: open ? 1 : 0, transition: "opacity 0.3s ease" }}
    />
    <div
      className="relative w-[280px] max-w-[85vw] bg-white flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.12)]"
      style={{
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {children}
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════
//  PROFILE DROPDOWN
// ══════════════════════════════════════════════════════════════════
const ProfileDropdown = ({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) => (
  <div
    className="absolute right-0 top-full mt-2 w-64 lg:w-72 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50"
    style={{
      opacity: open ? 1 : 0,
      transform: open
        ? "translateY(0) scale(1)"
        : "translateY(-8px) scale(0.96)",
      transition: "opacity 0.2s ease, transform 0.2s ease",
      pointerEvents: open ? "all" : "none",
    }}
  >
    {children}
  </div>
);

// ══════════════════════════════════════════════════════════════════
//  TOOLTIP (collapsed sidebar)
// ══════════════════════════════════════════════════════════════════
const Tooltip = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="relative group/tip">
    {children}
    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
      {label}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-gray-800" />
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════
//  SIDEBAR NAV
// ══════════════════════════════════════════════════════════════════
const SidebarNav = ({
  expanded,
  activeMenu,
  onItemClick,
  config,
}: {
  expanded: boolean;
  activeMenu: string;
  onItemClick: (id: string) => void;
  config: OrgConfig;
}) => {
  const { theme, menuItems, groups } = config;

  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
      {groups.map((group) => {
        const groupItems = menuItems.filter((m) => m.group === group);
        if (groupItems.length === 0) return null;
        return (
          <div key={group} className="mb-0.5">
            {/* Group label */}
            <div
              className="overflow-hidden"
              style={{
                maxHeight: expanded ? 32 : 0,
                opacity: expanded ? 0.6 : 0,
                transition: "max-height 0.25s ease, opacity 0.2s ease",
              }}
            >
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] px-5 pt-4 pb-1.5">
                {group}
              </p>
            </div>

            {groupItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;

              const linkEl = (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => onItemClick(item.id)}
                  className={navItemClasses(isActive, expanded, theme)}
                >
                  {/* Active bar — collapsed mode */}
                  {isActive && !expanded && (
                    <div
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 ${theme.activeBg} rounded-r-full`}
                    />
                  )}

                  <Icon
                    size={19}
                    className={`shrink-0 transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : `text-gray-400 ${theme.iconGroupHover}`
                    }`}
                  />

                  <span
                    className="text-[13px] font-medium whitespace-nowrap overflow-hidden leading-tight"
                    style={{
                      opacity: expanded ? 1 : 0,
                      maxWidth: expanded ? 180 : 0,
                      transition: "opacity 0.2s ease, max-width 0.25s ease",
                    }}
                  >
                    {item.label}
                  </span>

                  {isActive && expanded && (
                    <FiChevronRight
                      size={14}
                      className="ml-auto text-white/60 shrink-0"
                    />
                  )}
                </Link>
              );

              return expanded ? (
                <div key={item.id}>{linkEl}</div>
              ) : (
                <Tooltip key={item.id} label={item.label}>
                  {linkEl}
                </Tooltip>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
};

// ══════════════════════════════════════════════════════════════════
//  LOGO BLOCK
// ══════════════════════════════════════════════════════════════════
const LogoBlock = ({
  config,
  showText,
  onClick,
}: {
  config: OrgConfig;
  showText: boolean;
  onClick: () => void;
}) => {
  const LogoIcon = config.logoIcon;
  const { theme } = config;

  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
      <div
        className={`w-9 h-9 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} rounded-xl flex items-center justify-center shrink-0 shadow-md`}
        style={{ boxShadow: `0 4px 12px ${theme.primary}33` }}
      >
        <LogoIcon className="text-white" size={17} />
      </div>
      {showText && (
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">
            {config.name}
          </p>
          <p
            className={`text-[10px] ${theme.accentText} font-semibold tracking-wide`}
          >
            {config.subtitle}
          </p>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  MAIN LAYOUT
// ══════════════════════════════════════════════════════════════════
interface AdminLayoutProps {
  children: React.ReactNode;
  orgId?: string;
  /** Called when user switches org from the dropdown. Parent should update orgId. */
  onOrgSwitch?: (newOrgId: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  orgId,
  onOrgSwitch,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const config = getOrgConfig(orgId);
  const { theme, menuItems: items, groups } = config;
  const LogoIcon = config.logoIcon;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isLg, setIsLg] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // 👇 Replace with your actual auth context
  const userName = "Admin";
  const userEmail = `admin@${config.id.replace("-", "")}.com`;
  const userInitials = userName[0].toUpperCase();
  const userRole = "Plant Admin";

  const SIDEBAR_EXPANDED = 260;
  const SIDEBAR_COLLAPSED = 72;

  // ── Track lg breakpoint ──
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsLg(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // ── Sync active menu with URL ──
  useEffect(() => {
    const found = items.find((item) => location.pathname.startsWith(item.href));
    if (found) setActiveMenu(found.id);
  }, [location.pathname, items]);

  // ── Lock body scroll on mobile drawer ──
  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  // ── Close profile dropdown on outside click ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => navigate("/login");

  // ── Org switching ──
  const otherOrgs = Object.values(ORG_CONFIGS).filter(
    (c) => c.id !== config.id
  );

  const handleOrgSwitch = (newOrgId: string) => {
    setIsProfileDropdownOpen(false);
    if (onOrgSwitch) {
      onOrgSwitch(newOrgId);
    } else {
      // Default: persist to localStorage and reload
      localStorage.setItem("orgId", newOrgId);
      window.location.href = "/admin/dashboard";
    }
  };

  const sidebarW = isSidebarOpen ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;
  const mainMarginLeft = isLg ? sidebarW : 0;

  const currentPage = items.find((m) => m.id === activeMenu);
  const pageTitle = currentPage?.label || "Dashboard";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      {/* ═══════════ DESKTOP SIDEBAR ═══════════ */}
      <aside
        className="hidden lg:flex flex-col bg-white border-r border-gray-100 z-30 fixed top-0 left-0 h-full"
        style={{
          width: sidebarW,
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 border-b border-gray-100 shrink-0 h-16">
          <div
            className={`w-9 h-9 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} rounded-xl flex items-center justify-center shrink-0 shadow-md cursor-pointer`}
            style={{ boxShadow: `0 4px 12px ${theme.primary}33` }}
            onClick={() => navigate("/")}
          >
            <LogoIcon className="text-white" size={17} />
          </div>
          <div
            className="overflow-hidden whitespace-nowrap"
            style={{
              opacity: isSidebarOpen ? 1 : 0,
              maxWidth: isSidebarOpen ? 180 : 0,
              transition: "opacity 0.2s ease, max-width 0.25s ease",
            }}
          >
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {config.name}
            </p>
            <p
              className={`text-[10px] ${theme.accentText} font-semibold tracking-wide`}
            >
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Nav */}
        <SidebarNav
          expanded={isSidebarOpen}
          activeMenu={activeMenu}
          onItemClick={(id) => setActiveMenu(id)}
          config={config}
        />

        {/* Logout */}
        <div className="p-3 border-t border-gray-100 shrink-0">
          {isSidebarOpen ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200"
            >
              <AiOutlineLogout size={18} className="shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          ) : (
            <Tooltip label="Logout">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full py-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
              >
                <AiOutlineLogout size={18} />
              </button>
            </Tooltip>
          )}
        </div>
      </aside>

      {/* ═══════════ MOBILE DRAWER ═══════════ */}
      <MobileDrawer
        open={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 shrink-0">
          <LogoBlock
            config={config}
            showText
            onClick={() => {
              navigate("/");
              setIsMobileSidebarOpen(false);
            }}
          />
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close menu"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* Mobile nav */}
        <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {groups.map((group) => {
            const groupItems = items.filter((m) => m.group === group);
            if (groupItems.length === 0) return null;
            return (
              <div key={group} className="mb-0.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] px-5 pt-4 pb-1.5">
                  {group}
                </p>
                {groupItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => {
                        setActiveMenu(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`flex items-center gap-3 mx-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                        isActive
                          ? `${theme.activeBg} text-white shadow-lg ${theme.activeShadow}`
                          : `text-gray-600 ${theme.hoverBg} hover:text-gray-700`
                      }`}
                    >
                      <Icon
                        size={19}
                        className={`shrink-0 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      />
                      <span className="leading-tight">{item.label}</span>
                      {isActive && (
                        <FiChevronRight
                          size={14}
                          className="ml-auto text-white/60 shrink-0"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User info + Org switcher + Logout */}
        <div className="border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-3 px-4 py-3">
            <div
              className={`w-9 h-9 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md`}
              style={{ boxShadow: `0 4px 12px ${theme.primary}33` }}
            >
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                {userName}
              </p>
              <p className="text-[11px] text-gray-400 truncate">{userEmail}</p>
            </div>
          </div>

          {/* Mobile org switcher */}
          {otherOrgs.length > 0 && (
            <div className="px-3 pb-1">
              {otherOrgs.map((org) => {
                const OrgLogo = org.logoIcon;
                return (
                  <button
                    key={org.id}
                    onClick={() => {
                      setIsMobileSidebarOpen(false);
                      handleOrgSwitch(org.id);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 bg-gradient-to-br ${org.theme.gradientFrom} ${org.theme.gradientTo} rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <OrgLogo className="text-white" size={14} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-medium text-gray-700 truncate leading-tight">
                        Switch to {org.name}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {org.subtitle}
                      </p>
                    </div>
                    <BsArrowLeftRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}

          <div className="px-3 pb-3">
            <button
              onClick={() => {
                setIsMobileSidebarOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200"
            >
              <AiOutlineLogout size={18} className="shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </MobileDrawer>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div
        className="flex-1 flex flex-col min-w-0"
        style={{
          marginLeft: mainMarginLeft,
          transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shrink-0 h-16">
          <div className="flex items-center h-full px-3 sm:px-4 lg:px-6 gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors shrink-0"
              aria-label="Open menu"
            >
              <AiOutlineMenu size={20} />
            </button>

            {/* Page title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate leading-tight">
                {pageTitle}
              </h1>
              <p className="text-[11px] text-gray-400 truncate hidden sm:block leading-tight mt-0.5">
                {config.tagline}
              </p>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Phase pill */}
              <div
                className={`hidden sm:flex items-center gap-1.5 ${theme.pillBg} ${theme.pillText} px-3 py-1.5 rounded-full text-xs font-semibold`}
              >
                <LogoIcon size={11} />
                <span>Phase 1</span>
              </div>

              {/* Profile */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-1.5 sm:px-2 py-1.5 transition-colors"
                  aria-label="Profile menu"
                >
                  <div
                    className={`w-9 h-9 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}
                    style={{ boxShadow: `0 4px 12px ${theme.primary}33` }}
                  >
                    {userInitials}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                      {userName}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      {userRole}
                    </p>
                  </div>
                  <FiChevronDown
                    className={`hidden lg:block w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <ProfileDropdown open={isProfileDropdownOpen}>
                  {/* User card */}
                  <div
                    className={`p-4 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 backdrop-blur-sm">
                        {userInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">
                          {userName}
                        </p>
                        <p className="text-xs text-white/70 truncate">
                          {userEmail}
                        </p>
                        <span className="inline-block mt-1 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
                          {userRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Org switcher */}
                  {otherOrgs.length > 0 && (
                    <div className="p-1.5 border-b border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 pt-1.5 pb-1">
                        Switch Organization
                      </p>
                      {otherOrgs.map((org) => {
                        const OrgLogo = org.logoIcon;
                        return (
                          <button
                            key={org.id}
                            onClick={() => handleOrgSwitch(org.id)}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <div
                              className={`w-8 h-8 bg-gradient-to-br ${org.theme.gradientFrom} ${org.theme.gradientTo} rounded-lg flex items-center justify-center shrink-0`}
                            >
                              <OrgLogo className="text-white" size={14} />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <p className="font-medium text-gray-700 truncate leading-tight">
                                {org.name}
                              </p>
                              <p className="text-[10px] text-gray-400 truncate">
                                {org.subtitle}
                              </p>
                            </div>
                            <BsArrowLeftRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Quick links */}
                  <div className="p-1.5">
                    {config.quickLinks.map(({ href, icon: QIcon, label }) => (
                      <Link
                        key={href}
                        to={href}
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 ${theme.dropdownHoverBg} ${theme.dropdownHoverText} transition-colors`}
                      >
                        <QIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="p-1.5 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                      <AiOutlineLogout className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </ProfileDropdown>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 lg:p-6 custom-scrollbar">
          {children}
          <p className="mt-8 pb-2 text-center text-gray-600 text-[11px]">
            &copy; {new Date().getFullYear()} JAI Dev. All Rights
            Reserved.
          </p>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
