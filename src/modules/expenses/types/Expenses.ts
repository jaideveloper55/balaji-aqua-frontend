/**
 * Expenses.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Central type definitions for the entire Expenses module.
 *
 * WHY one file?
 * Every component imports from here instead of defining inline types.
 * When the backend changes a field name, you fix it in ONE place.
 *
 * SECTIONS:
 *   1. Enums / Union types   — fixed string values (status, mode, frequency)
 *   2. API Response types    — shape of data coming FROM the backend
 *   3. API Payload types     — shape of data going TO the backend (moved to Expenses.api.ts)
 *   4. UI / Component types  — props, stat cards, table rows
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ENUMS / UNION TYPES
// Fixed string values — must match backend enum exactly
// ═══════════════════════════════════════════════════════════════════════════════

/** Payment modes — matches backend PaymentMode enum */
export type PaymentMode = "CASH" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | "CARD";

/** Expense approval lifecycle */
export type ExpenseStatus = "PENDING" | "APPROVED" | "PAID" | "REJECTED";

/** How often a recurring expense triggers */
export type RecurringFrequency = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

/** Petty cash transaction direction */
export type CashDirection = "IN" | "OUT";

/** Budget rollover behaviour */
export type RolloverRule =
  | "RESET" // Reset budget each month (no rollover)
  | "ROLLOVER" // Carry unused budget to next month
  | "CARRY_FORWARD"; // Deduct overspend from next month

// ═══════════════════════════════════════════════════════════════════════════════
// 2. API RESPONSE TYPES
// Shape of data the backend sends back — use these in useQuery results
// ═══════════════════════════════════════════════════════════════════════════════

// ── Expense ──────────────────────────────────────────────────────────────────

/** Single expense row from GET /expenses or GET /expenses/:id */
export interface Expense {
  id: string;
  expenseNo: string; // e.g. "EXP-2026-042"
  date: string; // ISO date "YYYY-MM-DD"
  vendorName: string; // who was paid
  vendorId?: string | null; // linked vendor UUID (optional)
  description: string;
  categoryName: string; // e.g. "Utilities"
  categoryId?: string | null; // linked category UUID (optional)
  amount: number;
  gstAmount?: number;
  paymentMode: PaymentMode;
  status: ExpenseStatus;
  notes?: string | null;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
  // Relations (included when using findOne with include)
  vendor?: Vendor | null;
  category?: ExpenseCategory | null;
}

/** Response from GET /expenses (paginated) */
export interface ExpenseListResponse {
  data: Expense[];
  pagination: Pagination;
  summary: { totalAmount: number };
}

/** Response from GET /expenses/stats */
export interface ExpenseStats {
  totalThisMonth: number;
  invoiceCount: number;
  trendPercent: number; // positive = up vs last month
  pendingApproval: number;
  topCategory: { name: string; amount: number } | null;
  cashPercent: number; // e.g. 35 = 35% cash
  digitalPercent: number; // e.g. 65 = 65% digital
  byCategory: { name: string; amount: number }[];
}

// ── Expense Category ─────────────────────────────────────────────────────────

/** Single category from GET /expense-categories */
export interface ExpenseCategory {
  id: string;
  name: string; // e.g. "Utilities"
  description?: string | null; // e.g. "Electricity, water bill, internet"
  icon?: string | null; // emoji or icon key
  bg?: string | null; // background color hex e.g. "#fffbeb"
  color?: string | null; // text/icon color hex e.g. "#d97706"
  monthlyBudget?: number; // budget limit in ₹ (0 = no budget)
  alertThreshold?: number; // alert at this % used (e.g. 90)
  rolloverRule?: RolloverRule;
  notes?: string | null;
  isActive?: boolean;
  // Computed fields (returned by getCategoriesApi)
  spentThisMonth?: number; // how much spent this month
  budgetRemaining?: number; // monthlyBudget - spentThisMonth
  percentUsed?: number; // (spentThisMonth / monthlyBudget) * 100
  transactions?: number; // expense count this month
}

/** Simple category for dropdowns from GET /expense-categories/simple */
export interface CategorySimple {
  id: string;
  name: string;
}

/** Response from GET /expense-categories/overview */
export interface CategoryOverview {
  totalBudget: number;
  totalSpent: number;
  overBudgetCount: number;
  categories: ExpenseCategory[];
}

// ── Vendor ───────────────────────────────────────────────────────────────────

