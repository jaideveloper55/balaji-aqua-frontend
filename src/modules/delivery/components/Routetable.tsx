import React from "react";
import { Table, Progress, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { HiOutlinePlus, HiOutlineDotsVertical } from "react-icons/hi";
import { RiRouteLine } from "react-icons/ri";

import type { Route } from "../types/delivery";
import { DriverAvatar } from "./Deliveryshared";

interface RouteTableProps {
  data: Route[];
  onAddRoute: () => void;
}

const RouteTable: React.FC<RouteTableProps> = ({ data, onAddRoute }) => {
  const columns: ColumnsType<Route> = [
    {
      title: "Route",
      dataIndex: "name",
      key: "name",
      width: 130,
      render: (name: string) => (
        <span className="font-semibold text-slate-800 text-[13px] flex items-center gap-2">
          <RiRouteLine className="w-4 h-4 text-indigo-500 shrink-0" />
          {name}
        </span>
      ),
    },
    {
      title: "Area Coverage",
      dataIndex: "area",
      key: "area",
      render: (area: string) => (
        <span className="text-[12px] text-slate-500">{area}</span>
      ),
    },
    {
      title: "Driver",
      dataIndex: "driver",
      key: "driver",
      width: 150,
      render: (driver: string) => (
        <span className="inline-flex items-center gap-2 text-[13px] text-slate-700">
          <DriverAvatar name={driver} showTooltip />
          {driver}
        </span>
      ),
    },
    {
      title: "Customers",
      dataIndex: "customers",
      key: "customers",
      width: 100,
      align: "center",
      render: (count: number) => (
        <span className="text-[13px] font-semibold text-slate-700">
          {count}
        </span>
      ),
    },
    {
      title: "Today's Progress",
      key: "progress",
      width: 220,
      render: (_: unknown, record: Route) => {
        const pct = Math.round(
          (record.completedDeliveries / record.totalDeliveries) * 100
        );
        return (
          <Tooltip
            title={`${record.completedDeliveries} of ${record.totalDeliveries} deliveries completed`}
          >
            <div className="flex items-center gap-3">
              <Progress
                percent={pct}
                size="small"
                strokeColor="#6366f1"
                trailColor="#e2e8f0"
                className="flex-1 !mb-0"
                format={(p) => (
                  <span className="text-[11px] font-bold text-slate-600">
                    {p}%
                  </span>
                )}
              />
              <span className="text-[11px] text-slate-400 whitespace-nowrap tabular-nums">
                {record.completedDeliveries}/{record.totalDeliveries}
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
      width: 100,
      render: (status: string) => (
        <span
          className={`px-2.5 py-[3px] rounded-full text-[11px] font-semibold ${
            status === "active"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-400 border border-slate-200"
          }`}
        >
          {status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: () => (
        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <HiOutlineDotsVertical className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <p className="text-[13px] text-slate-500">
          <span className="font-semibold text-slate-700">{data.length}</span>{" "}
          routes configured
        </p>
        <button
          onClick={onAddRoute}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-[12px] font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <HiOutlinePlus className="w-3.5 h-3.5" />
          Add Route
        </button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        size="middle"
        className="delivery-table"
      />
    </div>
  );
};

export default RouteTable;
