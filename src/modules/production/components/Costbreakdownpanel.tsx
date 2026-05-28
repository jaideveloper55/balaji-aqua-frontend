import React from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { CostBreakdown } from "../types/Production";
import { COST_CATEGORIES } from "../constants/Production.constants";

interface Props {
  breakdown: CostBreakdown;
  onViewDetails?: () => void;
}

const CostBreakdownPanel: React.FC<Props> = ({ breakdown, onViewDetails }) => {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const items = COST_CATEGORIES.map((c) => {
    const value = breakdown[c.key as keyof CostBreakdown] || 0;
    const pct = total > 0 ? (value / total) * 100 : 0;
    return { ...c, value, pct };
  }).sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-800">Cost Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            This month's production cost split
          </p>
        </div>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View Details <HiOutlineArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Total */}
      <div className="mb-5 pb-5 border-b border-dashed border-slate-200">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Total Production Cost
        </p>
        <p className="text-3xl font-extrabold text-slate-900 tabular-nums mt-1">
          ₹{total.toLocaleString()}
        </p>
      </div>

      {/* Stacked bar */}
      <div className="h-3 rounded-full overflow-hidden flex bg-slate-100 mb-5">
        {items.map((it) => (
          <div
            key={it.key}
            style={{
              width: `${it.pct}%`,
              background: it.color,
            }}
            className="transition-all hover:opacity-80"
            title={`${it.label}: ₹${it.value.toLocaleString()}`}
          />
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.key} className="flex items-center gap-3">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: it.color }}
            />
            <span className="text-sm text-slate-700 flex-1 truncate">
              {it.label}
            </span>
            <span className="text-xs text-slate-400 tabular-nums w-12 text-right">
              {it.pct.toFixed(1)}%
            </span>
            <span className="text-sm font-semibold text-slate-800 tabular-nums w-20 text-right">
              ₹{it.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CostBreakdownPanel;
