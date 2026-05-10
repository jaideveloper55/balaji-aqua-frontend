import { useState } from "react";
import { Select } from "antd";
import {
  HiOutlineDocumentDownload,
  HiOutlineDocumentReport,
  HiOutlineCash,
  HiOutlineArrowRight,
} from "react-icons/hi";
import dayjs from "dayjs";

interface MonthlyReport {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  workingDays: number;
  present: number;
  absent: number;
  leave: number;
  halfDay: number;
  late: number;
  otHours: number;
  payableDays: number;
  baseSalary: number;
  otAmount: number;
  totalPayable: number;
}

const SAMPLE_REPORTS: MonthlyReport[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    name: "Suresh Murugan",
    department: "Delivery",
    workingDays: 26,
    present: 25,
    absent: 0,
    leave: 1,
    halfDay: 0,
    late: 2,
    otHours: 8,
    payableDays: 25.5,
    baseSalary: 18000,
    otAmount: 900,
    totalPayable: 18900,
  },
  {
    id: "2",
    employeeId: "EMP-002",
    name: "Karthik Raja",
    department: "Delivery",
    workingDays: 26,
    present: 23,
    absent: 1,
    leave: 1,
    halfDay: 1,
    late: 3,
    otHours: 4,
    payableDays: 23.5,
    baseSalary: 16000,
    otAmount: 402,
    totalPayable: 14861.7,
  },
  {
    id: "3",
    employeeId: "EMP-003",
    name: "Vijay Prakash",
    department: "Delivery",
    workingDays: 26,
    present: 20,
    absent: 1,
    leave: 5,
    halfDay: 0,
    late: 0,
    otHours: 0,
    payableDays: 20,
    baseSalary: 16000,
    otAmount: 0,
    totalPayable: 12307.7,
  },
  {
    id: "4",
    employeeId: "EMP-004",
    name: "Arun Selvam",
    department: "Delivery",
    workingDays: 26,
    present: 24,
    absent: 2,
    leave: 0,
    halfDay: 0,
    late: 1,
    otHours: 12,
    payableDays: 24,
    baseSalary: 15600,
    otAmount: 1200,
    totalPayable: 15600,
  },
  {
    id: "5",
    employeeId: "EMP-005",
    name: "Rajesh Kumar",
    department: "Plant",
    workingDays: 26,
    present: 26,
    absent: 0,
    leave: 0,
    halfDay: 0,
    late: 0,
    otHours: 6,
    payableDays: 26,
    baseSalary: 22000,
    otAmount: 828,
    totalPayable: 22828,
  },
];

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const ReportsPanel = () => {
  const [month, setMonth] = useState(dayjs());

  const totalPayable = SAMPLE_REPORTS.reduce((s, r) => s + r.totalPayable, 0);
  const totalOT = SAMPLE_REPORTS.reduce((s, r) => s + r.otAmount, 0);
  const totalAbsent = SAMPLE_REPORTS.reduce((s, r) => s + r.absent, 0);
  const avgAttendance =
    SAMPLE_REPORTS.reduce((s, r) => s + (r.present / r.workingDays) * 100, 0) /
    SAMPLE_REPORTS.length;

  return (
    <div className="space-y-4">
      {/* Header with month selector */}
      <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white shadow-sm">
              <HiOutlineDocumentReport className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Monthly Report
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {month.format("MMMM YYYY")} Attendance Summary
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Ready for payroll integration & accounting export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              size="large"
              className="!w-44"
              value={month.format("YYYY-MM")}
              onChange={(v) => setMonth(dayjs(v))}
              options={Array.from({ length: 12 }, (_, i) => {
                const d = dayjs().subtract(i, "month");
                return {
                  value: d.format("YYYY-MM"),
                  label: d.format("MMMM YYYY"),
                };
              })}
            />
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
              <HiOutlineDocumentDownload className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Payable
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {formatINR(totalPayable)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {SAMPLE_REPORTS.length} employees
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            OT Cost
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {formatINR(totalOT)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {((totalOT / totalPayable) * 100).toFixed(1)}% of payroll
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg Attendance
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            {avgAttendance.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">All departments</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Absences
          </div>
          <div className="text-2xl font-bold text-red-700 mt-1">
            {totalAbsent}
          </div>
          <div className="text-xs text-slate-500 mt-1">days lost</div>
        </div>
      </div>

      {/* Integration alert */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-100">
          <HiOutlineCash className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-slate-900">
            Ready to send to Salary Management
          </div>
          <div className="text-xs text-slate-600 mt-0.5">
            All attendance data is reconciled and ready to be processed for{" "}
            {month.format("MMMM")} payroll.
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors">
          Push to Payroll
          <HiOutlineArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Detailed table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Employee-wise Breakdown
            </h3>
            <span className="text-xs text-slate-500">
              Showing {SAMPLE_REPORTS.length} employees
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/60 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Employee
                </th>
                <th className="text-center px-3 py-3 text-xs font-bold text-emerald-700 uppercase">
                  P
                </th>
                <th className="text-center px-3 py-3 text-xs font-bold text-red-700 uppercase">
                  A
                </th>
                <th className="text-center px-3 py-3 text-xs font-bold text-amber-700 uppercase">
                  HD
                </th>
                <th className="text-center px-3 py-3 text-xs font-bold text-blue-700 uppercase">
                  L
                </th>
                <th className="text-center px-3 py-3 text-xs font-bold text-orange-700 uppercase">
                  Late
                </th>
                <th className="text-center px-3 py-3 text-xs font-bold text-purple-700 uppercase">
                  OT (hrs)
                </th>
                <th className="text-center px-3 py-3 text-xs font-bold text-slate-700 uppercase">
                  Payable Days
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold text-emerald-700 uppercase">
                  Total Payable
                </th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_REPORTS.map((r) => {
                const attendance = (r.present / r.workingDays) * 100;
                return (
                  <tr
                    key={r.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 text-white text-sm font-bold flex items-center justify-center">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {r.name}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span className="font-mono">{r.employeeId}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                attendance >= 95
                                  ? "bg-emerald-100 text-emerald-700"
                                  : attendance >= 85
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {attendance.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-emerald-700">
                      {r.present}
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-red-700">
                      {r.absent || "—"}
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-amber-700">
                      {r.halfDay || "—"}
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-blue-700">
                      {r.leave || "—"}
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-orange-700">
                      {r.late || "—"}
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-purple-700">
                      {r.otHours || "—"}
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-slate-900">
                      {r.payableDays}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-emerald-700">
                        {formatINR(r.totalPayable)}
                      </div>
                      {r.otAmount > 0 && (
                        <div className="text-[10px] text-amber-600 font-medium">
                          + {formatINR(r.otAmount)} OT
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold">
              <tr>
                <td className="px-4 py-3 text-sm text-slate-700" colSpan={8}>
                  Total Payroll for {month.format("MMMM YYYY")}
                </td>
                <td className="px-4 py-3 text-right text-base text-emerald-700">
                  {formatINR(totalPayable)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPanel;
