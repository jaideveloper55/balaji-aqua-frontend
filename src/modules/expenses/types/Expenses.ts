// src/modules/expenses/types/Expenses.ts

export type ExpenseCategory =
  | "utilities"
  | "plant_ops"
  | "packaging"
  | "vehicle"
  | "rent"
  | "compliance"
  | "marketing"
  | "office"
  | "repairs"
  | "loan";

export type PaymentMode = "cash" | "upi" | "bank" | "cheque" | "card";
export type ExpenseStatus =
  | "draft"
  | "pending"
  | "approved"
  | "paid"
  | "rejected";
export type RecurringFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export interface Expense {
  id: string;
  expenseNumber: string;
  date: string;
  category: ExpenseCategory;
  subcategory?: string;
  vendorId?: string;
  vendorName: string;
  description: string;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  paymentMode: PaymentMode;
  reference?: string;
  paidBy?: string;
  receiptUrl?: string;
  status: ExpenseStatus;
  notes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: ExpenseCategory;
  phone?: string;
  email?: string;
  gstin?: string;
  bankAccount?: string;
  ifsc?: string;
  upiId?: string;
  totalPaidYTD: number;
  lastPaymentDate?: string;
  outstanding: number;
  isActive: boolean;
}

export interface RecurringExpense {
  id: string;
  title: string;
  category: ExpenseCategory;
  vendorName: string;
  amount: number;
  frequency: RecurringFrequency;
  nextDueDate: string;
  startDate: string;
  endDate?: string;
  reminderDays: number;
  isActive: boolean;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  monthlyBudget: number;
  spent: number;
  remaining: number;
  percentUsed: number;
}
