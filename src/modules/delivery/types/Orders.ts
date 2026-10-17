export type OrderStatus = "PENDING" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  productId: string;
  name: string;
  unit: string;
  qty: number;
}

export interface OrderCustomer {
  id: string;
  name: string;
  phone: string;
  area: string;
}

export interface OrderAssignee {
  id: string;
  name: string;
}

/** Present only after the delivery boy has billed the order on his phone. */
export interface OrderBill {
  id: string;
  invoiceNo: string;
  amount: number; // rupees
}

export interface Order {
  id: string;
  orderNo: string; // "ORD-0007"
  status: OrderStatus;
  customerId: string;
  customer: OrderCustomer;
  assignedTo: OrderAssignee | null; // null = nobody assigned yet
  deliveryDate: string; // "YYYY-MM-DD"
  slot: string | null; // "10 AM–12 PM" (ready to show) or null = any time
  slotFrom: string | null; // "10:00"
  slotTo: string | null; // "12:00"
  note: string | null;
  items: OrderItem[];
  itemsSummary: string; // "10 × 20L Water Can +1 more" (ready to show)
  cancelReason: string | null;
  deliveredAt: string | null;
  bill: OrderBill | null;
  createdAt: string; // ISO date-time
}

/** Numbers on the status tabs. */
export interface OrderCounts {
  all: number;
  PENDING: number;
  DELIVERED: number;
  CANCELLED: number;
}

/** The four cards on top of the page. */
export interface OrderStats {
  today: {
    total: number;
    pending: number;
    delivered: number;
    cancelled: number;
  };
  overdue: number; // PENDING and the delivery day has passed
  unassigned: number; // PENDING and no delivery boy yet
}

export interface DeliveryBoy {
  id: string;
  name: string;
  phone: string | null;
}

/** Everything the filter bar + tabs can change. Empty/undefined = "don't filter by this". */
export interface OrderFilters {
  search?: string;
  status?: OrderStatus;
  assignedToId?: string;
  unassigned?: boolean;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
}

// ─── The New / Edit order form ────────────────────────────────────────────────────────────────────

/** A customer as the order form's search list shows them. */
export interface PickerCustomer {
  id: string;
  name: string;
  phone: string;
  area?: string | null;
  outstandingBalance?: number | null; // rupees this customer still owes
  jarsHeld?: number | null; // returnable jars currently with the customer
}

/** A product as the form needs it. `unitPrice` is already THIS customer's rate. */
export interface OrderProductOption {
  id: string;
  name: string;
  unit: string;
  basePrice: number; // the normal price
  unitPrice: number; // what this customer pays (== basePrice unless they have a special rate)
  isSpecialRate: boolean;
  stock: number;
  isReturnable: boolean;
}

/** Everything react-hook-form keeps while the modal is open. */
export interface OrderFormValues {
  customerId: string;
  customerSearch: string; // only feeds the search box, never saved
  deliveryDate: string; // "YYYY-MM-DD"
  slot: string; // "10:00-12:00" or "" = any time
  assignedToId: string; // "" = assign later
  note: string;
  productSearch: string; // only feeds the search box, never saved
  /** productId -> quantity as typed. Keys are prefixed "q_" (see qtyKey) so ids can never look like array indexes. */
  qty: Record<string, string>;
}

/** What the form hands over when you press Save - the same shape POST /orders and PATCH /orders/:id will take. */
export interface OrderPayload {
  customerId: string;
  items: { productId: string; quantity: number }[];
  deliveryDate: string;
  slotFrom: string | null;
  slotTo: string | null;
  assignedToId: string | null; // null = nobody yet
  note: string | null;
}
