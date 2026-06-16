import type { Dayjs } from "dayjs";

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
export type MovementType = "stock_in" | "stock_out" | "adjustment";
export type AlertPriority = "critical" | "warning";

export const STOCK_IN_SOURCES = [
  "PURCHASE",
  "PRODUCTION",
  "RETURN",
  "OPENING_BALANCE",
] as const;
export const STOCK_OUT_SOURCES = [
  "SALE",
  "DAMAGE",
  "TRANSFER",
  "INTERNAL_USE",
] as const;
export type StockSource =
  | (typeof STOCK_IN_SOURCES)[number]
  | (typeof STOCK_OUT_SOURCES)[number];

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  unit: string;
  category: string | null;
  categoryId: string | null;
  current: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  stockHealth: number;
  status: StockStatus;
}

export interface StockMovement {
  id: string;
  date: string;
  product: { name: string; sku: string };
  type: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT";
  quantity: number;
  balance: number;
  source: string;
  referenceId: string | null;
  user: string;
  remarks: string | null;
}

export interface InventoryKpis {
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  damagedItems: number;
  inwardToday: number;
  outwardToday: number;
}

// ─── Modal form values ───────────────────────────────────────────────
export interface StockEntryFormValues {
  productId: string;
  qty: number | string;
  source: string;
  refId?: string;
  remarks?: string;
}

export interface InventoryFilters {
  search: string;
  status: "all" | StockStatus;
  category: string;
  dateRange: [Dayjs | null, Dayjs | null] | null;
}

// ─── Helpers: return backend-computed fields (one source of truth) ───
export const getAvailable = (item: StockItem): number => item.available;
export const getStockStatus = (item: StockItem): StockStatus => item.status;
export const getStockHealth = (item: StockItem): number => item.stockHealth;
