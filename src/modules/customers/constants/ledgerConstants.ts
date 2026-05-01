import {
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import type {
  EntryStyle,
  EntryType,
  PaymentStatus,
  StatusStyle,
} from "../types/Customer";

// ─── Ledger Entry Type Styling ────────────────────────────────────────────

export const ENTRY_MAP: Record<EntryType, EntryStyle> = {
  INVOICE: {
    label: "Invoice",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  PAYMENT: {
    label: "Payment",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  CREDIT_NOTE: {
    label: "Credit Note",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    dot: "bg-cyan-500",
  },
  DEBIT_NOTE: {
    label: "Debit Note",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
};

// ─── Payment Status Styling ───────────────────────────────────────────────

export const STATUS_MAP: Record<PaymentStatus, StatusStyle> = {
  PAID: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: HiOutlineCheckCircle,
  },
  PARTIALLY_PAID: {
    label: "Partial",
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: HiOutlineExclamation,
  },
  UNPAID: {
    label: "Unpaid",
    bg: "bg-red-50",
    text: "text-red-600",
    icon: HiOutlineInformationCircle,
  },
  ADJUSTED: {
    label: "Adjusted",
    bg: "bg-slate-100",
    text: "text-slate-600",
    icon: HiOutlineCheckCircle,
  },
};

// ─── Filter Options (UPPERCASE values, but "all" stays lowercase since not an enum) ──

export const TYPE_FILTER_OPTIONS: {
  value: EntryType | "all";
  label: string;
}[] = [
  { value: "all", label: "All Types" },
  { value: "INVOICE", label: "Invoice" },
  { value: "PAYMENT", label: "Payment" },
  { value: "CREDIT_NOTE", label: "Credit Note" },
  { value: "DEBIT_NOTE", label: "Debit Note" },
];

export const EXPORT_TYPE_OPTIONS = [...TYPE_FILTER_OPTIONS];

export const EXPORT_FORMAT_OPTIONS = [
  { value: "pdf", label: "PDF Report" },
  { value: "csv", label: "CSV Spreadsheet" },
];

export const PAGE_SIZE = 10;
