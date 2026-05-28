import React from "react";
import { Button, Progress } from "antd";
import {
  HiOutlineTruck,
  HiOutlineArrowSmRight,
  HiOutlinePhone,
} from "react-icons/hi";
import { DriverStatus } from "../types/Dashboard";

interface Props {
  drivers: DriverStatus[];
  onViewAll?: () => void;
}

const STATUS_DOT: Record<DriverStatus["status"], string> = {
  active: "bg-emerald-500",
  break: "bg-amber-500",
  completed: "bg-slate-300",
};

const STATUS_LABEL: Record<DriverStatus["status"], string> = {
  active: "On route",
  break: "On break",
  completed: "Completed",
};

const DriversOnDutyPanel: React.FC<Props> = ({ drivers, onViewAll }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center">
          <HiOutlineTruck size={16} />
        </div>
        <div>
          <h3 className="text-[13px] font-bold text-slate-800 leading-tight">
            Drivers On Duty
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {drivers.filter((d) => d.status === "active").length} active ·{" "}
            {drivers.filter((d) => d.status === "completed").length} done
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

    <div className="p-3">
      <div className="flex flex-col gap-1">
        {drivers.map((d) => {
          const pct = (d.done / d.total) * 100;
          return (
            <div
              key={d.id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              <div className="relative shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm"
                  style={{ background: d.avatarBg }}
                >
                  {d.initials}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${
                    STATUS_DOT[d.status]
                  } ${d.status === "active" ? "animate-pulse" : ""}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-bold text-slate-800 truncate">
                    {d.name}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-500 shrink-0 tabular-nums">
                    {d.done}/{d.total}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] text-slate-400 truncate">
                    {d.route}
                  </p>
                  <span className="text-[9px] text-slate-300">·</span>
                  <p className="text-[10px] font-semibold text-slate-500">
                    {STATUS_LABEL[d.status]}
                  </p>
                </div>
                <Progress
                  percent={pct}
                  showInfo={false}
                  size="small"
                  strokeColor={
                    d.status === "completed"
                      ? "#22c55e"
                      : d.status === "active"
                      ? "#3b82f6"
                      : "#f59e0b"
                  }
                  trailColor="#f1f5f9"
                  className="!mb-0"
                />
              </div>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-400"
                onClick={(e) => e.stopPropagation()}
                title={`Call ${d.name}`}
              >
                <HiOutlinePhone size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default DriversOnDutyPanel;
