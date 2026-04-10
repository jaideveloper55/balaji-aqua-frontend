import React, { useState, useMemo } from "react";
import { Table, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDotsVertical,
  HiOutlinePhone,
  HiOutlineEye,
  HiOutlineSearch,
} from "react-icons/hi";
import { BsClockHistory, BsArrowRepeat } from "react-icons/bs";
import { IoWaterOutline, IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { RiRouteLine, RiUserLocationLine } from "react-icons/ri";
import { StatusPill, DriverAvatar } from "./Deliveryshared";
import {
  PRIORITY_MAP,
  STATUS_FILTER_OPTIONS,
} from "../constants/Deliveryconstants";
import type { Delivery } from "../types/delivery";
import SearchInput from "../../../components/common/SearchInput";

interface DeliveryTableProps {
  data: Delivery[];
  onViewDetail: (record: Delivery) => void;
  onTrackStatus: (record: Delivery) => void;
  onAssignDriver: (record: Delivery) => void;
  onMarkDelivered: (record: Delivery) => void;
  onReschedule: (record: Delivery) => void;
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({
  data,
  onViewDetail,
  onTrackStatus,
  onAssignDriver,
  onMarkDelivered,
  onReschedule,
}) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const matchStatus = statusFilter === "all" || d.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        d.customer.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.driver.toLowerCase().includes(q) ||
        d.route.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [data, statusFilter, searchQuery]);

  const getRowMenuItems = (record: Delivery): MenuProps["items"] => {
    const items: MenuProps["items"] = [
      {
        key: "view",
        label: (
          <span className="flex items-center gap-2 text-[13px]">
            <HiOutlineEye className="w-4 h-4" /> View Details
          </span>
        ),
        onClick: () => onViewDetail(record),
      },
      {
        key: "timeline",
        label: (
          <span className="flex items-center gap-2 text-[13px]">
            <BsClockHistory className="w-3.5 h-3.5" /> Track Status
          </span>
        ),
        onClick: () => onTrackStatus(record),
      },
    ];
    if (record.status === "pending") {
      items.push({
        key: "assign",
        label: (
          <span className="flex items-center gap-2 text-[13px]">
            <RiUserLocationLine className="w-4 h-4" /> Assign Driver
          </span>
        ),
        onClick: () => onAssignDriver(record),
      });
    }
    if (record.status === "out" || record.status === "pending") {
      items.push({
        key: "delivered",
        label: (
          <span className="flex items-center gap-2 text-[13px] text-emerald-600">
            <IoCheckmarkDoneCircleOutline className="w-4 h-4" /> Mark Delivered
          </span>
        ),
        onClick: () => onMarkDelivered(record),
      });
    }
    if (record.status === "failed" || record.status === "pending") {
      items.push({
        key: "reschedule",
        label: (
          <span className="flex items-center gap-2 text-[13px] text-purple-600">
            <BsArrowRepeat className="w-3.5 h-3.5" /> Reschedule
          </span>
        ),
        onClick: () => onReschedule(record),
      });
    }
    return items;
  };

  const columns: ColumnsType<Delivery> = [
    {
      title: "Delivery ID",
      dataIndex: "id",
      key: "id",
      width: 115,
      fixed: "left",
      render: (id: string) => (
        <span className="font-semibold text-slate-800 text-[13px]">{id}</span>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      width: 190,
      render: (_: string, record: Delivery) => (
        <div>
          <div className="font-medium text-slate-800 text-[13px] leading-tight">
            {record.customer}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <HiOutlinePhone className="w-3 h-3" />
            {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
      width: 105,
      render: (route: string) => (
        <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-600">
          <RiRouteLine className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          {route}
        </span>
      ),
    },
    {
      title: "Driver",
      dataIndex: "driver",
      key: "driver",
      width: 140,
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
      width: 150,
      render: (_: unknown, record: Delivery) => (
        <div className="flex items-center gap-1.5">
          <IoWaterOutline className="w-4 h-4 text-cyan-500 shrink-0" />
          <span className="text-[13px] text-slate-700">
            {record.qty} × {record.items}
          </span>
        </div>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 90,
      render: (priority: string) => {
        const cfg = PRIORITY_MAP[priority as keyof typeof PRIORITY_MAP];
        return (
          <span
            className={`inline-block px-2 py-[3px] rounded-md text-[11px] font-semibold ${cfg.color} ${cfg.bg}`}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Out for Delivery", value: "out" },
        { text: "Delivered", value: "delivered" },
        { text: "Failed", value: "failed" },
        { text: "Rescheduled", value: "rescheduled" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => <StatusPill status={status} />,
    },
    {
      title: "Scheduled",
      dataIndex: "scheduledTime",
      key: "scheduledTime",
      width: 105,
      render: (time: string) => (
        <span className="text-[13px] text-slate-500 flex items-center gap-1">
          <HiOutlineClock className="w-3.5 h-3.5 shrink-0" />
          {time}
        </span>
      ),
    },
    {
      title: "Delivered",
      dataIndex: "deliveredTime",
      key: "deliveredTime",
      width: 105,
      render: (time: string | null) =>
        time ? (
          <span className="text-[13px] text-emerald-600 font-medium flex items-center gap-1">
            <HiOutlineCheckCircle className="w-3.5 h-3.5 shrink-0" />
            {time}
          </span>
        ) : (
          <span className="text-[12px] text-slate-300">—</span>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      fixed: "right",
      render: (_: unknown, record: Delivery) => (
        <Dropdown
          menu={{ items: getRowMenuItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <HiOutlineDotsVertical className="w-4 h-4" />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      {/* Search + Filter bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 flex-wrap">
        <div
          className={`relative min-w-[200px] transition-all duration-300 ease-out ${
            searchFocused ? "max-w-sm flex-[1.5]" : "max-w-xs flex-1"
          }`}
        >
          <HiOutlineSearch
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
              searchFocused ? "text-indigo-500" : "text-slate-400"
            }`}
          />
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by customer, ID, driver, route..."
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-2.5 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200 ${
                statusFilter === opt.value
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: ["8", "15", "25"],
          size: "small",
          showTotal: (total, range) => (
            <span className="text-[11px] text-slate-400">
              Showing {range[0]}–{range[1]} of {total} deliveries
            </span>
          ),
        }}
        scroll={{ x: 1300 }}
        size="middle"
        className="delivery-table"
        rowClassName={(record) =>
          record.priority === "urgent"
            ? "!bg-red-50/40"
            : record.priority === "high"
            ? "!bg-orange-50/30"
            : ""
        }
      />
    </div>
  );
};

export default DeliveryTable;
