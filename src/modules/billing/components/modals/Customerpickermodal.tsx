import React, { useState } from "react";
import { Spin, Tag, Input } from "antd";
import {
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineChevronRight,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";

import { useCustomerSearch } from "../hooks/useCustomerSearch";
import {
  formatCurrency,
  getCustomerTypeColor,
  getInitials,
} from "../../utils/Helpers";
import { Customer } from "../../types/billing";
import CustomModal from "../../../../components/common/CustomModal";

interface Props {
  open: boolean;
  onSelect: (c: Customer) => void;
  onClose: () => void;
  onOpenQuickAdd: () => void;
}

const CustomerPickerModal: React.FC<Props> = ({ open, onSelect, onClose }) => {
  const [search, setSearch] = useState("");

  const { customers, loading, error, total, hasMore, loadMore } =
    useCustomerSearch(search);

  const handleClose = () => {
    setSearch("");
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      title="Select Customer"
      subtitle={
        !loading && total > 0
          ? `${total} customer${total !== 1 ? "s" : ""} available`
          : "Search by name, phone, or ID"
      }
      icon={<HiOutlineSearch className="w-5 h-5" />}
      iconTone="green"
      size="lg"
      showCloseButton
      closeOnOverlayClick
      closeOnEsc
    >
      <div className="mb-4">
        <Input
          autoFocus
          size="large"
          placeholder="Search by name, ID, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefix={<HiOutlineSearch className="w-4 h-4 text-slate-400" />}
          suffix={
            search ? (
              <button
                onClick={() => setSearch("")}
                className="flex items-center justify-center"
              >
                <HiOutlineX className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors" />
              </button>
            ) : null
          }
          className="!rounded-xl"
        />
      </div>

      <div
        className="overflow-y-auto space-y-1.5 pr-0.5"
        style={{ maxHeight: "380px" }}
      >
        {/* Loading skeleton */}
        {loading && customers.length === 0 && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center gap-3 p-3 rounded-xl border border-slate-100"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-36" />
                  <div className="h-2.5 bg-slate-100 rounded w-52" />
                </div>
                <div className="h-3 bg-slate-100 rounded w-14" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center py-10 text-center">
            <HiOutlineExclamationCircle className="w-9 h-9 text-rose-400 mb-2" />
            <p className="text-[13px] font-semibold text-slate-700">
              Failed to load customers
            </p>
            <p className="text-[12px] text-slate-400 mt-1">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && customers.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
              <HiOutlineSearch className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-[13px] font-semibold text-slate-700">
              {search ? `No results for "${search}"` : "No customers yet"}
            </p>
            <p className="text-[12px] text-slate-400 mt-1">
              {search
                ? "Try a different name, phone, or ID"
                : "Use the button above to add your first customer"}
            </p>
          </div>
        )}

        {/* Customer rows */}
        {customers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => onSelect(customer)}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100
              hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer
              transition-all group"
          >
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-100
              flex items-center justify-center font-bold text-[12px]
              text-slate-600 group-hover:text-emerald-700 transition-colors shrink-0"
            >
              {getInitials(customer.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[13px] text-slate-800 truncate">
                  {customer.name}
                </span>
                <Tag
                  color={getCustomerTypeColor(customer.type)}
                  className="text-[10px] m-0 border-0"
                >
                  {customer.type}
                </Tag>
                {customer.pricing.length > 0 && (
                  <span className="text-[10px] flex items-center gap-0.5 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    <HiSparkles className="w-3 h-3" /> Special Rate
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                <span>{customer.customerId}</span>
                <span>·</span>
                <span>{customer.phone}</span>
              </div>
            </div>

            {/* Outstanding */}
            <div className="text-right shrink-0">
              {customer.outstanding > 0 ? (
                <span className="text-[11px] font-semibold text-rose-500">
                  {formatCurrency(customer.outstanding)}
                </span>
              ) : (
                <span className="text-[11px] font-medium text-emerald-500">
                  No dues
                </span>
              )}
            </div>

            {/* Arrow */}
            <HiOutlineChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
          </div>
        ))}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="pt-2 pb-1 text-center">
            <button
              onClick={loadMore}
              className="text-[12px] text-emerald-700 font-medium hover:underline"
            >
              Load more customers
            </button>
          </div>
        )}

        {/* Loading more spinner */}
        {loading && customers.length > 0 && (
          <div className="flex justify-center py-3">
            <Spin size="small" />
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default CustomerPickerModal;
