import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import Greetingheader from "../components/Greetingheader";
import Smartalertstrip from "../components/Smartalertstrip";
import Dashboardkpicards from "../components/Dashboardkpicards";
import Outstandingdonutpanel from "../components/Outstandingdonutpanel";
import Paymentmodepanel from "../components/Paymentmodepanel";
import Outstandingcustomerspanel from "../components/Outstandingcustomerspanel";
import Stocklevelspanel from "../components/Stocklevelspanel";
import Quickactionsfooter from "../components/Quickactionsfooter";
import DashboardExportModal from "../components/DashboardExportModal";
import { getDashboardSummaryApi } from "../api/Dashboard.api";
import { getEventOrdersApi } from "../../events/api/Events.api";
import type {
  DashboardSummary,
  SmartAlert,
  TodayEvent,
} from "../types/Dashboard";
import type { OutstandingBucket } from "../components/Outstandingdonutpanel";
import type { PaymentModeData } from "../components/Paymentmodepanel";
import TodayEventsPanel from "../components/Todayeventspanel";

const DashboardPage: React.FC = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useQuery<DashboardSummary>({
      queryKey: ["dashboard-summary"],
      queryFn: () => getDashboardSummaryApi().then((res) => res.data),
      staleTime: 1000 * 60,
    });

  interface EventOrderListItem {
    id: string;
    eventType: string;
    customerName: string;
    deliveryTime: string;
    venueName: string;
    status: string;
  }

  const todayISO = new Date().toISOString().slice(0, 10);

  const { data: eventOrders } = useQuery<EventOrderListItem[]>({
    queryKey: ["today-events", todayISO],
    queryFn: () =>
      getEventOrdersApi({ dateFrom: todayISO, dateTo: todayISO }).then(
        (res) => res.data.data as EventOrderListItem[]
      ),
    staleTime: 1000 * 60,
  });

  const EVENT_TYPE_LABEL: Record<string, TodayEvent["type"]> = {
    WEDDING: "Wedding",
    ENGAGEMENT: "Engagement",
    BIRTHDAY: "Birthday",
    CORPORATE: "Corporate",
    RELIGIOUS: "Religious",
    HOUSE_WARMING: "House Warming",
    OTHER: "Other",
  };

  const todayEvents: TodayEvent[] = (eventOrders ?? [])
    .filter((e) => e.status !== "DRAFT" && e.status !== "CANCELLED")
    .map((e) => ({
      id: e.id,
      type: EVENT_TYPE_LABEL[e.eventType] ?? "Other",
      customer: e.customerName,
      time: e.deliveryTime,
      venue: e.venueName,
    }));

  const navigate = useNavigate();

  const [exportOpen, setExportOpen] = useState(false);

  const handleAlertsClick = (): void => {
    navigate("/admin/billing-pos");
  };

  const kpis = data?.kpis;

  const riskTotals = data?.buckets ?? { highRisk: 0, medium: 0, recent: 0 };

  const paymentModeSlices = data?.paymentMode ?? [];
  const dueCustomers = data?.dueCustomers ?? [];
  const stockRows = data?.stockRows ?? [];

  const riskChartData: OutstandingBucket[] = [
    { name: "High Risk (>15d)", value: riskTotals.highRisk, color: "#dc2626" },
    { name: "Medium (1-15d)", value: riskTotals.medium, color: "#d97706" },
    { name: "Recent", value: riskTotals.recent, color: "#059669" },
  ];

  const paymentModeChartData: PaymentModeData = {
    cash: paymentModeSlices.find((m) => m.name === "CASH")?.value ?? 0,
    upi: paymentModeSlices.find((m) => m.name === "UPI")?.value ?? 0,
    bank: paymentModeSlices.find((m) => m.name === "BANK_TRANSFER")?.value ?? 0,
  };

  const alerts: SmartAlert[] = [];
  if (kpis) {
    if (kpis.totalOutstanding > 0) {
      alerts.push({
        label: `₹${kpis.totalOutstanding.toLocaleString("en-IN")} outstanding`,
        color: "red",
      });
    }
    if (kpis.customersWithDues > 0) {
      alerts.push({
        label: `${kpis.customersWithDues} customers with dues`,
        color: "amber",
      });
    }
    if (kpis.lowStockCount > 0) {
      alerts.push({
        label: `${kpis.lowStockCount} low stock item${
          kpis.lowStockCount > 1 ? "s" : ""
        }`,
        color: "amber",
      });
    }
    if (kpis.outOfStockCount > 0) {
      alerts.push({
        label: `${kpis.outOfStockCount} out of stock`,
        color: "red",
      });
    }
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-slate-600">Couldn't load the dashboard.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Greetingheader
        userName="Devaa"
        attentionCount={alerts.length}
        refreshing={isFetching}
        onRefresh={() => refetch()}
        onAlertsClick={handleAlertsClick}
        onExport={() => setExportOpen(true)}
      />

      {alerts.length > 0 && <Smartalertstrip alerts={alerts} />}

      <Spin spinning={isLoading} tip="Loading dashboard...">
        {kpis && <Dashboardkpicards data={kpis} />}

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          <Outstandingdonutpanel
            buckets={riskChartData}
            totalOutstanding={kpis?.totalOutstanding ?? 0}
          />
          <Paymentmodepanel data={paymentModeChartData} />
        </div>

        {/* Lists row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Outstandingcustomerspanel
            customers={dueCustomers}
            totalWithDues={kpis?.customersWithDues ?? 0}
          />
          <Stocklevelspanel items={stockRows} />
        </div>

        {/* Today's Events — full width, its own row */}
        <div className="mt-4">
          <TodayEventsPanel
            events={todayEvents}
            onViewAll={() => navigate("/admin/event-orders")}
          />
        </div>
      </Spin>

      <Quickactionsfooter />

      <DashboardExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
