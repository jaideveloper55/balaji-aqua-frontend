import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { HiOutlineDownload } from "react-icons/hi";
import { BsCalendar3 } from "react-icons/bs";
import { useForm } from "react-hook-form";
import type { DeliveryHistory } from "../types/delivery";
import CustomDateRange from "../../../components/common/CustomDateRange";
import { DriverAvatar, StatusPill } from "./Deliveryshared";

interface DeliveryHistoryTableProps {
  data: DeliveryHistory[];
}

const DeliveryHistoryTable: React.FC<DeliveryHistoryTableProps> = ({
  data,
}) => {
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { dateRange: null },
  });

  const columns: ColumnsType<DeliveryHistory> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 110,
      render: (id: string) => (
        <span className="font-semibold text-slate-700 text-[13px]">{id}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 130,
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: "descend",
      render: (date: string) => (
        <span className="text-[13px] text-slate-500 flex items-center gap-1.5 tabular-nums">
          <BsCalendar3 className="w-3 h-3 shrink-0" />
          {date}
        </span>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (v: string) => (
        <span className="text-[13px] text-slate-700 font-medium">{v}</span>
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
      title: "Items",
      key: "items",
      width: 140,
      render: (_: unknown, r: DeliveryHistory) => (
        <span className="text-[13px] text-slate-600 tabular-nums">
          {r.qty} × {r.items}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      filters: [
        { text: "Delivered", value: "delivered" },
        { text: "Failed", value: "failed" },
        { text: "Rescheduled", value: "rescheduled" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => <StatusPill status={status} />,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (v: string) => (
        <span className="text-[12px] text-slate-400 italic">{v || "—"}</span>
      ),
    },
  ];

  return (
    <div>
      {/* Filters row */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-[280px] max-w-sm">
          <CustomDateRange
            name="dateRange"
            control={control}
            errors={errors}
            placeholder={["From Date", "To Date"]}
            size="middle"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-medium rounded-xl hover:bg-slate-100 transition-colors">
          <HiOutlineDownload className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          pageSize: 10,
          size: "small",
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) => (
            <span className="text-[11px] text-slate-400">
              Showing {range[0]}–{range[1]} of {total} records
            </span>
          ),
        }}
        size="middle"
        className="delivery-table"
      />
    </div>
  );
};

export default DeliveryHistoryTable;
