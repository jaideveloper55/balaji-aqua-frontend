// src/modules/salary/constants/Salary.constants.ts

export const PAYROLL_STATUS = [
  { value: "draft", label: "Draft" },
  { value: "processing", label: "Processing" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
  { value: "on_hold", label: "On Hold" },
] as const;

export const STATUS_META: Record<
  string,
  { label: string; bg: string; color: string; dot: string }
> = {
  draft: {
    label: "Draft",
    bg: "bg-slate-50 border-slate-200",
    color: "text-slate-700",
    dot: "bg-slate-400",
  },
  processing: {
    label: "Processing",
    bg: "bg-amber-50 border-amber-200",
    color: "text-amber-700",
    dot: "bg-amber-500",
  },
  approved: {
    label: "Approved",
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
    dot: "bg-blue-500",
  },
  paid: {
    label: "Paid",
    bg: "bg-emerald-50 border-emerald-200",
    color: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  on_hold: {
    label: "On Hold",
    bg: "bg-red-50 border-red-200",
    color: "text-red-700",
    dot: "bg-red-500",
  },
};

export const PAYMENT_MODES = [
  { value: "bank", label: "Bank Transfer", icon: "🏦" },
  { value: "upi", label: "UPI", icon: "📱" },
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "cheque", label: "Cheque", icon: "📝" },
] as const;

export const SALARY_TYPES = [
  { value: "monthly", label: "Monthly" },
  { value: "daily", label: "Daily" },
  { value: "per_delivery", label: "Per Delivery" },
] as const;

export const ALLOWANCE_TYPES = [
  { key: "hra", label: "HRA", description: "House Rent Allowance" },
  { key: "conveyance", label: "Conveyance", description: "Travel allowance" },
  { key: "food", label: "Food", description: "Food / meal allowance" },
  { key: "medical", label: "Medical", description: "Medical reimbursement" },
  { key: "incentive", label: "Incentive", description: "Performance bonus" },
] as const;

export const DEDUCTION_TYPES = [
  { key: "pf", label: "PF", description: "Provident Fund (12%)" },
  { key: "esi", label: "ESI", description: "Employee State Insurance" },
  { key: "tds", label: "TDS", description: "Tax Deducted at Source" },
  { key: "loan", label: "Loan EMI", description: "Loan repayment" },
  { key: "advance", label: "Advance", description: "Salary advance recovery" },
  {
    key: "jar_damage",
    label: "Jar Damage",
    description: "Jar / can damage deduction",
  },
  { key: "absent", label: "Absent Days", description: "Unpaid absence" },
] as const;
