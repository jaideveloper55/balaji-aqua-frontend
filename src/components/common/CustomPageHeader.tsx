import React from "react";

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  iconBg?: string;
  actions?: React.ReactNode;
}

const CustomPageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  subtitle,
  iconBg = "bg-blue-500",
  actions,
}) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      {/* Title */}
      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0 shadow-sm`}
        >
          {icon}
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export default CustomPageHeader;
