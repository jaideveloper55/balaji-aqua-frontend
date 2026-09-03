import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs"; // ← add dayjs (default import) for today's date
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
import CustomDateRange from "../../../components/common/CustomDateRange";
import { HiOutlineCalendar, HiOutlineX } from "react-icons/hi";

const TODAY_ISO = dayjs().format("YYYY-MM-DD");

const DashboardPage: React.FC = () => {
  const {
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dashboardDateRange: [dayjs(), dayjs()] as [Dayjs, Dayjs],
    },
  });

  const [dateRange, setDateRange] = useState<{
    dateFrom?: string;
    dateTo?: string;
  }>({ dateFrom: TODAY_ISO, dateTo: TODAY_ISO });

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates || !dates[0] || !dates[1]) {
      reset({ dashboardDateRange: [dayjs(), dayjs()] });
      setDateRange({ dateFrom: TODAY_ISO, dateTo: TODAY_ISO });
      return;
    }
    setDateRange({
      dateFrom: dates[0].format("YYYY-MM-DD"),
      dateTo: dates[1].format("YYYY-MM-DD"),
    });
  };

  const { data, isLoading, isFetching, isError, refetch } =
    useQuery<DashboardSummary>({
      queryKey: ["dashboard-summary", dateRange.dateFrom, dateRange.dateTo],
      queryFn: () => getDashboardSummaryApi(dateRange).then((res) => res.data),
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

  const { data: eventOrders } = useQuery<EventOrderListItem[]>({
    queryKey: ["today-events", TODAY_ISO],
    queryFn: () =>
      getEventOrdersApi({ dateFrom: TODAY_ISO, dateTo: TODAY_ISO }).then(
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
  const period = data?.period;

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

  const isDefaultToday = period?.from === TODAY_ISO && period?.to === TODAY_ISO;

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

      {/* ─── Date filter bar ─── */}
      <div
        className={`flex items-center gap-3 flex-wrap px-4 py-3 rounded-2xl border transition-colors ${
          !isDefaultToday
            ? "bg-blue-50/60 border-blue-200"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-xl ${
            !isDefaultToday
              ? "bg-blue-100 text-blue-600"
              : "bg-white text-slate-500 border border-slate-200"
          }`}
        >
          <HiOutlineCalendar size={18} />
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Date Range
          </div>
          <div className="text-sm font-medium text-slate-800">
            {isDefaultToday ? (
              <span className="inline-flex items-center gap-1.5">
                Today's live data
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            ) : (
              <>
                {period?.from} <span className="text-slate-400">→</span>{" "}
                {period?.to}
              </>
            )}
          </div>
        </div>

        <div className="w-full sm:w-auto sm:min-w-[280px]">
          <CustomDateRange
            name="dashboardDateRange"
            control={control}
            errors={errors}
            placeholder={["From", "To"]}
            disableFuture
            onChange={handleDateChange}
          />
        </div>

        {!isDefaultToday && (
          <button
            onClick={() => {
              reset({ dashboardDateRange: [dayjs(), dayjs()] });
              setDateRange({ dateFrom: TODAY_ISO, dateTo: TODAY_ISO });
            }}
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <HiOutlineX size={14} />
            Reset to today
          </button>
        )}
      </div>

      {alerts.length > 0 && <Smartalertstrip alerts={alerts} />}

      <Spin spinning={isLoading} tip="Loading dashboard...">
        {kpis && <Dashboardkpicards data={kpis} period={period} />}

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
