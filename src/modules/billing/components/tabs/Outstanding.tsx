import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import {
  HiOutlineCurrencyRupee,
  HiOutlineUser,
  HiOutlineExclamation,
  HiOutlineCash,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineDownload,
  HiOutlineSearch,
  HiOutlineChat,
} from "react-icons/hi";
import { HiArrowTrendingDown } from "react-icons/hi2";

import {
  formatCurrency,
  getCustomerTypeColor,
  getInitials,
} from "../../utils/Helpers";
import StatCard from "../StatCard";
import CustomSelect from "../../../../components/common/CustomSelect";
import { Customer } from "../../types/billing";

type SortKey = "risk" | "amount" | "days" | "lastPaid";

interface Props {
  customers: Customer[];
  totalOutstanding: number;
  highRiskCount: number;
  customersWithDuesCount: number;
  avgOverdueDays: number;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  filter: string;
  search: string;
  sortBy: SortKey;
  onFilterChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onSortChange: (v: SortKey) => void;
  onRecordPayment: (customer: Customer) => void;
  onViewInvoices: (customer: Customer) => void;
  onExport: () => void;
}

const SORT_OPTIONS = [
  { value: "risk", label: "Sort: Risk (high first)" },
  { value: "amount", label: "Sort: Amount (high to low)" },
  { value: "days", label: "Sort: Days overdue (most first)" },
  { value: "lastPaid", label: "Sort: Last paid (oldest first)" },
];

