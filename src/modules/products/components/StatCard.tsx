import React from "react";
import { Tooltip } from "antd";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bg: string;
  tooltip?: string;
  alert?: boolean;
  suffix?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color,
  bg,
  tooltip,
  alert = false,
  suffix,
  onClick,
}) => {
  const card = (
    <div
      className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        onClick ? "cursor-pointer" : "cursor-default"
      } ${
        alert
          ? "border-red-200/60 hover:shadow-red-100/50"
          : "border-slate-100 hover:shadow-slate-200/50"
      }`}
      onClick={onClick}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-center gap-4 px-5 py-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
          style={{ background: bg, color }}
        >
          {icon}
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <p className="text-[26px] font-extrabold text-slate-800 tabular-nums leading-none tracking-tight">
              {typeof value === "number"
                ? value.toLocaleString("en-IN")
                : value}
            </p>
            {suffix && (
              <span className="text-[11px] font-semibold text-slate-400">
                {suffix}
              </span>
            )}
          </div>
          <p className="text-[11px] font-semibold text-slate-400 mt-1.5 uppercase tracking-wider">
            {label}
          </p>
        </div>
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

export default StatCard;
