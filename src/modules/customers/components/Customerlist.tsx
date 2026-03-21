import React, { useState, useEffect } from "react";
import { Button } from "antd";
import {
  HiOutlineUserAdd,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineBan,
  HiOutlineDownload,
} from "react-icons/hi";
import CustomerTable from "./Customertable";
import CustomerModal from "./Customermodal";
import { customerApi } from "../services/Customer.api";

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}> = ({ icon, label, value, color, bg }) => (
  <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: bg, color }}
    >
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black text-slate-800 tabular-nums leading-none">
        {value}
      </p>
      <p className="text-xs font-medium text-slate-400 mt-1">{label}</p>
    </div>
  </div>
);

interface CustomerListProps {
  onNavigateToDetail?: (id: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onNavigateToDetail }) => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadStats = () => {
    customerApi.getCustomers({ pageSize: 100 }).then((res) => {
      const c = res.data;
      setStats({
        total: c.length,
        active: c.filter((x) => x.status === "active").length,
        pending: c.filter((x) => x.status === "pending").length,
        inactive: c.filter((x) => x.status === "inactive").length,
      });
    });
  };

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const handleCreateSuccess = (id: string) => {
    setModalOpen(false);
    setRefreshKey((k) => k + 1);
    onNavigateToDetail?.(id);
  };

  return (
    <div className="flex flex-col gap-6  max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Customers
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your customer base and accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button icon={<HiOutlineDownload size={15} />} size="large">
            Export
          </Button>
          <Button
            type="primary"
            icon={<HiOutlineUserAdd size={15} />}
            size="large"
            onClick={() => setModalOpen(true)}
          >
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<HiOutlineUsers size={20} />}
          label="Total Customers"
          value={stats.total}
          color="#3b82f6"
          bg="#eff6ff"
        />
        <StatCard
          icon={<HiOutlineCheckCircle size={20} />}
          label="Active"
          value={stats.active}
          color="#22c55e"
          bg="#f0fdf4"
        />
        <StatCard
          icon={<HiOutlineClock size={20} />}
          label="Pending"
          value={stats.pending}
          color="#f59e0b"
          bg="#fffbeb"
        />
        <StatCard
          icon={<HiOutlineBan size={20} />}
          label="Inactive"
          value={stats.inactive}
          color="#94a3b8"
          bg="#f8fafc"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100  p-5">
        <CustomerTable
          key={refreshKey}
          onView={(c) => onNavigateToDetail?.(c.id)}
          onEdit={(c) => onNavigateToDetail?.(c.id)}
        />
      </div>

      {/* Create Modal */}
      <CustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default CustomerList;
