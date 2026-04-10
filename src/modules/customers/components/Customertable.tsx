import React, { useState, useEffect, useCallback } from "react";
import { Table, Dropdown, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";
import { customerApi } from "../services/Customer.api";
import type { Customer, CustomerStatus, CustomerType } from "../types/Customer";
import { STATUS_MAP, TYPE_MAP } from "../constants/customerConstants";
import CustomerTableFilters from "./CustomerTableFilters";

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
        <div className="flex items-center gap-3 py-0.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-blue-600">
              {r.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-slate-800">
              {r.name}
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <HiOutlinePhone size={10} />
                {r.phone}
              </span>
              {r.email && (
                <span className="flex items-center gap-1">
                  <HiOutlineMail size={10} />
                  {r.email}
                </span>
              )}
            </div>
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
        <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
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
        <span className="text-[12px] font-medium text-slate-600">
          {TYPE_MAP[t]}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (s: CustomerStatus) => {
        const cfg = STATUS_MAP[s];
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${
                s === "pending" ? "animate-pulse" : ""
              }`}
            />
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: "Outstanding",
      dataIndex: "outstandingBalance",
      key: "balance",
      width: 130,
      align: "right",
      sorter: (a, b) => a.outstandingBalance - b.outstandingBalance,
      render: (v: number) => (
        <Tooltip title={v > 0 ? "Amount pending" : "Settled"}>
          <span
            className={`text-[13px] font-bold tabular-nums ${
              v > 0 ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {v > 0 ? `₹${v.toLocaleString("en-IN")}` : "Nil"}
          </span>
        </Tooltip>
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
        <span className="text-[13px] font-semibold text-slate-700 tabular-nums">
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
        <span className="text-[11px] text-slate-500 tabular-nums">
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
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <HiOutlineDotsVertical size={16} />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <CustomerTableFilters
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onStatusChange={(v) => {
          setStatusFilter(v);
          setPage(1);
        }}
        onTypeChange={(v) => {
          setTypeFilter(v);
          setPage(1);
        }}
      />

      <Table
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
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (t, range) => (
            <span className="text-[11px] text-slate-400">
              Showing {range[0]}–{range[1]} of {t} customers
            </span>
          ),
        }}
        onRow={(r) => ({
          onClick: () => onView?.(r),
          className: "cursor-pointer",
        })}
      />
    </div>
  );
};

export default CustomerTable;
