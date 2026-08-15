import React, { useState } from "react";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import {
  HiOutlineDownload,
  HiOutlineDocumentText,
  HiOutlineTable,
} from "react-icons/hi";

import type { DashboardSummary } from "../types/Dashboard";
import CustomDateRange from "../../../components/common/CustomDateRange";
import CustomModal from "../../../components/common/CustomModal";
import { getDashboardSummaryApi } from "../api/Dashboard.api";
import {
  exportDashboardPdf,
  exportDashboardXlsx,
} from "../types/Dashboardreport";

type FormatKey = "pdf" | "xlsx";

interface ExportFormValues {
  dateRange: [Dayjs, Dayjs];
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const DashboardExportModal: React.FC<Props> = ({ open, onClose }) => {
  const [format, setFormat] = useState<FormatKey>("pdf");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExportFormValues>({
    defaultValues: { dateRange: [dayjs().startOf("month"), dayjs()] },
  });

  const onSubmit = async (values: ExportFormValues): Promise<void> => {
    const [start, end] = values.dateRange;
    if (!start || !end) {
      setError("Pick both a start and end date.");
      return;
    }
    const dateFrom = start.format("YYYY-MM-DD");
    const dateTo = end.format("YYYY-MM-DD");

    setError(null);
    setIsExporting(true);
    try {
      const res = await getDashboardSummaryApi({ dateFrom, dateTo });
      const data: DashboardSummary = res.data;

      if (format === "pdf") {
        exportDashboardPdf(data, dateFrom, dateTo);
      } else {
        await exportDashboardXlsx(data, dateFrom, dateTo);
      }
      onClose();
    } catch {
      setError("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Export Dashboard Report"
      subtitle="Download a PDF or formatted Excel file of your dashboard metrics"
      icon={<HiOutlineDownload size={20} />}
      iconTone="blue"
      size="md"
      footer={
        <div className="flex flex-col gap-2">
          {error && <p className="text-[12px] text-rose-600">{error}</p>}
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isExporting}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-[14px] flex items-center justify-center gap-2"
          >
            <HiOutlineDownload size={16} />
            {isExporting ? "Exporting..." : "Export Report"}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <CustomDateRange
          label="Date Range"
          name="dateRange"
          control={control}
          errors={errors}
          isrequired
          rules={{ required: "Please select a date range" }}
        />

        {/* FORMAT */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat("pdf")}
              className={`p-3 rounded-xl border text-left ${
                format === "pdf"
                  ? "border-rose-300 ring-2 ring-rose-100"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <HiOutlineDocumentText size={18} className="text-rose-600 mb-1" />
              <p className="text-[13px] font-semibold text-slate-800">PDF</p>
              <p className="text-[11px] text-slate-500">Print &amp; share</p>
            </button>
            <button
              type="button"
              onClick={() => setFormat("xlsx")}
              className={`p-3 rounded-xl border text-left ${
                format === "xlsx"
                  ? "border-emerald-300 ring-2 ring-emerald-100"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <HiOutlineTable size={18} className="text-emerald-600 mb-1" />
              <p className="text-[13px] font-semibold text-slate-800">
                Excel (.xlsx)
              </p>
              <p className="text-[11px] text-slate-500">
                Formatted, ready to analyze
              </p>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Collection and billing figures reflect the period you choose above.
          Outstanding, stock, and customer counts always reflect right now —
          they aren't "as of" a past date, they're your current numbers.
        </p>
      </div>
    </CustomModal>
  );
};

export default DashboardExportModal;
