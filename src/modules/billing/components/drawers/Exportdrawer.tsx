import React, { useState, useMemo } from "react";
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
import { Invoice, PaymentEntry, Customer } from "../../types/billing";
import { formatCurrency } from "../../utils/Helpers";
import { COMPANY_INFO } from "../../constants/Mockdata";
import {
  exportInvoicesToPDF,
  exportPaymentsToPDF,
  exportOutstandingToPDF,
  exportDailySummaryToPDF,
  exportInvoicesToCSV,
  exportPaymentsToCSV,
  exportOutstandingToCSV,
  filterByDateRange,
} from "../../utils/ExportHelpers";

const { RangePicker } = DatePicker;

type ReportType = "invoices" | "payments" | "outstanding" | "summary";
type FormatType = "pdf" | "excel";

interface Props {
  open: boolean;
  onClose: () => void;
  invoices: Invoice[];
  payments: PaymentEntry[];
  customers: Customer[];
  defaultReportType?: ReportType;
}

const REPORTS: {
  key: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
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
    title: "Daily Summary",
    description: "Today's collection breakdown by mode",
    icon: <HiOutlineChartBar className="w-5 h-5" />,
    color: "purple",
    supportsDateRange: false,
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
  invoices,
  payments,
  customers,
  defaultReportType = "invoices",
}) => {
  const [reportType, setReportType] = useState<ReportType>(defaultReportType);
  const [format, setFormat] = useState<FormatType>("pdf");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >([dayjs().startOf("month"), dayjs().endOf("day")]);
  const [activePreset, setActivePreset] = useState<string>("This month");
  const [isExporting, setIsExporting] = useState(false);

  const currentReport = REPORTS.find((r) => r.key === reportType)!;

  const fromDate = dateRange?.[0]?.toDate() ?? null;
  const toDate = dateRange?.[1]?.toDate() ?? null;

  const previewCount = useMemo(() => {
    if (reportType === "invoices") {
      return currentReport.supportsDateRange
        ? filterByDateRange(invoices, fromDate, toDate).length
        : invoices.length;
    }
    if (reportType === "payments") {
      return currentReport.supportsDateRange
        ? filterByDateRange(payments, fromDate, toDate).length
        : payments.length;
    }
    if (reportType === "outstanding") {
      return customers.filter((c) => c.outstanding > 0).length;
    }
    return 0;
  }, [
    reportType,
    fromDate,
    toDate,
    invoices,
    payments,
    customers,
    currentReport,
  ]);

  const previewTotal = useMemo(() => {
    if (reportType === "invoices") {
      const filtered = currentReport.supportsDateRange
        ? filterByDateRange(invoices, fromDate, toDate)
        : invoices;
      return filtered.reduce((s, i) => s + i.grandTotal, 0);
    }
    if (reportType === "payments") {
      const filtered = currentReport.supportsDateRange
        ? filterByDateRange(payments, fromDate, toDate)
        : payments;
      return filtered.reduce((s, p) => s + p.amount, 0);
    }
    if (reportType === "outstanding") {
      return customers
        .filter((c) => c.outstanding > 0)
        .reduce((s, c) => s + c.outstanding, 0);
    }
    return 0;
  }, [
    reportType,
    fromDate,
    toDate,
    invoices,
    payments,
    customers,
    currentReport,
  ]);

  const handlePresetClick = (preset: (typeof PRESET_RANGES)[0]) => {
    setActivePreset(preset.label);
    setDateRange(preset.getRange());
  };

  const handleExport = () => {
    if (previewCount === 0 && reportType !== "summary") {
      message.warning("No data to export for the selected range");
      return;
    }

    setIsExporting(true);
    setTimeout(() => {
      try {
        const opts = currentReport.supportsDateRange
          ? { fromDate, toDate }
          : {};

        if (reportType === "invoices") {
          if (format === "pdf") exportInvoicesToPDF(invoices, opts);
          else exportInvoicesToCSV(invoices, opts);
        } else if (reportType === "payments") {
          if (format === "pdf") exportPaymentsToPDF(payments, opts);
          else exportPaymentsToCSV(payments, opts);
        } else if (reportType === "outstanding") {
          if (format === "pdf") exportOutstandingToPDF(customers);
          else exportOutstandingToCSV(customers);
        } else if (reportType === "summary") {
          const today = new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          const todayInvoices = invoices.filter(
            (i) => i.date === today || i.date === "25 Apr 2026"
          );
          const todayPayments = payments.filter(
            (p) => p.date === today || p.date === "25 Apr 2026"
          );
          exportDailySummaryToPDF(todayInvoices, todayPayments, today);
        }
        message.success(`${currentReport.title} exported successfully`);
        onClose();
      } catch (err) {
        console.error(err);
        message.error("Export failed. Please try again.");
      } finally {
        setIsExporting(false);
      }
    }, 600);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={500}
      title={
        <div className="flex items-center gap-2">
          <HiOutlineDownload className="w-5 h-5 text-emerald-600" />
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

        {/* Step 2: Date range */}
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
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
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
              onClick={() => setFormat("excel")}
              className={`p-3 rounded-xl border-2 transition-all text-left
                ${
                  format === "excel"
                    ? "border-emerald-300 bg-emerald-50/50 ring-4 ring-emerald-100"
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }
                ${
                  reportType === "summary"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              disabled={reportType === "summary"}
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
                    {reportType === "summary"
                      ? "Not available"
                      : "Analyze in Excel"}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <HiOutlineDocumentText className="w-4 h-4 text-gray-500" />
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              Preview
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
                  {dayjs(fromDate).format("DD MMM")} —{" "}
                  {dayjs(toDate).format("DD MMM YYYY")}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500">
                {reportType === "summary" ? "Type" : "Records"}
              </span>
              <span className="font-semibold text-gray-800">
                {reportType === "summary"
                  ? "Today's snapshot"
                  : `${previewCount} entries`}
              </span>
            </div>
            {reportType !== "summary" && (
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">
                  {reportType === "outstanding" ? "Total Due" : "Total Value"}
                </span>
                <span className="font-bold text-emerald-600">
                  {formatCurrency(previewTotal)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500">Format</span>
              <span className="font-semibold text-gray-800 uppercase">
                {format}
              </span>
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
            disabled={
              isExporting || (previewCount === 0 && reportType !== "summary")
            }
            className={`flex-1 py-2.5 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all
              ${
                isExporting || (previewCount === 0 && reportType !== "summary")
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 active:scale-[0.98]"
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
            Reports include {COMPANY_INFO.name} branding and are watermarked as
            confidential
          </p>
        </div>
      </div>
    </Drawer>
  );
};

export default ExportDrawer;
