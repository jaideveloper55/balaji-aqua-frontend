import React from "react";

type IconComponent = React.ComponentType<{ className?: string }>;

interface InfoCardProps {
  icon: IconComponent;
  label: string;
  value: string;
  mono?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  value,
  mono = false,
}) => (
  <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-200">
    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
      <Icon className="text-slate-400 text-sm" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
        {label}
      </p>
      <p
        className={`text-[12px] text-slate-700 font-semibold truncate mt-0.5 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default InfoCard;
