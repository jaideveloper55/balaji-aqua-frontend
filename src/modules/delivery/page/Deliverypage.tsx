import React, { useState, useMemo } from "react";
import { Tooltip } from "antd";
import { HiOutlinePlus, HiOutlineClipboardList } from "react-icons/hi";
import { BsBoxSeam, BsClockHistory } from "react-icons/bs";
import { FiUsers, FiAlertCircle } from "react-icons/fi";
import { RiRouteLine } from "react-icons/ri";
import DeliveryStatCards from "../components/Deliverystatcards";
import DeliveryTable from "../components/Deliverytable";
import RouteTable from "../components/Routetable";
import DriverCards from "../components/Drivercards";
import PendingAlerts from "../components/Pendingalerts";
import DeliveryHistoryTable from "../components/Deliveryhistorytable";
import RouteMapPlaceholder from "../components/Routemapplaceholder";
import {
  MOCK_DELIVERIES,
  MOCK_ROUTES,
  MOCK_DRIVERS,
  MOCK_PENDING,
  MOCK_HISTORY,
} from "../data/delivery";
import type {
  Delivery,
  DeliveryFormValues,
  DeliveryStats,
  DeliveryTabKey,
} from "../types/delivery";
import BulkAssignModal from "../components/modals/BulkAssignModal";
import DeliveryDetailModal from "../components/modals/DeliveryDetailModal";
import DeliveryTimelineModal from "../components/modals/DeliveryTimelineModal";
import AssignDriverModal from "../components/modals/AssignDriverModal";
import RescheduleModal from "../components/modals/RescheduleModal";
import AddRouteModal from "../components/modals/AddRouteModal";
import CreateDeliveryModal from "../components/modals/Createdeliverymodal";

const TABS: {
  key: DeliveryTabKey;
  label: string;
  icon: React.ReactNode;
  count?: number;
  alert?: boolean;
}[] = [
  {
    key: "deliveries",
    label: "Deliveries",
    icon: <BsBoxSeam className="w-3.5 h-3.5" />,
  },
  {
    key: "routes",
    label: "Routes",
    icon: <RiRouteLine className="w-3.5 h-3.5" />,
  },
  {
    key: "drivers",
    label: "Drivers",
    icon: <FiUsers className="w-3.5 h-3.5" />,
  },
  {
    key: "pending",
    label: "Pending Alerts",
    icon: <FiAlertCircle className="w-3.5 h-3.5" />,
    alert: true,
  },
  {
    key: "history",
    label: "History",
    icon: <BsClockHistory className="w-3.5 h-3.5" />,
  },
];

