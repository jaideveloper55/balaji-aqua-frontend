import React, { useState } from "react";
import { Button, Tooltip, message } from "antd";
import {
  HiOutlineDownload,
  HiOutlinePrinter,
  HiOutlineRefresh,
  HiOutlineCalendar,
} from "react-icons/hi";
import {
  TbChartBar,
  TbCurrencyRupee,
  TbTruck,
  TbUsers,
  TbCash,
  TbBuildingFactory2,
  TbUserCheck,
} from "react-icons/tb";

import CustomTabs from "../../../components/common/CustomTabs";

import { useReports } from "../hooks/useReports";
import { ExportPayload } from "../utils/export";
import SmartInsightBanner from "../components/SmartInsightBanner";
import DeliveryAnalyticsPanel from "../components/dashboard/DeliveryAnalyticsPanel";
import ExportReportModal from "../components/dashboard/ExportReportModal";
import FinancialBreakdownPanel from "../components/dashboard/FinancialBreakdownPanel";
import JarMovementPanel from "../components/dashboard/JarMovementPanel";
import ProductSalesPanel from "../components/dashboard/ProductSalesPanel";
import ReportFilters from "../components/dashboard/ReportFilters";
import ReportsKPICards from "../components/dashboard/ReportsKPICards";
import RevenueTrendPanel from "../components/dashboard/RevenueTrendPanel";
import TopCustomersPanel from "../components/dashboard/TopCustomersPanel";
import WorkforcePanel from "../components/dashboard/WorkforcePanel";

