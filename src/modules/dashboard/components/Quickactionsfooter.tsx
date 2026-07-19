import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineReceiptTax,
  HiOutlineUserAdd,
  HiOutlineCube,
  HiOutlineChartBar,
  HiChevronRight,
} from "react-icons/hi";

const ACTIONS = [
  {
    label: "New Bill",
    sub: "Quick billing",
    icon: <HiOutlineReceiptTax size={18} />,
    color: "#059669",
    bg: "#ecfdf5",
    to: "/admin/billing-pos",
  },
  {
    label: "Add Customer",
    sub: "New account",
    icon: <HiOutlineUserAdd size={18} />,
    color: "#2563eb",
    bg: "#eff6ff",
    to: "/admin/customers",
  },
  {
    label: "Stock In",
    sub: "Update inventory",
    icon: <HiOutlineCube size={18} />,
    color: "#d97706",
    bg: "#fffbeb",
    to: "/admin/inventory",
  },
  {
    label: "View Products",
    sub: "Manage catalog",
    icon: <HiOutlineChartBar size={18} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    to: "/admin/products",
  },
];

const Quickactionsfooter: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
        Quick Actions
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.to)}
            className="group flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 hover:border-blue-300 transition-all text-left"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: a.bg, color: a.color }}
            >
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-800">
                {a.label}
              </p>
              <p className="text-[11px] text-slate-500">{a.sub}</p>
            </div>
            <HiChevronRight
              size={16}
              className="text-slate-300 group-hover:text-blue-400 transition-colors"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quickactionsfooter;
