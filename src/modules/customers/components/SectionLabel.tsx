import React from "react";

interface SectionLabelProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle?: string;
}

const SectionLabel: React.FC<SectionLabelProps> = ({
  icon: Icon,
  title,
  subtitle,
}) => (
  <div className="flex items-center gap-2.5 mb-3">
    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
      <Icon size={14} className="text-blue-500" />
    </div>
    <div>
      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
        {title}
      </span>
      {subtitle && (
        <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);

export default SectionLabel;
