import React from "react";
import { HiOutlineBell } from "react-icons/hi";

const RulesEmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-300">
    <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-3">
      <HiOutlineBell className="text-3xl opacity-40" />
    </div>
    <p className="text-[13px] font-medium text-slate-500">
      No alert rules configured
    </p>
    <p className="text-[11px] text-slate-400 mt-1">
      Create your first rule to get notified
    </p>
  </div>
);

export default RulesEmptyState;
