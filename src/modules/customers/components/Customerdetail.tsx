import React, { useState, useEffect } from "react";
import { Button, Tag, Skeleton } from "antd";
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineTruck,
  HiOutlineCreditCard,
  HiOutlineCalendar,
  HiOutlineShoppingCart,
  HiOutlineCurrencyRupee,
} from "react-icons/hi";
import CustomerTabs, { type CustomerTabKey } from "./Customertabs";
import PricingTable from "./Pricingtable";
import LedgerTable from "./Ledgertable";
import { customerApi } from "../services/Customer.api";
import type { Customer, CustomerStatus, CustomerType } from "../types/Customer";

const STATUS_MAP: Record<CustomerStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "green" },
  inactive: { label: "Inactive", color: "default" },
  pending: { label: "Pending", color: "orange" },
};
const TYPE_MAP: Record<CustomerType, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
};
const FREQ_MAP: Record<string, string> = {
  daily: "Daily",
  alternate: "Alternate Days",
  weekly: "Weekly",
  on_demand: "On Demand",
};
const PAY_MAP: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  credit: "Credit",
};

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3">
    <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-700 mt-0.5">{value}</p>
    </div>
  </div>
);

const Metric: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="flex flex-col items-center gap-2 py-5 shadow-sm hover:shadow-md px-4 rounded-xl bg-slate-50 border border-slate-200">
    <span style={{ color }}>{icon}</span>
    <span className="text-xl font-black text-slate-800 tabular-nums">
      {value}
    </span>
    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

interface CustomerDetailProps {
  customerId: string;
  onBack?: () => void;
  onEdit?: (id: string) => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({
  customerId,
  onBack,
  onEdit,
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<CustomerTabKey>("overview");

  useEffect(() => {
    let isMounted = true;

    const fetchCustomer = async () => {
      try {
        setLoading(true);

        const data = await customerApi.getCustomerById(customerId);

        if (isMounted) {
          setCustomer(data ?? null);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        if (isMounted) {
          setCustomer(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCustomer();

    return () => {
      isMounted = false;
    };
  }, [customerId]);

  if (loading)
    return (
      <div className="p-6 max-w-[1400px] mx-auto">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  if (!customer)
    return (
      <div className="p-6 max-w-[1400px] mx-auto text-center py-20">
        <p className="text-lg font-semibold text-slate-500">
          Customer not found
        </p>
        <Button className="mt-4" onClick={onBack}>
          Go Back
        </Button>
      </div>
    );

  const address = [
    customer.address.line1,
    customer.address.line2,
    customer.address.city,
    customer.address.state,
    customer.address.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col gap-6  max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            icon={<HiOutlineArrowLeft size={16} />}
            onClick={onBack}
            className="!rounded-xl"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {customer.name}
              </h1>
              <Tag color={STATUS_MAP[customer.status].color}>
                {STATUS_MAP[customer.status].label}
              </Tag>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              {customer.id} · {TYPE_MAP[customer.type]}
            </p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<HiOutlinePencil size={14} />}
          size="large"
          onClick={() => onEdit?.(customer.id)}
        >
          Edit Customer
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric
          icon={<HiOutlineShoppingCart size={22} />}
          label="Total Orders"
          value={String(customer.totalOrders)}
          color="#3b82f6"
        />
        <Metric
          icon={<HiOutlineCurrencyRupee size={22} />}
          label="Outstanding"
          value={
            customer.outstandingBalance > 0
              ? `₹${customer.outstandingBalance.toLocaleString("en-IN")}`
              : "Nil"
          }
          color={customer.outstandingBalance > 0 ? "#ef4444" : "#22c55e"}
        />
        <Metric
          icon={<HiOutlineCalendar size={22} />}
          label="Member Since"
          value={new Date(customer.joinedAt).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          })}
          color="#8b5cf6"
        />
        <Metric
          icon={<HiOutlineTruck size={22} />}
          label="Last Order"
          value={
            customer.lastOrderAt
              ? new Date(customer.lastOrderAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })
              : "None"
          }
          color="#f59e0b"
        />
      </div>

      {/* Tabbed Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <CustomerTabs activeTab={tab} onChange={setTab} />
        <div className="p-6">
          {tab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-50/50 shadow-sm rounded-xl p-5 border border-slate-300">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Contact
                </h4>
                <div className="divide-y divide-slate-100">
                  <InfoRow
                    icon={<HiOutlinePhone size={15} />}
                    label="Phone"
                    value={customer.phone}
                  />
                  <InfoRow
                    icon={<HiOutlineMail size={15} />}
                    label="Email"
                    value={customer.email || "—"}
                  />
                  <InfoRow
                    icon={<HiOutlineLocationMarker size={15} />}
                    label="Address"
                    value={address}
                  />
                </div>
              </div>
              <div className="bg-slate-50/50 shadow-sm rounded-xl p-5 border border-slate-300">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Account Details
                </h4>
                <div className="divide-y divide-slate-100">
                  <InfoRow
                    icon={<HiOutlineTruck size={15} />}
                    label="Delivery Frequency"
                    value={FREQ_MAP[customer.deliveryFrequency]}
                  />
                  <InfoRow
                    icon={<HiOutlineCreditCard size={15} />}
                    label="Payment Mode"
                    value={PAY_MAP[customer.paymentMode]}
                  />
                  <InfoRow
                    icon={<HiOutlineCalendar size={15} />}
                    label="Joined"
                    value={new Date(customer.joinedAt).toLocaleDateString(
                      "en-IN",
                      { day: "2-digit", month: "long", year: "numeric" },
                    )}
                  />
                  {customer.notes && (
                    <InfoRow
                      icon={<HiOutlinePencil size={15} />}
                      label="Notes"
                      value={customer.notes}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          {tab === "pricing" && <PricingTable customerId={customerId} />}
          {tab === "ledger" && <LedgerTable customerId={customerId} />}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
