import { useMemo, useCallback } from "react";
import { Tooltip, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import {
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineDotsVertical,
} from "react-icons/hi";
import type { Product, ProductStatus } from "../../products/types/Product";
import {
  STATUS_DISPLAY,
  UNIT_DISPLAY,
  getProductAlertSeverity,
} from "../../products/types/Product";
import { fmt, fmtDate } from "../../products/utils/productHelpers";
import AlertDot from "./AlertDot";

interface UseProductColumnsArgs {
  onView?: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

// Static menu — no per-row state needed since clicks are routed via
// handleMenuClick(record, key) at the Dropdown level.
const ROW_ACTIONS: MenuProps["items"] = [
  {
    key: "view",
    icon: <HiOutlineEye size={14} />,
    label: "View Details",
  },
  {
    key: "edit",
    icon: <HiOutlinePencil size={14} />,
    label: "Edit Product",
  },
  { type: "divider" },
  {
    key: "delete",
    icon: <HiOutlineTrash size={14} />,
    label: "Delete",
    danger: true,
  },
];

export const useProductColumns = ({
  onView,
  onEdit,
  onDelete,
}: UseProductColumnsArgs) => {
  // 🔑 Centralized handler — stops bubbling and routes to correct callback
  const handleMenuClick = useCallback(
    (record: Product, key: string, domEvent: any) => {
      domEvent?.stopPropagation?.();
      domEvent?.preventDefault?.();

      if (key === "view") {
        onView ? onView(record) : onEdit(record);
      } else if (key === "edit") {
        onEdit(record);
      } else if (key === "delete") {
        onDelete?.(record);
      }
    },
    [onView, onEdit, onDelete]
  );

  const columns: ColumnsType<Product> = useMemo(
    () => [
      // ─── PRODUCT ───
      {
        title: "Product",
        key: "product",
        width: 220,
        render: (_, record) => {
          const alertSeverity = getProductAlertSeverity(record);
          const cat = record.category;

          return (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-slate-100 transition-all duration-200 group-hover:scale-105"
                  style={{
                    background: cat?.bg || "#f1f5f9",
                    color: cat?.color || "#64748b",
                  }}
                >
                  <HiOutlineCube size={17} />
                </div>
                {alertSeverity && (
                  <div className="absolute -top-1 -right-1">
                    <AlertDot severity={alertSeverity} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
                  {record.name}
                </p>
                <p className="text-[10px] font-mono text-slate-500 bg-slate-50 ring-1 ring-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">
                  {record.sku}
                </p>
              </div>
            </div>
          );
        },
      },

      // ─── CATEGORY ───
      {
        title: "Category",
        key: "category",
        width: 130,
        align: "center",
        render: (_, record) => {
          const c = record.category;
          if (!c) {
            return (
              <span className="text-[11px] text-slate-400 italic">
                Uncategorized
              </span>
            );
          }
          return (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ring-1 ring-inset"
              style={{
                background: c.bg,
                color: c.color,
                // @ts-ignore
                "--tw-ring-color": `${c.color}20`,
              }}
            >
              <HiOutlineTag size={10} />
              {c.name}
            </span>
          );
        },
      },

      // ─── PRICE ───
      {
        title: "Price",
        key: "price",
        width: 120,
        align: "center",
        sorter: (a, b) => a.basePrice - b.basePrice,
        render: (_, r) => (
          <Tooltip title={`Margin: ₹${fmt(r.basePrice - (r.costPrice || 0))}`}>
            <div className="text-center cursor-default">
              <p className="text-[13px] font-bold text-slate-800 font-mono tabular-nums whitespace-nowrap">
                ₹{fmt(r.basePrice)}
              </p>
              <p className="text-[10px] text-slate-400 font-mono tabular-nums mt-0.5">
                cost ₹{fmt(r.costPrice || 0)}
              </p>
            </div>
          </Tooltip>
        ),
      },

      // ─── STOCK ───
      {
        title: "Stock",
        dataIndex: "stock",
        key: "stock",
        width: 110,
        align: "center",
        sorter: (a, b) => a.stock - b.stock,
        render: (stock: number, r) => {
          const isLow = stock > 0 && stock <= r.minStock;
          const isOut = stock === 0;
          const ratio =
            r.minStock > 0 ? Math.min((stock / r.minStock) * 100, 100) : 100;

          const tooltipText = isOut
            ? "Out of stock — needs immediate restocking"
            : isLow
            ? `Below minimum (${r.minStock}) — reorder needed`
            : `${stock} in stock (min: ${r.minStock})`;

          const textColor = isOut
            ? "text-red-600"
            : isLow
            ? "text-amber-600"
            : "text-slate-700";

          const barColor = isOut
            ? "bg-red-500"
            : isLow
            ? "bg-amber-400"
            : "bg-emerald-400";

          const unitLabel = UNIT_DISPLAY[r.unit]?.slice(0, 3).toLowerCase();

          return (
            <Tooltip title={tooltipText}>
              <div className="flex flex-col items-center gap-1.5 cursor-default">
                <span
                  className={`text-[13px] font-bold font-mono tabular-nums ${textColor}`}
                >
                  {stock}
                  <span className="text-[9px] font-normal text-slate-400 ml-0.5">
                    {unitLabel}
                  </span>
                </span>
                <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${isOut ? 0 : ratio}%` }}
                  />
                </div>
              </div>
            </Tooltip>
          );
        },
      },

      // ─── GST ───
      {
        title: "GST",
        dataIndex: "gstRate",
        key: "gst",
        width: 70,
        align: "center",
        render: (v: number) => (
          <span className="text-[11px] text-slate-500 font-mono tabular-nums font-medium">
            {v}%
          </span>
        ),
      },

      // ─── STATUS ───
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 130,
        align: "center",
        filters: [
          { text: "Active", value: "ACTIVE" },
          { text: "Out of Stock", value: "OUT_OF_STOCK" },
          { text: "Inactive", value: "INACTIVE" },
        ],
        onFilter: (value, record) => record.status === value,
        render: (status: ProductStatus) => {
          const s = STATUS_DISPLAY[status];
          return (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
              style={{ background: s.bg, color: s.color }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${s.dot} ${
                  status === "OUT_OF_STOCK" ? "animate-pulse" : ""
                }`}
              />
              {s.label}
            </span>
          );
        },
      },

      // ─── ADDED ───
      {
        title: "Added",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 110,
        align: "center",
        sorter: (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        render: (d: string) => (
          <span className="text-[11px] text-slate-500 font-mono tabular-nums whitespace-nowrap">
            {fmtDate(d)}
          </span>
        ),
      },

      // ─── ACTIONS ───
      {
        title: "",
        key: "actions",
        width: 56,
        align: "center",
        render: (_, record) => (
          <Dropdown
            menu={{
              items: ROW_ACTIONS,
              onClick: ({ key, domEvent }) =>
                handleMenuClick(record, key, domEvent),
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <HiOutlineDotsVertical size={15} />
            </button>
          </Dropdown>
        ),
      },
    ],
    [handleMenuClick]
  );

  return columns;
};
