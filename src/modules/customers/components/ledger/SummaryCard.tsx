import React from "react";
import { Tooltip } from "antd";

type IconComponent = React.ComponentType<{ className?: string }>;

interface SummaryCardProps {
  icon: IconComponent;
  iconColor: string;
  value: string | number;
  label: string;
  sublabel?: string;
  tooltip?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon: Icon,
  iconColor,
  value,
  label,
  sublabel,
  tooltip,
}) => {
  const accentBg = iconColor.replace("text-", "bg-");

  const card = (
    <div className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default min-h-[100px]">
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] ${accentBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div className="flex flex-col items-center justify-center py-4 px-3">
        <Icon
          className={`${iconColor} text-xl mb-2 group-hover:scale-110 transition-transform duration-300`}
        />
        <span className="text-lg font-extrabold text-slate-800 tabular-nums font-mono leading-tight">
          {value}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1.5">
          {label}
        </span>
        {sublabel && (
          <span className="text-[9px] text-slate-300 mt-0.5">{sublabel}</span>
        )}
      </div>
    </div>
  );

  return tooltip ? (
    <Tooltip title={tooltip} placement="bottom">
      {card}
    </Tooltip>
  ) : (
    card
  );
};

export default SummaryCard;
