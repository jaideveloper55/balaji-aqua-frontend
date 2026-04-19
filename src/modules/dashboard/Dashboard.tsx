import React, { useMemo, useState } from "react";
import { Button, Tooltip } from "antd";
import { useForm } from "react-hook-form";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  HiOutlineUsers,
  HiOutlineTruck,
  HiOutlineCube,
  HiOutlineCurrencyRupee,
  HiOutlineArrowSmRight,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineBell,
  HiOutlineDownload,
  HiOutlineCalendar,
  HiOutlineTrendingUp,
  HiOutlineChartPie,
  HiOutlineLightningBolt,
  HiOutlineRefresh,
} from "react-icons/hi";
import { RiRouteLine } from "react-icons/ri";
import CustomDateRange from "../../components/common/CustomDateRange";

/* ─────────────────────────────────────────────────────────────── */
/*  MOCK DATA                                                       */
/* ─────────────────────────────────────────────────────────────── */

const revenueData = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  revenue: [12400, 15200, 11800, 18600, 21400, 19800, 14200],
  orders: [42, 51, 38, 64, 72, 68, 46],
};

const deliveryStatusData = [
  { name: "Delivered", value: 142, color: "#22c55e" },
  { name: "In Transit", value: 28, color: "#3b82f6" },
  { name: "Pending", value: 19, color: "#f59e0b" },
  { name: "Failed", value: 4, color: "#ef4444" },
];

const topProductsData = {
  names: ["20L Can", "10L Can", "5L Bottle", "1L Bottle", "500ml"],
  sales: [380, 240, 180, 120, 85],
  revenue: [22800, 12000, 7200, 3600, 1700],
};

const hourlyDeliveryData = {
  hours: ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"],
  completed: [2, 8, 18, 24, 12, 20, 16, 6],
  pending: [1, 3, 5, 4, 8, 3, 2, 1],
};

const recentActivity = [
  {
    id: 1,
    title: "Delivery #DEL-0342 completed",
    customer: "Priya Enterprises",
    time: "2 min ago",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: <HiOutlineCheckCircle size={15} />,
  },
  {
    id: 2,
    title: "New customer added",
    customer: "Rajesh Kumar",
    time: "15 min ago",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: <HiOutlineUsers size={15} />,
  },
  {
    id: 3,
    title: "Low stock: 20L Water Can",
    customer: "Only 12 units left",
    time: "1 hour ago",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: <HiOutlineExclamationCircle size={15} />,
  },
  {
    id: 4,
    title: "Delivery #DEL-0341 dispatched",
    customer: "Sunrise Apartments",
    time: "2 hours ago",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    icon: <HiOutlineTruck size={15} />,
  },
  {
    id: 5,
    title: "Payment received",
    customer: "₹4,500 from Modern Cafe",
    time: "3 hours ago",
    color: "text-purple-600",
    bg: "bg-purple-50",
    icon: <HiOutlineCurrencyRupee size={15} />,
  },
];

/* ─────────────────────────────────────────────────────────────── */
/*  CHART OPTIONS                                                   */
/* ─────────────────────────────────────────────────────────────── */

const baseTooltip = {
  backgroundColor: "#fff",
  borderColor: "#e2e8f0",
  borderWidth: 1,
  padding: 12,
  textStyle: { fontSize: 12, color: "#334155", fontWeight: 500 },
  extraCssText:
    "border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;",
};

