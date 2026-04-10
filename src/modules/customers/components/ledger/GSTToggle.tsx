import React from "react";
import { Tooltip } from "antd";
import { HiOutlineReceiptTax } from "react-icons/hi";

interface GSTToggleProps {
  showGST: boolean;
  onToggle: () => void;
}

const GSTToggle: React.FC<GSTToggleProps> = ({ showGST, onToggle }) => {
  const tooltipText = showGST
    ? "Showing amounts with GST"
    : "Showing base amounts without GST";

  return (
    <Tooltip title={tooltipText}>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={showGST}
        aria-label="Toggle GST display"
        className={`flex items-center gap-2 px-3.5 py-[7px] rounded-xl border text-[12px] font-semibold transition-all duration-200 whitespace-nowrap ${
          showGST
            ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
        }`}
      >
        <HiOutlineReceiptTax className="text-sm flex-shrink-0" />
        <span>{showGST ? "With GST" : "Excl. GST"}</span>
        <span
          className={`relative w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0 ${
            showGST ? "bg-blue-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-200 ${
              showGST ? "left-[18px]" : "left-0.5"
            }`}
          />
        </span>
      </button>
    </Tooltip>
  );
};

export default GSTToggle;
