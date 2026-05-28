import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { HiOutlineTrendingUp } from "react-icons/hi";
import SectionCard from "./SectionCard";

interface Props {
  days: string[];
  revenue: number[];
  orders: number[];
}

const baseTooltip = {
  backgroundColor: "#fff",
  borderColor: "#e2e8f0",
  borderWidth: 1,
  padding: 12,
  textStyle: { fontSize: 12, color: "#334155", fontWeight: 500 },
  extraCssText:
    "border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;",
};

const RevenueChartPanel: React.FC<Props> = ({ days, revenue, orders }) => {
  const option = useMemo<EChartsOption>(
    () => ({
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
        data: days,
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
          data: revenue,
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
          data: orders,
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
    }),
    [days, revenue, orders]
  );

  return (
    <SectionCard
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
        option={option}
        style={{ height: 280, width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </SectionCard>
  );
};

export default RevenueChartPanel;
