import React, { useState, useEffect } from "react";
import { Button, Tag, Tooltip } from "antd";
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
import type { Customer } from "../types/Customer";
import {
  STATUS_MAP,
  TYPE_MAP,
  FREQ_MAP,
  PAY_MAP,
  fmtCurrency,
  fmtShortDate,
  fmtDetailDate,
  fmtFullDate,
} from "./customerDetailConstants";
import {
  InfoRow,
  Metric,
  InfoSection,
  DetailSkeleton,
  NotFound,
} from "../components/Customerdetailwidgets";

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
        if (isMounted) setCustomer(data ?? null);
      } catch {
        if (isMounted) setCustomer(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCustomer();
    return () => {
      isMounted = false;
    };
  }, [customerId]);

  if (loading) return <DetailSkeleton />;
  if (!customer) return <NotFound onBack={onBack} />;

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
    <div className="flex flex-col gap-6">
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
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                {customer.name}
              </h1>
              <Tag
                color={STATUS_MAP[customer.status].color}
                className="!rounded-md !font-bold !text-[11px]"
              >
                {STATUS_MAP[customer.status].label}
              </Tag>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              {customer.id} · {TYPE_MAP[customer.type]}
            </p>
          </div>
        </div>
        <Tooltip title="Edit customer details">
          <Button
            type="primary"
            icon={<HiOutlinePencil size={14} />}
            onClick={() => onEdit?.(customer.id)}
            className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !h-9 !font-semibold !shadow-sm !shadow-blue-200"
          >
            Edit Customer
          </Button>
        </Tooltip>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric
          icon={<HiOutlineShoppingCart size={22} />}
          label="Total Orders"
          value={String(customer.totalOrders)}
          color="#3b82f6"
          tooltip="Lifetime orders placed by this customer"
        />
        <Metric
          icon={<HiOutlineCurrencyRupee size={22} />}
          label="Outstanding"
          value={fmtCurrency(customer.outstandingBalance)}
          color={customer.outstandingBalance > 0 ? "#ef4444" : "#22c55e"}
          tooltip={
            customer.outstandingBalance > 0
              ? "Amount pending collection"
              : "No outstanding balance"
          }
          alert={customer.outstandingBalance > 0}
        />
        <Metric
          icon={<HiOutlineCalendar size={22} />}
          label="Member Since"
          value={fmtShortDate(customer.joinedAt)}
          color="#8b5cf6"
          tooltip={`Joined on ${fmtFullDate(customer.joinedAt)}`}
        />
        <Metric
          icon={<HiOutlineTruck size={22} />}
          label="Last Order"
          value={
            customer.lastOrderAt ? fmtDetailDate(customer.lastOrderAt) : "None"
          }
          color="#f59e0b"
          tooltip={
            customer.lastOrderAt
              ? `Last ordered on ${fmtFullDate(customer.lastOrderAt)}`
              : "No orders yet"
          }
        />
      </div>

      {/* Tabbed Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 overflow-hidden">
        <CustomerTabs activeTab={tab} onChange={setTab} />
        <div className="p-5">
          {tab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InfoSection title="Contact">
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
              </InfoSection>
              <InfoSection title="Account Details">
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
                  value={fmtFullDate(customer.joinedAt)}
                />
                {customer.notes && (
                  <InfoRow
                    icon={<HiOutlinePencil size={15} />}
                    label="Notes"
                    value={customer.notes}
                  />
                )}
              </InfoSection>
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
