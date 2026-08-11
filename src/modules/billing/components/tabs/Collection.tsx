import React, { useEffect, useRef, useState, useMemo } from "react";
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
import { HiOutlineMoon } from "react-icons/hi";
import { formatCurrency, getInitials } from "../../utils/Helpers";
import StatCard from "../StatCard";
import CustomDateRange from "../../../../components/common/CustomDateRange";
import CustomInput from "../../../../components/common/CustomInput";
import CustomSelect from "../../../../components/common/CustomSelect";
import { Invoice, PaymentEntry } from "../../types/billing";
import DayClosingReport, { DayClosingData } from "../DayClosingReport";

export type DateRange = [Dayjs | null, Dayjs | null] | null;

interface ExpenseRow {
  id: string;
  expenseNo: string;
  vendorName: string;
  description: string;
  categoryName: string;
  amount: number;
  paymentMode: string;
}

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
  paymentsTotal?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  searchValue?: string;
  modeFilter?: string;
  onSearchChange?: (q: string) => void;
  onModeChange?: (mode: string) => void;
  isLoading?: boolean;
  onDateRangeChange?: (range: DateRange) => void;
  onExport?: () => void;
  // Day Closing extras
  companyName?: string;
  expenses?: ExpenseRow[];
  totalExpenses?: number;
  cashExpenses?: number;
  allPayments?: PaymentEntry[];
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
  searchValue,
  modeFilter,
  onSearchChange,
  onModeChange,
  isLoading,
  onDateRangeChange,
  onExport,
  companyName,
  expenses,
  totalExpenses,
  cashExpenses,
  allPayments,
}) => {
  const [showClosing, setShowClosing] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const {
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dateRange,
      search: searchValue ?? "",
      mode: modeFilter ?? "all",
    },
  });

  const searchInput = watch("search") ?? "";
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange?.(searchInput.trim());
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput, onSearchChange]);

  const safeInvoiceCount = invoiceCount ?? 0;
  const safeInvoicedTotal = invoicedTotal ?? 0;
  const safeCreditSales = creditSales ?? 0;
  const avgInvoice =
    safeInvoiceCount > 0 ? Math.round(safeInvoicedTotal / safeInvoiceCount) : 0;

  const displayName = (name?: string) =>
    name && name.trim() ? name : "Walk-in";

  const isFiltering = !!searchValue?.trim() || (modeFilter ?? "all") !== "all";

  const modeOptions = [
    { value: "all", label: "All modes" },
    { value: "CASH", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
  ];

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

  // ── Build customer breakdown from payments ──────────────────────────
  const customerBreakdown = useMemo(() => {
    const paymentsList = allPayments ?? safePayments;
    const map = new Map<
      string,
      {
        name: string;
        total: number;
        cash: number;
        upi: number;
        bank: number;
        credit: number;
        count: Set<string>;
      }
    >();

    for (const p of paymentsList) {
      const name = p.customerName?.trim() || "Walk-in";
      if (!map.has(name)) {
        map.set(name, {
          name,
          total: 0,
          cash: 0,
          upi: 0,
          bank: 0,
          credit: 0,
          count: new Set(),
        });
      }
      const entry = map.get(name)!;
      entry.total += p.amount ?? 0;
      if (p.invoiceNo) entry.count.add(p.invoiceNo);

      const mode = (p.mode ?? "").toLowerCase();
      if (mode === "cash" || mode === "card") entry.cash += p.amount ?? 0;
      else if (mode === "upi") entry.upi += p.amount ?? 0;
      else if (mode.includes("bank")) entry.bank += p.amount ?? 0;
      else entry.credit += p.amount ?? 0;
    }

    return Array.from(map.values())
      .map((e) => ({
        name: e.name,
        totalAmount: e.total,
        cashAmount: e.cash,
        upiAmount: e.upi,
        bankAmount: e.bank,
        creditAmount: e.credit,
        invoiceCount: e.count.size || 1,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [allPayments, safePayments]);

  // ── Build closing report data ──────────────────────────────────────
  const closingData: DayClosingData = useMemo(
    () => ({
      date: from?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
      companyName: companyName ?? "",
      invoiceCount: safeInvoiceCount,
      totalBilled: safeInvoicedTotal,
      creditSales: safeCreditSales,
      cashCollected: safeCash,
      upiCollected: safeUPI,
      bankCollected: safeBank,
      totalCollected: safeTotal,
      totalOutstanding: safeOutstanding,
      expenses: expenses ?? [],
      totalExpenses: totalExpenses ?? 0,
      cashExpenses: cashExpenses ?? 0,
      customerBreakdown,
      payments: allPayments ?? safePayments,
    }),
    [
      from,
      companyName,
      safeInvoiceCount,
      safeInvoicedTotal,
      safeCreditSales,
      safeCash,
      safeUPI,
      safeBank,
      safeTotal,
      safeOutstanding,
      expenses,
      totalExpenses,
      cashExpenses,
      customerBreakdown,
      allPayments,
      safePayments,
    ]
  );

  const handlePrintClosing = () => {
    const content = reportRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Day Closing Report — ${dayjs(closingData.date).format(
            "DD MMM YYYY"
          )}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', -apple-system, sans-serif; color: #1f2937; }
            table { border-collapse: collapse; width: 100%; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
          <script src="https://cdn.tailwindcss.com"><\/script>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

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

          {/* ── Close Day Button ─────────────────────────────────── */}
          <button
            onClick={() => setShowClosing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-800 transition-colors shadow-sm"
          >
            <HiOutlineMoon className="w-4 h-4" /> Close Day
          </button>

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
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-[13px] font-semibold text-gray-800">
            {isSingleDay
              ? `Transactions on ${from!.format("DD MMM YYYY")}`
              : "Transactions in this period"}
          </h3>
          {(paymentsTotal ?? 0) > 0 && (
            <span className="text-[11px] text-gray-400">
              {isFiltering
                ? `${paymentsTotal} matching`
                : `${paymentsTotal} entries`}
            </span>
          )}
        </div>

        {/* ── Search + mode filter (server-side) ────────────────────────── */}
        <div className="flex items-end gap-2 flex-wrap mb-4">
          <div className="flex-1 min-w-[200px]">
            <CustomInput
              name="search"
              control={control}
              placeholder="Search customer, invoice, or payment no..."
              size="middle"
            />
          </div>
          <div className="min-w-[160px]">
            <CustomSelect
              name="mode"
              control={control}
              errors={errors}
              placeholder="Payment mode"
              size="middle"
              options={modeOptions}
              onChange={(val) => onModeChange?.(val)}
            />
          </div>
        </div>

        <Table<PaymentEntry>
          columns={columns}
          dataSource={safePayments}
          rowKey="id"
          size="small"
          loading={isLoading}
          locale={{
            emptyText: isFiltering
              ? "No transactions match your filters"
              : "No transactions in this period",
          }}
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

      <DayClosingReport
        open={showClosing}
        ref={reportRef}
        data={closingData}
        onClose={() => setShowClosing(false)}
        onPrint={handlePrintClosing}
      />
    </div>
  );
};

export default CollectionTab;
