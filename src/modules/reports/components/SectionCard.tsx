import React from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Section card — same look & feel as the SectionCard inside Dashboard.tsx
 * Lives here so reports can be dropped in standalone.
 */
const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  icon,
  iconBg,
  iconColor,
  action,
  children,
  className = "",
}) => (
  <div
    className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${className}`}
  >
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          <span className={iconColor}>{icon}</span>
        </div>
        <div>
          <h3 className="text-[13px] font-bold text-slate-800 leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export default SectionCard;
