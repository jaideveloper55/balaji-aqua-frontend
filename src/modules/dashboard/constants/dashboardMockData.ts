import type { DashboardKPIs } from "../components/Dashboardkpicards";
import type { SmartAlert } from "../components/Smartalertstrip";
import type { OutstandingBucket } from "../components/Outstandingdonutpanel";
import type { PaymentModeData } from "../components/Paymentmodepanel";
import type { DueCustomer } from "../components/Outstandingcustomerspanel";
import type { StockRow } from "../components/Stocklevelspanel";

export const MOCK_KPIS: DashboardKPIs = {
  totalCustomers: 12,
  newThisMonth: 3,
  totalOutstanding: 7852,
  customersWithDues: 6,
  todayCollection: 3780,
  todayInvoices: 7,
  totalBilled: 4240,
  totalProducts: 3,
  lowStockCount: 1,
  outOfStockCount: 0,
};

export const MOCK_ALERTS: SmartAlert[] = [
  { label: "₹7,852 outstanding", color: "red" },
  { label: "6 customers with dues", color: "amber" },
  { label: "1 low stock item", color: "amber" },
];

export const MOCK_OUTSTANDING_BUCKETS: OutstandingBucket[] = [
  { name: "High risk (>15d)", value: 5182, color: "#dc2626" },
  { name: "Medium (1-15d)", value: 2140, color: "#d97706" },
  { name: "Recent", value: 530, color: "#059669" },
];

export const MOCK_PAYMENT_MODE: PaymentModeData = {
  cash: 3760,
  upi: 20,
  bank: 0,
};

export const MOCK_DUE_CUSTOMERS: DueCustomer[] = [
  {
    id: "1",
    name: "Deva",
    customerCode: "CUS-008",
    type: "COMMERCIAL",
    outstandingBalance: 5062,
    overdueDays: 20,
  },
  {
    id: "2",
    name: "Testing",
    customerCode: "CUS-011",
    type: "COMMERCIAL",
    outstandingBalance: 2000,
    overdueDays: 0,
  },
  {
    id: "3",
    name: "Test",
    customerCode: "CUS-010",
    type: "RESIDENTIAL",
    outstandingBalance: 500,
    overdueDays: 0,
  },
  {
    id: "4",
    name: "Ganesh",
    customerCode: "CUS-005",
    type: "RESIDENTIAL",
    outstandingBalance: 140,
    overdueDays: 27,
  },
  {
    id: "5",
    name: "Tetsdwfew",
    customerCode: "CUS-012",
    type: "RESIDENTIAL",
    outstandingBalance: 30,
    overdueDays: 5,
  },
];

export const MOCK_STOCK_ROWS: StockRow[] = [
  {
    id: "1",
    name: "300 ml",
    sku: "WC-300-ML-STD",
    unit: "BOX",
    stock: 10969,
    minStock: 50,
  },
  {
    id: "2",
    name: "Caps",
    sku: "CP-STD",
    unit: "PCS",
    stock: 5000,
    minStock: 100,
  },
  {
    id: "3",
    name: "2L",
    sku: "WC-2L-STD",
    unit: "BOX",
    stock: 35,
    minStock: 50,
  },
];
