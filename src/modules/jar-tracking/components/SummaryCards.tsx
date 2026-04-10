import React from "react";
import { Tooltip } from "antd";
import {
  HiOutlineCube,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineExclamationCircle,
  HiOutlineShieldExclamation,
  HiArrowSmUp,
  HiArrowSmDown,
} from "react-icons/hi";
import type { JarSummary } from "../types/JarTracking";

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconBg: string;
  accentColor: string;
  suffix?: string;
  tooltip?: string;
  alert?: boolean;
  change?: { value: number; isUp: boolean; label?: string };
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  label,
  value,
  iconBg,
  accentColor,
  suffix,
  tooltip,
  alert = false,
  change,
}) => {
  const card = (
    <div
      className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default ${
        alert
          ? "border-red-200/60 hover:shadow-red-100/50"
          : "border-slate-100 hover:shadow-slate-200/50"
      }`}
    >
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2.5px] ${accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="p-5">
        {/* Icon + Change badge row */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-sm`}
          >
            {icon}
          </div>
          {change && (
            <span
              className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-lg ${
                change.isUp
                  ? "text-emerald-700 bg-emerald-50/80"
                  : "text-red-600 bg-red-50/80"
              }`}
            >
              {change.isUp ? (
                <HiArrowSmUp size={13} />
              ) : (
                <HiArrowSmDown size={13} />
              )}
              {change.value}%
            </span>
          )}
        </div>

        {/* Label */}
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
          {label}
        </p>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <p className="text-[28px] font-extrabold text-slate-800 leading-none tracking-tight">
            {value.toLocaleString("en-IN")}
          </p>
          {suffix && (
            <span className="text-[12px] font-semibold text-slate-400">
              {suffix}
            </span>
          )}
        </div>

        {/* Change label */}
        {change && (
          <p className="text-[10px] text-slate-400 mt-1.5">
            {change.label || "vs last week"}
          </p>
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

interface SummaryCardsProps {
  data: JarSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const cards: SummaryCardProps[] = [
    {
      icon: <HiOutlineCube size={22} className="text-blue-600" />,
      label: "Total Cans",
      value: data.totalCans,
      iconBg: "bg-blue-50",
      accentColor: "bg-blue-500",
      suffix: "cans",
      tooltip: "Total cans in circulation across all locations",
      change: { value: 2.4, isUp: true },
    },
    {
      icon: <HiOutlineUserGroup size={22} className="text-amber-600" />,
      label: "With Customers",
      value: data.withCustomers,
      iconBg: "bg-amber-50",
      accentColor: "bg-amber-500",
      suffix: "cans",
      tooltip: "Cans currently held by customers awaiting return",
      change: { value: 5.1, isUp: true },
      alert: data.withCustomers > data.inPlant,
    },
    {
      icon: <HiOutlineOfficeBuilding size={22} className="text-emerald-600" />,
      label: "In Plant",
      value: data.inPlant,
      iconBg: "bg-emerald-50",
      accentColor: "bg-emerald-500",
      suffix: "cans",
      tooltip: "Cans available at the plant for refilling & dispatch",
      change: { value: 3.2, isUp: false },
    },
    {
      icon: <HiOutlineExclamationCircle size={22} className="text-red-500" />,
      label: "Damaged",
      value: data.damaged,
      iconBg: "bg-red-50",
      accentColor: "bg-red-500",
      tooltip: "Cans marked as damaged — needs replacement",
      change: { value: 1.8, isUp: true },
      alert: data.damaged > 0,
    },
    {
      icon: <HiOutlineShieldExclamation size={22} className="text-slate-500" />,
      label: "Lost / Missing",
      value: data.lost,
      iconBg: "bg-slate-100",
      accentColor: "bg-slate-400",
      tooltip: "Cans unaccounted for — potential revenue leakage",
      alert: data.lost > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default SummaryCards;
