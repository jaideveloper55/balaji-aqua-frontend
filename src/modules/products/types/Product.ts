// src/modules/products/types/Product.ts

import type { Dayjs } from "dayjs";

// ── Product Types ─────────────────────────────────────────────

export type ProductCategory =
  | "water_can"
  | "bottle"
  | "filter"
  | "accessory"
  | "service";
export type ProductStatus = "active" | "inactive" | "out_of_stock";
export type UnitType = "pcs" | "ltr" | "kg" | "set" | "lot";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  status: ProductStatus;
  unit: UnitType;
  basePrice: number;
  gstRate: number;
  sellingPrice: number;
  costPrice: number;
  stock: number;
  minStock: number;
  hsn: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormValues {
  name: string;
  sku: string;
  category: ProductCategory;
  unit: UnitType;
  basePrice: number | string;
  gstRate: number | string;
  costPrice: number | string;
  stock: number | string;
  minStock: number | string;
  hsn: string;
  description: string;
}

export interface ProductFilterFormValues {
  categoryFilter: string;
  statusFilter: string;
  dateRange: [Dayjs | null, Dayjs | null] | null;
}

// ── Alert System Types ────────────────────────────────────────

export type AlertTrigger =
  | "stock_zero" // Stock reaches 0
  | "stock_below_min" // Stock falls below minStock
  | "stock_below_custom" // Stock falls below custom threshold
  | "stock_below_percent" // Stock falls below X% of last restock
  | "price_change" // Price changed
  | "inactive_product" // Product marked inactive
  | "no_sales_days"; // No sales for X days

export type AlertSeverity = "critical" | "warning" | "info";

export type AlertChannel = "in_app" | "email" | "sms" | "whatsapp";

export type AlertStatus = "active" | "paused";

export interface AlertRule {
  id: string;
  name: string;
  trigger: AlertTrigger;
  severity: AlertSeverity;
  channels: AlertChannel[];
  enabled: boolean;
  status: AlertStatus;
  threshold?: number;
  categories: ProductCategory[] | "all";
  recipients: string[];
  createdAt: string;
  lastTriggeredAt?: string;
  triggerCount: number;
}

export interface AlertRuleFormValues {
  name: string;
  trigger: AlertTrigger;
  severity: AlertSeverity;
  channels: AlertChannel[];
  threshold: number | string;
  categories: string;
  recipients: string;
}

export interface AlertNotification {
  id: string;
  ruleId: string;
  ruleName: string;
  productId: string;
  productName: string;
  severity: AlertSeverity;
  message: string;
  channels: AlertChannel[];
  isRead: boolean;
  createdAt: string;
}
