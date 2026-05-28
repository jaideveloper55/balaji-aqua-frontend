import React from "react";
import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Dayjs } from "dayjs";
import { useForm } from "react-hook-form";
import {
  HiOutlineSearch,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineBan,
  HiOutlineEye,
  HiOutlinePrinter,
} from "react-icons/hi";
import { HiClipboardDocumentList } from "react-icons/hi2";
import {
  formatCurrency,
  getCustomerTypeColor,
  getStatusConfig,
} from "../../utils/Helpers";
import StatCard from "../StatCard";
import { Invoice } from "../../types/billing";
import CustomDateRange from "../../../../components/common/CustomDateRange";

export type DateRange = [Dayjs | null, Dayjs | null] | null;

interface InvoiceStats {
  total: number;
  paid: number;
  pending: number;
  partial: number;
  overdue: number;
  totalAmount: number;
  collected: number;
  pendingAmount: number;
}

interface Props {
  invoices: Invoice[];
  stats: InvoiceStats;
  search: string;
  statusFilter: string;
  dateRange: DateRange;
  onExport: () => void;
  onSearchChange: (v: string) => void;
  onStatusFilterChange: (v: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onView: (inv: Invoice) => void;
  onPrint: (inv: Invoice) => void;
}

const InvoicesTab: React.FC<Props> = ({
  invoices,
  stats,
  search,
  statusFilter,
  dateRange,
  onSearchChange,
  onStatusFilterChange,
  onDateRangeChange,
  onView,
  onPrint,
}) => {
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { dateRange },
  });

  const columns: ColumnsType<Invoice> = [
    {
      title: "Invoice",
      dataIndex: "invoiceNo",
      width: 140,
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
      width: 140,
      align: "center",
      render: (name: string, r) => (
        <div>
          <div className="font-medium text-[13px] text-gray-800">{name}</div>
          <Tag
            color={getCustomerTypeColor(r.customerType)}
            className="text-[10px] mt-0.5"
          >
            {r.customerType}
          </Tag>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      width: 100,
      align: "center",
      sorter: (a, b) => a.grandTotal - b.grandTotal,
      render: (amt: number) => (
        <span className="font-bold text-[13px] text-gray-900">
          {formatCurrency(amt)}
        </span>
      ),
    },
    {
      title: "Paid",
      dataIndex: "paidAmount",
      width: 90,
      align: "center",
      render: (amt: number) => (
        <span className="text-[13px] text-emerald-600 font-medium">
          {formatCurrency(amt)}
        </span>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balanceAmount",
      width: 90,
      align: "center",
      render: (amt: number) =>
        amt > 0 ? (
          <span className="text-[13px] text-red-500 font-semibold">
            {formatCurrency(amt)}
          </span>
        ) : (
          <span className="text-[13px] text-gray-300">—</span>
        ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      width: 110,
      align: "center",
      render: (date: string | null, r) => {
        if (!date) {
          return <span className="text-[12px] text-gray-300">—</span>;
        }
        if (r.balanceAmount === 0) {
          return <span className="text-[12px] text-gray-400">{date}</span>;
        }
        if (r.overdueDays && r.overdueDays > 0) {
          return (
            <div className="flex flex-col items-center leading-tight">
              <span className="text-[12px] font-semibold text-red-600">
                {date}
              </span>
              <span className="text-[10px] text-red-500 font-medium">
                {r.overdueDays}d overdue
              </span>
            </div>
          );
        }
        return (
          <span className="text-[12px] text-amber-600 font-medium">{date}</span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 90,
      align: "center",
      render: (status: string) => (
        <Tag color={getStatusConfig(status).color} className="text-[11px]">
          {status}
        </Tag>
      ),
    },
    {
      title: "Mode",
      dataIndex: "paymentMode",
      width: 90,
      align: "center",
      render: (mode: string) => (
        <span className="text-[12px] text-gray-500">{mode}</span>
      ),
    },
    {
      title: "",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_, r) => (
        <div className="flex items-center gap-1 justify-center">
          <Tooltip title="View Details">
            <button
              onClick={() => onView(r)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
            >
              <HiOutlineEye className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip title="Print">
            <button
              onClick={() => onPrint(r)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            >
              <HiOutlinePrinter className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="py-5 space-y-4">
      {/* ── KPI cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<HiClipboardDocumentList className="w-5 h-5" />}
          label="Total Invoices"
          value={stats.total}
          sub={`${formatCurrency(stats.totalAmount)} total`}
          color="blue"
        />
        <StatCard
          icon={<HiOutlineCheckCircle className="w-5 h-5" />}
          label="Collected"
          value={formatCurrency(stats.collected)}
          sub={`${stats.paid} invoices paid`}
          color="green"
        />
        <StatCard
          icon={<HiOutlineExclamationCircle className="w-5 h-5" />}
          label="Pending Amount"
          value={formatCurrency(stats.pendingAmount)}
          sub={`${stats.pending + stats.partial} invoices`}
          color="orange"
        />
        <StatCard
          icon={<HiOutlineBan className="w-5 h-5" />}
          label="Overdue"
          value={stats.overdue}
          sub="Need attention"
          color="red"
        />
      </div>

      {/* ── Filter row ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search invoices or customers..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-[13px] placeholder:text-gray-300 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100"
            />
          </div>

          {/* Date range filter */}
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

          {/* Status chips */}
          <div className="flex items-center gap-1.5">
            {["all", "paid", "pending", "partial", "overdue"].map((s) => (
              <button
                key={s}
                onClick={() => onStatusFilterChange(s)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-colors
                  ${
                    statusFilter === s
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-gray-500 hover:bg-gray-50 border border-transparent"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter summary — helps users see what's applied */}
        {dateRange && dateRange[0] && dateRange[1] && (
          <div className="mt-3 flex items-center gap-2 text-[12px] text-gray-500">
            <span>
              Showing invoices from{" "}
              <span className="font-medium text-gray-700">
                {dateRange[0].format("DD MMM YYYY")}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-700">
                {dateRange[1].format("DD MMM YYYY")}
              </span>
            </span>
            <button
              onClick={() => onDateRangeChange(null)}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100">
        <Table
          dataSource={invoices}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, size: "small", showSizeChanger: false }}
          size="small"
          scroll={{ x: 1100 }}
        />
      </div>
    </div>
  );
};

export default InvoicesTab;
