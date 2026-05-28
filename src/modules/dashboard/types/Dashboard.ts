import { ReactNode } from "react";

export interface DashboardKPI {
  key: string;
  label: string;
  value: string | number;
  change: { value: number; isUp: boolean };
  gradient: string;
  iconColor: string;
  icon: ReactNode;
  sparkColor: string;
  spark: number[];
  tooltip?: string;
  sublabel?: string;
}

export interface AlertItem {
  id: string;
  type: "danger" | "warning" | "info" | "success";
  icon: ReactNode;
  label: string;
  count?: number;
  action?: string;
}

export interface DriverStatus {
  id: string;
  name: string;
  initials: string;
  route: string;
  done: number;
  total: number;
  status: "active" | "break" | "completed";
  avatarBg: string;
}

export interface TodayEvent {
  id: string;
  customer: string;
  type: "Wedding" | "Corporate" | "Engagement" | "Birthday" | "House Warming";
  time: string;
  venue: string;
}

export interface CustomerPulse {
  inactive: number;
  newThisWeek: number;
  growthPct: number;
  retentionPct: number;
}

export interface TodayPL {
  revenue: number;
  expense: number;
  profit: number;
  prevProfit: number;
}

export interface ActivityItem {
  id: number;
  title: string;
  customer: string;
  time: string;
  color: string;
  bg: string;
  icon: ReactNode;
  type: "delivery" | "customer" | "stock" | "payment" | "event";
}

export interface DeliveryStatusData {
  name: string;
  value: number;
  color: string;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  city: string;
  emoji: string;
  delayRisk: "none" | "low" | "high";
}
