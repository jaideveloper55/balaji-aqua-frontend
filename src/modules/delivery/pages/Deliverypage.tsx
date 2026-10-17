import { useState } from "react";
import { message } from "antd";
import { addDays, dayLabel, todayIST } from "../constants/Orderconstants";
import {
  DUMMY_BOYS,
  applyDummySave,
  makeDummyOrders,
} from "../constants/Orderdummy";
import type {
  Order,
  OrderCounts,
  OrderFilters,
  OrderPayload,
  OrderStats,
  OrderStatus,
} from "../types/Orders";
import Deliveryheader from "../components/Deliveryheader";
import Orderfilterbar from "../components/Orderfilterbar";
import Orderstatcards, { StatKey } from "../components/Orderstatcards";
import Orderstatustabs from "../components/Orderstatustabs";
import Ordertable from "../components/Ordertable";
import Createordermodal from "../components/Createordermodal";

// The office mostly cares about TODAY, so the page starts there.
const initialFilters = (): OrderFilters => ({
  dateFrom: todayIST(),
  dateTo: todayIST(),
  page: 1,
  limit: 10,
});

// Does one order pass the filters? (The server will do this job later.)
const matches = (o: Order, f: OrderFilters, ignoreStatus = false): boolean => {
  const s = f.search?.trim().toLowerCase();
  if (
    s &&
    !o.orderNo.toLowerCase().includes(s) &&
    !o.customer.name.toLowerCase().includes(s)
  )
    return false;
  if (f.unassigned && o.assignedTo) return false;
  if (f.assignedToId && o.assignedTo?.id !== f.assignedToId) return false;
  if (f.dateFrom && o.deliveryDate < f.dateFrom) return false;
  if (f.dateTo && o.deliveryDate > f.dateTo) return false;
  if (!ignoreStatus && f.status && o.status !== f.status) return false;
  return true;
};

