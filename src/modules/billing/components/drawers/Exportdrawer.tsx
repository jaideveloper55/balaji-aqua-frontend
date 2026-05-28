import React, { useState, useEffect } from "react";
import { Drawer, DatePicker, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  HiOutlineDownload,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineCash,
  HiOutlineExclamation,
  HiOutlineChartBar,
} from "react-icons/hi";
import { HiDocumentArrowDown, HiTableCells } from "react-icons/hi2";
import { COMPANY_INFO } from "../../constants/Mockdata";
import { billingApi, ExportFilters } from "../../api/billing.api";

const { RangePicker } = DatePicker;

type ReportType = "invoices" | "payments" | "outstanding" | "summary";
type FormatType = "pdf" | "csv";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultReportType?: ReportType;
}

const REPORTS: {
  key: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "purple";
  supportsDateRange: boolean;
}[] = [
  {
    key: "invoices",
    title: "Invoice Report",
    description: "All invoices with totals, payments & balances",
    icon: <HiOutlineClipboardList className="w-5 h-5" />,
    color: "blue",
    supportsDateRange: true,
  },
  {
    key: "payments",
    title: "Payment Report",
    description: "Cash, UPI, bank receipts with references",
    icon: <HiOutlineCash className="w-5 h-5" />,
    color: "green",
    supportsDateRange: true,
  },
  {
    key: "outstanding",
    title: "Outstanding Report",
    description: "Customers with pending dues, sorted by risk",
    icon: <HiOutlineExclamation className="w-5 h-5" />,
    color: "red",
    supportsDateRange: false,
  },
  {
    key: "summary",
    title: "Collection Summary",
    description: "Period collection breakdown by mode",
    icon: <HiOutlineChartBar className="w-5 h-5" />,
    color: "purple",
    supportsDateRange: true,
  },
];

const PRESET_RANGES = [
  {
    label: "Today",
    getRange: () =>
      [dayjs().startOf("day"), dayjs().endOf("day")] as [Dayjs, Dayjs],
  },
  {
    label: "Yesterday",
    getRange: () =>
      [
        dayjs().subtract(1, "day").startOf("day"),
        dayjs().subtract(1, "day").endOf("day"),
      ] as [Dayjs, Dayjs],
  },
  {
    label: "Last 7 days",
    getRange: () =>
      [dayjs().subtract(6, "day").startOf("day"), dayjs().endOf("day")] as [
        Dayjs,
        Dayjs
      ],
  },
  {
    label: "Last 30 days",
    getRange: () =>
      [dayjs().subtract(29, "day").startOf("day"), dayjs().endOf("day")] as [
        Dayjs,
        Dayjs
      ],
  },
  {
    label: "This month",
    getRange: () =>
      [dayjs().startOf("month"), dayjs().endOf("month")] as [Dayjs, Dayjs],
  },
  {
    label: "Last month",
    getRange: () =>
      [
        dayjs().subtract(1, "month").startOf("month"),
        dayjs().subtract(1, "month").endOf("month"),
      ] as [Dayjs, Dayjs],
  },
];
const colorClasses: Record<
  string,
  { bg: string; text: string; border: string; ring: string }
> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    ring: "ring-blue-100",
  },
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    ring: "ring-emerald-100",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    ring: "ring-red-100",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    ring: "ring-purple-100",
  },
};

