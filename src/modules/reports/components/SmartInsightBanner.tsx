import React from "react";
import { HiOutlineLightBulb, HiOutlineSparkles } from "react-icons/hi";

interface Props {
  insights: { label: string; isPositive: boolean }[];
  summary: React.ReactNode;
}

const SmartInsightBanner: React.FC<Props> = ({ insights, summary }) => (
  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5 print:hidden">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/30">
        <HiOutlineLightBulb size={20} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
          <HiOutlineSparkles size={12} />
          Smart Insight
        </p>
        <p className="text-sm text-slate-800 mt-1 leading-relaxed">{summary}</p>
        {insights.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {insights.map((i, idx) => (
              <span
                key={idx}
                className={`text-[11px] font-semibold px-2 py-1 rounded-md ${
                  i.isPositive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {i.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default SmartInsightBanner;
