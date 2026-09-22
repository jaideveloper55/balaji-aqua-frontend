import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { FiChevronRight } from "react-icons/fi";
import type { OrgConfig, OrgTheme } from "../../config/orgConfig";
import { useAuthStore } from "../../store/auth.store";

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

interface SidebarNavProps {
  expanded: boolean;
  activeMenu: string;
  onItemClick: (id: string) => void;
  config: OrgConfig;
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  expanded,
  activeMenu,
  onItemClick,
  config,
}) => {
  const { theme, menuItems, groups } = config;

  // Two independent gates, checked once here rather than inside the render
  // loop below:
  //  - `roles`: a hard, permanent gate (e.g. User Access Management is
  //    always Super-Admin-only, regardless of any saved toggle)
  //  - `menuKey`: the dynamic gate a Super Admin controls from the
  //    "Change User Role" toggle panel — saved server-side per role, sent
  //    down as `enabledMenuKeys` on login()/me()
  // An item with neither field set is always shown to any authenticated
  // user (currently none of your items are like this, but the logic
  // supports it for future additions).
  const currentRole = useAuthStore((s) => s.user?.role);
  const enabledMenuKeys = useAuthStore((s) => s.enabledMenuKeys);

  const visibleMenuItems = menuItems.filter((item) => {
    if (item.roles && (!currentRole || !item.roles.includes(currentRole))) {
      return false;
    }

    if (currentRole === "SUPER_ADMIN") return true;
    if (item.menuKey && !enabledMenuKeys.includes(item.menuKey)) {
      return false;
    }
    return true;
  });

  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
      {groups.map((group) => {
        const groupItems = visibleMenuItems.filter((m) => m.group === group);
        if (groupItems.length === 0) return null;

        return (
          <div key={group} className="mb-0.5">
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
                  to={item.href}
                  onClick={() => onItemClick(item.id)}
                  className={navItemClasses(isActive, expanded, theme)}
                >
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
                <Tooltip key={item.id} title={item.label} placement="right">
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

export default SidebarNav;
