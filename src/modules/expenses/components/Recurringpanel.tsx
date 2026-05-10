import { useState } from "react";
import {
  HiOutlineRefresh,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlinePause,
  HiOutlineLightningBolt,
  HiOutlineExclamation,
} from "react-icons/hi";
import { CATEGORY_META } from "../constants/Expenses.constants";
import RecurringFormModal from "./Recurringformmodal";

interface RecurringRow {
  id: string;
  title: string;
  vendor: string;
  category: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "yearly" | "weekly";
  nextDueDate: string;
  daysUntilDue: number;
  isActive: boolean;
}

const INITIAL_RECURRING: RecurringRow[] = [
  {
    id: "R-001",
    title: "Plant Rent",
    vendor: "Sundaram Property",
    category: "rent",
    amount: 12000,
    frequency: "monthly",
    nextDueDate: "2026-06-01",
    daysUntilDue: 28,
    isActive: true,
  },
  {
    id: "R-002",
    title: "Electricity Bill",
    vendor: "TN Electricity Board",
    category: "utilities",
    amount: 18500,
    frequency: "monthly",
    nextDueDate: "2026-05-15",
    daysUntilDue: 11,
    isActive: true,
  },
  {
    id: "R-003",
    title: "Internet & WiFi",
    vendor: "Airtel Business",
    category: "utilities",
    amount: 1500,
    frequency: "monthly",
    nextDueDate: "2026-05-10",
    daysUntilDue: 6,
    isActive: true,
  },
  {
    id: "R-004",
    title: "Vehicle Insurance",
    vendor: "ICICI Lombard",
    category: "vehicle",
    amount: 24000,
    frequency: "yearly",
    nextDueDate: "2026-08-15",
    daysUntilDue: 103,
    isActive: true,
  },
  {
    id: "R-005",
    title: "BIS License Renewal",
    vendor: "Bureau of Indian Standards",
    category: "compliance",
    amount: 35000,
    frequency: "yearly",
    nextDueDate: "2026-05-08",
    daysUntilDue: 4,
    isActive: true,
  },
  {
    id: "R-006",
    title: "FSSAI License",
    vendor: "FSSAI",
    category: "compliance",
    amount: 7500,
    frequency: "yearly",
    nextDueDate: "2026-09-22",
    daysUntilDue: 141,
    isActive: false,
  },
];

