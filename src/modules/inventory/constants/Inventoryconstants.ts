import { AlertPriority, MovementType, StockStatus } from "../types/Inventory";

/* ------------------------------ Tabs ------------------------------ */

export const INVENTORY_TABS = [
  { key: "stock", label: "Stock Overview" },
  { key: "alerts", label: "Low Stock Alerts" },
  { key: "movements", label: "Movement History" },
] as const;

export type InventoryTabKey = (typeof INVENTORY_TABS)[number]["key"];

/* --------------------------- Stock status -------------------------- */

export const STOCK_STATUS_CONFIG: Record<
  StockStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  IN_STOCK: {
    label: "In Stock",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
  LOW_STOCK: {
    label: "Low Stock",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
  },
};

// CHANGED: filter values uppercase to match backend
export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "IN_STOCK", label: "In Stock" },
  { value: "LOW_STOCK", label: "Low Stock" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
];

/* ------------------------- Movement config ------------------------- */

export const MOVEMENT_TYPE_CONFIG: Record<
  "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT",
  { label: string; color: string; bg: string; sign: 1 | -1 | 0 }
> = {
  STOCK_IN: { label: "Stock In", color: "#059669", bg: "#ecfdf5", sign: 1 },
  STOCK_OUT: { label: "Stock Out", color: "#dc2626", bg: "#fef2f2", sign: -1 },
  ADJUSTMENT: { label: "Adjustment", color: "#7c3aed", bg: "#f5f3ff", sign: 0 },
};

// (2) Keyed by MODAL action (lowercase) — used by Stockentrymodal via `mode`.
export const MOVEMENT_TYPE_MODAL_CONFIG: Record<
  MovementType,
  { label: string; color: string }
> = {
  stock_in: { label: "Stock In", color: "#059669" },
  stock_out: { label: "Stock Out", color: "#dc2626" },
  adjustment: { label: "Stock Adjustment", color: "#7c3aed" },
};

export const SOURCE_OPTIONS: Record<
  MovementType,
  { value: string; label: string }[]
> = {
  stock_in: [
    { value: "PRODUCTION", label: "Production" },
    { value: "PURCHASE", label: "Purchase" },
    { value: "CUSTOMER_RETURN", label: "Customer Return" },
    { value: "OPENING_STOCK", label: "Opening Stock" },
  ],
  stock_out: [
    { value: "DELIVERY", label: "Delivery" },
    { value: "INTERNAL_USE", label: "Internal Use" },
    { value: "DAMAGE", label: "Damage / Breakage" },
  ],
  adjustment: [
    { value: "STOCK_COUNT_CORRECTION", label: "Stock Count Correction" },
  ],
};

export const SOURCE_LABELS: Record<string, string> = {
  PRODUCTION: "Production",
  PURCHASE: "Purchase",
  CUSTOMER_RETURN: "Customer Return",
  OPENING_STOCK: "Opening Stock",
  DELIVERY: "Delivery",
  INTERNAL_USE: "Internal Use",
  DAMAGE: "Damage / Breakage",
  STOCK_COUNT_CORRECTION: "Stock Count Correction",
};

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Water Products", label: "Water Products" },
  { value: "Accessories", label: "Accessories" },
  { value: "Spare Parts", label: "Spare Parts" },
];

/* ---------------------------- Priorities --------------------------- */

export const ALERT_PRIORITY_CONFIG: Record<
  AlertPriority,
  { label: string; color: string; bg: string }
> = {
  critical: { label: "Critical", color: "#dc2626", bg: "#fef2f2" },
  warning: { label: "Warning", color: "#d97706", bg: "#fffbeb" },
};

/* ---------------------------- Pagination ---------------------------- */

export const TABLE_PAGE_SIZE = 10;
export const MOVEMENTS_PAGE_SIZE = 8;
