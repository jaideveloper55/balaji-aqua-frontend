// src/modules/inventory/components/Inventoryoverview.tsx
import {
  HiOutlineCurrencyRupee,
  HiOutlineExclamation,
  HiOutlineXCircle,
  HiOutlineShieldExclamation,
  HiOutlineArrowDown,
  HiOutlineArrowUp,
} from "react-icons/hi";
import CustomStatCard from "../../../components/common/CustomStatCard";
import { InventoryKpis } from "../types/Inventory";
import { InventoryTabKey } from "../constants/Inventoryconstants";

interface InventoryoverviewProps {
  kpis: InventoryKpis;
  onNavigate: (tab: InventoryTabKey, statusFilter?: string) => void;
}

const formatINR = (v: number) =>
  `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const Inventoryoverview = ({ kpis, onNavigate }: InventoryoverviewProps) => {
  const cards = [
    {
      icon: <HiOutlineCurrencyRupee size={22} />,
      label: "Total Stock",
      value: formatINR(kpis.totalStockValue),
      color: "#2563eb",
      bg: "#eff6ff",
      tooltip: "Current stock × unit cost, all products",
      onClick: () => onNavigate("stock"),
    },
    {
      icon: <HiOutlineExclamation size={22} />,
      label: "Low Stock",
      value: kpis.lowStockItems,
      color: "#d97706",
      bg: "#fffbeb",
      alert: kpis.lowStockItems > 0,
      tooltip: "Items at or below reorder level — click to review",
      onClick: () => onNavigate("alerts"),
    },
    {
      icon: <HiOutlineXCircle size={22} />,
      label: "Out of Stock",
      value: kpis.outOfStockItems,
      color: "#dc2626",
      bg: "#fef2f2",
      alert: kpis.outOfStockItems > 0,
      tooltip: "Items with zero stock — click to review",
      onClick: () => onNavigate("alerts"),
    },
    {
      icon: <HiOutlineShieldExclamation size={22} />,
      label: "Damaged Items",
      value: kpis.damagedItems,
      color: "#ea580c",
      bg: "#fff7ed",
      tooltip: "Stock written off as damaged — see Movement History",
      onClick: () => onNavigate("movements"),
    },
    {
      icon: <HiOutlineArrowDown size={22} />,
      label: "Inward Today",
      value: `${kpis.inwardToday}`,
      color: "#059669",
      bg: "#ecfdf5",
      tooltip: "Units received today (production + purchase)",
      onClick: () => onNavigate("movements"),
    },
    {
      icon: <HiOutlineArrowUp size={22} />,
      label: "Outward Today",
      value: `${kpis.outwardToday}`,
      color: "#7c3aed",
      bg: "#f5f3ff",
      tooltip: "Units issued today (delivery + internal use)",
      onClick: () => onNavigate("movements"),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c) => (
        <button
          key={c.label}
          type="button"
          onClick={c.onClick}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded-2xl"
          aria-label={`${c.label}: ${c.value}`}
        >
          <CustomStatCard
            icon={c.icon}
            label={c.label}
            value={c.value}
            color={c.color}
            bg={c.bg}
            tooltip={c.tooltip}
            alert={c.alert}
          />
        </button>
      ))}
    </div>
  );
};

export default Inventoryoverview;
