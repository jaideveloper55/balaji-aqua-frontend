import React, { useState, useCallback } from "react";
import { Button, Tooltip } from "antd";
import { HiOutlineUserAdd, HiOutlineDownload } from "react-icons/hi";
import CustomerTable from "./Customertable";
import CustomerModal from "./Customermodal";
import CustomerStatCard from "./CustomerStatCard";
import { CUSTOMER_STAT_CONFIG } from "../constants/customerConstants";
import { useCustomers } from "../hooks/useCustomers";
import type { Customer } from "../types/Customer";

interface CustomerListProps {
  onNavigateToDetail?: (id: string) => void;
  onEditCustomer?: (id: string) => void;
}

const EMPTY_STATS = {
  total: 0,
  totalOutstanding: 0,
  customersWithDues: 0,
  newThisMonth: 0,
};

const CustomerList: React.FC<CustomerListProps> = ({
  onNavigateToDetail,
  onEditCustomer,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);

  const { data, isLoading } = useCustomers({ limit: 10, page: 1 });

  // Merge: defaults first, then whatever the API sent.
  // Missing keys stay 0; extra/old keys are ignored harmlessly.
  const stats = {
    ...EMPTY_STATS,
    ...((data?.stats as Partial<typeof EMPTY_STATS>) ?? {}),
  };

  const handleCreateSuccess = useCallback(
    (id: string) => {
      setModalOpen(false);
      onNavigateToDetail?.(id);
    },
    [onNavigateToDetail]
  );

  const handleView = useCallback(
    (c: { id: string }) => onNavigateToDetail?.(c.id),
    [onNavigateToDetail]
  );

  const handleEdit = useCallback(
    (c: Customer) => {
      onEditCustomer?.(c.id);
    },
    [onEditCustomer]
  );

  const handleEditSuccess = useCallback(() => {
    setEditTarget(null);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const closeEditModal = useCallback(() => setEditTarget(null), []);

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

      {/* Stats — money-focused KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CUSTOMER_STAT_CONFIG.map((s) => {
          const rawValue = stats[s.key as keyof typeof stats] ?? 0;
          const isAlert =
            "alertWhenPositive" in s &&
            (s as any).alertWhenPositive &&
            rawValue > 0;

          return (
            <CustomerStatCard
              key={s.key}
              icon={s.icon}
              label={s.label}
              value={isLoading ? "—" : rawValue}
              color={s.color}
              bg={s.bg}
              tooltip={s.tooltip}
              format={(s as any).format ?? "number"}
              alert={isAlert}
            />
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 p-5">
        <CustomerTable onView={handleView} onEdit={handleEdit} />
      </div>

      {/* CREATE modal */}
      <CustomerModal
        open={modalOpen}
        onClose={closeModal}
        onSuccess={handleCreateSuccess}
      />

      {/* EDIT modal — same component, different mode */}
      <CustomerModal
        open={!!editTarget}
        onClose={closeEditModal}
        customer={editTarget ?? undefined}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default CustomerList;
