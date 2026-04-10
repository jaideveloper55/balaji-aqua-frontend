import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import type { OrgConfig } from "../../config/orgConfig";
import OrgSwitcher from "./OrgSwitcher";

interface ProfileMenuProps {
  open: boolean;
  config: OrgConfig;
  otherOrgs: OrgConfig[];
  userName: string;
  userEmail: string;
  userInitials: string;
  userRole: string;
  onOrgSwitch: (orgId: string) => void;
  onLogout: () => void;
  onCloseMenu: () => void;
}

const ProfileMenu = React.forwardRef<HTMLDivElement, ProfileMenuProps>(
  (
    {
      open,
      config,
      otherOrgs,
      userName,
      userEmail,
      userInitials,
      userRole,
      onOrgSwitch,
      onLogout,
      onCloseMenu,
    },
    ref
  ) => {
    const { theme } = config;

    return (
      <div
        ref={ref}
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
        {/* User card */}
        <div
          className={`p-4 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 backdrop-blur-sm">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{userName}</p>
              <p className="text-xs text-white/70 truncate">{userEmail}</p>
              <span className="inline-block mt-1 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
                {userRole}
              </span>
            </div>
          </div>
        </div>

        {/* Org switcher */}
        <OrgSwitcher
          orgs={otherOrgs}
          onSwitch={onOrgSwitch}
          variant="dropdown"
        />

        {/* Quick links */}
        <div className="p-1.5">
          {config.quickLinks.map(({ href, icon: QIcon, label }) => (
            <Link
              key={href}
              to={href}
              onClick={onCloseMenu}
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
              onCloseMenu();
              onLogout();
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
          >
            <AiOutlineLogout className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }
);

ProfileMenu.displayName = "ProfileMenu";

export default ProfileMenu;
