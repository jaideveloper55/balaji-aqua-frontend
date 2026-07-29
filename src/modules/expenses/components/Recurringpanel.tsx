import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spin } from "antd";
import dayjs from "dayjs";
import {
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlineExclamation,
  HiOutlinePlus,
  HiOutlinePause,
  HiOutlinePlay,
  HiOutlinePencil,
  HiOutlineLightningBolt,
  HiOutlineTruck,
  HiOutlineArchive,
  HiOutlineOfficeBuilding,
  HiOutlineFolder,
  HiOutlineClipboardCheck,
} from "react-icons/hi";
import { HiOutlineWrench, HiOutlineCube } from "react-icons/hi2";

import Recurringformmodal from "./Recurringformmodal";
import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import {
  getRecurringStatsApi,
  getRecurringApi,
  getCategoriesSimpleApi,
  createRecurringApi,
  updateRecurringApi,
  toggleRecurringPauseApi,
  type CreateRecurringPayload,
} from "../api/Expenses.api";

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n ?? 0
  )}`;

const daysUntil = (date: string) => dayjs(date).diff(dayjs(), "day");

const freqLabel = (f: string) => f.charAt(0) + f.slice(1).toLowerCase();

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

const Recurringpanel: React.FC = () => {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };
  const openEdit = (item: any) => {
    setEditTarget(item);
    setModalOpen(true);
  };

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["recurring-stats"],
    queryFn: () => getRecurringStatsApi().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  const { data: recurringData, isLoading: isLoadingRecurring } = useQuery({
    queryKey: ["recurring"],
    queryFn: () => getRecurringApi().then((res) => res.data),
    staleTime: 1000 * 60 * 2,
  });

  const { data: categoriesSimple } = useQuery({
    queryKey: ["categories-simple"],
    queryFn: () => getCategoriesSimpleApi().then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });

  const items: any[] = recurringData ?? [];

  const stats = [
    {
      label: "Active Recurring",
      value: String(statsData?.activeCount ?? 0),
      sub: `${statsData?.pausedCount ?? 0} paused`,
      icon: <HiOutlineRefresh size={20} />,
      color: "#2563eb",
      bg: "#eff6ff",
      alert: false,
    },
    {
      label: "Monthly Commitment",
      value: inr(statsData?.monthlyCommitment ?? 0),
      sub: "Fixed monthly bills",
      icon: <HiOutlineCheckCircle size={20} />,
      color: "#059669",
      bg: "#ecfdf5",
      alert: false,
    },
    {
      label: "Due This Week",
      value: String(statsData?.dueThisWeek ?? 0),
      sub: "Need attention soon",
      icon: <HiOutlineCalendar size={20} />,
      color: "#d97706",
      bg: "#fffbeb",
      alert: true,
    },
    {
      label: "Urgent (≤5 days)",
      value: String(statsData?.urgent ?? 0),
      sub: "Pay immediately",
      icon: <HiOutlineExclamation size={20} />,
      color: "#dc2626",
      bg: "#fef2f2",
      alert: false,
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: CreateRecurringPayload) =>
      createRecurringApi(data).then((res) => res.data),
    onSuccess: (response) => {
      successNotification(
        "Recurring Added",
        `${response.name} · ${inr(Number(response.amount))} ${freqLabel(
          response.frequency
        )}`
      );
      setModalOpen(false);
      setEditTarget(null);
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-stats"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Failed to Add",
        err?.response?.data?.message ?? "Could not create recurring expense"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateRecurringPayload>;
    }) => updateRecurringApi(id, data).then((res) => res.data),
    onSuccess: (response) => {
      successNotification("Schedule Updated", response.name);
      setModalOpen(false);
      setEditTarget(null);
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-stats"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Update Failed",
        err?.response?.data?.message ?? "Could not update schedule"
      );
    },
  });

  const togglePauseMutation = useMutation({
    mutationFn: (id: string) =>
      toggleRecurringPauseApi(id).then((res) => res.data),
    onSuccess: (response) => {
      successNotification(
        response.isPaused ? "Paused" : "Resumed",
        `${response.name} schedule ${response.isPaused ? "paused" : "resumed"}`
      );
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-stats"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Toggle Failed",
        err?.response?.data?.message ?? "Could not update schedule"
      );
    },
  });

  const handleFormSubmit = (payload: CreateRecurringPayload) => {
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-5">
      <Spin spinning={isLoadingStats}>
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
      </Spin>

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
      <Spin spinning={isLoadingRecurring} tip="Loading schedules...">
        <div className="space-y-3">
          {items.length === 0 && !isLoadingRecurring && (
            <div className="text-center py-12 text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
              No recurring schedules yet — add one above
            </div>
          )}

          {items.map((it: any) => {
            const cat =
              CATEGORY_ICON[it.categoryName] ?? CATEGORY_ICON["Office"];
            const days = daysUntil(it.nextDue);
            const isOverdue = !it.isPaused && days < 0;
            const isUrgent = !it.isPaused && days >= 0 && days <= 7;

            return (
              <div
                key={it.id}
                className={`bg-white rounded-2xl border p-4 flex items-center gap-4 ${
                  it.isPaused
                    ? "border-slate-200 opacity-70"
                    : isUrgent || isOverdue
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
                    <p className="text-[12px] text-slate-500">
                      {it.vendorName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          FREQ_STYLE[it.frequency] ??
                          "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {freqLabel(it.frequency)}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                        {it.categoryName}
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
                        isOverdue
                          ? "text-rose-600 font-semibold"
                          : isUrgent
                          ? "text-amber-600 font-semibold"
                          : "text-slate-400"
                      }`}
                    >
                      {isOverdue
                        ? `Overdue by ${Math.abs(days)} day${
                            Math.abs(days) === 1 ? "" : "s"
                          }`
                        : days === 0
                        ? "Due today"
                        : `In ${days} days`}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(it)}
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200"
                    title="Edit schedule"
                  >
                    <HiOutlinePencil size={16} />
                  </button>

                  <button
                    onClick={() => togglePauseMutation.mutate(it.id)}
                    disabled={togglePauseMutation.isPending}
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                    title={it.isPaused ? "Resume schedule" : "Pause schedule"}
                  >
                    {it.isPaused ? (
                      <HiOutlinePlay size={16} />
                    ) : (
                      <HiOutlinePause size={16} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Spin>

      <Recurringformmodal
        open={modalOpen}
        initialData={editTarget}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleFormSubmit}
        categories={categoriesSimple ?? []}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Recurringpanel;
