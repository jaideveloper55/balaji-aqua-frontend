import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineArrowSmRight,
  HiOutlineDocumentReport,
  HiOutlineCash,
} from "react-icons/hi";
import { RiRouteLine } from "react-icons/ri";

interface QuickAction {
  label: string;
  count: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  iconColor: string;
  path: string;
}

const ACTIONS: QuickAction[] = [
  {
    label: "Manage Customers",
    count: "348 active",
    icon: <HiOutlineUsers size={20} />,
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    path: "/admin/customers",
  },
  {
    label: "Delivery Routes",
    count: "12 active",
    icon: <RiRouteLine size={20} />,
    gradient: "from-blue-500 to-cyan-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    path: "/admin/delivery",
  },
  {
    label: "Product Inventory",
    count: "24 products",
    icon: <HiOutlineCube size={20} />,
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    path: "/admin/inventory",
  },
  {
    label: "Can Tracking",
    count: "1,240 cans",
    icon: <HiOutlineCube size={20} />,
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    path: "/admin/jar-tracking",
  },
  {
    label: "Reports",
    count: "Analytics hub",
    icon: <HiOutlineDocumentReport size={20} />,
    gradient: "from-indigo-500 to-blue-600",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    path: "/admin/reports",
  },
  {
    label: "Billing & POS",
    count: "Quick checkout",
    icon: <HiOutlineCash size={20} />,
    gradient: "from-rose-500 to-pink-600",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    path: "/admin/billing-pos",
  },
];

const QuickActionsFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {ACTIONS.map((link) => (
          <button
            key={link.label}
            onClick={() => navigate(link.path)}
            className="group relative flex items-center gap-3 bg-white rounded-2xl border border-slate-100 p-3 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-slate-200 overflow-hidden"
          >
            <div
              className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${link.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
            />
            <div
              className={`w-10 h-10 rounded-xl ${link.iconBg} ${link.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
            >
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-slate-800 leading-tight truncate">
                {link.label}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                {link.count}
              </p>
            </div>
            <HiOutlineArrowSmRight
              size={14}
              className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all shrink-0"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsFooter;