const TABS = [
  { key: "overview", label: "Overview", icon: <TbChartBar size={14} /> },
  { key: "sales", label: "Sales", icon: <TbCurrencyRupee size={14} /> },
  { key: "delivery", label: "Delivery", icon: <TbTruck size={14} /> },
  { key: "customers", label: "Customers", icon: <TbUsers size={14} /> },
  { key: "jars", label: "Jars", icon: <TbBuildingFactory2 size={14} /> },
  { key: "workforce", label: "Workforce", icon: <TbUserCheck size={14} /> },
  { key: "financial", label: "Financial", icon: <TbCash size={14} /> },
];

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [exportOpen, setExportOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
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
  } = useReports();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      message.success("Reports refreshed");
    }, 800);
  };

  const handlePrint = () => window.print();

  const buildExportPayload = (
    _format: "pdf" | "excel" | "csv",
    sections: string[]
  ): ExportPayload => {
    const rows: any[] = [];
    const columns = [
      { key: "section", label: "Section" },
      { key: "metric", label: "Metric" },
      { key: "value", label: "Value" },
    ];

    if (sections.includes("kpis")) {
      rows.push(
        {
          section: "KPI",
          metric: "Revenue",
          value: `₹${kpis.revenue.current}`,
        },
        { section: "KPI", metric: "Orders", value: kpis.orders.current },
        { section: "KPI", metric: "Customers", value: kpis.customers.current },
        { section: "KPI", metric: "Profit", value: `₹${kpis.profit.current}` },
        {
          section: "KPI",
          metric: "Deliveries",
          value: kpis.deliveries.current,
        },
        { section: "KPI", metric: "Jars", value: kpis.jarBalance.current }
      );
    }
    if (sections.includes("revenue")) {
      revenueTrend.forEach((r) =>
        rows.push({
          section: "Revenue",
          metric: r.date,
          value: `₹${r.revenue} · ${r.orders} orders · ₹${r.profit} profit`,
        })
      );
    }
    if (sections.includes("products")) {
      productSales.forEach((p) =>
        rows.push({
          section: "Product",
          metric: p.product,
          value: `${p.unitsSold} units · ₹${p.revenue}`,
        })
      );
    }
    if (sections.includes("customers")) {
      topCustomers.forEach((c) =>
        rows.push({
          section: "Customer",
          metric: c.name,
          value: `${c.orders} orders · ₹${c.revenue} · ₹${c.outstanding} outstanding`,
        })
      );
    }
    if (sections.includes("delivery")) {
      deliveryStats.forEach((d) =>
        rows.push({ section: "Delivery", metric: d.status, value: d.count })
      );
    }
    if (sections.includes("jars")) {
      rows.push(
        {
          section: "Jars",
          metric: "With Customers",
          value: jarBalance.withCustomers,
        },
        { section: "Jars", metric: "In Plant", value: jarBalance.inPlant },
        { section: "Jars", metric: "Damaged", value: jarBalance.damaged },
        { section: "Jars", metric: "Lost", value: jarBalance.lostMissing }
      );
    }
    if (sections.includes("workforce")) {
      workforce.forEach((w) =>
        rows.push({
          section: "Workforce",
          metric: w.date,
          value: `Present ${w.present} · Absent ${w.absent} · Late ${w.late} · Leave ${w.onLeave}`,
        })
      );
    }
    if (sections.includes("financial")) {
      income.forEach((i) =>
        rows.push({
          section: "Income",
          metric: i.category,
          value: `₹${i.amount}`,
        })
      );
      expense.forEach((e) =>
        rows.push({
          section: "Expense",
          metric: e.category,
          value: `₹${e.amount}`,
        })
      );
    }

    return {
      filename: `balaji-aqua-report-${new Date().toISOString().slice(0, 10)}`,
      title: "Balaji Aqua — Business Report",
      meta: [
        { label: "Period", value: period },
        { label: "Sections", value: sections.join(", ") },
      ],
      columns,
      rows,
    };
  };

  return (
    <div className="flex flex-col gap-6 print:gap-3">
      {/* Header — matches dashboard header style */}
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Reports & Analytics
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full ring-1 ring-emerald-100">
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <HiOutlineCalendar size={12} />
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-end gap-2 flex-wrap">
          <Tooltip title="Refresh data">
            <Button
              icon={
                <HiOutlineRefresh
                  size={15}
                  className={refreshing ? "animate-spin" : ""}
                />
              }
              onClick={handleRefresh}
              className="!rounded-xl !h-9"
            />
          </Tooltip>
          <Button
            icon={<HiOutlinePrinter size={15} />}
            onClick={handlePrint}
            className="!rounded-xl !h-9"
          >
            Print
          </Button>
          <Button
            type="primary"
            icon={<HiOutlineDownload size={15} />}
            onClick={() => setExportOpen(true)}
            className="!rounded-xl !h-9 !bg-gradient-to-r !from-blue-500 !to-indigo-600 !border-0"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ReportFilters period={period} onPeriodChange={setPeriod} />

      {/* Smart Insight */}
      <SmartInsightBanner
        insights={[
          { label: "Revenue ↑ 10.9%", isPositive: true },
          { label: "Orders ↑ 13.7%", isPositive: true },
          { label: "Outstanding ₹33.2K", isPositive: false },
        ]}
        summary={
          <>
            Revenue is up <strong className="text-emerald-700">10.9%</strong>{" "}
            this period with <strong>1,842 orders</strong>. Your top product{" "}
            <strong>20L Can</strong> grew{" "}
            <strong className="text-emerald-700">12.4%</strong>, but{" "}
            <strong>5L Bottle</strong> sales dropped{" "}
            <strong className="text-red-600">3.1%</strong>. Consider running a
            promo on smaller SKUs.
          </>
        }
      />

      {/* KPI Cards */}
      <ReportsKPICards data={kpis} />

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 p-2 print:hidden">
        <CustomTabs
          items={TABS}
          activeKey={activeTab}
          onChange={setActiveTab}
          accentColor="#6366f1"
        />
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RevenueTrendPanel data={revenueTrend} />
          </div>
          <div>
            <DeliveryAnalyticsPanel data={deliveryStats} />
          </div>
          <div>
            <ProductSalesPanel data={productSales} />
          </div>
          <div className="lg:col-span-2">
            <FinancialBreakdownPanel income={income} expense={expense} />
          </div>
          <div className="lg:col-span-3">
            <TopCustomersPanel data={topCustomers} />
          </div>
        </div>
      )}

      {activeTab === "sales" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RevenueTrendPanel data={revenueTrend} />
          </div>
          <div>
            <ProductSalesPanel data={productSales} />
          </div>
        </div>
      )}

      {activeTab === "delivery" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RevenueTrendPanel data={revenueTrend} />
          </div>
          <div>
            <DeliveryAnalyticsPanel data={deliveryStats} />
          </div>
        </div>
      )}

      {activeTab === "customers" && <TopCustomersPanel data={topCustomers} />}

      {activeTab === "jars" && (
        <JarMovementPanel movements={jarMovements} balance={jarBalance} />
      )}

      {activeTab === "workforce" && <WorkforcePanel data={workforce} />}

      {activeTab === "financial" && (
        <FinancialBreakdownPanel income={income} expense={expense} />
      )}

      <ExportReportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        buildPayload={buildExportPayload}
      />
    </div>
  );
};

export default ReportsPage;
