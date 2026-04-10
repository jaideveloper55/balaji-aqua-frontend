import React from "react";
import { Tooltip } from "antd";
import {
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlinePhone,
} from "react-icons/hi";
import { BsPerson, BsArrowRepeat } from "react-icons/bs";
import { IoTimeOutline } from "react-icons/io5";
import { RiUserLocationLine } from "react-icons/ri";
import type { PendingDelivery } from "../types/delivery";

interface PendingAlertsProps {
  data: PendingDelivery[];
}

const PendingAlerts: React.FC<PendingAlertsProps> = ({ data }) => {
  const sorted = [...data].sort((a, b) => b.delayMinutes - a.delayMinutes);

  return (
    <div className="p-4 space-y-2.5">
      {sorted.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <HiOutlineClock className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-[13px] text-slate-500 font-medium">
            No pending alerts
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            All deliveries are on track
          </p>
        </div>
      )}

      {sorted.map((item) => (
        <div
          key={item.id}
          className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
            item.severity === "overdue"
              ? "border-red-200 bg-red-50/40 hover:shadow-red-100/50"
              : item.severity === "delayed"
              ? "border-amber-200 bg-amber-50/40 hover:shadow-amber-100/50"
              : "border-slate-200 bg-white hover:shadow-slate-100/50"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Severity icon */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                item.severity === "overdue"
                  ? "bg-red-100"
                  : item.severity === "delayed"
                  ? "bg-amber-100"
                  : "bg-slate-100"
              }`}
            >
              {item.severity === "overdue" ? (
                <HiOutlineExclamationCircle className="w-5 h-5 text-red-500 animate-pulse" />
              ) : item.severity === "delayed" ? (
                <IoTimeOutline className="w-5 h-5 text-amber-500" />
              ) : (
                <HiOutlineClock className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-semibold text-slate-800">
                  {item.customer}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                  {item.id}
                </span>
                <span
                  className={`px-1.5 py-[2px] rounded-md text-[9px] font-bold uppercase tracking-wider ${
                    item.severity === "overdue"
                      ? "bg-red-100 text-red-600"
                      : item.severity === "delayed"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.severity}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <HiOutlineClock className="w-3 h-3" />
                  Scheduled {item.scheduledTime}
                </span>
                <span className="flex items-center gap-1">
                  <BsPerson className="w-3 h-3" />
                  {item.driver}
                </span>
                {item.reason !== "—" && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="italic text-slate-500">{item.reason}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right side: delay + actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Tooltip title={`Delayed by ${item.delayMinutes} minutes`}>
              <div
                className={`text-[18px] font-bold tabular-nums px-2.5 py-1 rounded-xl ${
                  item.severity === "overdue"
                    ? "text-red-600 bg-red-50"
                    : item.severity === "delayed"
                    ? "text-amber-600 bg-amber-50"
                    : "text-slate-500 bg-slate-50"
                }`}
              >
                +{item.delayMinutes}m
              </div>
            </Tooltip>
            <div className="flex items-center gap-0.5">
              <Tooltip title="Reassign Driver">
                <button className="p-2 rounded-xl hover:bg-white text-slate-400 hover:text-indigo-600 transition-colors">
                  <RiUserLocationLine className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip title="Reschedule">
                <button className="p-2 rounded-xl hover:bg-white text-slate-400 hover:text-purple-600 transition-colors">
                  <BsArrowRepeat className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
              <Tooltip title="Call Customer">
                <button className="p-2 rounded-xl hover:bg-white text-slate-400 hover:text-emerald-600 transition-colors">
                  <HiOutlinePhone className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingAlerts;