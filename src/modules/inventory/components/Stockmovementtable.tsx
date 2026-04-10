import React from "react";
import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineArrowCircleDown,
  HiOutlineArrowCircleUp,
  HiOutlineAdjustments,
} from "react-icons/hi";
import type {
  StockMovementRecord,
  MovementType,
  MovementSource,
} from "../types/Inventory";

const TYPE_CONFIG: Record<
  MovementType,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
    prefix: string;
    qtyColor: string;
    qtyBg: string;
  }
> = {
  in: {
    label: "Stock In",
    color: "green",
    icon: <HiOutlineArrowCircleDown size={13} className="text-emerald-500" />,
    prefix: "+",
    qtyColor: "text-emerald-700",
    qtyBg: "bg-emerald-50",
  },
  out: {
    label: "Stock Out",
    color: "red",
    icon: <HiOutlineArrowCircleUp size={13} className="text-red-500" />,
    prefix: "−",
    qtyColor: "text-red-700",
    qtyBg: "bg-red-50",
  },
  adjust: {
    label: "Adjusted",
    color: "purple",
    icon: <HiOutlineAdjustments size={13} className="text-violet-500" />,
    prefix: "±",
    qtyColor: "text-violet-700",
    qtyBg: "bg-violet-50",
  },
};

const SOURCE_LABEL: Record<MovementSource, string> = {
  purchase: "Purchase",
  production: "Production",
  return: "Return",
  delivery: "Delivery",
  damage: "Damage",
  internal_use: "Internal Use",
  audit_correction: "Audit Correction",
};

interface StockMovementTableProps {
  data: StockMovementRecord[];
  loading?: boolean;
}

const StockMovementTable: React.FC<StockMovementTableProps> = ({
  data,
  loading = false,
}) => {
  const columns: ColumnsType<StockMovementRecord> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 115,
      sorter: (a, b) => a.date.localeCompare(b.date),
      defaultSortOrder: "descend",
      render: (date: string) => (
        <span className="text-[12px] font-semibold text-slate-600 tabular-nums">
          {date}
        </span>
      ),
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      width: 250,
      render: (name: string, record) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-slate-700 leading-tight">
            {name}
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5">
            {record.sku}
          </span>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 115,
      align: "center",
      filters: [
        { text: "Stock In", value: "in" },
        { text: "Stock Out", value: "out" },
        { text: "Adjusted", value: "adjust" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type: MovementType) => {
        const config = TYPE_CONFIG[type];
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
      width: 100,
      align: "center",
      sorter: (a, b) => Math.abs(a.quantity) - Math.abs(b.quantity),
      render: (qty: number, record) => {
        const config = TYPE_CONFIG[record.type];
        const displayQty =
          record.type === "adjust"
            ? qty > 0
              ? `+${qty}`
              : `${qty}`
            : `${config.prefix}${Math.abs(qty)}`;

        return (
          <span
            className={`text-[13px] font-bold tabular-nums px-2.5 py-1 rounded-lg ${config.qtyColor} ${config.qtyBg}`}
          >
            {displayQty}
          </span>
        );
      },
    },
    {
      title: "Balance",
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      width: 100,
      align: "center",
      render: (val: number) => (
        <Tooltip title={`Stock balance after this movement: ${val}`}>
          <span className="text-[12px] font-semibold text-slate-500 tabular-nums">
            {val.toLocaleString("en-IN")}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      width: 130,
      align: "center",
      render: (source: MovementSource) => (
        <span className="text-[12px] text-slate-500 font-medium">
          {SOURCE_LABEL[source]}
        </span>
      ),
    },
    {
      title: "Ref ID",
      dataIndex: "referenceId",
      key: "referenceId",
      width: 150,
      align: "center",
      render: (ref: string) => (
        <Tooltip title={`Reference: ${ref}`}>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded cursor-default">
            {ref}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 120,
      align: "center",
      render: (user: string) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-[10px] font-bold text-slate-500">
              {user
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          <span className="text-[12px] text-slate-600 font-medium">{user}</span>
        </div>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      align: "center",
      width: 100,
      ellipsis: true,
      render: (remarks: string) => (
        <span className="text-[11px] text-slate-400 italic">
          {remarks || "—"}
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      size="small"
      pagination={{
        pageSize: 6,
        showSizeChanger: true,
        pageSizeOptions: ["6", "12", "20"],
        showTotal: (total, range) => (
          <span className="text-[11px] text-slate-400">
            Showing {range[0]}–{range[1]} of {total} movements
          </span>
        ),
      }}
      scroll={{ x: 1000 }}
    />
  );
};

export default StockMovementTable;
