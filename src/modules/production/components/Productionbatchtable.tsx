import React from "react";
import { Table, Tooltip, Dropdown, Avatar } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineDotsVertical,
  HiOutlinePencilAlt,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineClipboardCheck,
} from "react-icons/hi";
import { TbBuildingFactory2 } from "react-icons/tb";
import {
  ProductionBatch,
  ProductionStatus,
  ProductionShift,
  QualityResult,
} from "../types/Production";
import {
  STATUS_COLORS,
  QUALITY_COLORS,
  SHIFT_BADGE,
} from "../constants/Production.constants";

interface Props {
  data: ProductionBatch[];
  loading?: boolean;
  onView?: (batch: ProductionBatch) => void;
  onEdit?: (batch: ProductionBatch) => void;
  onDelete?: (batch: ProductionBatch) => void;
  onQC?: (batch: ProductionBatch) => void;
}

const StatusPill: React.FC<{ status: ProductionStatus }> = ({ status }) => {
  const s = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: s.dot }}
      />
      {s.label}
    </span>
  );
};

const QualityPill: React.FC<{ q: QualityResult }> = ({ q }) => {
  const s = QUALITY_COLORS[q];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
};

const ShiftPill: React.FC<{ shift: ProductionShift }> = ({ shift }) => {
  const s = SHIFT_BADGE[shift];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
};

const ProductionBatchTable: React.FC<Props> = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
  onQC,
}) => {
  const columns: ColumnsType<ProductionBatch> = [
    {
      title: "Batch",
      dataIndex: "batchNo",
      key: "batchNo",
      fixed: "left",
      width: 220,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <TbBuildingFactory2 size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 text-sm truncate">
              {row.batchNo}
            </p>
            <p className="text-xs text-slate-500 truncate">{row.product}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Date / Shift",
      key: "date",
      width: 160,
      render: (_, row) => (
        <div>
          <p className="text-sm font-medium text-slate-700">
            {new Date(row.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <div className="mt-1">
            <ShiftPill shift={row.shift} />
          </div>
        </div>
      ),
    },
    {
      title: "Target → Produced",
      key: "production",
      width: 200,
      render: (_, row) => {
        const pct = Math.round((row.producedUnits / row.targetUnits) * 100);
        return (
          <div className="min-w-[160px]">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm font-semibold text-slate-800 tabular-nums">
                {row.producedUnits.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 tabular-nums">
                / {row.targetUnits.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  background:
                    pct >= 100 ? "#10B981" : pct >= 80 ? "#0EA5E9" : "#F59E0B",
                }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              {pct}% of target
            </p>
          </div>
        );
      },
    },
    {
      title: "Yield (L)",
      key: "yield",
      width: 130,
      render: (_, row) => {
        const yieldPct = Math.round((row.outputLitres / row.inputLitres) * 100);
        return (
          <div>
            <p className="text-sm font-semibold text-slate-800 tabular-nums">
              {row.outputLitres.toLocaleString()} L
            </p>
            <p className="text-[11px] text-slate-500">
              <span
                className={
                  yieldPct >= 95 ? "text-emerald-600" : "text-amber-600"
                }
              >
                {yieldPct}% yield
              </span>
            </p>
          </div>
        );
      },
    },
    {
      title: "Cost / Unit",
      key: "cost",
      width: 130,
      sorter: (a, b) => a.costPerUnit - b.costPerUnit,
      render: (_, row) => (
        <Tooltip title={`Total: ₹${row.totalCost.toLocaleString()}`}>
          <div>
            <p className="text-sm font-bold text-slate-800 tabular-nums">
              ₹{row.costPerUnit.toFixed(2)}
            </p>
            <p className="text-[11px] text-slate-400">
              ₹{row.totalCost.toLocaleString()} total
            </p>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Quality",
      dataIndex: "quality",
      key: "quality",
      width: 110,
      render: (q: QualityResult) => <QualityPill q={q} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (s: ProductionStatus) => <StatusPill status={s} />,
    },
    {
      title: "Operator",
      dataIndex: "operator",
      key: "operator",
      width: 160,
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <Avatar
            size={28}
            style={{
              background: "linear-gradient(135deg,#0EA5E9,#6366F1)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </Avatar>
          <span className="text-sm text-slate-700 truncate">{name}</span>
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 60,
      fixed: "right",
      render: (_, row) => (
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: [
              {
                key: "view",
                label: "View Details",
                icon: <HiOutlineEye />,
                onClick: () => onView?.(row),
              },
              {
                key: "edit",
                label: "Edit Batch",
                icon: <HiOutlinePencilAlt />,
                onClick: () => onEdit?.(row),
              },
              {
                key: "qc",
                label: "Quality Check",
                icon: <HiOutlineClipboardCheck />,
                onClick: () => onQC?.(row),
              },
              { type: "divider" },
              {
                key: "delete",
                label: "Delete",
                icon: <HiOutlineTrash />,
                danger: true,
                onClick: () => onDelete?.(row),
              },
            ],
          }}
        >
          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <HiOutlineDotsVertical className="text-slate-500" size={18} />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1300 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `Showing ${range[0]}–${range[1]} of ${total} batches`,
      }}
      className="production-table"
    />
  );
};

export default ProductionBatchTable;
