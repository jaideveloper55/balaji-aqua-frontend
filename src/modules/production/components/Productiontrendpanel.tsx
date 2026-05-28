import React, { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from "react-icons/hi";
import { ProductionTrendPoint } from "../types/Production";

interface Props {
  data: ProductionTrendPoint[];
}

type Metric = "production" | "cost" | "efficiency";

const METRIC_CONFIG: Record<
  Metric,
  { label: string; color: string; gradient: [string, string] }
> = {
  production: {
    label: "Production",
    color: "#0EA5E9",
    gradient: ["rgba(14,165,233,0.35)", "rgba(14,165,233,0)"],
  },
  cost: {
    label: "Cost",
    color: "#F59E0B",
    gradient: ["rgba(245,158,11,0.35)", "rgba(245,158,11,0)"],
  },
  efficiency: {
    label: "Efficiency",
    color: "#10B981",
    gradient: ["rgba(16,185,129,0.35)", "rgba(16,185,129,0)"],
  },
};

const baseTooltip = {
  backgroundColor: "#fff",
  borderColor: "#e2e8f0",
  borderWidth: 1,
  padding: 12,
  textStyle: { fontSize: 12, color: "#334155", fontWeight: 500 },
  extraCssText:
    "border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;",
};

const ProductionTrendPanel: React.FC<Props> = ({ data }) => {
  const [metric, setMetric] = useState<Metric>("production");
  const cfg = METRIC_CONFIG[metric];

  const first = data[0]?.[metric] ?? 0;
  const last = data[data.length - 1]?.[metric] ?? 0;
  const change = first > 0 ? ((last - first) / first) * 100 : 0;
  const isUp = change >= 0;

  const formatValue = (v: number) => {
    if (metric === "cost") return `₹${v.toLocaleString("en-IN")}`;
    if (metric === "production") return `${v.toLocaleString("en-IN")} L`;
    if (metric === "efficiency") return `${v}%`;
    return v.toString();
  };

  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: "axis",
        ...baseTooltip,
        formatter: (params: any) => {
          const p = params[0];
          return `
            <div style="font-weight:700;color:#1e293b;margin-bottom:6px">${
              p.axisValueLabel
            }</div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="width:8px;height:8px;border-radius:50%;background:${
                cfg.color
              }"></span>
              <span style="color:#64748b">${cfg.label}:</span>
              <span style="font-weight:700;color:#1e293b;margin-left:auto">${formatValue(
                p.value
              )}</span>
            </div>
          `;
        },
      },
      grid: { left: 10, right: 20, top: 20, bottom: 20, containLabel: true },
      xAxis: {
        type: "category",
        data: data.map((d) =>
          new Date(d.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        ),
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
          formatter: (v: number) => {
            if (metric === "cost") return v >= 1000 ? `₹${v / 1000}k` : `₹${v}`;
            if (metric === "efficiency") return `${v}%`;
            return v >= 1000 ? `${v / 1000}k` : v.toString();
          },
        },
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
      },
      series: [
        {
          name: cfg.label,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          showSymbol: false,
          data: data.map((d) => d[metric]),
          emphasis: { focus: "series", itemStyle: { borderWidth: 3 } },
          lineStyle: { color: cfg.color, width: 3 },
          itemStyle: {
            color: cfg.color,
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
                { offset: 0, color: cfg.gradient[0] },
                { offset: 1, color: cfg.gradient[1] },
              ],
            },
          },
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, metric]
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Production Trends
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Last {data.length} days performance
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {(Object.keys(METRIC_CONFIG) as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                metric === m
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {METRIC_CONFIG[m].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
          {formatValue(last)}
        </span>
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
            isUp ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
          }`}
        >
          {isUp ? (
            <HiOutlineTrendingUp size={14} />
          ) : (
            <HiOutlineTrendingDown size={14} />
          )}
          {Math.abs(change).toFixed(1)}%
        </span>
        <span className="text-xs text-slate-400">vs start of period</span>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 280, width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
};

export default ProductionTrendPanel;
