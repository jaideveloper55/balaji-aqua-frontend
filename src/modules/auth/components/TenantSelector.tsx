import React, { useState, useEffect, useRef } from "react";
import { HiOutlineChevronDown, HiOutlineCheck } from "react-icons/hi";
import { TENANT_CONFIG, TENANT_LIST } from "../constants/constants";
import type { TenantId } from "../types/Auth";

// Brand logo icon (custom SVG — not available in react-icons)
const IconDroplet = ({
  size = 20,
  ...props
}: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  </svg>
);

export { IconDroplet };

interface TenantSelectorProps {
  value: TenantId;
  onChange: (id: TenantId) => void;
}

const TenantSelector: React.FC<TenantSelectorProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = TENANT_CONFIG[value];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs font-semibold tracking-wide block mb-1.5 text-slate-500">
        Company
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200"
        style={{
          border: `1.5px solid ${open ? selected.accent : "#e2e8f0"}`,
          boxShadow: open ? `0 0 0 3px ${selected.accent}10` : "none",
          background: open ? "#fff" : "#f8fafc",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(135deg, ${selected.gradientFrom}, ${selected.gradientTo})`,
          }}
        >
          <IconDroplet size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate leading-tight text-slate-800">
            {selected.name}
          </p>
          <p className="text-xs truncate mt-0.5 font-medium text-slate-400">
            {selected.tagline}
          </p>
        </div>
        <HiOutlineChevronDown
          size={15}
          className={`text-slate-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl overflow-hidden z-50 animate-dropIn border border-slate-100"
          style={{
            boxShadow:
              "0 20px 50px -10px rgba(15,23,42,0.15), 0 0 0 1px rgba(15,23,42,0.04)",
          }}
        >
          {TENANT_LIST.map((t) => {
            const tc = TENANT_CONFIG[t.id as TenantId];
            const isActive = t.id === value;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onChange(t.id as TenantId);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 ${
                  isActive ? "bg-slate-50" : "hover:bg-slate-50/50"
                }`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${tc.gradientFrom}, ${tc.gradientTo})`
                      : "#f1f5f9",
                  }}
                >
                  <IconDroplet
                    size={13}
                    style={{ color: isActive ? "white" : "#64748b" }}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-xs font-bold ${
                      isActive ? "text-slate-800" : "text-slate-600"
                    }`}
                  >
                    {t.name}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400">
                    {t.tagline}
                  </p>
                </div>
                {isActive && (
                  <HiOutlineCheck size={14} style={{ color: tc.accent }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TenantSelector;
