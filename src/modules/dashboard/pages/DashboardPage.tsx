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
// Reusing your EXISTING Events module's endpoint — not building a second
// "find event orders" implementation. Same lesson as the dues list earlier:
// one proven query, reused, beats a second one that only looks equivalent.
import { getEventOrdersApi } from "../../events/api/Events.api";
import type {
  DashboardSummary,
  SmartAlert,
  TodayEvent,
} from "../types/Dashboard";
// OutstandingBucket ({name, value, color}) is a CHART-SPECIFIC shape, so it
// lives next to the component that owns it — not in the shared types file.
// The shared types file holds raw API data; this is presentation data derived
// from it. Importing it from the component keeps that boundary honest.
import type { OutstandingBucket } from "../components/Outstandingdonutpanel";
// Same reasoning: PaymentModeData ({cash, upi, bank}) is Paymentmodepanel's
// own fixed-shape contract, not raw API data — import it from the component.
import type { PaymentModeData } from "../components/Paymentmodepanel";
import TodayEventsPanel from "../components/Todayeventspanel";

const DashboardPage: React.FC = () => {
  // ───────────────────────────────────────────────────────────────────────────
  // FETCH — useQuery directly in the page (same as EventOrdersPage).
  // queryKey ["dashboard-summary"] labels the cache; any mutation elsewhere can
  // invalidateQueries(["dashboard-summary"]) to refresh the dashboard.
  // refetch() re-runs the query (wired to the header Refresh button).
  // ───────────────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching, isError, refetch } =
    useQuery<DashboardSummary>({
      queryKey: ["dashboard-summary"],
      queryFn: () => getDashboardSummaryApi().then((res) => res.data),
      staleTime: 1000 * 60,
    });

  // ───────────────────────────────────────────────────────────────────────────
  // TODAY'S EVENTS — a SEPARATE query, deliberately not folded into
  // /dashboard/summary. It hits your existing, already-working
  // GET /event-orders endpoint with dateFrom = dateTo = today, reusing real
  // filtering logic instead of teaching the dashboard backend a second way
  // to find events.
  //
  // Minimal local type for what this page actually reads off each event.
  // This is a BEST-GUESS shape based on your Prisma schema's field names
  // (eventType, customerName, deliveryTime, venueName, status) — I haven't
  // seen the real frontend EventOrder type from types/Events.ts. If any
  // field below is wrong, this interface is the one place to fix it.
  // ───────────────────────────────────────────────────────────────────────────
  interface EventOrderListItem {
    id: string;
    eventType: string; // raw enum from the API, e.g. "WEDDING"
    customerName: string;
    deliveryTime: string;
    venueName: string;
    status: string; // "DRAFT" | "CONFIRMED" | "IN_PROGRESS" | "DELIVERED" | "COMPLETED" | "CANCELLED"
  }

  const todayISO = new Date().toISOString().slice(0, 10);

  const { data: eventOrders } = useQuery<EventOrderListItem[]>({
    queryKey: ["today-events", todayISO],
    queryFn: () =>
      // The events endpoint wraps its array: { data, pagination } — NOT the
      // same envelope shape as /dashboard/summary, which returns the object
      // directly. Unwrap res.data.data here, not just res.data.
      getEventOrdersApi({ dateFrom: todayISO, dateTo: todayISO }).then(
        (res) => res.data.data as EventOrderListItem[]
      ),
    staleTime: 1000 * 60,
  });

  // Your Prisma EventType enum is SCREAMING_CASE (WEDDING, HOUSE_WARMING).
  // TodayEventsPanel's TYPE_STYLES is keyed by Title Case ("Wedding", "House
  // Warming") because it indexes a lookup table for display. Map explicitly
  // between the two rather than hoping they'll ever coincide — exactly the
  // kind of naming gap that broke five different panels earlier tonight.
  const EVENT_TYPE_LABEL: Record<string, TodayEvent["type"]> = {
    WEDDING: "Wedding",
    ENGAGEMENT: "Engagement",
    BIRTHDAY: "Birthday",
    CORPORATE: "Corporate",
    RELIGIOUS: "Religious",
    HOUSE_WARMING: "House Warming",
    OTHER: "Other",
  };

  // DRAFT events might never actually happen; CANCELLED ones already aren't
  // happening. Same instinct as filtering invoices to CONFIRMED/PARTIAL
  // elsewhere in this file — a "what's on today" panel should only show
  // events that are genuinely locked in.
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

  // Controls whether the export panel is visible. It's local UI state, not
  // server data, so it doesn't need React Query — a plain useState is right.
  const [exportOpen, setExportOpen] = useState(false);

  // "Jump straight to the Outstanding/dues page" — same navigation target
  // Outstandingcustomerspanel's own "View all" button already uses, so this
  // stays consistent with a pattern your app already relies on elsewhere.
  const handleAlertsClick = (): void => {
    navigate("/admin/billing-pos");
  };

  // Fetched data is undefined until it arrives — every access needs a fallback.
  const kpis = data?.kpis;
  // Raw totals from the API: three plain numbers, nothing chart-shaped yet.
  const riskTotals = data?.buckets ?? { highRisk: 0, medium: 0, recent: 0 };
  // Raw array from the API — one entry PER MODE THAT HAD ACTIVITY today.
  // Prisma's groupBy only returns rows that exist, so if there were zero UPI
  // payments today, there's no "UPI" entry here at all — not a zero, absent.
  const paymentModeSlices = data?.paymentMode ?? [];
  const dueCustomers = data?.dueCustomers ?? [];
  const stockRows = data?.stockRows ?? [];

  // ───────────────────────────────────────────────────────────────────────────
  // Outstandingdonutpanel needs an ARRAY of coloured, labelled slices — it
  // calls .map() on whatever you pass it. Handing it `riskTotals` (an object)
  // directly throws "buckets.map is not a function". This is the ONLY place
  // that conversion should happen — the API stays opinion-free about colours,
  // the chart component stays ignorant of what "high risk" means.
  //
  // Named `riskChartData` (not "buckets") on purpose: it should look nothing
  // like `riskTotals`, so it's never tempting to pass the wrong one.
  // ───────────────────────────────────────────────────────────────────────────
  const riskChartData: OutstandingBucket[] = [
    { name: "High Risk (>15d)", value: riskTotals.highRisk, color: "#dc2626" }, // red
    { name: "Medium (1-15d)", value: riskTotals.medium, color: "#d97706" }, // amber
    { name: "Recent", value: riskTotals.recent, color: "#059669" }, // green
  ];

  // ───────────────────────────────────────────────────────────────────────────
  // Paymentmodepanel wants a FIXED object — { cash, upi, bank } — not an
  // array. Same category of mismatch as the donut, mirrored: this time the
  // component is the one with a rigid shape. We look up each mode by its
  // enum name and default to 0 when a mode had no activity today (and so
  // never appeared in the array at all).
  //
  // DECISION (2026-08-15): Prisma's `PaymentMode` enum also has CREDIT and
  // CARD, but this business rarely uses them, so they're deliberately left
  // out of this chart for now — not a bug, a conscious scope call. They still
  // count correctly in "Today's Collection" up in the KPI cards (that's a
  // mode-blind SUM). If Card/Credit usage grows later, revisit this: either
  // add two more bars here, or fold them into "bank" as an approximation.
  // ───────────────────────────────────────────────────────────────────────────
  const paymentModeChartData: PaymentModeData = {
    cash: paymentModeSlices.find((m) => m.name === "CASH")?.value ?? 0,
    upi: paymentModeSlices.find((m) => m.name === "UPI")?.value ?? 0,
    bank: paymentModeSlices.find((m) => m.name === "BANK_TRANSFER")?.value ?? 0,
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Build the alert chips. Smartalertstrip expects SmartAlert[] objects
  // ({ label, color }) — NOT plain strings. We colour by severity:
  //   red   = money at risk / stock emergency
  //   amber = needs attention soon
  // ───────────────────────────────────────────────────────────────────────────
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

  // Error state: retry instead of a blank screen.
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
