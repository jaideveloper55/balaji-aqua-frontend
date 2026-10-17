import dayjs from "dayjs";
import { addDays, slotText, todayIST } from "./Orderconstants";
import type {
  DeliveryBoy,
  Order,
  OrderItem,
  OrderPayload,
  OrderProductOption,
  PickerCustomer,
} from "../types/Orders";

// ── Delivery boys ─────────────────────────────────────────────────────────────────────────────────
const ravi = { id: "u1", name: "Ravi Kumar" };
const suresh = { id: "u2", name: "Suresh Babu" };
const murugan = { id: "u3", name: "Murugan S" };

/** The delivery boys of this company (in the real app: GET /orders/options). */
export const DUMMY_BOYS: DeliveryBoy[] = [
  { ...ravi, phone: "9876500001" },
  { ...suresh, phone: "9876500002" },
  { ...murugan, phone: "9876500003" },
];

// ── Customers ─────────────────────────────────────────────────────────────────────────────────────
const CUSTOMERS = {
  anand: {
    id: "c1",
    name: "Anand Apartments",
    phone: "9876543203",
    area: "Lake View",
  },
  bharath: {
    id: "c2",
    name: "Bharath Mess",
    phone: "9876543211",
    area: "Market Road",
  },
  ganesh: {
    id: "c3",
    name: "Ganesh Tiffin Centre",
    phone: "9876543207",
    area: "Gandhi Nagar",
  },
  kumar: {
    id: "c4",
    name: "Kumar Tea Shop",
    phone: "9876543202",
    area: "Market Street",
  },
  lakshmi: {
    id: "c5",
    name: "Lakshmi Stores",
    phone: "9876543215",
    area: "Anna Nagar",
  },
  balaji: {
    id: "c6",
    name: "Sri Balaji Hotel",
    phone: "9876543220",
    area: "Bus Stand",
  },
  velan: { id: "c7", name: "Velan Medicals", phone: "9876543226", area: "" },
  priya: {
    id: "c8",
    name: "Priya Catering",
    phone: "9876543231",
    area: "Temple Road",
  },
};

// Who owes money / holds jars - shown on the customer card in the order form.
const DUES: Record<string, number> = { c1: 7400, c2: 1800, c4: 70 };
const JARS: Record<string, number> = { c1: 24, c2: 6, c3: 4, c4: 2 };

/** The customer search list in the New Order form (in the real app: GET /customers?search=). */
export const DUMMY_CUSTOMERS: PickerCustomer[] = Object.values(CUSTOMERS).map(
  (c) => ({
    ...c,
    outstandingBalance: DUES[c.id] ?? 0,
    jarsHeld: JARS[c.id] ?? 0,
  })
);

// ── Products & special rates ──────────────────────────────────────────────────────────────────────
const PRODUCTS: Omit<OrderProductOption, "unitPrice" | "isSpecialRate">[] = [
  {
    id: "p20",
    name: "20L Water Can",
    unit: "can",
    basePrice: 35,
    stock: 120,
    isReturnable: true,
  },
  {
    id: "p10",
    name: "10L Water Can",
    unit: "can",
    basePrice: 20,
    stock: 30,
    isReturnable: true,
  },
  {
    id: "p1",
    name: "1L Bottle Box",
    unit: "box",
    basePrice: 120,
    stock: 20,
    isReturnable: false,
  },
  {
    id: "p05",
    name: "500ml Bottle Box",
    unit: "box",
    basePrice: 90,
    stock: 0,
    isReturnable: false,
  }, // out of stock
  {
    id: "pice",
    name: "Ice Pack",
    unit: "pcs",
    basePrice: 40,
    stock: 100,
    isReturnable: false,
  },
];

// customerId -> productId -> the price THIS customer pays
const SPECIAL_RATES: Record<string, Record<string, number>> = {
  c1: { p20: 28, p10: 18 },
  c2: { p20: 30 },
  c4: { p20: 28 },
};

