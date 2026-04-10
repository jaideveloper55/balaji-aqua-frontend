import React from "react";
import { Tooltip } from "antd";
import {
  HiOutlineCurrencyRupee,
  HiOutlineExclamation,
  HiOutlineXCircle,
  HiOutlineShieldExclamation,
  HiArrowSmDown,
  HiArrowSmUp,
} from "react-icons/hi";
import { HiOutlineArrowDownTray, HiOutlineArrowUpTray } from "react-icons/hi2";
import type { InventoryOverviewData } from "../types/Inventory";

interface OverviewCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
  accentColor: string;
  prefix?: string;
  suffix?: string;
  change?: { value: number; isUp: boolean; label?: string };
  tooltip?: string;
  alert?: boolean;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  icon,
  label,
  value,
  iconBg,
  accentColor,
  prefix,
  suffix,
  change,
  tooltip,
  alert = false,
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
              className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-lg transition-all duration-300 ${
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
            {prefix && (
              <span className="text-[18px] font-bold text-slate-400 mr-0.5">
                {prefix}
              </span>
            )}
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
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
            {change.label || "vs yesterday"}
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

interface InventoryOverviewProps {
  data: InventoryOverviewData;
}

const InventoryOverview: React.FC<InventoryOverviewProps> = ({ data }) => {
  const cards: OverviewCardProps[] = [
    {
      icon: <HiOutlineCurrencyRupee size={22} className="text-blue-600" />,
      label: "Total Stock Value",
      value: data.totalStockValue,
      iconBg: "bg-blue-50",
      accentColor: "bg-blue-500",
      prefix: "₹",
      change: { value: 4.2, isUp: true, label: "vs last week" },
      tooltip: "Total value of all inventory currently in stock",
    },
    {
      icon: <HiOutlineExclamation size={22} className="text-amber-600" />,
      label: "Low Stock Items",
      value: data.lowStockItems,
      iconBg: "bg-amber-50",
      accentColor: "bg-amber-500",
      suffix: "items",
      tooltip: "Products below their reorder level",
      alert: data.lowStockItems > 0,
    },
    {
      icon: <HiOutlineXCircle size={22} className="text-red-500" />,
      label: "Out of Stock",
      value: data.outOfStock,
      iconBg: "bg-red-50",
      accentColor: "bg-red-500",
      suffix: "items",
      tooltip: "Products with zero available stock",
      alert: data.outOfStock > 0,
    },
    {
      icon: (
        <HiOutlineShieldExclamation size={22} className="text-orange-500" />
      ),
      label: "Damaged Items",
      value: data.damagedItems,
      iconBg: "bg-orange-50",
      accentColor: "bg-orange-500",
      change: { value: 8, isUp: true },
      tooltip: "Items marked as damaged or defective",
    },
    {
      icon: <HiOutlineArrowDownTray size={22} className="text-emerald-600" />,
      label: "Inward Today",
      value: data.inwardToday,
      iconBg: "bg-emerald-50",
      accentColor: "bg-emerald-500",
      suffix: "units",
      change: { value: 12, isUp: true },
      tooltip: "Stock received today from purchases, production & returns",
    },
    {
      icon: <HiOutlineArrowUpTray size={22} className="text-violet-600" />,
      label: "Outward Today",
      value: data.outwardToday,
      iconBg: "bg-violet-50",
      accentColor: "bg-violet-500",
      suffix: "units",
      change: { value: 5, isUp: false },
      tooltip: "Stock dispatched today for deliveries & internal use",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <OverviewCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default InventoryOverview;
