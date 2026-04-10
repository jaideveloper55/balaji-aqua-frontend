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
  <div className="flex items-center border-b border-slate-200 px-1 overflow-x-auto scrollbar-hide">
    {TABS.map((tab) => {
      const active = tab.key === activeTab;
      return (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative flex items-center gap-1.5 px-5 py-3.5 text-[13px] font-medium transition-colors whitespace-nowrap ${
            active ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {tab.icon}
          {tab.label}
          {active && (
            <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-blue-600 rounded-t" />
          )}
        </button>
      );
    })}
  </div>
);

export default CustomerTabs;
