import React from "react";
import { Tooltip } from "antd";
import { HiOutlineChevronRight } from "react-icons/hi";
import type { JarAlert } from "../../types/JarTracking";
import { SEVERITY_CONFIG } from "../../constants/alertConstants";

interface AlertItemProps {
  alert: JarAlert;
  onClick?: (alert: JarAlert) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onClick }) => {
  const config = SEVERITY_CONFIG[alert.severity];

  return (
    <Tooltip
      title="Click to view details"
      placement="left"
      mouseEnterDelay={0.5}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick?.(alert)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick?.(alert);
        }}
        className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group ${config.bg} ${config.border} ${config.hoverShadow}`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            config.iconColor
          } ${config.iconBg} ${config.pulse ? "animate-pulse" : ""}`}
        >
          {config.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-[2px] rounded-md ${config.badge}`}
            >
              {config.badgeText}
            </span>
            <span className="text-[12px] font-bold text-slate-700 truncate">
              {alert.title}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate leading-relaxed">
            {alert.description}
          </p>
        </div>

        <HiOutlineChevronRight
          size={15}
          className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
        />
      </div>
    </Tooltip>
  );
};

export default AlertItem;
