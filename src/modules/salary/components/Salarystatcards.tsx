// src/modules/salary/components/SalaryStatCards.tsx

import {
  HiOutlineCash,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlineTrendingUp,
} from "react-icons/hi";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const SalaryStatCards = () => {
  // Mock data
  const totalPayroll = 285000;
  const lastMonthPayroll = 268000;
  const employeesCount = 24;
  const pendingPayments = 3;
  const onHold = 1;
  const monthName = new Date().toLocaleDateString("en-IN", { month: "long" });

  const trend = ((totalPayroll - lastMonthPayroll) / lastMonthPayroll) * 100;

  const cards = [
    {
      label: "TOTAL PAYROLL",
      value: formatINR(totalPayroll),
      icon: <HiOutlineCash className="w-6 h-6" />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      ring: "ring-emerald-100",
      delta: `${trend > 0 ? "+" : ""}${trend.toFixed(1)}% vs last month`,
      deltaColor: trend > 0 ? "text-amber-600" : "text-emerald-600",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100/50",
      subtitle: `${monthName} 2026`,
    },
    {
      label: "EMPLOYEES",
      value: employeesCount,
      icon: <HiOutlineUsers className="w-6 h-6" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      ring: "ring-blue-100",
      delta: "All active",
      deltaColor: "text-blue-600",
      hover: "hover:border-blue-200 hover:shadow-blue-100/50",
      subtitle: "On payroll",
    },
    {
      label: "PENDING PAYMENT",
      value: pendingPayments,
      icon: <HiOutlineClock className="w-6 h-6" />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      ring: "ring-amber-100",
      delta: pendingPayments > 0 ? "Action required" : "All clear",
      deltaColor: pendingPayments > 0 ? "text-amber-600" : "text-emerald-600",
      hover: "hover:border-amber-200 hover:shadow-amber-100/50",
      subtitle: "Approval needed",
    },
    {
      label: "ON HOLD",
      value: onHold,
      icon: <HiOutlineExclamation className="w-6 h-6" />,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      ring: "ring-red-100",
      delta: onHold > 0 ? "Review needed" : "Nothing on hold",
      deltaColor: onHold > 0 ? "text-red-600" : "text-emerald-600",
      hover: "hover:border-red-200 hover:shadow-red-100/50",
      subtitle: "Disputed entries",
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
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {c.value}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1 tracking-wider">
              {c.label}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-slate-400">{c.subtitle}</span>
              <span className={`text-xs font-medium ${c.deltaColor}`}>
                {c.delta}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalaryStatCards;
