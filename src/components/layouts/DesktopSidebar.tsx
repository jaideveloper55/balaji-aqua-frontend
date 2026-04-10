import React from "react";
import { Tooltip } from "antd";
import { AiOutlineLogout } from "react-icons/ai";
import type { OrgConfig } from "../../config/orgConfig";
import SidebarNav from "./SidebarNav";
import LogoBlock from "./LogoBlock";

interface DesktopSidebarProps {
  config: OrgConfig;
  expanded: boolean;
  activeMenu: string;
  width: number;
  onExpand: () => void;
  onCollapse: () => void;
  onMenuClick: (id: string) => void;
  onLogoClick: () => void;
  onLogout: () => void;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  config,
  expanded,
  activeMenu,
  width,
  onExpand,
  onCollapse,
  onMenuClick,
  onLogoClick,
  onLogout,
}) => (
  <aside
    className="hidden lg:flex flex-col bg-white border-r border-gray-100 z-30 fixed top-0 left-0 h-full"
    style={{
      width,
      transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
    }}
    onMouseEnter={onExpand}
    onMouseLeave={onCollapse}
  >
    <div className="flex items-center gap-3 px-4 border-b border-gray-100 shrink-0 h-16">
      <LogoBlock config={config} showText={expanded} onClick={onLogoClick} />
    </div>

    <SidebarNav
      expanded={expanded}
      activeMenu={activeMenu}
      onItemClick={onMenuClick}
      config={config}
    />

    <div className="p-3 border-t border-gray-100 shrink-0">
      {expanded ? (
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200"
        >
          <AiOutlineLogout size={18} className="shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      ) : (
        <Tooltip title="Logout" placement="right">
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-full py-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
          >
            <AiOutlineLogout size={18} />
          </button>
        </Tooltip>
      )}
    </div>
  </aside>
);

export default DesktopSidebar;
