import React from "react";
import { Tooltip } from "antd";

interface ChartDataPoint {
  date: string;
  issued: number;
  returned: number;
}

interface InventoryChartProps {
  data: ChartDataPoint[];
}

const InventoryChart: React.FC<InventoryChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.flatMap((d) => [d.issued, d.returned]));

  const totalIssued = data.reduce((sum, d) => sum + d.issued, 0);
  const totalReturned = data.reduce((sum, d) => sum + d.returned, 0);
  const netFlow = totalIssued - totalReturned;
  const returnRate =
    totalIssued > 0 ? Math.round((totalReturned / totalIssued) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Summary row */}
      <div className="flex items-center gap-5 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span className="text-[11px] text-slate-400 font-medium">Issued</span>
          <span className="text-[14px] font-bold text-slate-700 tabular-nums">
            {totalIssued}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-[11px] text-slate-400 font-medium">
            Returned
          </span>
          <span className="text-[14px] font-bold text-slate-700 tabular-nums">
            {totalReturned}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Tooltip title="Return rate across all days shown">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 border border-slate-100 tabular-nums">
              {returnRate}% return rate
            </span>
          </Tooltip>
          <Tooltip
            title={
              netFlow > 0
                ? `${netFlow} more cans issued than returned`
                : `${Math.abs(netFlow)} more cans returned than issued`
            }
          >
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg tabular-nums ${
                netFlow > 0
                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}
            >
              Net: {netFlow > 0 ? "+" : ""}
              {netFlow} cans
            </span>
          </Tooltip>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-48">
        {data.map((point) => {
          const dayNet = point.issued - point.returned;
          return (
            <div
              key={point.date}
              className="flex-1 flex flex-col items-center gap-1.5"
            >
              <div className="flex items-end gap-1 h-40 w-full justify-center">
                {/* Issued bar */}
                <Tooltip title={`Issued: ${point.issued} cans`} placement="top">
                  <div
                    className="w-5 bg-blue-500 rounded-t-md transition-all duration-500 hover:bg-blue-600 cursor-default"
                    style={{
                      height: `${
                        maxValue > 0 ? (point.issued / maxValue) * 100 : 0
                      }%`,
                      minHeight: 4,
                    }}
                  />
                </Tooltip>
                {/* Returned bar */}
                <Tooltip
                  title={`Returned: ${point.returned} cans`}
                  placement="top"
                >
                  <div
                    className="w-5 bg-emerald-500 rounded-t-md transition-all duration-500 hover:bg-emerald-600 cursor-default"
                    style={{
                      height: `${
                        maxValue > 0 ? (point.returned / maxValue) * 100 : 0
                      }%`,
                      minHeight: 4,
                    }}
                  />
                </Tooltip>
              </div>
              {/* Day label + net indicator */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-medium tabular-nums">
                  {point.date}
                </span>
                {dayNet !== 0 && (
                  <span
                    className={`text-[8px] font-bold tabular-nums mt-0.5 ${
                      dayNet > 0 ? "text-amber-500" : "text-emerald-500"
                    }`}
                  >
                    {dayNet > 0 ? "+" : ""}
                    {dayNet}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryChart;
