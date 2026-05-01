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
  accentColor = "#2563eb",
  className = "",
}) => {
  const activeIndex = items.findIndex((t) => t.key === activeKey);

  return (
    <div
      className={clsx(
        // stronger track: deeper bg + visible inset border
        "relative flex bg-slate-200/70 rounded-xl p-1 ring-1 ring-slate-200 shadow-inner shadow-slate-200/50",
        className
      )}
      role="tablist"
    >
      {/* Sliding indicator — now with real shadow + ring for visibility */}
      <div
        className="absolute top-1 bottom-1 bg-white rounded-lg shadow-md shadow-slate-900/10 ring-1 ring-slate-200/80 transition-all duration-300 ease-out"
        style={{
          width: `calc(${100 / items.length}% - 8px)`,
          transform: `translateX(calc(${activeIndex * 100}% + 4px))`,
        }}
        aria-hidden
      />

      {items.map((tab) => {
        const isActive = tab.key === activeKey;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={clsx(
              "relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors duration-200",
              // Stronger inactive contrast + clearer hover
              isActive ? "font-bold" : "text-slate-600 hover:text-slate-900"
            )}
            style={{
              color: isActive ? accentColor : undefined,
            }}
          >
            {tab.icon && (
              <span
                className={clsx(
                  "transition-transform duration-200",
                  isActive && "scale-110"
                )}
              >
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default CustomTabs;
