import React, { useState } from "react";
import { Drawer, message } from "antd";
import {
  HiOutlineDownload,
  HiOutlineDocumentText,
  HiOutlineCube,
  HiOutlineBell,
  HiOutlineSwitchHorizontal,
} from "react-icons/hi";
import { HiDocumentArrowDown, HiTableCells } from "react-icons/hi2";

import type { StockItem, StockMovement } from "../types/Inventory";
import type { LowStockRow } from "../api/inventory.api";
import {
  generateStockListPDF,
  generateStockListCSV,
  generateLowStockPDF,
  generateLowStockCSV,
  generateMovementsPDF,
  generateMovementsCSV,
} from "../utils/inventoryGenerators";

type ReportType = "stock" | "alerts" | "movements";
type FormatType = "pdf" | "csv";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultReportType?: ReportType;
  stockItems: StockItem[];
  lowStockItems: LowStockRow[];
  movements: StockMovement[];
}

const REPORTS: {
  key: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "red" | "purple";
}[] = [
  {
    key: "stock",
    title: "Stock List",
    description: "Current inventory levels across all products",
    icon: <HiOutlineCube className="w-5 h-5" />,
    color: "blue",
  },
  {
    key: "alerts",
    title: "Low Stock Alerts",
    description: "Items below reorder level, sorted by severity",
    icon: <HiOutlineBell className="w-5 h-5" />,
    color: "red",
  },
  {
    key: "movements",
    title: "Movement History",
    description: "Full audit trail of stock in / out / adjustments",
    icon: <HiOutlineSwitchHorizontal className="w-5 h-5" />,
    color: "purple",
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

const InventoryExportDrawer: React.FC<Props> = ({
  open,
  onClose,
  defaultReportType = "stock",
  stockItems,
  lowStockItems,
  movements,
}) => {
  const [reportType, setReportType] = useState<ReportType>(defaultReportType);
  const [format, setFormat] = useState<FormatType>("pdf");
  const [isExporting, setIsExporting] = useState(false);

  const currentReport = REPORTS.find((r) => r.key === reportType)!;

  const recordCount =
    reportType === "stock"
      ? stockItems.length
      : reportType === "alerts"
      ? lowStockItems.length
      : movements.length;

  const handleExport = () => {
    if (recordCount === 0) {
      message.warning("Nothing to export for this report");
      return;
    }

    setIsExporting(true);
    try {
      if (reportType === "stock") {
        format === "pdf"
          ? generateStockListPDF(stockItems)
          : generateStockListCSV(stockItems);
      } else if (reportType === "alerts") {
        format === "pdf"
          ? generateLowStockPDF(lowStockItems)
          : generateLowStockCSV(lowStockItems);
      } else {
        format === "pdf"
          ? generateMovementsPDF(movements)
          : generateMovementsCSV(movements);
      }
      message.success(`${currentReport.title} exported`);
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={460}
      title={
        <div className="flex items-center gap-2">
          <HiOutlineDownload className="w-5 h-5 text-blue-600" />
          <span>Export Inventory Report</span>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Step 1: Report type */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            1. Select Report
          </label>
          <div className="flex flex-col gap-2">
            {REPORTS.map((r) => {
              const c = colorClasses[r.color];
              const isActive = reportType === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => setReportType(r.key)}
                  className={`text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3
                    ${
                      isActive
                        ? `${c.border} ${c.bg} ring-4 ${c.ring}`
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${c.bg} ${c.text}`}
                  >
                    {r.icon}
                  </div>
                  <div>
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
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Format */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            2. Format
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

        {/* Preview */}
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
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500">Records</span>
              <span
                className={`font-semibold ${
                  recordCount === 0 ? "text-red-500" : "text-gray-800"
                }`}
              >
                {recordCount}
              </span>
            </div>
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
            disabled={isExporting || recordCount === 0}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all
              ${
                isExporting || recordCount === 0
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
      </div>
    </Drawer>
  );
};

export default InventoryExportDrawer;
