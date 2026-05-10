import { useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePlus,
} from "react-icons/hi";
import type { Employee } from "../types/Employees";

interface Props {
  employees: Employee[];
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: "casual" | "sick" | "earned" | "unpaid";
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

const SAMPLE_LEAVES: LeaveRequest[] = [
  {
    id: "L1",
    employeeId: "EMP-003",
    employeeName: "Vijay Prakash",
    leaveType: "sick",
    fromDate: "2026-05-04",
    toDate: "2026-05-06",
    days: 3,
    reason: "Fever and rest advised by doctor",
    status: "approved",
  },
  {
    id: "L2",
    employeeId: "EMP-002",
    employeeName: "Karthik Raja",
    leaveType: "casual",
    fromDate: "2026-05-10",
    toDate: "2026-05-11",
    days: 2,
    reason: "Family function in hometown",
    status: "pending",
  },
  {
    id: "L3",
    employeeId: "EMP-005",
    employeeName: "Rajesh Kumar",
    leaveType: "earned",
    fromDate: "2026-05-15",
    toDate: "2026-05-20",
    days: 6,
    reason: "Family vacation",
    status: "pending",
  },
];

const LEAVE_TYPE_META: Record<string, { label: string; color: string }> = {
  casual: {
    label: "Casual",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  sick: { label: "Sick", color: "bg-red-50 text-red-700 border-red-200" },
  earned: {
    label: "Earned",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  unpaid: {
    label: "Unpaid",
    color: "bg-slate-50 text-slate-700 border-slate-200",
  },
};

const LeavesPanel = ({ employees }: Props) => {
  const [view, setView] = useState<"applications" | "balances">("applications");

  const pending = SAMPLE_LEAVES.filter((l) => l.status === "pending").length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Pending
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {pending}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Approved
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {SAMPLE_LEAVES.filter((l) => l.status === "approved").length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            On Leave Today
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {employees.filter((e) => e.status === "on_leave").length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Total Days (Month)
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {SAMPLE_LEAVES.reduce((s, l) => s + l.days, 0)}
          </div>
        </div>
      </div>

      {/* Toggle + Add */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {[
            { key: "applications", label: "Applications" },
            { key: "balances", label: "Leave Balances" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setView(t.key as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                view === t.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
          <HiOutlinePlus className="w-3.5 h-3.5" />
          Apply Leave
        </button>
      </div>

      {/* Content */}
      {view === "applications" ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {SAMPLE_LEAVES.map((leave, i) => {
            const typeMeta = LEAVE_TYPE_META[leave.leaveType];
            return (
              <div
                key={leave.id}
                className={`p-4 flex items-center gap-4 ${
                  i !== SAMPLE_LEAVES.length - 1
                    ? "border-b border-slate-100"
                    : ""
                } hover:bg-slate-50/50 transition-colors`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                  {leave.employeeName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-slate-900">
                      {leave.employeeName}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${typeMeta.color}`}
                    >
                      {typeMeta.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <HiOutlineCalendar className="w-3 h-3" />
                      {leave.fromDate} → {leave.toDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineClock className="w-3 h-3" />
                      {leave.days} days
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 italic">
                    "{leave.reason}"
                  </p>
                </div>

                {leave.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                      <HiOutlineCheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
                      <HiOutlineXCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      leave.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {leave.status}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <div className="col-span-5">Employee</div>
            <div className="col-span-2 text-center">Casual</div>
            <div className="col-span-2 text-center">Sick</div>
            <div className="col-span-2 text-center">Earned</div>
            <div className="col-span-1 text-center">Total</div>
          </div>
          {employees.map((e) => {
            const balance = e.totalLeaveBalance ?? 0;
            return (
              <div
                key={e.id}
                className="grid grid-cols-12 gap-3 items-center px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 text-white font-bold flex items-center justify-center text-sm">
                    {e.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {e.fullName}
                    </div>
                    <div className="text-xs text-slate-500">{e.employeeId}</div>
                  </div>
                </div>
                <div className="col-span-2 text-center text-sm font-medium text-blue-600">
                  {Math.floor(balance * 0.3)}
                </div>
                <div className="col-span-2 text-center text-sm font-medium text-red-600">
                  {Math.floor(balance * 0.4)}
                </div>
                <div className="col-span-2 text-center text-sm font-medium text-emerald-600">
                  {Math.floor(balance * 0.3)}
                </div>
                <div className="col-span-1 text-center text-sm font-bold text-slate-900">
                  {balance}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeavesPanel;
