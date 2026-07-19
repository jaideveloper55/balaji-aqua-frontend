import React from "react";
import { HiOutlineExclamation, HiX } from "react-icons/hi";

export interface SmartAlert {
  label: string;
  color: "red" | "amber" | "blue";
}

interface Props {
  alerts: SmartAlert[];
  onDismiss?: (index: number) => void;
}

const CHIP_STYLES: Record<string, string> = {
  red: "bg-white border-rose-200 text-rose-600",
  amber: "bg-white border-amber-200 text-amber-600",
  blue: "bg-white border-blue-200 text-blue-600",
};

const DOT_STYLES: Record<string, string> = {
  red: "bg-rose-500",
  amber: "bg-amber-500",
  blue: "bg-blue-500",
};

const Smartalertstrip: React.FC<Props> = ({ alerts, onDismiss }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/40 border border-amber-100 px-4 py-3">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
          <HiOutlineExclamation className="text-white" size={17} />
        </div>
        <span className="text-[13px] font-bold text-amber-800 hidden sm:inline">
          Action needed
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {alerts.map((a, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium border ${
              CHIP_STYLES[a.color]
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[a.color]}`}
            />
            {a.label}
            {onDismiss && (
              <button
                onClick={() => onDismiss(i)}
                className="ml-0.5 text-slate-400 hover:text-slate-600"
              >
                <HiX size={12} />
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Smartalertstrip;
