import type { Dayjs } from "dayjs";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";

export type ProductUnit = "PCS" | "LITRE" | "ML" | "BOX" | "CARTON" | "KG";

export type ProductCategoryId = string;

// ─── CATEGORY ─────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  bg: string;
  description?: string | null;
  isActive: boolean;
  productCount: number;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  color?: string;
  bg?: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

// ─── PRODUCT — what the API returns ───────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  hsn?: string | null;
  unit: ProductUnit;
  status: ProductStatus;
  isSellable: boolean;

  // Pricing
  basePrice: number;
  costPrice: number;
  gstRate: number;

  // Inventory
  stock: number;
  minStock: number;

  // Relations
  categoryId: string;
  category?: Category;

  companyId: string;
  createdAt: string;
  updatedAt: string;
}

// API payloads
export interface CreateProductPayload {
  name: string;
  sku: string;
  categoryId: string;
  unit?: ProductUnit;
  status?: ProductStatus;
  hsn?: string;
  description?: string;
  basePrice: number;
  costPrice?: number;
  gstRate?: number;
  stock?: number;
  minStock?: number;
}

export type UpdateProductPayload = Partial<CreateProductPayload> & {
  isSellable?: boolean;
};

export interface ProductFormValues {
  name: string;
  sku: string;
  categoryId: string;
  unit: ProductUnit;
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

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "name" | "sku" | "basePrice" | "stock" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ─── STATS (for the 4 dashboard cards) ────────────────────────────────────

export interface ProductStats {
  total: number;
  active: number;
  outOfStock: number;
  lowStock: number;
}

// ─── ALERTS (derived from products by backend) ────────────────────────────
// No more rules/channels/notifications. Just severity + message.

export type AlertSeverity = "critical" | "warning";

export interface ProductAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  severity: AlertSeverity;
  stock: number;
  minStock: number;
  unit: ProductUnit;
  message: string;
}

// ─── ADAPTERS — Form ↔ API ────────────────────────────────────────────────
// Helpers to convert between form values (strings) and API payloads (numbers).

export const formValuesToCreatePayload = (
  data: ProductFormValues
): CreateProductPayload => ({
  name: data.name.trim(),
  sku: data.sku.trim().toUpperCase(),
  categoryId: data.categoryId,
  unit: data.unit,
  hsn: data.hsn?.trim() || undefined,
  description: data.description?.trim() || undefined,
  basePrice: Number(data.basePrice) || 0,
  costPrice: Number(data.costPrice) || 0,
  gstRate: Number(data.gstRate) || 0,
  stock: Number(data.stock) || 0,
  minStock: Number(data.minStock) || 0,
});

export const productToFormValues = (product: Product): ProductFormValues => ({
  name: product.name,
  sku: product.sku,
  categoryId: product.categoryId,
  unit: product.unit,
  basePrice: String(product.basePrice),
  gstRate: product.gstRate,
  costPrice: String(product.costPrice),
  stock: String(product.stock),
  minStock: String(product.minStock),
  hsn: product.hsn || "",
  description: product.description || "",
});

// ─── DISPLAY MAPS — for status badges (categories now come from API) ──────

export const STATUS_DISPLAY: Record<
  ProductStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  ACTIVE: {
    label: "Active",
    color: "#16a34a",
    bg: "#dcfce7",
    dot: "bg-emerald-500",
  },
  INACTIVE: {
    label: "Inactive",
    color: "#64748b",
    bg: "#f1f5f9",
    dot: "bg-slate-400",
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    color: "#dc2626",
    bg: "#fee2e2",
    dot: "bg-red-500",
  },
};

export const UNIT_DISPLAY: Record<ProductUnit, string> = {
  PCS: "Pieces",
  LITRE: "Litre",
  ML: "Millilitre",
  BOX: "Box",
  CARTON: "Carton",
  KG: "Kilogram",
};

// ─── DROPDOWN OPTIONS ─────────────────────────────────────────────────────

export const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
  { value: "INACTIVE", label: "Inactive" },
];

export const UNIT_OPTIONS = [
  { value: "PCS", label: "Pieces" },
  { value: "LITRE", label: "Litre" },
  { value: "ML", label: "Millilitre" },
  { value: "BOX", label: "Box" },
  { value: "CARTON", label: "Carton" },
  { value: "KG", label: "Kilogram" },
];

export const GST_OPTIONS = [
  { value: 0, label: "0% — Exempt" },
  { value: 5, label: "5% GST" },
  { value: 12, label: "12% GST" },
  { value: 18, label: "18% GST" },
  { value: 28, label: "28% GST" },
];

// ─── ALERT HELPERS — now derived from product directly ────────────────────

export const getProductAlertSeverity = (
  product: Pick<Product, "stock" | "minStock">
): AlertSeverity | null => {
  if (product.stock === 0) return "critical";
  if (product.minStock > 0 && product.stock <= product.minStock)
    return "warning";
  return null;
};
