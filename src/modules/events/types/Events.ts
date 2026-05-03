// ─── Event Order Types ──────────────────────────────────────────────────────
export type EventType =
  | "WEDDING"
  | "ENGAGEMENT"
  | "BIRTHDAY"
  | "CORPORATE"
  | "RELIGIOUS"
  | "HOUSE_WARMING"
  | "OTHER";

export type EventStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID";

export interface EventItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface EventOrder {
  id: string;
  eventNumber: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;

  eventType: EventType;
  eventName: string;
  status: EventStatus;
  paymentStatus: PaymentStatus;

  // Schedule
  eventDate: string; // ISO
  deliveryTime: string; // "10:00"
  pickupTime?: string | null;

  // Venue
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venuePincode?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;

  expectedGuests: number;

  items: EventItem[];

  // Money
  subtotal: number;
  discount: number;
  gstEnabled: boolean;
  gstAmount: number;
  totalAmount: number;
  advancePaid: number;
  securityDeposit: number;
  balanceDue: number;

  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Filter / Form Types ────────────────────────────────────────────────────
export interface EventFilters {
  search?: string;
  status?: EventStatus | "ALL";
  eventType?: EventType | "ALL";
  dateRange?: [string, string] | null;
  page?: number;
  limit?: number;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  totalRevenue: number;
  pendingDues: number;
}

export interface CreateEventForm {
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  eventType: EventType;
  eventName: string;
  eventDate: string;
  deliveryTime: string;
  pickupTime?: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venuePincode?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;
  expectedGuests: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  discount?: number;
  gstEnabled: boolean;
  advancePaid?: number;
  securityDeposit?: number;
  notes?: string;
}
