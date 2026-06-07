import React, { useState, useCallback } from "react";
import CustomerTable from "./Customertable";
import CustomerModal from "./Customermodal";
import { CUSTOMER_STAT_CONFIG } from "../constants/customerConstants";
import { useCustomerStats } from "../hooks/useCustomerStats";
import type { Customer } from "../types/Customer";
import CustomStatCard from "../../../components/common/CustomStatCard";

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

  const { data: statsData, isLoading: statsLoading } = useCustomerStats();
  const stats: typeof EMPTY_STATS = {
    total: statsData?.total ?? EMPTY_STATS.total,
    totalOutstanding:
      statsData?.totalOutstanding ?? EMPTY_STATS.totalOutstanding,
    customersWithDues:
      statsData?.customersWithDues ?? EMPTY_STATS.customersWithDues,
    newThisMonth: statsData?.newThisMonth ?? EMPTY_STATS.newThisMonth,
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

  const closeModal = useCallback(() => setModalOpen(false), []);
  const closeEditModal = useCallback(() => setEditTarget(null), []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CUSTOMER_STAT_CONFIG.map((s) => {
          const rawValue = stats[s.key as keyof typeof stats] ?? 0;
          const isAlert =
            "alertWhenPositive" in s &&
            (s as any).alertWhenPositive &&
            rawValue > 0;

          const format = (s as any).format ?? "number";
          const displayValue = statsLoading
            ? "—"
            : format === "currency"
            ? new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(Number(rawValue))
            : rawValue;

          return (
            <CustomStatCard
              key={s.key}
              icon={s.icon}
              label={s.label}
              value={displayValue}
              color={s.color}
              bg={s.bg}
              tooltip={s.tooltip}
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