const Deliverypage = () => {
  const [activeTab, setActiveTab] = useState<DeliveryTabKey>("deliveries");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [bulkAssignModalOpen, setBulkAssignModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [assignDriverModalOpen, setAssignDriverModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [addRouteModalOpen, setAddRouteModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );

  const stats: DeliveryStats = useMemo(() => {
    const total = MOCK_DELIVERIES.length;
    const completed = MOCK_DELIVERIES.filter(
      (d) => d.status === "delivered"
    ).length;
    const pending = MOCK_DELIVERIES.filter(
      (d) => d.status === "pending"
    ).length;
    const failed = MOCK_DELIVERIES.filter((d) => d.status === "failed").length;
    const inProgress = MOCK_DELIVERIES.filter((d) => d.status === "out").length;
    const activeDrivers = MOCK_DRIVERS.filter(
      (d) => d.status === "active"
    ).length;
    const totalRoutes = MOCK_ROUTES.filter((r) => r.status === "active").length;
    return {
      total,
      completed,
      pending,
      failed,
      inProgress,
      activeDrivers,
      totalRoutes,
    };
  }, []);

  // ─── Tab counts for badges ────────────────────────────────────
  const tabCounts: Partial<Record<DeliveryTabKey, number>> = {
    deliveries: stats.total,
    routes: stats.totalRoutes,
    drivers: MOCK_DRIVERS.length,
    pending: MOCK_PENDING.length,
  };

  // ─── Handlers ─────────────────────────────────────────────────
  const onCreateSubmit = (data: DeliveryFormValues) => {
    console.log("Create delivery:", data);
    setCreateModalOpen(false);
  };

  const openDetail = (record: Delivery) => {
    setSelectedDelivery(record);
    setDetailModalOpen(true);
  };

  const openTimeline = (record: Delivery) => {
    setSelectedDelivery(record);
    setTimelineModalOpen(true);
  };

  const openAssignDriver = (record: Delivery) => {
    setSelectedDelivery(record);
    setAssignDriverModalOpen(true);
  };

  const openReschedule = (record: Delivery) => {
    setSelectedDelivery(record);
    setRescheduleModalOpen(true);
  };

  const handleMarkDelivered = (record: Delivery) => {
    console.log("Mark delivered:", record.id);
  };

  return (
    <div className="space-y-5">
      {/* ─── ACTION BAR ───────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-2">
        <Tooltip title="Schedule a new delivery">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-200"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Create Delivery
          </button>
        </Tooltip>
        <Tooltip title="Assign all pending deliveries by route">
          <button
            onClick={() => setBulkAssignModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 text-[13px] font-semibold rounded-xl transition-colors"
          >
            <HiOutlineClipboardList className="w-4 h-4" />
            Bulk Assign
          </button>
        </Tooltip>
      </div>

      {/* ─── STAT CARDS ───────────────────────────────────────── */}
      <DeliveryStatCards stats={stats} />

      {/* ─── TABS SECTION ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 overflow-hidden">
        {/* Tab navigation */}
        <div className="flex items-center border-b border-slate-200 px-1 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const count = tabCounts[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-1.5 px-4 py-3.5 text-[13px] font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "text-indigo-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.icon}
                {tab.label}
                {count !== undefined && (
                  <span
                    className={`ml-0.5 px-1.5 py-[1px] rounded-full text-[10px] font-bold leading-none ${
                      tab.alert && activeTab !== tab.key
                        ? "bg-red-100 text-red-600"
                        : activeTab === tab.key
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                )}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-indigo-600 rounded-t" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "deliveries" && (
          <DeliveryTable
            data={MOCK_DELIVERIES}
            onViewDetail={openDetail}
            onTrackStatus={openTimeline}
            onAssignDriver={openAssignDriver}
            onMarkDelivered={handleMarkDelivered}
            onReschedule={openReschedule}
          />
        )}

        {activeTab === "routes" && (
          <RouteTable
            data={MOCK_ROUTES}
            onAddRoute={() => setAddRouteModalOpen(true)}
          />
        )}

        {activeTab === "drivers" && <DriverCards data={MOCK_DRIVERS} />}

        {activeTab === "pending" && <PendingAlerts data={MOCK_PENDING} />}

        {activeTab === "history" && (
          <DeliveryHistoryTable data={MOCK_HISTORY} />
        )}
      </div>

      <RouteMapPlaceholder />

      <CreateDeliveryModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={onCreateSubmit}
      />

      <BulkAssignModal
        open={bulkAssignModalOpen}
        onClose={() => setBulkAssignModalOpen(false)}
      />

      <DeliveryDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        delivery={selectedDelivery}
        onMarkDelivered={handleMarkDelivered}
        onReschedule={openReschedule}
        onTrackTimeline={openTimeline}
      />

      <DeliveryTimelineModal
        open={timelineModalOpen}
        onClose={() => setTimelineModalOpen(false)}
        delivery={selectedDelivery}
      />

      <AssignDriverModal
        open={assignDriverModalOpen}
        onClose={() => setAssignDriverModalOpen(false)}
        delivery={selectedDelivery}
      />

      <RescheduleModal
        open={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        delivery={selectedDelivery}
      />

      <AddRouteModal
        open={addRouteModalOpen}
        onClose={() => setAddRouteModalOpen(false)}
      />
    </div>
  );
};

export default Deliverypage;
