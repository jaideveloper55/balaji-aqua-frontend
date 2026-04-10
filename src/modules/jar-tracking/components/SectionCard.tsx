import React, { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";

interface SectionCardProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  count?: number;
}

const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  subtitle,
  action,
  children,
  className = "",
  noPadding = false,
  collapsible = false,
  defaultExpanded = true,
  count,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/60 transition-shadow duration-300 hover:shadow-md hover:shadow-slate-100/80 ${className}`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-5 py-4 ${
          collapsible ? "cursor-pointer select-none" : ""
        }`}
        onClick={collapsible ? () => setExpanded(!expanded) : undefined}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-100/80 flex items-center justify-center shadow-sm shadow-slate-100/50">
              {icon}
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[13.5px] font-bold text-slate-800 leading-tight">
                  {title}
                </h3>
                {count !== undefined && (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums">
                    {count}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {action && <div className="flex items-center gap-2">{action}</div>}
          {collapsible && (
            <div
              className={`w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center transition-transform duration-300 ${
                expanded ? "rotate-0" : "-rotate-90"
              }`}
            >
              <HiOutlineChevronDown size={14} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      {expanded && (
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent mx-3" />
      )}

      {/* Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={noPadding ? "" : "p-5"}>{children}</div>
      </div>
    </div>
  );
};

export default SectionCard;