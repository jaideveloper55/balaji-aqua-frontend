import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineCube, HiChevronRight } from "react-icons/hi";

export interface StockRow {
  id: string;
  name: string;
  sku: string;
  unit: string;
  stock: number;
  minStock: number;
}

interface Props {
  items: StockRow[];
}

const Stocklevelspanel: React.FC<Props> = ({ items }) => {
  const navigate = useNavigate();

  const statusFor = (s: StockRow) => {
    if (s.stock === 0)
      return {
        label: "Out",
        badge: "bg-rose-50 text-rose-600",
        bar: "#dc2626",
        pct: 0,
      };
    if (s.minStock && s.stock <= s.minStock)
      return {
        label: "Low stock",
        badge: "bg-amber-50 text-amber-600",
        bar: "#d97706",
        pct: Math.min(70, (s.stock / (s.minStock * 2)) * 100),
      };
    return {
      label: "In stock",
      badge: "bg-emerald-50 text-emerald-600",
      bar: "#059669",
      pct: 100,
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <HiOutlineCube size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-slate-900">
              Stock Levels
            </h3>
            <p className="text-[12px] text-slate-500">
              {items.length} products
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/inventory")}
          className="text-[12px] font-medium text-blue-600 hover:underline flex items-center gap-0.5"
        >
          Manage <HiChevronRight size={13} />
        </button>
      </div>

      <div className="space-y-3">
        {items.map((s) => {
          const st = statusFor(s);
          return (
            <div key={s.id}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-[13px] font-semibold text-slate-800">
                    {s.name}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-2">
                    {s.sku}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${st.badge}`}
                >
                  {st.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${st.pct}%`, background: st.bar }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 tabular-nums min-w-[52px] text-right">
                  {s.stock.toLocaleString("en-IN")} {s.unit.toLowerCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stocklevelspanel;
