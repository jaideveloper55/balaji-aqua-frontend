// ─────────────────────────────────────────────────────────────────────────────
// src/modules/dashboard/types/Dashboard.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for the dashboard data shape. Matches the backend
// DashboardSummaryDto field-for-field, AND matches the prop interfaces the
// components already define (Dashboardkpicards, Smartalertstrip, etc.).
// ─────────────────────────────────────────────────────────────────────────────

// KPI numbers — IDENTICAL to the `DashboardKPIs` interface in Dashboardkpicards.tsx
export interface DashboardKpis {
  totalCustomers: number;
  newThisMonth: number;
  totalOutstanding: number;
  customersWithDues: number;
  todayCollection: number;
  todayInvoices: number;
  totalBilled: number;
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
}

// Alert chip — matches the `SmartAlert` interface in Smartalertstrip.tsx
export interface SmartAlert {
  label: string;
  color: "red" | "amber" | "blue";
}

// One slice of the payment-mode chart
export interface PaymentModeSlice {
  name: string; // "CASH" | "UPI" | "BANK_TRANSFER" | ...
  value: number;
}

// The age-bucketed outstanding totals — three raw numbers from the API.
// Named deliberately UNLIKE the chart component's `OutstandingBucket` type
// (name/value/color) so the two can never be mistaken for each other.
export interface OutstandingRiskTotals {
  highRisk: number;
  medium: number;
  recent: number;
}

// One customer in the "customers with dues" list — matches `DueCustomer` in
// Outstandingcustomerspanel.tsx exactly (id, type, and outstandingBalance are
// all required there; phone is extra, kept for a future Call/WhatsApp button).
export interface DueCustomer {
  id: string;
  name: string;
  customerCode: string;
  type: string;
  phone: string;
  outstandingBalance: number;
  overdueDays: number;
}

// One product row in the stock-levels panel — matches `StockRow` in
// Stocklevelspanel.tsx exactly.
export interface StockRow {
  id: string;
  name: string;
  sku: string;
  unit: string;
  stock: number;
  minStock: number;
}

// The full payload from GET /dashboard/summary
export interface DashboardSummary {
  kpis: DashboardKpis;
  paymentMode: PaymentModeSlice[];
  buckets: OutstandingRiskTotals;
  dueCustomers: DueCustomer[];
  stockRows: StockRow[];
}

// Optional query params for GET /dashboard/summary. Both omitted → the live
// dashboard's normal "today" view. Both provided → the export flow's
// range-scoped report. Matches the pattern EventFilters uses in your Events
// module: the filter shape lives here, Dashboard.api.ts just imports it.
export interface DashboardSummaryFilters {
  dateFrom?: string;
  dateTo?: string;
}

// One event in the "Today's Events" panel — matches TodayEventsPanel.tsx's
// own type exactly (it's the one indexing TYPE_STYLES, so `type` must be one
// of these seven exact strings). This is NOT the raw EventOrder shape from
// your Events module — that uses SCREAMING_CASE enum values (WEDDING,
// HOUSE_WARMING) and many more fields. DashboardPage maps one to the other;
// see the EVENT_TYPE_LABEL lookup there.
export interface TodayEvent {
  id: string;
  type:
    | "Wedding"
    | "Corporate"
    | "Engagement"
    | "Birthday"
    | "House Warming"
    | "Religious"
    | "Other";
  customer: string;
  time: string;
  venue: string;
}