const sendWhatsAppReminder = (customer: Customer) => {
  const raw = (customer.phone || "").replace(/\D/g, "");
  if (!raw) return;
  const phone = raw.length === 10 ? `91${raw}` : raw;

  const msg =
    `Hi ${customer.name}, ` +
    `this is a friendly reminder that ${formatCurrency(
      customer.outstanding
    )} ` +
    `is pending on your water account (${customer.customerId}). ` +
    `Kindly settle at your convenience.\n\n— Balaji Aqua Water Plant`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

const OutstandingTab: React.FC<Props> = ({
  customers,
  totalOutstanding,
  highRiskCount,
  customersWithDuesCount,
  avgOverdueDays,
  totalCount,
  page,
  pageSize,
  onPageChange,
  filter,
  search,
  sortBy,
  onFilterChange,
  onSearchChange,
  onSortChange,
  onRecordPayment,
  onViewInvoices,
  onExport,
}) => {
  const {
    control,
    formState: { errors },
  } = useForm({ defaultValues: { sortBy } });

  // ── Table columns ─────────────────────────────────────────────────────────
  const columns: ColumnsType<Customer> = [
    {
      title: "Customer",
      key: "customer",
      render: (_, c) => {
        const days = c.overdueDays || 0;
        const risk = days > 15 ? "high" : days >= 7 ? "medium" : "low";
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0
              ${
                risk === "high"
                  ? "bg-red-100 text-red-700"
                  : risk === "medium"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {getInitials(c.name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[13px] text-gray-900 truncate">
                  {c.name}
                </span>
                <Tag
                  color={getCustomerTypeColor(c.type)}
                  className="text-[10px]"
                >
                  {c.type}
                </Tag>
              </div>
              <div className="text-[11px] text-gray-400 truncate">
                {c.customerId} · {c.phone} · Last paid:{" "}
                {c.lastPaymentDate || "—"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Outstanding",
      dataIndex: "outstanding",
      key: "outstanding",
      align: "center",
      render: (amt: number) => (
        <span className="text-[14px] font-bold text-red-600">
          {formatCurrency(amt)}
        </span>
      ),
    },
    {
      title: "Overdue",
      dataIndex: "overdueDays",
      key: "overdueDays",
      align: "center",
      render: (_, c) => {
        const days = c.overdueDays || 0;
        const risk = days > 15 ? "high" : days >= 7 ? "medium" : "low";
        return (
          <span
            className={`text-[12px] font-medium ${
              risk === "high"
                ? "text-red-500"
                : risk === "medium"
                ? "text-amber-500"
                : "text-gray-400"
            }`}
          >
            {days} days
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 300,
      render: (_, c) => {
        const hasPhone = !!(c.phone || "").replace(/\D/g, "");
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onRecordPayment(c)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[12px] font-medium hover:bg-emerald-100"
            >
              <HiOutlineCash className="w-3.5 h-3.5" /> Pay
            </button>
            <button
              onClick={() => onViewInvoices(c)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-[12px] font-medium hover:bg-gray-100"
            >
              <HiOutlineDocumentText className="w-3.5 h-3.5" /> Invoices
            </button>
            <button
              onClick={() => sendWhatsAppReminder(c)}
              disabled={!hasPhone}
              title={
                hasPhone ? "Send WhatsApp reminder" : "No phone number on file"
              }
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium
                ${
                  hasPhone
                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                    : "bg-gray-50 text-gray-300 cursor-not-allowed"
                }`}
            >
              <HiOutlineChat className="w-3.5 h-3.5" /> WhatsApp
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="py-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Outstanding Dues
          </h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Customers with pending payments
          </p>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <HiOutlineDownload className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<HiOutlineCurrencyRupee className="w-5 h-5" />}
          label="Total Outstanding"
          value={formatCurrency(totalOutstanding)}
          color="red"
        />
        <StatCard
          icon={<HiOutlineUser className="w-5 h-5" />}
          label="Customers with Dues"
          value={customersWithDuesCount}
          color="orange"
        />
        <StatCard
          icon={<HiOutlineExclamation className="w-5 h-5" />}
          label="High Risk (>15 days)"
          value={highRiskCount}
          sub="Need immediate action"
          color="red"
        />
        <StatCard
          icon={<HiArrowTrendingDown className="w-5 h-5" />}
          label="Avg. Overdue"
          value={`${avgOverdueDays} days`}
          color="orange"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search by name, customer ID, or phone..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-[13px] placeholder:text-gray-300 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100"
            />
          </div>

          {/* Sort dropdown */}
          <div className="min-w-[240px]">
            <CustomSelect
              name="sortBy"
              control={control}
              errors={errors}
              placeholder="Sort by..."
              size="middle"
              value={sortBy}
              onChange={(v) => onSortChange(v as SortKey)}
              options={SORT_OPTIONS}
            />
          </div>

          {/* Risk chips */}
          <div className="flex items-center gap-1.5">
            {[
              { key: "all", label: "All" },
              { key: "high", label: "High Risk (>15d)" },
              { key: "medium", label: "Medium (7-15d)" },
              { key: "low", label: "Recent (<7d)" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => onFilterChange(f.key)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors
                  ${
                    filter === f.key
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-gray-500 hover:bg-gray-50 border border-transparent"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="mt-3 text-[12px] text-gray-400">
          {totalCount} {totalCount === 1 ? "customer" : "customers"} with dues
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <HiOutlineCheckCircle className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <p className="text-[14px] font-medium text-gray-700">All clear!</p>
          <p className="text-[12px] text-gray-400 mt-1">
            No customers have outstanding dues.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-2">
          <Table<Customer>
            columns={columns}
            dataSource={customers}
            rowKey="id"
            size="middle"
            locale={{
              emptyText: (
                <div className="py-6 text-center">
                  <p className="text-[13px] text-gray-500">
                    No customers match the current filters.
                  </p>
                  <button
                    onClick={() => {
                      onSearchChange("");
                      onFilterChange("all");
                    }}
                    className="text-[12px] text-emerald-600 hover:text-emerald-700 font-medium mt-2"
                  >
                    Clear filters
                  </button>
                </div>
              ),
            }}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: totalCount,
              showSizeChanger: false,
              showTotal: (t) => `${t} customers`,
              onChange: (p) => onPageChange(p),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default OutstandingTab;
