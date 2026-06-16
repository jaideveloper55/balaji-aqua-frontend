// src/modules/inventory/components/Productstocktable.tsx
import { Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineAdjustments,
  HiOutlineInbox,
} from "react-icons/hi";
import {
  StockItem,
  MovementType,
  getAvailable,
  getStockStatus,
  getStockHealth,
} from "../types/Inventory";
import {
  STOCK_STATUS_CONFIG,
  TABLE_PAGE_SIZE,
} from "../constants/Inventoryconstants";

interface ProductstocktableProps {
  items: StockItem[];
  loading?: boolean;
  /** Row-level quick action → opens StockEntryModal pre-filled */
  onQuickAction: (item: StockItem, mode: MovementType) => void;
}

const Productstocktable = ({
  items,
  loading,
  onQuickAction,
}: ProductstocktableProps) => {
  const columns: ColumnsType<StockItem> = [
    {
      title: "Product",
      key: "product",
      width: 200,
      fixed: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, r) => {
        const status = getStockStatus(r);
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: STOCK_STATUS_CONFIG[status].color }}
            />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 truncate">
                {r.name}
              </p>
              <p className="text-[11px] font-mono text-slate-400">{r.sku}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 140,
      align: "center",
      render: (v) => <span className="text-[12px] text-slate-500">{v}</span>,
    },
    {
      title: "Current",
      dataIndex: "current",
      align: "center",
      width: 90,
      sorter: (a, b) => a.current - b.current,
      render: (v) => (
        <span className="text-[13px] font-bold text-slate-800 tabular-nums">
          {v.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      title: (
        <Tooltip title="Committed to pending orders / deliveries">
          <span className="cursor-help border-b border-dashed border-slate-300">
            Reserved
          </span>
        </Tooltip>
      ),
      dataIndex: "reserved",
      align: "center",
      width: 95,
      render: (v) => (
        <span className="text-[13px] text-slate-500 tabular-nums">
          {v.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      title: (
        <Tooltip title="Current − Reserved: what you can actually promise">
          <span className="cursor-help border-b border-dashed border-slate-300">
            Available
          </span>
        </Tooltip>
      ),
      key: "available",
      align: "center",
      width: 100,
      sorter: (a, b) => getAvailable(a) - getAvailable(b),
      render: (_, r) => (
        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[13px] font-bold tabular-nums">
          {getAvailable(r).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      width: 70,
      align: "center",
      render: (v) => (
        <span className="text-[11px] font-mono text-slate-400">{v}</span>
      ),
    },
    {
      title: "Reorder Lvl",
      dataIndex: "reorderLevel",
      align: "center",
      width: 105,
      render: (v) => (
        <span className="text-[12px] text-slate-500 tabular-nums">{v}</span>
      ),
    },
    {
      title: "Stock Health",
      key: "health",
      align: "center",
      width: 130,
      render: (_, r) => {
        const status = getStockStatus(r);
        const health = getStockHealth(r);
        const cfg = STOCK_STATUS_CONFIG[status];
        return (
          <div className="text-center">
            <span
              className="text-[15px] font-black tabular-nums w-9 text-right"
              style={{ color: cfg.color }}
            >
              {health}%
            </span>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      width: 120,
      filters: Object.entries(STOCK_STATUS_CONFIG).map(([k, v]) => ({
        text: v.label,
        value: k,
      })),
      onFilter: (value, r) => getStockStatus(r) === value,
      render: (_, r) => {
        const cfg = STOCK_STATUS_CONFIG[getStockStatus(r)];
        return (
          <span
            className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold border"
            style={{
              color: cfg.color,
              background: cfg.bg,
              borderColor: cfg.border,
            }}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "actions",
      align: "center",
      width: 110,
      render: (_, r) => (
        <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          <Tooltip title="Stock In">
            <button
              type="button"
              onClick={() => onQuickAction(r, "stock_in")}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
              aria-label={`Stock in ${r.name}`}
            >
              <HiOutlineArrowDown size={15} />
            </button>
          </Tooltip>
          <Tooltip title="Stock Out">
            <button
              type="button"
              onClick={() => onQuickAction(r, "stock_out")}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              aria-label={`Stock out ${r.name}`}
            >
              <HiOutlineArrowUp size={15} />
            </button>
          </Tooltip>
          <Tooltip title="Adjust">
            <button
              type="button"
              onClick={() => onQuickAction(r, "adjustment")}
              className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
              aria-label={`Adjust ${r.name}`}
            >
              <HiOutlineAdjustments size={15} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table<StockItem>
      rowKey="id"
      columns={columns}
      dataSource={items}
      loading={loading}
      size="middle"
      scroll={{ x: 1100 }}
      pagination={{
        pageSize: TABLE_PAGE_SIZE,
        showSizeChanger: true,
        showTotal: (t, range) => `Showing ${range[0]}–${range[1]} of ${t}`,
      }}
      locale={{
        emptyText: (
          <div className="py-10 flex flex-col items-center gap-2 text-slate-400">
            <HiOutlineInbox size={32} />
            <p className="text-sm font-medium">No products match the filters</p>
            <p className="text-xs">Try clearing search or filters above</p>
          </div>
        ),
      }}
    />
  );
};

export default Productstocktable;
