import { useState, useMemo } from "react";
import { message } from "antd";
import { HiOutlinePlus, HiOutlineDownload } from "react-icons/hi";
import { MdEventNote } from "react-icons/md";
import { useEvents } from "../hooks/useEvents";
import { EventFilters, EventOrder } from "../types/Events";
import { DEFAULT_PAGE_SIZE } from "../constants/Events.constants";
import EventStatCards from "../components/Eventstatcards";
import EventFilterBar from "../components/Eventfilterbar";
import EventDetailsDrawer from "../drawers/Eventdetailsdrawer";
import CreateEventModal from "../modals/Createeventmodal";
import CancelEventModal from "../modals/Canceleventmodal";
import EventTable from "../components/Eventtable";
import PrintEventModal from "../modals/Printeventmodal";
import CustomPageHeader from "../../../components/common/CustomPageHeader";

const EventOrdersPage = () => {
  const { stats, filterEvents, createEvent, updateStatus, cancelEvent } =
    useEvents();

  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    status: "ALL",
    eventType: "ALL",
  });

  const [selected, setSelected] = useState<EventOrder | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<EventOrder | null>(null);
  const [printTarget, setPrintTarget] = useState<EventOrder | null>(null);

  const filtered = useMemo(
    () => filterEvents(filters),
    [filterEvents, filters]
  );

  const handleView = (e: EventOrder) => {
    setSelected(e);
    setDetailsOpen(true);
  };

  const handleEdit = (_e: EventOrder) => {
    message.info("Edit flow — wire up similarly to Create");
  };

  const handlePrint = (e: EventOrder) => {
    setPrintTarget(e);
  };

  const handleMarkComplete = (e: EventOrder) => {
    updateStatus(e.id, "COMPLETED");
    message.success(`Marked ${e.eventNumber} as completed`);
    setDetailsOpen(false);
  };

  const handleCancel = (e: EventOrder) => {
    setCancelTarget(e);
  };

  const handleConfirmCancel = (id: string, reason: string) => {
    cancelEvent(id, reason);
    message.success("Event cancelled");
    setCancelTarget(null);
    setDetailsOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <CustomPageHeader
        icon={<MdEventNote className="w-6 h-6 text-white" />}
        iconBg="bg-blue-600"
        title="Event / Function Orders"
        subtitle="Manage bulk water and beverage orders for events and functions"
        actions={
          <>
            <button
              onClick={() => message.info("Export coming soon")}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition flex items-center gap-2 shadow-sm"
            >
              <HiOutlineDownload /> Export
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition flex items-center gap-2 shadow-sm"
            >
              <HiOutlinePlus className="w-5 h-5" /> Create Event Order
            </button>
          </>
        }
      />

      {/* Stats */}
      <EventStatCards stats={stats} />

      {/* Filters */}
      <EventFilterBar filters={filters} onChange={setFilters} />

      {/* Table */}
      <EventTable
        data={filtered}
        page={filters.page ?? 1}
        pageSize={filters.limit ?? DEFAULT_PAGE_SIZE}
        onPageChange={(page, limit) => setFilters({ ...filters, page, limit })}
        onView={handleView}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onMarkComplete={handleMarkComplete}
        onPrint={handlePrint}
      />

      {/* Drawer & Modals */}
      <EventDetailsDrawer
        event={selected}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onMarkComplete={handleMarkComplete}
      />

      <CreateEventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(form) => {
          createEvent(form);
          message.success("Event order created");
        }}
      />

      <CancelEventModal
        event={cancelTarget}
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />

      <PrintEventModal
        event={printTarget}
        open={!!printTarget}
        onClose={() => setPrintTarget(null)}
        company={{
          name: "Your Company",
          address: "Your address",
          phone: "+91 ...",
          gstNumber: "33XXXXX...",
          logoUrl: "/logo.png",
        }}
      />
    </div>
  );
};

export default EventOrdersPage;
