import React from "react";
import { Modal, Tag, Empty } from "antd";
import {
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { HiUserPlus } from "react-icons/hi2";

import {
  formatCurrency,
  getCustomerTypeColor,
  getInitials,
} from "../../utils/Helpers";
import { Customer } from "../../types/billing";

interface Props {
  open: boolean;
  customers: Customer[];
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (c: Customer) => void;
  onClose: () => void;
  onOpenQuickAdd: () => void;
}

const CustomerPickerModal: React.FC<Props> = ({
  open,
  customers,
  search,
  onSearchChange,
  onSelect,
  onClose,
  onOpenQuickAdd,
}) => (
  <Modal
    open={open}
    onCancel={onClose}
    title={
      <div className="flex items-center gap-2">
        <HiOutlineUser className="w-5 h-5 text-emerald-600" />
        <span>Select Customer</span>
      </div>
    }
    footer={null}
    width={600}
  >
    <div className="relative mb-4">
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
      <input
        type="text"
        placeholder="Search by name, ID, or phone..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        autoFocus
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-[13px] placeholder:text-gray-300 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100"
      />
    </div>
    <button
      onClick={() => {
        onClose();
        onOpenQuickAdd();
      }}
      className="w-full mb-3 flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-emerald-200 text-emerald-600 text-[12px] font-medium hover:bg-emerald-50/30"
    >
      <HiUserPlus className="w-4 h-4" /> Quick Add New Customer
    </button>
    <div className="max-h-[380px] overflow-y-auto space-y-1.5">
      {customers.map((customer) => (
        <div
          key={customer.id}
          onClick={() => onSelect(customer)}
          className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs group-hover:bg-emerald-100 group-hover:text-emerald-700">
            {getInitials(customer.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[13px] text-gray-800">
                {customer.name}
              </span>
              <Tag
                color={getCustomerTypeColor(customer.type)}
                className="text-[10px]"
              >
                {customer.type}
              </Tag>
              {customer.pricing.length > 0 && (
                <Tag color="green" className="text-[10px]">
                  Special Rate
                </Tag>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
              <span>{customer.customerId}</span>
              <span>·</span>
              <span>{customer.phone}</span>
            </div>
          </div>
          <div className="text-right">
            {customer.outstanding > 0 ? (
              <div className="text-[11px] text-red-500 font-semibold">
                {formatCurrency(customer.outstanding)}
              </div>
            ) : (
              <div className="text-[11px] text-emerald-500 font-medium">
                No dues
              </div>
            )}
          </div>
          <HiOutlineChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500" />
        </div>
      ))}
      {customers.length === 0 && (
        <Empty
          description="No customers found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  </Modal>
);

export default CustomerPickerModal;
