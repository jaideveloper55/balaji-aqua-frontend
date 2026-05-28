import React from "react";
import { Tooltip } from "antd";
import { HiOutlineTrendingUp, HiOutlineClock } from "react-icons/hi";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { DashboardKPI } from "../types/Dashboard";

interface KPICardProps extends DashboardKPI {}

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

const KPICard: React.FC<KPICardProps> = ({
  icon,
  label,
  value,
  change,
  gradient,
  iconColor,
  tooltip,
  sublabel,
  spark,
  sparkColor,
}) => {
  const card = (
    <div className="group relative bg-white rounded-2xl border border-slate-100 p-4 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${gradient} opacity-80`}
      />
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
      />

      <div className="relative flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${gradient} ${iconColor} flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          {icon}
        </div>
        <span
          className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-lg ${
            change.isUp
              ? "text-emerald-700 bg-emerald-50"
              : "text-red-600 bg-red-50"
          }`}
        >
          <HiOutlineTrendingUp
            size={11}
            className={change.isUp ? "" : "rotate-180"}
          />
          {change.value}%
        </span>
      </div>

      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-[22px] font-extrabold text-slate-800 leading-none tracking-tight tabular-nums">
        {value}
      </p>

      {spark && spark.length > 0 && (
        <div className="mt-2 -mx-1">
          <ReactECharts
            option={buildSparkOption(spark, sparkColor)}
            style={{ height: 28, width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </div>
      )}

      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 truncate">
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

interface Props {
  data: DashboardKPI[];
}

const DashboardKPICards: React.FC<Props> = ({ data }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
    {data.map(({ key, ...rest }) => (
      <KPICard key={key} {...rest} />
    ))}
  </div>
);

export default DashboardKPICards;
