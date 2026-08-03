import authAxios from "../../../lib/axios";

export type PaymentMode = "CASH" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | "CARD";

/** Expense approval status */
export type ExpenseStatus = "PENDING" | "APPROVED" | "PAID" | "REJECTED";

/** What we send when creating a new expense (matches CreateExpenseDto on backend) */
export interface CreateExpensePayload {
  vendorName: string; // Required: who we paid
  vendorId?: string; // Optional: link to a vendor record
  description: string; // Required: what it was for
  categoryId?: string; // Optional: link to a category record
  categoryName: string; // Required: category label (e.g. "Utilities")
  amount: number; // Required: expense amount in ₹
  gstAmount?: number; // Optional: GST portion (default 0)
  paymentMode: PaymentMode; // Required: how it was paid
  status?: ExpenseStatus; // Optional: default is PENDING
  date: string; // Required: "YYYY-MM-DD" format
  notes?: string; // Optional: any extra info
}

/** What we send when updating an expense — all fields optional (PATCH = partial) */
export interface UpdateExpensePayload {
  vendorName?: string;
  vendorId?: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  amount?: number;
  gstAmount?: number;
  paymentMode?: PaymentMode;
  status?: ExpenseStatus;
  date?: string;
  notes?: string;
}

/** Query parameters for filtering the expense list (maps to QueryExpenseDto) */
export interface ExpenseFilters {
  search?: string; // Search vendor name, description, expense number
  categoryId?: string; // Filter by category UUID
  category?: string; // Filter by category name string
  status?: ExpenseStatus;
  paymentMode?: PaymentMode;
  dateFrom?: string; // "YYYY-MM-DD" — start of date range
  dateTo?: string; // "YYYY-MM-DD" — end of date range
  page?: number; // Default: 1
  limit?: number; // Default: 10
  sortBy?: "date" | "amount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// ── Category Types ─────────────────────────────────────────────────────────────

/** What we send when creating a category (matches CreateCategoryDto) */
export interface CreateCategoryPayload {
  name: string; // e.g. "Utilities"
  description?: string; // e.g. "Electricity, water bill, internet"
  icon?: string; // emoji or icon key
  color?: string; // hex color for UI display
  monthlyBudget?: number; // Budget limit in ₹ (e.g. 25000)
  alertThreshold?: number; // Alert % — e.g. 90 means "alert at 90% used"
  rolloverRule?: "RESET" | "ROLLOVER" | "CARRY_FORWARD";
  notes?: string;
}

/** Partial update for category */
export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  monthlyBudget?: number;
  alertThreshold?: number;
  rolloverRule?: "RESET" | "ROLLOVER" | "CARRY_FORWARD";
  notes?: string;
}

/** Filter for category list */
export interface CategoryFilters {
  search?: string;
  activeOnly?: boolean;
}

// ── Vendor Types ───────────────────────────────────────────────────────────────

/** What we send when creating a vendor */
export interface CreateVendorPayload {
  name: string; // Required: e.g. "TN Electricity Board"
  category: string; // Required: e.g. "Utilities"
  phone: string; // Required: contact number
  email?: string; // Optional
  gstin?: string; // Optional: GST number e.g. "33AAACT2727Q1ZW"
  openingOutstanding?: number; // Optional: existing dues in ₹
  notes?: string;
}

/** Partial update for vendor */
export interface UpdateVendorPayload {
  name?: string;
  category?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  openingOutstanding?: number;
  notes?: string;
  isActive?: boolean;
}

/** Filter for vendor list */
export interface VendorFilters {
  search?: string;
  category?: string;
  activeOnly?: "true" | "false";
}

// ── Recurring Types ────────────────────────────────────────────────────────────

/** Frequency options for recurring expenses */
export type RecurringFrequency = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

/** What we send when creating a recurring schedule */
export interface CreateRecurringPayload {
  name: string; // e.g. "Electricity Bill"
  vendorName: string; // e.g. "TN Electricity Board"
  vendorId?: string;
  categoryId?: string;
  categoryName: string; // e.g. "Utilities"
  frequency: RecurringFrequency;
  amount: number; // e.g. 18500
  nextDue: string; // "YYYY-MM-DD"
  reminderDays?: number; // How many days before to start reminding (default: 5)
}

/** Partial update for recurring schedule */
export interface UpdateRecurringPayload {
  name?: string;
  vendorName?: string;
  vendorId?: string;
  categoryId?: string;
  categoryName?: string;
  frequency?: RecurringFrequency;
  amount?: number;
  nextDue?: string;
  reminderDays?: number;
}

/** Filter for recurring list */
export interface RecurringFilters {
  search?: string;
  pausedOnly?: "true" | "false";
}

// ── Petty Cash Types ───────────────────────────────────────────────────────────

/** What we send when adding cash to the box */
export interface AddCashPayload {
  amount: number; // Required: how much cash to add
  description: string; // Required: e.g. "Top-up from main account"
  handledById?: string; // Optional: employee UUID
  handledByName?: string; // Optional: employee name (free text fallback)
}

