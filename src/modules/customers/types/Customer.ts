// ─── Customer ────────────────────────────────────────────────────────────────

export type CustomerStatus = "active" | "inactive" | "pending";
export type CustomerType = "residential" | "commercial" | "industrial";
export type PaymentMode = "cash" | "upi" | "bank_transfer" | "credit";
export type DeliveryFrequency = "daily" | "alternate" | "weekly" | "on_demand";

export interface CustomerAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: CustomerType;
  status: CustomerStatus;
  address: CustomerAddress;
  deliveryFrequency: DeliveryFrequency;
  paymentMode: PaymentMode;
  outstandingBalance: number;
  totalOrders: number;
  joinedAt: string;
  lastOrderAt?: string;
  notes?: string;
}

// ─── Per-Customer Pricing ────────────────────────────────────────────────────

export interface CustomerPricing {
  id: string;
  customerId: string;
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  basePrice: number;
  customerPrice: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerPricingFormValues {
  productId: string;
  customerPrice: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

// ─── Ledger ──────────────────────────────────────────────────────────────────

export type LedgerEntryType =
  | "invoice"
  | "payment"
  | "credit_note"
  | "debit_note";

export interface LedgerEntry {
  id: string;
  date: string;
  type: LedgerEntryType;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  referenceNo?: string;
}

// ─── Product (Master) ────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
  basePrice: number;
}

// ─── Form ────────────────────────────────────────────────────────────────────

export interface CustomerFormValues {
  name: string;
  phone: string;
  email?: string;
  type: CustomerType;
  deliveryFrequency: DeliveryFrequency;
  paymentMode: PaymentMode;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  notes?: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface CustomerListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: CustomerStatus;
  type?: CustomerType;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
