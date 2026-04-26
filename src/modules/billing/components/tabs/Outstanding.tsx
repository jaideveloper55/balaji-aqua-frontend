import React from "react";
import { Tag, message } from "antd";
import {
  HiOutlineCurrencyRupee,
  HiOutlineUser,
  HiOutlineExclamation,
  HiOutlineCash,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlineCheckCircle,
  HiOutlineDownload,
} from "react-icons/hi";
import { HiArrowTrendingDown } from "react-icons/hi2";

import {
  formatCurrency,
  getCustomerTypeColor,
  getInitials,
} from "../../utils/Helpers";
import StatCard from "../StatCard";
import { Customer } from "../../types/billing";

interface Props {
  customers: Customer[];
  totalOutstanding: number;
  highRiskCount: number;
  filter: string;
  onFilterChange: (v: string) => void;
  onRecordPayment: (customer: Customer) => void;
  onViewInvoices: (customer: Customer) => void;
  onExport: () => void;
}

const OutstandingTab: React.FC<Props> = ({
  customers,
  totalOutstanding,
  highRiskCount,
  filter,
  onFilterChange,
  onRecordPayment,
  onViewInvoices,
  onExport,
}) => {
  const avgOverdue = Math.round(
    customers.reduce((s, c) => s + (c.overdueDays || 0), 0) /
      (customers.length || 1)
  );

  const filtered = customers.filter((c) => {
    if (filter === "high") return (c.overdueDays || 0) > 15;
    if (filter === "medium")
      return (c.overdueDays || 0) >= 7 && (c.overdueDays || 0) <= 15;
    if (filter === "low") return (c.overdueDays || 0) < 7;
    return true;
  });

  return (
    <div className="py-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Outstanding Dues
          </h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Customers with pending payments — sorted by risk
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
          value={customers.length}
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
          value={`${avgOverdue} days`}
          color="orange"
        />
      </div>

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

      <div className="space-y-2.5">
        {filtered.map((customer) => {
          const risk =
            (customer.overdueDays || 0) > 15
              ? "high"
              : (customer.overdueDays || 0) >= 7
              ? "medium"
              : "low";
          return (
            <div
              key={customer.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs
                    ${
                      risk === "high"
                        ? "bg-red-50 text-red-700"
                        : risk === "medium"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {getInitials(customer.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[14px] text-gray-900">
                        {customer.name}
                      </span>
                      <Tag
                        color={getCustomerTypeColor(customer.type)}
                        className="text-[10px]"
                      >
                        {customer.type}
                      </Tag>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span>{customer.customerId}</span>
                      <span>·</span>
                      <span>{customer.phone}</span>
                      <span>·</span>
                      <span>Last paid: {customer.lastPaymentDate}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">
                    {formatCurrency(customer.outstanding)}
                  </div>
                  <div
                    className={`text-[11px] font-medium mt-0.5
                    ${
                      risk === "high"
                        ? "text-red-500"
                        : risk === "medium"
                        ? "text-amber-500"
                        : "text-gray-400"
                    }`}
                  >
                    {customer.overdueDays} days overdue
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                <button
                  onClick={() => onRecordPayment(customer)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[12px] font-medium hover:bg-emerald-100"
                >
                  <HiOutlineCash className="w-3.5 h-3.5" /> Record Payment
                </button>
                <button
                  onClick={() => onViewInvoices(customer)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-[12px] font-medium hover:bg-gray-100"
                >
                  <HiOutlineDocumentText className="w-3.5 h-3.5" /> View
                  Invoices
                </button>
                <button
                  onClick={() =>
                    message.success(`Reminder sent to ${customer.name}`)
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-[12px] font-medium hover:bg-gray-100"
                >
                  <HiOutlineMail className="w-3.5 h-3.5" /> Send Reminder
                </button>
              </div>
            </div>
          );
        })}
        {customers.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <HiOutlineCheckCircle className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-gray-700">All clear!</p>
            <p className="text-[12px] text-gray-400 mt-1">
              No customers have outstanding dues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutstandingTab;
