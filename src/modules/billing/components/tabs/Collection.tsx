import React from "react";
import {
  HiOutlineDownload,
  HiOutlineCash,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import {
  HiBanknotes,
  HiClipboardDocumentList,
  HiArrowTrendingUp,
  HiMiniQrCode,
  HiBuildingLibrary,
} from "react-icons/hi2";

import { formatCurrency, getInitials } from "../../utils/Helpers";
import StatCard from "../StatCard";
import { Invoice, PaymentEntry } from "../../types/billing";

interface Props {
  today: string;
  todayPayments: PaymentEntry[];
  todayInvoices: Invoice[];
  todayCash: number;
  todayUPI: number;
  todayBank: number;
  todayTotal: number;
  onExport: () => void;
}

const CollectionTab: React.FC<Props> = ({
  today,
  todayPayments,
  todayInvoices,
  todayCash,
  todayUPI,
  todayBank,
  todayTotal,
  onExport,
}) => {
  const avgInvoice = Math.round(
    todayInvoices.reduce((s, i) => s + i.grandTotal, 0) /
      (todayInvoices.length || 1)
  );
  const creditSales = todayInvoices
    .filter((i) => i.paymentMode === "Credit")
    .reduce((s, i) => s + i.grandTotal, 0);

  const modes = [
    {
      label: "Cash",
      amount: todayCash,
      color: "bg-emerald-500",
      icon: <HiOutlineCash className="w-4 h-4 text-emerald-600" />,
    },
    {
      label: "UPI",
      amount: todayUPI,
      color: "bg-blue-500",
      icon: <HiMiniQrCode className="w-4 h-4 text-blue-600" />,
    },
    {
      label: "Bank Transfer",
      amount: todayBank,
      color: "bg-purple-500",
      icon: <HiBuildingLibrary className="w-4 h-4 text-purple-600" />,
    },
  ];

  return (
    <div className="py-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Daily Collection Summary
          </h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {today} — Today's performance
          </p>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <HiOutlineDownload className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<HiBanknotes className="w-5 h-5" />}
          label="Total Collection"
          value={formatCurrency(todayTotal)}
          sub={`${todayPayments.length} payments`}
          color="green"
        />
        <StatCard
          icon={<HiClipboardDocumentList className="w-5 h-5" />}
          label="Invoices Generated"
          value={todayInvoices.length}
          sub={`${formatCurrency(
            todayInvoices.reduce((s, i) => s + i.grandTotal, 0)
          )} billed`}
          color="blue"
        />
        <StatCard
          icon={<HiArrowTrendingUp className="w-5 h-5" />}
          label="Avg Invoice Value"
          value={formatCurrency(avgInvoice)}
          color="purple"
        />
        <StatCard
          icon={<HiOutlineExclamationCircle className="w-5 h-5" />}
          label="Credit Sales"
          value={formatCurrency(creditSales)}
          sub="To be collected"
          color="orange"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-[13px] font-semibold text-gray-800 mb-4">
          Payment Mode Breakdown
        </h3>
        <div className="space-y-3">
          {modes.map((mode) => (
            <div key={mode.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                {mode.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-medium text-gray-700">
                    {mode.label}
                  </span>
                  <span className="text-[13px] font-bold text-gray-900">
                    {formatCurrency(mode.amount)}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${mode.color} transition-all`}
                    style={{
                      width: `${
                        todayTotal > 0 ? (mode.amount / todayTotal) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <span className="text-[12px] text-gray-400 w-10 text-right">
                {todayTotal > 0
                  ? Math.round((mode.amount / todayTotal) * 100)
                  : 0}
                %
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-[13px] font-semibold text-gray-800 mb-3">
          Today's Transactions
        </h3>
        <div className="space-y-2">
          {todayPayments.map((pay) => (
            <div
              key={pay.id}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-[10px]">
                  {getInitials(pay.customerName)}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-gray-800">
                    {pay.customerName}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {pay.invoiceNo} · {pay.time}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-bold text-emerald-600">
                  {formatCurrency(pay.amount)}
                </div>
                <div className="text-[11px] text-gray-400">{pay.mode}</div>
              </div>
            </div>
          ))}
          {todayPayments.length === 0 && (
            <div className="text-center py-8 text-gray-300 text-[13px]">
              No transactions today yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionTab;