const ExportDrawer: React.FC<Props> = ({
  open,
  onClose,
  defaultReportType = "invoices",
}) => {
  const [reportType, setReportType] = useState<ReportType>(defaultReportType);
  const [format, setFormat] = useState<FormatType>("pdf");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >([dayjs().startOf("month"), dayjs().endOf("day")]);
  const [activePreset, setActivePreset] = useState<string>("This month");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (open) {
      setReportType(defaultReportType);
    }
  }, [open, defaultReportType]);

  const currentReport = REPORTS.find((r) => r.key === reportType)!;

  const fromDate = dateRange?.[0] ?? null;
  const toDate = dateRange?.[1] ?? null;

  const handlePresetClick = (preset: (typeof PRESET_RANGES)[0]) => {
    setActivePreset(preset.label);
    setDateRange(preset.getRange());
  };

  // ── Trigger browser download from a Blob ─────────────────────────────────
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filters: ExportFilters = { format };
      if (currentReport.supportsDateRange) {
        if (fromDate) filters.dateFrom = fromDate.format("YYYY-MM-DD");
        if (toDate) filters.dateTo = toDate.format("YYYY-MM-DD");
      }

      let blob: Blob;
      if (reportType === "invoices") {
        blob = await billingApi.exportInvoices(filters);
      } else if (reportType === "payments") {
        blob = await billingApi.exportPayments(filters);
      } else if (reportType === "outstanding") {
        blob = await billingApi.exportOutstanding({ format });
      } else {
        blob = await billingApi.exportDailySummary(filters);
      }

      const timestamp = dayjs().format("YYYYMMDD_HHmmss");
      downloadBlob(blob, `${reportType}_${timestamp}.${format}`);

      message.success(`${currentReport.title} downloaded`);
      onClose();
    } catch (err: any) {
      console.error(err);
      // If the backend returned a JSON error inside the blob, try to read it
      if (err?.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          message.error(parsed.message ?? "Export failed");
        } catch {
          message.error("Export failed. Please try again.");
        }
      } else {
        message.error(err?.message ?? "Export failed. Please try again.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={500}
      title={
        <div className="flex items-center gap-2">
          <HiOutlineDownload className="w-5 h-5 text-blue-600" />
          <span>Export Report</span>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Step 1: Report type */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            1. Select Report
          </label>
          <div className="grid grid-cols-2 gap-2">
            {REPORTS.map((r) => {
              const c = colorClasses[r.color];
              const isActive = reportType === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => setReportType(r.key)}
                  className={`text-left p-3 rounded-xl border-2 transition-all
                    ${
                      isActive
                        ? `${c.border} ${c.bg} ring-4 ${c.ring}`
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${c.bg} ${c.text}`}
                  >
                    {r.icon}
                  </div>
                  <div
                    className={`text-[13px] font-semibold ${
                      isActive ? c.text : "text-gray-800"
                    }`}
                  >
                    {r.title}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                    {r.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Date range (only if the report supports it) */}
        {currentReport.supportsDateRange && (
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              2. Date Range
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {PRESET_RANGES.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors
                    ${
                      activePreset === preset.label
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200"
                    }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                setDateRange(dates);
                setActivePreset("");
              }}
              format="DD MMM YYYY"
              size="middle"
              className="w-full"
              suffixIcon={
                <HiOutlineCalendar className="w-4 h-4 text-gray-400" />
              }
            />
          </div>
        )}

        {/* Step 3: Format */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            {currentReport.supportsDateRange ? "3" : "2"}. Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFormat("pdf")}
              className={`p-3 rounded-xl border-2 transition-all text-left
                ${
                  format === "pdf"
                    ? "border-red-300 bg-red-50/50 ring-4 ring-red-100"
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <HiDocumentArrowDown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-gray-800">
                    PDF
                  </div>
                  <div className="text-[10px] text-gray-500">Print & share</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setFormat("csv")}
              className={`p-3 rounded-xl border-2 transition-all text-left
                ${
                  format === "csv"
                    ? "border-emerald-300 bg-emerald-50/50 ring-4 ring-emerald-100"
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <HiTableCells className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-gray-800">
                    Excel / CSV
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Analyze in Excel
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Preview — shows only what we know without hitting the server */}
        <div className="bg-gradient-to-br from-blue-50/40 to-gray-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <HiOutlineDocumentText className="w-4 h-4 text-blue-500" />
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              Export Details
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500">Report</span>
              <span className="font-semibold text-gray-800">
                {currentReport.title}
              </span>
            </div>
            {currentReport.supportsDateRange && fromDate && toDate && (
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">Date Range</span>
                <span className="font-semibold text-gray-800">
                  {fromDate.format("DD MMM")} — {toDate.format("DD MMM YYYY")}
                </span>
              </div>
            )}
            {!currentReport.supportsDateRange && (
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">Scope</span>
                <span className="font-semibold text-gray-800">
                  All active customers
                </span>
              </div>
            )}
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500">Format</span>
              <span className="font-semibold text-gray-800 uppercase">
                {format}
              </span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500">Source</span>
              <span className="font-semibold text-gray-800">Live (server)</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all
              ${
                isExporting
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-[0.98]"
              }`}
          >
            {isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <HiOutlineDownload className="w-4 h-4" />
                Download {format.toUpperCase()}
              </>
            )}
          </button>
        </div>

        <div className="text-center pt-1">
          <p className="text-[10px] text-gray-400">
            Reports include {COMPANY_INFO.name} branding and are pulled live
            from the server
          </p>
        </div>
      </div>
    </Drawer>
  );
};

export default ExportDrawer;
