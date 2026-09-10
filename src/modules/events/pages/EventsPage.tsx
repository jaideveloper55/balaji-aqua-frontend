import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spin } from "antd";
import { HiOutlinePlus } from "react-icons/hi";
import { MdEventNote } from "react-icons/md";
import {
  getEventStatsApi,
  getEventOrdersApi,
  createEventOrderApi,
  updateEventOrderApi,
  updateEventStatusApi,
  cancelEventOrderApi,
  deleteEventOrderApi,
  recordEventPaymentApi,
} from "../api/Events.api";

import type {
  EventFilters,
  EventOrder,
  EventOrderStatus,
  EventCancellationReason,
  CreateEventOrderPayload,
  UpdateEventOrderPayload,
  PaymentMode,
} from "../types/Events";

import { DEFAULT_PAGE_SIZE } from "../constants/Events.constants";

import EventStatCards from "../components/Eventstatcards";
import EventFilterBar from "../components/Eventfilterbar";
import EventDetailsDrawer from "../drawers/Eventdetailsdrawer";
import CreateEventModal from "../modals/Createeventmodal";
import CancelEventModal from "../modals/Canceleventmodal";
import EventTable from "../components/Eventtable";
import PrintEventModal from "../modals/Printeventmodal";
import CustomPageHeader from "../../../components/common/CustomPageHeader";
import EventCreatedBanner from "../components/Eventcreatedbanner";

import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import Deleteeventordermodal from "../components/Deleteeventordermodal";
import Completeeventmodal from "../modals/Completeeventmodal";
import { COMPANY_INFO } from "../../billing/constants/Mockdata";
import EventPendingBanner from "../components/Eventpendingbanner";