/** What we send when spending cash from the box */
export interface SpendCashPayload {
  amount: number; // Required: how much to spend
  description: string; // Required: e.g. "Tea & snacks for loaders"
  handledById?: string;
  handledByName?: string;
}

/** Filter for petty cash transaction log */
export interface PettyCashFilters {
  search?: string;
  direction?: "IN" | "OUT"; // Filter to only cash-in or cash-out
  date?: string; // "YYYY-MM-DD" — filter to a specific day
}

// ─────────────────────────────────────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════════════
// EXPENSES
// Maps to: ExpensesController → /expenses
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /expenses/stats
 * Powers the 4 dashboard cards:
 *   ₹84,500 total · 5 pending approval · "Utilities" top category · 35% cash
 * Also powers: byCategory[] for spending bar chart
 */
export const getExpenseStatsApi = () => authAxios.get("/expenses/stats");

/**
 * GET /expenses?page=1&limit=10&search=&status=PAID...
 * Powers the "All Expenses" table with pagination + filters
 * Response shape: { data[], pagination{ page, limit, total, totalPages }, summary{ totalAmount } }
 */
export const getExpensesApi = (filters: ExpenseFilters = {}) =>
  authAxios.get("/expenses", { params: filters });

/**
 * GET /expenses/:id
 * Load a single expense for the detail drawer/modal
 */
export const getExpenseApi = (id: string) => authAxios.get(`/expenses/${id}`);

/**
 * POST /expenses
 * "Add Expense" modal submit button
 * Roles: ADMIN, SUPER_ADMIN only
 */
export const createExpenseApi = (data: CreateExpensePayload) =>
  authAxios.post("/expenses", data);

/**
 * PATCH /expenses/:id
 * Edit icon on the expense table row
 * All fields optional — only send what changed
 */
export const updateExpenseApi = (id: string, data: UpdateExpensePayload) =>
  authAxios.patch(`/expenses/${id}`, data);

/**
 * DELETE /expenses/:id
 * Delete from the ⋮ context menu on the table row
 * Returns: { message: "Expense deleted successfully" }
 */
export const deleteExpenseApi = (id: string) =>
  authAxios.delete(`/expenses/${id}`);

// ══════════════════════════════════════════════════════════════════════════════
// EXPENSE CATEGORIES
// Maps to: CategoriesController → /expense-categories
// ══════════════════════════════════════════════════════════════════════════════

export const getCategoryOverviewApi = () =>
  authAxios.get("/expense-categories/overview");

export const getCategoriesSimpleApi = () =>
  authAxios.get("/expense-categories/simple");

export const getCategoriesApi = (filters: CategoryFilters = {}) =>
  authAxios.get("/expense-categories", { params: filters });

export const getCategoryApi = (id: string) =>
  authAxios.get(`/expense-categories/${id}`);

export const createCategoryApi = (data: CreateCategoryPayload) =>
  authAxios.post("/expense-categories", data);

/**
 * PATCH /expense-categories/:id
 * Two uses:
 *   1. "Save Budget" in Configure Budget modal
 *   2. Edit category name/description
 */
export const updateCategoryApi = (id: string, data: UpdateCategoryPayload) =>
  authAxios.patch(`/expense-categories/${id}`, data);

/**
 * DELETE /expense-categories/:id
 * Will throw 400 if any expense links to this category
 * Show the backend error message to user
 */
export const deleteCategoryApi = (id: string) =>
  authAxios.delete(`/expense-categories/${id}`);

// ══════════════════════════════════════════════════════════════════════════════
// VENDORS
// Maps to: VendorsController → /vendors
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /vendors/stats
 * Powers the 4 vendor stat cards:
 *   Total Vendors(7) · Paid YTD(₹3,46,700) · Outstanding(₹7,300) · Need Payment(2)
 */
export const getVendorStatsApi = () => authAxios.get("/vendors/stats");

/**
 * GET /vendors/simple
 * Lightweight list for dropdowns — only id, name, category
 * Used in: "Vendor / Payee" linked dropdown in Add Expense modal
 */
export const getVendorsSimpleApi = () => authAxios.get("/vendors/simple");

/**
 * GET /vendors?search=&category=&activeOnly=true
 * Full vendor grid — includes: totalPaidYTD, outstanding, transactions, lastTransaction
 * The ⚠️ warning badge is shown if vendor.openingOutstanding > 0 (frontend logic)
 */
export const getVendorsApi = (filters: VendorFilters = {}) =>
  authAxios.get("/vendors", { params: filters });

/**
 * GET /vendors/:id
 * Single vendor detail
 */
export const getVendorApi = (id: string) => authAxios.get(`/vendors/${id}`);

/**
 * POST /vendors
 * "Add Vendor" modal submit
 * Fields: name, category (select), phone, email, gstin, openingOutstanding, notes
 */
export const createVendorApi = (data: CreateVendorPayload) =>
  authAxios.post("/vendors", data);

/**
 * PATCH /vendors/:id
 * Edit vendor details
 */
export const updateVendorApi = (id: string, data: UpdateVendorPayload) =>
  authAxios.patch(`/vendors/${id}`, data);

/**
 * DELETE /vendors/:id
 * Will throw 400 if any expense links to this vendor
 * Show backend error message to user
 */
