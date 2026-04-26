import React from "react";
import { Drawer, Select, InputNumber, Divider, message } from "antd";
import {
  HiOutlineCash,
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { HiMiniQrCode, HiBuildingLibrary } from "react-icons/hi2";

import Field from "../Field";
import { Customer, Invoice } from "../../types/billing";
import { formatCurrency } from "../../utils/Helpers";

interface Props {
  open: boolean;
  customers: Customer[];
  invoices: Invoice[];
  paymentCustomer: string;
  paymentInvoice: string;
  paymentAmount: number;
  paymentMethod: string;
  paymentReference: string;
  paymentNotes: string;
  onCustomerChange: (v: string) => void;
  onInvoiceChange: (v: string) => void;
  onAmountChange: (v: number) => void;
  onMethodChange: (v: string) => void;
  onReferenceChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const AddPaymentDrawer: React.FC<Props> = ({
  open,
  customers,
  invoices,
  paymentCustomer,
  paymentInvoice,
  paymentAmount,
  paymentMethod,
  paymentReference,
  paymentNotes,
  onCustomerChange,
  onInvoiceChange,
  onAmountChange,
  onMethodChange,
  onReferenceChange,
  onNotesChange,
  onSubmit,
  onClose,
}) => {
  const methods = [
    {
      value: "cash",
      label: "Cash",
      icon: <HiOutlineCash className="w-4 h-4" />,
    },
    { value: "upi", label: "UPI", icon: <HiMiniQrCode className="w-4 h-4" /> },
    {
      value: "bank",
      label: "Bank",
      icon: <HiBuildingLibrary className="w-4 h-4" />,
    },
    {
      value: "card",
      label: "Card",
      icon: <HiOutlineCreditCard className="w-4 h-4" />,
    },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <HiOutlineCash className="w-5 h-5 text-emerald-600" />
          <span>Record Payment</span>
        </div>
      }
      width={420}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Customer <span className="text-red-500">*</span>
          </label>
          <Select
            value={paymentCustomer || undefined}
            onChange={onCustomerChange}
            placeholder="Select customer"
            size="large"
            showSearch
            filterOption={(input, option) =>
              String(option?.label || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={customers
              .filter((c) => c.outstanding > 0)
              .map((c) => ({
                value: c.customerId,
                label: `${c.name} (${c.customerId}) — Due: ${formatCurrency(
                  c.outstanding
                )}`,
              }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Invoice (optional)
          </label>
          <Select
            value={paymentInvoice || undefined}
            onChange={onInvoiceChange}
            placeholder="Against overall outstanding"
            size="large"
            allowClear
            options={invoices
              .filter(
                (i) => i.customerId === paymentCustomer && i.balanceAmount > 0
              )
              .map((inv) => ({
                value: inv.invoiceNo,
                label: `${inv.invoiceNo} — Balance: ${formatCurrency(
                  inv.balanceAmount
                )}`,
              }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Amount <span className="text-red-500">*</span>
          </label>
          <InputNumber
            value={paymentAmount}
            onChange={(val) => onAmountChange(val || 0)}
            size="large"
            className="w-full"
            prefix="₹"
            min={0}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 mb-2 block">
            Payment Method
          </label>
          <div className="grid grid-cols-4 gap-2">
            {methods.map((m) => (
              <button
                key={m.value}
                onClick={() => onMethodChange(m.value)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-[11px] font-medium transition-all
                  ${
                    paymentMethod === m.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-100 text-gray-400 hover:border-gray-200"
                  }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Field
          label="Reference / Transaction ID"
          value={paymentReference}
          onChange={onReferenceChange}
          placeholder="e.g. UPI-REF-12345"
        />
        <Field
          label="Notes"
          value={paymentNotes}
          onChange={onNotesChange}
          placeholder="Optional notes..."
        />

        <Divider className="!my-3" />

        <button
          onClick={() => {
            if (!paymentCustomer || paymentAmount <= 0) {
              message.warning("Please fill required fields");
              return;
            }
            onSubmit();
          }}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all"
        >
          <HiOutlineCheckCircle className="w-5 h-5" /> Record Payment —{" "}
          {formatCurrency(paymentAmount)}
        </button>
      </div>
    </Drawer>
  );
};

export default AddPaymentDrawer;
