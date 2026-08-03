import React from "react";
import dayjs from "dayjs";
import {
  HiOutlineReceiptTax,
  HiOutlineUser,
  HiOutlineTag,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineCreditCard,
  HiOutlineLibrary,
  HiOutlineDeviceMobile,
  HiOutlineClipboardList,
} from "react-icons/hi";
import CustomModal from "../../../components/common/CustomModal";
import { Expense } from "../types/Expenses";

interface Props {
  open: boolean;
  onClose: () => void;
  expense: Expense | null;
  onEdit?: (expense: Expense) => void;
}

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n ?? 0);

const PAYMENT_META: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  CASH: {
    label: "Cash",
    icon: <HiOutlineCash size={14} />,
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  UPI: {
    label: "UPI",
    icon: <HiOutlineDeviceMobile size={14} />,
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
  BANK_TRANSFER: {
    label: "Bank Transfer",
    icon: <HiOutlineLibrary size={14} />,
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  CARD: {
    label: "Card",
    icon: <HiOutlineCreditCard size={14} />,
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
  },
  CHEQUE: {
    label: "Cheque",
    icon: <HiOutlineDocumentText size={14} />,
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
};

const STATUS_META: Record<
  string,
  { label: string; dot: string; color: string; bg: string }
> = {
  PAID: {
    label: "Paid",
    dot: "bg-emerald-500",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  APPROVED: {
    label: "Approved",
    dot: "bg-blue-500",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  PENDING: {
    label: "Pending",
    dot: "bg-amber-500",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  REJECTED: {
    label: "Rejected",
    dot: "bg-red-500",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
  },
};

const Field = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
      <span className="text-slate-300">{icon}</span>
      {label}
    </div>
    <div className="text-[14px] font-medium text-slate-800">{children}</div>
  </div>
);

const ExpenseViewModal: React.FC<Props> = ({
  open,
  onClose,
  expense,
  onEdit,
}) => {
  if (!expense) return null;

  const payment = PAYMENT_META[expense.paymentMode] ?? PAYMENT_META.CASH;
  const status = STATUS_META[expense.status] ?? STATUS_META.PENDING;

  const footer = (
    <div className="flex gap-2">
      <button
        onClick={onClose}
        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50"
      >
        Close
      </button>
      {onEdit && (
        <button
          onClick={() => {
            onClose();
            onEdit(expense);
          }}
          className="flex-[2] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold"
        >
          Edit Expense
        </button>
      )}
    </div>
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Expense Details"
      subtitle={expense.expenseNo}
      icon={<HiOutlineReceiptTax className="w-5 h-5" />}
      iconTone="red"
      size="lg"
      footer={footer}
    >
      <div className="space-y-5">
        <div className="rounded-xl bg-rose-50 border border-rose-100 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1">
              Amount
            </div>
            <div className="text-3xl font-extrabold text-rose-700 tracking-tight">
              {inr(expense.amount)}
            </div>
            {expense.gstAmount && expense.gstAmount > 0 && (
              <div className="text-[12px] text-rose-400 mt-1">
                incl. {inr(expense.gstAmount)} GST
              </div>
            )}
          </div>

          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold border ${status.bg} ${status.color}`}
          >
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Field icon={<HiOutlineUser size={13} />} label="Vendor / Payee">
            {expense.vendorName}
          </Field>
          <Field icon={<HiOutlineTag size={13} />} label="Category">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold">
              {expense.categoryName}
            </span>
          </Field>
        </div>

        {/* Row 2: Description */}
        <Field icon={<HiOutlineDocumentText size={13} />} label="Description">
          {expense.description}
        </Field>

        {/* Row 3: Payment Mode + Date */}
        <div className="grid grid-cols-2 gap-5">
          <Field icon={<HiOutlineCash size={13} />} label="Payment Mode">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[13px] font-semibold ${payment.bg} ${payment.color}`}
            >
              {payment.icon}
              {payment.label}
            </span>
          </Field>
          <Field icon={<HiOutlineCalendar size={13} />} label="Date">
            {dayjs(expense.date).format("DD MMM YYYY")}
          </Field>
        </div>

        {/* Notes — only show if present */}
        {expense.description && (
          <Field icon={<HiOutlineClipboardList size={13} />} label="Notes">
            <span className="text-slate-500 italic text-[13px]">
              {/* notes field — may be separate from description */}
              No additional notes
            </span>
          </Field>
        )}

        {/* Expense number + metadata footer */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Expense No
            <span className="ml-2 font-mono font-bold text-slate-600 text-[12px]">
              {expense.expenseNo}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
            <HiOutlineCheckCircle size={13} />
            Recorded
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ExpenseViewModal;
