import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { FiChevronRight } from "react-icons/fi";
import type { OrgConfig } from "../../config/orgConfig";
import LogoBlock from "./LogoBlock";
import OrgSwitcher from "./OrgSwitcher";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  config: OrgConfig;
  otherOrgs: OrgConfig[];
  activeMenu: string;
  userName: string;
  userEmail: string;
  userInitials: string;
  onMenuClick: (id: string) => void;
  onLogoClick: () => void;
  onOrgSwitch: (orgId: string) => void;
  onLogout: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  open,
  onClose,
  config,
  otherOrgs,
  activeMenu,
  userName,
  userEmail,
  userInitials,
  onMenuClick,
  onLogoClick,
  onOrgSwitch,
  onLogout,
}) => {
  const { theme, menuItems, groups } = config;

  return (
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
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 shrink-0">
          <LogoBlock config={config} showText onClick={onLogoClick} />
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close menu"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {groups.map((group) => {
            const groupItems = menuItems.filter((m) => m.group === group);
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
                      onClick={() => onMenuClick(item.id)}
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

          <OrgSwitcher
            orgs={otherOrgs}
            onSwitch={onOrgSwitch}
            variant="drawer"
          />

          <div className="px-3 pb-3">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200"
            >
              <AiOutlineLogout size={18} className="shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
