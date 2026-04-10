import React, { useMemo } from "react";
import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { JarTransaction, TransactionType } from "../types/JarTracking";
import {
  TRANSACTION_TYPE_CONFIG,
  TRANSACTION_TYPE_FILTERS,
} from "../constants/transactionConstants";

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

interface TransactionHistoryProps {
  data: JarTransaction[];
  loading?: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  data,
  loading = false,
}) => {
  const columns: ColumnsType<JarTransaction> = useMemo(
    () => [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 110,
        sorter: (a, b) => a.date.localeCompare(b.date),
        defaultSortOrder: "descend",
        render: (date: string) => (
          <span className="text-[12px] font-semibold text-slate-600 tabular-nums">
            {date}
          </span>
        ),
      },
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 90,
        render: (id: string) => (
          <Tooltip title={`Transaction: ${id}`}>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded cursor-default">
              {id}
            </span>
          </Tooltip>
        ),
      },
      {
        title: "Customer",
        dataIndex: "customerName",
        key: "customerName",
        render: (name: string) => (
          <span className="text-[13px] font-medium text-slate-700">{name}</span>
        ),
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        width: 115,
        align: "center",
        filters: TRANSACTION_TYPE_FILTERS,
        onFilter: (value, record) => record.type === value,
        render: (type: TransactionType) => {
          const config = TRANSACTION_TYPE_CONFIG[type];
          return (
            <Tag
              color={config.color}
              icon={config.icon}
              className="!flex !items-center !gap-1 !w-fit !text-[11px] !font-bold !m-0 !rounded-md"
            >
              {config.label}
            </Tag>
          );
        },
      },
      {
        title: "Qty",
        dataIndex: "quantity",
        key: "quantity",
        width: 80,
        align: "center",
        sorter: (a, b) => a.quantity - b.quantity,
        render: (qty: number, record) => {
          const config = TRANSACTION_TYPE_CONFIG[record.type];
          return (
            <span
              className={`text-[13px] font-bold tabular-nums px-2.5 py-1 rounded-lg ${config.qtyColor} ${config.qtyBg}`}
            >
              {config.qtyPrefix}
              {qty}
            </span>
          );
        },
      },
      {
        title: "Driver",
        dataIndex: "driver",
        key: "driver",
        width: 140,
        render: (driver: string) => (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-[9px] font-bold text-slate-500">
                {getInitials(driver)}
              </span>
            </div>
            <span className="text-[12px] text-slate-600 font-medium">
              {driver}
            </span>
          </div>
        ),
      },
      {
        title: "Route",
        dataIndex: "route",
        key: "route",
        width: 140,
        render: (route: string) => (
          <span className="text-[11px] text-slate-400 font-medium">
            {route}
          </span>
        ),
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        key: "remarks",
        ellipsis: true,
        render: (remarks: string) => (
          <span className="text-[11px] text-slate-400 italic">
            {remarks || "—"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      size="small"
      rowKey="id"
      pagination={{
        pageSize: 6,
        showSizeChanger: true,
        pageSizeOptions: ["6", "12", "20"],
        showTotal: (total, range) => (
          <span className="text-[11px] text-slate-400">
            Showing {range[0]}–{range[1]} of {total} transactions
          </span>
        ),
      }}
      scroll={{ x: 900 }}
    />
  );
};

export default TransactionHistory;
