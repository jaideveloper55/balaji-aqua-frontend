import React from "react";
import {
  HiOutlineUser,
  HiOutlineCurrencyRupee,
  HiOutlineDocumentText,
} from "react-icons/hi";

export type CustomerTabKey = "overview" | "pricing" | "ledger";

const TABS: { key: CustomerTabKey; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Overview", icon: <HiOutlineUser size={15} /> },
  {
    key: "pricing",
    label: "Pricing",
    icon: <HiOutlineCurrencyRupee size={15} />,
  },
  { key: "ledger", label: "Ledger", icon: <HiOutlineDocumentText size={15} /> },
];

interface CustomerTabsProps {
  activeTab: CustomerTabKey;
  onChange: (key: CustomerTabKey) => void;
}

const CustomerTabs: React.FC<CustomerTabsProps> = ({ activeTab, onChange }) => (
  <div className="flex border-b border-slate-200">
    {TABS.map((tab) => {
      const active = tab.key === activeTab;
      return (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 -mb-px ${
            active
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default CustomerTabs;
