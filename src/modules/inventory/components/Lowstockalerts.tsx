// src/modules/inventory/components/Lowstockalerts.tsx
import { Tooltip } from "antd";
import { HiOutlineArrowDown, HiOutlineCheckCircle } from "react-icons/hi";
import type { LowStockRow } from "../api/inventory.api";
import { STOCK_STATUS_CONFIG } from "../constants/Inventoryconstants";

interface LowstockalertsProps {
  // Takes the backend's pre-computed alert rows (not the full list)
  items: LowStockRow[];
  /** One-click restock → opens StockEntryModal in stock_in mode, prefilled */
  onRestock: (item: LowStockRow) => void;
}

const ALERT_PRIORITY = {
  critical: {
    label: "Critical — out of stock",
    color: "#dc2626",
    bg: "#fef2f2",
  },
  warning: {
    label: "Warning — below reorder level",
    color: "#d97706",
    bg: "#fffbeb",
  },
};

const Lowstockalerts = ({ items, onRestock }: LowstockalertsProps) => {
  // Backend already filtered to low/out and added critical/deficit.
  // We only sort for display: critical first, then biggest shortfall.
  const alerts = [...items].sort((a, b) =>
    a.critical === b.critical ? a.deficit - b.deficit : a.critical ? -1 : 1
  );

  if (alerts.length === 0) {
    return (
      <div className="py-14 flex flex-col items-center gap-3 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
          <HiOutlineCheckCircle size={30} />
        </div>
        <p className="text-sm font-bold text-slate-700">
          All stock levels are healthy
        </p>
        <p className="text-xs text-slate-400 max-w-xs">
          Nothing is at or below its reorder level. Alerts will appear here
          automatically when stock runs low.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {alerts.map((item) => {
        const priority = item.critical ? "critical" : "warning";
        const pCfg = ALERT_PRIORITY[priority];
        const sCfg = STOCK_STATUS_CONFIG[item.status];
        const pct =
          item.reorderLevel > 0
            ? Math.min(
                Math.round((item.current / item.reorderLevel) * 100),
                100
              )
            : 0;

        return (
          <div
            key={item.id}
            className="flex flex-wrap items-center gap-4 py-4 first:pt-1 last:pb-1"
          >
            <Tooltip title={pCfg.label}>
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[15px] font-black shrink-0"
                style={{ background: pCfg.bg, color: pCfg.color }}
              >
                !
              </span>
            </Tooltip>

            <div className="min-w-[180px] flex-1">
              <p className="text-[13px] font-semibold text-slate-800">
                {item.name}
              </p>
              <p className="text-[11px] text-slate-400">
                <span className="font-mono">{item.sku}</span>
                <span className="mx-1.5">·</span>
                {item.category ?? "—"}
              </p>
            </div>

            <div className="w-44">
              {item.current <= 0 ? (
                <span
                  className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold"
                  style={{ background: sCfg.bg, color: sCfg.color }}
                >
                  OUT OF STOCK
                </span>
              ) : (
                <p
                  className="text-[14px] font-bold tabular-nums"
                  style={{ color: sCfg.color }}
                >
                  {item.current}
                  <span className="text-slate-300 font-medium text-[12px]">
                    {" "}
                    / {item.reorderLevel}
                  </span>
                </p>
              )}
              <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: sCfg.color }}
                />
              </div>
            </div>

            <div className="w-20 text-right">
              <span className="inline-block px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[13px] font-bold tabular-nums">
                {item.deficit}
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                vs reorder · {item.unit}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onRestock(item)}
              className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold
                text-emerald-700 bg-emerald-50 border border-emerald-200
                hover:bg-emerald-600 hover:text-white hover:border-emerald-600
                transition-colors"
            >
              <HiOutlineArrowDown size={14} />
              Restock
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Lowstockalerts;
