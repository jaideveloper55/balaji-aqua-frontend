import api from "../../../lib/axios";
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

interface Paginated<T> {
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

// ─── The client ──────────────────────────────────────────────────────
export const inventoryApi = {
  getSummary: async (): Promise<InventorySummary> => {
    const res = await api.get<InventorySummary>("/inventory/summary");
    return res.data;
  },

  getStockList: async (
    filters: StockListFilters = {}
  ): Promise<Paginated<StockItem>> => {
    const res = await api.get("/inventory/stock", { params: filters });
    return res.data;
  },

  getLowStock: async (): Promise<LowStockResponse> => {
    const res = await api.get("/inventory/low-stock");
    return res.data;
  },

  getMovements: async (
    filters: MovementFilters = {}
  ): Promise<Paginated<StockMovement>> => {
    const res = await api.get("/inventory/movements", { params: filters });
    return res.data;
  },

  stockIn: async (payload: StockInPayload) => {
    const res = await api.post("/inventory/stock-in", payload);
    return res.data;
  },

  stockOut: async (payload: StockOutPayload) => {
    const res = await api.post("/inventory/stock-out", payload);
    return res.data;
  },

  adjust: async (payload: AdjustPayload) => {
    const res = await api.post("/inventory/adjust", payload);
    return res.data;
  },
};
