import React, { useState } from "react";
import { Button, Dropdown, Tooltip } from "antd";
import type { MenuProps } from "antd";
import {
  HiOutlinePlusCircle,
  HiOutlineRefresh,
  HiOutlineExclamation,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineTruck,
  HiOutlineDownload,
  HiOutlineDotsVertical,
} from "react-icons/hi";

import SummaryCards from "../components/SummaryCards";
import CustomerJarTable from "../components/CustomerJarTable";
import TransactionHistory from "../components/TransactionHistory";
import JarEntryModal from "../components/JarEntryModal";
import DriverTracking from "../components/DriverTracking";
import JarFiltersBar from "../components/JarFiltersBar";
import SectionCard from "../components/SectionCard";

import type { EntryType, JarEntryFormValues } from "../types/JarTracking";
import {
  MOCK_SUMMARY,
  MOCK_CUSTOMERS,
  MOCK_TRANSACTIONS,
  MOCK_DRIVERS,
} from "../data/mockData";

const JarTrackingPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [entryType, setEntryType] = useState<EntryType>("issue");
  const [loading] = useState(false);

  // ── Modal handlers ──
  const openModal = (type: EntryType) => {
    setEntryType(type);
    setModalOpen(true);
  };

  const handleSubmit = (data: JarEntryFormValues) => {
    console.log("Form submitted:", data);
    setModalOpen(false);
  };

  // ── Filter handlers ──
  const handleSearchChange = (val: string) => console.log("Search:", val);
  const handleStatusChange = (val: string) => console.log("Status:", val);
  const handleRouteChange = (val: string) => console.log("Route:", val);
  const handleDriverChange = (val: string) => console.log("Driver:", val);
  const handleDateRangeChange = (dates: any) =>
    console.log("DateRange:", dates);
  const handleFilterReset = () => console.log("Filters reset");

  // ── More menu ──
  const moreMenuItems: MenuProps["items"] = [
    {
      key: "export-summary",
      label: "Export Jar Summary",
      icon: <HiOutlineDownload size={14} />,
    },
    {
      key: "export-transactions",
      label: "Export Transactions",
      icon: <HiOutlineDownload size={14} />,
    },
    { type: "divider" },
    {
      key: "loss-report",
      label: "Loss / Leakage Report",
      icon: <HiOutlineDownload size={14} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">
            Jar / Can Tracking
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor inventory, track movements & detect money leakage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip title="Record cans issued to a customer">
            <Button
              type="primary"
              icon={<HiOutlinePlusCircle size={16} />}
              className="!bg-blue-600 hover:!bg-blue-700 !flex !items-center !gap-1.5 !text-[13px] !font-semibold !rounded-xl !shadow-sm !shadow-blue-200 !h-9"
              onClick={() => openModal("issue")}
            >
              Issue Cans
            </Button>
          </Tooltip>
          <Tooltip title="Record cans returned by customer">
            <Button
              icon={<HiOutlineRefresh size={16} />}
              className="!flex !items-center !gap-1.5 !text-[13px] !font-semibold !rounded-xl !border-emerald-200 !text-emerald-600 hover:!bg-emerald-50 hover:!border-emerald-300 !h-9"
              onClick={() => openModal("return")}
            >
              Return Cans
            </Button>
          </Tooltip>
          <Tooltip title="Mark cans as damaged for write-off">
            <Button
              icon={<HiOutlineExclamation size={16} />}
              className="!flex !items-center !gap-1.5 !text-[13px] !font-semibold !rounded-xl !border-red-200 !text-red-500 hover:!bg-red-50 hover:!border-red-300 !h-9"
              onClick={() => openModal("damaged")}
            >
              Damaged
            </Button>
          </Tooltip>
          <Dropdown
            menu={{ items: moreMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              icon={<HiOutlineDotsVertical size={15} />}
              className="!flex !items-center !rounded-xl !h-9"
            />
          </Dropdown>
        </div>
      </div>

      {/* ── Summary KPIs ── */}
      <SummaryCards data={MOCK_SUMMARY} />

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 px-5 py-3.5">
        <JarFiltersBar
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onRouteChange={handleRouteChange}
          onDriverChange={handleDriverChange}
          onDateRangeChange={handleDateRangeChange}
          onReset={handleFilterReset}
          search={""}
        />
      </div>

      {/* ── Customer Jar Table ── */}
      <SectionCard
        icon={<HiOutlineUserGroup size={15} className="text-blue-500" />}
        title="Customer Jar Tracking"
        subtitle="Real-time balance per customer"
        count={MOCK_CUSTOMERS.length}
        collapsible
      >
        <CustomerJarTable data={MOCK_CUSTOMERS} loading={loading} />
      </SectionCard>

      {/* ── Transaction History ── */}
      <SectionCard
        icon={<HiOutlineClipboardList size={15} className="text-slate-500" />}
        title="Transaction History"
        subtitle="Complete audit trail of all can movements"
        count={MOCK_TRANSACTIONS.length}
        collapsible
      >
        <TransactionHistory data={MOCK_TRANSACTIONS} loading={loading} />
      </SectionCard>

      {/* ── Driver Tracking ── */}
      <SectionCard
        icon={<HiOutlineTruck size={15} className="text-blue-500" />}
        title="Driver Tracking"
        subtitle="Today's route performance & return rates"
        count={MOCK_DRIVERS.length}
        collapsible
      >
        <DriverTracking data={MOCK_DRIVERS} loading={loading} />
      </SectionCard>

      {/* ── Entry Modal ── */}
      <JarEntryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        entryType={entryType}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default JarTrackingPage;
