import type { CustomerStatus, CustomerType } from "../types/Customer";

export const STATUS_MAP: Record<
  CustomerStatus,
  { label: string; color: string }
> = {
  active: { label: "Active", color: "green" },
  inactive: { label: "Inactive", color: "default" },
  pending: { label: "Pending", color: "orange" },
};

export const TYPE_MAP: Record<CustomerType, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
};

export const FREQ_MAP: Record<string, string> = {
  daily: "Daily",
  alternate: "Alternate Days",
  weekly: "Weekly",
  on_demand: "On Demand",
};

export const PAY_MAP: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  credit: "Credit",
};

// ── Formatters ────────────────────────────────────────────────

export const fmtCurrency = (v: number): string =>
  v > 0 ? `₹${v.toLocaleString("en-IN")}` : "Nil";

export const fmtShortDate = (d: string): string =>
  new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

export const fmtDetailDate = (d: string): string =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

export const fmtFullDate = (d: string): string =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
