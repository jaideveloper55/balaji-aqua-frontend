import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Select, Tag, Dropdown } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  HiOutlineSearch,
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";
import { customerApi } from "../services/Customer.api";
import type { Customer, CustomerStatus, CustomerType } from "../types/Customer";

const STATUS_MAP: Record<CustomerStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "green" },
  inactive: { label: "Inactive", color: "default" },
  pending: { label: "Pending", color: "orange" },
};

const TYPE_MAP: Record<CustomerType, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
};

interface CustomerTableProps {
  onView?: (customer: Customer) => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  onView,
  onEdit,
  onDelete,
}) => {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    CustomerStatus | undefined
  >();
  const [typeFilter, setTypeFilter] = useState<CustomerType | undefined>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customerApi.getCustomers({
        page,
        pageSize,
        search: search || undefined,
        status: statusFilter,
        type: typeFilter,
      });
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, typeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const columns: ColumnsType<Customer> = [
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      width: 260,
      render: (_, r) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-slate-800">{r.name}</span>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <HiOutlinePhone size={11} />
              {r.phone}
            </span>
            {r.email && (
              <span className="flex items-center gap-1">
                <HiOutlineMail size={11} />
                {r.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: string) => (
        <span className="text-xs font-mono font-medium text-slate-500">
          {id}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (t: CustomerType) => (
        <span className="text-xs font-medium text-slate-600">
          {TYPE_MAP[t]}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (s: CustomerStatus) => (
        <Tag color={STATUS_MAP[s].color}>{STATUS_MAP[s].label}</Tag>
      ),
    },
    {
      title: "Outstanding",
      dataIndex: "outstandingBalance",
      key: "balance",
      width: 130,
      align: "right",
      sorter: (a, b) => a.outstandingBalance - b.outstandingBalance,
      render: (v: number) => (
        <span
          className={`text-sm font-semibold tabular-nums ${v > 0 ? "text-red-500" : "text-green-600"}`}
        >
          {v > 0 ? `₹${v.toLocaleString("en-IN")}` : "Nil"}
        </span>
      ),
    },
    {
      title: "Orders",
      dataIndex: "totalOrders",
      key: "orders",
      width: 90,
      align: "center",
      sorter: (a, b) => a.totalOrders - b.totalOrders,
      render: (v: number) => (
        <span className="text-sm font-medium text-slate-700 tabular-nums">
          {v}
        </span>
      ),
    },
    {
      title: "Joined",
      dataIndex: "joinedAt",
      key: "joined",
      width: 110,
      render: (d: string) => (
        <span className="text-xs text-slate-500">
          {new Date(d).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      fixed: "right",
      render: (_, r) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "View Details",
                icon: <HiOutlineEye size={14} />,
                onClick: () => onView?.(r),
              },
              {
                key: "edit",
                label: "Edit",
                icon: <HiOutlinePencil size={14} />,
                onClick: () => onEdit?.(r),
              },
              { type: "divider" },
              {
                key: "delete",
                label: "Delete",
                icon: <HiOutlineTrash size={14} />,
                danger: true,
                onClick: () => onDelete?.(r),
              },
            ],
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
            <HiOutlineDotsVertical size={16} />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search name, phone, ID..."
          prefix={<HiOutlineSearch size={15} className="text-slate-400" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          allowClear
          className="!w-64"
        />
        <Select
          placeholder="Status"
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
          allowClear
          className="!w-32"
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "pending", label: "Pending" },
          ]}
        />
        <Select
          placeholder="Type"
          value={typeFilter}
          onChange={(v) => {
            setTypeFilter(v);
            setPage(1);
          }}
          allowClear
          className="!w-36"
          options={[
            { value: "residential", label: "Residential" },
            { value: "commercial", label: "Commercial" },
            { value: "industrial", label: "Industrial" },
          ]}
        />
      </div>

      <Table<Customer>
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
        size="middle"
        scroll={{ x: 1000 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t, range) => (
            <span className="text-xs text-slate-500">
              {range[0]}–{range[1]} of {t}
            </span>
          ),
        }}
        onRow={(r) => ({
          onClick: () => onView?.(r),
          className: "cursor-pointer hover:!bg-blue-50/40 transition-colors",
        })}
      />
    </div>
  );
};

export default CustomerTable;
