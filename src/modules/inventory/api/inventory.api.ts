import authAxios from "../../../lib/axios";
import type { StockItem, StockMovement } from "../types/Inventory";

export interface InventoryFilters {
  search: string;
  status: "all" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  category: string;
  dateRange: [import("dayjs").Dayjs, import("dayjs").Dayjs] | null;
}

export interface MovementFilters {
  search?: string;
  type?: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT";
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ─── Write payloads (request bodies) ─────────────────────────────────
export interface StockInPayload {
  productId: string;
  quantity: number;
  source: string;
  referenceId?: string;
  remarks?: string;
}
export interface StockOutPayload {
  productId: string;
  quantity: number;
  source: string;
  referenceId?: string;
  remarks?: string;
}
export interface AdjustPayload {
  productId: string;
  countedQuantity: number;
  referenceId?: string;
  remarks?: string;
}

// ─── Response envelopes ──────────────────────────────────────────────
export interface InventorySummary {
  totalStockValue: number;
  lowStock: number;
  outOfStock: number;
  damagedItems: number;
  inwardToday: number;
  outwardToday: number;
}

export interface StockListFilters {
  search?: string;
  status?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// Low-stock has its OWN meta shape (total + critical), and each row carries
// the extra deficit/critical fields the backend adds.
export interface LowStockRow extends StockItem {
  deficit: number;
  critical: boolean;
}
export interface LowStockResponse {
  data: LowStockRow[];
  meta: { total: number; critical: number };
}

// GET /inventory/summary
export const getInventorySummaryApi = () => {
  return authAxios.get<InventorySummary>("/inventory/summary");
};

// GET /inventory/stock
export const getStockListApi = (filters: StockListFilters = {}) => {
  return authAxios.get<Paginated<StockItem>>("/inventory/stock", {
    params: filters,
  });
};

// GET /inventory/low-stock
export const getLowStockApi = () => {
  return authAxios.get<LowStockResponse>("/inventory/low-stock");
};

// GET /inventory/movements
export const getMovementsApi = (filters: MovementFilters = {}) => {
  return authAxios.get<Paginated<StockMovement>>("/inventory/movements", {
    params: filters,
  });
};

// POST /inventory/stock-in
export const stockInApi = (payload: StockInPayload) => {
  return authAxios.post("/inventory/stock-in", payload);
};

// POST /inventory/stock-out
export const stockOutApi = (payload: StockOutPayload) => {
  return authAxios.post("/inventory/stock-out", payload);
};

// POST /inventory/adjust
export const adjustStockApi = (payload: AdjustPayload) => {
  return authAxios.post("/inventory/adjust", payload);
};
