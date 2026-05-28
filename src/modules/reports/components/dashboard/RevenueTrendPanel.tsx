import React, { useMemo, useState } from "react";
import { Button, Tooltip as AntTooltip } from "antd";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { HiOutlineDownload, HiOutlineTrendingUp } from "react-icons/hi";
import { BASE_TOOLTIP } from "../../constants/Reports.constants";
import { RevenueTrendPoint } from "../../types/Reports";
import { exportData } from "../../utils/export";
import { formatINR } from "../../utils/format";
import SectionCard from "../SectionCard";


interface Props {
  data: RevenueTrendPoint[];
}

type View = "revenue_orders" | "profit_cost";

const RevenueTrendPanel: React.FC<Props> = ({ data }) => {
  const [view, setView] = useState<View>("revenue_orders");

  const option = useMemo<EChartsOption>(() => {
    const dates = data.map((d) =>
      new Date(d.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    );

    if (view === "revenue_orders") {
      return {
        tooltip: {
          trigger: "axis",
          ...BASE_TOOLTIP,
          formatter: (params: any) => {
            const rev = params.find((p: any) => p.seriesName === "Revenue");
            const ord = params.find((p: any) => p.seriesName === "Orders");
            return `
              <div style="font-weight:700;margin-bottom:6px;color:#1e293b">${
                params[0].axisValue
              }</div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <span style="width:8px;height:8px;border-radius:50%;background:#22c55e"></span>
                <span style="color:#64748b">Revenue:</span>
                <span style="font-weight:700;color:#1e293b;margin-left:auto">${formatINR(
                  rev?.value || 0
                )}</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="width:8px;height:8px;border-radius:50%;background:#3b82f6"></span>
                <span style="color:#64748b">Orders:</span>
                <span style="font-weight:700;color:#1e293b;margin-left:auto">${
                  ord?.value || 0
                }</span>
              </div>
            `;
          },
        },
        grid: { left: 10, right: 10, top: 20, bottom: 20, containLabel: true },
        xAxis: {
          type: "category",
          data: dates,
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
            formatter: (v: number) =>
              v >= 100000
                ? `${(v / 100000).toFixed(0)}L`
                : v >= 1000
                ? `${v / 1000}k`
                : v.toString(),
          },
          splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
        },
        series: [
          {
            name: "Revenue",
            type: "line",
            smooth: true,
            data: data.map((d) => d.revenue),
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
            data: data.map((d) => d.orders),
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
    }

    return {
      tooltip: {
        trigger: "axis",
        ...BASE_TOOLTIP,
        valueFormatter: (v: any) => formatINR(v),
      },
      grid: { left: 10, right: 10, top: 20, bottom: 20, containLabel: true },
      xAxis: {
        type: "category",
        data: dates,
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
          formatter: (v: number) =>
            v >= 100000
              ? `${(v / 100000).toFixed(0)}L`
              : v >= 1000
              ? `${v / 1000}k`
              : v.toString(),
        },
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
      },
      series: [
        {
          name: "Profit",
          type: "line",
          smooth: true,
          data: data.map((d) => d.profit),
          showSymbol: false,
          lineStyle: { color: "#22c55e", width: 3 },
          itemStyle: { color: "#22c55e" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(34,197,94,0.3)" },
                { offset: 1, color: "rgba(34,197,94,0)" },
              ],
            },
          },
        },
        {
          name: "Cost",
          type: "line",
          smooth: true,
          data: data.map((d) => d.cost),
          showSymbol: false,
          lineStyle: { color: "#ef4444", width: 3, type: "dashed" },
          itemStyle: { color: "#ef4444" },
        },
      ],
    };
  }, [data, view]);

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalProfit = data.reduce((s, d) => s + d.profit, 0);
  const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const handleExport = () => {
    exportData("excel", {
      filename: "revenue-trend",
      title: "Revenue Trend Report",
      meta: [
        { label: "Total Revenue", value: formatINR(totalRevenue) },
        { label: "Total Profit", value: formatINR(totalProfit) },
        { label: "Profit Margin", value: `${margin.toFixed(1)}%` },
      ],
      columns: [
        { key: "date", label: "Date" },
        { key: "revenue", label: "Revenue (₹)" },
        { key: "orders", label: "Orders" },
        { key: "cost", label: "Cost (₹)" },
        { key: "profit", label: "Profit (₹)" },
      ],
      rows: data,
    });
  };

  return (
    <SectionCard
      title="Revenue & Orders Trend"
      subtitle={`${data.length} day performance overview`}
      icon={<HiOutlineTrendingUp size={16} />}
      iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100"
      iconColor="text-emerald-600"
      action={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setView("revenue_orders")}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                view === "revenue_orders"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setView("profit_cost")}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                view === "profit_cost"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Profit
            </button>
          </div>
          <AntTooltip title="Export to Excel">
            <Button
              icon={<HiOutlineDownload size={14} />}
              onClick={handleExport}
              className="!rounded-lg !h-8"
            />
          </AntTooltip>
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            Revenue
          </p>
          <p className="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5">
            {formatINR(totalRevenue, true)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            Profit
          </p>
          <p className="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5">
            {formatINR(totalProfit, true)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
            Margin
          </p>
          <p className="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5">
            {margin.toFixed(1)}%
          </p>
        </div>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 300, width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </SectionCard>
  );
};

export default RevenueTrendPanel;
