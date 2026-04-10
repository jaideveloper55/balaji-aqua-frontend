import React from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";

const AlertsEmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-10 gap-2">
    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
      <HiOutlineCheckCircle className="w-6 h-6 text-emerald-400" />
    </div>
    <p className="text-[13px] text-slate-500 font-medium">No active alerts</p>
    <p className="text-[11px] text-slate-400">
      All cans accounted for — looking good!
    </p>
  </div>
);

export default AlertsEmptyState;
