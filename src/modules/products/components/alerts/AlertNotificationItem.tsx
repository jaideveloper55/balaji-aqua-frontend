import React, { useState } from "react";
import { Tooltip } from "antd";
import {
  HiOutlineX,
  HiOutlineExternalLink,
  HiOutlineExclamationCircle,
  HiOutlineExclamation,
} from "react-icons/hi";
import type { ProductAlert, AlertSeverity } from "../../types/Product";

// ─── Severity styling (inline — was in productConstants) ──────────────────
const SEVERITY_STYLES: Record<
  AlertSeverity,
  { label: string; color: string; bg: string; border: string }
> = {
  critical: {
    label: "Critical",
    color: "#dc2626",
    bg: "#fee2e2",
    border: "border-red-100",
  },
  warning: {
    label: "Warning",
    color: "#ca8a04",
    bg: "#fef9c3",
    border: "border-amber-100",
  },
};

const SEVERITY_ICONS = {
  critical: HiOutlineExclamationCircle,
  warning: HiOutlineExclamation,
} as const;

interface AlertNotificationItemProps {
  alert: ProductAlert;
  onDismiss: (productId: string) => void;
  onViewProduct?: (productId: string) => void;
}

const AlertNotificationItem: React.FC<AlertNotificationItemProps> = ({
  alert,
  onDismiss,
  onViewProduct,
}) => {
  const [isDismissing, setIsDismissing] = useState(false);
  const sev = SEVERITY_STYLES[alert.severity];
  const SeverityIcon = SEVERITY_ICONS[alert.severity];

  // Animate out before removing
  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => onDismiss(alert.productId), 180);
  };

  const handleCardClick = () => {
    if (onViewProduct) onViewProduct(alert.productId);
  };

  return (
    <div
      onClick={onViewProduct ? handleCardClick : undefined}
      className={`relative flex items-start gap-3 p-3.5 rounded-xl bg-white border ${
        sev.border
      } transition-all duration-200 group hover:shadow-md hover:-translate-y-0.5 hover:border-slate-200 ${
        onViewProduct ? "cursor-pointer" : ""
      } ${isDismissing ? "opacity-0 -translate-x-2 scale-95" : "opacity-100"}`}
    >
      {/* Severity icon block */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ring-1 ring-inset transition-transform duration-200 group-hover:scale-105"
        style={{
          background: sev.bg,
          color: sev.color,
          // @ts-ignore — runtime CSS var
          "--tw-ring-color": `${sev.color}25`,
        }}
      >
        <SeverityIcon size={15} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row: severity badge + SKU */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-[2px] rounded-md"
            style={{ background: sev.bg, color: sev.color }}
          >
            {sev.label}
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
            {alert.sku}
          </span>
        </div>

        {/* Product name */}
        <p className="text-[12.5px] font-semibold text-slate-800 leading-tight truncate group-hover:text-slate-900 transition-colors">
          {alert.productName}
        </p>

        {/* Message */}
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
          {alert.message}
        </p>

        {/* Stock info */}
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-50 ring-1 ring-slate-100 px-1.5 py-0.5 rounded-md">
            Stock: <span className="font-bold tabular-nums">{alert.stock}</span>
            <span className="text-slate-400 lowercase">
              {alert.unit.slice(0, 3)}
            </span>
          </span>
          {alert.minStock > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-50 ring-1 ring-slate-100 px-1.5 py-0.5 rounded-md">
              Min:{" "}
              <span className="font-bold tabular-nums">{alert.minStock}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="flex items-center gap-0.5 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:-translate-x-1 sm:group-hover:translate-x-0 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {onViewProduct && (
          <Tooltip title="View product">
            <button
              onClick={() => onViewProduct(alert.productId)}
              className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all duration-150 active:scale-90"
              aria-label="View product"
            >
              <HiOutlineExternalLink size={13} />
            </button>
          </Tooltip>
        )}
        <Tooltip title="Dismiss alert">
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all duration-150 active:scale-90"
            aria-label="Dismiss alert"
          >
            <HiOutlineX size={13} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default AlertNotificationItem;
