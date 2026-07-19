import React from "react";
import {
  HiOutlineRefresh,
  HiOutlineBell,
  HiOutlineDownload,
} from "react-icons/hi";

interface Props {
  userName: string;
  attentionCount: number;
  refreshing?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const Greetingheader: React.FC<Props> = ({
  userName,
  attentionCount,
  refreshing = false,
  onRefresh,
  onExport,
}) => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {getGreeting()}, {userName}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE
          </span>
        </div>
        <p className="text-[13px] text-slate-500 mt-1.5 flex items-center gap-1.5">
          <span>{today}</span>
          {attentionCount > 0 && (
            <>
              <span className="text-slate-300">·</span>
              <span>
                You have{" "}
                <span className="font-semibold text-rose-600">
                  {attentionCount} thing{attentionCount > 1 ? "s" : ""}
                </span>{" "}
                needing attention
              </span>
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
        >
          <HiOutlineRefresh
            size={15}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
        <button className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50">
          <HiOutlineBell size={15} />
          Alerts
          {attentionCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
              {attentionCount}
            </span>
          )}
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
        >
          <HiOutlineDownload size={15} />
          Export
        </button>
      </div>
    </div>
  );
};

export default Greetingheader;
