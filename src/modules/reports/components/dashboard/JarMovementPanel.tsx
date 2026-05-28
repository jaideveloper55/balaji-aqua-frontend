import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { HiOutlineCube } from "react-icons/hi";
import { BASE_TOOLTIP } from "../../constants/Reports.constants";
import SectionCard from "../SectionCard";
import { JarBalance, JarMovement } from "../../types/Reports";


interface Props {
  movements: JarMovement[];
  balance: JarBalance;
}

const JarMovementPanel: React.FC<Props> = ({ movements, balance }) => {
  const option = useMemo<EChartsOption>(() => {
    const dates = movements.map((d) =>
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
        data: ["Issued", "Returned", "Damaged"],
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
          name: "Issued",
          type: "bar",
          stack: "total",
          data: movements.map((m) => m.issued),
          itemStyle: { color: "#3b82f6", borderRadius: [0, 0, 0, 0] },
          barWidth: 16,
        },
        {
          name: "Returned",
          type: "bar",
          stack: "total",
          data: movements.map((m) => m.returned),
          itemStyle: { color: "#22c55e", borderRadius: [0, 0, 0, 0] },
          barWidth: 16,
        },
        {
          name: "Damaged",
          type: "bar",
          stack: "total",
          data: movements.map((m) => m.damaged),
          itemStyle: { color: "#ef4444", borderRadius: [4, 4, 0, 0] },
          barWidth: 16,
        },
      ],
    };
  }, [movements]);

  return (
    <SectionCard
      title="Jar / Can Movement"
      subtitle="Daily issued, returned & damaged"
      icon={<HiOutlineCube size={16} />}
      iconBg="bg-gradient-to-br from-amber-50 to-amber-100"
      iconColor="text-amber-600"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
          <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
            With Customers
          </p>
          <p className="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5">
            {balance.withCustomers.toLocaleString()}
          </p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            In Plant
          </p>
          <p className="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5">
            {balance.inPlant.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
            Damaged
          </p>
          <p className="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5">
            {balance.damaged.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
            Lost / Missing
          </p>
          <p className="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5">
            {balance.lostMissing.toLocaleString()}
          </p>
        </div>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 280, width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </SectionCard>
  );
};

export default JarMovementPanel;
