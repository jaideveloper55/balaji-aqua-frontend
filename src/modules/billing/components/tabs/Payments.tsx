import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HiOutlinePlus,
  HiOutlineCash,
  HiOutlineCreditCard,
  HiOutlineDownload,
} from "react-icons/hi";
import { HiMiniQrCode, HiBuildingLibrary, HiBanknotes } from "react-icons/hi2";

import { formatCurrency } from "../../utils/Helpers";
import StatCard from "../StatCard";
import { PaymentEntry } from "../../types/billing";

interface Props {
  payments: PaymentEntry[];
  todayCash: number;
  todayUPI: number;
  todayBank: number;
  todayTotal: number;
  todayPaymentsCount: number;
  onAddPayment: () => void;
  onExport: () => void;
}

const PaymentsTab: React.FC<Props> = ({
  payments,
  todayCash,
  todayUPI,
  todayBank,
  todayTotal,
  todayPaymentsCount,
  onAddPayment,
  onExport,
}) => {
  const columns: ColumnsType<PaymentEntry> = [
    {
      title: "Payment #",
      dataIndex: "paymentNo",
      width: 180,
      render: (no: string, r) => (
        <div>
          <div className="font-mono text-[13px] font-semibold text-gray-800">
            {no}
          </div>
          <div className="text-[11px] text-gray-400">
            {r.date} · {r.time}
          </div>
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      render: (name: string) => (
        <span className="font-medium text-[13px] text-gray-800">{name}</span>
      ),
    },
    {
      title: "Invoice",
      dataIndex: "invoiceNo",
      width: 180,
      render: (no: string) => (
        <span className="font-mono text-[12px] text-gray-500">{no}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 120,
      align: "right",
      sorter: (a, b) => a.amount - b.amount,
      render: (amt: number) => (
        <span className="font-bold text-[13px] text-emerald-600">
          {formatCurrency(amt)}
        </span>
      ),
    },
    {
      title: "Mode",
      dataIndex: "mode",
      width: 130,
      render: (mode: string) => {
        const icons: Record<string, React.ReactNode> = {
          Cash: <HiOutlineCash className="w-3.5 h-3.5" />,
          UPI: <HiMiniQrCode className="w-3.5 h-3.5" />,
          "Bank Transfer": <HiBuildingLibrary className="w-3.5 h-3.5" />,
          Card: <HiOutlineCreditCard className="w-3.5 h-3.5" />,
        };
        return (
          <span className="flex items-center gap-1.5 text-[12px] text-gray-600">
            {icons[mode]} {mode}
          </span>
        );
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
      width: 150,
      render: (ref: string) =>
        ref ? (
          <span className="font-mono text-[11px] text-gray-400">{ref}</span>
        ) : (
          <span className="text-[11px] text-gray-300">—</span>
        ),
    },
  ];

  return (
    <div className="py-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Payment Entries</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Record and track all payments received
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <HiOutlineDownload className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={onAddPayment}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-700 shadow-sm"
          >
            <HiOutlinePlus className="w-4 h-4" /> Add Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<HiOutlineCash className="w-5 h-5" />}
          label="Today Cash"
          value={formatCurrency(todayCash)}
          color="green"
        />
        <StatCard
          icon={<HiMiniQrCode className="w-5 h-5" />}
          label="Today UPI"
          value={formatCurrency(todayUPI)}
          color="blue"
        />
        <StatCard
          icon={<HiBuildingLibrary className="w-5 h-5" />}
          label="Today Bank"
          value={formatCurrency(todayBank)}
          color="purple"
        />
        <StatCard
          icon={<HiBanknotes className="w-5 h-5" />}
          label="Today Total"
          value={formatCurrency(todayTotal)}
          sub={`${todayPaymentsCount} payments`}
          color="green"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <Table
          dataSource={payments}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, size: "small" }}
          size="small"
        />
      </div>
    </div>
  );
};

export default PaymentsTab;
