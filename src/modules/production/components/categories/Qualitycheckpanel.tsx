import React from "react";
import { Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { HiOutlineBeaker } from "react-icons/hi";
import { QUALITY_COLORS, QUALITY_RANGES } from "../../constants/Production.constants";
import { QualityCheck, QualityResult } from "../../types/Production";

interface Props {
  data: QualityCheck[];
  loading?: boolean;
}

const StatusBadge: React.FC<{ q: QualityResult }> = ({ q }) => {
  const s = QUALITY_COLORS[q];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: s.color }}
      />
      {s.label}
    </span>
  );
};

const RangeCell: React.FC<{
  value: number;
  range: { min: number; max: number; unit: string };
  label: string;
}> = ({ value, range, label }) => {
  const inRange = value >= range.min && value <= range.max;
  const span = range.max - range.min;
  const pos = Math.max(0, Math.min(100, ((value - range.min) / span) * 100));

  return (
    <Tooltip
      title={`${label}: ${value}${range.unit} (Range: ${range.min}-${range.max}${range.unit})`}
    >
      <div className="min-w-[100px]">
        <div className="flex items-baseline justify-between mb-1">
          <span
            className={`text-sm font-bold tabular-nums ${
              inRange ? "text-slate-800" : "text-red-600"
            }`}
          >
            {value}
            <span className="text-[10px] text-slate-400 ml-0.5">
              {range.unit}
            </span>
          </span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full relative overflow-hidden">
          <div
            className="absolute top-0 h-full rounded-full"
            style={{
              left: 0,
              width: `${pos}%`,
              background: inRange ? "#10B981" : "#EF4444",
            }}
          />
        </div>
      </div>
    </Tooltip>
  );
};

const QualityCheckPanel: React.FC<Props> = ({ data, loading }) => {
  const columns: ColumnsType<QualityCheck> = [
    {
      title: "Batch / Date",
      key: "batch",
      width: 180,
      fixed: "left",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white shrink-0">
            <HiOutlineBeaker size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {row.batchNo}
            </p>
            <p className="text-[11px] text-slate-500">
              {new Date(row.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "TDS",
      dataIndex: "tds",
      key: "tds",
      width: 130,
      render: (v: number) => (
        <RangeCell value={v} range={QUALITY_RANGES.tds} label="TDS" />
      ),
    },
    {
      title: "pH",
      dataIndex: "ph",
      key: "ph",
      width: 130,
      render: (v: number) => (
        <RangeCell value={v} range={QUALITY_RANGES.ph} label="pH" />
      ),
    },
    {
      title: "Temp",
      dataIndex: "temperature",
      key: "temperature",
      width: 130,
      render: (v: number) => (
        <RangeCell
          value={v}
          range={QUALITY_RANGES.temperature}
          label="Temperature"
        />
      ),
    },
    {
      title: "Hardness",
      dataIndex: "hardness",
      key: "hardness",
      width: 130,
      render: (v: number) => (
        <RangeCell value={v} range={QUALITY_RANGES.hardness} label="Hardness" />
      ),
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      width: 110,
      render: (q: QualityResult) => <StatusBadge q={q} />,
    },
    {
      title: "Inspector",
      dataIndex: "inspector",
      key: "inspector",
      width: 140,
      render: (name: string) => (
        <span className="text-sm text-slate-700">{name}</span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 950 }}
      pagination={{ pageSize: 8 }}
    />
  );
};

export default QualityCheckPanel;
