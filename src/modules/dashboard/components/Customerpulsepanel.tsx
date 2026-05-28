import React from "react";
import { Button } from "antd";
import {
  HiOutlineHeart,
  HiOutlineArrowSmRight,
  HiOutlineTrendingUp,
  HiOutlineExclamationCircle,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { CustomerPulse } from "../types/Dashboard";

interface Props {
  data: CustomerPulse;
  onViewAll?: () => void;
}

const CustomerPulsePanel: React.FC<Props> = ({ data, onViewAll }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 flex items-center justify-center">
          <HiOutlineHeart size={16} />
        </div>
        <div>
          <h3 className="text-[13px] font-bold text-slate-800 leading-tight">
            Customer Pulse
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Engagement insights
          </p>
        </div>
      </div>
      {onViewAll && (
        <Button
          size="small"
          type="text"
          onClick={onViewAll}
          className="!text-[11px] !text-blue-600 !font-semibold"
        >
          All <HiOutlineArrowSmRight size={12} />
        </Button>
      )}
    </div>

    <div className="p-4 flex flex-col gap-2">
      {/* Inactive — needs action */}
      <div className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100 hover:bg-red-50 transition-colors cursor-pointer group">
        <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
          <HiOutlineExclamationCircle size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <p className="text-base font-extrabold text-red-700 tabular-nums">
              {data.inactive}
            </p>
            <p className="text-[11px] font-bold text-red-700">
              inactive 30+ days
            </p>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Re-engage to win them back
          </p>
        </div>
        <HiOutlineArrowSmRight
          size={16}
          className="text-red-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all"
        />
      </div>

      {/* Growth */}
      <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <HiOutlineTrendingUp size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <p className="text-base font-extrabold text-emerald-700 tabular-nums">
              +{data.newThisWeek}
            </p>
            <p className="text-[11px] font-bold text-emerald-700">
              new this week
            </p>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            +{data.growthPct}% growth rate
          </p>
        </div>
      </div>

      {/* Retention */}
      <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <HiOutlineShieldCheck size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <p className="text-base font-extrabold text-blue-700 tabular-nums">
              {data.retentionPct}%
            </p>
            <p className="text-[11px] font-bold text-blue-700">retention</p>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Above industry average
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default CustomerPulsePanel;
