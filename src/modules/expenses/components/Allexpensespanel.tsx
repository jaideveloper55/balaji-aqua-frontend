import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Table, Tag, Button, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import SearchInput from "../../../components/common/SearchInput";
import CustomSelect from "../../../components/common/CustomSelect";
import Expenseformmodal, { ExpenseFormValues } from "./Expenseformmodal";
import { successNotification } from "../../../components/common/Notification";
import {
  HiOutlineFilter,
  HiOutlinePlus,
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineDotsVertical,
  HiOutlineLightningBolt,
  HiOutlineTruck,
  HiOutlineCube,
  HiOutlineArchive,
  HiOutlineOfficeBuilding,
  HiOutlineFolder,
  HiOutlineLibrary,
  HiOutlineDeviceMobile,
  HiOutlineCash,
  HiOutlineCreditCard,
} from "react-icons/hi";
import { HiOutlineWrench } from "react-icons/hi2";

export interface Expense {
  id: string;
  expenseNo: string;
  date: string;
  vendor: string;
  description: string;
  category: string;
  amount: number;
  gstAmount?: number;
  paymentMode: "CASH" | "UPI" | "BANK" | "CARD";
  status: "PAID" | "APPROVED" | "PENDING" | "REJECTED";
}

interface Props {
  expenses: Expense[];
  onAdd?: () => void;
  onView?: (e: Expense) => void;
  onEdit?: (e: Expense) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n ?? 0
  )}`;

const CATEGORY_STYLE: Record<string, { color: string; icon: React.ReactNode }> =
  {
    Utilities: { color: "gold", icon: <HiOutlineLightningBolt size={13} /> },
    "Vehicle & Fuel": { color: "blue", icon: <HiOutlineTruck size={13} /> },
    "Plant Operations": { color: "cyan", icon: <HiOutlineCube size={13} /> },
    Packaging: { color: "purple", icon: <HiOutlineArchive size={13} /> },
    Repairs: { color: "orange", icon: <HiOutlineWrench size={13} /> },
    "Rent & Lease": {
      color: "geekblue",
      icon: <HiOutlineOfficeBuilding size={13} />,
    },
    Office: { color: "default", icon: <HiOutlineFolder size={13} /> },
  };

const PAYMENT_STYLE: Record<
  string,
  { color: string; icon: React.ReactNode; label: string }
> = {
  BANK: { color: "blue", icon: <HiOutlineLibrary size={13} />, label: "Bank" },
  UPI: {
    color: "purple",
    icon: <HiOutlineDeviceMobile size={13} />,
    label: "UPI",
  },
  CASH: { color: "green", icon: <HiOutlineCash size={13} />, label: "Cash" },
  CARD: {
    color: "cyan",
    icon: <HiOutlineCreditCard size={13} />,
    label: "Card",
  },
};

const STATUS_STYLE: Record<
  string,
  { dot: string; text: string; bg: string; label: string; pulse?: boolean }
> = {
  PAID: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    label: "Paid",
  },
  APPROVED: {
    dot: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
    label: "Approved",
  },
  PENDING: {
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    label: "Pending",
    pulse: true,
  },
  REJECTED: {
    dot: "bg-rose-500",
    text: "text-rose-700",
    bg: "bg-rose-50",
    label: "Rejected",
    pulse: true,
  },
};

const Allexpensespanel: React.FC<Props> = ({
  expenses,
  onAdd,
  onView,
  onEdit,
  onRefresh,
  loading = false,
}) => {
  const [search, setSearch] = useState("");

  // Filters via react-hook-form so CustomSelect can be used
  const {
    control: filterControl,
    watch: filterWatch,
    reset: filterReset,
    formState: { errors: filterErrors },
  } = useForm<{ category?: string; status?: string; payment?: string }>({
    defaultValues: {
      category: undefined,
      status: undefined,
      payment: undefined,
    },
  });

  const category = filterWatch("category");
  const status = filterWatch("status");
  const payment = filterWatch("payment");

  // Modal state — managed internally so "Add Expense" always works
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };
  const openEdit = (e: Expense) => {
    setEditTarget(e);
    setModalOpen(true);
  };

  const handleFormSubmit = (values: ExpenseFormValues) => {
    successNotification(
      editTarget ? "Expense Updated" : "Expense Added",
      `${values.vendor} · ₹${Number(values.amount).toLocaleString("en-IN")}`
    );
    setModalOpen(false);
    onAdd?.(); // let parent refetch if needed
  };

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (search) {
        const q = search.toLowerCase();
        const hit =
          e.vendor.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.expenseNo.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (category && e.category !== category) return false;
      if (status && e.status !== status) return false;
      if (payment && e.paymentMode !== payment) return false;
      return true;
    });
  }, [expenses, search, category, status, payment]);

  const total = useMemo(
    () => filtered.reduce((s, e) => s + (e.amount ?? 0), 0),
    [filtered]
  );

  const columns: ColumnsType<Expense> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 110,
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      defaultSortOrder: "descend",
      render: (d: string) => (
        <div>
          <div className="text-[15px] font-bold text-slate-800 leading-none">
            {dayjs(d).format("DD")}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {dayjs(d).format("MMM YYYY")}
          </div>
        </div>
      ),
    },
    {
      title: "Vendor / Description",
      key: "vendor",
      render: (_, r) => (
        <div className="min-w-0">
          <div className="text-[14px] font-semibold text-slate-800 truncate">
            {r.vendor}
          </div>
          <div className="text-[12px] text-slate-500 truncate">
            {r.description}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
            {r.expenseNo}
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 180,
      render: (cat: string) => {
        const st = CATEGORY_STYLE[cat] ?? {
          color: "default",
          icon: <HiOutlineFolder size={13} />,
        };
        return (
          <Tag
            color={st.color}
            className="!rounded-full !text-[12px] !font-medium !py-1 !px-3 !border-0 !inline-flex !items-center !gap-1.5"
          >
            {st.icon} {cat}
          </Tag>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 140,
      align: "right",
      sorter: (a, b) => a.amount - b.amount,
      render: (v: number, r) => (
        <div>
          <div className="text-[14px] font-bold text-rose-600 tabular-nums">
            −{inr(v)}
          </div>
          {r.gstAmount ? (
            <div className="text-[10px] text-slate-400">
              incl. {inr(r.gstAmount)} GST
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentMode",
      key: "payment",
      width: 110,
      render: (mode: string) => {
        const st = PAYMENT_STYLE[mode] ?? PAYMENT_STYLE.CASH;
        return (
          <Tag
            color={st.color}
            className="!rounded-md !text-[12px] !font-medium !border-0 !inline-flex !items-center !gap-1.5"
          >
            {st.icon} {st.label}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center",
      render: (s: string) => {
        const st = STATUS_STYLE[s] ?? STATUS_STYLE.PENDING;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${st.bg} ${st.text}`}
          >
            <span className="relative flex h-2 w-2">
              {st.pulse && (
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${st.dot}`}
                />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${st.dot}`}
              />
            </span>
            {st.label}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, r) => (
        <div
          className="flex items-center justify-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="View">
            <button
              onClick={() => onView?.(r)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <HiOutlineEye size={16} />
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button
              onClick={() => {
                onEdit?.(r);
                openEdit(r);
              }}
              className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"
            >
              <HiOutlinePencil size={16} />
            </button>
          </Tooltip>
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <HiOutlineDotsVertical size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HiOutlineFilter size={16} className="text-slate-400" />
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">
              Filters
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-slate-500">
              <span className="font-bold text-slate-800">
                {filtered.length}
              </span>{" "}
              results · Total:{" "}
              <span className="font-bold text-rose-600">{inr(total)}</span>
            </span>
            <Button
              type="primary"
              icon={<HiOutlinePlus size={15} />}
              onClick={openAdd}
              className="!bg-rose-600 hover:!bg-rose-700 !rounded-xl !h-9 !font-semibold !border-0"
            >
              Add Expense
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search vendor, description, number..."
            expandOnFocus={false}
          />
          <CustomSelect
            name="category"
            control={filterControl}
            errors={filterErrors}
            placeholder="All Categories"
            showSearch
            options={Object.keys(CATEGORY_STYLE).map((c) => ({
              value: c,
              label: c,
            }))}
          />
          <CustomSelect
            name="status"
            control={filterControl}
            errors={filterErrors}
            placeholder="All Status"
            options={Object.keys(STATUS_STYLE).map((s) => ({
              value: s,
              label: STATUS_STYLE[s].label,
            }))}
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <CustomSelect
                name="payment"
                control={filterControl}
                errors={filterErrors}
                placeholder="Payment Mode"
                options={Object.keys(PAYMENT_STYLE).map((p) => ({
                  value: p,
                  label: PAYMENT_STYLE[p].label,
                }))}
              />
            </div>
            <Button
              icon={
                <HiOutlineRefresh
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
              }
              onClick={() => {
                filterReset();
                setSearch("");
                onRefresh?.();
              }}
              className="!rounded-xl  !flex !items-center !justify-center shrink-0"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <Table<Expense>
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          size="middle"
          showSorterTooltip={false}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (t, range) => `${range[0]}–${range[1]} of ${t}`,
          }}
          locale={{ emptyText: "No expenses found for these filters." }}
          onRow={(r) => ({
            onClick: () => onView?.(r),
            className: "cursor-pointer",
          })}
          className="expenses-table"
        />
      </div>

      {/* Add / Edit modal — managed internally */}
      <Expenseformmodal
        open={modalOpen}
        editExpense={editTarget}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Allexpensespanel;
