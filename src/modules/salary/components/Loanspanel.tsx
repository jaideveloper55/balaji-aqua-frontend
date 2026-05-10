// src/modules/salary/components/LoansPanel.tsx

import { useState } from "react";
import {
  HiOutlineCreditCard,
  HiOutlineCash,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlinePlus,
  HiOutlineCalendar,
} from "react-icons/hi";

interface LoanRow {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  loanAmount: number;
  amountPaid: number;
  emi: number;
  startDate: string;
  monthsTotal: number;
  monthsPaid: number;
  status: "active" | "closed" | "defaulted";
  reason: string;
  type: "loan" | "advance";
}

const SAMPLE_LOANS: LoanRow[] = [
  {
    id: "L-001",
    employeeId: "EMP-002",
    name: "Karthik Raja",
    designation: "Driver",
    loanAmount: 15000,
    amountPaid: 6000,
    emi: 1500,
    startDate: "2026-02-01",
    monthsTotal: 10,
    monthsPaid: 4,
    status: "active",
    reason: "Family medical emergency",
    type: "loan",
  },
  {
    id: "L-002",
    employeeId: "EMP-004",
    name: "Arun Selvam",
    designation: "Loader",
    loanAmount: 5000,
    amountPaid: 5000,
    emi: 1000,
    startDate: "2025-12-01",
    monthsTotal: 5,
    monthsPaid: 5,
    status: "closed",
    reason: "Festival expenses",
    type: "advance",
  },
  {
    id: "L-003",
    employeeId: "EMP-007",
    name: "Anand S.",
    designation: "Plant Operator",
    loanAmount: 25000,
    amountPaid: 10000,
    emi: 2500,
    startDate: "2026-01-01",
    monthsTotal: 10,
    monthsPaid: 4,
    status: "active",
    reason: "Home renovation",
    type: "loan",
  },
  {
    id: "L-004",
    employeeId: "EMP-001",
    name: "Suresh Murugan",
    designation: "Senior Driver",
    loanAmount: 3000,
    amountPaid: 0,
    emi: 1000,
    startDate: "2026-05-01",
    monthsTotal: 3,
    monthsPaid: 0,
    status: "active",
    reason: "Travel expenses",
    type: "advance",
  },
];

const STATUS_META: Record<
  string,
  { label: string; bg: string; color: string; dot: string }
> = {
  active: {
    label: "Active",
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
    dot: "bg-blue-500",
  },
  closed: {
    label: "Closed",
    bg: "bg-emerald-50 border-emerald-200",
    color: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  defaulted: {
    label: "Defaulted",
    bg: "bg-red-50 border-red-200",
    color: "text-red-700",
    dot: "bg-red-500",
  },
};

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const LoansPanel = () => {
  const [filter, setFilter] = useState<string>("all");

  const filtered = SAMPLE_LOANS.filter((l) =>
    filter === "all" ? true : filter === l.type || filter === l.status
  );

  // stats
  const totalDisbursed = SAMPLE_LOANS.reduce((s, l) => s + l.loanAmount, 0);
  const totalRecovered = SAMPLE_LOANS.reduce((s, l) => s + l.amountPaid, 0);
  const totalOutstanding = totalDisbursed - totalRecovered;
  const activeLoans = SAMPLE_LOANS.filter((l) => l.status === "active").length;
  const monthlyEMICollection = SAMPLE_LOANS.filter(
    (l) => l.status === "active"
  ).reduce((s, l) => s + l.emi, 0);

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <HiOutlineCreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Total Disbursed
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">
            {formatINR(totalDisbursed)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {SAMPLE_LOANS.length} loans
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100">
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Recovered
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-2">
            {formatINR(totalRecovered)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {((totalRecovered / totalDisbursed) * 100).toFixed(0)}% recovered
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100">
              <HiOutlineExclamation className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Outstanding
            </div>
          </div>
          <div className="text-xl font-bold text-amber-700 mt-2">
            {formatINR(totalOutstanding)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {activeLoans} active loans
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-200">
              <HiOutlineCash className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Monthly EMI Recovery
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-800 mt-2">
            {formatINR(monthlyEMICollection)}
          </div>
          <div className="text-xs text-emerald-700 mt-1">From salary</div>
        </div>
      </div>

      {/* Filter + Add */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { key: "all", label: "All", count: SAMPLE_LOANS.length },
            {
              key: "active",
              label: "Active",
              count: SAMPLE_LOANS.filter((l) => l.status === "active").length,
            },
            {
              key: "closed",
              label: "Closed",
              count: SAMPLE_LOANS.filter((l) => l.status === "closed").length,
            },
            {
              key: "loan",
              label: "Loans",
              count: SAMPLE_LOANS.filter((l) => l.type === "loan").length,
            },
            {
              key: "advance",
              label: "Advances",
              count: SAMPLE_LOANS.filter((l) => l.type === "advance").length,
            },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f.key
                  ? "bg-emerald-600 text-white shadow-sm"
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

        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-md hover:bg-emerald-700 transition-all">
          <HiOutlinePlus className="w-3.5 h-3.5" />
          Issue Loan / Advance
        </button>
      </div>

      {/* Loan cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((l) => {
          const status = STATUS_META[l.status];
          const progress = (l.amountPaid / l.loanAmount) * 100;
          const remaining = l.loanAmount - l.amountPaid;

          return (
            <div
              key={l.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 text-white font-bold flex items-center justify-center shadow-sm shrink-0">
                      {l.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">
                        {l.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span className="font-mono">{l.id}</span>
                        <span>•</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            l.type === "loan"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {l.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${status.bg} ${status.color}`}
                  >
                    <span className={`w-1 h-1 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">
                      Paid: {formatINR(l.amountPaid)}
                    </span>
                    <span className="font-bold text-slate-700">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        l.status === "closed"
                          ? "bg-emerald-500"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      Total Loan
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {formatINR(l.loanAmount)}
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2">
                    <div className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">
                      Outstanding
                    </div>
                    <div className="text-sm font-bold text-amber-800 mt-0.5">
                      {formatINR(remaining)}
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2">
                    <div className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                      Monthly EMI
                    </div>
                    <div className="text-sm font-bold text-emerald-800 mt-0.5">
                      {formatINR(l.emi)}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-dashed border-slate-200 text-xs">
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="flex items-center gap-1">
                      <HiOutlineCalendar className="w-3 h-3" />
                      {new Date(l.startDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>
                      {l.monthsPaid} / {l.monthsTotal} months
                    </span>
                  </div>
                  <span className="text-slate-500 italic truncate max-w-[180px]">
                    "{l.reason}"
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoansPanel;
