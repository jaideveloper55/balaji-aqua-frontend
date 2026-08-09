import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import {
  HiOutlineLightningBolt,
  HiOutlineExclamation,
  HiOutlineArrowRight,
  HiOutlineCash,
  HiOutlinePlus,
  HiOutlineFolder,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { CATEGORY_META } from "../constants/Expenses.constants";
import {
  getExpenseStatsApi,
  getExpensesApi,
  getCategoryOverviewApi,
} from "../api/Expenses.api";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const relativeDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  const time = new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

const PAYMENT_LABEL: Record<string, string> = {
  CASH: "CASH",
  UPI: "UPI",
  BANK_TRANSFER: "BANK",
  CARD: "CARD",
  CHEQUE: "CHEQUE",
};

const BAR_COLORS = [
  "bg-rose-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
] as const;

const ICON_BG_COLORS = [
  "bg-rose-100",
  "bg-blue-100",
  "bg-emerald-100",
  "bg-amber-100",
  "bg-violet-100",
  "bg-cyan-100",
  "bg-orange-100",
  "bg-pink-100",
  "bg-teal-100",
  "bg-indigo-100",
] as const;

interface Props {
  onAddExpense?: () => void;
  onViewAllExpenses?: () => void;
  onViewCategories?: () => void;
}

const OverviewPanel = ({
  onAddExpense,
  onViewAllExpenses,
  onViewCategories,
}: Props) => {
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["expense-stats"],
    queryFn: () => getExpenseStatsApi().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  const { data: recentData, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["expenses-recent"],
    queryFn: () =>
      getExpensesApi({ limit: 5, sortBy: "date", sortOrder: "desc" }).then(
        (res) => res.data
      ),
    staleTime: 1000 * 60,
  });

  const { data: overviewData, isLoading: isLoadingOverview } = useQuery({
    queryKey: ["category-overview"],
    queryFn: () => getCategoryOverviewApi().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  const rawCategories: { name: string; amount: number }[] =
    statsData?.byCategory ?? [];
  const totalSpend = rawCategories.reduce((s, c) => s + c.amount, 0);
  const maxAmount = Math.max(...rawCategories.map((c) => c.amount), 1);

  const recentExpenses = recentData?.data ?? [];

  const allCategories: {
    name: string;
    spentThisMonth: number;
    monthlyBudget: number;
    percentUsed: number;
  }[] = overviewData?.categories ?? [];

  const budgetAlerts = allCategories
    .filter((c) => c.monthlyBudget > 0 && c.percentUsed >= 70)
    .sort((a, b) => b.percentUsed - a.percentUsed)
    .slice(0, 10);

  const directExpenses = statsData?.totalThisMonth ?? 0;
  const salaries = 0;
  const totalOperating = directExpenses + salaries;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Spending by Category
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                This month's breakdown
              </p>
            </div>
            <button
              onClick={onViewCategories}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
            >
              View Details <HiOutlineArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-5 space-y-3">
            <Spin spinning={isLoadingStats} tip="Loading...">
              {rawCategories.length === 0 && !isLoadingStats ? (
                <p className="text-sm text-slate-400 text-center py-6">
                  No expenses this month
                </p>
              ) : (
                rawCategories.map((c, index) => {
                  const metaKey = Object.keys(CATEGORY_META).find(
                    (k) =>
                      CATEGORY_META[k].label.toLowerCase() ===
                      c.name.toLowerCase()
                  );
                  const meta = metaKey ? CATEGORY_META[metaKey] : null;

                  const barColor = BAR_COLORS[index % BAR_COLORS.length];
                  const iconBg = ICON_BG_COLORS[index % ICON_BG_COLORS.length];

                  const widthPercent =
                    maxAmount > 0 ? (c.amount / maxAmount) * 100 : 0;
                  const percent =
                    totalSpend > 0
                      ? ((c.amount / totalSpend) * 100).toFixed(1)
                      : "0.0";

                  return (
                    <div
                      key={c.name}
                      className="group pb-4 last:pb-0 border-b border-slate-50 last:border-0"
                    >
                      {/* Top row: icon + name + percent + amount */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0 shadow-sm`}
                          >
                            {meta?.icon ?? (
                              <HiOutlineFolder className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-semibold text-slate-800 truncate block">
                              {meta?.label ?? c.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {percent}% of total
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-slate-900 shrink-0 ml-4">
                          {formatINR(c.amount)}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </Spin>
          </div>
        </div>

        {/* ─── Recent Expenses ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent Expenses
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Last 5 transactions
              </p>
            </div>
            <button
              onClick={onViewAllExpenses}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
            >
              View All <HiOutlineArrowRight className="w-3 h-3" />
            </button>
          </div>

          <Spin spinning={isLoadingRecent}>
            <div className="divide-y divide-slate-100">
              {recentExpenses.length === 0 && !isLoadingRecent ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  No recent expenses
                </p>
              ) : (
                recentExpenses.map((e: any, index: number) => {
                  const metaKey = Object.keys(CATEGORY_META).find(
                    (k) =>
                      CATEGORY_META[k].label.toLowerCase() ===
                      (e.categoryName ?? "").toLowerCase()
                  );
                  const meta = metaKey ? CATEGORY_META[metaKey] : null;

                  // ─── FIXED: palette-based icon background ──────────────────
                  const iconBg = ICON_BG_COLORS[index % ICON_BG_COLORS.length];

                  return (
                    <div
                      key={e.id}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl ${
                          meta ? meta.iconBg : iconBg
                        } border border-slate-100 flex items-center justify-center shrink-0`}
                      >
                        {meta?.icon ?? (
                          <HiOutlineFolder className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 text-sm truncate">
                          {e.vendorName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>
                            {meta?.label ?? e.categoryName ?? "Other"}
                          </span>
                          <span>•</span>
                          <span>{relativeDate(e.date)}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-rose-600">
                          −{formatINR(e.amount)}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">
                          via {PAYMENT_LABEL[e.paymentMode] ?? e.paymentMode}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Spin>
        </div>
      </div>

      {/* ─── Right Column ────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Budget Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[520px]">
          <div className="px-5 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100">
                <HiOutlineExclamation className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Budget Alerts
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Categories nearing limits
            </p>
          </div>

          <div className="p-4 flex-1 overflow-hidden">
            <Spin spinning={isLoadingOverview} className="h-full">
              {budgetAlerts.length === 0 && !isLoadingOverview ? (
                <div className="flex flex-col items-center gap-1.5 py-4">
                  <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400" />
                  <p className="text-xs text-slate-400 text-center">
                    All categories within budget
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                  {budgetAlerts.map((b) => {
                    const metaKey = Object.keys(CATEGORY_META).find(
                      (k) =>
                        CATEGORY_META[k].label.toLowerCase() ===
                        b.name.toLowerCase()
                    );
                    const meta = metaKey ? CATEGORY_META[metaKey] : null;
                    const isCritical = b.percentUsed >= 90;
                    const isWarning = b.percentUsed >= 75 && b.percentUsed < 90;

                    return (
                      <div
                        key={b.name}
                        className={`rounded-xl border p-4 ${
                          isCritical
                            ? "bg-red-50 border-red-200"
                            : isWarning
                            ? "bg-amber-50 border-amber-200"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                isCritical
                                  ? "bg-red-100"
                                  : isWarning
                                  ? "bg-amber-100"
                                  : "bg-slate-100"
                              }`}
                            >
                              {meta?.icon ?? (
                                <HiOutlineFolder className="w-3.5 h-3.5 text-slate-500" />
                              )}
                            </div>
                            <span className="text-xs font-bold text-slate-900">
                              {meta?.label ?? b.name}
                            </span>
                          </div>
                          <span
                            className={`text-sm font-extrabold ${
                              isCritical
                                ? "text-red-600"
                                : isWarning
                                ? "text-amber-600"
                                : "text-slate-600"
                            }`}
                          >
                            {Math.round(b.percentUsed)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white overflow-hidden mb-2.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCritical
                                ? "bg-red-500"
                                : isWarning
                                ? "bg-amber-500"
                                : "bg-slate-400"
                            }`}
                            style={{
                              width: `${Math.min(b.percentUsed, 100)}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-semibold ${
                              isCritical
                                ? "text-red-700"
                                : isWarning
                                ? "text-amber-700"
                                : "text-slate-600"
                            }`}
                          >
                            {formatINR(b.spentThisMonth)} used
                          </span>
                          <span className="text-xs text-slate-400">
                            of {formatINR(b.monthlyBudget)} budget
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Spin>
          </div>
        </div>

        {/* Quick Add */}
        <div className="bg-gradient-to-br from-rose-50 via-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-white shadow-sm">
              <HiOutlineLightningBolt className="w-4 h-4 text-rose-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Quick Add</h3>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Snap a receipt photo and we'll auto-fill the expense details
          </p>
          <button
            onClick={onAddExpense}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
          >
            <HiOutlinePlus size={13} />
            New Expense
          </button>
        </div>

        {/* Total Operating Cost */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-white shadow-sm">
              <HiOutlineCash className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Total Operating Cost
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Direct Expenses</span>
              <span className="font-semibold text-slate-900">
                {formatINR(directExpenses)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-1">
                Salaries
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                  FROM SALARY
                </span>
              </span>
              <span className="font-semibold text-slate-400 italic text-[11px]">
                {salaries > 0 ? formatINR(salaries) : "Pending"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-indigo-200">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-bold text-indigo-700 text-base">
                {formatINR(totalOperating)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;
