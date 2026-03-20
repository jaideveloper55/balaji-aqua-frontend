import React from "react";
import clsx from "clsx";

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomTabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  accentColor?: string;
  className?: string;
}

const CustomTabs: React.FC<CustomTabsProps> = ({
  items,
  activeKey,
  onChange,
  accentColor = "#2563eb", // default blue
  className = "",
}) => {
  const activeIndex = items.findIndex((t) => t.key === activeKey);

  return (
    <div
      className={clsx("relative flex bg-slate-100 rounded-xl p-1", className)}
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm transition-all duration-300"
        style={{
          width: `calc(${100 / items.length}% - 8px)`,
          transform: `translateX(calc(${activeIndex * 100}% + 4px))`,
        }}
      />

      {items.map((tab) => {
        const isActive = tab.key === activeKey;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={clsx(
              "relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors duration-200",
              isActive ? "" : "text-slate-500 hover:text-slate-700",
            )}
            style={{
              color: isActive ? accentColor : undefined,
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default CustomTabs;