/** Single vendor from GET /vendors */
export interface Vendor {
  id: string;
  name: string; // e.g. "TN Electricity Board"
  category: string; // e.g. "Utilities" (plain string, not FK)
  phone: string;
  email?: string | null;
  gstin?: string | null; // e.g. "33AAACT2727Q1ZW"
  openingOutstanding?: number; // existing dues in ₹
  notes?: string | null;
  isActive?: boolean;
  // Computed fields (returned by findAll)
  totalPaidYTD?: number; // total paid this year
  transactions?: number; // expense count linked to this vendor
  lastTransaction?: string | null; // ISO date of most recent expense
}

/** Simple vendor for dropdowns from GET /vendors/simple */
export interface VendorSimple {
  id: string;
  name: string;
  category: string;
}

/** Response from GET /vendors/stats */
export interface VendorStats {
  totalVendors: number;
  paidYtd: number;
  totalOutstanding: number;
  needPayment: number; // vendors with openingOutstanding > 0
}

// ── Recurring Expense ────────────────────────────────────────────────────────

/** Single recurring schedule from GET /recurring-expenses */
export interface RecurringExpense {
  id: string;
  name: string; // e.g. "Electricity Bill"
  vendorName: string; // e.g. "TN Electricity Board"
  vendorId?: string | null;
  categoryName: string; // e.g. "Utilities"
  categoryId?: string | null;
  frequency: RecurringFrequency;
  amount: number;
  nextDue: string; // ISO date "YYYY-MM-DD"
  isPaused: boolean;
  reminderDays?: number; // remind N days before due (default: 5)
  reminderAckedFor?: string | null; // last acknowledged due date
  lastGeneratedAt?: string | null;
  companyId: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Response from GET /recurring-expenses/stats */
export interface RecurringStats {
  activeCount: number;
  pausedCount: number;
  monthlyCommitment: number; // sum of all MONTHLY schedules
  dueThisWeek: number;
  urgent: number; // due within 5 days
}

/** Single reminder from GET /recurring-expenses/reminders */
export interface RecurringReminder {
  id: string;
  name: string;
  vendorName: string;
  categoryName: string;
  amount: number;
  nextDue: string; // ISO date
  daysUntil: number; // negative = overdue
  severity: "gentle" | "urgent" | "critical";
  message: string; // e.g. "Electricity Bill is due today"
}

/** Response from GET /recurring-expenses/reminders */
export interface RecurringRemindersResponse {
  count: number;
  reminders: RecurringReminder[];
}

// ── Petty Cash ───────────────────────────────────────────────────────────────

/** Response from GET /petty-cash/balance */
export interface PettyCashBalance {
  currentBalance: number;
  openingBalance: number;
  reconciledTill: string | null; // ISO datetime or null if never reconciled
  today: {
    cashIn: number;
    cashInCount: number;
    cashOut: number;
    cashOutCount: number;
  };
}

/** Single transaction from GET /petty-cash/transactions */
export interface PettyCashTransaction {
  id: string;
  txnNo: string; // e.g. "C-08"
  direction: CashDirection; // "IN" | "OUT"
  amount: number;
  description: string; // what the cash was for
  handledById?: string | null; // employee UUID (optional)
  handledByName?: string | null; // employee name (free text)
  balanceAfter: number; // running balance after this txn
  txnDate: string; // ISO datetime
  isReconciled: boolean;
  companyId: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SHARED UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Standard pagination object returned by paginated endpoints */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Standard API error shape from NestJS */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. UI / COMPONENT TYPES
// Props shapes and display types used inside components
// ═══════════════════════════════════════════════════════════════════════════════

/** Stat card used in ExpenseStatCards */
export interface StatCard {
  label: string;
  value: string | number;
  subtitle: string;
  delta?: string;
  deltaColor?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  ring: string;
  hover: string;
  showTrend?: boolean;
  isText?: boolean; // true = smaller font (text value vs number)
}

/** Filter state for the All Expenses panel */
export interface ExpenseFilterState {
  search: string;
  categoryId?: string;
  status?: ExpenseStatus;
  paymentMode?: PaymentMode;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
  sortBy?: "date" | "amount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

/** Tab definition used in CustomTabs */
export interface TabDef {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

/** Active tab keys for the Expenses page */
export type ExpenseTab =
  | "overview"
  | "all"
  | "categories"
  | "vendors"
  | "recurring"
  | "petty";
