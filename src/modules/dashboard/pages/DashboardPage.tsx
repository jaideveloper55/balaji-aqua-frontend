import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import CustomDateRange from "../../../components/common/CustomDateRange";
import ActivityFeed from "../components/Activityfeed";
import CustomerPulsePanel from "../components/Customerpulsepanel";
import DashboardKPICards from "../components/Dashboardkpicards";
import DeliveryDonutPanel from "../components/Deliverydonutpanel";
import DriversOnDutyPanel from "../components/Driversondutypanel";
import GreetingHeader from "../components/Greetingheader";
import HourlyDeliveryPanel from "../components/Hourlydeliverypanel";
import QuickActionsFooter from "../components/Quickactionsfooter";
import RevenueChartPanel from "../components/Revenuechartpanel";
import SmartAlertStrip from "../components/Smartalertstrip";
import TodayEventsPanel from "../components/Todayeventspanel";
import TodayPLBar from "../components/Todayplbar";
import TopProductsPanel from "../components/Topproductspanel";
import { useDashboard } from "../types/Usedashboard";

interface DashboardFilterValues {
  dateRange: [Dayjs | null, Dayjs | null] | null;
}

const Dashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {
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
  } = useDashboard();

  const {
    control,
    formState: { errors },
  } = useForm<DashboardFilterValues>({
    defaultValues: {
      dateRange: [dayjs().subtract(6, "day"), dayjs()],
    },
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Greeting Header ── */}
      <GreetingHeader
        userName="Devaa"
        attentionCount={alerts.length}
        weather={weather}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        rightSlot={
          <div className="w-56 hidden lg:block">
            <CustomDateRange
              name="dateRange"
              control={control}
              errors={errors}
              placeholder={["From", "To"]}
              size="middle"
            />
          </div>
        }
      />

      {/* ── Smart Alert Strip ── */}
      {alerts.length > 0 && <SmartAlertStrip alerts={alerts} />}

      {/* ── Today's P&L ── */}
      <TodayPLBar data={todayPL} />

      {/* ── 6 KPI Cards ── */}
      <DashboardKPICards data={kpis} />

      {/* ── Charts Row 1: Revenue + Delivery Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChartPanel
            days={revenueData.days}
            revenue={revenueData.revenue}
            orders={revenueData.orders}
          />
        </div>
        <DeliveryDonutPanel data={deliveryStatus} />
      </div>

      {/* ── Live Operations Row: Drivers + Events + Pulse ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DriversOnDutyPanel drivers={drivers} />
        <TodayEventsPanel events={events} />
        <CustomerPulsePanel data={customerPulse} />
      </div>

      {/* ── Charts Row 2: Hourly + Top Products ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <HourlyDeliveryPanel
          hours={hourlyDelivery.hours}
          completed={hourlyDelivery.completed}
          pending={hourlyDelivery.pending}
        />
        <div className="lg:col-span-2">
          <TopProductsPanel
            names={topProducts.names}
            sales={topProducts.sales}
            revenue={topProducts.revenue}
          />
        </div>
      </div>

      {/* ── Activity Feed ── */}
      <ActivityFeed items={activity} />

      {/* ── Quick Actions ── */}
      <QuickActionsFooter />
    </div>
  );
};

export default Dashboard;
