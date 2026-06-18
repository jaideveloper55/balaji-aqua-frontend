import { ReactNode } from "react";

interface SectionCardProps {
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

const SectionCard = ({
  icon,
  iconBg = "#eff6ff",
  iconColor = "#2563eb",
  title,
  subtitle,
  actions,
  children,
  className = "",
}: SectionCardProps) => (
  <section
    className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
  >
    <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-slate-800 leading-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
    <div className="p-5">{children}</div>
  </section>
);

export default SectionCard;
