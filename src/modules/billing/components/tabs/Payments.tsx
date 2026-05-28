import React, { useMemo } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "react-hook-form";
import {
  HiOutlinePlus,
  HiOutlineCash,
  HiOutlineCreditCard,
  HiOutlineDownload,
  HiOutlineSearch,
} from "react-icons/hi";
import { HiMiniQrCode, HiBuildingLibrary, HiBanknotes } from "react-icons/hi2";
import { formatCurrency } from "../../utils/Helpers";
import StatCard from "../StatCard";
import { PaymentEntry } from "../../types/billing";
import CustomDateRange from "../../../../components/common/CustomDateRange";
export type DateRange = [Dayjs | null, Dayjs | null] | null;

interface Props {
  payments: PaymentEntry[];
  totalCash: number;
  totalUPI: number;
  totalBank: number;
  totalAmount: number;
  paymentsCount: number;
  search: string;
  modeFilter: string;
  dateRange: DateRange;
  onSearchChange: (v: string) => void;
  onModeFilterChange: (v: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onAddPayment: () => void;
  onExport: () => void;
}

const PaymentsTab: React.FC<Props> = ({
  payments,
  totalCash,
  totalUPI,
  totalBank,
  totalAmount,
  paymentsCount,
  search,
  modeFilter,
  dateRange,
  onSearchChange,
  onModeFilterChange,
  onDateRangeChange,
  onAddPayment,
  onExport,
}) => {
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { dateRange },
  });

  const isFiltered = useMemo(() => {
    if (!dateRange?.[0] || !dateRange?.[1]) return false;
    const isToday =
      dateRange[0].isSame(dayjs(), "day") &&
      dateRange[1].isSame(dayjs(), "day");
    return !isToday;
  }, [dateRange]);

  const periodLabel = useMemo(() => {
    if (!dateRange?.[0] || !dateRange?.[1]) return "Today";
    if (
      dateRange[0].isSame(dayjs(), "day") &&
      dateRange[1].isSame(dayjs(), "day")
    )
      return "Today";
    if (
      dateRange[0].isSame(dayjs().startOf("month"), "day") &&
      dateRange[1].isSame(dayjs().endOf("month"), "day")
    )
      return "This Month";
    return "Period";
  }, [dateRange]);

  const columns: ColumnsType<PaymentEntry> = [
    {
      title: "Payment",
      dataIndex: "paymentNo",
      width: 150,
      render: (no: string, r) => (
        <div>
          <div className="font-mono text-[13px] font-semibold text-gray-800">
            {no}
          </div>
          <div className="text-[11px] text-gray-400">
            {r.date} · {r.time}
          </div>
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      width: 100,
      align: "center",
      render: (name: string) => (
        <span className="font-medium text-[13px] text-gray-800">{name}</span>
      ),
    },
    {
      title: "Invoice",
      dataIndex: "invoiceNo",
      width: 120,
      align: "center",
      render: (no: string) => (
        <span className="font-mono text-[12px] text-gray-500">{no}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 120,
      align: "center",
      sorter: (a, b) => a.amount - b.amount,
      render: (amt: number) => (
        <span className="font-bold text-[13px] text-emerald-600">
          {formatCurrency(amt)}
        </span>
      ),
    },
    {
      title: "Mode",
      dataIndex: "mode",
      width: 100,
      render: (mode: string) => {
        const icons: Record<string, React.ReactNode> = {
          Cash: <HiOutlineCash className="w-3.5 h-3.5" />,
          UPI: <HiMiniQrCode className="w-3.5 h-3.5" />,
          "Bank Transfer": <HiBuildingLibrary className="w-3.5 h-3.5" />,
          Card: <HiOutlineCreditCard className="w-3.5 h-3.5" />,
        };
        return (
          <span className="flex items-center gap-1.5 text-[12px] text-gray-600">
            {icons[mode]} {mode}
          </span>
        );
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
      width: 120,
      align: "center",
      render: (ref: string) =>
        ref ? (
          <span className="font-mono text-[11px] text-gray-400">{ref}</span>
        ) : (
          <span className="text-[11px] text-gray-300">—</span>
        ),
    },
  ];

  const MODES = [
    { value: "all", label: "All" },
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "Bank Transfer", label: "Bank" },
  ];

  return (
    <div className="py-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Payment Entries</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Record and track all payments received
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <HiOutlineDownload className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={onAddPayment}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-700 shadow-sm"
          >
            <HiOutlinePlus className="w-4 h-4" /> Add Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<HiOutlineCash className="w-5 h-5" />}
          label={`${periodLabel} Cash`}
          value={formatCurrency(totalCash)}
          color="green"
        />
        <StatCard
          icon={<HiMiniQrCode className="w-5 h-5" />}
          label={`${periodLabel} UPI`}
          value={formatCurrency(totalUPI)}
          color="blue"
        />
        <StatCard
          icon={<HiBuildingLibrary className="w-5 h-5" />}
          label={`${periodLabel} Bank`}
          value={formatCurrency(totalBank)}
          color="purple"
        />
        <StatCard
          icon={<HiBanknotes className="w-5 h-5" />}
          label={`${periodLabel} Total`}
          value={formatCurrency(totalAmount)}
          sub={`${paymentsCount} payments`}
          color="green"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search payment no, customer, or invoice..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-[13px] placeholder:text-gray-300 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100"
            />
          </div>

          {/* Date range */}
          <div className="min-w-[260px]">
            <CustomDateRange
              name="dateRange"
              control={control}
              errors={errors}
              size="middle"
              placeholder={["From", "To"]}
              onChange={(dates) => onDateRangeChange(dates)}
            />
          </div>

          {/* Mode chips */}
          <div className="flex items-center gap-1.5">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => onModeFilterChange(m.value)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors
                  ${
                    modeFilter === m.value
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-gray-500 hover:bg-gray-50 border border-transparent"
                  }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter summary */}
        {(isFiltered || modeFilter !== "all") && (
          <div className="mt-3 flex items-center gap-2 text-[12px] text-gray-500 flex-wrap">
            {isFiltered && dateRange?.[0] && dateRange?.[1] && (
              <span>
                {dateRange[0].format("DD MMM YYYY")} →{" "}
                {dateRange[1].format("DD MMM YYYY")}
              </span>
            )}
            {modeFilter !== "all" && (
              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                Mode: {modeFilter}
              </span>
            )}
            <button
              onClick={() => {
                onDateRangeChange(null);
                onModeFilterChange("all");
              }}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <Table
          dataSource={payments}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, size: "small" }}
          size="small"
        />
      </div>
    </div>
  );
};

export default PaymentsTab;