/** Products with a customer's own rates applied (in the real app: GET /orders/options?customerId=). */
export const productsFor = (customerId?: string): OrderProductOption[] =>
  PRODUCTS.map((p) => {
    const special = customerId ? SPECIAL_RATES[customerId]?.[p.id] : undefined;
    const unitPrice = special ?? p.basePrice;
    return { ...p, unitPrice, isSpecialRate: unitPrice !== p.basePrice };
  });

// ── Orders ────────────────────────────────────────────────────────────────────────────────────────
const item = (name: string, qty: number): OrderItem => {
  const p = PRODUCTS.find((x) => x.name === name)!;
  return { productId: p.id, name: p.name, unit: p.unit, qty };
};

// "10 × 20L Water Can +1 more" - the same text the server builds.
const summary = (items: OrderItem[]) =>
  `${items[0]!.qty} × ${items[0]!.name}${
    items.length > 1 ? ` +${items.length - 1} more` : ""
  }`;

type Seed = Pick<Order, "orderNo" | "customer" | "items" | "deliveryDate"> &
  Partial<Order>;

// Fills in the boring defaults so each order below only states what makes it different.
const make = (n: number, o: Seed): Order => ({
  id: `o${n}`,
  status: "PENDING",
  customerId: o.customer.id,
  assignedTo: null,
  slotFrom: null,
  slotTo: null,
  slot: o.slotFrom && o.slotTo ? slotText(o.slotFrom, o.slotTo) : null,
  note: null,
  itemsSummary: summary(o.items),
  cancelReason: null,
  deliveredAt: null,
  bill: null,
  createdAt: dayjs().subtract(n, "hour").toISOString(),
  ...o,
});

/** A function (not a constant) so the dates are fresh every time the page opens. */
export const makeDummyOrders = (): Order[] => {
  const today = todayIST();
  const day = (n: number) => addDays(today, n);

  return [
    // ── today ──
    make(1, {
      orderNo: "ORD-0012",
      customer: CUSTOMERS.anand,
      deliveryDate: day(0),
      assignedTo: ravi,
      slotFrom: "09:00",
      slotTo: "11:00",
      items: [item("20L Water Can", 10), item("1L Bottle Box", 2)],
      note: "Ring the bell twice",
    }),
    make(2, {
      orderNo: "ORD-0011",
      customer: CUSTOMERS.bharath,
      deliveryDate: day(0),
      slotFrom: "10:00",
      slotTo: "12:00",
      items: [item("20L Water Can", 5)],
    }),
    make(3, {
      orderNo: "ORD-0010",
      customer: CUSTOMERS.ganesh,
      deliveryDate: day(0),
      assignedTo: suresh,
      slotFrom: "14:00",
      slotTo: "16:00",
      items: [item("10L Water Can", 12), item("Ice Pack", 4)],
    }),
    make(4, {
      orderNo: "ORD-0009",
      customer: CUSTOMERS.kumar,
      deliveryDate: day(0),
      assignedTo: ravi,
      status: "DELIVERED",
      items: [item("20L Water Can", 2)],
      deliveredAt: dayjs().subtract(1, "hour").toISOString(),
      bill: { id: "b1", invoiceNo: "INV-0031", amount: 56 },
    }),
    make(5, {
      orderNo: "ORD-0008",
      customer: CUSTOMERS.lakshmi,
      deliveryDate: day(0),
      assignedTo: suresh,
      status: "DELIVERED",
      items: [item("1L Bottle Box", 6)],
      deliveredAt: dayjs().subtract(2, "hour").toISOString(),
      bill: { id: "b2", invoiceNo: "INV-0030", amount: 720 },
    }),
    make(6, {
      orderNo: "ORD-0007",
      customer: CUSTOMERS.balaji,
      deliveryDate: day(0),
      status: "CANCELLED",
      items: [item("20L Water Can", 8)],
      cancelReason: "Hotel closed for the day",
    }),

    // ── overdue (pending, day already gone) ──
    make(7, {
      orderNo: "ORD-0006",
      customer: CUSTOMERS.velan,
      deliveryDate: day(-1),
      assignedTo: murugan,
      items: [item("20L Water Can", 3)],
    }),
    make(8, {
      orderNo: "ORD-0005",
      customer: CUSTOMERS.priya,
      deliveryDate: day(-2),
      items: [item("20L Water Can", 30), item("1L Bottle Box", 10)],
      note: "Function order",
    }),

    // ── tomorrow ──
    make(9, {
      orderNo: "ORD-0004",
      customer: CUSTOMERS.anand,
      deliveryDate: day(1),
      assignedTo: ravi,
      slotFrom: "06:00",
      slotTo: "08:00",
      items: [item("20L Water Can", 15)],
    }),
    make(10, {
      orderNo: "ORD-0003",
      customer: CUSTOMERS.bharath,
      deliveryDate: day(1),
      items: [item("20L Water Can", 4)],
    }),

    // ── earlier deliveries ──
    make(11, {
      orderNo: "ORD-0002",
      customer: CUSTOMERS.kumar,
      deliveryDate: day(-1),
      assignedTo: murugan,
      status: "DELIVERED",
      items: [item("20L Water Can", 3)],
      deliveredAt: dayjs().subtract(1, "day").toISOString(),
      bill: { id: "b3", invoiceNo: "INV-0029", amount: 84 },
    }),
    make(12, {
      orderNo: "ORD-0001",
      customer: CUSTOMERS.ganesh,
      deliveryDate: day(-3),
      assignedTo: suresh,
      status: "DELIVERED",
      items: [item("10L Water Can", 20)],
      deliveredAt: dayjs().subtract(3, "day").toISOString(),
      bill: { id: "b4", invoiceNo: "INV-0027", amount: 360 },
    }),
  ];
};

