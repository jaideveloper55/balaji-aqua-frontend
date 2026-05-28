import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "react-hook-form";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineDownload,
  HiOutlineCash,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import {
  HiBanknotes,
  HiClipboardDocumentList,
  HiArrowTrendingUp,
  HiMiniQrCode,
  HiBuildingLibrary,
} from "react-icons/hi2";
import { TbAlertCircle } from "react-icons/tb";

import { formatCurrency, getInitials } from "../../utils/Helpers";
import StatCard from "../StatCard";
import CustomDateRange from "../../../../components/common/CustomDateRange";
import { Invoice, PaymentEntry } from "../../types/billing";

export type DateRange = [Dayjs | null, Dayjs | null] | null;

interface Props {
  dateRange?: DateRange;
  selectedPayments?: PaymentEntry[];
  selectedInvoices?: Invoice[];
  selectedCash?: number;
  selectedUPI?: number;
  invoiceCount?: number;
  invoicedTotal?: number;
  creditSales?: number;
  selectedBank?: number;
  selectedTotal?: number;
  totalOutstanding?: number;
  // ── Server-side pagination ──
  paymentsTotal?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  // ──
  onDateRangeChange?: (range: DateRange) => void;
  onExport?: () => void;
}

const CollectionTab: React.FC<Props> = ({
  dateRange,
  selectedPayments,
  selectedCash,
  selectedUPI,
  selectedBank,
  selectedTotal,
  totalOutstanding,
  invoiceCount,
  invoicedTotal,
  creditSales,
  paymentsTotal,
  page,
  pageSize,
  onPageChange,
  onDateRangeChange,
  onExport,
}) => {
  const safePayments = selectedPayments ?? [];
  const safeCash = selectedCash ?? 0;
  const safeUPI = selectedUPI ?? 0;
  const safeBank = selectedBank ?? 0;
  const safeTotal = selectedTotal ?? 0;
  const safeOutstanding = totalOutstanding ?? 0;

  const from = dateRange?.[0] ?? null;
  const to = dateRange?.[1] ?? null;
  const hasRange = !!(from && to);

  const periodLabel = (() => {
    if (!hasRange) return "All time";
    if (from!.isSame(to!, "day")) {
      return from!.isSame(dayjs(), "day")
        ? "Today"
        : from!.format("DD MMM YYYY");
    }
    if (
      from!.isSame(dayjs().startOf("month"), "day") &&
      to!.isSame(dayjs().endOf("month"), "day")
    )
      return "This month";
    return `${from!.format("DD MMM")} – ${to!.format("DD MMM YYYY")}`;
  })();

  const isSingleDay = hasRange && from!.isSame(to!, "day");

  // Local RHF so CustomDateRange has a control to bind to
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { dateRange },
  });

  const safeInvoiceCount = invoiceCount ?? 0;
  const safeInvoicedTotal = invoicedTotal ?? 0;
  const safeCreditSales = creditSales ?? 0;
  const avgInvoice =
    safeInvoiceCount > 0 ? Math.round(safeInvoicedTotal / safeInvoiceCount) : 0;

  const displayName = (name?: string) =>
    name && name.trim() ? name : "Walk-in";

  const modes = [
    {
      label: "Cash",
      amount: safeCash,
      color: "bg-emerald-500",
      icon: <HiOutlineCash className="w-4 h-4 text-emerald-600" />,
    },
    {
      label: "UPI",
      amount: safeUPI,
      color: "bg-blue-500",
      icon: <HiMiniQrCode className="w-4 h-4 text-blue-600" />,
    },
    {
      label: "Bank Transfer",
      amount: safeBank,
      color: "bg-purple-500",
      icon: <HiBuildingLibrary className="w-4 h-4 text-purple-600" />,
    },
  ];

  const columns: ColumnsType<PaymentEntry> = [
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      render: (_, pay) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-[10px] shrink-0">
            {getInitials(displayName(pay.customerName))}
          </div>
          <span className="text-[13px] font-medium text-gray-800 truncate">
            {displayName(pay.customerName)}
          </span>
        </div>
      ),
    },
    {
      title: "Invoice / Date",
      key: "invoice",
      align: "center",
      render: (_, pay) => (
        <div className="text-[11px] text-gray-500">
          <div>{pay.invoiceNo ?? "—"}</div>
          <div className="text-gray-400">
            {pay.date ? `${pay.date} ` : ""}
            {pay.time ?? ""}
          </div>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (amt: number) => (
        <span className="text-[13px] font-bold text-emerald-600">
          {formatCurrency(amt)}
        </span>
      ),
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      align: "right",
      render: (mode: string) => (
        <span className="text-[11px] text-gray-500">{mode}</span>
      ),
    },
  ];

  return (
    <div className="py-5 space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Collection Summary
          </h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {periodLabel} — Performance overview
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="min-w-[260px]">
            <CustomDateRange
              name="dateRange"
              control={control}
              errors={errors}
              size="middle"
              placeholder={["From", "To"]}
              onChange={(dates) => onDateRangeChange?.(dates)}
            />
          </div>
          {hasRange && (
            <button
              onClick={() =>
                onDateRangeChange?.([
                  dayjs().startOf("day"),
                  dayjs().endOf("day"),
                ])
              }
              className="text-[12px] text-emerald-600 hover:text-emerald-700 font-medium px-2"
            >
              Today
            </button>
          )}
          <button
            onClick={() => onExport?.()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <HiOutlineDownload className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* ── 5 stat cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          icon={<HiBanknotes className="w-5 h-5" />}
          label="Total Collection"
          value={formatCurrency(safeTotal)}
          sub={`${paymentsTotal ?? 0} payments`}
          color="green"
        />
        <StatCard
          icon={<HiClipboardDocumentList className="w-5 h-5" />}
          label="Invoices Generated"
          value={safeInvoiceCount}
          sub={`${formatCurrency(safeInvoicedTotal)} billed`}
          color="blue"
        />
        <StatCard
          icon={<HiArrowTrendingUp className="w-5 h-5" />}
          label="Avg Invoice Value"
          value={safeInvoiceCount > 0 ? formatCurrency(avgInvoice) : "—"}
          sub={safeInvoiceCount > 0 ? `${periodLabel} average` : undefined}
          color="purple"
        />
        <StatCard
          icon={<HiOutlineExclamationCircle className="w-5 h-5" />}
          label="Credit Sales"
          value={formatCurrency(safeCreditSales)}
          sub={`${periodLabel} credit`}
          color="orange"
        />
        <StatCard
          icon={<TbAlertCircle className="w-5 h-5" />}
          label="Total Outstanding"
          value={formatCurrency(safeOutstanding)}
          sub="All customers (running)"
          color="red"
        />
      </div>

      {/* ── Payment Mode Breakdown ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-gray-800">
            Payment Mode Breakdown
          </h3>
          <span className="text-[11px] text-gray-400">{periodLabel}</span>
        </div>
        <div className="space-y-3">
          {modes.map((mode) => {
            const pct =
              safeTotal > 0 ? Math.round((mode.amount / safeTotal) * 100) : 0;
            return (
              <div key={mode.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  {mode.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-medium text-gray-700">
                      {mode.label}
                    </span>
                    <span className="text-[13px] font-bold text-gray-900">
                      {formatCurrency(mode.amount)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${mode.color} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-[12px] text-gray-400 w-10 text-right">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold text-gray-800">
            {isSingleDay
              ? `Transactions on ${from!.format("DD MMM YYYY")}`
              : "Transactions in this period"}
          </h3>
          {(paymentsTotal ?? 0) > 0 && (
            <span className="text-[11px] text-gray-400">
              {paymentsTotal} entries
            </span>
          )}
        </div>

        <Table<PaymentEntry>
          columns={columns}
          dataSource={safePayments}
          rowKey="id"
          size="small"
          locale={{ emptyText: "No transactions in this period" }}
          pagination={{
            current: page ?? 1,
            pageSize: pageSize ?? 10,
            total: paymentsTotal ?? 0,
            showSizeChanger: false,
            onChange: (p) => onPageChange?.(p),
            showTotal: (t) => `${t} total`,
          }}
        />
      </div>
    </div>
  );
};

export default CollectionTab;
