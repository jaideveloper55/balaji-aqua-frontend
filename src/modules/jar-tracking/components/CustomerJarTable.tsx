import React from "react";
import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import type {
  CustomerJarRecord,
  CustomerJarStatus,
} from "../types/JarTracking";
import { HOLDING_THRESHOLD } from "../constants/jarConstants";

const STATUS_CONFIG: Record<
  CustomerJarStatus,
  { label: string; color: string; dotColor: string; rowClass: string }
> = {
  good: {
    label: "Good",
    color: "green",
    dotColor: "bg-emerald-500",
    rowClass: "",
  },
  warning: {
    label: "Warning",
    color: "orange",
    dotColor: "bg-amber-500",
    rowClass: "!bg-amber-50/30 hover:!bg-amber-50/50",
  },
  overdue: {
    label: "Overdue",
    color: "red",
    dotColor: "bg-red-500",
    rowClass: "!bg-red-50/25 hover:!bg-red-50/40",
  },
};

interface CustomerJarTableProps {
  data: CustomerJarRecord[];
  loading?: boolean;
}

const CustomerJarTable: React.FC<CustomerJarTableProps> = ({
  data,
  loading = false,
}) => {
  const columns: ColumnsType<CustomerJarRecord> = [
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
      render: (name: string, record) => (
        <div className="flex items-center gap-3 py-0.5">
          {/* Status dot */}
          <div className="flex-shrink-0">
            <div
              className={`w-2 h-2 rounded-full ${
                STATUS_CONFIG[record.status].dotColor
              } ${record.status === "overdue" ? "animate-pulse" : ""}`}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800 text-[13px] leading-tight">
              {name}
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <HiOutlinePhone size={10} className="text-slate-300" />
                {record.phone}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <HiOutlineLocationMarker size={10} className="text-slate-300" />
                {record.route}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Issued",
      dataIndex: "totalIssued",
      key: "totalIssued",
      align: "center",
      width: 90,
      sorter: (a, b) => a.totalIssued - b.totalIssued,
      render: (val: number) => (
        <span className="text-[13px] font-semibold text-slate-600 tabular-nums">
          {val}
        </span>
      ),
    },
    {
      title: "Returned",
      dataIndex: "returned",
      key: "returned",
      align: "center",
      width: 100,
      sorter: (a, b) => a.returned - b.returned,
      render: (val: number) => (
        <span className="text-[13px] font-semibold text-emerald-600 tabular-nums">
          {val}
        </span>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      align: "center",
      width: 120,
      sorter: (a, b) => a.balance - b.balance,
      defaultSortOrder: "descend",
      render: (val: number) => {
        const isOver = val > HOLDING_THRESHOLD;
        const isNear = val > HOLDING_THRESHOLD * 0.8;
        const ratio = Math.min((val / HOLDING_THRESHOLD) * 100, 100);

        return (
          <Tooltip
            title={
              isOver
                ? `Exceeds limit of ${HOLDING_THRESHOLD} — follow up needed`
                : isNear
                ? `Approaching limit of ${HOLDING_THRESHOLD}`
                : `${val} of ${HOLDING_THRESHOLD} limit`
            }
          >
            <div className="flex flex-col items-center gap-1">
              <span
                className={`inline-flex items-center justify-center min-w-[40px] text-[13px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                  isOver
                    ? "text-red-700 bg-red-100 ring-1 ring-red-200/60"
                    : isNear
                    ? "text-amber-700 bg-amber-50"
                    : "text-slate-600 bg-slate-50"
                }`}
              >
                {val}
              </span>
              <div className="w-14 h-[3px] bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver
                      ? "bg-red-500"
                      : isNear
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`}
                  style={{ width: `${ratio}%` }}
                />
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Last Delivery",
      dataIndex: "lastDeliveryDate",
      key: "lastDeliveryDate",
      width: 120,
      align: "center",
      render: (date: string) => (
        <span className="text-[12px] text-slate-500 font-medium tabular-nums">
          {date}
        </span>
      ),
    },
    {
      title: "Last Return",
      dataIndex: "lastReturnDate",
      key: "lastReturnDate",
      width: 120,
      align: "center",
      render: (date: string | null) => (
        <span
          className={`text-[12px] font-medium tabular-nums ${
            date ? "text-slate-500" : "text-red-400"
          }`}
        >
          {date || (
            <span className="italic flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Never
            </span>
          )}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      align: "center",
      filters: [
        { text: "Good", value: "good" },
        { text: "Warning", value: "warning" },
        { text: "Overdue", value: "overdue" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: CustomerJarStatus) => {
        const config = STATUS_CONFIG[status];
        return (
          <Tag
            color={config.color}
            className="!text-[11px] !font-bold !px-2.5 !py-0.5 !m-0 !rounded-md"
          >
            {config.label}
          </Tag>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      size="middle"
      pagination={{
        pageSize: 8,
        showSizeChanger: true,
        pageSizeOptions: ["8", "15", "25"],
        showTotal: (total, range) => (
          <span className="text-[11px] text-slate-400">
            Showing {range[0]}–{range[1]} of {total} customers
          </span>
        ),
      }}
      rowClassName={(record) => STATUS_CONFIG[record.status].rowClass}
      scroll={{ x: 800 }}
      className="jar-customer-table"
    />
  );
};

export default CustomerJarTable;
