import { HiOutlineRefresh } from "react-icons/hi";
import { STATUS_TABS } from "../constants/Orderconstants";
import type { OrderCounts, OrderStatus } from "../types/Orders";

interface Props {
  active?: OrderStatus;
  counts?: OrderCounts;
  refreshing?: boolean;
  onChange: (status?: OrderStatus) => void;
  onRefresh: () => void;
}

const Orderstatustabs = ({
  active,
  counts,
  refreshing,
  onChange,
  onRefresh,
}: Props) => {
  const countOf = (key: "ALL" | OrderStatus) =>
    counts ? (key === "ALL" ? counts.all : counts[key]) : undefined;

  return (
    <div className="flex items-center justify-between gap-3">
      <div
        role="tablist"
        aria-label="Order status"
        className="flex items-center gap-1.5 overflow-x-auto"
      >
        {STATUS_TABS.map((t) => {
          const selected = (t.key === "ALL" && !active) || t.key === active;
          const count = countOf(t.key);
          return (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => onChange(t.key === "ALL" ? undefined : t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors
                ${
                  selected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              {t.label}
              <span
                className={`min-w-[22px] rounded-full px-1.5 py-0.5 text-center text-xs font-bold
                  ${
                    selected
                      ? "bg-white/25 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
              >
                {count ?? "–"}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        aria-label="Refresh orders"
      >
        <HiOutlineRefresh
          className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
        />
        <span className="hidden sm:inline">Refresh</span>
      </button>
    </div>
  );
};

export default Orderstatustabs;
