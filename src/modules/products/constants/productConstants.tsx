import type {
  ProductCategory,
  ProductStatus,
  UnitType,
  AlertTrigger,
  AlertSeverity,
  AlertChannel,
} from "../types/Product";

// ── Product Maps ──────────────────────────────────────────────

export const CATEGORY_MAP: Record<
  ProductCategory,
  { label: string; color: string; bg: string }
> = {
  water_can: { label: "Water Can", color: "#2563eb", bg: "#eff6ff" },
  bottle: { label: "Bottle", color: "#0891b2", bg: "#ecfeff" },
  filter: { label: "Filter", color: "#7c3aed", bg: "#f5f3ff" },
  accessory: { label: "Accessory", color: "#d97706", bg: "#fffbeb" },
  service: { label: "Service", color: "#059669", bg: "#ecfdf5" },
};

export const STATUS_MAP: Record<
  ProductStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  active: {
    label: "Active",
    color: "#059669",
    bg: "#ecfdf5",
    dot: "bg-emerald-500",
  },
  inactive: {
    label: "Inactive",
    color: "#64748b",
    bg: "#f8fafc",
    dot: "bg-slate-400",
  },
  out_of_stock: {
    label: "Out of Stock",
    color: "#dc2626",
    bg: "#fef2f2",
    dot: "bg-red-500",
  },
};

export const UNIT_MAP: Record<UnitType, string> = {
  pcs: "Pieces",
  ltr: "Litres",
  kg: "Kilograms",
  set: "Sets",
  lot: "Lots",
};

// ── Product Options ───────────────────────────────────────────

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "water_can", label: "Water Can" },
  { value: "bottle", label: "Bottle" },
  { value: "filter", label: "Filter" },
  { value: "accessory", label: "Accessory" },
  { value: "service", label: "Service" },
];

export const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "out_of_stock", label: "Out of Stock" },
];

export const CATEGORY_FORM_OPTIONS = CATEGORY_OPTIONS.filter(
  (o) => o.value !== "all"
);
export const UNIT_OPTIONS = [
  { value: "pcs", label: "Pieces" },
  { value: "ltr", label: "Litres" },
  { value: "kg", label: "Kilograms" },
  { value: "set", label: "Sets" },
  { value: "lot", label: "Lots" },
];

export const GST_OPTIONS = [
  { value: 0, label: "0% - Exempt" },
  { value: 5, label: "5% GST" },
  { value: 12, label: "12% GST" },
  { value: 18, label: "18% GST" },
  { value: 28, label: "28% GST" },
];

export const PAGE_SIZE = 10;

// ── Alert Maps ────────────────────────────────────────────────

export const ALERT_TRIGGER_MAP: Record<
  AlertTrigger,
  { label: string; description: string; icon: string }
> = {
  stock_zero: {
    label: "Out of Stock",
    description: "Stock quantity reaches zero",
    icon: "🚫",
  },
  stock_below_min: {
    label: "Below Minimum",
    description: "Stock falls below the product's minimum stock level",
    icon: "⚠️",
  },
  stock_below_custom: {
    label: "Below Threshold",
    description: "Stock falls below a custom number you set",
    icon: "📉",
  },
  stock_below_percent: {
    label: "Stock % Drop",
    description: "Stock drops below a percentage of last restock quantity",
    icon: "📊",
  },
  price_change: {
    label: "Price Changed",
    description: "Selling price or cost price is modified",
    icon: "💰",
  },
  inactive_product: {
    label: "Product Deactivated",
    description: "A product status changes to inactive",
    icon: "🔇",
  },
  no_sales_days: {
    label: "No Sales Period",
    description: "No sales recorded for X consecutive days",
    icon: "📅",
  },
};

export const ALERT_SEVERITY_MAP: Record<
  AlertSeverity,
  { label: string; color: string; bg: string; border: string }
> = {
  critical: {
    label: "Critical",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "border-red-200",
  },
  warning: {
    label: "Warning",
    color: "#d97706",
    bg: "#fffbeb",
    border: "border-amber-200",
  },
  info: {
    label: "Info",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "border-blue-200",
  },
};

export const ALERT_CHANNEL_MAP: Record<
  AlertChannel,
  { label: string; icon: string; description: string }
> = {
  in_app: {
    label: "In-App",
    icon: "🔔",
    description: "Notification in admin panel",
  },
  email: {
    label: "Email",
    icon: "📧",
    description: "Send to configured email addresses",
  },
  sms: { label: "SMS", icon: "📱", description: "Send SMS alert" },
  whatsapp: {
    label: "WhatsApp",
    icon: "💬",
    description: "Send WhatsApp message",
  },
};

// ── Alert Form Options ────────────────────────────────────────

export const TRIGGER_OPTIONS = Object.entries(ALERT_TRIGGER_MAP).map(
  ([value, { label }]) => ({
    value,
    label,
  })
);

export const SEVERITY_OPTIONS: { value: AlertSeverity; label: string }[] = [
  { value: "critical", label: "🔴 Critical" },
  { value: "warning", label: "🟡 Warning" },
  { value: "info", label: "🔵 Info" },
];

export const CHANNEL_OPTIONS: { value: AlertChannel; label: string }[] = [
  { value: "in_app", label: "🔔 In-App Notification" },
  { value: "email", label: "📧 Email" },
  { value: "sms", label: "📱 SMS" },
  { value: "whatsapp", label: "💬 WhatsApp" },
];

export const ALERT_CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  ...CATEGORY_FORM_OPTIONS,
];

import React from "react";
import {
  HiOutlineCube,
  HiOutlineCheckCircle,
  HiOutlineBan,
  HiOutlineExclamation,
} from "react-icons/hi";

export type ProductStatConfig = {
  key: "total" | "active" | "outOfStock" | "lowStock";
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
  tooltip: string;
  alertWhenPositive?: boolean;
};

export const PRODUCT_STAT_CONFIG: ProductStatConfig[] = [
  {
    key: "total",
    icon: <HiOutlineCube size={20} />,
    label: "Total Products",
    color: "#3b82f6",
    bg: "#eff6ff",
    tooltip: "All products in inventory catalog",
  },
  {
    key: "active",
    icon: <HiOutlineCheckCircle size={20} />,
    label: "Active",
    color: "#22c55e",
    bg: "#f0fdf4",
    tooltip: "Products currently available for sale",
  },
  {
    key: "outOfStock",
    icon: <HiOutlineBan size={20} />,
    label: "Out of Stock",
    color: "#ef4444",
    bg: "#fef2f2",
    tooltip: "Products with zero stock — needs restocking",
    alertWhenPositive: true,
  },
  {
    key: "lowStock",
    icon: <HiOutlineExclamation size={20} />,
    label: "Low Stock",
    color: "#f59e0b",
    bg: "#fffbeb",
    tooltip: "Products below their minimum stock level",
    alertWhenPositive: true,
  },
];
