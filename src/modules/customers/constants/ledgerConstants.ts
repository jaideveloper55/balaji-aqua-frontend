import {
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import {
  EntryStyle,
  EntryType,
  PaymentStatus,
  StatusStyle,
} from "../types/Customer";

export const ENTRY_MAP: Record<EntryType, EntryStyle> = {
  invoice: {
    label: "Invoice",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  payment: {
    label: "Payment",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  credit_note: {
    label: "Credit Note",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    dot: "bg-cyan-500",
  },
  debit_note: {
    label: "Debit Note",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
};

export const STATUS_MAP: Record<PaymentStatus, StatusStyle> = {
  paid: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: HiOutlineCheckCircle,
  },
  partially_paid: {
    label: "Partial",
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: HiOutlineExclamation,
  },
  unpaid: {
    label: "Unpaid",
    bg: "bg-red-50",
    text: "text-red-600",
    icon: HiOutlineInformationCircle,
  },
  adjusted: {
    label: "Adjusted",
    bg: "bg-slate-100",
    text: "text-slate-600",
    icon: HiOutlineCheckCircle,
  },
};

export const TYPE_FILTER_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "invoice", label: "Invoice" },
  { value: "payment", label: "Payment" },
  { value: "credit_note", label: "Credit Note" },
  { value: "debit_note", label: "Debit Note" },
];

export const EXPORT_TYPE_OPTIONS = [...TYPE_FILTER_OPTIONS];

export const EXPORT_FORMAT_OPTIONS = [
  { value: "pdf", label: "PDF Report" },
  { value: "csv", label: "CSV Spreadsheet" },
];

export const PAGE_SIZE = 10;
