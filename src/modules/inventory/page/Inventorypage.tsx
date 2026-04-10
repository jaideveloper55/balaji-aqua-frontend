import React, { useState } from "react";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  HiOutlineDownload,
  HiOutlineDotsVertical,
  HiOutlineCube,
  HiOutlineSwitchHorizontal,
  HiOutlineBell,
  HiOutlineAdjustments,
} from "react-icons/hi";
import { HiOutlineArrowDownTray, HiOutlineArrowUpTray } from "react-icons/hi2";

import InventoryOverview from "../components/Inventoryoverview";
import ProductStockTable from "../components/Productstocktable";
import StockMovementTable from "../components/Stockmovementtable";
import StockEntryModal from "../components/Stockentrymodal";
import LowStockAlerts from "../components/Lowstockalerts";
import InventoryFiltersBar from "../components/Inventoryfiltersbar";
import SectionCard from "../components/SectionCard";

import type {
  EntryMode,
  StockEntryFormValues,
  LowStockAlertRecord,
} from "../types/Inventory";
import {
  MOCK_OVERVIEW,
  MOCK_PRODUCTS,
  MOCK_MOVEMENTS,
  MOCK_LOW_STOCK,
} from "../data/Inventorymockdata";

const InventoryPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [entryMode, setEntryMode] = useState<EntryMode>("in");
  const [loading] = useState(false);

  // ── Modal handlers ──
  const openModal = (mode: EntryMode) => {
    setEntryMode(mode);
    setModalOpen(true);
  };

  const handleSubmit = (data: StockEntryFormValues) => {
    console.log("Stock entry submitted:", data);
    setModalOpen(false);
  };

  const handleReorder = (record: LowStockAlertRecord) => {
    console.log("Reorder:", record.productName);
  };

  // ── Filter handlers ──
  const handleSearchChange = (val: string) => console.log("Search:", val);
  const handleStatusChange = (val: string) => console.log("Status:", val);
  const handleCategoryChange = (val: string) => console.log("Category:", val);
  const handleWarehouseChange = (val: string) => console.log("Warehouse:", val);
  const handleDateRangeChange = (dates: any) =>
    console.log("DateRange:", dates);
  const handleFilterReset = () => console.log("Filters reset");

  // ── More menu ──
  const moreMenuItems: MenuProps["items"] = [
    {
      key: "export-summary",
      label: "Export Stock Summary",
      icon: <HiOutlineDownload size={14} />,
    },
    {
      key: "export-movement",
      label: "Export Movement Report",
      icon: <HiOutlineDownload size={14} />,
    },
    { type: "divider" },
    {
      key: "closing-report",
      label: "Closing Stock Report",
      icon: <HiOutlineDownload size={14} />,
    },
    {
      key: "loss-report",
      label: "Loss Report",
      icon: <HiOutlineDownload size={14} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6 ">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">
            Inventory Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track stock levels, movements & get low-stock alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            icon={<HiOutlineArrowDownTray size={15} />}
            className="!bg-emerald-600 hover:!bg-emerald-700 !flex !items-center !gap-1 !text-[13px] !font-semibold !rounded-lg !shadow-sm !shadow-emerald-200"
            onClick={() => openModal("in")}
          >
            Stock In
          </Button>
          <Button
            icon={<HiOutlineArrowUpTray size={15} />}
            className="!flex !items-center !gap-1 !text-[13px] !font-semibold !rounded-lg !border-red-200 !text-red-500 hover:!bg-red-50 hover:!border-red-300"
            onClick={() => openModal("out")}
          >
            Stock Out
          </Button>
          <Button
            icon={<HiOutlineAdjustments size={15} />}
            className="!flex !items-center !gap-1 !text-[13px] !font-semibold !rounded-lg !border-violet-200 !text-violet-500 hover:!bg-violet-50 hover:!border-violet-300"
            onClick={() => openModal("adjust")}
          >
            Adjust
          </Button>
          <Dropdown menu={{ items: moreMenuItems }} trigger={["click"]}>
            <Button
              icon={<HiOutlineDotsVertical size={15} />}
              className="!flex !items-center !rounded-lg"
            />
          </Dropdown>
        </div>
      </div>

      {/* ── Overview KPIs ── */}
      <InventoryOverview data={MOCK_OVERVIEW} />

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100/50 px-5 py-3">
        <InventoryFiltersBar
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onCategoryChange={handleCategoryChange}
          onWarehouseChange={handleWarehouseChange}
          onDateRangeChange={handleDateRangeChange}
          onReset={handleFilterReset}
        />
      </div>

      {/* ── Product Stock Table ── */}
      <SectionCard
        icon={<HiOutlineCube size={15} className="text-blue-500" />}
        title="Product Stock List"
        subtitle="Current inventory levels across all products"

      >
        <ProductStockTable data={MOCK_PRODUCTS} loading={loading} />
      </SectionCard>

      {/* ── Low Stock Alerts ── */}
      <SectionCard
        icon={<HiOutlineBell size={15} className="text-red-500" />}
        title="Low Stock Alerts"
        subtitle={`${MOCK_LOW_STOCK.length} items need attention — prevent stockouts`}
        action={
          <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
            {MOCK_LOW_STOCK.filter((a) => a.status === "critical").length}{" "}
            Critical
          </span>
        }
 
      >
        <LowStockAlerts
          data={MOCK_LOW_STOCK}
          loading={loading}
          onReorder={handleReorder}
        />
      </SectionCard>

      {/* ── Stock Movement History ── */}
      <SectionCard
        icon={
          <HiOutlineSwitchHorizontal size={15} className="text-slate-500" />
        }
        title="Stock Movement History"
        subtitle="Complete audit trail — every IN, OUT & adjustment"
  
      >
        <StockMovementTable data={MOCK_MOVEMENTS} loading={loading} />
      </SectionCard>

      {/* ── Entry Modal ── */}
      <StockEntryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={entryMode}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default InventoryPage;
