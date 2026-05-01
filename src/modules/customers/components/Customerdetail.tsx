import React, { useState } from "react";
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
import { useCustomer } from "../hooks/useCustomer";
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
  const [tab, setTab] = useState<CustomerTabKey>("overview");

  // ─── Server state via TanStack Query ────────────────────────────────────
  // Auto-refetches on company switch, caches between visits, handles all states
  const { data: customer, isLoading, isError } = useCustomer(customerId);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !customer) return <NotFound onBack={onBack} />;

  // Build address from flat fields (backend sends addressLine1/2, not nested)
  const address = [
    customer.addressLine1,
    customer.addressLine2,
    customer.city,
    customer.state,
    customer.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  // Outstanding can come from summary OR top-level (use summary for detail view)
  const outstanding =
    customer.summary?.outstandingBalance ?? customer.outstandingBalance ?? 0;

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
              {customer.customerCode} · {TYPE_MAP[customer.type]}
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

      {/* Metrics — pulled from backend `summary` object */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric
          icon={<HiOutlineShoppingCart size={22} />}
          label="Total Orders"
          value={String(customer.summary?.totalOrders ?? 0)}
          color="#3b82f6"
          tooltip="Lifetime orders placed by this customer"
        />
        <Metric
          icon={<HiOutlineCurrencyRupee size={22} />}
          label="Outstanding"
          value={fmtCurrency(outstanding)}
          color={outstanding > 0 ? "#ef4444" : "#22c55e"}
          tooltip={
            outstanding > 0
              ? "Amount pending collection"
              : "No outstanding balance"
          }
          alert={outstanding > 0}
        />
        <Metric
          icon={<HiOutlineCalendar size={22} />}
          label="Member Since"
          value={fmtShortDate(
            customer.summary?.memberSince ?? customer.createdAt
          )}
          color="#8b5cf6"
          tooltip={`Joined on ${fmtFullDate(
            customer.summary?.memberSince ?? customer.createdAt
          )}`}
        />
        <Metric
          icon={<HiOutlineTruck size={22} />}
          label="Last Order"
          value={
            customer.summary?.lastOrderDate
              ? fmtDetailDate(customer.summary.lastOrderDate)
              : "None"
          }
          color="#f59e0b"
          tooltip={
            customer.summary?.lastOrderDate
              ? `Last ordered on ${fmtFullDate(customer.summary.lastOrderDate)}`
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
                  value={address || "—"}
                />
              </InfoSection>
              <InfoSection title="Account Details">
                <InfoRow
                  icon={<HiOutlineTruck size={15} />}
                  label="Delivery Frequency"
                  value={
                    customer.deliveryFrequency
                      ? FREQ_MAP[customer.deliveryFrequency]
                      : "—"
                  }
                />
                <InfoRow
                  icon={<HiOutlineCreditCard size={15} />}
                  label="Payment Mode"
                  value={
                    customer.paymentMode ? PAY_MAP[customer.paymentMode] : "—"
                  }
                />
                <InfoRow
                  icon={<HiOutlineCalendar size={15} />}
                  label="Joined"
                  value={fmtFullDate(customer.createdAt)}
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
