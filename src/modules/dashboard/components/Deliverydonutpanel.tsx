import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { HiOutlineChartPie } from "react-icons/hi";
import SectionCard from "./SectionCard";
import { DeliveryStatusData } from "../types/Dashboard";

interface Props {
  data: DeliveryStatusData[];
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

const DeliveryDonutPanel: React.FC<Props> = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const deliveredPct =
    total > 0 ? Math.round((data[0].value / total) * 100) : 0;

  const option = useMemo<EChartsOption>(
    () => ({
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
          itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 3 },
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 6,
            itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.15)" },
          },
          data: data.map((d) => ({
            value: d.value,
            name: d.name,
            itemStyle: { color: d.color },
          })),
        },
      ],
    }),
    [data]
  );

  return (
    <SectionCard
      title="Delivery Status"
      subtitle={`${total} deliveries today`}
      icon={<HiOutlineChartPie size={16} />}
      iconBg="bg-gradient-to-br from-blue-50 to-blue-100"
      iconColor="text-blue-600"
    >
      <div className="relative">
        <ReactECharts
          option={option}
          style={{ height: 180, width: "100%" }}
          opts={{ renderer: "svg" }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[22px] font-extrabold text-slate-800 leading-none">
              {deliveredPct}%
            </p>
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
              Success
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
        {data.map((item) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
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
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 tabular-nums">
                  {item.value}
                </span>
                <span className="text-[10px] text-slate-400 tabular-nums w-8 text-right">
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default DeliveryDonutPanel;
