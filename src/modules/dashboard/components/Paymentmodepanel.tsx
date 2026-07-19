import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { HiOutlineCreditCard } from "react-icons/hi";

export interface PaymentModeData {
  cash: number;
  upi: number;
  bank: number;
}

interface Props {
  data: PaymentModeData;
}

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n ?? 0
  )}`;

const Paymentmodepanel: React.FC<Props> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);

    const modes = [
      { name: "Cash", value: data.cash, color: "#059669" },
      { name: "UPI", value: data.upi, color: "#2563eb" },
      { name: "Bank", value: data.bank, color: "#7c3aed" },
    ];

    chart.setOption({
      grid: { left: 8, right: 24, top: 12, bottom: 8, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (p: any) => `${p[0].name}<br/><b>${inr(p[0].value)}</b>`,
      },
      xAxis: {
        type: "value",
        axisLabel: {
          formatter: (v: number) => (v >= 1000 ? `${v / 1000}k` : v),
          fontSize: 10,
          color: "#94a3b8",
        },
        splitLine: { lineStyle: { color: "#f1f5f9" } },
      },
      yAxis: {
        type: "category",
        data: modes.map((m) => m.name),
        axisLabel: { fontSize: 12, color: "#475569", fontWeight: 500 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: "bar",
          barWidth: 22,
          itemStyle: { borderRadius: [0, 6, 6, 0] },
          label: {
            show: true,
            position: "right",
            formatter: (p: any) => inr(p.value),
            fontSize: 11,
            color: "#475569",
            fontWeight: 600,
          },
          data: modes.map((m) => ({
            value: m.value,
            itemStyle: { color: m.color },
          })),
        },
      ],
    });

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, [data]);

  const total = data.cash + data.upi + data.bank;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <HiOutlineCreditCard size={16} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-slate-900">
            Payment Mode Breakdown
          </h3>
          <p className="text-[12px] text-slate-500">
            Today's collection · {inr(total)}
          </p>
        </div>
      </div>
      <div ref={ref} style={{ width: "100%", height: 180 }} />
    </div>
  );
};

export default Paymentmodepanel;