const revenueChartOption: EChartsOption = {
  tooltip: {
    trigger: "axis",
    ...baseTooltip,
    formatter: (params: any) => {
      const [rev, ord] = params;
      return `
        <div style="font-weight:700;margin-bottom:6px;color:#1e293b">${
          rev.axisValue
        }</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span style="width:8px;height:8px;border-radius:50%;background:#22c55e"></span>
          <span style="color:#64748b">Revenue:</span>
          <span style="font-weight:700;color:#1e293b;margin-left:auto">₹${rev.value.toLocaleString(
            "en-IN"
          )}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:8px;height:8px;border-radius:50%;background:#3b82f6"></span>
          <span style="color:#64748b">Orders:</span>
          <span style="font-weight:700;color:#1e293b;margin-left:auto">${
            ord.value
          }</span>
        </div>
      `;
    },
  },
  grid: { left: 10, right: 20, top: 20, bottom: 20, containLabel: true },
  xAxis: {
    type: "category",
    data: revenueData.days,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { fontSize: 11, color: "#94a3b8", fontWeight: 500 },
  },
  yAxis: {
    type: "value",
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      fontSize: 11,
      color: "#94a3b8",
      formatter: (v: number) => (v >= 1000 ? `${v / 1000}k` : v.toString()),
    },
    splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
  },
  series: [
    {
      name: "Revenue",
      type: "line",
      smooth: true,
      data: revenueData.revenue,
      symbol: "circle",
      symbolSize: 8,
      showSymbol: false,
      emphasis: { focus: "series", itemStyle: { borderWidth: 3 } },
      lineStyle: { color: "#22c55e", width: 3 },
      itemStyle: {
        color: "#22c55e",
        borderColor: "#fff",
        borderWidth: 2,
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(34,197,94,0.35)" },
            { offset: 1, color: "rgba(34,197,94,0)" },
          ],
        },
      },
    },
    {
      name: "Orders",
      type: "line",
      smooth: true,
      data: revenueData.orders,
      symbol: "circle",
      symbolSize: 8,
      showSymbol: false,
      emphasis: { focus: "series", itemStyle: { borderWidth: 3 } },
      lineStyle: { color: "#3b82f6", width: 3 },
      itemStyle: {
        color: "#3b82f6",
        borderColor: "#fff",
        borderWidth: 2,
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(59,130,246,0.25)" },
            { offset: 1, color: "rgba(59,130,246,0)" },
          ],
        },
      },
    },
  ],
};

const deliveryPieOption: EChartsOption = {
  tooltip: {
    trigger: "item",
    ...baseTooltip,
    formatter: (params: any) =>
      `<div style="font-weight:700;color:#1e293b">${params.name}</div>
       <div style="color:#64748b;margin-top:4px">${params.value} deliveries (${params.percent}%)</div>`,
  },
  series: [
    {
      type: "pie",
      radius: ["60%", "85%"],
      center: ["50%", "50%"],
      avoidLabelOverlap: true,
      padAngle: 4,
      itemStyle: {
        borderRadius: 8,
        borderColor: "#fff",
        borderWidth: 3,
      },
      label: { show: false },
      labelLine: { show: false },
      emphasis: {
        scale: true,
        scaleSize: 6,
        itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.15)" },
      },
      data: deliveryStatusData.map((d) => ({
        value: d.value,
        name: d.name,
        itemStyle: { color: d.color },
      })),
    },
  ],
};

const topProductsOption: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    ...baseTooltip,
    formatter: (params: any) => {
      const item = params[0];
      const idx = topProductsData.names.indexOf(item.name);
      const revenue = topProductsData.revenue[idx];
      return `
        <div style="font-weight:700;color:#1e293b;margin-bottom:6px">${
          item.name
        }</div>
        <div style="color:#64748b">Units: <strong style="color:#1e293b">${
          item.value
        }</strong></div>
        <div style="color:#64748b">Revenue: <strong style="color:#1e293b">₹${revenue.toLocaleString(
          "en-IN"
        )}</strong></div>
      `;
    },
  },
  grid: { left: 10, right: 30, top: 10, bottom: 10, containLabel: true },
  xAxis: {
    type: "value",
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { fontSize: 11, color: "#94a3b8" },
    splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
  },
  yAxis: {
    type: "category",
    data: topProductsData.names,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { fontSize: 12, color: "#475569", fontWeight: 600 },
  },
  series: [
    {
      type: "bar",
      data: topProductsData.sales,
      barWidth: 24,
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: "#8b5cf6" },
            { offset: 1, color: "#a78bfa" },
          ],
        },
        borderRadius: [0, 8, 8, 0],
      },
      emphasis: {
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "#7c3aed" },
              { offset: 1, color: "#8b5cf6" },
            ],
          },
        },
      },
      label: {
        show: true,
        position: "right",
        fontSize: 11,
        fontWeight: 700,
        color: "#64748b",
      },
    },
  ],
};

const hourlyDeliveryOption: EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    ...baseTooltip,
  },
  legend: {
    data: ["Completed", "Pending"],
    bottom: 0,
    icon: "circle",
    itemWidth: 8,
    itemHeight: 8,
    textStyle: { fontSize: 11, color: "#64748b", fontWeight: 500 },
  },
  grid: { left: 10, right: 20, top: 20, bottom: 40, containLabel: true },
  xAxis: {
    type: "category",
    data: hourlyDeliveryData.hours,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { fontSize: 10, color: "#94a3b8" },
  },
  yAxis: {
    type: "value",
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { fontSize: 11, color: "#94a3b8" },
    splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
  },
  series: [
    {
      name: "Completed",
      type: "bar",
      stack: "total",
      data: hourlyDeliveryData.completed,
      itemStyle: { color: "#22c55e", borderRadius: [0, 0, 0, 0] },
      barWidth: 16,
    },
    {
      name: "Pending",
      type: "bar",
      stack: "total",
      data: hourlyDeliveryData.pending,
      itemStyle: { color: "#f59e0b", borderRadius: [4, 4, 0, 0] },
      barWidth: 16,
    },
  ],
};

