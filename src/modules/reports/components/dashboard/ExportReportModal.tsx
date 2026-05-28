import React, { useState } from "react";
import { message } from "antd";
import {
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import {
  TbFileTypePdf,
  TbFileTypeXls,
  TbFileTypeCsv,
  TbReportAnalytics,
} from "react-icons/tb";
import CustomModal from "../../../../components/common/CustomModal";
import { ExportPayload, exportData } from "../../utils/export";


interface Props {
  open: boolean;
  onClose: () => void;
  buildPayload: (
    format: "pdf" | "excel" | "csv",
    sections: string[]
  ) => ExportPayload;
}

const FORMATS = [
  {
    value: "pdf" as const,
    label: "PDF Report",
    description: "Formatted with charts & tables",
    icon: <TbFileTypePdf size={28} />,
    color: "#DC2626",
    bg: "#FEE2E2",
  },
  {
    value: "excel" as const,
    label: "Excel Workbook",
    description: "Editable spreadsheet",
    icon: <TbFileTypeXls size={28} />,
    color: "#059669",
    bg: "#D1FAE5",
  },
  {
    value: "csv" as const,
    label: "CSV File",
    description: "Plain data, opens anywhere",
    icon: <TbFileTypeCsv size={28} />,
    color: "#2563EB",
    bg: "#DBEAFE",
  },
];

const SECTIONS = [
  { key: "kpis", label: "KPI Summary" },
  { key: "revenue", label: "Revenue Trends" },
  { key: "products", label: "Product Sales" },
  { key: "customers", label: "Top Customers" },
  { key: "delivery", label: "Delivery Stats" },
  { key: "jars", label: "Jar Movement" },
  { key: "workforce", label: "Workforce" },
  { key: "financial", label: "Income & Expense" },
];

const ExportReportModal: React.FC<Props> = ({
  open,
  onClose,
  buildPayload,
}) => {
  const [format, setFormat] = useState<"pdf" | "excel" | "csv">("excel");
  const [selected, setSelected] = useState<string[]>([
    "kpis",
    "revenue",
    "products",
    "customers",
  ]);
  const [exporting, setExporting] = useState(false);

  const toggleSection = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleExport = async () => {
    if (selected.length === 0) {
      message.warning("Please select at least one section");
      return;
    }
    try {
      setExporting(true);
      const payload = buildPayload(format, selected);
      await exportData(format, payload);
      message.success(`${format.toUpperCase()} downloaded`);
      onClose();
    } catch (e: any) {
      message.error(`Export failed: ${e.message || "Unknown error"}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Export Report"
      subtitle="Choose format and sections"
      icon={<TbReportAnalytics size={22} />}
      iconTone="blue"
      size="3xl"
      footer={
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              {selected.length}
            </span>{" "}
            section{selected.length !== 1 ? "s" : ""} selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={exporting}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exporting || selected.length === 0}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              <HiOutlineDownload />
              {exporting ? "Generating…" : `Download ${format.toUpperCase()}`}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Choose Format
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {FORMATS.map((f) => {
              const active = format === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                    active
                      ? "border-blue-500 bg-blue-50/50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {active && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <HiOutlineCheckCircle size={16} className="text-white" />
                    </div>
                  )}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: f.bg, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <p className="font-bold text-sm text-slate-800">{f.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {f.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sections to Include
            </p>
            <button
              onClick={() =>
                setSelected(
                  selected.length === SECTIONS.length
                    ? []
                    : SECTIONS.map((s) => s.key)
                )
              }
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              {selected.length === SECTIONS.length
                ? "Deselect all"
                : "Select all"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SECTIONS.map((s) => {
              const active = selected.includes(s.key);
              return (
                <button
                  key={s.key}
                  onClick={() => toggleSection(s.key)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    active
                      ? "border-blue-300 bg-blue-50/40"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                      active
                        ? "border-blue-500 bg-blue-500"
                        : "border-slate-300"
                    }`}
                  >
                    {active && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6L5 9L10 3"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
          <HiOutlineDocumentText
            className="text-blue-600 shrink-0 mt-0.5"
            size={18}
          />
          <div>
            <p className="text-xs font-semibold text-blue-900">
              Tip: PDF is best for sharing
            </p>
            <p className="text-[11px] text-blue-700 mt-0.5">
              Excel keeps data editable. CSV works with any tool.
            </p>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ExportReportModal;
