import React from "react";
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from "react-icons/hi";
import { TodayPL } from "../types/Dashboard";

interface Props {
  data: TodayPL;
}

const TodayPLBar: React.FC<Props> = ({ data }) => {
  const total = data.revenue + data.expense;
  const revPct = total > 0 ? (data.revenue / total) * 100 : 0;
  const expPct = total > 0 ? (data.expense / total) * 100 : 0;
  const profitChange =
    data.prevProfit > 0
      ? ((data.profit - data.prevProfit) / data.prevProfit) * 100
      : 0;
  const isUp = profitChange >= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-xs font-bold">
            P&L
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-800 leading-tight">
              Today's P&amp;L
            </p>
            <p className="text-[11px] text-slate-400">
              Real-time profit & loss
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Revenue
            </p>
            <p className="text-base font-extrabold text-emerald-600 tabular-nums">
              ₹{data.revenue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Expense
            </p>
            <p className="text-base font-extrabold text-red-600 tabular-nums">
              ₹{data.expense.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Profit
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-base font-extrabold text-slate-900 tabular-nums">
                ₹{data.profit.toLocaleString("en-IN")}
              </p>
              <span
                className={`text-[10px] font-bold flex items-center gap-0.5 ${
                  isUp ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {isUp ? (
                  <HiOutlineTrendingUp size={11} />
                ) : (
                  <HiOutlineTrendingDown size={11} />
                )}
                {Math.abs(profitChange).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
        <div
          className="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${revPct}%` }}
          title={`Revenue ${revPct.toFixed(0)}%`}
        />
        <div
          className="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
          style={{ width: `${expPct}%` }}
          title={`Expense ${expPct.toFixed(0)}%`}
        />
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Income {revPct.toFixed(0)}%
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Expense {expPct.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default TodayPLBar;
