// src/modules/employees/constants/Employees.constants.ts

export const DEPARTMENTS = [
  { value: "plant", label: "Plant Operations", color: "cyan" },
  { value: "delivery", label: "Delivery", color: "blue" },
  { value: "sales", label: "Sales & Marketing", color: "purple" },
  { value: "admin", label: "Administration", color: "slate" },
  { value: "maintenance", label: "Maintenance", color: "amber" },
] as const;

export const ROLES = [
  { value: "driver", label: "Driver", department: "delivery" },
  { value: "loader", label: "Loader / Helper", department: "delivery" },
  { value: "operator", label: "Plant Operator", department: "plant" },
  { value: "quality", label: "Quality Check", department: "plant" },
  { value: "field_sales", label: "Field Sales", department: "sales" },
  { value: "telecaller", label: "Telecaller", department: "sales" },
  { value: "manager", label: "Manager", department: "admin" },
  { value: "accountant", label: "Accountant", department: "admin" },
  { value: "receptionist", label: "Receptionist", department: "admin" },
  { value: "technician", label: "Technician", department: "maintenance" },
  { value: "electrician", label: "Electrician", department: "maintenance" },
] as const;

export const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "daily_wage", label: "Daily Wage" },
] as const;

export const EMPLOYEE_STATUS = [
  { value: "active", label: "Active" },
  { value: "on_leave", label: "On Leave" },
  { value: "inactive", label: "Inactive" },
  { value: "terminated", label: "Terminated" },
] as const;

export const SHIFT_TYPES = [
  { value: "morning", label: "Morning (6AM - 2PM)" },
  { value: "evening", label: "Evening (2PM - 10PM)" },
  { value: "night", label: "Night (10PM - 6AM)" },
  { value: "general", label: "General (9AM - 6PM)" },
] as const;

export const SALARY_TYPES = [
  { value: "monthly", label: "Monthly" },
  { value: "daily", label: "Daily" },
  { value: "per_delivery", label: "Per Delivery" },
] as const;

export const STATUS_META: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  active: {
    label: "Active",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  on_leave: {
    label: "On Leave",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  inactive: {
    label: "Inactive",
    color: "text-slate-600",
    bg: "bg-slate-50 border-slate-200",
    dot: "bg-slate-400",
  },
  terminated: {
    label: "Terminated",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
};

export const DEPT_META: Record<
  string,
  { label: string; bg: string; color: string; icon: string }
> = {
  plant: {
    label: "Plant",
    bg: "bg-cyan-50 border-cyan-200",
    color: "text-cyan-700",
    icon: "🏭",
  },
  delivery: {
    label: "Delivery",
    bg: "bg-blue-50 border-blue-200",
    color: "text-blue-700",
    icon: "🚚",
  },
  sales: {
    label: "Sales",
    bg: "bg-purple-50 border-purple-200",
    color: "text-purple-700",
    icon: "💼",
  },
  admin: {
    label: "Admin",
    bg: "bg-slate-50 border-slate-200",
    color: "text-slate-700",
    icon: "🗂️",
  },
  maintenance: {
    label: "Maintenance",
    bg: "bg-amber-50 border-amber-200",
    color: "text-amber-700",
    icon: "🔧",
  },
};
