import {
  HiOutlineCash,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineCalendar,
  HiOutlineLightningBolt,
} from "react-icons/hi";

interface ExpenseStatCardsProps {
  totalThisMonth?: number;
  trendPercent?: number;
  thisWeekSpend?: number;
  weekTrend?: number;
  topCategory?: { name: string; amount: number } | null;
  pettyCashBalance?: number;
  reconciledTill?: string | null;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const ExpenseStatCards = ({
  totalThisMonth = 0,
  trendPercent = 0,
  thisWeekSpend = 0,
  weekTrend = 0,
  topCategory = null,
  pettyCashBalance = 0,
  reconciledTill = null,
}: ExpenseStatCardsProps) => {
  const monthName = new Date().toLocaleDateString("en-IN", { month: "long" });
  const trendUp = trendPercent > 0;
  const weekUp = weekTrend > 0;

  const reconciledLabel = reconciledTill
    ? (() => {
        const diffDays = Math.floor(
          (new Date().setHours(0, 0, 0, 0) -
            new Date(reconciledTill).setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24)
        );
        if (diffDays === 0) return "Reconciled today";
        if (diffDays === 1) return "Reconciled yesterday";
        return `Last reconciled ${diffDays}d ago`;
      })()
    : "Never reconciled";

  const cards = [
    {
      label: "TOTAL EXPENSES",
      value: formatINR(totalThisMonth),
      icon: <HiOutlineCash className="w-6 h-6" />,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      ring: "ring-rose-100",
      hover: "hover:border-rose-200 hover:shadow-rose-100/50",
      subtitle: `${monthName} ${new Date().getFullYear()}`,
      delta: `${trendUp ? "↑" : "↓"} ${Math.abs(trendPercent).toFixed(
        1
      )}% vs last month`,
      deltaColor: trendUp ? "text-rose-500" : "text-emerald-600",
      showTrend: true,
      trendUp,
    },

    {
      label: "THIS WEEK",
      value: formatINR(thisWeekSpend),
      icon: <HiOutlineCalendar className="w-6 h-6" />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      ring: "ring-amber-100",
      hover: "hover:border-amber-200 hover:shadow-amber-100/50",
      subtitle: "Mon – today",
      delta:
        thisWeekSpend === 0
          ? "No spends yet"
          : `${weekUp ? "↑" : "↓"} ${Math.abs(weekTrend).toFixed(
              1
            )}% vs last week`,
      deltaColor: weekUp ? "text-rose-500" : "text-emerald-600",
      showTrend: false,
    },

    {
      label: "TOP CATEGORY",
      value: topCategory?.name ?? "—",
      icon: <HiOutlineTrendingUp className="w-6 h-6" />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      ring: "ring-purple-100",
      hover: "hover:border-purple-200 hover:shadow-purple-100/50",
      subtitle: "Highest spend",
      delta: topCategory ? formatINR(topCategory.amount) : "—",
      deltaColor: "text-purple-600",
      isText: true,
      showTrend: false,
    },

    {
      label: "CASH ON HAND",
      value: formatINR(pettyCashBalance),
      icon: <HiOutlineLightningBolt className="w-6 h-6" />,
      iconBg: pettyCashBalance > 0 ? "bg-emerald-50" : "bg-slate-50",
      iconColor: pettyCashBalance > 0 ? "text-emerald-600" : "text-slate-400",
      ring: pettyCashBalance > 0 ? "ring-emerald-100" : "ring-slate-100",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100/50",
      subtitle: "Petty cash box",
      delta: reconciledLabel,
      deltaColor: reconciledTill ? "text-emerald-600" : "text-slate-400",
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