// ── Pretend backend: what "Save" does ─────────────────────────────────────────────────────────────
/**
 * The real server will do this on POST /orders and PATCH /orders/:id: check the payload, number the
 * order and build the response. Here we do it in the browser so the list reacts to Save.
 */
export function applyDummySave(
  orders: Order[],
  payload: OrderPayload,
  editing?: Order | null
): { orders: Order[]; saved: Order } {
  const customer = DUMMY_CUSTOMERS.find((c) => c.id === payload.customerId)!;
  const boy = DUMMY_BOYS.find((b) => b.id === payload.assignedToId);
  const items: OrderItem[] = payload.items.map((i) => {
    const p = PRODUCTS.find((x) => x.id === i.productId)!;
    return { productId: p.id, name: p.name, unit: p.unit, qty: i.quantity };
  });

  const fields = {
    customerId: customer.id,
    customer: {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      area: customer.area ?? "",
    },
    assignedTo: boy ? { id: boy.id, name: boy.name } : null,
    deliveryDate: payload.deliveryDate,
    slotFrom: payload.slotFrom,
    slotTo: payload.slotTo,
    slot:
      payload.slotFrom && payload.slotTo
        ? slotText(payload.slotFrom, payload.slotTo)
        : null,
    note: payload.note,
    items,
    itemsSummary: summary(items),
  };

  if (editing) {
    const saved: Order = { ...editing, ...fields };
    return {
      orders: orders.map((o) => (o.id === editing.id ? saved : o)),
      saved,
    };
  }

  // New order: the number after the highest one we have (the server uses a safe counter).
  const next =
    Math.max(0, ...orders.map((o) => Number(o.orderNo.replace(/\D/g, "")))) + 1;
  const saved: Order = {
    id: `o${Date.now()}`,
    orderNo: `ORD-${String(next).padStart(4, "0")}`,
    status: "PENDING",
    cancelReason: null,
    deliveredAt: null,
    bill: null,
    createdAt: new Date().toISOString(),
    ...fields,
  };
  return { orders: [saved, ...orders], saved };
}