/* ─────────────────────────────────────────────────────────────── */
/*  STAT CARD                                                       */
/* ─────────────────────────────────────────────────────────────── */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change: { value: number; isUp: boolean };
  gradient: string;
  iconColor: string;
  tooltip?: string;
  sublabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  change,
  gradient,
  iconColor,
  tooltip,
  sublabel,
}) => {
  const card = (
    <div className="group relative bg-white rounded-2xl border border-slate-100 p-5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
      {/* Gradient accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${gradient} opacity-80`}
      />

      {/* Decorative gradient blob */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-2xl ${gradient} ${iconColor} flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          {icon}
        </div>
        <span
          className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-lg ${
            change.isUp
              ? "text-emerald-700 bg-emerald-50"
              : "text-red-600 bg-red-50"
          }`}
        >
          <HiOutlineTrendingUp
            size={12}
            className={change.isUp ? "" : "rotate-180"}
          />
          {change.value}%
        </span>
      </div>

      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <p className="text-[28px] font-extrabold text-slate-800 leading-none tracking-tight tabular-nums">
        {value}
      </p>
      <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
        <HiOutlineClock size={10} />
        {sublabel || "vs last period"}
      </p>
    </div>
  );

  return tooltip ? (
    <Tooltip title={tooltip} placement="bottom">
      {card}
    </Tooltip>
  ) : (
    card
  );
};

/* ─────────────────────────────────────────────────────────────── */
/*  SECTION CARD                                                    */
/* ─────────────────────────────────────────────────────────────── */

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  icon,
  iconBg,
  iconColor,
  action,
  children,
  className = "",
}) => (
  <div
    className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${className}`}
  >
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          <span className={iconColor}>{icon}</span>
        </div>
        <div>
          <h3 className="text-[13px] font-bold text-slate-800 leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

/* ─────────────────────────────────────────────────────────────── */
/*  MAIN DASHBOARD                                                  */
/* ─────────────────────────────────────────────────────────────── */

interface DashboardFilterValues {
  dateRange: [Dayjs | null, Dayjs | null] | null;
}

const Dashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

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

  const stats = useMemo(
    () => [
      {
        icon: <HiOutlineCurrencyRupee size={24} />,
        label: "Today's Revenue",
        value: "₹21,400",
        change: { value: 12.5, isUp: true },
        gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100",
        iconColor: "text-emerald-600",
        tooltip: "Total revenue across all orders today",
        sublabel: "+₹2,380 from yesterday",
      },
      {
        icon: <HiOutlineTruck size={24} />,
        label: "Deliveries Today",
        value: 72,
        change: { value: 8.3, isUp: true },
        gradient: "bg-gradient-to-br from-blue-50 to-blue-100",
        iconColor: "text-blue-600",
        tooltip: "Deliveries scheduled or completed today",
        sublabel: "68 completed, 4 pending",
      },
      {
        icon: <HiOutlineUsers size={24} />,
        label: "Active Customers",
        value: 348,
        change: { value: 4.2, isUp: true },
        gradient: "bg-gradient-to-br from-violet-50 to-violet-100",
        iconColor: "text-violet-600",
        tooltip: "Customers with active subscriptions",
        sublabel: "14 new this week",
      },
      {
        icon: <HiOutlineCube size={24} />,
        label: "Cans Circulating",
        value: "1,240",
        change: { value: 2.1, isUp: false },
        gradient: "bg-gradient-to-br from-amber-50 to-amber-100",
        iconColor: "text-amber-600",
        tooltip: "Total cans across customers and plant",
        sublabel: "892 with customers",
      },
    ],
    []
  );

  const totalDeliveries = deliveryStatusData.reduce(
    (sum, d) => sum + d.value,
    0
  );

  const deliveredPercent = Math.round(
    (deliveryStatusData[0].value / totalDeliveries) * 100
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header with Date Filter ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Dashboard
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
          <div className="w-64">
            <CustomDateRange
              name="dateRange"
              control={control}
              errors={errors}
              placeholder={["From", "To"]}
              size="middle"
            />
          </div>
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
            icon={<HiOutlineBell size={15} />}
            className="!rounded-xl !h-9"
          >
            Alerts
          </Button>
          <Button
            icon={<HiOutlineDownload size={15} />}
            className="!rounded-xl !h-9"
          >
            Export
          </Button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* ── Charts Row 1: Revenue + Delivery Pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          className="lg:col-span-2"
          title="Revenue & Orders Trend"
          subtitle="Last 7 days performance"
          icon={<HiOutlineTrendingUp size={16} />}
          iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100"
          iconColor="text-emerald-600"
          action={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                <span className="text-[10px] font-semibold text-slate-600">
                  Revenue
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-200" />
                <span className="text-[10px] font-semibold text-slate-600">
                  Orders
                </span>
              </div>
            </div>
          }
        >
          <ReactECharts
            option={revenueChartOption}
            style={{ height: 300, width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </SectionCard>

        <SectionCard
          title="Delivery Status"
          subtitle={`${totalDeliveries} deliveries today`}
          icon={<HiOutlineChartPie size={16} />}
          iconBg="bg-gradient-to-br from-blue-50 to-blue-100"
          iconColor="text-blue-600"
        >
          <div className="relative">
            <ReactECharts
              option={deliveryPieOption}
              style={{ height: 180, width: "100%" }}
              opts={{ renderer: "svg" }}
            />
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-[22px] font-extrabold text-slate-800 leading-none">
                  {deliveredPercent}%
                </p>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Success
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
            {deliveryStatusData.map((item) => {
              const percent = Math.round((item.value / totalDeliveries) * 100);
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: item.color }}
                    />
                    <span className="text-slate-600 font-medium">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 tabular-nums">
                      {item.value}
                    </span>
                    <span className="text-[10px] text-slate-400 tabular-nums w-8 text-right">
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* ── Charts Row 2: Hourly + Top Products ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Delivery Timeline"
          subtitle="Hourly breakdown today"
          icon={<HiOutlineLightningBolt size={16} />}
          iconBg="bg-gradient-to-br from-amber-50 to-amber-100"
          iconColor="text-amber-600"
        >
          <ReactECharts
            option={hourlyDeliveryOption}
            style={{ height: 260, width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </SectionCard>

        <SectionCard
          className="lg:col-span-2"
          title="Top Selling Products"
          subtitle="Units sold this week"
          icon={<HiOutlineCube size={16} />}
          iconBg="bg-gradient-to-br from-violet-50 to-violet-100"
          iconColor="text-violet-600"
          action={
            <Button
              size="small"
              type="text"
              className="!text-[11px] !text-blue-600 !font-semibold"
            >
              View all <HiOutlineArrowSmRight size={12} />
            </Button>
          }
        >
          <ReactECharts
            option={topProductsOption}
            style={{ height: 260, width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </SectionCard>
      </div>

      {/* ── Activity Feed ── */}
      <SectionCard
        title="Recent Activity"
        subtitle="Live updates from across your operation"
        icon={<HiOutlineClock size={16} />}
        iconBg="bg-gradient-to-br from-slate-50 to-slate-100"
        iconColor="text-slate-600"
        action={
          <Button
            size="small"
            type="text"
            className="!text-[11px] !text-blue-600 !font-semibold"
          >
            View all <HiOutlineArrowSmRight size={12} />
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer group"
            >
              <div
                className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-slate-700 leading-tight truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {item.customer}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <HiOutlineClock size={9} />
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Quick Links ── */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Manage Customers",
              count: "348 active",
              icon: <HiOutlineUsers size={20} />,
              gradient: "from-violet-500 to-purple-600",
              iconBg: "bg-violet-50",
              iconColor: "text-violet-600",
            },
            {
              label: "Delivery Routes",
              count: "12 active",
              icon: <RiRouteLine size={20} />,
              gradient: "from-blue-500 to-cyan-600",
              iconBg: "bg-blue-50",
              iconColor: "text-blue-600",
            },
            {
              label: "Product Inventory",
              count: "24 products",
              icon: <HiOutlineCube size={20} />,
              gradient: "from-emerald-500 to-teal-600",
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-600",
            },
            {
              label: "Can Tracking",
              count: "1,240 cans",
              icon: <HiOutlineCube size={20} />,
              gradient: "from-amber-500 to-orange-600",
              iconBg: "bg-amber-50",
              iconColor: "text-amber-600",
            },
          ].map((link) => (
            <button
              key={link.label}
              className="group relative flex items-center gap-3 bg-white rounded-2xl border border-slate-100 p-4 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-slate-200 overflow-hidden"
            >
              <div
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${link.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
              />
              <div
                className={`w-11 h-11 rounded-xl ${link.iconBg} ${link.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
              >
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-slate-800 leading-tight">
                  {link.label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {link.count}
                </p>
              </div>
              <HiOutlineArrowSmRight
                size={16}
                className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all shrink-0"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
