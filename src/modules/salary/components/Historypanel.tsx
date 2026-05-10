import { useState } from "react";
import { Select } from "antd";
import {
  HiOutlineDocumentDownload,
  HiOutlineEye,
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineUserGroup,
  HiOutlineClock,
} from "react-icons/hi";
import dayjs from "dayjs";

interface HistoryRow {
  id: string;
  month: string;
  monthShort: string;
  totalEmployees: number;
  grossPayroll: number;
  totalDeductions: number;
  netPayroll: number;
  paidOn: string;
  processedBy: string;
  status: "completed" | "in_progress";
}

const HISTORY_DATA: HistoryRow[] = [
  {
    id: "H-1",
    month: "April 2026",
    monthShort: "Apr 2026",
    totalEmployees: 7,
    grossPayroll: 142128,
    totalDeductions: 16693,
    netPayroll: 125435,
    paidOn: "2026-05-01",
    processedBy: "Devaa Balaji",
    status: "completed",
  },
  {
    id: "H-2",
    month: "March 2026",
    monthShort: "Mar 2026",
    totalEmployees: 7,
    grossPayroll: 138400,
    totalDeductions: 15920,
    netPayroll: 122480,
    paidOn: "2026-04-01",
    processedBy: "Devaa Balaji",
    status: "completed",
  },
  {
    id: "H-3",
    month: "February 2026",
    monthShort: "Feb 2026",
    totalEmployees: 7,
    grossPayroll: 135200,
    totalDeductions: 15680,
    netPayroll: 119520,
    paidOn: "2026-03-01",
    processedBy: "Devaa Balaji",
    status: "completed",
  },
  {
    id: "H-4",
    month: "January 2026",
    monthShort: "Jan 2026",
    totalEmployees: 6,
    grossPayroll: 118400,
    totalDeductions: 13420,
    netPayroll: 104980,
    paidOn: "2026-02-01",
    processedBy: "Devaa Balaji",
    status: "completed",
  },
  {
    id: "H-5",
    month: "December 2025",
    monthShort: "Dec 2025",
    totalEmployees: 6,
    grossPayroll: 122000,
    totalDeductions: 13800,
    netPayroll: 108200,
    paidOn: "2026-01-01",
    processedBy: "Devaa Balaji",
    status: "completed",
  },
];

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (s: string) => dayjs(s).format("DD MMM YYYY");

const HistoryPanel = () => {
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = HISTORY_DATA.filter((h) =>
    yearFilter ? h.month.includes(yearFilter) : true
  );

  const yearTotal = filtered.reduce((s, r) => s + r.netPayroll, 0);
  const yearTotalEmployees = filtered.reduce(
    (s, r) => Math.max(s, r.totalEmployees),
    0
  );

  const handleView = (row: HistoryRow) => {
    showToast(`📋 Loading ${row.month} payroll details...`);
  };

  const handleExport = (row: HistoryRow) => {
    showToast(`📥 Exporting ${row.month} payroll as Excel...`);
  };

  const handleExportYear = () => {
    showToast(`📥 Exporting full year report as Excel...`);
  };

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        {/* Year summary */}
        <div className="bg-gradient-to-br from-indigo-50 via-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Total Salary Paid (Last 5 months)
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatINR(yearTotal)}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Across {filtered.length} payroll cycles · Up to{" "}
                {yearTotalEmployees} employees
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportYear}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-sm hover:bg-indigo-50 transition-colors"
            >
              <HiOutlineDocumentDownload className="w-3.5 h-3.5" />
              Export Year Report
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex items-center gap-3">
          <div className="flex-1 max-w-xs">
            <Select
              size="large"
              placeholder="Filter by year"
              className="w-full"
              allowClear
              value={yearFilter}
              onChange={(v) => setYearFilter(v ?? null)}
              options={[
                { value: "2026", label: "2026" },
                { value: "2025", label: "2025" },
              ]}
            />
          </div>
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-900">
              {filtered.length}
            </span>{" "}
            month{filtered.length !== 1 ? "s" : ""} · Total:{" "}
            <span className="font-semibold text-emerald-700">
              {formatINR(yearTotal)}
            </span>
          </div>
        </div>

        {/* History timeline */}
        <div className="space-y-3">
          {filtered.map((row, idx) => (
            <div
              key={row.id}
              className={`bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all ${
                idx === 0 ? "ring-1 ring-emerald-200" : ""
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 items-center">
                {/* Month */}
                <div className="lg:col-span-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center shadow-sm shrink-0">
                    <HiOutlineCalendar className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900">{row.month}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <HiOutlineClock className="w-3 h-3" />
                      Paid on {formatDate(row.paidOn)}
                    </div>
                    {idx === 0 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold mt-1">
                        ✓ Latest
                      </span>
                    )}
                  </div>
                </div>

                {/* Employees */}
                <div className="lg:col-span-2">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <HiOutlineUserGroup className="w-3 h-3" />
                    Employees
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {row.totalEmployees}
                  </div>
                </div>

                {/* Gross */}
                <div className="lg:col-span-2">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Gross
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {formatINR(row.grossPayroll)}
                  </div>
                  <div className="text-[10px] text-red-500 mt-0.5">
                    −{formatINR(row.totalDeductions)} deductions
                  </div>
                </div>

                {/* Net */}
                <div className="lg:col-span-3">
                  <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <HiOutlineCash className="w-3 h-3" />
                    Net Paid
                  </div>
                  <div className="text-xl font-bold text-emerald-700 mt-0.5">
                    {formatINR(row.netPayroll)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    by {row.processedBy}
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:col-span-2 flex items-center gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => handleView(row)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    <HiOutlineEye className="w-3.5 h-3.5" />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport(row)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 active:scale-95 transition-all"
                  >
                    <HiOutlineDocumentDownload className="w-3.5 h-3.5" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HistoryPanel;
