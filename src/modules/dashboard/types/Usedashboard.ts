import { useMemo } from "react";
import {
  HiOutlineCurrencyRupee,
  HiOutlineTruck,
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineExclamationCircle,
  HiOutlineShoppingCart,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import {
  DashboardKPI,
  AlertItem,
  DriverStatus,
  TodayEvent,
  CustomerPulse,
  TodayPL,
  ActivityItem,
  DeliveryStatusData,
  WeatherInfo,
} from "../types/Dashboard";
import React from "react";

export const useDashboard = () => {
  /* ────── 6 KPI Cards ────── */
  const kpis: DashboardKPI[] = useMemo(
    () => [
      {
        key: "revenue",
        label: "Today's Revenue",
        value: "₹21,400",
        change: { value: 12.5, isUp: true },
        gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100",
        iconColor: "text-emerald-600",
        icon: React.createElement(HiOutlineCurrencyRupee, { size: 22 }),
        sparkColor: "#22c55e",
        spark: [12400, 15200, 11800, 18600, 21400, 19800, 21400],
        tooltip: "Total revenue across all orders today",
        sublabel: "+₹2,380 vs yesterday",
      },
      {
        key: "deliveries",
        label: "Deliveries",
        value: 72,
        change: { value: 8.3, isUp: true },
        gradient: "bg-gradient-to-br from-blue-50 to-blue-100",
        iconColor: "text-blue-600",
        icon: React.createElement(HiOutlineTruck, { size: 22 }),
        sparkColor: "#3b82f6",
        spark: [42, 51, 38, 64, 72, 68, 72],
        tooltip: "Deliveries scheduled or completed today",
        sublabel: "68 done · 4 pending",
      },
      {
        key: "customers",
        label: "Active Customers",
        value: 348,
        change: { value: 4.2, isUp: true },
        gradient: "bg-gradient-to-br from-violet-50 to-violet-100",
        iconColor: "text-violet-600",
        icon: React.createElement(HiOutlineUsers, { size: 22 }),
        sparkColor: "#8b5cf6",
        spark: [320, 325, 330, 334, 340, 345, 348],
        tooltip: "Customers with active subscriptions",
        sublabel: "14 new this week",
      },
      {
        key: "cans",
        label: "Cans Out",
        value: "1,240",
        change: { value: 2.1, isUp: false },
        gradient: "bg-gradient-to-br from-amber-50 to-amber-100",
        iconColor: "text-amber-600",
        icon: React.createElement(HiOutlineCube, { size: 22 }),
        sparkColor: "#f59e0b",
        spark: [1280, 1270, 1260, 1255, 1248, 1245, 1240],
        tooltip: "Total cans across customers and plant",
        sublabel: "892 with customers",
      },
      {
        key: "dues",
        label: "Pending Dues",
        value: "₹8,000",
        change: { value: 12, isUp: true },
        gradient: "bg-gradient-to-br from-red-50 to-red-100",
        iconColor: "text-red-600",
        icon: React.createElement(HiOutlineExclamationCircle, { size: 22 }),
        sparkColor: "#ef4444",
        spark: [5500, 6000, 6500, 7000, 7200, 7800, 8000],
        tooltip: "Outstanding payments from customers",
        sublabel: "2 customers overdue",
      },
      {
        key: "orders",
        label: "Orders Today",
        value: 102,
        change: { value: 15.4, isUp: true },
        gradient: "bg-gradient-to-br from-pink-50 to-pink-100",
        iconColor: "text-pink-600",
        icon: React.createElement(HiOutlineShoppingCart, { size: 22 }),
        sparkColor: "#ec4899",
        spark: [80, 85, 78, 92, 96, 88, 102],
        tooltip: "All orders placed today",
        sublabel: "across all channels",
      },
    ],
    []
  );

  /* ────── Alert strip ────── */
  const alerts: AlertItem[] = useMemo(
    () => [
      {
        id: "1",
        type: "danger",
        icon: React.createElement(HiOutlineExclamationCircle, { size: 12 }),
        label: "₹8,000 outstanding",
        count: 2,
        action: "/admin/billing-pos",
      },
      {
        id: "2",
        type: "warning",
        icon: React.createElement(HiOutlineCube, { size: 12 }),
        label: "4 low stock items",
        count: 4,
        action: "/admin/inventory",
      },
      {
        id: "3",
        type: "danger",
        icon: React.createElement(HiOutlineTruck, { size: 12 }),
        label: "2 overdue deliveries",
        count: 2,
        action: "/admin/delivery",
      },
      {
        id: "4",
        type: "info",
        icon: React.createElement(HiOutlineCheckCircle, { size: 12 }),
        label: "1 event tomorrow",
        count: 1,
        action: "/admin/event-orders",
      },
    ],
    []
  );

  /* ────── Today's P&L ────── */
  const todayPL: TodayPL = useMemo(
    () => ({
      revenue: 21400,
      expense: 5840,
      profit: 15560,
      prevProfit: 13180,
    }),
    []
  );

  /* ────── Drivers on duty ────── */
  const drivers: DriverStatus[] = useMemo(
    () => [
      {
        id: "1",
        name: "Suresh M.",
        initials: "SM",
        route: "Route A · North",
        done: 3,
        total: 5,
        status: "active",
        avatarBg: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
      },
      {
        id: "2",
        name: "Karthik R.",
        initials: "KR",
        route: "Route B · South",
        done: 2,
        total: 4,
        status: "active",
        avatarBg: "linear-gradient(135deg,#f59e0b,#ef4444)",
      },
      {
        id: "3",
        name: "Vijay P.",
        initials: "VP",
        route: "Route C · East",
        done: 4,
        total: 4,
        status: "completed",
        avatarBg: "linear-gradient(135deg,#22c55e,#06b6d4)",
      },
      {
        id: "4",
        name: "Arun S.",
        initials: "AS",
        route: "Route D · West",
        done: 1,
        total: 3,
        status: "active",
        avatarBg: "linear-gradient(135deg,#8b5cf6,#ec4899)",
      },
    ],
    []
  );

  /* ────── Today's events ────── */
  const events: TodayEvent[] = useMemo(
    () => [
      {
        id: "1",
        customer: "Karthik & Divya",
        type: "Engagement",
        time: "10:00 AM",
        venue: "Sundar Mahal",
      },
      {
        id: "2",
        customer: "TechCorp Summit",
        type: "Corporate",
        time: "07:00 PM",
        venue: "Hotel Grand Palace",
      },
    ],
    []
  );

  /* ────── Customer pulse ────── */
  const customerPulse: CustomerPulse = useMemo(
    () => ({
      inactive: 5,
      newThisWeek: 14,
      growthPct: 4.2,
      retentionPct: 93,
    }),
    []
  );

  /* ────── Recent activity ────── */
  const activity: ActivityItem[] = useMemo(
    () => [
      {
        id: 1,
        title: "Delivery #DEL-0342 completed",
        customer: "Priya Enterprises",
        time: "2 min ago",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        icon: React.createElement(HiOutlineCheckCircle, { size: 15 }),
        type: "delivery",
      },
      {
        id: 2,
        title: "New customer added",
        customer: "Rajesh Kumar",
        time: "15 min ago",
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: React.createElement(HiOutlineUsers, { size: 15 }),
        type: "customer",
      },
      {
        id: 3,
        title: "Low stock: 20L Water Can",
        customer: "Only 12 units left",
        time: "1 hour ago",
        color: "text-amber-600",
        bg: "bg-amber-50",
        icon: React.createElement(HiOutlineExclamationCircle, { size: 15 }),
        type: "stock",
      },
      {
        id: 4,
        title: "Delivery #DEL-0341 dispatched",
        customer: "Sunrise Apartments",
        time: "2 hours ago",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        icon: React.createElement(HiOutlineTruck, { size: 15 }),
        type: "delivery",
      },
      {
        id: 5,
        title: "Payment received",
        customer: "₹4,500 from Modern Cafe",
        time: "3 hours ago",
        color: "text-purple-600",
        bg: "bg-purple-50",
        icon: React.createElement(HiOutlineCurrencyRupee, { size: 15 }),
        type: "payment",
      },
      {
        id: 6,
        title: "Event order confirmed",
        customer: "Ramesh Wedding · 18 May",
        time: "4 hours ago",
        color: "text-pink-600",
        bg: "bg-pink-50",
        icon: React.createElement(HiOutlineCheckCircle, { size: 15 }),
        type: "event",
      },
    ],
    []
  );

  /* ────── Delivery status ────── */
  const deliveryStatus: DeliveryStatusData[] = useMemo(
    () => [
      { name: "Delivered", value: 142, color: "#22c55e" },
      { name: "In Transit", value: 28, color: "#3b82f6" },
      { name: "Pending", value: 19, color: "#f59e0b" },
      { name: "Failed", value: 4, color: "#ef4444" },
    ],
    []
  );

  /* ────── Revenue chart ────── */
  const revenueData = useMemo(
    () => ({
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      revenue: [12400, 15200, 11800, 18600, 21400, 19800, 14200],
      orders: [42, 51, 38, 64, 72, 68, 46],
    }),
    []
  );

  /* ────── Top products ────── */
  const topProducts = useMemo(
    () => ({
      names: ["20L Can", "10L Can", "5L Bottle", "1L Bottle", "500ml"],
      sales: [380, 240, 180, 120, 85],
      revenue: [22800, 12000, 7200, 3600, 1700],
    }),
    []
  );

  /* ────── Hourly delivery ────── */
  const hourlyDelivery = useMemo(
    () => ({
      hours: ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"],
      completed: [2, 8, 18, 24, 12, 20, 16, 6],
      pending: [1, 3, 5, 4, 8, 3, 2, 1],
    }),
    []
  );

  /* ────── Weather ────── */
  const weather: WeatherInfo = useMemo(
    () => ({
      temp: 32,
      condition: "Clear",
      city: "Chennai",
      emoji: "☀️",
      delayRisk: "none",
    }),
    []
  );

  return {
    kpis,
    alerts,
    todayPL,
    drivers,
    events,
    customerPulse,
    activity,
    deliveryStatus,
    revenueData,
    topProducts,
    hourlyDelivery,
    weather,
  };
};
