import React, { useState } from "react";
import {
  HiOutlineDownload,
  HiOutlinePlus,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineRefresh,
} from "react-icons/hi";
import {
  TbBuildingFactory2,
  TbChartPie,
  TbBeer,
  TbCalendarStats,
} from "react-icons/tb";
import { Input, DatePicker } from "antd";

import CustomTabs from "../../../components/common/CustomTabs";
import ProductionStatCards from "../components/Productionstatcards";
import ProductionBatchTable from "../components/Productionbatchtable";
import CostBreakdownPanel from "../components/Costbreakdownpanel";
import ProductionTrendPanel from "../components/Productiontrendpanel";

import { useProduction } from "../hooks/useProduction";
import QualityCheckPanel from "../components/categories/Qualitycheckpanel";
import AddProductionBatchModal from "../components/categories/Addproductionbatchmodal";

const TABS = [
  { key: "overview", label: "Overview", icon: <TbChartPie size={14} /> },
  {
    key: "batches",
    label: "All Batches",
    icon: <TbBuildingFactory2 size={14} />,
  },
  { key: "quality", label: "Quality Control", icon: <TbBeer size={14} /> },
  {
    key: "schedule",
    label: "Schedule",
    icon: <TbCalendarStats size={14} />,
  },
];

const ProductionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { stats, costBreakdown, batches, qualityChecks, trends } =
    useProduction();

  const filteredBatches = batches.filter(
    (b) =>
      b.batchNo.toLowerCase().includes(search.toLowerCase()) ||
      b.product.toLowerCase().includes(search.toLowerCase()) ||
      b.operator.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 shrink-0">
              <TbBuildingFactory2 size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Production Center
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Track batches, costs, quality & efficiency in real time
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {stats.activeBatches} Active Batches
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold">
                  Live · {new Date().toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              <HiOutlineRefresh /> Refresh
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              <HiOutlineDownload /> Export
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:opacity-90 transition shadow-sm shadow-cyan-500/30"
            >
              <HiOutlinePlus /> New Batch
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <ProductionStatCards stats={stats} />

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 p-2">
        <CustomTabs
          items={TABS}
          activeKey={activeTab}
          onChange={setActiveTab}
          accentColor="#0EA5E9"
        />
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductionTrendPanel data={trends} />
          </div>
          <div>
            <CostBreakdownPanel breakdown={costBreakdown} />
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Recent Batches
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Latest production activity
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("batches")}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All →
                </button>
              </div>
              <div className="p-2">
                <ProductionBatchTable data={batches.slice(0, 5)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "batches" && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {/* Filters */}
          <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <Input
                size="large"
                placeholder="Search by batch no, product, operator…"
                prefix={<HiOutlineSearch className="text-slate-400" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <DatePicker.RangePicker
                size="large"
                placeholder={["From", "To"]}
                style={{ minWidth: 240 }}
              />
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                <HiOutlineFilter /> More Filters
              </button>
            </div>
          </div>
          <div className="p-2">
            <ProductionBatchTable data={filteredBatches} />
          </div>
        </div>
      )}

      {activeTab === "quality" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">
                  Quality Control Records
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  TDS, pH and other parameters per batch
                </p>
              </div>
              <div className="p-2">
                <QualityCheckPanel data={qualityChecks} />
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h3 className="text-base font-bold text-slate-800 mb-4">
                Quality Standards
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: "TDS", range: "50–150 ppm", color: "#0EA5E9" },
                  { label: "pH", range: "6.5–8.5", color: "#10B981" },
                  { label: "Temperature", range: "20–28 °C", color: "#F59E0B" },
                  { label: "Hardness", range: "30–100 ppm", color: "#8B5CF6" },
                  {
                    label: "Free Chlorine",
                    range: "0–0.5 ppm",
                    color: "#EC4899",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: s.color }}
                      />
                      <span className="font-semibold text-slate-700">
                        {s.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-600 tabular-nums">
                      {s.range}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-800">
                  Acceptable ranges as per IS 10500 standards for packaged
                  drinking water.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
            <TbCalendarStats size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Production Schedule
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Calendar view for upcoming batches & shift planning. Coming in next
            phase.
          </p>
        </div>
      )}

      <AddProductionBatchModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </div>
  );
};

export default ProductionPage;
