import React, { useState } from "react";
import { Table, Dropdown, Tooltip, Popconfirm } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";
import { useCustomers } from "../hooks/useCustomers";
import { useDeleteCustomer } from "../hooks/useDeleteCustomer";
import type { Customer, CustomerStatus, CustomerType } from "../types/Customer";
import { STATUS_MAP, TYPE_MAP } from "../components/customerDetailConstants";
import CustomerTableFilters from "./CustomerTableFilters";

interface CustomerTableProps {
  onView?: (customer: Customer) => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

// Status badge colors — derived from STATUS_MAP color names
const STATUS_BADGE_STYLES: Record<
  CustomerStatus,
  { bg: string; text: string; dot: string }
> = {
  ACTIVE: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  INACTIVE: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    dot: "bg-slate-400",
  },
  PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
};
const CustomerTable: React.FC<CustomerTableProps> = ({
  onView,
  onEdit,
  onDelete,
}) => {
  // ─── Local UI state (filters, pagination) ───────────────────────────────
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    CustomerStatus | undefined
  >();
  const [typeFilter, setTypeFilter] = useState<CustomerType | undefined>();

  // ─── Server state via TanStack Query ────────────────────────────────────
  const { data, isLoading, isFetching } = useCustomers({
    page,
    limit: pageSize,
    search: search || undefined,
    status: statusFilter,
    type: typeFilter,
  });

  const deleteCustomer = useDeleteCustomer();

  const customers = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  // ─── Handlers ───────────────────────────────────────────────────────────
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const handleDelete = (customer: Customer) => {
    deleteCustomer.mutate(customer.id, {
      onSuccess: () => {
        // Optional: parent callback if it cares about deletion
        onDelete?.(customer);
      },
    });
  };

  // ─── Columns ────────────────────────────────────────────────────────────
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
      dataIndex: "customerCode",
      key: "customerCode",
      width: 100,
      render: (code: string) => (
        <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
          {code}
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
        const styles = STATUS_BADGE_STYLES[s];
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${styles.bg} ${styles.text}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${styles.dot} ${
                s === "PENDING" ? "animate-pulse" : ""
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
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
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
                label: (
                  <Popconfirm
                    title="Delete customer?"
                    description={`This will permanently delete ${r.name}.`}
                    okText="Yes, delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDelete(r)}
                  >
                    <span className="text-red-500">Delete</span>
                  </Popconfirm>
                ),
                icon: <HiOutlineTrash size={14} className="text-red-500" />,
                danger: true,
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
        dataSource={customers}
        rowKey="id"
        loading={isLoading || isFetching}
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
