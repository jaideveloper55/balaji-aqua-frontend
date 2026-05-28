import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BASE_TOOLTIP } from "../../constants/Reports.constants";
import { WorkforceMetric } from "../../types/Reports";
import SectionCard from "../SectionCard";

interface Props {
  data: WorkforceMetric[];
}

const WorkforcePanel: React.FC<Props> = ({ data }) => {
  const option = useMemo<EChartsOption>(() => {
    const dates = data.map((d) =>
      new Date(d.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    );

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        ...BASE_TOOLTIP,
      },
      legend: {
        data: ["Present", "Absent", "Late", "On Leave"],
        top: 0,
        icon: "circle",
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 11, color: "#64748b", fontWeight: 500 },
      },
      grid: { left: 10, right: 10, top: 30, bottom: 20, containLabel: true },
      xAxis: {
        type: "category",
        data: dates,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 11, color: "#94a3b8" },
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
          name: "Present",
          type: "bar",
          stack: "a",
          data: data.map((d) => d.present),
          itemStyle: { color: "#22c55e" },
          barWidth: 16,
        },
        {
          name: "Late",
          type: "bar",
          stack: "a",
          data: data.map((d) => d.late),
          itemStyle: { color: "#f59e0b" },
          barWidth: 16,
        },
        {
          name: "Absent",
          type: "bar",
          stack: "a",
          data: data.map((d) => d.absent),
          itemStyle: { color: "#ef4444", borderRadius: [4, 4, 0, 0] },
          barWidth: 16,
        },
        {
          name: "On Leave",
          type: "bar",
          stack: "a",
          data: data.map((d) => d.onLeave),
          itemStyle: { color: "#3b82f6" },
          barWidth: 16,
        },
      ],
    };
  }, [data]);

  return (
    <SectionCard
      title="Workforce Attendance"
      subtitle="Daily attendance breakdown"
      icon={<HiOutlineUserGroup size={16} />}
      iconBg="bg-gradient-to-br from-violet-50 to-violet-100"
      iconColor="text-violet-600"
    >
      <ReactECharts
        option={option}
        style={{ height: 280, width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </SectionCard>
  );
};

export default WorkforcePanel;
