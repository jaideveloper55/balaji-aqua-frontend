// ─────────────────────────────────────────────────────────────────────────────
// src/modules/events/api/Events.api.ts
// ─────────────────────────────────────────────────────────────────────────────
// WHY this file exists:
//   Thin wrapper around authAxios — one function per endpoint.
//   Follows the EXACT same pattern as src/modules/expenses/api/Expenses.api.ts
//   so the codebase stays consistent.
//
// PATTERN:
//   • Each function returns the raw axios promise (AxiosResponse)
//   • Unwrapping .data happens at the CALL SITE (in useQuery/useMutation)
//   • Zero business logic here — just network calls
//   • Every function is documented with the backend controller it maps to
// ─────────────────────────────────────────────────────────────────────────────

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
  // Build a clean params object — only include fields that have real values
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

// ══════════════════════════════════════════════════════════════════════════════
// EVENT ORDERS
// Maps to: EventOrdersController → /event-orders
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /event-orders/stats
 * Powers the 4 dashboard stat cards at the top of the page:
 *   6 Total Events · 1 Upcoming · ₹25,512 Total Revenue · ₹11,058 Pending Dues
 *
 * Response shape:
 *   { totalEvents: number, upcomingEvents: number, totalRevenue: number, pendingDues: number }
 *
 * IMPORTANT: This endpoint excludes CANCELLED events from counts/sums
 *   (a cancelled event shouldn't inflate your "total revenue" or "upcoming" count)
 */
export const getEventStatsApi = () => authAxios.get("/event-orders/stats");

/**
 * GET /event-orders?search=&type=&status=&dateFrom=&dateTo=&page=1&limit=20
 * Powers the main Event/Function Orders table with server-side filtering + pagination
 *
 * Response shape:
 *   { data: EventOrder[], pagination: { page, limit, total, totalPages } }
 *
 * WHY server-side pagination (not client-side):
 *   Imagine you have 5,000 events. Shipping ALL of them to the browser just
 *   to show 20 would be slow and waste bandwidth. The backend returns only
 *   the 20 rows for the current page + a total count so you can render
 *   pagination controls ("Page 1 of 250").
 *
 * IMPORTANT for EventTable:
 *   The `data` array IS the current page — do NOT .slice() it again.
 *   If EventTable was doing client-side pagination before, remove that logic.
 */
export const getEventOrdersApi = (filters: EventFilters = {}) =>
  authAxios.get("/event-orders", { params: toQueryParams(filters) });

/**
 * GET /event-orders/:id
 * Full detail for the EventDetailsDrawer — includes:
 *   - items[] (full product snapshots)
 *   - payments[] (every installment with who recorded it)
 *   - customer (linked customer's current info)
 *   - createdBy (which staff member created this event)
 *
 * Used when: user clicks "View" on a table row to open the drawer
 */
export const getEventOrderApi = (id: string) =>
  authAxios.get(`/event-orders/${id}`);

/**
 * POST /event-orders
 * "Create Event Order" modal — final submit on the Payment step (Step 5)
 * Roles: SUPER_ADMIN, ADMIN, STAFF
 *
 * Backend will:
 *   1. Validate all product IDs belong to your company
 *   2. Check stock availability (stock - reserved >= requested quantity)
 *   3. Calculate subtotal/GST/total server-side (never trust frontend math)
 *   4. Reserve stock (increment product.reserved for each item)
 *   5. Log the advance payment if advancePaid > 0
 *   6. Auto-generate eventNumber like "EVT-20260503-001"
 *
 * All of this happens in a Prisma $transaction — either ALL succeed or NONE do.
 */
export const createEventOrderApi = (data: CreateEventOrderPayload) =>
  authAxios.post("/event-orders", data);

/**
 * PATCH /event-orders/:id
 * Edit flow — basic fields only (event/customer/venue/pricing settings)
 * Items and payments have their own dedicated endpoints (stock integrity)
 * Roles: SUPER_ADMIN, ADMIN
 *
 * Cannot update events in CANCELLED or COMPLETED status (backend enforces this)
 */
export const updateEventOrderApi = (
  id: string,
  data: UpdateEventOrderPayload
) => authAxios.patch(`/event-orders/${id}`, data);

/**
 * PATCH /event-orders/:id/status
 * Workflow transitions: CONFIRMED → IN_PROGRESS → DELIVERED → COMPLETED
 *
 * ⚠️ IMPORTANT side effect when status = "DELIVERED":
 *   Backend automatically:
 *     1. Decrements product.stock (real stock goes down)
 *     2. Decrements product.reserved (reservation is fulfilled)
 *     3. Creates StockMovement records for audit trail
 *   This is why status changes go through a dedicated endpoint instead of
 *   a plain PATCH — status transitions can trigger inventory operations.
 *
 * Used by: "Mark In Progress" / "Mark Delivered" / "Mark Complete" buttons
 *   in the EventDetailsDrawer and EventTable action menu
 */
export const updateEventStatusApi = (id: string, status: EventOrderStatus) =>
  authAxios.patch(`/event-orders/${id}/status`, { status });

/**
 * POST /event-orders/:id/cancel
 * CancelEventModal submit — cancels the event and releases reserved stock
 * Roles: SUPER_ADMIN, ADMIN
 *
 * Backend will:
 *   1. Release reserved stock (decrement product.reserved for each item)
 *      — but ONLY if not yet delivered (if delivered, stock is already gone)
 *   2. Set status to CANCELLED
 *   3. Log the cancellation reason, note, timestamp, and who cancelled it
 *
 * The frontend CancelEventModal must send the ENUM VALUE (e.g. "CUSTOMER_POSTPONED"),
 * NOT the button label text (e.g. "Customer postponed event"). The backend's DTO
 * only accepts enum values.
 */
export const cancelEventOrderApi = (
  id: string,
  data: CancelEventOrderPayload
) => authAxios.post(`/event-orders/${id}/cancel`, data);

/**
 * POST /event-orders/:id/payments
 * Records an additional payment against the balance due
 *
 * Examples:
 *   - Customer pays second installment before the event
 *   - Final settlement after delivery
 *
 * Backend will:
 *   1. Validate amount ≤ balanceDue (prevents overpayment)
 *   2. Create EventOrderPayment record with auto-generated paymentNumber
 *   3. Update event's advancePaid, balanceDue, paymentStatus
 *
 * Used in: EventDetailsDrawer "Record Payment" action
 */
export const recordEventPaymentApi = (
  id: string,
  data: RecordEventPaymentPayload
) => authAxios.post(`/event-orders/${id}/payments`, data);

/**
 * DELETE /event-orders/:id
 * Only works on DRAFT events — backend returns 403 for any other status
 *
 * WHY: You never truly "delete" confirmed business records. Once confirmed,
 *   use cancel instead (it preserves the audit trail). Only draft event orders
 *   that were never confirmed can be safely removed.
 *
 * Used by: table row ⋮ menu "Delete" (only shown for DRAFT events)
 */
export const deleteEventOrderApi = (id: string) =>
  authAxios.delete(`/event-orders/${id}`);
