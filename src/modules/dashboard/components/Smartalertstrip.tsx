import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamation, HiOutlineX } from "react-icons/hi";
import { AlertItem } from "../types/Dashboard";

interface Props {
  alerts: AlertItem[];
}

const TONE_STYLES: Record<
  AlertItem["type"],
  { bg: string; text: string; dot: string; border: string }
> = {
  danger: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    border: "border-red-100",
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-100",
  },
  info: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-100",
  },
  success: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-100",
  },
};

const SmartAlertStrip: React.FC<Props> = ({ alerts }) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = React.useState<string[]>([]);

  const visible = alerts.filter((a) => !dismissed.includes(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border border-amber-100 rounded-2xl p-3 flex items-center gap-3 flex-wrap shadow-sm">
      <div className="flex items-center gap-2 shrink-0 pl-1">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-red-500 text-white flex items-center justify-center shadow-sm">
          <HiOutlineExclamation size={16} />
        </div>
        <span className="text-[12px] font-bold text-amber-900">
          Action needed
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap flex-1">
        {visible.map((alert) => {
          const tone = TONE_STYLES[alert.type];
          return (
            <button
              key={alert.id}
              onClick={() => alert.action && navigate(alert.action)}
              className={`group flex items-center gap-2 pl-2 pr-1 py-1 bg-white rounded-full border ${tone.border} hover:shadow-md hover:-translate-y-0.5 transition-all`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${tone.dot} animate-pulse`}
              />
              <span className={`text-[11px] font-semibold ${tone.text}`}>
                {alert.label}
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setDismissed((prev) => [...prev, alert.id]);
                }}
                className="w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <HiOutlineX size={11} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SmartAlertStrip;
