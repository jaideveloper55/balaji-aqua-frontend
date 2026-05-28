import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { HiOutlineCash } from "react-icons/hi";
import { BASE_TOOLTIP } from "../../constants/Reports.constants";
import { FinancialBreakdown } from "../../types/Reports";
import { formatINR } from "../../utils/format";
import SectionCard from "../SectionCard";


interface Props {
  income: FinancialBreakdown[];
  expense: FinancialBreakdown[];
}

const FinancialBreakdownPanel: React.FC<Props> = ({ income, expense }) => {
  const totalIncome = income.reduce((s, d) => s + d.amount, 0);
  const totalExpense = expense.reduce((s, d) => s + d.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  const option = useMemo<EChartsOption>(() => {
    const incomeTop = income.slice(0, 5);
    const expenseTop = expense.slice(0, 5);
    const categories = [
      ...incomeTop.map((d) => d.category),
      ...expenseTop.map((d) => d.category),
    ];

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        ...BASE_TOOLTIP,
        valueFormatter: (v: any) => formatINR(v),
      },
      legend: {
        data: ["Income", "Expense"],
        top: 0,
        icon: "circle",
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 11, color: "#64748b", fontWeight: 500 },
      },
      grid: { left: 10, right: 30, top: 30, bottom: 10, containLabel: true },
      xAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          fontSize: 11,
          color: "#94a3b8",
          formatter: (v: number) =>
            v >= 100000
              ? `${(v / 100000).toFixed(0)}L`
              : v >= 1000
              ? `${v / 1000}k`
              : v.toString(),
        },
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
      },
      yAxis: {
        type: "category",
        data: categories,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 12, color: "#475569", fontWeight: 500 },
      },
      series: [
        {
          name: "Income",
          type: "bar",
          stack: "a",
          data: [...incomeTop.map((d) => d.amount), ...expenseTop.map(() => 0)],
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: "#22c55e" },
                { offset: 1, color: "#4ade80" },
              ],
            },
            borderRadius: [0, 6, 6, 0],
          },
          barWidth: 20,
        },
        {
          name: "Expense",
          type: "bar",
          stack: "b",
          data: [...incomeTop.map(() => 0), ...expenseTop.map((d) => d.amount)],
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: "#ef4444" },
                { offset: 1, color: "#f87171" },
              ],
            },
            borderRadius: [0, 6, 6, 0],
          },
          barWidth: 20,
        },
      ],
    };
  }, [income, expense]);

  return (
    <SectionCard
      title="Income vs Expense"
      subtitle="Top 5 categories per side"
      icon={<HiOutlineCash size={16} />}
      iconBg="bg-gradient-to-br from-amber-50 to-amber-100"
      iconColor="text-amber-600"
    >
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 text-white shadow-md shadow-emerald-500/20">
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
            Income
          </p>
          <p className="text-2xl font-extrabold tabular-nums mt-1">
            {formatINR(totalIncome, true)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white shadow-md shadow-red-500/20">
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
            Expense
          </p>
          <p className="text-2xl font-extrabold tabular-nums mt-1">
            {formatINR(totalExpense, true)}
          </p>
        </div>
      </div>

      <div
        className={`rounded-xl p-4 border-2 mb-5 ${
          netProfit >= 0
            ? "bg-blue-50 border-blue-200"
            : "bg-orange-50 border-orange-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Net {netProfit >= 0 ? "Profit" : "Loss"}
            </p>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
              {formatINR(Math.abs(netProfit), true)}
            </p>
          </div>
          <div
            className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
              netProfit >= 0
                ? "bg-blue-100 text-blue-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {margin.toFixed(1)}%
          </div>
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

export default FinancialBreakdownPanel;
