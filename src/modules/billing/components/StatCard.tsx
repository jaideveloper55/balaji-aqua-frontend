// modules/billing/components/StatCard.tsx

import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: "green" | "blue" | "orange" | "red" | "purple" | "gray";
}

const colorMap = {
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  orange: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  purple: "bg-purple-50 text-purple-600",
  gray: "bg-gray-50 text-gray-500",
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  sub,
  color = "gray",
}) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3 hover:shadow-sm transition-shadow">
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}
    >
      {icon}
    </div>
    <div>
      <div className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">
        {label}
      </div>
      <div className="text-lg font-bold text-gray-900 mt-0.5">{value}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  </div>
);

export default StatCard;
