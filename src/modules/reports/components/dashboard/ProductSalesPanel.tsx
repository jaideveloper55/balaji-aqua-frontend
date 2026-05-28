import React, { useMemo } from "react";
import { Button } from "antd";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { HiOutlineCube, HiOutlineArrowSmRight } from "react-icons/hi";
import { BASE_TOOLTIP } from "../../constants/Reports.constants";
import { ProductSalesRow } from "../../types/Reports";
import { formatINR } from "../../utils/format";
import SectionCard from "../SectionCard";


interface Props {
  data: ProductSalesRow[];
  onViewAll?: () => void;
}

const ProductSalesPanel: React.FC<Props> = ({ data, onViewAll }) => {
  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        ...BASE_TOOLTIP,
        formatter: (params: any) => {
          const item = params[0];
          const row = data.find((d) => d.product === item.name);
          return `
            <div style="font-weight:700;color:#1e293b;margin-bottom:6px">${
              item.name
            }</div>
            <div style="color:#64748b">Units: <strong style="color:#1e293b">${
              item.value
            }</strong></div>
            <div style="color:#64748b">Revenue: <strong style="color:#1e293b">${formatINR(
              row?.revenue || 0
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
        data: data.map((d) => d.product),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 12, color: "#475569", fontWeight: 600 },
      },
      series: [
        {
          type: "bar",
          data: data.map((d) => d.unitsSold),
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
    }),
    [data]
  );

  return (
    <SectionCard
      title="Top Selling Products"
      subtitle="Units sold this period"
      icon={<HiOutlineCube size={16} />}
      iconBg="bg-gradient-to-br from-violet-50 to-violet-100"
      iconColor="text-violet-600"
      action={
        onViewAll && (
          <Button
            size="small"
            type="text"
            onClick={onViewAll}
            className="!text-[11px] !text-blue-600 !font-semibold"
          >
            View all <HiOutlineArrowSmRight size={12} />
          </Button>
        )
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

export default ProductSalesPanel;
