import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { HiOutlineInbox } from "react-icons/hi";
import { StockMovement } from "../types/Inventory";
import {
  MOVEMENT_TYPE_CONFIG,
  MOVEMENTS_PAGE_SIZE,
  SOURCE_LABELS,
} from "../constants/Inventoryconstants";

interface StockmovementtableProps {
  movements: StockMovement[];
  loading?: boolean;
}

const Stockmovementtable = ({
  movements,
  loading,
}: StockmovementtableProps) => {
  const columns: ColumnsType<StockMovement> = [
    {
      title: "Date",
      dataIndex: "date",
      width: 150,
      sorter: (a, b) => a.date.localeCompare(b.date),
      defaultSortOrder: "descend",

      render: (v: string) => (
        <span className="text-[12px] text-slate-600 tabular-nums">
          {new Date(v).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      title: "Product",
      key: "product",
      align: "center",
      render: (_, r) => (
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-slate-800 truncate">
            {r.product.name}
          </p>
          <p className="text-[11px] font-mono text-slate-400">
            {r.product.sku}
          </p>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      align: "center",
      width: 130,
      filters: Object.entries(MOVEMENT_TYPE_CONFIG).map(([k, v]) => ({
        text: v.label,
        value: k,
      })),
      onFilter: (value, r) => r.type === value,
      render: (t: StockMovement["type"]) => {
        const cfg = MOVEMENT_TYPE_CONFIG[t];
        return (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
            style={{ color: cfg.color, background: cfg.bg }}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: "Qty",
      key: "qty",
      align: "center",
      width: 90,

      sorter: (a, b) => a.quantity - b.quantity,
      render: (_, r) => {
        const cfg = MOVEMENT_TYPE_CONFIG[r.type];
        const mag = Math.abs(r.quantity);
        const symbol =
          r.type === "ADJUSTMENT"
            ? r.quantity >= 0
              ? "+"
              : "−"
            : cfg.sign > 0
            ? "+"
            : "−";
        return (
          <span
            className="inline-block px-2 py-0.5 rounded-md text-[13px] font-bold tabular-nums"
            style={{ color: cfg.color, background: cfg.bg }}
          >
            {`${symbol}${mag.toLocaleString("en-IN")}`}
          </span>
        );
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      align: "center",
      width: 90,
      render: (v: number) => (
        <span className="text-[13px] text-slate-600 font-semibold tabular-nums">
          {v.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      width: 140,
      align: "center",
      render: (s: string) => (
        <span className="text-[12px] text-slate-500">
          {SOURCE_LABELS[s] ?? s}
        </span>
      ),
    },
    {
      title: "Ref ID",
      dataIndex: "referenceId",
      width: 170,
      align: "center",
      render: (v: string | null) =>
        v ? (
          <span className="inline-block px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-500">
            {v}
          </span>
        ) : (
          <span className="text-slate-200">—</span>
        ),
    },
    {
      title: "User",
      dataIndex: "user",
      width: 130,
      align: "center",
      render: (v: string) => (
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold flex items-center justify-center">
            {v
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <span className="text-[12px] text-slate-600">{v}</span>
        </div>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      align: "center",
      render: (v: string | null) =>
        v ? (
          <span className="text-[12px] font-medium  text-slate-600">{v}</span>
        ) : (
          <span className="text-slate-200">—</span>
        ),
    },
  ];

  return (
    <Table<StockMovement>
      rowKey="id"
      columns={columns}
      dataSource={movements}
      loading={loading}
      size="middle"
      scroll={{ x: 1050 }}
      pagination={{
        pageSize: MOVEMENTS_PAGE_SIZE,
        showTotal: (t, range) =>
          `Showing ${range[0]}–${range[1]} of ${t} movements`,
      }}
      locale={{
        emptyText: (
          <div className="py-10 flex flex-col items-center gap-2 text-slate-400">
            <HiOutlineInbox size={32} />
            <p className="text-sm font-medium">No movements in this range</p>
            <p className="text-xs">Adjust the date range or filters</p>
          </div>
        ),
      }}
    />
  );
};

export default Stockmovementtable;
