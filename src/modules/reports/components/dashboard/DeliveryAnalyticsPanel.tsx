import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { HiOutlineTruck } from "react-icons/hi";
import { BASE_TOOLTIP } from "../../constants/Reports.constants";
import SectionCard from "../SectionCard";
import { DeliveryStat } from "../../types/Reports";


interface Props {
  data: DeliveryStat[];
}

const DeliveryAnalyticsPanel: React.FC<Props> = ({ data }) => {
  const total = data.reduce((s, d) => s + d.count, 0);
  const delivered = data.find((d) => d.status === "Delivered")?.count ?? 0;
  const successPct = total > 0 ? Math.round((delivered / total) * 100) : 0;

  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: "item",
        ...BASE_TOOLTIP,
        formatter: (p: any) =>
          `<div style="font-weight:700;color:#1e293b">${p.name}</div>
           <div style="color:#64748b;margin-top:4px">${p.value} deliveries (${p.percent}%)</div>`,
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
          data: data.map((d) => ({
            value: d.count,
            name: d.status,
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
      subtitle={`${total} deliveries this period`}
      icon={<HiOutlineTruck size={16} />}
      iconBg="bg-gradient-to-br from-blue-50 to-blue-100"
      iconColor="text-blue-600"
    >
      <div className="relative">
        <ReactECharts
          option={option}
          style={{ height: 200, width: "100%" }}
          opts={{ renderer: "svg" }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[24px] font-extrabold text-slate-800 leading-none">
              {successPct}%
            </p>
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
              Success
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
        {data.map((item) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div
              key={item.status}
              className="flex items-center justify-between text-[11px]"
            >
              <div className="flex items-center gap-2 flex-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-slate-600 font-medium">
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 tabular-nums">
                  {item.count}
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

export default DeliveryAnalyticsPanel;
