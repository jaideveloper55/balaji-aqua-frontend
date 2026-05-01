import React, { useState, useCallback } from "react";
import { Button, Tooltip } from "antd";
import { HiOutlineUserAdd, HiOutlineDownload } from "react-icons/hi";
import CustomerTable from "./Customertable";
import CustomerModal from "./Customermodal";
import CustomerStatCard from "./CustomerStatCard";
import { CUSTOMER_STAT_CONFIG } from "../constants/customerConstants";
import { useCustomers } from "../hooks/useCustomers";

interface CustomerListProps {
  onNavigateToDetail?: (id: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onNavigateToDetail }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // ─── Server state via TanStack Query ────────────────────────────────────
  // Stats come pre-computed from the same /customers endpoint (saves a request)
  const { data, isLoading } = useCustomers({ limit: 10, page: 1 });

  const stats = data?.stats ?? {
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
  };

  // ─── Handlers ───────────────────────────────────────────────────────────
  const handleCreateSuccess = useCallback(
    (id: string) => {
      setModalOpen(false);
      // No refreshKey needed — useCreateCustomer invalidates the query automatically
      onNavigateToDetail?.(id);
    },
    [onNavigateToDetail]
  );

  const handleView = useCallback(
    (c: { id: string }) => onNavigateToDetail?.(c.id),
    [onNavigateToDetail]
  );

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">
            Customers
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your customer base and accounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            icon={<HiOutlineDownload size={15} />}
            className="!rounded-xl !h-9"
          >
            Export
          </Button>
          <Tooltip title="Add a new customer to your delivery network">
            <Button
              type="primary"
              icon={<HiOutlineUserAdd size={15} />}
              onClick={openModal}
              className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !h-9 !font-semibold !shadow-sm !shadow-blue-200"
            >
              Add Customer
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CUSTOMER_STAT_CONFIG.map((s) => (
          <CustomerStatCard
            key={s.key}
            icon={s.icon}
            label={s.label}
            value={isLoading ? 0 : stats[s.key as keyof typeof stats]}
            color={s.color}
            bg={s.bg}
            tooltip={s.tooltip}
          />
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 p-5">
        <CustomerTable onView={handleView} onEdit={handleView} />
      </div>

      <CustomerModal
        open={modalOpen}
        onClose={closeModal}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default CustomerList;
