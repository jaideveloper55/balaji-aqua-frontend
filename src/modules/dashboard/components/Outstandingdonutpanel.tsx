import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { HiOutlineChartPie } from "react-icons/hi";

export interface OutstandingBucket {
  name: string;
  value: number;
  color: string;
}

interface Props {
  buckets: OutstandingBucket[];
  totalOutstanding: number;
}

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n ?? 0
  )}`;

const Outstandingdonutpanel: React.FC<Props> = ({
  buckets,
  totalOutstanding,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    chartRef.current = chart;

    chart.setOption({
      tooltip: {
        trigger: "item",
        formatter: (p: any) =>
          `${p.name}<br/><b>${inr(p.value)}</b> (${p.percent}%)`,
      },
      legend: {
        bottom: 0,
        icon: "circle",
        textStyle: { fontSize: 11, color: "#64748b" },
      },
      series: [
        {
          type: "pie",
          radius: ["55%", "78%"],
          center: ["50%", "42%"],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
              formatter: (p: any) => `${p.percent}%`,
            },
          },
          data: buckets.map((b) => ({
            name: b.name,
            value: b.value,
            itemStyle: { color: b.color },
          })),
        },
      ],
      graphic: {
        type: "text",
        left: "center",
        top: "36%",
        style: {
          text: inr(totalOutstanding),
          fontSize: 18,
          fontWeight: "bold",
          fill: "#0f172a",
        },
      },
    });

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, [buckets, totalOutstanding]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
          <HiOutlineChartPie size={16} className="text-rose-600" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-slate-900">
            Outstanding by Risk
          </h3>
          <p className="text-[12px] text-slate-500">Overdue aging breakdown</p>
        </div>
      </div>
      <div ref={ref} style={{ width: "100%", height: 260 }} />
    </div>
  );
};

export default Outstandingdonutpanel;
