import { Dayjs } from "dayjs";

// ── Summary ──
export interface JarSummary {
  totalCans: number;
  withCustomers: number;
  inPlant: number;
  damaged: number;
  lost: number;
}

// ── Customer Jar Record ──
export type CustomerJarStatus = "good" | "warning" | "overdue";

export interface CustomerJarRecord {
  key: string;
  customerId: string;
  customerName: string;
  phone: string;
  route: string;
  totalIssued: number;
  returned: number;
  balance: number;
  lastDeliveryDate: string;
  lastReturnDate: string | null;
  status: CustomerJarStatus;
}

// ── Transaction ──
export type TransactionType = "issued" | "returned" | "damaged";

export interface JarTransaction {
  key: string;
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  type: TransactionType;
  quantity: number;
  driver: string;
  route: string;
  remarks: string;
}

// ── Entry Form ──
export type EntryType = "issue" | "return" | "damaged";

export interface JarEntryFormValues {
  customerId: string;
  quantity: string;
  type: EntryType;
  date: Dayjs | null;
  driver: string;
  route: string;
  notes: string;
}

// ── Driver ──
export interface DriverRecord {
  key: string;
  driverId: string;
  driverName: string;
  route: string;
  issuedToday: number;
  returnedToday: number;
  pending: number;
  phone: string;
}

// ── Alert ──
export type AlertSeverity = "critical" | "warning" | "info";

export interface JarAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  customerName?: string;
  value: number;
  threshold: number;
  date: string;
}

// ── Filters ──
export interface JarFilters {
  search: string;
  status: CustomerJarStatus | "all";
  dateRange: [Dayjs | null, Dayjs | null] | null;
  route: string;
  driver: string;
}