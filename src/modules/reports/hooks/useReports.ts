import { useMemo, useState } from "react";
import {
  RevenueTrendPoint,
  ProductSalesRow,
  TopCustomer,
  DeliveryStat,
  JarMovement,
  JarBalance,
  WorkforceMetric,
  FinancialBreakdown,
  ReportPeriod,
  ReportsKPIs,
} from "../types/Reports";

export const useReports = () => {
  const [period, setPeriod] = useState<ReportPeriod>("30d");

  /* KPIs */
  const kpis: ReportsKPIs = useMemo(
    () => ({
      revenue: {
        current: 1284500,
        prev: 1158000,
        spark: [820, 932, 901, 934, 1290, 1330, 1284],
      },
      orders: {
        current: 1842,
        prev: 1620,
        spark: [120, 132, 101, 134, 190, 230, 184],
      },
      customers: {
        current: 348,
        prev: 312,
        spark: [220, 232, 251, 264, 290, 305, 348],
      },
      profit: {
        current: 384500,
        prev: 318000,
        spark: [220, 232, 281, 264, 305, 350, 384],
      },
      deliveries: {
        current: 2340,
        prev: 2180,
        spark: [55, 62, 68, 72, 78, 82, 90],
      },
      jarBalance: {
        current: 5000,
        prev: 4900,
        spark: [4800, 4850, 4900, 4920, 4960, 4980, 5000],
      },
    }),
    []
  );

  /* Revenue */
  const revenueTrend: RevenueTrendPoint[] = useMemo(() => {
    const days = 30;
    const result: RevenueTrendPoint[] = [];
    const today = new Date("2026-05-11");
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const seed = Math.sin(i * 0.5) * 0.15 + 1;
      const revenue = Math.round(40000 * seed + Math.random() * 8000);
      const cost = Math.round(revenue * (0.65 + Math.random() * 0.05));
      result.push({
        date: d.toISOString().slice(0, 10),
        revenue,
        orders: Math.round(60 + Math.random() * 30),
        cost,
        profit: revenue - cost,
      });
    }
    return result;
  }, []);

  /* Products */
  const productSales: ProductSalesRow[] = useMemo(
    () => [
      {
        product: "20L Can",
        category: "Water Products",
        unitsSold: 380,
        revenue: 22800,
        growth: 12.4,
      },
      {
        product: "10L Can",
        category: "Water Products",
        unitsSold: 240,
        revenue: 12000,
        growth: 8.2,
      },
      {
        product: "5L Bottle",
        category: "Water Products",
        unitsSold: 180,
        revenue: 7200,
        growth: -3.1,
      },
      {
        product: "1L Bottle",
        category: "Water Products",
        unitsSold: 120,
        revenue: 3600,
        growth: 22.8,
      },
      {
        product: "500ml",
        category: "Water Products",
        unitsSold: 85,
        revenue: 1700,
        growth: 5.6,
      },
    ],
    []
  );

  /* Customers */
  const topCustomers: TopCustomer[] = useMemo(
    () => [
      {
        id: "1",
        name: "Priya Enterprises",
        type: "Commercial",
        orders: 124,
        revenue: 248000,
        outstanding: 12000,
        lastOrder: "2026-05-10",
      },
      {
        id: "2",
        name: "Sunrise Apartments",
        type: "Residential",
        orders: 98,
        revenue: 186000,
        outstanding: 0,
        lastOrder: "2026-05-11",
      },
      {
        id: "3",
        name: "Tech Solutions Pvt.",
        type: "Commercial",
        orders: 86,
        revenue: 154800,
        outstanding: 8500,
        lastOrder: "2026-05-09",
      },
      {
        id: "4",
        name: "Green Valley School",
        type: "Commercial",
        orders: 72,
        revenue: 129600,
        outstanding: 0,
        lastOrder: "2026-05-10",
      },
      {
        id: "5",
        name: "Modern Cafe",
        type: "Commercial",
        orders: 64,
        revenue: 96000,
        outstanding: 4200,
        lastOrder: "2026-05-08",
      },
      {
        id: "6",
        name: "Rajesh Kumar",
        type: "Residential",
        orders: 58,
        revenue: 78400,
        outstanding: 3000,
        lastOrder: "2026-05-11",
      },
      {
        id: "7",
        name: "Anita Desai",
        type: "Residential",
        orders: 52,
        revenue: 72800,
        outstanding: 0,
        lastOrder: "2026-05-10",
      },
      {
        id: "8",
        name: "Kavitha Supermarket",
        type: "Commercial",
        orders: 48,
        revenue: 62400,
        outstanding: 5500,
        lastOrder: "2026-05-09",
      },
    ],
    []
  );

  /* Delivery */
  const deliveryStats: DeliveryStat[] = useMemo(
    () => [
      { status: "Delivered", count: 142, color: "#22c55e" },
      { status: "In Transit", count: 28, color: "#3b82f6" },
      { status: "Pending", count: 19, color: "#f59e0b" },
      { status: "Failed", count: 4, color: "#ef4444" },
    ],
    []
  );

  /* Jars */
  const jarBalance: JarBalance = useMemo(
    () => ({
      total: 5000,
      withCustomers: 3200,
      inPlant: 1500,
      damaged: 200,
      lostMissing: 100,
    }),
    []
  );

  const jarMovements: JarMovement[] = useMemo(() => {
    const result: JarMovement[] = [];
    const today = new Date("2026-05-11");
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      result.push({
        date: d.toISOString().slice(0, 10),
        issued: Math.round(80 + Math.random() * 50),
        returned: Math.round(70 + Math.random() * 40),
        damaged: Math.round(2 + Math.random() * 5),
      });
    }
    return result;
  }, []);

  /* Workforce */
  const workforce: WorkforceMetric[] = useMemo(() => {
    const result: WorkforceMetric[] = [];
    const today = new Date("2026-05-11");
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const present = Math.round(17 + Math.random() * 4);
      result.push({
        date: d.toISOString().slice(0, 10),
        present,
        absent: Math.round(1 + Math.random() * 3),
        late: Math.round(Math.random() * 3),
        onLeave: Math.round(Math.random() * 2),
      });
    }
    return result;
  }, []);

  /* Income */
  const income: FinancialBreakdown[] = useMemo(
    () => [
      { category: "Bottle Sales", type: "income", amount: 558000, pct: 43 },
      { category: "Jar Sales", type: "income", amount: 421000, pct: 33 },
      { category: "Can Sales", type: "income", amount: 261400, pct: 20 },
      { category: "Event Orders", type: "income", amount: 32000, pct: 3 },
      { category: "Other", type: "income", amount: 12100, pct: 1 },
    ],
    []
  );

  /* Expense */
  const expense: FinancialBreakdown[] = useMemo(
    () => [
      { category: "Utilities", type: "expense", amount: 22500, pct: 27 },
      { category: "Vehicle & Fuel", type: "expense", amount: 18000, pct: 21 },
      { category: "Plant Operations", type: "expense", amount: 14200, pct: 17 },
      { category: "Rent & Lease", type: "expense", amount: 12000, pct: 14 },
      { category: "Packaging", type: "expense", amount: 7800, pct: 9 },
      { category: "Salary", type: "expense", amount: 111237, pct: 12 },
    ],
    []
  );

  return {
    period,
    setPeriod,
    kpis,
    revenueTrend,
    productSales,
    topCustomers,
    deliveryStats,
    jarBalance,
    jarMovements,
    workforce,
    income,
    expense,
  };
};