export const deleteVendorApi = (id: string) =>
  authAxios.delete(`/vendors/${id}`);

// ══════════════════════════════════════════════════════════════════════════════
// RECURRING EXPENSES
// Maps to: RecurringController → /recurring-expenses
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /recurring-expenses/stats
 * Powers the 4 recurring stat cards:
 *   Active(5) · Monthly Commitment(₹32,000) · Due This Week(1) · Urgent(0)
 */
export const getRecurringStatsApi = () =>
  authAxios.get("/recurring-expenses/stats");

/**
 * GET /recurring-expenses/reminders
 * Returns active reminders sorted by urgency:
 *   critical → overdue (daysUntil < 0)
 *   urgent   → due in 0–2 days
 *   gentle   → due in 3+ days (within reminderDays window)
 * "Overdue" badge on schedule row = daysUntil < 0 from this response
 */
export const getRecurringRemindersApi = () =>
  authAxios.get("/recurring-expenses/reminders");

/**
 * GET /recurring-expenses?search=&pausedOnly=true
 * Full schedule list — name, vendor, frequency, category, amount, nextDue, isPaused
 */
export const getRecurringApi = (filters: RecurringFilters = {}) =>
  authAxios.get("/recurring-expenses", { params: filters });

/**
 * GET /recurring-expenses/:id
 * Single schedule detail
 */
export const getRecurringOneApi = (id: string) =>
  authAxios.get(`/recurring-expenses/${id}`);

/**
 * POST /recurring-expenses
 * "Add Recurring" modal submit
 * Fields: name, vendorName, categoryId, frequency, amount, nextDue
 */
export const createRecurringApi = (data: CreateRecurringPayload) =>
  authAxios.post("/recurring-expenses", data);

/**
 * PATCH /recurring-expenses/:id
 * Edit a recurring schedule
 */
export const updateRecurringApi = (id: string, data: UpdateRecurringPayload) =>
  authAxios.patch(`/recurring-expenses/${id}`, data);

/**
 * PATCH /recurring-expenses/:id/toggle-pause
 * Pause / Resume a schedule — no body needed
 * When paused, CRON job skips it — no auto-expense generated
 */
export const toggleRecurringPauseApi = (id: string) =>
  authAxios.patch(`/recurring-expenses/${id}/toggle-pause`);

/**
 * PATCH /recurring-expenses/:id/acknowledge
 * Dismiss the overdue/reminder badge for THIS billing cycle only
 * Reminder reappears automatically in the next cycle
 */
export const acknowledgeReminderApi = (id: string) =>
  authAxios.patch(`/recurring-expenses/${id}/acknowledge`);

/**
 * DELETE /recurring-expenses/:id
 * Delete the schedule — already-generated expenses are NOT deleted
 */
export const deleteRecurringApi = (id: string) =>
  authAxios.delete(`/recurring-expenses/${id}`);

// ══════════════════════════════════════════════════════════════════════════════
// PETTY CASH
// Maps to: PettyCashController → /petty-cash
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /petty-cash/balance
 * Powers the main balance card:
 *   Current Balance: ₹4,780
 *   Opening: ₹3,000 · +₹5,000 in · -₹3,220 out
 *   Today's Cash In (₹8,000 · 2 entries) + Cash Out (₹3,220 · 6 expenses)
 *   Reconciled till: Yesterday
 */
export const getPettyCashBalanceApi = () =>
  authAxios.get("/petty-cash/balance");

/**
 * GET /petty-cash/transactions?direction=OUT&date=2026-07-27
 * "Today's Cash Movements" log
 * Response: [{ txnNo, direction, amount, description, handledByName, txnDate, balanceAfter }]
 * direction IN  → green ↓ arrow (cash coming in)
 * direction OUT → red ↑ arrow (cash going out)
 */
export const getPettyCashTransactionsApi = (filters: PettyCashFilters = {}) =>
  authAxios.get("/petty-cash/transactions", { params: filters });

/**
 * POST /petty-cash/add
 * "Add Cash to Box" modal — "Add Cash" button
 * Use for: bank withdrawal, top-up, refunds coming back into box
 * Quick amounts: ₹1,000 · ₹2,000 · ₹5,000 · ₹10,000 (these are frontend shortcuts)
 */
export const addPettyCashApi = (data: AddCashPayload) =>
  authAxios.post("/petty-cash/add", data);

/**
 * POST /petty-cash/spend
 * "Spend Cash" red button — records cash going out
 * Returns 400 BadRequest if balance is insufficient
 * Show the backend error: "Insufficient cash. Balance is ₹X, tried to spend ₹Y"
 */
export const spendPettyCashApi = (data: SpendCashPayload) =>
  authAxios.post("/petty-cash/spend", data);

/**
 * PATCH /petty-cash/reconcile
 * "Reconcile" button (top right of balance card)
 * Marks all unreconciled transactions up to now as reconciled
 * Returns: { message: "Petty cash reconciled", reconciledTill: Date }
 */
export const reconcilePettyCashApi = () =>
  authAxios.patch("/petty-cash/reconcile");
