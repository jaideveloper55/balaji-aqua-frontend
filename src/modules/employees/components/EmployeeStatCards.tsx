import {
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineUserAdd,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import type { Employee } from "../types/Employees";

interface Props {
  employees: Employee[];
}

const EmployeeStatCards = ({ employees }: Props) => {
  const total = employees.length;
  const active = employees.filter((e) => e.status === "active").length;
  const onLeave = employees.filter((e) => e.status === "on_leave").length;

  // new joiners this month
  const now = new Date();
  const newThisMonth = employees.filter((e) => {
    const d = new Date(e.joinedDate);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const cards = [
    {
      label: "TOTAL EMPLOYEES",
      value: total,
      icon: <HiOutlineUsers className="w-6 h-6" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      ring: "ring-blue-100",
      delta: "+12% vs last month",
      deltaColor: "text-emerald-600",
      hover: "hover:border-blue-200 hover:shadow-blue-100/50",
    },
    {
      label: "ACTIVE TODAY",
      value: active,
      icon: <HiOutlineCheckCircle className="w-6 h-6" />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      ring: "ring-emerald-100",
      delta: `${total ? Math.round((active / total) * 100) : 0}% of workforce`,
      deltaColor: "text-slate-500",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100/50",
    },
    {
      label: "ON LEAVE",
      value: onLeave,
      icon: <HiOutlineClock className="w-6 h-6" />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      ring: "ring-amber-100",
      delta: onLeave > 0 ? "Needs attention" : "All present",
      deltaColor: onLeave > 0 ? "text-amber-600" : "text-emerald-600",
      hover: "hover:border-amber-200 hover:shadow-amber-100/50",
    },
    {
      label: "NEW THIS MONTH",
      value: newThisMonth,
      icon: <HiOutlineUserAdd className="w-6 h-6" />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      ring: "ring-purple-100",
      delta: "Recently onboarded",
      deltaColor: "text-purple-600",
      hover: "hover:border-purple-200 hover:shadow-purple-100/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`group relative bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${c.hover}`}
        >
          <div className="flex items-start justify-between">
            <div
              className={`p-3 rounded-xl ${c.iconBg} ${c.iconColor} ring-1 ${c.ring} group-hover:scale-110 transition-transform`}
            >
              {c.icon}
            </div>
            <HiOutlineTrendingUp className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {c.value}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1 tracking-wider">
              {c.label}
            </div>
            <div className={`text-xs mt-2 font-medium ${c.deltaColor}`}>
              {c.delta}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeStatCards;
