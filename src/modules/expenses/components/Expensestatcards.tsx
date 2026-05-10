// src/modules/expenses/components/ExpenseStatCards.tsx

import {
  HiOutlineCash,
  HiOutlineTrendingUp,
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlineTrendingDown,
} from "react-icons/hi";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const ExpenseStatCards = () => {
  // Mock data
  const totalThisMonth = 84500;
  const lastMonth = 78200;
  const trend = ((totalThisMonth - lastMonth) / lastMonth) * 100;
  const pendingApprovals = 5;
  const topCategory = { name: "Utilities", amount: 22500 };
  const cashVsDigital = 35; // percent cash

  const monthName = new Date().toLocaleDateString("en-IN", { month: "long" });

  const cards = [
    {
      label: "TOTAL EXPENSES",
      value: formatINR(totalThisMonth),
      icon: <HiOutlineCash className="w-6 h-6" />,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      ring: "ring-rose-100",
      delta: `${trend > 0 ? "↑" : "↓"} ${Math.abs(trend).toFixed(
        1
      )}% vs last month`,
      deltaColor: trend > 0 ? "text-rose-600" : "text-emerald-600",
      hover: "hover:border-rose-200 hover:shadow-rose-100/50",
      subtitle: `${monthName} 2026`,
    },
    {
      label: "PENDING APPROVAL",
      value: pendingApprovals,
      icon: <HiOutlineClock className="w-6 h-6" />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      ring: "ring-amber-100",
      delta: pendingApprovals > 0 ? "Needs your action" : "All processed",
      deltaColor: pendingApprovals > 0 ? "text-amber-600" : "text-emerald-600",
      hover: "hover:border-amber-200 hover:shadow-amber-100/50",
      subtitle: "Awaiting review",
    },
    {
      label: "TOP CATEGORY",
      value: topCategory.name,
      icon: <HiOutlineTrendingUp className="w-6 h-6" />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      ring: "ring-purple-100",
      delta: formatINR(topCategory.amount),
      deltaColor: "text-purple-600",
      hover: "hover:border-purple-200 hover:shadow-purple-100/50",
      subtitle: "Highest spend",
      isText: true,
    },
    {
      label: "CASH vs DIGITAL",
      value: `${cashVsDigital}%`,
      icon: <HiOutlineExclamation className="w-6 h-6" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      ring: "ring-blue-100",
      delta: `${100 - cashVsDigital}% digital payments`,
      deltaColor: "text-blue-600",
      hover: "hover:border-blue-200 hover:shadow-blue-100/50",
      subtitle: "Cash payments",
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
            {c.label === "TOTAL EXPENSES" &&
              (trend > 0 ? (
                <HiOutlineTrendingUp className="w-4 h-4 text-rose-400" />
              ) : (
                <HiOutlineTrendingDown className="w-4 h-4 text-emerald-400" />
              ))}
          </div>
          <div className="mt-4">
            <div
              className={`font-bold text-slate-900 tracking-tight ${
                c.isText ? "text-xl" : "text-2xl"
              }`}
            >
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

export default ExpenseStatCards;
