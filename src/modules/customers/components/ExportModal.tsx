import React, { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineDocumentDownload,
  HiOutlineDownload,
  HiOutlineX,
  HiOutlineCheck,
} from "react-icons/hi";

import type { ExportFormValues, LedgerEntry } from "../types/Customer";
import {
  EXPORT_TYPE_OPTIONS,
  EXPORT_FORMAT_OPTIONS,
} from "../constants/ledgerConstants";
import {
  generateLedgerPDF,
  generateLedgerCSV,
} from "../../../utils/generators";
import CustomDateRange from "../../../components/common/CustomDateRange";
import CustomSelect from "../../../components/common/CustomSelect";

interface ExportModalProps {
  data: LedgerEntry[];
  onClose: () => void;
  showGST: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({
  data,
  onClose,
  showGST,
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useForm<ExportFormValues>({
    defaultValues: {
      exportDateRange: null,
      exportType: "all",
      exportFormat: "pdf",
    },
  });

  const dateRange = watch("exportDateRange");
  const exportType = watch("exportType");
  const exportFormat = watch("exportFormat");
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredEntries = useMemo(() => {
    let d = data;
    if (dateRange?.[0]) {
      const f = dateRange[0].format("YYYY-MM-DD");
      d = d.filter((e) => e.date >= f);
    }
    if (dateRange?.[1]) {
      const t = dateRange[1].format("YYYY-MM-DD");
      d = d.filter((e) => e.date <= t);
    }
    if (exportType && exportType !== "all")
      d = d.filter((e) => e.type === exportType);
    return d;
  }, [data, dateRange, exportType]);

  const handleExport = useCallback(() => {
    if (filteredEntries.length === 0) return;
    setExporting(true);
    try {
      const from = dateRange?.[0]?.format("YYYY-MM-DD") ?? "";
      const to = dateRange?.[1]?.format("YYYY-MM-DD") ?? "";
      if (exportFormat === "pdf")
        generateLedgerPDF(
          filteredEntries,
          from,
          to,
          exportType ?? "all",
          showGST
        );
      else generateLedgerCSV(filteredEntries, showGST);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setExporting(false);
    }
  }, [filteredEntries, exportFormat, dateRange, exportType, showGST, onClose]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modalIn">
          {success ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <HiOutlineCheck className="text-2xl text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Export Successful!
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Your file has been downloaded
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <HiOutlineDocumentDownload className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Export Ledger
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {showGST
                        ? "With GST breakdown"
                        : "Base amounts (excl. GST)"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <HiOutlineX />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <CustomDateRange
                  label="Date Range"
                  name="exportDateRange"
                  control={control}
                  errors={errors}
                  placeholder={["From Date", "To Date"]}
                  size="middle"
                />
                <CustomSelect
                  label="Entry Type"
                  name="exportType"
                  control={control}
                  errors={errors}
                  placeholder="Select entry type"
                  options={EXPORT_TYPE_OPTIONS}
                  size="middle"
                  showSearch={false}
                />
                <CustomSelect
                  label="Export Format"
                  name="exportFormat"
                  control={control}
                  errors={errors}
                  placeholder="Select format"
                  options={EXPORT_FORMAT_OPTIONS}
                  size="middle"
                  showSearch={false}
                />

                <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-500">
                    Entries to export
                  </span>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      filteredEntries.length === 0
                        ? "text-red-400"
                        : "text-slate-800"
                    }`}
                  >
                    {filteredEntries.length}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={filteredEntries.length === 0 || exporting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {exporting ? (
                    <>
                      <svg
                        className="animate-spin h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>{" "}
                      Exporting...
                    </>
                  ) : (
                    <>
                      <HiOutlineDownload className="text-sm" /> Export{" "}
                      {filteredEntries.length} entries
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes modalIn { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } } .animate-modalIn { animation: modalIn 0.22s cubic-bezier(0.16, 1, 0.3, 1); }`}</style>
    </>
  );
};

export default ExportModal;
