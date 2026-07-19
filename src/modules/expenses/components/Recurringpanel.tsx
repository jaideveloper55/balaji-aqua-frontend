import React, { useState } from "react";
import dayjs from "dayjs";
import {
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlineExclamation,
  HiOutlinePlus,
  HiOutlinePause,
  HiOutlinePlay,
  HiOutlineLightningBolt,
  HiOutlineTruck,
  HiOutlineCube,
  HiOutlineArchive,
  HiOutlineOfficeBuilding,
  HiOutlineFolder,
  HiOutlineClipboardCheck,
} from "react-icons/hi";
import Recurringformmodal, { RecurringFormValues } from "./Recurringformmodal";
import { successNotification } from "../../../components/common/Notification";

import type { RecurringExpense } from "../types/Expenses";
import { MOCK_RECURRING, RECURRING_STATS } from "../constants/Recurringmockdata";
import { HiOutlineWrench } from "react-icons/hi2";

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n ?? 0
  )}`;

const CATEGORY_ICON: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  Utilities: {
    icon: <HiOutlineLightningBolt size={22} />,
    color: "#d97706",
    bg: "#fffbeb",
  },
  "Vehicle & Fuel": {
    icon: <HiOutlineTruck size={22} />,
    color: "#2563eb",
    bg: "#eff6ff",
  },
  "Plant Operations": {
    icon: <HiOutlineCube size={22} />,
    color: "#0891b2",
    bg: "#ecfeff",
  },
  Packaging: {
    icon: <HiOutlineArchive size={22} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  "Rent & Lease": {
    icon: <HiOutlineOfficeBuilding size={22} />,
    color: "#4f46e5",
    bg: "#eef2ff",
  },
  Repairs: {
    icon: <HiOutlineWrench size={22} />,
    color: "#ea580c",
    bg: "#fff7ed",
  },
  Office: {
    icon: <HiOutlineFolder size={22} />,
    color: "#0d9488",
    bg: "#f0fdfa",
  },
  Compliance: {
    icon: <HiOutlineClipboardCheck size={22} />,
    color: "#dc2626",
    bg: "#fef2f2",
  },
};

const FREQ_STYLE: Record<string, string> = {
  MONTHLY: "bg-blue-50 text-blue-700",
  YEARLY: "bg-indigo-50 text-indigo-700",
  QUARTERLY: "bg-violet-50 text-violet-700",
  WEEKLY: "bg-cyan-50 text-cyan-700",
};

const freqLabel = (f: string) => f.charAt(0) + f.slice(1).toLowerCase();

const Recurringpanel: React.FC = () => {
  const [items, setItems] = useState<RecurringExpense[]>(MOCK_RECURRING);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RecurringExpense | null>(null);

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const togglePause = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isPaused: !i.isPaused } : i))
    );
    const target = items.find((i) => i.id === id);
    successNotification(
      target?.isPaused ? "Resumed" : "Paused",
      `${target?.name} schedule ${target?.isPaused ? "resumed" : "paused"}`
    );
  };

  const handleSubmit = (values: RecurringFormValues) => {
    successNotification(
      editTarget ? "Schedule Updated" : "Recurring Added",
      `${values.name} · ${inr(
        Number(values.amount)
      )} ${values.frequency.toLowerCase()}`
    );
    setModalOpen(false);
  };

  const daysUntil = (date: string) => dayjs(date).diff(dayjs(), "day");

  const stats = [
    {
      label: "Active Recurring",
      value: String(RECURRING_STATS.activeCount),
      sub: `${RECURRING_STATS.pausedCount} paused`,
      icon: <HiOutlineRefresh size={20} />,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Monthly Commitment",
      value: inr(RECURRING_STATS.monthlyCommitment),
      sub: "Fixed monthly bills",
      icon: <HiOutlineCheckCircle size={20} />,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      label: "Due This Week",
      value: String(RECURRING_STATS.dueThisWeek),
      sub: "Need attention soon",
      icon: <HiOutlineCalendar size={20} />,
      color: "#d97706",
      bg: "#fffbeb",
      alert: true,
    },
    {
      label: "Urgent (≤5 days)",
      value: String(RECURRING_STATS.urgent),
      sub: "Pay immediately",
      icon: <HiOutlineExclamation size={20} />,
      color: "#dc2626",
      bg: "#fef2f2",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-white rounded-2xl border p-5 ${
              s.alert ? "border-amber-200" : "border-slate-200"
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: s.bg, color: s.color }}
            >
              {s.icon}
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
              {s.label}
            </p>
            <p
              className="text-[26px] font-extrabold leading-none"
              style={{ color: s.alert ? "#d97706" : "#0f172a" }}
            >
              {s.value}
            </p>
            <p className="text-[12px] text-slate-500 mt-1.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Header + Add */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-slate-900">
            Recurring Expense Schedules
          </h3>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Auto-generates expense entries on due date
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold"
        >
          <HiOutlinePlus size={16} /> Add Recurring
        </button>
      </div>

      {/* Schedule rows */}
      <div className="space-y-3">
        {items.map((it) => {
          const cat = CATEGORY_ICON[it.category] ?? CATEGORY_ICON["Office"];
          const days = daysUntil(it.nextDue);
          const isUrgent = !it.isPaused && days >= 0 && days <= 7;
          return (
            <div
              key={it.id}
              className={`bg-white rounded-2xl border p-4 flex items-center gap-4 ${
                it.isPaused
                  ? "border-slate-200 opacity-70"
                  : isUrgent
                  ? "border-amber-300"
                  : "border-slate-200"
              }`}
            >
              {/* Icon + name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: cat.bg, color: cat.color }}
                >
                  {cat.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[15px] font-bold text-slate-900 truncate">
                      {it.name}
                    </h4>
                    {it.isPaused && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                        PAUSED
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-slate-500">{it.vendor}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        FREQ_STYLE[it.frequency]
                      }`}
                    >
                      {freqLabel(it.frequency)}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                      {it.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="text-center hidden md:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Amount
                </p>
                <p className="text-[15px] font-bold text-slate-900">
                  {inr(it.amount)}
                </p>
              </div>

              {/* Next due */}
              <div className="text-right hidden sm:block min-w-[130px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Next Due
                </p>
                <p className="text-[13px] font-semibold text-slate-800 flex items-center justify-end gap-1">
                  <HiOutlineCalendar size={13} className="text-slate-400" />
                  {dayjs(it.nextDue).format("DD MMM YYYY")}
                </p>
                {!it.isPaused && (
                  <p
                    className={`text-[11px] ${
                      isUrgent
                        ? "text-amber-600 font-semibold"
                        : "text-slate-400"
                    }`}
                  >
                    {days < 0 ? "Overdue" : `In ${days} days`}
                  </p>
                )}
              </div>

              {/* Pause toggle */}
              <button
                onClick={() => togglePause(it.id)}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 shrink-0"
                title={it.isPaused ? "Resume schedule" : "Pause schedule"}
              >
                {it.isPaused ? (
                  <HiOutlinePlay size={16} />
                ) : (
                  <HiOutlinePause size={16} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <Recurringformmodal
        open={modalOpen}
        editItem={editTarget}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Recurringpanel;
