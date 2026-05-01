import React, { useMemo, useState } from "react";
import { Tooltip } from "antd";
import {
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineCheck,
  HiOutlineExclamationCircle,
  HiOutlineExclamation,
} from "react-icons/hi";
import type { ProductAlert } from "../../types/Product";
import AlertNotificationItem from "./AlertNotificationItem";

const COLLAPSED_LIMIT = 2;

interface AlertBannerProps {
  alerts: ProductAlert[];
  onDismiss: (productId: string) => void;
  onDismissAll: () => void;
  onAlertClick?: (productId: string) => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({
  alerts,
  onDismiss,
  onDismissAll,
  onAlertClick,
}) => {
  const [expanded, setExpanded] = useState(false);

  const { criticalCount, warningCount } = useMemo(
    () => ({
      criticalCount: alerts.filter((a) => a.severity === "critical").length,
      warningCount: alerts.filter((a) => a.severity === "warning").length,
    }),
    [alerts]
  );

  // Critical first
  const sorted = useMemo(() => {
    const order: Record<string, number> = { critical: 0, warning: 1 };
    return [...alerts].sort(
      (a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9)
    );
  }, [alerts]);

  if (sorted.length === 0) return null;

  const visible = expanded ? sorted : sorted.slice(0, COLLAPSED_LIMIT);
  const hiddenCount = sorted.length - COLLAPSED_LIMIT;
  const hasCritical = criticalCount > 0;

  return (
    <div
      className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
        hasCritical
          ? "border-red-200/70 bg-gradient-to-br from-red-50/40 via-white to-amber-50/40 shadow-sm shadow-red-100/30"
          : "border-amber-200/70 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 shadow-sm shadow-amber-100/40"
      }`}
    >
      {/* Decorative left accent */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] ${
          hasCritical ? "bg-red-500" : "bg-amber-400"
        }`}
        aria-hidden
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 pl-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 transition-transform duration-200 hover:scale-105 ${
                hasCritical
                  ? "bg-red-100 ring-red-200/60 text-red-600"
                  : "bg-amber-100 ring-amber-200/60 text-amber-600"
              }`}
            >
              <HiOutlineBell size={17} />
            </div>
            <span
              className={`absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-sm tabular-nums ${
                hasCritical ? "bg-red-500 animate-pulse" : "bg-amber-500"
              }`}
            >
              {sorted.length}
            </span>
          </div>

          <div>
            <p className="text-[13px] font-bold text-slate-800 leading-tight">
              {sorted.length} Active Alert
              {sorted.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {criticalCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100/80 px-1.5 py-0.5 rounded-md">
                  <HiOutlineExclamationCircle size={10} />
                  {criticalCount} critical
                </span>
              )}
              {warningCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-md">
                  <HiOutlineExclamation size={10} />
                  {warningCount} warning
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip title="Mark all as read">
            <button
              onClick={onDismissAll}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200 active:scale-95"
            >
              <HiOutlineCheck size={13} />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          </Tooltip>

          <Tooltip title={expanded ? "Show less" : "Show all"}>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all duration-200 active:scale-95"
              aria-label={expanded ? "Collapse alerts" : "Expand alerts"}
              aria-expanded={expanded}
            >
              <HiOutlineChevronDown
                size={15}
                className={`transition-transform duration-300 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />

      {/* List */}
      <div className="px-5 py-3 space-y-2">
        {visible.map((alert, idx) => (
          <div
            key={alert.id}
            className="animate-in fade-in slide-in-from-top-1 duration-200"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <AlertNotificationItem
              alert={alert}
              onDismiss={onDismiss}
              onViewProduct={onAlertClick}
            />
          </div>
        ))}

        {!expanded && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 rounded-xl hover:bg-white/60 transition-all duration-200 group"
          >
            <span>
              Show {hiddenCount} more alert{hiddenCount !== 1 ? "s" : ""}
            </span>
            <HiOutlineChevronDown
              size={12}
              className="transition-transform duration-200 group-hover:translate-y-0.5"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;
