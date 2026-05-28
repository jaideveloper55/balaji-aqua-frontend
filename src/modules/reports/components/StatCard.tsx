import React from "react";
import { Tooltip } from "antd";
import { HiOutlineTrendingUp, HiOutlineClock } from "react-icons/hi";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change: { value: number; isUp: boolean };
  gradient: string;
  iconColor: string;
  tooltip?: string;
  sublabel?: string;
  spark?: number[];
  sparkColor?: string;
}

const buildSparkOption = (data: number[], color: string): EChartsOption => ({
  grid: { left: 0, right: 0, top: 4, bottom: 4 },
  xAxis: { type: "category", show: false, data: data.map((_, i) => i) },
  yAxis: { type: "value", show: false },
  tooltip: { show: false },
  series: [
    {
      type: "line",
      data,
      smooth: true,
      symbol: "none",
      lineStyle: { color, width: 2 },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: color + "40" },
            { offset: 1, color: color + "00" },
          ],
        },
      },
    },
  ],
});


const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  change,
  gradient,
  iconColor,
  tooltip,
  sublabel,
  spark,
  sparkColor = "#22c55e",
}) => {
  const card = (
    <div className="group relative bg-white rounded-2xl border border-slate-100 p-5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${gradient} opacity-80`}
      />
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
      <p className="text-[26px] font-extrabold text-slate-800 leading-none tracking-tight tabular-nums">
        {value}
      </p>

      {spark && spark.length > 0 && (
        <div className="mt-3 -mx-1">
          <ReactECharts
            option={buildSparkOption(spark, sparkColor)}
            style={{ height: 32, width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </div>
      )}

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

export default StatCard;
