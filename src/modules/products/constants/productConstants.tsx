import React from "react";
import {
  HiOutlineCube,
  HiOutlineCheckCircle,
  HiOutlineBan,
  HiOutlineExclamation,
} from "react-icons/hi";

// ─── Page-level constants ─────────────────────────────────────────────────

export const PAGE_SIZE = 10;

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
