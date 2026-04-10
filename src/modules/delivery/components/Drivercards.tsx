import React from "react";
import { Tooltip } from "antd";
import { HiOutlinePhone } from "react-icons/hi";
import { RiRouteLine } from "react-icons/ri";
import type { Driver } from "../types/delivery";
import { DriverAvatar } from "./Deliveryshared";

interface DriverCardsProps {
  data: Driver[];
}

const DriverCards: React.FC<DriverCardsProps> = ({ data }) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {data.map((driver) => {
          const pct =
            driver.assigned > 0
              ? Math.round((driver.completed / driver.assigned) * 100)
              : 0;

          return (
            <div
              key={driver.id}
              className={`rounded-2xl border p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                driver.status === "active"
                  ? "border-slate-200 bg-white hover:shadow-slate-200/50"
                  : driver.status === "on-break"
                  ? "border-amber-200 bg-amber-50/30 hover:shadow-amber-100/50"
                  : "border-slate-200 bg-slate-50/50 opacity-60"
              }`}
            >
              {/* Header: avatar + name + status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <DriverAvatar name={driver.name} size="lg" />
                  <div>
                    <h4 className="text-[14px] font-semibold text-slate-800 leading-tight">
                      {driver.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <HiOutlinePhone className="w-3 h-3" />
                      {driver.phone}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-[3px] rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    driver.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : driver.status === "on-break"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {driver.status === "on-break" ? "Break" : driver.status}
                </span>
              </div>

              {/* Current route */}
              <div className="flex items-center gap-1.5 mb-3 px-2.5 py-2 bg-slate-50 rounded-xl">
                <RiRouteLine className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[12px] text-slate-600 font-medium">
                  {driver.currentRoute}
                </span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-1 mb-3">
                {[
                  {
                    label: "Assigned",
                    val: driver.assigned,
                    clr: "text-slate-700",
                  },
                  {
                    label: "Done",
                    val: driver.completed,
                    clr: "text-emerald-600",
                  },
                  {
                    label: "Pending",
                    val: driver.pending,
                    clr: "text-amber-600",
                  },
                  {
                    label: "Failed",
                    val: driver.failed,
                    clr: "text-red-500",
                  },
                ].map((s) => (
                  <Tooltip
                    key={s.label}
                    title={`${s.val} ${s.label.toLowerCase()}`}
                  >
                    <div className="text-center cursor-default">
                      <div
                        className={`text-[17px] font-bold ${s.clr} leading-none tabular-nums`}
                      >
                        {s.val}
                      </div>
                      <div className="text-[9px] text-slate-400 uppercase tracking-wide mt-1">
                        {s.label}
                      </div>
                    </div>
                  </Tooltip>
                ))}
              </div>

              {/* Completion bar */}
              {driver.assigned > 0 && (
                <Tooltip
                  title={`${driver.completed} of ${driver.assigned} deliveries complete (${pct}%)`}
                >
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-slate-400">
                        Completion
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 tabular-nums">
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          pct >= 80
                            ? "bg-emerald-500"
                            : pct >= 50
                            ? "bg-indigo-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </Tooltip>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriverCards;
