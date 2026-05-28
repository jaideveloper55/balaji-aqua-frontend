import React from "react";
import { Tag, Tooltip } from "antd";
import {
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineLightningBolt,
  HiOutlineX,
  HiOutlinePhone,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineIdentification,
} from "react-icons/hi";
import { HiBolt, HiUserPlus, HiSparkles } from "react-icons/hi2";

import {
  formatCurrency,
  getCustomerTypeColor,
  getInitials,
} from "../../utils/Helpers";
import Field from "../Field";
import { Customer, CustomerMode } from "../../types/billing";

interface Props {
  selectedCustomer: Customer | null;
  customerMode: CustomerMode;
  walkInName: string;
  walkInPhone: string;
  onCustomerModeChange: (mode: CustomerMode) => void;
  onWalkInNameChange: (v: string) => void;
  onWalkInPhoneChange: (v: string) => void;
  onSetWalkIn: () => void;
  onClearCustomer: () => void;
  onOpenPicker: () => void;
  onOpenQuickAdd: () => void;
}

const ACCENT = {
  text: "text-emerald-700",
  bg: "bg-emerald-600",
  bgHover: "hover:bg-emerald-700",
  bgSoft: "bg-emerald-50",
  border: "border-emerald-200",
  borderHover: "hover:border-emerald-300",
  ring: "ring-emerald-100",
};

const CustomerBar: React.FC<Props> = ({
  selectedCustomer,
  customerMode,
  walkInName,
  walkInPhone,
  onCustomerModeChange,
  onWalkInNameChange,
  onWalkInPhoneChange,
  onSetWalkIn,
  onClearCustomer,
  onOpenPicker,
  onOpenQuickAdd,
}) => {
  if (selectedCustomer) {
    const hasOutstanding = selectedCustomer.outstanding > 0;
    const isWalkIn = selectedCustomer.isWalkIn;

    return (
      <div className="bg-white px-5 py-3.5 border-b border-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Avatar — neutral with subtle tint */}
            <div className="relative shrink-0">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm
                  ${
                    isWalkIn
                      ? "bg-slate-100 text-slate-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
              >
                {isWalkIn ? (
                  <HiOutlineLightningBolt className="w-5 h-5" />
                ) : (
                  getInitials(selectedCustomer.name)
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* Customer details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-900 text-[14px] truncate">
                  {selectedCustomer.name}
                </span>
                <Tag
                  color={getCustomerTypeColor(selectedCustomer.type)}
                  className="text-[10px] font-medium uppercase tracking-wide m-0 border-0"
                >
                  {selectedCustomer.type}
                </Tag>
                {selectedCustomer.pricing.length > 0 && (
                  <Tooltip
                    title={`${selectedCustomer.pricing.length} special price(s) applied`}
                  >
                    <span className="text-[10px] font-medium flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      <HiSparkles className="w-3 h-3" /> Special Rate
                    </span>
                  </Tooltip>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1 text-[12px] flex-wrap">
                <span className="flex items-center gap-1 text-slate-500">
                  <HiOutlineIdentification className="w-3.5 h-3.5" />
                  <span className="font-mono">
                    {selectedCustomer.customerId}
                  </span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <HiOutlinePhone className="w-3.5 h-3.5" />
                  {selectedCustomer.phone}
                </span>
                {hasOutstanding && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-rose-600 font-medium">
                      <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
                      Due {formatCurrency(selectedCustomer.outstanding)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Change button — minimal */}
          <button
            onClick={onClearCustomer}
            className="text-[12px] font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-all shrink-0"
            title="Change customer"
          >
            <HiOutlineX className="w-3.5 h-3.5" /> Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-5 py-4 border-b border-slate-200">
      <div className="space-y-3">
        {/* Section header — quiet but clear */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-slate-700">
            Select customer
            <span className="text-rose-500 ml-0.5">*</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Required to continue
          </span>
        </div>

        {/* Mode tabs — single accent color, minimal */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            {
              key: "existing" as const,
              label: "Existing",
              icon: <HiOutlineUser className="w-4 h-4" />,
            },
            {
              key: "walkin" as const,
              label: "Walk-in",
              icon: <HiBolt className="w-4 h-4" />,
            },
            {
              key: "new" as const,
              label: "New",
              icon: <HiUserPlus className="w-4 h-4" />,
            },
          ].map((m) => {
            const isActive = customerMode === m.key;
            return (
              <button
                key={m.key}
                onClick={() => onCustomerModeChange(m.key)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[13px] font-medium transition-all
                  ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <span className={isActive ? ACCENT.text : "text-slate-400"}>
                  {m.icon}
                </span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── EXISTING CUSTOMER ─── */}
        {customerMode === "existing" && (
          <button
            onClick={onOpenPicker}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white text-[13px] hover:border-emerald-300 hover:bg-emerald-50/40 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors shrink-0">
              <HiOutlineSearch className="w-4 h-4 text-slate-500 group-hover:text-emerald-700 transition-colors" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium text-slate-800">
                Search existing customer
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Search by name, phone, or ID
              </div>
            </div>
            <kbd className="hidden sm:inline-flex items-center text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-mono font-medium shrink-0">
              F2
            </kbd>
          </button>
        )}

        {/* ─── WALK-IN CUSTOMER ─── */}
        {customerMode === "walkin" && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <HiBolt className="w-4 h-4 text-slate-500" />
              <span className="text-[12px] font-semibold text-slate-700">
                Walk-in cash sale
              </span>
              <span className="text-[11px] text-slate-400">
                — no account needed
              </span>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1 min-w-0">
                <Field
                  label="Customer Name"
                  value={walkInName}
                  onChange={onWalkInNameChange}
                  placeholder="e.g. John (cash sale)"
                  required
                  size="middle"
                  icon={
                    <HiOutlineUser className="w-3.5 h-3.5 text-slate-400" />
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <Field
                  label="Phone (optional)"
                  value={walkInPhone}
                  onChange={onWalkInPhoneChange}
                  placeholder="+91 ..."
                  type="tel"
                  size="middle"
                  icon={
                    <HiOutlinePhone className="w-3.5 h-3.5 text-slate-400" />
                  }
                />
              </div>
              <button
                onClick={onSetWalkIn}
                disabled={!walkInName.trim()}
                className={`px-4 h-[36px] rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-all shrink-0
                  ${
                    !walkInName.trim()
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : `${ACCENT.bg} ${ACCENT.bgHover} text-white shadow-sm`
                  }`}
              >
                <HiOutlineCheckCircle className="w-4 h-4" />
                Confirm
              </button>
            </div>

            {!walkInName.trim() && (
              <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500">
                <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
                Enter customer name to continue
              </div>
            )}
          </div>
        )}

        {/* ─── NEW CUSTOMER ─── */}
        {customerMode === "new" && (
          <button
            onClick={onOpenQuickAdd}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white text-[13px] hover:border-emerald-300 hover:bg-emerald-50/40 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors shrink-0">
              <HiUserPlus className="w-4 h-4 text-slate-500 group-hover:text-emerald-700 transition-colors" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium text-slate-800">Add new customer</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Save details for future billing
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-500 group-hover:text-emerald-700 transition-colors shrink-0 flex items-center gap-1">
              Open form
              <span className="group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerBar;
