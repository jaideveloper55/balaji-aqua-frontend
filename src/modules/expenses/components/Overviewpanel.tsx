import {
  HiOutlineLightningBolt,
  HiOutlineExclamation,
  HiOutlineArrowRight,
  HiOutlineCash,
} from "react-icons/hi";
import { CATEGORY_META } from "../constants/Expenses.constants";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

interface CategorySpend {
  category: string;
  amount: number;
  percent: number;
  trend: number;
}

const SAMPLE_BREAKDOWN: CategorySpend[] = [
  { category: "utilities", amount: 22500, percent: 26.6, trend: 8 },
  { category: "vehicle", amount: 18000, percent: 21.3, trend: -3 },
  { category: "plant_ops", amount: 14200, percent: 16.8, trend: 12 },
  { category: "rent", amount: 12000, percent: 14.2, trend: 0 },
  { category: "packaging", amount: 7800, percent: 9.2, trend: 5 },
  { category: "repairs", amount: 4500, percent: 5.3, trend: -10 },
  { category: "office", amount: 3200, percent: 3.8, trend: 2 },
  { category: "compliance", amount: 2300, percent: 2.7, trend: 0 },
];

interface RecentExpense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: number;
  paymentMode: string;
}

const RECENT_EXPENSES: RecentExpense[] = [
  {
    id: "EXP-042",
    date: "Today, 2:30 PM",
    vendor: "TN Electricity Board",
    category: "utilities",
    amount: 18500,
    paymentMode: "bank",
  },
  {
    id: "EXP-041",
    date: "Today, 11:15 AM",
    vendor: "Indian Oil Pump",
    category: "vehicle",
    amount: 3200,
    paymentMode: "upi",
  },
  {
    id: "EXP-040",
    date: "Yesterday",
    vendor: "Murugan Salt Suppliers",
    category: "plant_ops",
    amount: 4500,
    paymentMode: "cash",
  },
  {
    id: "EXP-039",
    date: "Yesterday",
    vendor: "Saravanan Caps & Seals",
    category: "packaging",
    amount: 2800,
    paymentMode: "upi",
  },
  {
    id: "EXP-038",
    date: "2 days ago",
    vendor: "Plant Maintenance — Kumar",
    category: "repairs",
    amount: 1500,
    paymentMode: "cash",
  },
];

interface BudgetAlert {
  category: string;
  used: number;
  budget: number;
  percent: number;
}

const BUDGET_ALERTS: BudgetAlert[] = [
  { category: "utilities", used: 22500, budget: 25000, percent: 90 },
  { category: "plant_ops", used: 14200, budget: 15000, percent: 95 },
  { category: "vehicle", used: 18000, budget: 25000, percent: 72 },
];

const OverviewPanel = () => {
  // Find max for proportional bar widths
  const maxAmount = Math.max(...SAMPLE_BREAKDOWN.map((c) => c.amount));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* ============ Left: Category Breakdown (2/3 width) ============ */}
      <div className="lg:col-span-2 space-y-4">
        {/* Category breakdown bar chart */}
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
            {SAMPLE_BREAKDOWN.map((c) => {
              const meta = CATEGORY_META[c.category];
              const widthPercent = (c.amount / maxAmount) * 100;
              return (
                <div key={c.category} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">{meta.icon}</span>
                      <span className="text-sm font-semibold text-slate-700">
                        {meta.label}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          c.trend > 0
                            ? "bg-rose-50 text-rose-700"
                            : c.trend < 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-50 text-slate-500"
                        }`}
                      >
                        {c.trend > 0 ? "↑" : c.trend < 0 ? "↓" : "—"}{" "}
                        {Math.abs(c.trend)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-500">
                        {c.percent.toFixed(1)}%
                      </span>
                      <span className="text-sm font-bold text-slate-900 min-w-[80px] text-right">
                        {formatINR(c.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 group-hover:opacity-80 ${meta.iconBg
                        .replace("bg-", "bg-")
                        .replace("-100", "-500")}`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent expenses */}
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

          <div className="divide-y divide-slate-100">
            {RECENT_EXPENSES.map((e) => {
              const meta = CATEGORY_META[e.category];
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${meta.iconBg} border flex items-center justify-center text-lg shrink-0`}
                  >
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm truncate">
                      {e.vendor}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{meta.label}</span>
                      <span>•</span>
                      <span>{e.date}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-bold text-rose-600">
                      −{formatINR(e.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      via {e.paymentMode}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ Right: Side widgets (1/3 width) ============ */}
      <div className="space-y-4">
        {/* Budget alerts */}
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
            {BUDGET_ALERTS.map((b) => {
              const meta = CATEGORY_META[b.category];
              const isCritical = b.percent >= 90;
              const isWarning = b.percent >= 75 && b.percent < 90;
              return (
                <div
                  key={b.category}
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
                      {b.percent}%
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
                      style={{ width: `${b.percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{formatINR(b.used)} used</span>
                    <span>of {formatINR(b.budget)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick action card */}
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

          <button className="px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors">
            + New Expense
          </button>
        </div>

        {/* Cross-module insight */}
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
                {formatINR(84500)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-1">
                Salaries
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                  FROM SALARY
                </span>
              </span>
              <span className="font-semibold text-slate-900">
                {formatINR(285000)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-indigo-200">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-bold text-indigo-700 text-base">
                {formatINR(369500)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;
