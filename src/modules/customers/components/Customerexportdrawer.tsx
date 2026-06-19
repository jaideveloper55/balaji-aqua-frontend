import React, { useState } from "react";
import { Drawer, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineDownload,
  HiOutlineDocumentText,
  HiOutlineUsers,
} from "react-icons/hi";
import { HiDocumentArrowDown, HiTableCells } from "react-icons/hi2";
import { getCustomersApi } from "../api/customers.api";
import type { Customer } from "../types/Customer";
import {
  ExportableCustomer,
  generateCustomerListPDF,
  generateCustomerListCSV,
} from "../utils/customerGenerators";

type FormatType = "pdf" | "csv";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedCustomers?: Customer[]; // pre-selected from table; if empty, fetch all
}

const CustomerExportDrawer: React.FC<Props> = ({
  open,
  onClose,
  selectedCustomers = [],
}) => {
  const [format, setFormat] = useState<FormatType>("pdf");
  const [isExporting, setIsExporting] = useState(false);

  const hasSelection = selectedCustomers.length > 0;

  // Only fetch all customers when drawer is open AND no rows are pre-selected
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["customers-for-export", open],
    queryFn: () =>
      getCustomersApi({ page: 1, limit: 500 }).then((res) => res.data),
    enabled: open && !hasSelection,
    staleTime: 0,
    gcTime: 0,
  });

  // Use selected rows if available, otherwise fall back to full fetch
  const customers: ExportableCustomer[] = hasSelection
    ? (selectedCustomers as ExportableCustomer[])
    : Array.isArray(rawData)
    ? rawData
    : rawData?.data ?? [];

  const recordCount = customers.length;
  const loading = !hasSelection && isLoading;

  const handleExport = async () => {
    if (recordCount === 0) {
      message.warning("No customers to export");
      return;
    }
    setIsExporting(true);
    try {
      if (format === "pdf") {
        await generateCustomerListPDF(customers);
      } else {
        generateCustomerListCSV(customers);
      }
      message.success(
        `${recordCount} customer${recordCount > 1 ? "s" : ""} exported`
      );
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
      width={420}
      title={
        <div className="flex items-center gap-2">
          <HiOutlineDownload className="w-5 h-5 text-blue-600" />
          <span>Export Customers</span>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Report type */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            Report
          </label>
          <div className="flex items-start gap-3 p-3 rounded-xl border-2 border-blue-200 bg-blue-50 ring-4 ring-blue-100">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
              <HiOutlineUsers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-blue-600">
                Customer List
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                {hasSelection
                  ? `${selectedCustomers.length} selected customer${
                      selectedCustomers.length > 1 ? "s" : ""
                    }`
                  : "All customers with contact info, type, status & outstanding balance"}
              </div>
            </div>
          </div>

          {/* Selection/All toggle hint */}
          {hasSelection && (
            <p className="text-[11px] text-blue-500 mt-2 font-medium">
              ✓ Exporting your {selectedCustomers.length} selected customers.
              Close and deselect all to export the full list.
            </p>
          )}
        </div>

        {/* Format */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            Format
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
              <span className="font-semibold text-gray-800">Customer List</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500">Scope</span>
              <span className="font-semibold text-gray-800">
                {hasSelection
                  ? `${selectedCustomers.length} selected`
                  : "All customers"}
              </span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500">Records</span>
              <span
                className={`font-semibold ${
                  loading
                    ? "text-gray-400"
                    : recordCount === 0
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                {loading ? "Loading..." : recordCount}
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
            disabled={isExporting || loading || recordCount === 0}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all
              ${
                isExporting || loading || recordCount === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-[0.98]"
              }`}
          >
            {isExporting || loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {loading ? "Loading..." : "Generating..."}
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

export default CustomerExportDrawer;
