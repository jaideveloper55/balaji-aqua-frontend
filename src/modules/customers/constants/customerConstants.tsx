import {
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineBan,
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
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  inactive: {
    label: "Inactive",
    dot: "bg-slate-400",
    bg: "bg-slate-50",
    text: "text-slate-500",
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
};

export const TYPE_MAP: { [K in CustomerType]: string } = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
};

export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

export const TYPE_OPTIONS = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
];

export const CUSTOMER_STAT_CONFIG = [
  {
    key: "total" as const,
    icon: <HiOutlineUsers size={20} />,
    label: "Total Customers",
    color: "#3b82f6",
    bg: "#eff6ff",
    tooltip: "All registered customers",
  },
  {
    key: "active" as const,
    icon: <HiOutlineCheckCircle size={20} />,
    label: "Active",
    color: "#22c55e",
    bg: "#f0fdf4",
    tooltip: "Customers with active delivery schedule",
  },
  {
    key: "pending" as const,
    icon: <HiOutlineClock size={20} />,
    label: "Pending",
    color: "#f59e0b",
    bg: "#fffbeb",
    tooltip: "Awaiting verification or first delivery",
  },
  {
    key: "inactive" as const,
    icon: <HiOutlineBan size={20} />,
    label: "Inactive",
    color: "#94a3b8",
    bg: "#f8fafc",
    tooltip: "Paused or churned customers",
  },
] as const;

export const CUSTOMER_TYPE_OPTIONS: { value: CustomerType; label: string }[] = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
];

export const DELIVERY_FREQUENCY_OPTIONS: {
  value: DeliveryFrequency;
  label: string;
}[] = [
  { value: "daily", label: "Daily" },
  { value: "alternate", label: "Alternate Days" },
  { value: "weekly", label: "Weekly" },
  { value: "on_demand", label: "On Demand" },
];

export const PAYMENT_MODE_OPTIONS: { value: PaymentMode; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "credit", label: "Credit" },
];

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

export const CUSTOMER_FORM_DEFAULTS = {
  name: "",
  phone: "",
  email: "",
  type: "residential" as CustomerType,
  deliveryFrequency: "daily" as DeliveryFrequency,
  paymentMode: "cash" as PaymentMode,
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "Tamil Nadu",
  pincode: "",
  landmark: "",
  notes: "",
};
