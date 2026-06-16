import {
  HiOutlineUsers,
  HiOutlineCurrencyRupee,
  HiOutlineExclamationCircle,
  HiOutlineUserAdd,
} from "react-icons/hi";
import type {
  CustomerStatus,
  CustomerType,
  DeliveryFrequency,
  PaymentMode,
} from "../types/Customer";

export type StatusConfig = {
  label: string;
  dot: string;
  bg: string;
  text: string;
};

export const STATUS_MAP: { [K in CustomerStatus]: StatusConfig } = {
  ACTIVE: {
    label: "Active",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  INACTIVE: {
    label: "Inactive",
    dot: "bg-slate-400",
    bg: "bg-slate-50",
    text: "text-slate-500",
  },
  PENDING: {
    label: "Pending",
    dot: "bg-amber-400",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
};

// ─── Type Display ──────────────────────────────────────────────────────────

export const TYPE_MAP: { [K in CustomerType]: string } = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
};

// ─── Filter Dropdown Options (still useful for the filter row) ─────────────

export const STATUS_OPTIONS: { value: CustomerStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING", label: "Pending" },
];

export const TYPE_OPTIONS: { value: CustomerType; label: string }[] = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDUSTRIAL", label: "Industrial" },
];

export const CUSTOMER_STAT_CONFIG = [
  {
    key: "total" as const,
    icon: <HiOutlineUsers size={20} />,
    label: "Total Customers",
    color: "#2563eb",
    bg: "#eff6ff",
    tooltip: "All customers in your network",
    format: "number" as const,
  },
  {
    key: "totalOutstanding" as const,
    icon: <HiOutlineCurrencyRupee size={20} />,
    label: "Total Outstanding",
    color: "#dc2626",
    bg: "#fef2f2",
    tooltip: "Sum of all pending dues across customers",
    format: "currency" as const,
    alertWhenPositive: true,
  },
  {
    key: "customersWithDues" as const,
    icon: <HiOutlineExclamationCircle size={20} />,
    label: "With Pending Dues",
    color: "#f59e0b",
    bg: "#fffbeb",
    tooltip: "Number of customers who owe money",
    format: "number" as const,
  },
  {
    key: "newThisMonth" as const,
    icon: <HiOutlineUserAdd size={20} />,
    label: "New This Month",
    color: "#10b981",
    bg: "#ecfdf5",
    tooltip: "Customers added since the start of this month",
    format: "number" as const,
  },
] as const;

// ─── Form Field Options ────────────────────────────────────────────────────

export const CUSTOMER_TYPE_OPTIONS: { value: CustomerType; label: string }[] = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDUSTRIAL", label: "Industrial" },
];

export const DELIVERY_FREQUENCY_OPTIONS: {
  value: DeliveryFrequency;
  label: string;
}[] = [
  { value: "DAILY", label: "Daily" },
  { value: "ALTERNATE", label: "Alternate Days" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "ON_DEMAND", label: "On Demand" },
];

export const PAYMENT_MODE_OPTIONS: { value: PaymentMode; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CREDIT", label: "Credit" },
];

// ─── State Options (already string values, no enum) ────────────────────────

export const STATE_OPTIONS = [
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Kerala", label: "Kerala" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Telangana", label: "Telangana" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "West Bengal", label: "West Bengal" },
  { value: "Delhi", label: "Delhi" },
];

// ─── Form Defaults ─────────────────────────────────────────────────────────

export const CUSTOMER_FORM_DEFAULTS = {
  name: "",
  phone: "",
  email: "",
  type: "RESIDENTIAL" as CustomerType,
  outstandingBalance: 0,
  deliveryFrequency: "DAILY" as DeliveryFrequency,
  paymentMode: "CASH" as PaymentMode,
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "Tamil Nadu",
  pincode: "",
  landmark: "",
  notes: "",
};
