import React from "react";
import {
  HiOutlineCurrencyRupee,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineCash,
  HiOutlineTruck,
  HiOutlineCube,
} from "react-icons/hi";
import { ReportsKPIs } from "../../types/Reports";
import { formatValue, calcChange } from "../../utils/format";
import StatCard from "../StatCard";

const ReportsKPICards: React.FC<{ data: ReportsKPIs }> = ({ data }) => {
  const cards = [
    {
      key: "revenue",
      icon: <HiOutlineCurrencyRupee size={22} />,
      label: "Total Revenue",
      value: formatValue(data.revenue.current, "currency"),
      change: {
        value: Number(
          Math.abs(calcChange(data.revenue.current, data.revenue.prev)).toFixed(
            1
          )
        ),
        isUp: data.revenue.current >= data.revenue.prev,
      },
      gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      iconColor: "text-emerald-600",
      sparkColor: "#22c55e",
      spark: data.revenue.spark,
      tooltip: "Revenue this period (Billing + Events)",
      sublabel: "Period total",
    },
    {
      key: "orders",
      icon: <HiOutlineShoppingBag size={22} />,
      label: "Total Orders",
      value: formatValue(data.orders.current, "number"),
      change: {
        value: Number(
          Math.abs(calcChange(data.orders.current, data.orders.prev)).toFixed(1)
        ),
        isUp: data.orders.current >= data.orders.prev,
      },
      gradient: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      sparkColor: "#3b82f6",
      spark: data.orders.spark,
      tooltip: "All orders this period",
      sublabel: "All channels",
    },
    {
      key: "customers",
      icon: <HiOutlineUsers size={22} />,
      label: "Active Customers",
      value: formatValue(data.customers.current, "number"),
      change: {
        value: Number(
          Math.abs(
            calcChange(data.customers.current, data.customers.prev)
          ).toFixed(1)
        ),
        isUp: data.customers.current >= data.customers.prev,
      },
      gradient: "bg-gradient-to-br from-violet-50 to-violet-100",
      iconColor: "text-violet-600",
      sparkColor: "#8b5cf6",
      spark: data.customers.spark,
      tooltip: "Customers who placed orders",
      sublabel: "Engaged this period",
    },
    {
      key: "profit",
      icon: <HiOutlineCash size={22} />,
      label: "Net Profit",
      value: formatValue(data.profit.current, "currency"),
      change: {
        value: Number(
          Math.abs(calcChange(data.profit.current, data.profit.prev)).toFixed(1)
        ),
        isUp: data.profit.current >= data.profit.prev,
      },
      gradient: "bg-gradient-to-br from-amber-50 to-amber-100",
      iconColor: "text-amber-600",
      sparkColor: "#f59e0b",
      spark: data.profit.spark,
      tooltip: "Revenue minus all expenses",
      sublabel: "After expenses",
    },
    {
      key: "deliveries",
      icon: <HiOutlineTruck size={22} />,
      label: "Deliveries",
      value: formatValue(data.deliveries.current, "number"),
      change: {
        value: Number(
          Math.abs(
            calcChange(data.deliveries.current, data.deliveries.prev)
          ).toFixed(1)
        ),
        isUp: data.deliveries.current >= data.deliveries.prev,
      },
      gradient: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      iconColor: "text-cyan-600",
      sparkColor: "#06b6d4",
      spark: data.deliveries.spark,
      tooltip: "Total deliveries this period",
      sublabel: "Across all routes",
    },
    {
      key: "jars",
      icon: <HiOutlineCube size={22} />,
      label: "Cans / Jars",
      value: formatValue(data.jarBalance.current, "number"),
      change: {
        value: Number(
          Math.abs(
            calcChange(data.jarBalance.current, data.jarBalance.prev)
          ).toFixed(1)
        ),
        isUp: data.jarBalance.current >= data.jarBalance.prev,
      },
      gradient: "bg-gradient-to-br from-pink-50 to-pink-100",
      iconColor: "text-pink-600",
      sparkColor: "#ec4899",
      spark: data.jarBalance.spark,
      tooltip: "Total cans in circulation",
      sublabel: "With customers + plant",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map(({ key, ...rest }) => (
        <StatCard key={key} {...rest} />
      ))}
    </div>
  );
};

export default ReportsKPICards;
