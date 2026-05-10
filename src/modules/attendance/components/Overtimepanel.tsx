// src/modules/attendance/components/OvertimePanel.tsx

import { useState } from "react";
import {
  HiOutlineLightningBolt,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineCash,
  HiOutlineClock,
  HiOutlinePlus,
  HiOutlineCalendar,
  HiOutlineFilter,
} from "react-icons/hi";

interface OTRecord {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  date: string;
  hours: number;
  type: "regular" | "weekend" | "holiday";
  multiplier: number;
  hourlyRate: number;
  totalAmount: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "paid";
}

const SAMPLE_OT: OTRecord[] = [
  {
    id: "OT-001",
    employeeId: "EMP-001",
    name: "Suresh Murugan",
    designation: "Senior Driver",
    date: "2026-05-03",
    hours: 3,
    type: "regular",
    multiplier: 1.5,
    hourlyRate: 75,
    totalAmount: 337.5,
    reason: "Extra deliveries due to event",
    status: "approved",
  },
  {
    id: "OT-002",
    employeeId: "EMP-002",
    name: "Karthik Raja",
    designation: "Driver",
    date: "2026-05-04",
    hours: 4,
    type: "weekend",
    multiplier: 2,
    hourlyRate: 67,
    totalAmount: 536,
    reason: "Sunday emergency delivery",
    status: "pending",
  },
  {
    id: "OT-003",
    employeeId: "EMP-005",
    name: "Rajesh Kumar",
    designation: "Plant Operator",
    date: "2026-05-02",
    hours: 2,
    type: "regular",
    multiplier: 1.5,
    hourlyRate: 92,
    totalAmount: 276,
    reason: "Plant maintenance after hours",
    status: "paid",
  },
  {
    id: "OT-004",
    employeeId: "EMP-004",
    name: "Arun Selvam",
    designation: "Loader",
    date: "2026-05-04",
    hours: 5,
    type: "weekend",
    multiplier: 2,
    hourlyRate: 50,
    totalAmount: 500,
    reason: "Bulk order loading",
    status: "pending",
  },
];

const TYPE_META: Record<
  string,
  { label: string; bg: string; color: string; icon: string }
> = {
  regular: {
    label: "Regular",
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
    icon: "⚡",
  },
  weekend: {
    label: "Weekend",
    bg: "bg-purple-50 border-purple-200",
    color: "text-purple-700",
    icon: "🌙",
  },
  holiday: {
    label: "Holiday",
    bg: "bg-rose-50 border-rose-200",
    color: "text-rose-700",
    icon: "🎉",
  },
};

const STATUS_META: Record<
  string,
  { label: string; bg: string; color: string; dot: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50 border-amber-200",
    color: "text-amber-700",
    dot: "bg-amber-500",
  },
  approved: {
    label: "Approved",
    bg: "bg-emerald-50 border-emerald-200",
    color: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50 border-red-200",
    color: "text-red-700",
    dot: "bg-red-500",
  },
  paid: {
    label: "Paid",
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
    dot: "bg-blue-500",
  },
};

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const OvertimePanel = () => {
  const [filter, setFilter] = useState<string>("all");

  const filtered = SAMPLE_OT.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  // Stats
  const totalOTHours = SAMPLE_OT.reduce((s, r) => s + r.hours, 0);
  const totalOTAmount = SAMPLE_OT.reduce((s, r) => s + r.totalAmount, 0);
  const pendingApproval = SAMPLE_OT.filter(
    (r) => r.status === "pending"
  ).length;
  const paid = SAMPLE_OT.filter((r) => r.status === "paid").length;

  return (
    <div className="space-y-4">
      {/* Stats banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100">
              <HiOutlineLightningBolt className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Total OT Hours
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-800 mt-2">
            {totalOTHours}
            <span className="text-sm font-medium ml-1">hrs</span>
          </div>
          <div className="text-xs text-amber-600/80 mt-1">This month</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100">
              <HiOutlineCash className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              OT Payout
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-800 mt-2">
            {formatINR(totalOTAmount)}
          </div>
          <div className="text-xs text-emerald-600/80 mt-1">All entries</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-100">
              <HiOutlineClock className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Pending Approval
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-700 mt-2">
            {pendingApproval}
          </div>
          <div className="text-xs text-slate-500 mt-1">Need your action</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <HiOutlineCheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Paid
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-2">{paid}</div>
          <div className="text-xs text-slate-500 mt-1">This month</div>
        </div>
      </div>

      {/* Filter + add */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <HiOutlineFilter className="w-3.5 h-3.5" />
            Filter:
          </span>
          {[
            { key: "all", label: "All", count: SAMPLE_OT.length },
            {
              key: "pending",
              label: "Pending",
              count: SAMPLE_OT.filter((r) => r.status === "pending").length,
            },
            {
              key: "approved",
              label: "Approved",
              count: SAMPLE_OT.filter((r) => r.status === "approved").length,
            },
            {
              key: "paid",
              label: "Paid",
              count: SAMPLE_OT.filter((r) => r.status === "paid").length,
            },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f.key
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  filter === f.key
                    ? "bg-white/25 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all">
          <HiOutlinePlus className="w-3.5 h-3.5" />
          Add OT Entry
        </button>
      </div>

      {/* OT records */}
      <div className="space-y-3">
        {filtered.map((r) => {
          const type = TYPE_META[r.type];
          const status = STATUS_META[r.status];

          return (
            <div
              key={r.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
                {/* Employee */}
                <div className="lg:col-span-3 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold flex items-center justify-center shadow-md">
                    {r.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">
                      {r.name}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="font-mono">{r.employeeId}</span>
                      <span>•</span>
                      <span className="truncate">{r.designation}</span>
                    </div>
                  </div>
                </div>

                {/* Date + Type */}
                <div className="lg:col-span-2 flex flex-col justify-center gap-1">
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <HiOutlineCalendar className="w-3 h-3" />
                    {new Date(r.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold w-fit ${type.bg} ${type.color}`}
                  >
                    {type.icon} {type.label}
                  </span>
                </div>

                {/* Hours */}
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Hours
                  </div>
                  <div className="text-xl font-bold text-slate-900 flex items-baseline gap-1">
                    {r.hours}
                    <span className="text-xs text-slate-500 font-medium">
                      hrs × {r.multiplier}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Amount
                  </div>
                  <div className="text-xl font-bold text-emerald-700">
                    {formatINR(r.totalAmount)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    @ ₹{r.hourlyRate}/hr
                  </div>
                </div>

                {/* Status / Actions */}
                <div className="lg:col-span-3 flex items-center justify-end gap-2">
                  {r.status === "pending" ? (
                    <>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors">
                        <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors">
                        <HiOutlineXCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${status.bg} ${status.color}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                      />
                      {status.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="px-4 pb-3 -mt-1">
                <div className="text-xs text-slate-500 italic flex items-start gap-1.5 bg-slate-50/50 rounded-lg px-3 py-2">
                  <span className="font-semibold text-slate-600 not-italic">
                    Reason:
                  </span>
                  "{r.reason}"
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OvertimePanel;
