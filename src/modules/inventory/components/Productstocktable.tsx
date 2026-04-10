import React from "react";
import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ProductStockRecord, StockStatus } from "../types/Inventory";

const STATUS_CONFIG: Record<
  StockStatus,
  { label: string; color: string; dotColor: string; rowClass: string }
> = {
  in_stock: {
    label: "In Stock",
    color: "green",
    dotColor: "bg-emerald-500",
    rowClass: "",
  },
  low: {
    label: "Low Stock",
    color: "orange",
    dotColor: "bg-amber-500",
    rowClass: "!bg-amber-50/30 hover:!bg-amber-50/50",
  },
  out: {
    label: "Out of Stock",
    color: "red",
    dotColor: "bg-red-500",
    rowClass: "!bg-red-50/25 hover:!bg-red-50/40",
  },
};

interface ProductStockTableProps {
  data: ProductStockRecord[];
  loading?: boolean;
}

const ProductStockTable: React.FC<ProductStockTableProps> = ({
  data,
  loading = false,
}) => {
  const columns: ColumnsType<ProductStockRecord> = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      fixed: "left",
      width: 220,
      render: (name: string, record) => (
        <div className="flex items-center gap-3 py-1">
          {/* Status dot */}
          <div className="flex-shrink-0">
            <div
              className={`w-2 h-2 rounded-full ${
                STATUS_CONFIG[record.status].dotColor
              } ${record.status === "out" ? "animate-pulse" : ""}`}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-slate-800 leading-tight">
              {name}
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded w-fit mt-0.5">
              {record.sku}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 140,
      filters: [
        { text: "Water Products", value: "Water Products" },
        { text: "Accessories", value: "Accessories" },
        { text: "Spare Parts", value: "Spare Parts" },
        { text: "Packaging", value: "Packaging" },
      ],
      onFilter: (value, record) => record.category === value,
      render: (cat: string) => (
        <span className="text-[12px] text-slate-500 font-medium">{cat}</span>
      ),
    },
    {
      title: "Current",
      dataIndex: "currentStock",
      key: "currentStock",
      width: 90,
      align: "center",
      sorter: (a, b) => a.currentStock - b.currentStock,
      render: (val: number, record) => (
        <span
          className={`text-[13px] font-bold tabular-nums ${
            val === 0
              ? "text-red-600"
              : val <= record.reorderLevel
              ? "text-amber-600"
              : "text-slate-700"
          }`}
        >
          {val.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      title: "Reserved",
      dataIndex: "reservedStock",
      key: "reservedStock",
      width: 90,
      align: "center",
      render: (val: number) => (
        <span className="text-[12px] text-slate-400 tabular-nums">
          {val > 0 ? val.toLocaleString("en-IN") : "—"}
        </span>
      ),
    },
    {
      title: "Available",
      dataIndex: "availableStock",
      key: "availableStock",
      width: 110,
      align: "center",
      sorter: (a, b) => a.availableStock - b.availableStock,
      render: (val: number) => (
        <Tooltip
          title={
            val === 0
              ? "No stock available — consider reordering"
              : `${val} units ready for dispatch`
          }
        >
          <span
            className={`inline-flex items-center justify-center min-w-[44px] text-[13px] font-bold px-3 py-1 rounded-lg transition-colors ${
              val === 0
                ? "text-red-700 bg-red-100 ring-1 ring-red-200/60"
                : val < 50
                ? "text-amber-700 bg-amber-50"
                : "text-emerald-700 bg-emerald-50"
            }`}
          >
            {val.toLocaleString("en-IN")}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 70,
      align: "center",
      render: (unit: string) => (
        <span className="text-[11px] text-slate-400 font-medium uppercase">
          {unit}
        </span>
      ),
    },
    {
      title: "Reorder Lvl",
      dataIndex: "reorderLevel",
      key: "reorderLevel",
      width: 100,
      align: "center",
      render: (val: number) => (
        <span className="text-[12px] text-slate-400 tabular-nums font-medium">
          {val}
        </span>
      ),
    },
    {
      title: "Stock Health",
      key: "stockHealth",
      width: 130,
      align: "center",
      render: (_, record) => {
        const ratio =
          record.reorderLevel > 0
            ? record.currentStock / record.reorderLevel
            : record.currentStock > 0
            ? 999
            : 0;
        const percent = Math.min(Math.round(ratio * 100), 100);
        const barColor =
          ratio === 0
            ? "bg-red-500"
            : ratio < 0.5
            ? "bg-red-400"
            : ratio < 1
            ? "bg-amber-500"
            : ratio < 1.5
            ? "bg-emerald-400"
            : "bg-emerald-500";
        const trackColor =
          ratio === 0
            ? "bg-red-100"
            : ratio < 1
            ? "bg-amber-100"
            : "bg-emerald-100";
        const label =
          ratio === 0
            ? "Empty"
            : ratio < 0.5
            ? "Critical"
            : ratio < 1
            ? "Low"
            : ratio < 1.5
            ? "Good"
            : "Healthy";

        return (
          <Tooltip
            title={`${label} — ${record.currentStock} of ${record.reorderLevel} reorder level (${percent}%)`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-20 h-[6px] ${trackColor} rounded-full overflow-hidden`}
              >
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span
                className={`text-[11px] font-bold tabular-nums min-w-[32px] text-right ${
                  ratio === 0
                    ? "text-red-500"
                    : ratio < 1
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
              >
                {percent}%
              </span>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 115,
      align: "center",
      filters: [
        { text: "In Stock", value: "in_stock" },
        { text: "Low Stock", value: "low" },
        { text: "Out of Stock", value: "out" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: StockStatus) => {
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
            Showing {range[0]}–{range[1]} of {total} products
          </span>
        ),
      }}
      rowClassName={(record) => STATUS_CONFIG[record.status].rowClass}
      scroll={{ x: 1050 }}
    />
  );
};

export default ProductStockTable;
