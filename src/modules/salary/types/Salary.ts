// src/modules/salary/types/Salary.ts

export type PayrollStatus =
  | "draft"
  | "processing"
  | "approved"
  | "paid"
  | "on_hold";

export type PaymentMode = "bank" | "upi" | "cash" | "cheque";

export interface SalaryStructure {
  employeeId: string;
  baseSalary: number;
  allowances: {
    hra?: number;
    conveyance?: number;
    food?: number;
    medical?: number;
    incentive?: number;
  };
  defaultDeductions: {
    pf?: number;
    esi?: number;
    tds?: number;
  };
  salaryType: "monthly" | "daily" | "per_delivery";
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  avatar?: string;

  // Period
  month: string; // YYYY-MM
  workingDays: number;
  presentDays: number;
  payableDays: number;

  // Earnings
  baseSalary: number;
  hra: number;
  conveyance: number;
  food: number;
  otHours: number;
  otAmount: number;
  incentive: number;
  grossSalary: number;

  // Deductions
  pf: number;
  esi: number;
  tds: number;
  loanEMI: number;
  advance: number;
  jarDamage: number;
  absentDeduction: number;
  totalDeductions: number;

  // Final
  netSalary: number;

  // Payment
  status: PayrollStatus;
  paymentMode?: PaymentMode;
  paidOn?: string;
  reference?: string;
}

export interface LoanRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  loanAmount: number;
  amountPaid: number;
  emi: number;
  startDate: string;
  endDate: string;
  monthsRemaining: number;
  status: "active" | "closed" | "defaulted";
  reason?: string;
}

export interface PayrollRun {
  id: string;
  month: string;
  totalEmployees: number;
  grossPayroll: number;
  totalDeductions: number;
  netPayroll: number;
  status: PayrollStatus;
  processedOn?: string;
  paidOn?: string;
}
