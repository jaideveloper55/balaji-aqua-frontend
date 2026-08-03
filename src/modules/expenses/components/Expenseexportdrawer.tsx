import React, { useState } from "react";
import { Drawer, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  HiOutlineDownload,
  HiOutlineDocumentReport,
  HiOutlineCash,
  HiOutlineTag,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineX,
  HiOutlineTable,
  HiOutlineDocumentText,
} from "react-icons/hi";

const { RangePicker } = DatePicker;

import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import { ReportType, exportExpenseReport } from "./expenseExportUtils";

// ─────────────────────────────────────────────────────────────────────────────
// REPORT TYPES
// ─────────────────────────────────────────────────────────────────────────────
const REPORT_TYPES = [
  {
    key: "expense_summary",
    label: "Expense Summary",
    description: "All expenses with totals, categories & payment modes",
    icon: <HiOutlineDocumentReport size={22} />,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    borderActive: "border-rose-500 bg-rose-50/60",
  },
  {
    key: "category_report",
    label: "Category Report",
    description: "Spending breakdown by category with budget vs actual",
    icon: <HiOutlineTag size={22} />,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    borderActive: "border-purple-500 bg-purple-50/60",
  },
  {
    key: "vendor_report",
    label: "Vendor Report",
    description: "Payments per vendor with outstanding dues",
    icon: <HiOutlineUserGroup size={22} />,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    borderActive: "border-blue-500 bg-blue-50/60",
  },
  {
    key: "petty_cash",
    label: "Petty Cash Log",
    description: "Cash in / out transactions with running balance",
    icon: <HiOutlineCash size={22} />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderActive: "border-emerald-500 bg-emerald-50/60",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DATE PRESETS
// ─────────────────────────────────────────────────────────────────────────────
const PRESETS = [
  { label: "Today", range: (): [Dayjs, Dayjs] => [dayjs(), dayjs()] },
  {
    label: "Yesterday",
    range: (): [Dayjs, Dayjs] => [
      dayjs().subtract(1, "day"),
      dayjs().subtract(1, "day"),
    ],
  },
  {
    label: "Last 7 days",
    range: (): [Dayjs, Dayjs] => [dayjs().subtract(6, "day"), dayjs()],
  },
  {
    label: "Last 30 days",
    range: (): [Dayjs, Dayjs] => [dayjs().subtract(29, "day"), dayjs()],
  },
  {
    label: "This month",
    range: (): [Dayjs, Dayjs] => [dayjs().startOf("month"), dayjs()],
  },
  {
    label: "Last month",
    range: (): [Dayjs, Dayjs] => [
      dayjs().subtract(1, "month").startOf("month"),
      dayjs().subtract(1, "month").endOf("month"),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  open: boolean;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const ExpenseExportDrawer: React.FC<Props> = ({ open, onClose }) => {
  const [reportType, setReportType] = useState("expense_summary");
  const [format, setFormat] = useState<"pdf" | "excel">("pdf");
  const [activePreset, setActivePreset] = useState("This month");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs(),
  ]);
  const [isExporting, setIsExporting] = useState(false);

  const selectedReport = REPORT_TYPES.find((r) => r.key === reportType)!;

  const handlePreset = (preset: (typeof PRESETS)[0]) => {
    setActivePreset(preset.label);
    setDateRange(preset.range());
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportExpenseReport({
        reportType: reportType as ReportType,
        format,
        fromDate: dateRange[0].format("YYYY-MM-DD"),
        toDate: dateRange[1].format("YYYY-MM-DD"),
        companyName: "Balaji Aqua Water Plant",
      });
      successNotification(
        "Export Complete",
        `${result.rowCount} row(s) exported to ${
          format === "pdf" ? "PDF" : "Excel"
        }`
      );
      onClose();
    } catch (err: any) {
      errorNotification(
        "Export Failed",
        err?.message ?? "Could not generate report"
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={440}
      closable={false}
      styles={{ body: { padding: 0 }, header: { display: "none" } }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-50">
              <HiOutlineDownload size={20} className="text-rose-600" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-slate-900">
                Export Report
              </h2>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Download expense data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <HiOutlineX size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* 1. Report type */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              1. Select Report
            </p>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_TYPES.map((r) => {
                const isActive = reportType === r.key;
                return (
                  <button
                    key={r.key}
                    onClick={() => setReportType(r.key)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${
                      isActive
                        ? r.borderActive
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg ${r.iconBg} ${r.iconColor} flex items-center justify-center mb-2`}
                    >
                      {r.icon}
                    </div>
                    <div
                      className={`text-[13px] font-bold ${
                        isActive ? "text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {r.label}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      {r.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Date range */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              2. Date Range
            </p>
            {/* Preset chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                    activePreset === p.label
                      ? "bg-rose-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {/* Custom range picker */}
            <RangePicker
              value={dateRange}
              onChange={(vals) => {
                if (vals?.[0] && vals?.[1]) {
                  setDateRange([vals[0], vals[1]]);
                  setActivePreset(""); // clear preset highlight
                }
              }}
              format="DD MMM YYYY"
              className="w-full"
              allowClear={false}
            />
          </div>

          {/* 3. Format */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              3. Format
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat("pdf")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  format === "pdf"
                    ? "border-rose-500 bg-rose-50/60"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <HiOutlineDocumentText
                  size={24}
                  className={
                    format === "pdf" ? "text-rose-600" : "text-slate-400"
                  }
                />
                <div className="text-left">
                  <div
                    className={`text-[13px] font-bold ${
                      format === "pdf" ? "text-rose-700" : "text-slate-700"
                    }`}
                  >
                    PDF
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Print & share
                  </div>
                </div>
              </button>

              <button
                onClick={() => setFormat("excel")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  format === "excel"
                    ? "border-emerald-500 bg-emerald-50/60"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <HiOutlineTable
                  size={22}
                  className={
                    format === "excel" ? "text-emerald-600" : "text-slate-400"
                  }
                />
                <div className="text-left">
                  <div
                    className={`text-[13px] font-bold ${
                      format === "excel" ? "text-emerald-700" : "text-slate-700"
                    }`}
                  >
                    Excel / CSV
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Analyse in Excel
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Export details preview */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-slate-100/60">
              <HiOutlineChartBar size={14} className="text-slate-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Export Details
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { label: "Report", value: selectedReport.label },
                {
                  label: "Date Range",
                  value: `${dateRange[0].format(
                    "DD MMM"
                  )} — ${dateRange[1].format("DD MMM YYYY")}`,
                },
                {
                  label: "Format",
                  value: format === "pdf" ? "PDF" : "Excel / CSV",
                },
                { label: "Source", value: "Balaji Aqua Water Plant" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <span className="text-[12px] text-slate-500">
                    {row.label}
                  </span>
                  <span className="text-[12px] font-semibold text-slate-800">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer — sticky export button */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[14px] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-rose-200"
          >
            {isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <HiOutlineDownload size={17} />
                Export {format === "pdf" ? "PDF" : "Excel"}
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            Report will be generated from your expense records
          </p>
        </div>
      </div>
    </Drawer>
  );
};

export default ExpenseExportDrawer;
