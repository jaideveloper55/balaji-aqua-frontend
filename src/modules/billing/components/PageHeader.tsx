import React from "react";
import { Tooltip } from "antd";
import { HiOutlineCalendar, HiOutlineCash, HiOutlineKey } from "react-icons/hi";
import { HiReceiptPercent } from "react-icons/hi2";

import { formatCurrency } from "../utils/Helpers";
import { TabDef, TabKey } from "../types/billing";

interface Props {
  tabs: TabDef[];
  activeTab: TabKey;
  onTabChange: (k: TabKey) => void;
  today: string;
  todayTotal: number;
}

const PageHeader: React.FC<Props> = ({
  tabs,
  activeTab,
  onTabChange,
  today,
  todayTotal,
}) => (
  <div className="bg-white border shadow-sm rounded-md border-gray-100 px-6 py-4">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <HiReceiptPercent className="w-5 h-5 text-green-600" />
          Billing & POS
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Balaji Aqua Water Plant — ERP Dashboard
        </p>
      </div>
      <div className="hidden lg:flex items-center gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <HiOutlineCalendar className="w-3.5 h-3.5" />
          <span>{today}</span>
        </div>
        <div className="h-3.5 w-px bg-gray-200" />
        <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
          <HiOutlineCash className="w-3.5 h-3.5" />
          <span>{formatCurrency(todayTotal)} today</span>
        </div>
        <div className="h-3.5 w-px bg-gray-200" />
        <Tooltip title="Keyboard shortcuts: F2=Customer, F3=Search, F9=Pay">
          <div className="flex items-center gap-1 text-gray-400 hover:text-gray-600 cursor-help">
            <HiOutlineKey className="w-3.5 h-3.5" />
            <span className="text-[11px]">Shortcuts</span>
          </div>
        </Tooltip>
      </div>
    </div>

    <div className="flex items-center gap-1 mt-4 -mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-[13px] font-medium border-b-2 transition-all whitespace-nowrap
            ${
              activeTab === tab.key
                ? "border-green-500 text-green-700 bg-green-50/50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
        >
          {tab.icon}
          {tab.label}
          {tab.badge && tab.badge > 0 && (
            <span
              className={`min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1
              ${
                activeTab === tab.key
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  </div>
);

export default PageHeader;
