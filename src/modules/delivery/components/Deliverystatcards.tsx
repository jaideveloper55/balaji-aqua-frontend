import React from "react";
import { Tooltip } from "antd";
import {
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { FiPackage, FiTrendingUp } from "react-icons/fi";
import { RiRouteLine } from "react-icons/ri";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  trend?: string;
  iconBg: string;
  iconColor: string;
  accent?: string;
  tooltip?: string;
  alert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  trend,
  iconBg,
  iconColor,
  accent,
  tooltip,
  alert = false,
}) => {
  const card = (
    <div
      className={`bg-white rounded-2xl border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-default ${
        alert
          ? "border-red-200/60 hover:shadow-red-100/50"
          : "border-slate-100 hover:shadow-slate-200/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
            {label}
          </span>
          <span
            className={`text-[24px] font-extrabold mt-2 leading-none tracking-tight ${
              accent || "text-slate-800"
            }`}
          >
            {value}
          </span>
          {trend && (
            <span className="text-[10px] text-emerald-500 font-medium mt-1.5 flex items-center gap-0.5">
              <FiTrendingUp className="w-3 h-3" />
              {trend}
            </span>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} shrink-0 group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
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

interface DeliveryStatCardsProps {
  stats: any;
}

const DeliveryStatCards: React.FC<DeliveryStatCardsProps> = ({ stats }) => {
  const cards: StatCardProps[] = [
    {
      icon: <FiPackage className="w-[19px] h-[19px]" />,
      label: "Total Today",
      value: stats.total,
      trend: "+12% vs yesterday",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      tooltip: "Total deliveries scheduled for today",
    },
    {
      icon: <HiOutlineCheckCircle className="w-[19px] h-[19px]" />,
      label: "Completed",
      value: stats.completed,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "text-emerald-700",
      tooltip: "Successfully delivered today",
    },
    {
      icon: <HiOutlineClock className="w-[19px] h-[19px]" />,
      label: "Pending",
      value: stats.pending,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      accent: "text-amber-700",
      tooltip: "Awaiting dispatch or in queue",
      alert: stats.pending > 5,
    },
    {
      icon: <HiOutlineExclamationCircle className="w-[19px] h-[19px]" />,
      label: "Failed",
      value: stats.failed,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      accent: "text-red-600",
      tooltip: "Failed deliveries needing attention",
      alert: stats.failed > 0,
    },
    {
      icon: <HiOutlineTruck className="w-[19px] h-[19px]" />,
      label: "In Progress",
      value: stats.inProgress,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "text-blue-700",
      tooltip: "Currently out for delivery",
    },
    {
      icon: <RiRouteLine className="w-[19px] h-[19px]" />,
      label: "Active Routes",
      value: stats.totalRoutes,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      tooltip: "Routes with active deliveries today",
    },
    {
      icon: <HiOutlineUserGroup className="w-[19px] h-[19px]" />,
      label: "Active Drivers",
      value: stats.activeDrivers,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      tooltip: "Drivers currently on duty",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default DeliveryStatCards;
