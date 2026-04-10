import type { Dayjs } from "dayjs";
export interface Delivery {
  id: string;
  customer: string;
  phone: string;
  address: string;
  route: string;
  driver: string;
  items: string;
  qty: number;
  status: DeliveryStatus;
  scheduledTime: string;
  deliveredTime: string | null;
  priority: DeliveryPriority;
}

export type DeliveryStatus =
  | "pending"
  | "out"
  | "delivered"
  | "failed"
  | "rescheduled";

export type DeliveryPriority = "normal" | "high" | "urgent";

export interface Route {
  id: string;
  name: string;
  area: string;
  driver: string;
  customers: number;
  status: "active" | "inactive";
  totalDeliveries: number;
  completedDeliveries: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  assigned: number;
  completed: number;
  pending: number;
  failed: number;
  status: "active" | "offline" | "on-break";
  currentRoute: string;
  avatar: string;
}

export interface PendingDelivery {
  id: string;
  customer: string;
  address: string;
  delayMinutes: number;
  reason: string;
  severity: "overdue" | "delayed" | "at-risk";
  scheduledTime: string;
  driver: string;
}

export interface DeliveryHistory {
  id: string;
  date: string;
  customer: string;
  driver: string;
  items: string;
  qty: number;
  status: "delivered" | "failed" | "rescheduled";
  remarks: string;
}

export interface DeliveryFormValues {
  customer: string;
  product: string;
  quantity: string;
  deliveryDate: [Dayjs | null, Dayjs | null] | null;
  route: string;
  driver: string;
  address: string;
  phone: string;
  notes: string;
}
export interface DeliveryStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  inProgress: number;
  activeDrivers: number;
  totalRoutes: number;
}

export type DeliveryTabKey =
  | "deliveries"
  | "routes"
  | "drivers"
  | "pending"
  | "history";
