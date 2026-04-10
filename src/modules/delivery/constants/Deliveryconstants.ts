import { DeliveryPriority, DeliveryStatus } from "../types/delivery";

export const STATUS_MAP: Record<
  DeliveryStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50 border border-amber-200",
    dot: "bg-amber-400",
  },
  out: {
    label: "Out for Delivery",
    color: "text-blue-700",
    bg: "bg-blue-50 border border-blue-200",
    dot: "bg-blue-500",
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    color: "text-red-700",
    bg: "bg-red-50 border border-red-200",
    dot: "bg-red-500",
  },
  rescheduled: {
    label: "Rescheduled",
    color: "text-purple-700",
    bg: "bg-purple-50 border border-purple-200",
    dot: "bg-purple-500",
  },
};

// ─── Priority Visual Config ─────────────────────────────────────
export const PRIORITY_MAP: Record<
  DeliveryPriority,
  { label: string; color: string; bg: string }
> = {
  normal: {
    label: "Normal",
    color: "text-slate-600",
    bg: "bg-slate-50 border border-slate-200",
  },
  high: {
    label: "High",
    color: "text-orange-700",
    bg: "bg-orange-50 border border-orange-200",
  },
  urgent: {
    label: "Urgent",
    color: "text-red-700",
    bg: "bg-red-50 border border-red-200",
  },
};

// ─── Select Options ─────────────────────────────────────────────
export const PRODUCT_OPTIONS = [
  { value: "20l_can", label: "20L Can" },
  { value: "5l_bottle", label: "5L Bottle" },
  { value: "1l_bottle", label: "1L Bottle" },
  { value: "500ml_bottle", label: "500ml Bottle" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "out", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "failed", label: "Failed" },
  { value: "rescheduled", label: "Rescheduled" },
];
