import {
  HiOutlineCash,
  HiOutlineTrendingUp,
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlineTrendingDown,
} from "react-icons/hi";

interface ExpenseStatCardsProps {
  totalThisMonth?: number;
  invoiceCount?: number;
  trendPercent?: number;
  pendingApproval?: number;
  topCategory?: { name: string; amount: number } | null;
  cashPercent?: number;
  digitalPercent?: number;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const ExpenseStatCards = ({
  totalThisMonth = 0,
  trendPercent = 0,
  pendingApproval = 0,
  topCategory = null,
  cashPercent = 0,
  digitalPercent = 0,
}: ExpenseStatCardsProps) => {
  const monthName = new Date().toLocaleDateString("en-IN", { month: "long" });

  const trendUp = trendPercent > 0;

  const cards = [
    {
      label: "TOTAL EXPENSES",
      value: formatINR(totalThisMonth),
      icon: <HiOutlineCash className="w-6 h-6" />,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      ring: "ring-rose-100",
      delta: `${trendUp ? "↑" : "↓"} ${Math.abs(trendPercent).toFixed(
        1
      )}% vs last month`,
      deltaColor: trendUp ? "text-rose-600" : "text-emerald-600",
      hover: "hover:border-rose-200 hover:shadow-rose-100/50",
      subtitle: `${monthName} ${new Date().getFullYear()}`,
      showTrend: true,
    },
    {
      label: "PENDING APPROVAL",
      value: pendingApproval,
      icon: <HiOutlineClock className="w-6 h-6" />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      ring: "ring-amber-100",
      delta: pendingApproval > 0 ? "Needs your action" : "All processed",
      deltaColor: pendingApproval > 0 ? "text-amber-600" : "text-emerald-600",
      hover: "hover:border-amber-200 hover:shadow-amber-100/50",
      subtitle: "Awaiting review",
      showTrend: false,
    },
    {
      label: "TOP CATEGORY",
      value: topCategory?.name ?? "—",
      icon: <HiOutlineTrendingUp className="w-6 h-6" />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      ring: "ring-purple-100",
      delta: topCategory ? formatINR(topCategory.amount) : "—",
      deltaColor: "text-purple-600",
      hover: "hover:border-purple-200 hover:shadow-purple-100/50",
      subtitle: "Highest spend",
      isText: true,
      showTrend: false,
    },
    {
      label: "CASH vs DIGITAL",
      value: `${cashPercent}%`,
      icon: <HiOutlineExclamation className="w-6 h-6" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      ring: "ring-blue-100",
      delta: `${digitalPercent}% digital payments`,
      deltaColor: "text-blue-600",
      hover: "hover:border-blue-200 hover:shadow-blue-100/50",
      subtitle: "Cash payments",
      showTrend: false,
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

            {c.showTrend &&
              (trendUp ? (
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