const EventOrdersPage = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    status: "ALL",
    eventType: "ALL",
  });

  const [selected, setSelected] = useState<EventOrder | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventOrder | null>(null);
  const [cancelTarget, setCancelTarget] = useState<EventOrder | null>(null);
  const [printTarget, setPrintTarget] = useState<EventOrder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventOrder | null>(null);
  const [completeTarget, setCompleteTarget] = useState<EventOrder | null>(null);
  const [justCreatedEvent, setJustCreatedEvent] = useState<EventOrder | null>(
    null
  );

  const [dismissedPendingIds, setDismissedPendingIds] = useState<Set<string>>(
    new Set()
  );

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["event-stats"],
    queryFn: () => getEventStatsApi().then((res) => res.data),
    staleTime: 1000 * 60 * 2,
  });

  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    isFetching: isFetchingEvents,
  } = useQuery({
    queryKey: ["events", filters],
    queryFn: () => getEventOrdersApi(filters).then((res) => res.data),
    staleTime: 1000 * 30,
  });

  const { data: allEventsData } = useQuery({
    queryKey: ["events-pending-check"],
    queryFn: () =>
      getEventOrdersApi({ page: 1, limit: 100 }).then((res) => res.data),
    staleTime: 1000 * 30,
  });

  const pendingEvents = useMemo(() => {
    const all = allEventsData?.data ?? [];
    return all.filter(
      (e: EventOrder) =>
        e.status !== "COMPLETED" &&
        e.status !== "CANCELLED" &&
        e.balanceDue > 0 &&
        e.id !== justCreatedEvent?.id &&
        !dismissedPendingIds.has(e.id)
    );
  }, [allEventsData, justCreatedEvent, dismissedPendingIds]);

  const dismissPending = (id: string) =>
    setDismissedPendingIds((prev) => new Set(prev).add(id));

  const recordPaymentMutation = useMutation({
    mutationFn: ({
      id,
      amount,
      paymentMode,
    }: {
      id: string;
      amount: number;
      paymentMode: PaymentMode;
    }) =>
      recordEventPaymentApi(id, { amount, paymentMode }).then(
        (res) => res.data
      ),
  });

  const deleteEventMutation = useMutation({
    mutationKey: ["deleteEventOrder"],
    mutationFn: (id: string) => deleteEventOrderApi(id).then((r) => r.data),
    onSuccess: (data) => {
      successNotification("Event Deleted", data?.message ?? "Event removed");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events-pending-check"] });
      setDeleteTarget(null);
    },
    onError: (err: any) =>
      errorNotification(
        "Delete Failed",
        err?.message ?? "Could not delete event"
      ),
  });

  const events = eventsData?.data ?? [];
  const pagination = eventsData?.pagination ?? {
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateEventOrderPayload) =>
      createEventOrderApi(data).then((res) => res.data),
    onSuccess: (created) => {
      successNotification(
        "Event Order Created",
        `${created.eventNumber} · ${created.eventName}`
      );
      setJustCreatedEvent(created);
      setCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event-stats"] });
      queryClient.invalidateQueries({ queryKey: ["events-pending-check"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Failed to Create Event",
        err?.message ?? "Please check all required fields"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventOrderPayload }) =>
      updateEventOrderApi(id, data).then((res) => res.data),
    onSuccess: () => {
      successNotification("Event Updated", "Changes saved successfully");
      setEditingEvent(null);
      setCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event-stats"] });
      queryClient.invalidateQueries({ queryKey: ["events-pending-check"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Update Failed",
        err?.message ?? "Could not update event"
      );
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EventOrderStatus }) =>
      updateEventStatusApi(id, status).then((res) => res.data),
    onSuccess: (_data, variables) => {
      const friendlyStatus = variables.status.replace(/_/g, " ").toLowerCase();
      successNotification(
        "Status Updated",
        `Event marked as ${friendlyStatus}`
      );
      setDetailsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event-stats"] });
      queryClient.invalidateQueries({ queryKey: ["events-pending-check"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
      queryClient.invalidateQueries({ queryKey: ["billing-pos-products"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Status Update Failed",
        err?.message ?? "Could not update event status"
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({
      id,
      reason,
      note,
    }: {
      id: string;
      reason: EventCancellationReason;
      note?: string;
    }) => cancelEventOrderApi(id, { reason, note }).then((res) => res.data),
    onSuccess: () => {
      successNotification(
        "Event Cancelled",
        "Reserved stock has been released"
      );
      setCancelTarget(null);
      setDetailsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event-stats"] });
      queryClient.invalidateQueries({ queryKey: ["events-pending-check"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
      queryClient.invalidateQueries({ queryKey: ["billing-pos-products"] });
    },
    onError: (err: any) => {
      errorNotification(
        "Cancellation Failed",
        err?.message ?? "Could not cancel this event"
      );
    },
  });

  const handleView = (e: EventOrder) => {
    setSelected(e);
    setDetailsOpen(true);
  };

  const handleEdit = (e: EventOrder) => {
    setDetailsOpen(false);
    setEditingEvent(e);
    setCreateOpen(true);
  };

  const handlePrint = (e: EventOrder) => {
    setPrintTarget(e);
  };

  const handleMarkComplete = (e: EventOrder) => {
    if (e.balanceDue > 0) {
      setCompleteTarget(e);
    } else {
      statusMutation.mutate({ id: e.id, status: "COMPLETED" });
    }
  };

  const handleCancel = (e: EventOrder) => {
    setCancelTarget(e);
  };

  const handleDelete = (event: EventOrder) => setDeleteTarget(event);
  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteEventMutation.mutate(deleteTarget.id);
  };

  const handleRecordAndComplete = (
    amount: number,
    paymentMode: PaymentMode
  ) => {
    if (!completeTarget) return;
    const id = completeTarget.id;
    recordPaymentMutation.mutate(
      { id, amount, paymentMode },
      {
        onSuccess: () => {
          statusMutation.mutate(
            { id, status: "COMPLETED" },
            { onSuccess: () => setCompleteTarget(null) }
          );
        },
        onError: (err: any) =>
          errorNotification(
            "Payment Failed",
            err?.message ?? "Could not record payment"
          ),
      }
    );
  };

  const handleCompleteAnyway = () => {
    if (!completeTarget) return;
    statusMutation.mutate(
      { id: completeTarget.id, status: "COMPLETED" },
      { onSuccess: () => setCompleteTarget(null) }
    );
  };

  const handleConfirmCancel = (id: string, reason: string, note?: string) => {
    cancelMutation.mutate({
      id,
      reason: reason as EventCancellationReason,
      note,
    });
  };

  return (
    <div className="space-y-5">
      <CustomPageHeader
        icon={<MdEventNote className="w-6 h-6 text-white" />}
        iconBg="bg-blue-500"
        title="Event / Function Orders"
        subtitle="Manage bulk water and beverage orders for events and functions"
        actions={
          <>
            <button
              onClick={() => setCreateOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition flex items-center gap-2 shadow-sm"
            >
              <HiOutlinePlus className="w-5 h-5" /> Create Event Order
            </button>
          </>
        }
      />

      {justCreatedEvent && (
        <EventCreatedBanner
          event={justCreatedEvent}
          onDismiss={() => setJustCreatedEvent(null)}
        />
      )}

      {pendingEvents.length > 0 && (
        <div className="flex flex-col gap-2">
          {pendingEvents.map((e: EventOrder) => (
            <EventPendingBanner
              key={e.id}
              event={e}
              onDismiss={() => dismissPending(e.id)}
              onView={() => handleView(e)}
            />
          ))}
        </div>
      )}

      <Spin spinning={isLoadingStats}>
        <EventStatCards stats={stats} />
      </Spin>

      <EventFilterBar
        filters={filters}
        onChange={(newFilters) => setFilters({ ...newFilters, page: 1 })}
      />

      <Spin
        spinning={isLoadingEvents || isFetchingEvents}
        tip={isLoadingEvents ? "Loading events..." : "Refreshing..."}
      >
        <EventTable
          data={events}
          page={pagination.page}
          pageSize={pagination.limit}
          total={pagination.total}
          onPageChange={(page: number, limit: number) =>
            setFilters((prev) => ({ ...prev, page, limit }))
          }
          onView={handleView}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onComplete={handleMarkComplete}
          onDelete={handleDelete}
          onPrint={handlePrint}
        />
      </Spin>

      <EventDetailsDrawer
        event={selected}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onMarkComplete={handleMarkComplete}
      />

      {/* ─── Create Modal ─────────────────────────────────────────────────── */}

      <CreateEventModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setEditingEvent(null);
        }}
        initialData={editingEvent}
        onSubmit={(form: CreateEventOrderPayload) => {
          if (editingEvent) {
            const { items, advancePaid, advancePaymentMode, ...updatePayload } =
              form;
            updateMutation.mutate({ id: editingEvent.id, data: updatePayload });
          } else {
            createMutation.mutate(form);
          }
        }}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <CancelEventModal
        event={cancelTarget}
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
        isSubmitting={cancelMutation.isPending}
      />

      {/* ─── Print Modal ──────────────────────────────────────────────────── */}
      <PrintEventModal
        event={printTarget}
        open={!!printTarget}
        onClose={() => setPrintTarget(null)}
        company={COMPANY_INFO}
      />

      <Deleteeventordermodal
        open={!!deleteTarget}
        event={deleteTarget}
        isDeleting={deleteEventMutation.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <Completeeventmodal
        open={!!completeTarget}
        event={completeTarget}
        isSubmitting={
          recordPaymentMutation.isPending || statusMutation.isPending
        }
        onRecordAndComplete={handleRecordAndComplete}
        onCompleteAnyway={handleCompleteAnyway}
        onClose={() => setCompleteTarget(null)}
      />
    </div>
  );
};

export default EventOrdersPage;
