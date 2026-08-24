export type EventType =
  | "WEDDING"
  | "ENGAGEMENT"
  | "BIRTHDAY"
  | "CORPORATE"
  | "RELIGIOUS"
  | "HOUSE_WARMING"
  | "OTHER";

export type EventOrderStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type EventPaymentStatus = "UNPAID" | "PARTIAL" | "PAID";

export type EventCancellationReason =
  | "CUSTOMER_POSTPONED"
  | "CUSTOMER_CANCELLED"
  | "DATE_CHANGED"
  | "PAYMENT_NOT_RECEIVED"
  | "STOCK_UNAVAILABLE"
  | "OTHER";

export type PaymentMode = "CASH" | "UPI" | "BANK_TRANSFER" | "CREDIT" | "CARD";

export interface EventOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/** A payment record logged against an event order */
export interface EventOrderPayment {
  id: string;
  paymentNumber: string;
  amount: number;
  paymentMode: PaymentMode;
  referenceId?: string | null;
  notes?: string | null;
  paymentDate: string;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

/** The full event order object — what GET /event-orders/:id returns */
export interface EventOrder {
  linkedInvoiceItemsCount: number;
  linkedInvoiceNumber: any;
  id: string;
  eventNumber: string; // e.g. "EVT-20260503-001"

  // Event details (Step 1 of the create modal)
  eventName: string;
  eventType: EventType;
  expectedGuests: number;
  eventDate: string; // ISO date string
  deliveryTime: string; // "HH:mm" format
  pickupTime?: string | null;

  // Customer (Step 2)
  customerId?: string | null;
  customerName: string;
  customerPhone: string;

  // Venue (Step 3)
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venuePincode?: string | null;
  onSiteContactName?: string | null;
  onSiteContactPhone?: string | null;

  // Pricing (all calculated on backend, never sent from frontend)
  subtotal: number;
  discount: number;
  gstEnabled: boolean;
  gstRate: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  advancePaid: number;
  securityDeposit: number;
  balanceDue: number;

  // Status
  status: EventOrderStatus;
  paymentStatus: EventPaymentStatus;

  // Cancellation (only populated if status === "CANCELLED")
  cancellationReason?: EventCancellationReason | null;
  cancellationNote?: string | null;
  cancelledAt?: string | null;

  notes?: string | null;

  // Nested relations — always present on list, full detail on single fetch
  items: EventOrderItem[];
  payments?: EventOrderPayment[];

  // Prisma _count — present on list responses for showing badge counts
  _count?: {
    items: number;
    payments: number;
  };

  // Metadata present on single-fetch (not in list for performance)
  customer?: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  } | null;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };

  createdAt: string;
  updatedAt: string;
}

/** Dashboard stat cards — what GET /event-orders/stats returns */
export interface EventOrderStats {
  totalEvents: number;
  upcomingEvents: number;
  totalRevenue: number;
  pendingDues: number;
}

/** Paginated list response from GET /event-orders */
export interface PaginatedEventOrders {
  data: EventOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  WRITE SHAPES — what WE send to the backend (POST / PATCH bodies)
// ═══════════════════════════════════════════════════════════════════════════════

/** A single item in the create form's item array (Step 4) */
export interface CreateEventOrderItemPayload {
  productId: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Full payload for POST /event-orders
 * Matches backend's CreateEventOrderDto — the 5-step "Create Event Order" modal
 *
 * WHY we don't send subtotal/totalAmount/cgst/sgst:
 *   The backend recalculates ALL money amounts from items + discount + gstEnabled.
 *   NEVER trust pricing from the frontend — a hacker could send subtotal=₹1 for
 *   a ₹1,00,000 order. The frontend shows a "preview" total, but the backend is
 *   the source of truth.
 */
export interface CreateEventOrderPayload {
  // Step 1: Event
  eventName: string;
  eventType: EventType;
  expectedGuests: number;
  eventDate: string; // "YYYY-MM-DD" — dayjs.format("YYYY-MM-DD")
  deliveryTime: string; // "HH:mm" — dayjs.format("HH:mm")
  pickupTime?: string;

  // Step 2: Customer
  customerId?: string; // If selecting an existing customer from dropdown
  customerName: string; // Always required (snapshot)
  customerPhone: string; // Always required (snapshot)

  // Step 3: Venue
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venuePincode?: string;
  onSiteContactName?: string;
  onSiteContactPhone?: string;

  // Step 4: Items — at least 1 required
  items: CreateEventOrderItemPayload[];

  // Step 5: Payment
  discount?: number;
  gstEnabled?: boolean;
  advancePaid?: number;
  advancePaymentMode?: PaymentMode;
  securityDeposit?: number;
  notes?: string;
}

/**
 * PATCH payload — everything optional; items/advance excluded
 * WHY items excluded: changing items affects stock reservations, which
 *   requires a dedicated endpoint with transactional stock logic.
 * WHY advance excluded: payments have their own audit trail via
 *   POST /event-orders/:id/payments endpoint.
 */
export type UpdateEventOrderPayload = Partial<
  Omit<CreateEventOrderPayload, "items" | "advancePaid" | "advancePaymentMode">
>;

/** POST /event-orders/:id/cancel body */
export interface CancelEventOrderPayload {
  reason: EventCancellationReason;
  note?: string;
}

/** POST /event-orders/:id/payments body */
export interface RecordEventPaymentPayload {
  amount: number;
  paymentMode: PaymentMode;
  referenceId?: string;
  notes?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FILTER SHAPE — used by EventFilterBar + the events list useQuery
// ═══════════════════════════════════════════════════════════════════════════════
//
// "ALL" is a FRONTEND-ONLY sentinel meaning "no filter applied" — it's
// converted to `undefined` in the API layer's `toQueryParams()` so the
// backend never sees it (the backend's QueryEventOrdersDto only accepts
// real enum values or nothing).
//

export interface EventFilters {
  search?: string;
  eventType?: EventType | "ALL";
  status?: EventOrderStatus | "ALL";
  dateFrom?: string; // "YYYY-MM-DD"
  dateTo?: string; // "YYYY-MM-DD"
  page?: number;
  limit?: number;
}
