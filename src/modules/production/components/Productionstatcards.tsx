import React from "react";
import { Tooltip } from "antd";
import {
  HiOutlineBeaker,
  HiOutlineCube,
  HiOutlineCurrencyRupee,
  HiOutlineChartBar,
  HiOutlineExclamationCircle,
  HiOutlineClipboardCheck,
  HiOutlineCog,
  HiOutlineCalendar,
  HiOutlineTrendingUp,
  HiOutlineClock,
} from "react-icons/hi";
import { ProductionStats } from "../types/Production";

interface Props {
  stats: ProductionStats;
}

interface CardConfig {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change: { value: number; isUp: boolean };
  gradient: string;
  iconColor: string;
  tooltip?: string;
  sublabel?: string;
}

const StatCard: React.FC<CardConfig> = ({
  icon,
  label,
  value,
  change,
  gradient,
  iconColor,
  tooltip,
  sublabel,
}) => {
  const card = (
    <div className="group relative bg-white rounded-2xl border border-slate-100 p-5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${gradient} opacity-80`}
      />
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-2xl ${gradient} ${iconColor} flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          {icon}
        </div>
        <span
          className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-lg ${
            change.isUp
              ? "text-emerald-700 bg-emerald-50"
              : "text-red-600 bg-red-50"
          }`}
        >
          <HiOutlineTrendingUp
            size={12}
            className={change.isUp ? "" : "rotate-180"}
          />
          {change.value}%
        </span>
      </div>

      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <p className="text-[28px] font-extrabold text-slate-800 leading-none tracking-tight tabular-nums">
        {value}
      </p>
      <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
        <HiOutlineClock size={10} />
        {sublabel || "vs last period"}
      </p>
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

const ProductionStatCards: React.FC<Props> = ({ stats }) => {
  const cards: CardConfig[] = [
    {
      icon: <HiOutlineBeaker size={24} />,
      label: "Today's Production",
      value: `${stats.totalProductionToday.toLocaleString()} L`,
      change: { value: 8.2, isUp: true },
      gradient: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      iconColor: "text-cyan-600",
      tooltip: "Total water produced today across all batches",
      sublabel: "+1,020 L from yesterday",
    },
    {
      icon: <HiOutlineCube size={24} />,
      label: "Units Produced",
      value: stats.totalUnitsToday.toLocaleString(),
      change: { value: 12.4, isUp: true },
      gradient: "bg-gradient-to-br from-violet-50 to-violet-100",
      iconColor: "text-violet-600",
      tooltip: "Total jars, bottles & cans produced today",
      sublabel: "Jars, bottles, cans",
    },
    {
      icon: <HiOutlineCurrencyRupee size={24} />,
      label: "Avg Cost / Litre",
      value: `₹${stats.avgCostPerLitre.toFixed(2)}`,
      change: { value: 2.1, isUp: false },
      gradient: "bg-gradient-to-br from-amber-50 to-amber-100",
      iconColor: "text-amber-600",
      tooltip: "Average production cost per litre today",
      sublabel: "Better than target",
    },
    {
      icon: <HiOutlineChartBar size={24} />,
      label: "Efficiency",
      value: `${stats.efficiencyPct}%`,
      change: { value: 3.4, isUp: stats.efficiencyPct >= 85 },
      gradient:
        stats.efficiencyPct >= 85
          ? "bg-gradient-to-br from-emerald-50 to-emerald-100"
          : "bg-gradient-to-br from-red-50 to-red-100",
      iconColor:
        stats.efficiencyPct >= 85 ? "text-emerald-600" : "text-red-600",
      tooltip: "Output / Input ratio",
      sublabel: "Output vs input ratio",
    },
    {
      icon: <HiOutlineExclamationCircle size={24} />,
      label: "Wastage",
      value: `${stats.wastagePct}%`,
      change: { value: 0.8, isUp: false },
      gradient:
        stats.wastagePct > 5
          ? "bg-gradient-to-br from-red-50 to-red-100"
          : "bg-gradient-to-br from-slate-50 to-slate-100",
      iconColor: stats.wastagePct > 5 ? "text-red-600" : "text-slate-600",
      tooltip: "Wastage percentage today",
      sublabel: "Within acceptable range",
    },
    {
      icon: <HiOutlineClipboardCheck size={24} />,
      label: "Quality Pending",
      value: stats.pendingQualityChecks,
      change: { value: 1, isUp: false },
      gradient: "bg-gradient-to-br from-rose-50 to-rose-100",
      iconColor: "text-rose-600",
      tooltip: "Batches awaiting QC approval",
      sublabel: "Awaiting QC approval",
    },
    {
      icon: <HiOutlineCog size={24} />,
      label: "Active Batches",
      value: stats.activeBatches,
      change: { value: 0, isUp: true },
      gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      iconColor: "text-emerald-600",
      tooltip: "Currently running production batches",
      sublabel: "Running right now",
    },
    {
      icon: <HiOutlineCalendar size={24} />,
      label: "Monthly Production",
      value: `${(stats.monthlyProduction / 1000).toFixed(1)}k L`,
      change: { value: 6.6, isUp: true },
      gradient: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      iconColor: "text-indigo-600",
      tooltip: "Total production this month",
      sublabel: "On track for target",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default ProductionStatCards;
