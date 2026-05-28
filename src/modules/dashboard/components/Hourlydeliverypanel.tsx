import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { HiOutlineLightningBolt } from "react-icons/hi";
import SectionCard from "./SectionCard";

interface Props {
  hours: string[];
  completed: number[];
  pending: number[];
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

const HourlyDeliveryPanel: React.FC<Props> = ({
  hours,
  completed,
  pending,
}) => {
  const option = useMemo<EChartsOption>(
    () => ({
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
        data: hours,
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
          data: completed,
          itemStyle: { color: "#22c55e", borderRadius: [0, 0, 0, 0] },
          barWidth: 16,
        },
        {
          name: "Pending",
          type: "bar",
          stack: "total",
          data: pending,
          itemStyle: { color: "#f59e0b", borderRadius: [4, 4, 0, 0] },
          barWidth: 16,
        },
      ],
    }),
    [hours, completed, pending]
  );

  return (
    <SectionCard
      title="Delivery Timeline"
      subtitle="Hourly breakdown today"
      icon={<HiOutlineLightningBolt size={16} />}
      iconBg="bg-gradient-to-br from-amber-50 to-amber-100"
      iconColor="text-amber-600"
    >
      <ReactECharts
        option={option}
        style={{ height: 260, width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </SectionCard>
  );
};

export default HourlyDeliveryPanel;
