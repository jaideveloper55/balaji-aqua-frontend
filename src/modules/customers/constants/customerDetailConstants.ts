import type {
  CustomerStatus,
  CustomerType,
  DeliveryFrequency,
  PaymentMode,
} from "../types/Customer";

// ── Status Badge Mapping ──────────────────────────────────────

export const STATUS_MAP: Record<
  CustomerStatus,
  { label: string; color: string }
> = {
  ACTIVE: { label: "Active", color: "green" },
  INACTIVE: { label: "Inactive", color: "default" },
  PENDING: { label: "Pending", color: "orange" },
};
// ── Type Display Mapping ──────────────────────────────────────

export const TYPE_MAP: Record<CustomerType, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
};

// ── Delivery Frequency Mapping ────────────────────────────────

export const FREQ_MAP: Record<DeliveryFrequency, string> = {
  DAILY: "Daily",
  ALTERNATE: "Alternate Days",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  ON_DEMAND: "On Demand",
};

// ── Payment Mode Mapping ──────────────────────────────────────

export const PAY_MAP: Record<PaymentMode, string> = {
  CASH: "Cash",
  UPI: "UPI",
  CARD: "Card",
  CREDIT: "Credit",
  BANK_TRANSFER: "Bank Transfer",
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
