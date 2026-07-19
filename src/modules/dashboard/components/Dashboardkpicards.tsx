import React from "react";
import {
  HiOutlineCurrencyRupee,
  HiOutlineUsers,
  HiOutlineExclamationCircle,
  HiOutlineCube,
  HiOutlineReceiptTax,
  HiOutlineTrendingUp,
} from "react-icons/hi";

export interface DashboardKPIs {
  totalCustomers: number;
  newThisMonth: number;
  totalOutstanding: number;
  customersWithDues: number;
  todayCollection: number;
  todayInvoices: number;
  totalBilled: number;
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
}

interface Props {
  data: DashboardKPIs;
}

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n ?? 0
  )}`;

interface CardDef {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  alert?: boolean;
}

const Dashboardkpicards: React.FC<Props> = ({ data }) => {
  const cards: CardDef[] = [
    {
      label: "Today's Collection",
      value: inr(data.todayCollection),
      sub: `${data.todayInvoices} invoice${
        data.todayInvoices === 1 ? "" : "s"
      } today`,
      icon: <HiOutlineCurrencyRupee size={20} />,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      label: "Total Customers",
      value: String(data.totalCustomers),
      sub: `+${data.newThisMonth} new this month`,
      icon: <HiOutlineUsers size={20} />,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Total Outstanding",
      value: inr(data.totalOutstanding),
      sub: `${data.customersWithDues} customers with dues`,
      icon: <HiOutlineExclamationCircle size={20} />,
      color: "#d97706",
      bg: "#fffbeb",
      alert: data.totalOutstanding > 0,
    },
    {
      label: "Products",
      value: String(data.totalProducts),
      sub:
        data.lowStockCount > 0
          ? `${data.lowStockCount} low stock`
          : "All in stock",
      icon: <HiOutlineCube size={20} />,
      color: data.lowStockCount > 0 ? "#dc2626" : "#7c3aed",
      bg: data.lowStockCount > 0 ? "#fef2f2" : "#f5f3ff",
      alert: data.lowStockCount > 0,
    },
    {
      label: "Billed Today",
      value: inr(data.totalBilled),
      sub: `${data.todayInvoices} invoices generated`,
      icon: <HiOutlineReceiptTax size={20} />,
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      label: "Out of Stock",
      value: String(data.outOfStockCount),
      sub: data.outOfStockCount > 0 ? "Needs restocking" : "None — good to go",
      icon: <HiOutlineTrendingUp size={20} />,
      color: data.outOfStockCount > 0 ? "#dc2626" : "#059669",
      bg: data.outOfStockCount > 0 ? "#fef2f2" : "#ecfdf5",
      alert: data.outOfStockCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
            c.alert
              ? "border-rose-200/60 hover:shadow-rose-100/50"
              : "border-slate-200 hover:shadow-slate-200/50"
          }`}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[2.5px] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: c.color }}
          />
          <div className="px-4 py-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
              style={{ background: c.bg, color: c.color }}
            >
              {c.icon}
            </div>
            <p className="text-[22px] font-extrabold text-slate-800 tabular-nums leading-none tracking-tight">
              {c.value}
            </p>
            <p className="text-[11px] font-semibold text-slate-400 mt-1.5 uppercase tracking-wide">
              {c.label}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboardkpicards;
