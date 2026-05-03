import { useMemo, useState } from "react";
import { DUMMY_EVENTS } from "../data/eventsdummy";
import type {
  EventOrder,
  EventFilters,
  EventStats,
  CreateEventForm,
} from "../types/Events";

export const useEvents = () => {
  const [events, setEvents] = useState<EventOrder[]>(DUMMY_EVENTS);

  const stats: EventStats = useMemo(() => {
    const now = new Date();
    return {
      totalEvents: events.length,
      upcomingEvents: events.filter(
        (e) =>
          new Date(e.eventDate) >= now &&
          e.status !== "CANCELLED" &&
          e.status !== "COMPLETED"
      ).length,
      totalRevenue: events
        .filter((e) => e.status !== "CANCELLED")
        .reduce((s, e) => s + e.totalAmount, 0),
      pendingDues: events
        .filter((e) => e.status !== "CANCELLED")
        .reduce((s, e) => s + e.balanceDue, 0),
    };
  }, [events]);

  const filterEvents = (filters: EventFilters) => {
    return events.filter((e) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack =
          `${e.eventNumber} ${e.eventName} ${e.customerName} ${e.customerPhone} ${e.venueName}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (
        filters.status &&
        filters.status !== "ALL" &&
        e.status !== filters.status
      )
        return false;
      if (
        filters.eventType &&
        filters.eventType !== "ALL" &&
        e.eventType !== filters.eventType
      )
        return false;
      if (filters.dateRange) {
        const [from, to] = filters.dateRange;
        const ed = new Date(e.eventDate).getTime();
        if (from && ed < new Date(from).getTime()) return false;
        if (to && ed > new Date(to).getTime()) return false;
      }
      return true;
    });
  };

  const createEvent = (form: CreateEventForm) => {
    const subtotal = form.items.reduce(
      (s, it) => s + it.quantity * it.unitPrice,
      0
    );
    const discount = form.discount ?? 0;
    const taxable = subtotal - discount;
    const gstAmount = form.gstEnabled ? taxable * 0.18 : 0;
    const totalAmount = taxable + gstAmount;
    const advancePaid = form.advancePaid ?? 0;
    const securityDeposit = form.securityDeposit ?? 0;
    const balanceDue = totalAmount - advancePaid;

    const next: EventOrder = {
      id: `e${Date.now()}`,
      eventNumber: `EVT-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${String(events.length + 1).padStart(3, "0")}`,
      customerId: form.customerId ?? null,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      eventType: form.eventType,
      eventName: form.eventName,
      status: "CONFIRMED",
      paymentStatus:
        balanceDue <= 0 ? "PAID" : advancePaid > 0 ? "PARTIAL" : "UNPAID",
      eventDate: form.eventDate,
      deliveryTime: form.deliveryTime,
      pickupTime: form.pickupTime,
      venueName: form.venueName,
      venueAddress: form.venueAddress,
      venueCity: form.venueCity,
      venuePincode: form.venuePincode,
      contactPersonName: form.contactPersonName,
      contactPersonPhone: form.contactPersonPhone,
      expectedGuests: form.expectedGuests,
      items: form.items.map((it, idx) => ({
        id: `new-${idx}`,
        productId: it.productId,
        productName: it.productName,
        sku: "",
        unit: "PCS",
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        lineTotal: it.quantity * it.unitPrice,
      })),
      subtotal,
      discount,
      gstEnabled: form.gstEnabled,
      gstAmount,
      totalAmount,
      advancePaid,
      securityDeposit,
      balanceDue,
      notes: form.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEvents((prev) => [next, ...prev]);
    return next;
  };

  const updateStatus = (id: string, status: EventOrder["status"]) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status, updatedAt: new Date().toISOString() } : e
      )
    );
  };

  const cancelEvent = (id: string, reason: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: "CANCELLED",
              notes: `${e.notes ?? ""}\nCancellation: ${reason}`.trim(),
              updatedAt: new Date().toISOString(),
            }
          : e
      )
    );
  };

  return {
    events,
    stats,
    filterEvents,
    createEvent,
    updateStatus,
    cancelEvent,
  };
};