const DeliveryPage = () => {
  // ── State ─────────────────────────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<Order[]>(makeDummyOrders); // dummy "database"
  const [filters, setFilters] = useState<OrderFilters>(initialFilters);
  const [createOpen, setCreateOpen] = useState(false); // New Order modal
  const [editOrder, setEditOrder] = useState<Order | null>(null); // Edit modal (the order being edited)
  const [msg, msgHolder] = message.useMessage();

  // Change some filters. Any change goes back to page 1 (page 3 of a smaller result would be empty).
  const patchFilters = (patch: Partial<OrderFilters>) =>
    setFilters((f) => ({ ...f, ...patch, page: 1 }));
  const clearFilters = () =>
    setFilters((f) => ({ page: 1, limit: f.limit, search: "" }));

  // ── Work out what to show ─────────────────────────────────────────────────────────────────────
  const filtered = orders.filter((o) => matches(o, filters));
  const rows = filtered.slice(
    (filters.page - 1) * filters.limit,
    filters.page * filters.limit
  );

  // Tab counts ignore the status filter, so the tabs don't jump around when you click them.
  const inScope = orders.filter((o) => matches(o, filters, true));
  const counts: OrderCounts = {
    all: inScope.length,
    PENDING: inScope.filter((o) => o.status === "PENDING").length,
    DELIVERED: inScope.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: inScope.filter((o) => o.status === "CANCELLED").length,
  };

  // The four cards always look at the WHOLE day, not at the current filters.
  const today = todayIST();
  const todays = orders.filter((o) => o.deliveryDate === today);
  const stats: OrderStats = {
    today: {
      total: todays.length,
      pending: todays.filter((o) => o.status === "PENDING").length,
      delivered: todays.filter((o) => o.status === "DELIVERED").length,
      cancelled: todays.filter((o) => o.status === "CANCELLED").length,
    },
    overdue: orders.filter(
      (o) => o.status === "PENDING" && o.deliveryDate < today
    ).length,
    unassigned: orders.filter((o) => o.status === "PENDING" && !o.assignedTo)
      .length,
  };

  // ── Handlers ──────────────────────────────────────────────────────────────────────────────────
  // Clicking a card = "show me exactly these orders".
  const handleStat = (key: StatKey) => {
    const base = {
      search: "",
      assignedToId: undefined,
      unassigned: undefined,
      page: 1,
    };
    if (key === "today")
      setFilters((f) => ({
        ...f,
        ...base,
        status: undefined,
        dateFrom: today,
        dateTo: today,
      }));
    else if (key === "delivered")
      setFilters((f) => ({
        ...f,
        ...base,
        status: "DELIVERED",
        dateFrom: today,
        dateTo: today,
      }));
    else if (key === "overdue")
      setFilters((f) => ({
        ...f,
        ...base,
        status: "PENDING",
        dateFrom: undefined,
        dateTo: addDays(today, -1),
      }));
    else
      setFilters((f) => ({
        ...f,
        ...base,
        status: "PENDING",
        unassigned: true,
        dateFrom: undefined,
        dateTo: undefined,
      }));
  };

  // Assign from the table row: change the dummy order in state (the API call comes later).
  const handleAssign = (order: Order, boyId: string | null) => {
    const boy = DUMMY_BOYS.find((b) => b.id === boyId);
    setOrders((list) =>
      list.map((o) =>
        o.id === order.id
          ? { ...o, assignedTo: boy ? { id: boy.id, name: boy.name } : null }
          : o
      )
    );
    msg.success(
      boy
        ? `${order.orderNo} will be delivered by ${boy.name}`
        : `${order.orderNo} has no delivery boy now`
    );
  };

  // Save from the New / Edit modal. The dummy "backend" numbers and stores the order in state;
  // with the API this becomes a useMutation (POST /orders or PATCH /orders/:id).
  const handleSave = (payload: OrderPayload) => {
    const { orders: next, saved } = applyDummySave(orders, payload, editOrder);
    setOrders(next);
    msg.success(
      `${saved.orderNo} ${editOrder ? "updated" : "created"} for ${
        saved.customer.name
      }`
    );

    // A new order for tomorrow would vanish from a "Today" list - looks like it wasn't saved.
    // So if the list can't show it, jump to its day.
    if (!matches(saved, filters)) {
      setFilters((f) => ({
        page: 1,
        limit: f.limit,
        search: "",
        dateFrom: saved.deliveryDate,
        dateTo: saved.deliveryDate,
      }));
      msg.info(
        `Showing ${dayLabel(saved.deliveryDate)}, where ${saved.orderNo} is`
      );
    }
  };

  const closeForm = () => {
    setCreateOpen(false);
    setEditOrder(null);
  };

  // The Cancel dialog is Screen 3. For now the menu item just says so.
  const soon = (what: string) => () =>
    msg.info(`${what} - we build this screen next`);

  const hasFilters = !!(
    filters.search ||
    filters.status ||
    filters.assignedToId ||
    filters.unassigned ||
    filters.dateFrom ||
    filters.dateTo
  );
  const setStatus = (status?: OrderStatus) => patchFilters({ status });

  // ── Render ────────────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {msgHolder}

      <Deliveryheader onCreate={() => setCreateOpen(true)} />

      <Orderstatcards stats={stats} onSelect={handleStat} />

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <Orderstatustabs
          active={filters.status}
          counts={counts}
          onChange={setStatus}
          onRefresh={() => msg.success("Up to date")}
        />

        <Orderfilterbar
          filters={filters}
          boys={DUMMY_BOYS}
          onChange={patchFilters}
          onClear={clearFilters}
        />

        <Ordertable
          orders={rows}
          loading={false}
          boys={DUMMY_BOYS}
          page={filters.page}
          pageSize={filters.limit}
          total={filtered.length}
          hasFilters={hasFilters}
          onPageChange={(page, limit) =>
            setFilters((f) => ({ ...f, page, limit }))
          }
          onEdit={setEditOrder}
          onCancel={soon("Cancel order dialog")}
          onAssign={handleAssign}
          onCreate={() => setCreateOpen(true)}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Mounted only while open, so every open starts with a clean form. */}
      {(createOpen || editOrder) && (
        <Createordermodal
          open
          order={editOrder}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default DeliveryPage;
