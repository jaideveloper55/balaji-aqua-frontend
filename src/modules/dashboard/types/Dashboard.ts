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

export interface SmartAlert {
  label: string;
  color: "red" | "amber" | "blue";
}

// One slice of the payment-mode chart
export interface PaymentModeSlice {
  name: string;
  value: number;
}

export interface OutstandingRiskTotals {
  highRisk: number;
  medium: number;
  recent: number;
}

export interface DueCustomer {
  id: string;
  name: string;
  customerCode: string;
  type: string;
  phone: string;
  outstandingBalance: number;
  overdueDays: number;
}

export interface StockRow {
  id: string;
  name: string;
  sku: string;
  unit: string;
  stock: number;
  minStock: number;
}

export interface DashboardPeriod {
  from: string;
  to: string;
  isCustomRange: boolean;
}

export interface DashboardSummary {
  kpis: DashboardKpis;
  period: DashboardPeriod;
  paymentMode: PaymentModeSlice[];
  buckets: OutstandingRiskTotals;
  dueCustomers: DueCustomer[];
  stockRows: StockRow[];
}

export interface DashboardSummaryFilters {
  dateFrom?: string;
  dateTo?: string;
}

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
