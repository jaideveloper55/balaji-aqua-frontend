import React from "react";
import { Tooltip } from "antd";
import { HiOutlineX, HiOutlineExternalLink } from "react-icons/hi";
import type { AlertNotification } from "../../types/Product";
import { ALERT_SEVERITY_MAP } from "../../constants/productConstants";

import SeverityIcon from "./SeverityIcon";
import { timeAgo, ChannelIcon } from "../../utils/alertHelpers";

interface AlertNotificationItemProps {
  notification: AlertNotification;
  onDismiss: (id: string) => void;
  onViewProduct?: (productId: string) => void;
}

const AlertNotificationItem: React.FC<AlertNotificationItemProps> = ({
  notification,
  onDismiss,
  onViewProduct,
}) => {
  const sev = ALERT_SEVERITY_MAP[notification.severity];

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-2xl bg-white border transition-all duration-200 hover:shadow-sm group ${sev.border}`}
    >
      <SeverityIcon severity={notification.severity} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-[2px] rounded-md"
            style={{ background: sev.bg, color: sev.color }}
          >
            {sev.label}
          </span>
          <span className="text-[10px] text-slate-400 tabular-nums">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-[12px] font-semibold text-slate-700">
          {notification.productName}
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
          {notification.message}
        </p>
        <div className="flex items-center gap-1 mt-2">
          {notification.channels.map((ch) => (
            <span
              key={ch}
              className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md"
            >
              <ChannelIcon channel={ch} />
              {ch.replace("_", "-")}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {onViewProduct && (
          <Tooltip title="View product">
            <button
              onClick={() => onViewProduct(notification.productId)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
            >
              <HiOutlineExternalLink size={13} />
            </button>
          </Tooltip>
        )}
        <Tooltip title="Dismiss">
          <button
            onClick={() => onDismiss(notification.id)}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <HiOutlineX size={13} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default AlertNotificationItem;
