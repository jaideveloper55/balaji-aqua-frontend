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

// src/modules/customers/components/ledger/types.ts

import type { Dayjs } from "dayjs";

export type EntryType = "invoice" | "payment" | "credit_note" | "debit_note";
export type PaymentStatus = "paid" | "partially_paid" | "unpaid" | "adjusted";
export type ExportFormat = "pdf" | "csv";
export type SortDirection = "asc" | "desc";
export type SortKey = "date" | "debit" | "credit" | "balance" | null;

export interface EntryStyle {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export interface StatusStyle {
  label: string;
  bg: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface LineItem {
  name: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
  gstRate: number;
}

export interface EntryDetails {
  customer: string;
  gst: string;
  dueDate: string;
  status: PaymentStatus;
  items: LineItem[];
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: EntryType;
  description: string;
  referenceNo: string;
  debit: number;
  credit: number;
  balance: number;
  baseAmount: number;
  cgst: number;
  sgst: number;
}

export interface LedgerTableProps {
  customerId?: string;
}

export interface FilterFormValues {
  typeFilter: string;
  dateRange: [Dayjs | null, Dayjs | null] | null;
}

export interface ExportFormValues {
  exportDateRange: [Dayjs | null, Dayjs | null] | null;
  exportType: string;
  exportFormat: string;
}
