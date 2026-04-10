import React, { useMemo, useState } from "react";
import { Tooltip } from "antd";
import {
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineCheck,
} from "react-icons/hi";
import { AlertNotification } from "../../types/Product";
import AlertNotificationItem from "./AlertNotificationItem";

const COLLAPSED_LIMIT = 2;

interface AlertBannerProps {
  notifications: AlertNotification[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onViewProduct?: (productId: string) => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({
  notifications,
  onDismiss,
  onDismissAll,
  onViewProduct,
}) => {
  const [expanded, setExpanded] = useState(false);

  const { unread, criticalCount, warningCount } = useMemo(() => {
    const unreadList = notifications.filter((n) => !n.isRead);
    return {
      unread: unreadList,
      criticalCount: unreadList.filter((n) => n.severity === "critical").length,
      warningCount: unreadList.filter((n) => n.severity === "warning").length,
    };
  }, [notifications]);

  if (unread.length === 0) return null;

  const visible = expanded ? unread : unread.slice(0, COLLAPSED_LIMIT);
  const hiddenCount = unread.length - COLLAPSED_LIMIT;

  return (
    <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-orange-50/60 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <HiOutlineBell className="text-amber-600 text-lg" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
              {unread.length}
            </span>
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-800">
              {unread.length} Active Alert{unread.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {criticalCount > 0 && (
                <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                  {criticalCount} critical
                </span>
              )}
              {warningCount > 0 && (
                <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                  {warningCount} warning
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip title="Mark all as read">
            <button
              onClick={onDismissAll}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-white/60 transition-colors"
            >
              <HiOutlineCheck size={13} /> Mark all read
            </button>
          </Tooltip>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-xl hover:bg-white/60 text-slate-400 transition-colors"
            aria-label={expanded ? "Collapse alerts" : "Expand alerts"}
          >
            {expanded ? (
              <HiOutlineChevronUp size={15} />
            ) : (
              <HiOutlineChevronDown size={15} />
            )}
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="px-5 pb-4 space-y-2">
        {visible.map((notif) => (
          <AlertNotificationItem
            key={notif.id}
            notification={notif}
            onDismiss={onDismiss}
            onViewProduct={onViewProduct}
          />
        ))}

        {!expanded && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full text-center py-2 text-[11px] font-semibold text-amber-700 hover:text-amber-800 rounded-xl hover:bg-amber-50/50 transition-colors"
          >
            Show {hiddenCount} more alert{hiddenCount !== 1 ? "s" : ""}
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;
