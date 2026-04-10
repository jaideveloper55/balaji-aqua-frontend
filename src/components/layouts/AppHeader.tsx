import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import type { OrgConfig } from "../../config/orgConfig";
import ProfileMenu from "./ProfileMenu";

interface AppHeaderProps {
  config: OrgConfig;
  otherOrgs: OrgConfig[];
  pageTitle: string;
  userName: string;
  userEmail: string;
  userInitials: string;
  userRole: string;
  isProfileOpen: boolean;
  profileMenuRef: React.RefObject<HTMLDivElement | null>;
  onToggleProfile: () => void;
  onCloseProfile: () => void;
  onOrgSwitch: (orgId: string) => void;
  onLogout: () => void;
  onOpenMobileSidebar: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  config,
  otherOrgs,
  pageTitle,
  userName,
  userEmail,
  userInitials,
  userRole,
  isProfileOpen,
  profileMenuRef,
  onToggleProfile,
  onCloseProfile,
  onOrgSwitch,
  onLogout,
  onOpenMobileSidebar,
}) => {
  const { theme } = config;
  const LogoIcon = config.logoIcon;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shrink-0 h-16">
      <div className="flex items-center h-full px-3 sm:px-4 lg:px-6 gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors shrink-0"
          aria-label="Open menu"
        >
          <AiOutlineMenu size={20} />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate leading-tight">
            {pageTitle}
          </h1>
          <p className="text-[11px] text-gray-400 truncate hidden sm:block leading-tight mt-0.5">
            {config.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`hidden sm:flex items-center gap-1.5 ${theme.pillBg} ${theme.pillText} px-3 py-1.5 rounded-full text-xs font-semibold`}
          >
            <LogoIcon size={11} />
            <span>Phase 1</span>
          </div>

          <div className="relative">
            <button
              onClick={onToggleProfile}
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
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <ProfileMenu
              ref={profileMenuRef}
              open={isProfileOpen}
              config={config}
              otherOrgs={otherOrgs}
              userName={userName}
              userEmail={userEmail}
              userInitials={userInitials}
              userRole={userRole}
              onOrgSwitch={onOrgSwitch}
              onLogout={onLogout}
              onCloseMenu={onCloseProfile}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
