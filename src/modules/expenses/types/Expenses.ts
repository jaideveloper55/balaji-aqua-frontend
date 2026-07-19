import { ReactNode } from "react";

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  color: string;
  bg: string;
  spent: number;
  budget: number;
  transactions: number;
  trend: number;
}

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
  category: string;
  phone: string;
  email?: string;
  gstin?: string;
  totalPaidYTD: number;
  outstanding: number;
  transactions: number;
  lastTransaction: string;
  isActive: boolean;
}

export interface RecurringExpense {
  id: string;
  name: string;
  vendor: string;
  category: string;
  frequency: "MONTHLY" | "QUARTERLY" | "YEARLY" | "WEEKLY";
  amount: number;
  nextDue: string;
  isPaused: boolean;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  monthlyBudget: number;
  spent: number;
  remaining: number;
  percentUsed: number;
}