const FREQ_META: Record<string, { label: string; bg: string; color: string }> =
  {
    monthly: {
      label: "Monthly",
      bg: "bg-blue-50 border-blue-200",
      color: "text-blue-700",
    },
    quarterly: {
      label: "Quarterly",
      bg: "bg-purple-50 border-purple-200",
      color: "text-purple-700",
    },
    yearly: {
      label: "Yearly",
      bg: "bg-indigo-50 border-indigo-200",
      color: "text-indigo-700",
    },
    weekly: {
      label: "Weekly",
      bg: "bg-cyan-50 border-cyan-200",
      color: "text-cyan-700",
    },
  };

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const RecurringPanel = () => {
  const [recurring, setRecurring] = useState<RecurringRow[]>(INITIAL_RECURRING);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const togglePause = (id: string) => {
    setRecurring((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
    const item = recurring.find((r) => r.id === id);
    showToast(
      item?.isActive ? `⏸ Paused "${item.title}"` : `▶ Resumed "${item?.title}"`
    );
  };

  const payNow = (item: RecurringRow) => {
    showToast(
      `💸 Processing payment of ${formatINR(item.amount)} for ${item.title}`
    );
    // In real app: create expense entry + update next due date
    setRecurring((prev) =>
      prev.map((r) => {
        if (r.id !== item.id) return r;
        const nextDate = new Date(r.nextDueDate);
        if (r.frequency === "monthly")
          nextDate.setMonth(nextDate.getMonth() + 1);
        else if (r.frequency === "weekly")
          nextDate.setDate(nextDate.getDate() + 7);
        else if (r.frequency === "quarterly")
          nextDate.setMonth(nextDate.getMonth() + 3);
        else if (r.frequency === "yearly")
          nextDate.setFullYear(nextDate.getFullYear() + 1);

        const newDays = Math.floor(
          (nextDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        return {
          ...r,
          nextDueDate: nextDate.toISOString().split("T")[0],
          daysUntilDue: newDays,
        };
      })
    );
  };

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (item: RecurringRow) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleSave = (data: any) => {
    // Calculate days until due
    const due = new Date(data.nextDueDate);
    const days = Math.floor(
      (due.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (editing) {
      setRecurring((prev) =>
        prev.map((r) =>
          r.id === editing.id ? { ...r, ...data, daysUntilDue: days } : r
        )
      );
      showToast(`✓ Updated "${data.title}"`);
    } else {
      setRecurring((prev) => [
        ...prev,
        { ...data, daysUntilDue: days, isActive: true },
      ]);
      showToast(`✓ Recurring schedule "${data.title}" created`);
    }
  };

  const active = recurring.filter((r) => r.isActive);
  const totalMonthly = active
    .filter((r) => r.frequency === "monthly")
    .reduce((s, r) => s + r.amount, 0);
  const upcomingThisWeek = active.filter((r) => r.daysUntilDue <= 7).length;
  const overdueOrUrgent = active.filter((r) => r.daysUntilDue <= 5);

  // Sort by days until due
  const sorted = [...recurring].sort((a, b) => a.daysUntilDue - b.daysUntilDue);

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <HiOutlineRefresh className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Active Recurring
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {active.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {recurring.length - active.length} paused
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-100">
                <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Monthly Commitment
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {formatINR(totalMonthly)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Fixed monthly bills
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-200">
                <HiOutlineCalendar className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Due This Week
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-800 mt-2">
              {upcomingThisWeek}
            </div>
            <div className="text-xs text-amber-700 mt-1">
              Need attention soon
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-200">
                <HiOutlineExclamation className="w-4 h-4 text-rose-700" />
              </div>
              <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                Urgent (≤5 days)
              </div>
            </div>
            <div className="text-2xl font-bold text-rose-800 mt-2">
              {overdueOrUrgent.length}
            </div>
            <div className="text-xs text-rose-700 mt-1">Pay immediately</div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recurring Expense Schedules
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Auto-generates expense entries on due date
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold shadow-md hover:bg-rose-700 active:scale-95 transition-all"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Recurring
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {sorted.map((r) => {
            const meta = CATEGORY_META[r.category];
            const freq = FREQ_META[r.frequency];
            const isUrgent = r.daysUntilDue <= 5 && r.isActive;
            const isUpcoming =
              r.daysUntilDue > 5 && r.daysUntilDue <= 14 && r.isActive;

            return (
              <div
                key={r.id}
                className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-all ${
                  !r.isActive
                    ? "border-slate-200 opacity-60"
                    : isUrgent
                    ? "border-rose-200"
                    : isUpcoming
                    ? "border-amber-200"
                    : "border-slate-200"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 items-center">
                  {/* Title */}
                  <div
                    className="lg:col-span-4 flex items-center gap-3 cursor-pointer"
                    onClick={() => handleEdit(r)}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${meta.iconBg} border flex items-center justify-center text-2xl shrink-0`}
                    >
                      {meta.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-slate-900 truncate">
                          {r.title}
                        </div>
                        {!r.isActive && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            PAUSED
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {r.vendor}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold border ${freq.bg} ${freq.color}`}
                        >
                          {freq.label}
                        </span>
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold border ${meta.bg} ${meta.color}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="lg:col-span-2">
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      Amount
                    </div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">
                      {formatINR(r.amount)}
                    </div>
                  </div>

                  {/* Next due */}
                  <div className="lg:col-span-3">
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      Next Due
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <HiOutlineCalendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(r.nextDueDate)}
                    </div>
                    {r.isActive && (
                      <div
                        className={`text-[10px] font-semibold mt-0.5 ${
                          isUrgent
                            ? "text-rose-600"
                            : isUpcoming
                            ? "text-amber-600"
                            : "text-slate-500"
                        }`}
                      >
                        {isUrgent && "⚠ "}
                        {r.daysUntilDue === 0
                          ? "Due today"
                          : r.daysUntilDue === 1
                          ? "Due tomorrow"
                          : `In ${r.daysUntilDue} days`}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-3 flex items-center justify-end gap-2">
                    {r.isActive ? (
                      <>
                        {isUrgent && (
                          <button
                            type="button"
                            onClick={() => payNow(r)}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold shadow-md hover:bg-rose-700 active:scale-95 transition-all"
                          >
                            <HiOutlineLightningBolt className="w-3.5 h-3.5" />
                            Pay Now
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => togglePause(r.id)}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 active:scale-95 transition-all"
                          title="Pause"
                        >
                          <HiOutlinePause className="w-4 h-4 text-slate-500" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => togglePause(r.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 active:scale-95 transition-all"
                      >
                        <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                        Resume
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <RecurringFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        initialData={editing}
      />
    </>
  );
};

export default RecurringPanel;
