import { Dayjs } from "dayjs";

// ── Overview ──
export interface InventoryOverviewData {
  totalStockValue: number;
  lowStockItems: number;
  outOfStock: number;
  damagedItems: number;
  inwardToday: number;
  outwardToday: number;
}

// ── Product Stock ──
export type StockStatus = "in_stock" | "low" | "out";

export interface ProductStockRecord {
  key: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  unit: string;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  status: StockStatus;
  lastUpdated: string;
}

// ── Stock Movement ──
export type MovementType = "in" | "out" | "adjust";
export type MovementSource =
  | "purchase"
  | "production"
  | "return"
  | "delivery"
  | "damage"
  | "internal_use"
  | "audit_correction";

export interface StockMovementRecord {
  key: string;
  id: string;
  date: string;
  productId: string;
  productName: string;
  sku: string;
  type: MovementType;
  quantity: number;
  source: MovementSource;
  referenceId: string;
  user: string;
  remarks: string;
  balanceAfter: number;
}

// ── Stock Entry Form (In / Out / Adjust) ──
export type EntryMode = "in" | "out" | "adjust";

export interface StockEntryFormValues {
  productId: string;
  quantity: string;
  source: string;
  supplier: string;
  reason: string;
  referenceId: string;
  date: Dayjs | null;
  notes: string;
  // adjustment only
  oldQty: string;
  newQty: string;
}

// ── Low Stock Alert ──
export interface LowStockAlertRecord {
  key: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  deficit: number;
  unit: string;
  status: "critical" | "low";
  lastOrdered: string | null;
}

// ── Category / Unit ──
export interface CategoryRecord {
  key: string;
  id: string;
  name: string;
  productCount: number;
  description: string;
}

export interface UnitRecord {
  key: string;
  id: string;
  name: string;
  symbol: string;
  productCount: number;
}

// ── Warehouse ──
export interface WarehouseRecord {
  key: string;
  id: string;
  name: string;
  location: string;
  stockValue: number;
  itemCount: number;
  type: "plant" | "storage" | "vehicle";
}
