import React, { useCallback, useState } from "react";
import { Table, Dropdown, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineCog,
} from "react-icons/hi";
import { useCustomers } from "../hooks/useCustomers";
import { useDeleteCustomer } from "../hooks/useDeleteCustomer";
import type { Customer, CustomerStatus, CustomerType } from "../types/Customer";
import { STATUS_MAP, TYPE_MAP } from "../components/customerDetailConstants";
import CustomerTableFilters from "./CustomerTableFilters";
import { IconType } from "react-icons";
import DeleteConfirmModal from "../../products/components/Deleteconfirmmodal";

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
  // ─── Pagination ──────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ─── Filters ─────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<CustomerType | undefined>();
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);

  // ─── Delete confirmation state ───────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  // ─── Server data via TanStack Query ──────────────────────────────────────
  const { data, isLoading, isFetching } = useCustomers({
    page,
    limit: pageSize,
    search: search || undefined,
    type: typeFilter,
    fromDate,
    toDate,
  });

  const deleteCustomer = useDeleteCustomer();

  const customers = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  // ─── Reset to page 1 whenever filters change ─────────────────────────────
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleTypeChange = useCallback((value: CustomerType | undefined) => {
    setTypeFilter(value);
    setPage(1);
  }, []);

  const handleDateRangeChange = useCallback(
    (from: string | undefined, to: string | undefined) => {
      setFromDate(from);
      setToDate(to);
      setPage(1);
    },
    []
  );

  // ─── Pagination handler ──────────────────────────────────────────────────
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  // ─── Style maps ──────────────────────────────────────────────────────────
  const STATUS_BADGE_STYLES: Record<
    CustomerStatus,
    { bg: string; text: string; dot: string; ring: string }
  > = {
    ACTIVE: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      ring: "ring-emerald-200",
    },
    INACTIVE: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      dot: "bg-slate-400",
      ring: "ring-slate-200",
    },
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      ring: "ring-amber-200",
    },
  };

  const TYPE_BADGE_STYLES: Record<
    CustomerType,
    { bg: string; text: string; border: string; Icon: IconType }
  > = {
    RESIDENTIAL: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
      Icon: HiOutlineHome,
    },
    COMMERCIAL: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-300",
      Icon: HiOutlineOfficeBuilding,
    },
    INDUSTRIAL: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-300",
      Icon: HiOutlineCog,
    },
  };

  // ─── Columns ─────────────────────────────────────────────────────────────
  const columns: ColumnsType<Customer> = [
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (_, r) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 shadow-sm ">
            <span className="text-[12px] font-bold text-white">
              {r.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[14px] font-bold text-slate-900 leading-tight truncate capitalize">
              {r.name}
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <HiOutlinePhone size={11} className="text-slate-500" />
                {r.phone}
              </span>
              {r.email && (
                <span className="flex items-center gap-1 truncate">
                  <HiOutlineMail size={11} className="text-slate-500" />
                  <span className="truncate">{r.email}</span>
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
      align: "center",
      width: 110,
      render: (code: string) => (
        <span className="inline-flex items-center text-[11px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2 py-1 rounded-md tracking-wider">
          {code}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
      width: 140,
      render: (t: CustomerType) => {
        const { bg, text, border, Icon } = TYPE_BADGE_STYLES[t];
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-bold border ${bg} ${text} ${border}`}
          >
            <Icon size={13} />
            {TYPE_MAP[t]}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 130,
      render: (s: CustomerStatus) => {
        const cfg = STATUS_MAP[s];
        const styles = STATUS_BADGE_STYLES[s];
        return (
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-semibold ring-1 ${styles.bg} ${styles.text} ${styles.ring} shadow-sm`}
          >
            <span className="relative flex items-center justify-center">
              {s === "PENDING" && (
                <span
                  className={`absolute w-3 h-3 rounded-full ${styles.dot} opacity-40 animate-ping`}
                />
              )}
              <span className={`w-2 h-2 rounded-full ${styles.dot} relative`} />
            </span>
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: "Outstanding",
      dataIndex: "outstandingBalance",
      key: "outstandingBalance",
      width: 130,
      align: "center" as const,
      sorter: (a, b) =>
        Number(a.outstandingBalance ?? 0) - Number(b.outstandingBalance ?? 0),
      render: (v: number | string | null | undefined) => {
        const amount = Number(v ?? 0);
        const hasDues = amount > 0;
        return (
          <Tooltip title={hasDues ? "Amount pending" : "Settled"}>
            <span
              className={`text-[13px] font-bold tabular-nums ${
                hasDues ? "text-red-500" : "text-emerald-600"
              }`}
            >
              {hasDues ? `₹${amount.toLocaleString("en-IN")}` : "Nil"}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
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
                onClick: ({ domEvent }) => {
                  domEvent.stopPropagation();
                  onEdit?.(r);
                },
              },
              { type: "divider" },
              {
                key: "delete",
                label: "Delete",
                icon: <HiOutlineTrash size={14} />,
                danger: true,
                onClick: ({ domEvent }) => {
                  domEvent.stopPropagation();
                  setDeleteTarget(r);
                },
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
        onSearchChange={handleSearchChange}
        onTypeChange={handleTypeChange}
        onDateRangeChange={handleDateRangeChange}
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

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await new Promise<void>((resolve, reject) => {
            deleteCustomer.mutate(deleteTarget.id, {
              onSuccess: () => {
                onDelete?.(deleteTarget);
                resolve();
              },
              onError: (err) => reject(err),
            });
          });
        }}
        loading={deleteCustomer.isPending}
        itemName={deleteTarget?.name ?? ""}
        itemType="Customer"
        details={
          deleteTarget
            ? [
                { label: "ID", value: deleteTarget.customerCode, mono: true },
                { label: "Phone", value: deleteTarget.phone },
                { label: "Type", value: TYPE_MAP[deleteTarget.type] },
              ]
            : []
        }
        warningMessage={
          deleteTarget && deleteTarget.outstandingBalance > 0
            ? `⚠️ This customer has an outstanding balance of ₹${deleteTarget.outstandingBalance.toLocaleString(
                "en-IN"
              )}. Deleting will remove their entire history including ledger entries and price rules.`
            : `This customer and all their data — ledger entries, pricing rules, and order history — will be permanently removed. This cannot be undone.`
        }
        confirmLabel="Yes, delete customer"
      />
    </div>
  );
};

export default CustomerTable;
