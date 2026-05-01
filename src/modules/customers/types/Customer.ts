// ─── Customer (matches backend Prisma schema) ───────────────────────────────

export type CustomerStatus = "ACTIVE" | "INACTIVE" | "PENDING";
export type CustomerType = "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL";
export type PaymentMode = "CASH" | "UPI" | "BANK_TRANSFER" | "CREDIT" | "CARD";
export type DeliveryFrequency =
  | "DAILY"
  | "ALTERNATE"
  | "WEEKLY"
  | "MONTHLY"
  | "ON_DEMAND";

// Customer in list view (less detail, faster query)
export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  email: string | null;
  type: CustomerType;
  status: CustomerStatus;
  outstandingBalance: number;
  deliveryFrequency: DeliveryFrequency | null;
  paymentMode: PaymentMode | null;
  createdAt: string;
}

// Customer in detail view (full info + summary cards)
export interface CustomerDetail extends Customer {
  // Address (flat fields matching Prisma schema)
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  landmark: string | null;

  // Notes
  notes: string | null;
  updatedAt?: string;

  // Summary cards data (computed by backend)
  summary: {
    totalOrders: number;
    outstandingBalance: number;
    memberSince: string;
    lastOrderDate: string | null;
  };
}

// ─── Per-Customer Pricing ───────────────────────────────────────────────────

export interface CustomerPricing {
  id: string;
  customerId: string;
  productId: string;
  customerPrice: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  createdAt: string;

  // Optional fields populated from join (frontend may need to join product name)
  product?: {
    id: string;
    name: string;
    sku: string;
    unit: string;
    basePrice: number;
  };
}

export interface CustomerPricingFormValues {
  productId: string;
  customerPrice: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

// ─── Product ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
  basePrice: number;
}

// ─── Forms ──────────────────────────────────────────────────────────────────

// What the Add/Edit form collects from the user
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

// ─── API Requests ───────────────────────────────────────────────────────────

export type CreateCustomerRequest = CustomerFormValues;

export type UpdateCustomerRequest = Partial<CustomerFormValues> & {
  status?: CustomerStatus;
};

// ─── API Query (URL params for GET /customers) ──────────────────────────────

export interface CustomerQuery {
  status?: CustomerStatus;
  type?: CustomerType;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "outstandingBalance";
  sortOrder?: "asc" | "desc";
}

// ─── API Responses ──────────────────────────────────────────────────────────

export interface CustomerListResponse {
  data: Customer[];
  stats: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CustomerStatsResponse {
  total: number;
  byStatus: Array<{ status: CustomerStatus; _count: number }>;
  byType: Array<{ type: CustomerType; _count: number }>;
  topOutstanding: Array<{
    id: string;
    name: string;
    customerCode: string;
    outstandingBalance: number;
  }>;
}

// ─── Ledger ─────────────────────────────────────────────────────────────────

import type { Dayjs } from "dayjs";

// Backend uses UPPERCASE for Prisma enums
export type EntryType = "INVOICE" | "PAYMENT" | "CREDIT_NOTE" | "DEBIT_NOTE";
export type PaymentStatus = "PAID" | "PARTIALLY_PAID" | "UNPAID" | "ADJUSTED";
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
  customerId: string;
  entryDate: string;
  entryType: EntryType;
  referenceNo: string | null;
  description: string | null;
  debitAmount: number;
  creditAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  balance: number;
  createdAt: string;
}

export interface LedgerSummary {
  totalDebit: number;
  totalCredit: number;
  outstanding: number;
  totalEntries: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
}

export interface LedgerResponse {
  summary: LedgerSummary;
  data: LedgerEntry[];
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
