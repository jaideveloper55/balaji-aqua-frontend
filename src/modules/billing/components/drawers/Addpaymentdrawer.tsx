import React, { useMemo, useState, useEffect } from "react";
import { Drawer, InputNumber, Divider } from "antd";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineCash,
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { HiMiniQrCode, HiBuildingLibrary } from "react-icons/hi2";

import { formatCurrency } from "../../utils/Helpers";

import { billingApi } from "../../api/billing.api";
import { customersApi } from "../../../customers/api/customers.api";
import CustomInput from "../../../../components/common/CustomInput";
import CustomSelect from "../../../../components/common/CustomSelect";

interface Props {
  open: boolean;
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

const METHODS = [
  { value: "cash", label: "Cash", icon: <HiOutlineCash className="w-4 h-4" /> },
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

const AddPaymentDrawer: React.FC<Props> = ({
  open,
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

  onSubmit,
  onClose,
}) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentCustomer,
      paymentInvoice,
      paymentReference,
      paymentNotes,
    },
  });

  // Keep RHF values in sync when parent changes them (e.g. on drawer reopen)
  useEffect(() => {
    setValue("paymentCustomer", paymentCustomer);
  }, [paymentCustomer, setValue]);
  useEffect(() => {
    setValue("paymentInvoice", paymentInvoice);
  }, [paymentInvoice, setValue]);
  useEffect(() => {
    setValue("paymentReference", paymentReference);
  }, [paymentReference, setValue]);
  useEffect(() => {
    setValue("paymentNotes", paymentNotes);
  }, [paymentNotes, setValue]);

  // ── Search-as-you-type for customers ──────────────────────────────────────
  const [customerSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(customerSearch), 250);
    return () => clearTimeout(t);
  }, [customerSearch]);

  // ── Fetch customers ───────────────────────────────────────────────────────
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["billing-payment-customers", debouncedSearch],
    queryFn: () =>
      customersApi.list({
        search: debouncedSearch || undefined,
        status: "ACTIVE",
        page: 1,
        limit: 50,
        sortBy: "name",
        sortOrder: "asc",
      }),
    enabled: open,
    staleTime: 1000 * 30,
  });

  const customers = customersData?.data ?? [];

  const selectedCustomer = useMemo(
    () => customers.find((c: any) => c.id === paymentCustomer),
    [customers, paymentCustomer]
  );

  const customerOptions = useMemo(
    () =>
      customers.map((c: any) => {
        const due = c.outstandingBalance ?? 0;
        return {
          value: c.id,
          label:
            due > 0
              ? `${c.name} (${c.customerCode}) - Due: ${formatCurrency(due)}`
              : `${c.name} (${c.customerCode})`,
        };
      }),
    [customers]
  );

  // ── Fetch invoices for the selected customer ──────────────────────────────
  const { data: customerInvoicesData, isLoading: isLoadingInvoices } = useQuery(
    {
      queryKey: ["billing-invoices-for-payment", paymentCustomer],
      queryFn: () =>
        billingApi.listInvoices({
          customerId: paymentCustomer,
          limit: 100,
        }),
      enabled: open && !!paymentCustomer,
      staleTime: 1000 * 30,
    }
  );

  const pendingInvoices = useMemo(() => {
    const list = customerInvoicesData?.data ?? [];
    return list.filter(
      (inv: any) => (inv.balanceDue ?? 0) > 0 && inv.status !== "CANCELLED"
    );
  }, [customerInvoicesData]);

  const invoiceOptions = useMemo(
    () =>
      pendingInvoices.map((inv: any) => ({
        value: inv.id,
        label: `${inv.invoiceNumber} - Balance: ${formatCurrency(
          inv.balanceDue ?? 0
        )}`,
      })),
    [pendingInvoices]
  );

  const canSubmit = !!paymentCustomer && paymentAmount > 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <HiOutlineCash className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">Record Payment</span>
        </div>
      }
      width={420}
    >
      <div className="space-y-4">
        {/* ── Customer ─────────────────────────────────────────────────── */}
        <CustomSelect
          name="paymentCustomer"
          control={control}
          errors={errors}
          label="Customer"
          isrequired
          placeholder="Search by name, phone, or code..."
          showSearch
          isLoading={isLoadingCustomers}
          options={customerOptions}
          value={paymentCustomer || undefined}
          onChange={(val) => {
            onCustomerChange(val ?? "");
            onInvoiceChange("");
          }}
        />

        {/* ── Invoice ──────────────────────────────────────────────────── */}
        <CustomSelect
          name="paymentInvoice"
          control={control}
          errors={errors}
          label="Invoice (optional)"
          placeholder={
            !paymentCustomer
              ? "Select a customer first"
              : "Against overall outstanding"
          }
          disabled={!paymentCustomer}
          isLoading={isLoadingInvoices}
          options={invoiceOptions}
          value={paymentInvoice || undefined}
          onChange={(val) => onInvoiceChange(val ?? "")}
        />
        {paymentCustomer &&
          !isLoadingInvoices &&
          pendingInvoices.length === 0 && (
            <p className="text-[11px] text-slate-400 flex items-center gap-1 -mt-2">
              <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
              No pending invoices - payment will reduce overall outstanding
            </p>
          )}

        {/* ── Amount (stays as InputNumber — CustomInput doesn't do numeric) ── */}
        <div className="flex flex-col gap-1.5">
          <label className="flex justify-start py-1 text-sm text-text-primary">
            Amount<span className="text-red-500 ml-1">*</span>
          </label>
          <InputNumber
            value={paymentAmount}
            onChange={(val) => onAmountChange(val || 0)}
            size="middle"
            className="w-full"
            prefix="Rs."
            min={0}
          />
          {selectedCustomer &&
            (selectedCustomer.outstandingBalance ?? 0) > 0 && (
              <p className="text-[11px] text-slate-400">
                Outstanding:{" "}
                {formatCurrency(selectedCustomer.outstandingBalance ?? 0)}
              </p>
            )}
        </div>

        {/* ── Payment Method ───────────────────────────────────────────── */}
        <div>
          <label className="flex justify-start py-1 text-sm text-text-primary mb-1">
            Payment Method
          </label>
          <div className="grid grid-cols-4 gap-2">
            {METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => onMethodChange(m.value)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-[11px]
                  font-medium transition-all
                  ${
                    paymentMethod === m.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-100 text-gray-400 hover:border-emerald-200 hover:text-emerald-600"
                  }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Reference ────────────────────────────────────────────────── */}
        <CustomInput
          name="paymentReference"
          control={control}
          errors={errors}
          label="Reference / Transaction ID"
          placeholder="e.g. UPI-REF-12345"
        />

        {/* ── Notes ────────────────────────────────────────────────────── */}
        <CustomInput
          name="paymentNotes"
          control={control}
          errors={errors}
          label="Notes"
          placeholder="Optional notes..."
        />

        <Divider className="!my-3" />

        {/* ── Submit ───────────────────────────────────────────────────── */}
        <button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          className={`w-full py-3 rounded-xl font-semibold text-[13px] flex items-center
            justify-center gap-2 transition-all
            ${
              canSubmit
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 active:scale-[0.98]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
        >
          <HiOutlineCheckCircle className="w-5 h-5" />
          Record Payment - {formatCurrency(paymentAmount)}
        </button>

        {!canSubmit && (
          <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
            Select customer and enter amount to continue
          </p>
        )}
      </div>
    </Drawer>
  );
};

export default AddPaymentDrawer;
