import { useState } from "react";
import {
  HiOutlineCash,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineUser,
  HiOutlineClock,
} from "react-icons/hi";

import PettyCashModal from "./PettyCashModal";
import ReconcileModal from "./Reconcilemodal";

interface CashEntry {
  id: string;
  type: "in" | "out";
  amount: number;
  reason: string;
  handledBy: string;
  time: string;
}

const INITIAL_ENTRIES: CashEntry[] = [
  {
    id: "C-08",
    type: "out",
    amount: 250,
    reason: "Tea & snacks for loaders",
    handledBy: "Suresh M.",
    time: "5:15 PM",
  },
  {
    id: "C-07",
    type: "out",
    amount: 1500,
    reason: "Plant maintenance — small repair",
    handledBy: "Devaa Balaji",
    time: "3:30 PM",
  },
  {
    id: "C-06",
    type: "in",
    amount: 5000,
    reason: "Top-up from main account",
    handledBy: "Devaa Balaji",
    time: "2:00 PM",
  },
  {
    id: "C-05",
    type: "out",
    amount: 320,
    reason: "Auto fare — bank visit",
    handledBy: "Divya B.",
    time: "12:45 PM",
  },
  {
    id: "C-04",
    type: "out",
    amount: 800,
    reason: "Loading helper daily wage",
    handledBy: "Suresh M.",
    time: "11:30 AM",
  },
  {
    id: "C-03",
    type: "out",
    amount: 150,
    reason: "Fuel top-up — bike",
    handledBy: "Karthik R.",
    time: "10:15 AM",
  },
  {
    id: "C-02",
    type: "out",
    amount: 200,
    reason: "Stationery purchase",
    handledBy: "Divya B.",
    time: "9:30 AM",
  },
  {
    id: "C-01",
    type: "in",
    amount: 3000,
    reason: "Opening balance",
    handledBy: "Devaa Balaji",
    time: "8:00 AM",
  },
];

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const PettyCashPanel = () => {
  const [entries, setEntries] = useState<CashEntry[]>(INITIAL_ENTRIES);
  const [modalType, setModalType] = useState<"in" | "out" | null>(null);
  const [reconcileOpen, setReconcileOpen] = useState(false);
  const [reconciledTill, setReconciledTill] = useState("Yesterday");
  const [toast, setToast] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Sort newest first
  const sorted = [...entries].sort((a, b) => {
    const aNum = parseInt(a.id.replace("C-", ""));
    const bNum = parseInt(b.id.replace("C-", ""));
    return bNum - aNum;
  });

  const totalIn = entries
    .filter((e) => e.type === "in")
    .reduce((s, e) => s + e.amount, 0);
  const totalOut = entries
    .filter((e) => e.type === "out")
    .reduce((s, e) => s + e.amount, 0);
  const currentBalance = totalIn - totalOut;
  const openingBalance = entries.find((e) => e.id === "C-01")?.amount || 0;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddEntry = (data: {
    type: "in" | "out";
    amount: number;
    reason: string;
    handledBy: string;
    time: string;
  }) => {
    const nextId = `C-${String(entries.length + 1).padStart(2, "0")}`;
    const newEntry: CashEntry = {
      id: nextId,
      type: data.type,
      amount: data.amount,
      reason: data.reason,
      handledBy: data.handledBy,
      time: data.time,
    };
    setEntries((prev) => [...prev, newEntry]);
    showToast(
      data.type === "in"
        ? `✓ Added ${formatINR(data.amount)} to petty cash`
        : `✓ Recorded expense of ${formatINR(data.amount)}`
    );
  };

  const handleReconcile = (data: any) => {
    setReconciledTill("Today");
    showToast(
      data.difference === 0
        ? "✓ Cash reconciled successfully"
        : `⚠ Reconciled with ${formatINR(Math.abs(data.difference))} ${
            data.difference > 0 ? "excess" : "shortage"
          }`
    );
  };

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        {/* ============ Hero card ============ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Current balance */}
            <div className="lg:col-span-2 p-6 bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-50 border-b lg:border-b-0 lg:border-r border-emerald-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="relative">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white shadow-sm">
                      <HiOutlineCash className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                        Current Cash Balance
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {today}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReconcileOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-colors"
                  >
                    <HiOutlineRefresh className="w-3.5 h-3.5" />
                    Reconcile
                  </button>
                </div>

                <div className="mt-4">
                  <div className="text-5xl font-bold text-emerald-800 tracking-tight">
                    {formatINR(currentBalance)}
                  </div>
                  <div className="text-sm text-slate-600 mt-2">
                    Opening: {formatINR(openingBalance)} ·{" "}
                    <span className="text-emerald-700 font-semibold">
                      +{formatINR(totalIn - openingBalance)}
                    </span>{" "}
                    in,{" "}
                    <span className="text-rose-700 font-semibold">
                      −{formatINR(totalOut)}
                    </span>{" "}
                    out
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setModalType("in")}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <HiOutlinePlus className="w-4 h-4" />
                    Add Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalType("out")}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-semibold shadow-md hover:bg-rose-700 active:scale-95 transition-all"
                  >
                    <HiOutlineMinus className="w-4 h-4" />
                    Spend Cash
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar stats */}
            <div className="p-5 space-y-3 bg-white">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Today's Activity
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                <div className="flex items-center gap-2">
                  <HiOutlineArrowDown className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">
                    Cash In
                  </span>
                </div>
                <div className="text-xl font-bold text-emerald-800 mt-1">
                  {formatINR(totalIn)}
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">
                  {entries.filter((e) => e.type === "in").length} entries
                </div>
              </div>

              <div className="rounded-xl bg-rose-50 border border-rose-100 p-3">
                <div className="flex items-center gap-2">
                  <HiOutlineArrowUp className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-semibold text-rose-700">
                    Cash Out
                  </span>
                </div>
                <div className="text-xl font-bold text-rose-800 mt-1">
                  {formatINR(totalOut)}
                </div>
                <div className="text-[10px] text-rose-600 mt-0.5">
                  {entries.filter((e) => e.type === "out").length} expenses
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Reconciled till</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <HiOutlineCheckCircle className="w-3 h-3 text-emerald-500" />
                    {reconciledTill}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ Activity timeline ============ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Today's Cash Movements
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time log of cash in & out
              </p>
            </div>
            <span className="text-xs text-slate-500">
              {entries.length} transactions
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {sorted.map((entry) => {
              const isIn = entry.type === "in";
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIn
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                        : "bg-rose-50 border border-rose-200 text-rose-600"
                    }`}
                  >
                    {isIn ? (
                      <HiOutlineArrowDown className="w-5 h-5" />
                    ) : (
                      <HiOutlineArrowUp className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm truncate">
                      {entry.reason}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <HiOutlineUser className="w-3 h-3" />
                        {entry.handledBy}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <HiOutlineClock className="w-3 h-3" />
                        {entry.time}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {entry.id}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`text-base font-bold shrink-0 ${
                      isIn ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isIn ? "+" : "−"}
                    {formatINR(entry.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ Modals ============ */}
      <PettyCashModal
        open={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType || "in"}
        onSubmit={handleAddEntry}
        currentBalance={currentBalance}
      />

      <ReconcileModal
        open={reconcileOpen}
        onClose={() => setReconcileOpen(false)}
        systemBalance={currentBalance}
        onSubmit={handleReconcile}
      />
    </>
  );
};

export default PettyCashPanel;
