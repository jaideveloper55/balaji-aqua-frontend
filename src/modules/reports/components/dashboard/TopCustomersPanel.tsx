import React from "react";
import { Table, Avatar, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineDownload,
  HiOutlineUsers,
} from "react-icons/hi";
import { TopCustomer } from "../../types/Reports";
import { exportData } from "../../utils/export";
import { formatINR } from "../../utils/format";
import SectionCard from "../SectionCard";


interface Props {
  data: TopCustomer[];
  loading?: boolean;
}

const TopCustomersPanel: React.FC<Props> = ({ data, loading }) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  const columns: ColumnsType<TopCustomer> = [
    {
      title: "Rank",
      key: "rank",
      width: 60,
      render: (_, __, idx) => (
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
            idx === 0
              ? "bg-amber-100 text-amber-700"
              : idx === 1
              ? "bg-slate-200 text-slate-700"
              : idx === 2
              ? "bg-orange-100 text-orange-700"
              : "bg-slate-50 text-slate-500"
          }`}
        >
          {idx + 1}
        </span>
      ),
    },
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (name: string, row) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={36}
            style={{
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              fontWeight: 600,
            }}
          >
            {name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-slate-800">{name}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              {row.type === "Commercial" ? (
                <HiOutlineOfficeBuilding size={12} />
              ) : (
                <HiOutlineHome size={12} />
              )}
              {row.type}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",
      width: 100,
      sorter: (a, b) => a.orders - b.orders,
      render: (n: number) => (
        <span className="text-sm font-semibold text-slate-700 tabular-nums">
          {n}
        </span>
      ),
    },
    {
      title: "Revenue",
      key: "revenue",
      width: 220,
      sorter: (a, b) => a.revenue - b.revenue,
      defaultSortOrder: "descend",
      render: (_, row) => {
        const pct = (row.revenue / maxRevenue) * 100;
        return (
          <div>
            <p className="text-sm font-bold text-slate-900 tabular-nums mb-1">
              {formatINR(row.revenue, true)}
            </p>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: "Outstanding",
      dataIndex: "outstanding",
      key: "outstanding",
      width: 130,
      render: (n: number) => (
        <span
          className={`text-sm font-semibold tabular-nums ${
            n > 0 ? "text-red-600" : "text-slate-400"
          }`}
        >
          {n > 0 ? formatINR(n) : "Nil"}
        </span>
      ),
    },
    {
      title: "Last Order",
      dataIndex: "lastOrder",
      key: "lastOrder",
      width: 130,
      render: (d: string) => (
        <span className="text-sm text-slate-600">
          {new Date(d).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  const handleExport = () => {
    exportData("excel", {
      filename: "top-customers",
      title: "Top Customers Report",
      meta: [
        { label: "Total Customers", value: String(data.length) },
        {
          label: "Combined Revenue",
          value: formatINR(data.reduce((s, d) => s + d.revenue, 0)),
        },
      ],
      columns: [
        { key: "name", label: "Customer" },
        { key: "type", label: "Type" },
        { key: "orders", label: "Orders" },
        { key: "revenue", label: "Revenue (₹)" },
        { key: "outstanding", label: "Outstanding (₹)" },
        { key: "lastOrder", label: "Last Order" },
      ],
      rows: data,
    });
  };

  return (
    <SectionCard
      title="Top Customers"
      subtitle="Highest revenue contributors"
      icon={<HiOutlineUsers size={16} />}
      iconBg="bg-gradient-to-br from-blue-50 to-blue-100"
      iconColor="text-blue-600"
      action={
        <Button
          icon={<HiOutlineDownload size={14} />}
          onClick={handleExport}
          className="!rounded-lg !h-8"
        >
          Export
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 850 }}
      />
    </SectionCard>
  );
};

export default TopCustomersPanel;
