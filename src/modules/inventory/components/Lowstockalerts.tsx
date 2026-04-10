import React from "react";
import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import type { LowStockAlertRecord } from "../types/Inventory";

interface LowStockAlertsProps {
  data: LowStockAlertRecord[];
  loading?: boolean;
  onReorder?: (record: LowStockAlertRecord) => void;
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({
  data,
  loading = false,
}) => {
  const columns: ColumnsType<LowStockAlertRecord> = [
    {
      title: "Priority",
      key: "priority",
      width: 80,
      align: "center",
      sorter: (a, b) => {
        const order = { critical: 0, low: 1 };
        return order[a.status] - order[b.status];
      },
      defaultSortOrder: "ascend",
      render: (_, record) => {
        const isCritical = record.status === "critical";
        return (
          <Tooltip
            title={
              isCritical
                ? "Critical — Out of stock or severely low. Reorder immediately!"
                : "Warning — Below reorder level. Plan to reorder soon."
            }
          >
            <div className="flex items-center justify-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isCritical ? "bg-red-100" : "bg-amber-100"
                }`}
              >
                <HiOutlineExclamationCircle
                  size={17}
                  className={`${
                    isCritical ? "text-red-500 animate-pulse" : "text-amber-500"
                  }`}
                />
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      width:200,
      render: (name: string, record) => (
        <div className="flex flex-col py-0.5">
          <span className="text-[13px] font-semibold text-slate-800 leading-tight">
            {name}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
              {record.sku}
            </span>
            <span className="text-[10px] text-slate-400">
              {record.category}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Stock Level",
      key: "stockLevel",
      width: 160,
      align:"center",
      render: (_, record) => {
        const ratio =
          record.reorderLevel > 0
            ? (record.currentStock / record.reorderLevel) * 100
            : 0;
        const clampedRatio = Math.min(ratio, 100);
        return (
          <div className="flex flex-col  gap-1.5">
            <div className="flex items-center justify-between">
              <span
                className={`text-[13px] font-bold tabular-nums ${
                  record.currentStock === 0 ? "text-red-600" : "text-amber-600"
                }`}
              >
                {record.currentStock === 0 ? (
                  <Tag
                    color="red"
                    className="!text-[10px] !font-bold !m-0 !px-2"
                  >
                    OUT OF STOCK
                  </Tag>
                ) : (
                  record.currentStock
                )}
              </span>
              <span className="text-[10px] text-slate-400 tabular-nums">
                / {record.reorderLevel}
              </span>
            </div>
            <div className="w-full h-[4px] bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  ratio === 0
                    ? "bg-red-500"
                    : ratio < 30
                    ? "bg-red-400"
                    : "bg-amber-400"
                }`}
                style={{ width: `${clampedRatio}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: "Deficit",
      dataIndex: "deficit",
      key: "deficit",
      width: 120,
      align: "center",
      sorter: (a, b) => a.deficit - b.deficit,
      render: (val: number) => (
        <span className="text-[13px] font-bold text-red-600 tabular-nums bg-red-50 px-2.5 py-1 rounded-lg inline-block">
          −{val}
        </span>
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 80,
      align: "center",
      render: (unit: string) => (
        <span className="text-[11px] text-slate-400 uppercase font-medium">
          {unit}
        </span>
      ),
    },
    {
      title: "Last Ordered",
      dataIndex: "lastOrdered",
      key: "lastOrdered",
      width: 120,
      align: "center",
      render: (date: string | null) => (
        <span
          className={`text-[12px] tabular-nums font-medium ${
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
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      size="middle"
      pagination={false}
      rowClassName={(record) =>
        record.status === "critical"
          ? "!bg-red-50/30 hover:!bg-red-50/50"
          : "!bg-amber-50/20 hover:!bg-amber-50/40"
      }
      scroll={{ x: 750 }}
    />
  );
};

export default LowStockAlerts;
