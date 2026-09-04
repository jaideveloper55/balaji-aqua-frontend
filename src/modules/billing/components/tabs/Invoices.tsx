import React, { useMemo } from "react";
import { Table, Tag, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import {
  HiOutlineSearch,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineBan,
  HiOutlineEye,
  HiOutlinePrinter,
  HiOutlinePencil,
  HiOutlineDotsVertical,
  HiOutlineTrash,
} from "react-icons/hi";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { formatCurrency, getCustomerTypeColor } from "../../utils/Helpers";
import StatCard from "../StatCard";
import { Invoice } from "../../types/billing";
import CustomDateRange from "../../../../components/common/CustomDateRange";

export type DateRange = [any, any] | null;

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
  onDelete?: (invoice: Invoice) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onView: (invoice: Invoice) => void;
  onPrint: (invoice: Invoice) => void;
  onExport?: () => void;
  userRole?: string;
  onCorrect?: (invoice: Invoice) => void;
}

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "pending", label: "Pending" },
  { key: "partial", label: "Partial" },
  { key: "overdue", label: "Overdue" },
];

const InvoicesTab: React.FC<Props> = ({
  invoices,
  stats,
  search,
  statusFilter,
  onDateRangeChange,
  onSearchChange,
  onStatusFilterChange,
  onView,
  onDelete,
  onPrint,
  userRole,
  onCorrect,
}) => {
  const {
    control,
    formState: { errors },
  } = useForm();

  const filteredInvoices = useMemo(() => {
    if (!search) return invoices;
    const q = search.toLowerCase();
    return invoices.filter(
      (inv) =>
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q)
    );
  }, [invoices, search]);

  const columns: ColumnsType<Invoice> = [
    {
      title: "Invoice",
      dataIndex: "invoiceNo",
      width: 200,
      render: (no: string, r) => (
        <div>
          <div className="text-[13px] font-semibold text-gray-900">{no}</div>
          <div className="text-[11px] text-gray-400">
            {r.date} · {r.time}
          </div>
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      width: 160,
      align: "center",
      render: (name: string, r) => (
        <div>
          <div className="text-[13px] font-medium text-gray-800">{name}</div>
          <Tag
            className="!text-[10px] !px-1.5 !py-0 !m-0 !mt-0.5 !border-0 !rounded-md"
            color={getCustomerTypeColor(r.customerType)}
          >
            {r.customerType}
          </Tag>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      width: 110,
      align: "center",
      sorter: (a, b) => a.grandTotal - b.grandTotal,
      render: (v: number) => (
        <span className="text-[13px] font-semibold text-gray-900 tabular-nums">
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      title: "Paid",
      dataIndex: "paidAmount",
      width: 100,
      align: "center",
      render: (v: number) => (
        <span className="text-[13px] font-medium text-emerald-600 tabular-nums">
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balanceAmount",
      width: 100,
      align: "center",
      render: (v: number) =>
        v > 0 ? (
          <span className="text-[13px] font-medium text-red-500 tabular-nums">
            {formatCurrency(v)}
          </span>
        ) : (
          <span className="text-[12px] text-gray-300">&mdash;</span>
        ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      width: 110,
      align: "center",
      render: (d: string | null) =>
        d ? (
          <span className="text-[12px] text-gray-600">{d}</span>
        ) : (
          <span className="text-[12px] text-gray-300">&mdash;</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      align: "center" as const,

      filters: STATUS_TABS.filter((t) => t.key !== "all").map((t) => ({
        text: t.label,
        value: t.key,
      })),

      onFilter: (val, r) => r.status === val,

      render: (status: string) => {
        const statusStyles: Record<
          string,
          { bg: string; text: string; dot: string }
        > = {
          Paid: {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            dot: "bg-emerald-500",
          },
          Pending: {
            bg: "bg-amber-50",
            text: "text-amber-700",
            dot: "bg-amber-500",
          },
          Partial: {
            bg: "bg-blue-50",
            text: "text-blue-700",
            dot: "bg-blue-500",
          },
          Overdue: {
            bg: "bg-red-50",
            text: "text-red-700",
            dot: "bg-red-500",
          },
          Cancelled: {
            bg: "bg-gray-50",
            text: "text-gray-500",
            dot: "bg-gray-400",
          },
        };

        const s = statusStyles[status] ?? statusStyles.Pending;

        return (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {status}
            </span>
          </div>
        );
      },
    },
    {
      title: "Mode",
      dataIndex: "paymentMode",
      width: 90,
      align: "center",
      render: (mode: string, r) => {
        if (r.status === "Paid" || r.status === "Partial") {
          return (
            <span className="text-[12px] text-gray-600 font-medium">
              {mode || "\u2014"}
            </span>
          );
        }
        if (r.status === "Pending" || r.status === "Overdue") {
          return (
            <span className="text-[11px] text-amber-500 font-medium">
              Unpaid
            </span>
          );
        }
        return <span className="text-[12px] text-gray-300">&mdash;</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 70,
      align: "center",
      render: (_: unknown, record: Invoice) => {
        const isSuperAdmin = userRole === "SUPER_ADMIN";

        const menuItems = [
          {
            key: "view",
            icon: <HiOutlineEye size={14} />,
            label: "View Details",
          },
          {
            key: "print",
            icon: <HiOutlinePrinter size={14} />,
            label: "Print Invoice",
          },

          ...(isSuperAdmin && record.status !== "Cancelled"
            ? [
                { type: "divider" as const },
                {
                  key: "correct",
                  icon: <HiOutlinePencil size={14} />,
                  label: "Correct Payment Mode",
                },
              ]
            : []),

          ...(isSuperAdmin && onDelete
            ? [
                { type: "divider" as const },
                {
                  key: "delete",
                  icon: <HiOutlineTrash size={14} />,
                  label: "Delete Invoice",
                  danger: true,
                },
              ]
            : []),
        ];

        return (
          <Dropdown
            menu={{
              items: menuItems,
              onClick: ({ key, domEvent }) => {
                domEvent.stopPropagation();
                if (key === "view") onView(record);
                else if (key === "print") onPrint(record);
                else if (key === "correct") onCorrect?.(record);
                else if (key === "delete") onDelete?.(record);
              },
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <HiOutlineDotsVertical size={16} className="text-gray-400" />
            </button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="space-y-5 py-5">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<HiClipboardDocumentList size={20} />}
          color="blue"
          label="Total Invoices"
          value={stats.total}
          sub={formatCurrency(stats.totalAmount) + " total"}
        />
        <StatCard
          icon={<HiOutlineCheckCircle size={20} />}
          color="green"
          label="Collected"
          value={formatCurrency(stats.collected)}
          sub={stats.paid + " invoices paid"}
        />
        <StatCard
          icon={<HiOutlineExclamationCircle size={20} />}
          color="orange"
          label="Pending Amount"
          value={formatCurrency(stats.pendingAmount)}
          sub={stats.pending + " invoices"}
        />
        <StatCard
          icon={<HiOutlineBan size={20} />}
          color="red"
          label="Overdue"
          value={stats.overdue}
          sub="Need attention"
        />
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <HiOutlineSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search invoices or customers..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-[13px] placeholder:text-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
          />
        </div>

        {/* Date Range */}
        <div className="w-64">
          <CustomDateRange
            name="dateRange"
            control={control}
            errors={errors}
            size="middle"
            onChange={(val: any) => onDateRangeChange(val)}
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 ml-auto">
          {STATUS_TABS.map((tab) => {
            const isActive =
              (tab.key === "all" && !statusFilter) || statusFilter === tab.key;
            const count =
              tab.key === "all"
                ? stats.total
                : tab.key === "paid"
                ? stats.paid
                : tab.key === "pending"
                ? stats.pending
                : tab.key === "partial"
                ? stats.partial
                : tab.key === "overdue"
                ? stats.overdue
                : 0;
            return (
              <button
                key={tab.key}
                onClick={() =>
                  onStatusFilterChange(tab.key === "all" ? "all" : tab.key)
                }
                className={
                  "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all " +
                  (isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700")
                }
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={
                      "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full " +
                      (isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-500")
                    }
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ── */}
      <Table<Invoice>
        rowKey="id"
        columns={columns}
        dataSource={filteredInvoices}
        size="middle"
        scroll={{ x: 1050 }}
        onRow={(record) => ({
          onClick: () => onView(record),
          className: "cursor-pointer hover:bg-gray-50/50 transition-colors",
        })}
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          pageSizeOptions: ["10", "15", "25", "50"],
          showTotal: (total, range) =>
            `Showing ${range[0]}\u2013${range[1]} of ${total}`,
          className: "!mt-4",
        }}
        locale={{
          emptyText: (
            <div className="py-12 flex flex-col items-center gap-2 text-gray-400">
              <HiClipboardDocumentList size={36} className="text-gray-300" />
              <p className="text-[14px] font-medium text-gray-500">
                No invoices found
              </p>
              <p className="text-[12px]">Try clearing search or filters</p>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default InvoicesTab;
