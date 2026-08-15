import authAxios from "../../../lib/axios";
import type {
  EventFilters,
  EventOrderStatus,
  CreateEventOrderPayload,
  UpdateEventOrderPayload,
  CancelEventOrderPayload,
  RecordEventPaymentPayload,
} from "../types/Events";

const toQueryParams = (filters: EventFilters = {}) => {
  const params: Record<string, string | number | undefined> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
  };

  // Only add search if non-empty (avoids sending search="" which returns nothing)
  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  // Convert "ALL" sentinel → undefined (don't send the param at all)
  if (filters.eventType && filters.eventType !== "ALL") {
    params.type = filters.eventType; // NOTE: backend param is "type", not "eventType"
  }

  if (filters.status && filters.status !== "ALL") {
    params.status = filters.status;
  }

  // Date range — only include if provided
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;

  return params;
};

export const getEventStatsApi = () => authAxios.get("/event-orders/stats");

export const getEventOrdersApi = (filters: EventFilters = {}) =>
  authAxios.get("/event-orders", { params: toQueryParams(filters) });

export const getEventOrderApi = (id: string) =>
  authAxios.get(`/event-orders/${id}`);

export const createEventOrderApi = (data: CreateEventOrderPayload) =>
  authAxios.post("/event-orders", data);

export const updateEventOrderApi = (
  id: string,
  data: UpdateEventOrderPayload
) => authAxios.patch(`/event-orders/${id}`, data);

export const updateEventStatusApi = (id: string, status: EventOrderStatus) =>
  authAxios.patch(`/event-orders/${id}/status`, { status });

export const cancelEventOrderApi = (
  id: string,
  data: CancelEventOrderPayload
) => authAxios.post(`/event-orders/${id}/cancel`, data);

export const recordEventPaymentApi = (
  id: string,
  data: RecordEventPaymentPayload
) => authAxios.post(`/event-orders/${id}/payments`, data);

export const deleteEventOrderApi = (id: string) =>
  authAxios.delete(`/event-orders/${id}`);
