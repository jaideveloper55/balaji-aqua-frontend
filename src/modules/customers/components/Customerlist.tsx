import React, { useState, useEffect, useCallback } from "react";
import { Button, Tooltip } from "antd";
import { HiOutlineUserAdd, HiOutlineDownload } from "react-icons/hi";
import CustomerTable from "./Customertable";
import CustomerModal from "./Customermodal";
import CustomerStatCard from "./CustomerStatCard";
import { customerApi } from "../services/Customer.api";
import { CUSTOMER_STAT_CONFIG } from "../constants/customerConstants";

interface CustomerStats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

interface CustomerListProps {
  onNavigateToDetail?: (id: string) => void;
}

const INITIAL_STATS: CustomerStats = {
  total: 0,
  active: 0,
  pending: 0,
  inactive: 0,
};

const CustomerList: React.FC<CustomerListProps> = ({ onNavigateToDetail }) => {
  const [stats, setStats] = useState<CustomerStats>(INITIAL_STATS);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadStats = useCallback(async () => {
    try {
      // TODO: replace with a dedicated stats endpoint when available
      const res = await customerApi.getCustomers({ pageSize: 100 });
      const customers = res.data;
      setStats({
        total: customers.length,
        active: customers.filter((c) => c.status === "active").length,
        pending: customers.filter((c) => c.status === "pending").length,
        inactive: customers.filter((c) => c.status === "inactive").length,
      });
    } catch (err) {
      console.error("Failed to load customer stats:", err);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats, refreshKey]);

  const handleCreateSuccess = useCallback(
    (id: string) => {
      setModalOpen(false);
      setRefreshKey((k) => k + 1);
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
            value={stats[s.key]}
            color={s.color}
            bg={s.bg}
            tooltip={s.tooltip}
          />
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 p-5">
        <CustomerTable
          key={refreshKey}
          onView={handleView}
          onEdit={handleView}
        />
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
