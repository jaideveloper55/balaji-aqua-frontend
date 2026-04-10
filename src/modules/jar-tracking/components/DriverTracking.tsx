import React from "react";
import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import type { DriverRecord } from "../types/JarTracking";

const MiniProgress: React.FC<{ percent: number; label?: string }> = ({
  percent,
  label,
}) => {
  const color =
    percent >= 80
      ? "bg-emerald-500"
      : percent >= 50
      ? "bg-amber-500"
      : "bg-red-500";
  const trackColor =
    percent >= 80
      ? "bg-emerald-100"
      : percent >= 50
      ? "bg-amber-100"
      : "bg-red-100";
  const textColor =
    percent >= 80
      ? "text-emerald-600"
      : percent >= 50
      ? "text-amber-600"
      : "text-red-600";

  return (
    <Tooltip title={label || `${percent}% return rate`}>
      <div className="flex items-center gap-2.5 cursor-default">
        <div
          className={`w-20 h-[6px] ${trackColor} rounded-full overflow-hidden`}
        >
          <div
            className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <span
          className={`text-[11px] font-bold tabular-nums min-w-[32px] text-right ${textColor}`}
        >
          {percent}%
        </span>
      </div>
    </Tooltip>
  );
};

interface DriverTrackingProps {
  data: DriverRecord[];
  loading?: boolean;
}

const DriverTracking: React.FC<DriverTrackingProps> = ({
  data,
  loading = false,
}) => {
  const columns: ColumnsType<DriverRecord> = [
    {
      title: "Driver",
      dataIndex: "driverName",
      key: "driverName",
      render: (name: string, record) => (
        <div className="flex items-center gap-3">
          {/* Avatar initials */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 border border-blue-100 transition-transform duration-200 hover:scale-110">
            <span className="text-[10px] font-bold text-blue-600">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-slate-800 leading-tight">
              {name}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <HiOutlinePhone size={10} className="text-slate-300" />
              {record.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
      render: (route: string) => (
        <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
          <HiOutlineLocationMarker size={12} className="text-slate-300" />
          {route}
        </span>
      ),
    },
    {
      title: "Issued Today",
      dataIndex: "issuedToday",
      key: "issuedToday",
      align: "center",
      width: 110,
      sorter: (a, b) => a.issuedToday - b.issuedToday,
      render: (val: number) => (
        <span className="text-[13px] font-bold text-blue-600 tabular-nums bg-blue-50 px-2.5 py-1 rounded-lg">
          {val}
        </span>
      ),
    },
    {
      title: "Returned Today",
      dataIndex: "returnedToday",
      key: "returnedToday",
      align: "center",
      width: 120,
      sorter: (a, b) => a.returnedToday - b.returnedToday,
      render: (val: number) => (
        <span className="text-[13px] font-bold text-emerald-600 tabular-nums bg-emerald-50 px-2.5 py-1 rounded-lg">
          {val}
        </span>
      ),
    },
    {
      title: "Pending",
      dataIndex: "pending",
      key: "pending",
      align: "center",
      width: 90,
      sorter: (a, b) => a.pending - b.pending,
      render: (val: number) => (
        <Tooltip
          title={
            val > 20
              ? "High pending — follow up required"
              : val > 10
              ? "Moderate pending"
              : "On track"
          }
        >
          <Tag
            color={val > 20 ? "red" : val > 10 ? "orange" : "green"}
            className="!text-[11px] !font-bold !px-2.5 !py-0.5 !m-0 !tabular-nums !rounded-md"
          >
            {val}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Return Rate",
      key: "returnRate",
      width: 160,
      sorter: (a, b) => {
        const rateA =
          a.issuedToday > 0
            ? Math.round((a.returnedToday / a.issuedToday) * 100)
            : 0;
        const rateB =
          b.issuedToday > 0
            ? Math.round((b.returnedToday / b.issuedToday) * 100)
            : 0;
        return rateA - rateB;
      },
      render: (_, record) => {
        const rate =
          record.issuedToday > 0
            ? Math.round((record.returnedToday / record.issuedToday) * 100)
            : 0;
        return (
          <MiniProgress
            percent={rate}
            label={`${record.returnedToday} of ${record.issuedToday} returned (${rate}%)`}
          />
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
      pagination={false}
      scroll={{ x: 700 }}
    />
  );
};

export default DriverTracking;
