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

interface Props {
  onAddExpense?: () => void;
}

const OverviewPanel = ({ onAddExpense }: Props) => {
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
    .slice(0, 3);

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
            <button className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
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
                rawCategories.map((c) => {
                  const metaKey = Object.keys(CATEGORY_META).find(
                    (k) =>
                      CATEGORY_META[k].label.toLowerCase() ===
                      c.name.toLowerCase()
                  );
                  const meta = metaKey
                    ? CATEGORY_META[metaKey]
                    : {
                        label: c.name,
                        icon: <HiOutlineFolder size={16} />,
                        iconBg: "bg-slate-100",
                        bar: "bg-slate-400",
                      };

                  const widthPercent =
                    maxAmount > 0 ? (c.amount / maxAmount) * 100 : 0;
                  const percent =
                    totalSpend > 0
                      ? ((c.amount / totalSpend) * 100).toFixed(1)
                      : "0.0";

                  return (
                    <div key={c.name} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base">{meta.icon}</span>
                          <span className="text-sm font-semibold text-slate-700">
                            {meta.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-slate-500">
                            {percent}%
                          </span>
                          <span className="text-sm font-bold text-slate-900 min-w-[80px] text-right">
                            {formatINR(c.amount)}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 group-hover:opacity-80 ${
                            meta.iconBg
                              ?.replace("-100", "-500")
                              .replace("bg-", "bg-") ?? "bg-slate-400"
                          }`}
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

        {/* Recent Expenses */}
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
            <button className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
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
                recentExpenses.map((e: any) => {
                  const metaKey = Object.keys(CATEGORY_META).find(
                    (k) =>
                      CATEGORY_META[k].label.toLowerCase() ===
                      (e.categoryName ?? "").toLowerCase()
                  );
                  const meta = metaKey
                    ? CATEGORY_META[metaKey]
                    : {
                        label: e.categoryName ?? "Other",
                        icon: <HiOutlineFolder size={16} />,
                        iconBg: "bg-slate-100",
                      };

                  return (
                    <div
                      key={e.id}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl ${meta.iconBg} border flex items-center justify-center shrink-0`}
                      >
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 text-sm truncate">
                          {e.vendorName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>{meta.label}</span>
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

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
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

          <div className="p-4 space-y-3">
            <Spin spinning={isLoadingOverview}>
              {budgetAlerts.length === 0 && !isLoadingOverview ? (
                <div className="flex flex-col items-center gap-1.5 py-4">
                  <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400" />
                  <p className="text-xs text-slate-400 text-center">
                    All categories within budget
                  </p>
                </div>
              ) : (
                budgetAlerts.map((b) => {
                  const metaKey = Object.keys(CATEGORY_META).find(
                    (k) =>
                      CATEGORY_META[k].label.toLowerCase() ===
                      b.name.toLowerCase()
                  );
                  const meta = metaKey
                    ? CATEGORY_META[metaKey]
                    : { label: b.name, icon: <HiOutlineFolder size={14} /> };

                  const isCritical = b.percentUsed >= 90;
                  const isWarning = b.percentUsed >= 75 && b.percentUsed < 90;

                  return (
                    <div
                      key={b.name}
                      className={`rounded-xl border p-3 ${
                        isCritical
                          ? "bg-red-50/50 border-red-200"
                          : isWarning
                          ? "bg-amber-50/50 border-amber-200"
                          : "bg-slate-50/50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span>{meta.icon}</span>
                          <span className="text-xs font-bold text-slate-900">
                            {meta.label}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            isCritical
                              ? "text-red-700"
                              : isWarning
                              ? "text-amber-700"
                              : "text-slate-700"
                          }`}
                        >
                          {Math.round(b.percentUsed)}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full ${
                            isCritical
                              ? "bg-red-500"
                              : isWarning
                              ? "bg-amber-500"
                              : "bg-slate-400"
                          }`}
                          style={{ width: `${Math.min(b.percentUsed, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{formatINR(b.spentThisMonth)} used</span>
                        <span>of {formatINR(b.monthlyBudget)}</span>
                      </div>
                    </div>
                  );
                })
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
