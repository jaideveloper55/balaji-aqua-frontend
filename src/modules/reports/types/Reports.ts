export type ReportPeriod = "today" | "7d" | "30d" | "90d" | "ytd" | "custom";

export type ReportTab =
  | "overview"
  | "sales"
  | "delivery"
  | "customers"
  | "jars"
  | "workforce"
  | "financial";

/* ---------- Revenue ---------- */
export interface RevenueTrendPoint {
  date: string;
  revenue: number;
  orders: number;
  cost: number;
  profit: number;
}

/* ---------- Products ---------- */
export interface ProductSalesRow {
  product: string;
  category: string;
  unitsSold: number;
  revenue: number;
  growth: number;
}

/* ---------- Customers ---------- */
export interface TopCustomer {
  id: string;
  name: string;
  type: "Residential" | "Commercial";
  orders: number;
  revenue: number;
  outstanding: number;
  lastOrder: string;
}

/* ---------- Delivery (matches Delivery Management module) ---------- */
export interface DeliveryStat {
  status: "Delivered" | "In Transit" | "Pending" | "Failed";
  count: number;
  color: string;
}

export interface DriverPerformance {
  id: string;
  name: string;
  deliveries: number;
  successRate: number;
  avgTime: number; // minutes
  rating: number;
}

/* ---------- Jar / Can (matches Jar Tracking module) ---------- */
export interface JarMovement {
  date: string;
  issued: number;
  returned: number;
  damaged: number;
}

export interface JarBalance {
  total: number;
  withCustomers: number;
  inPlant: number;
  damaged: number;
  lostMissing: number;
}

/* ---------- Workforce (matches Attendance + Salary) ---------- */
export interface WorkforceMetric {
  date: string;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
}

/* ---------- Financial ---------- */
export interface FinancialBreakdown {
  category: string;
  type: "income" | "expense";
  amount: number;
  pct: number;
  color?: string;
}

/* ---------- KPIs ---------- */
export interface KPIData {
  current: number;
  prev: number;
  spark: number[];
}

export interface ReportsKPIs {
  revenue: KPIData;
  orders: KPIData;
  customers: KPIData;
  profit: KPIData;
  deliveries: KPIData;
  jarBalance: KPIData;
}
