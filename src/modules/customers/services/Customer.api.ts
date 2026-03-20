import type {
  Customer,
  CustomerPricing,
  CustomerPricingFormValues,
  LedgerEntry,
  Product,
  CustomerFormValues,
  CustomerListParams,
  PaginatedResponse,
} from "../types/Customer";

// ─── Mock Products (Master list) ─────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: "PRD-001",
    name: "20L Water Can",
    sku: "WC-20L",
    unit: "can",
    basePrice: 40,
  },
  {
    id: "PRD-002",
    name: "1L Water Bottle",
    sku: "WB-1L",
    unit: "bottle",
    basePrice: 20,
  },
  {
    id: "PRD-003",
    name: "500ml Water Bottle",
    sku: "WB-500ML",
    unit: "bottle",
    basePrice: 12,
  },
  {
    id: "PRD-004",
    name: "5L Water Jar",
    sku: "WJ-5L",
    unit: "jar",
    basePrice: 25,
  },
  {
    id: "PRD-005",
    name: "Dispenser Rental",
    sku: "DSP-RENT",
    unit: "month",
    basePrice: 150,
  },
  {
    id: "PRD-006",
    name: "2L Water Bottle",
    sku: "WB-2L",
    unit: "bottle",
    basePrice: 30,
  },
];

// ─── Mock Customers ──────────────────────────────────────────────────────────

const CUSTOMERS: Customer[] = [
  {
    id: "CUS-001",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh@example.com",
    type: "residential",
    status: "active",
    address: {
      line1: "12, Anna Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040",
    },
    deliveryFrequency: "daily",
    paymentMode: "upi",
    outstandingBalance: 1250,
    totalOrders: 156,
    joinedAt: "2024-03-15",
    lastOrderAt: "2026-03-19",
  },
  {
    id: "CUS-002",
    name: "Priya Sharma",
    phone: "+91 87654 32109",
    email: "priya.s@example.com",
    type: "residential",
    status: "active",
    address: {
      line1: "45, T. Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
    },
    deliveryFrequency: "alternate",
    paymentMode: "cash",
    outstandingBalance: 0,
    totalOrders: 89,
    joinedAt: "2024-06-22",
    lastOrderAt: "2026-03-18",
  },
  {
    id: "CUS-003",
    name: "Chennai IT Park Pvt Ltd",
    phone: "+91 44 2345 6789",
    email: "admin@chennaiitp.com",
    type: "commercial",
    status: "active",
    address: {
      line1: "Sholinganallur IT Corridor",
      line2: "Block C, Floor 3",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600119",
    },
    deliveryFrequency: "daily",
    paymentMode: "bank_transfer",
    outstandingBalance: 18500,
    totalOrders: 412,
    joinedAt: "2023-11-01",
    lastOrderAt: "2026-03-20",
  },
  {
    id: "CUS-004",
    name: "Murugan Enterprises",
    phone: "+91 98123 45678",
    type: "industrial",
    status: "active",
    address: {
      line1: "SIDCO Industrial Estate",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600032",
    },
    deliveryFrequency: "weekly",
    paymentMode: "credit",
    outstandingBalance: 45000,
    totalOrders: 78,
    joinedAt: "2024-01-10",
    lastOrderAt: "2026-03-15",
  },
  {
    id: "CUS-005",
    name: "Lakshmi Apartments",
    phone: "+91 99887 76655",
    email: "lakshmi.apt@example.com",
    type: "residential",
    status: "inactive",
    address: {
      line1: "22, Velachery Main Rd",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600042",
    },
    deliveryFrequency: "on_demand",
    paymentMode: "upi",
    outstandingBalance: 500,
    totalOrders: 23,
    joinedAt: "2025-02-14",
    lastOrderAt: "2026-01-05",
  },
  {
    id: "CUS-006",
    name: "Arun Hotels & Restaurants",
    phone: "+91 98765 11223",
    email: "arun.hotels@example.com",
    type: "commercial",
    status: "pending",
    address: {
      line1: "Mount Road",
      line2: "Near Gemini Circle",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600006",
    },
    deliveryFrequency: "daily",
    paymentMode: "bank_transfer",
    outstandingBalance: 0,
    totalOrders: 0,
    joinedAt: "2026-03-18",
  },
  {
    id: "CUS-007",
    name: "Sathya Moorthy",
    phone: "+91 90909 12345",
    type: "residential",
    status: "active",
    address: {
      line1: "78, Adyar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600020",
    },
    deliveryFrequency: "daily",
    paymentMode: "cash",
    outstandingBalance: 300,
    totalOrders: 210,
    joinedAt: "2023-08-05",
    lastOrderAt: "2026-03-20",
  },
  {
    id: "CUS-008",
    name: "Global Beverages Factory",
    phone: "+91 44 6789 1234",
    email: "ops@globalbev.in",
    type: "industrial",
    status: "active",
    address: {
      line1: "Ambattur Industrial Estate",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600058",
    },
    deliveryFrequency: "daily",
    paymentMode: "credit",
    outstandingBalance: 125000,
    totalOrders: 890,
    joinedAt: "2022-05-10",
    lastOrderAt: "2026-03-20",
  },
];

let CUSTOMER_PRICING: CustomerPricing[] = [
  {
    id: "CP-001",
    customerId: "CUS-001",
    productId: "PRD-001",
    productName: "20L Water Can",
    sku: "WC-20L",
    unit: "can",
    basePrice: 40,
    customerPrice: 35,
    effectiveFrom: "2026-01-01",
    isActive: true,
    createdAt: "2025-12-28",
  },
  {
    id: "CP-002",
    customerId: "CUS-001",
    productId: "PRD-004",
    productName: "5L Water Jar",
    sku: "WJ-5L",
    unit: "jar",
    basePrice: 25,
    customerPrice: 22,
    effectiveFrom: "2026-01-01",
    isActive: true,
    createdAt: "2025-12-28",
  },
  {
    id: "CP-003",
    customerId: "CUS-003",
    productId: "PRD-001",
    productName: "20L Water Can",
    sku: "WC-20L",
    unit: "can",
    basePrice: 40,
    customerPrice: 30,
    effectiveFrom: "2026-01-01",
    isActive: true,
    createdAt: "2025-12-20",
  },
  {
    id: "CP-004",
    customerId: "CUS-003",
    productId: "PRD-002",
    productName: "1L Water Bottle",
    sku: "WB-1L",
    unit: "bottle",
    basePrice: 20,
    customerPrice: 15,
    effectiveFrom: "2026-01-01",
    isActive: true,
    createdAt: "2025-12-20",
  },
  {
    id: "CP-005",
    customerId: "CUS-003",
    productId: "PRD-005",
    productName: "Dispenser Rental",
    sku: "DSP-RENT",
    unit: "month",
    basePrice: 150,
    customerPrice: 100,
    effectiveFrom: "2026-02-01",
    isActive: true,
    createdAt: "2026-01-25",
  },
  {
    id: "CP-006",
    customerId: "CUS-004",
    productId: "PRD-001",
    productName: "20L Water Can",
    sku: "WC-20L",
    unit: "can",
    basePrice: 40,
    customerPrice: 28,
    effectiveFrom: "2025-06-01",
    isActive: true,
    createdAt: "2025-05-28",
  },
  {
    id: "CP-007",
    customerId: "CUS-008",
    productId: "PRD-001",
    productName: "20L Water Can",
    sku: "WC-20L",
    unit: "can",
    basePrice: 40,
    customerPrice: 25,
    effectiveFrom: "2025-01-01",
    isActive: true,
    createdAt: "2024-12-20",
  },
  {
    id: "CP-008",
    customerId: "CUS-008",
    productId: "PRD-006",
    productName: "2L Water Bottle",
    sku: "WB-2L",
    unit: "bottle",
    basePrice: 30,
    customerPrice: 22,
    effectiveFrom: "2025-01-01",
    isActive: true,
    createdAt: "2024-12-20",
  },
];

const LEDGER: LedgerEntry[] = [
  {
    id: "LED-001",
    date: "2026-03-20",
    type: "invoice",
    description: "Invoice #INV-2026-0342 — 10x 20L Can",
    debit: 350,
    credit: 0,
    balance: 1250,
    referenceNo: "INV-2026-0342",
  },
  {
    id: "LED-002",
    date: "2026-03-18",
    type: "payment",
    description: "UPI Payment received",
    debit: 0,
    credit: 900,
    balance: 900,
    referenceNo: "UPI-REF-98234",
  },
  {
    id: "LED-003",
    date: "2026-03-15",
    type: "invoice",
    description: "Invoice #INV-2026-0318 — 8x 20L Can",
    debit: 280,
    credit: 0,
    balance: 1800,
    referenceNo: "INV-2026-0318",
  },
  {
    id: "LED-004",
    date: "2026-03-12",
    type: "credit_note",
    description: "Return — 2x damaged cans",
    debit: 0,
    credit: 70,
    balance: 1520,
    referenceNo: "CN-2026-0045",
  },
  {
    id: "LED-005",
    date: "2026-03-10",
    type: "payment",
    description: "Cash payment received",
    debit: 0,
    credit: 500,
    balance: 1590,
    referenceNo: "CASH-0312",
  },
  {
    id: "LED-006",
    date: "2026-03-08",
    type: "invoice",
    description: "Invoice #INV-2026-0290 — 12x 20L Can",
    debit: 420,
    credit: 0,
    balance: 2090,
    referenceNo: "INV-2026-0290",
  },
  {
    id: "LED-007",
    date: "2026-03-05",
    type: "debit_note",
    description: "Late payment fee — Feb 2026",
    debit: 50,
    credit: 0,
    balance: 1670,
    referenceNo: "DN-2026-0012",
  },
  {
    id: "LED-008",
    date: "2026-03-01",
    type: "payment",
    description: "UPI Payment received",
    debit: 0,
    credit: 1200,
    balance: 1620,
    referenceNo: "UPI-REF-87122",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
let cpCounter = CUSTOMER_PRICING.length;

// ─── API ─────────────────────────────────────────────────────────────────────

export const customerApi = {
  // Customers
  async getCustomers(
    params?: CustomerListParams,
  ): Promise<PaginatedResponse<Customer>> {
    await delay(500);
    let data = [...CUSTOMERS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.id.toLowerCase().includes(q),
      );
    }
    if (params?.status) data = data.filter((c) => c.status === params.status);
    if (params?.type) data = data.filter((c) => c.type === params.type);
    const total = data.length;
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    data = data.slice((page - 1) * pageSize, page * pageSize);
    return { data, total, page, pageSize };
  },

  async getCustomerById(id: string): Promise<Customer | undefined> {
    await delay(300);
    return CUSTOMERS.find((c) => c.id === id);
  },

  async createCustomer(values: CustomerFormValues): Promise<Customer> {
    await delay(700);
    const c: Customer = {
      id: `CUS-${String(CUSTOMERS.length + 1).padStart(3, "0")}`,
      name: values.name,
      phone: values.phone,
      email: values.email,
      type: values.type,
      status: "pending",
      address: {
        line1: values.addressLine1,
        line2: values.addressLine2,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        landmark: values.landmark,
      },
      deliveryFrequency: values.deliveryFrequency,
      paymentMode: values.paymentMode,
      outstandingBalance: 0,
      totalOrders: 0,
      joinedAt: new Date().toISOString().split("T")[0],
      notes: values.notes,
    };
    CUSTOMERS.push(c);
    return c;
  },

  // Products (master list for pricing dropdown)
  async getProducts(): Promise<Product[]> {
    await delay(200);
    return [...PRODUCTS];
  },

  // Per-Customer Pricing
  async getCustomerPricing(customerId: string): Promise<CustomerPricing[]> {
    await delay(400);
    return CUSTOMER_PRICING.filter((p) => p.customerId === customerId);
  },

  async createCustomerPricing(
    customerId: string,
    values: CustomerPricingFormValues,
  ): Promise<CustomerPricing> {
    await delay(500);
    const product = PRODUCTS.find((p) => p.id === values.productId);
    if (!product) throw new Error("Product not found");
    cpCounter++;
    const cp: CustomerPricing = {
      id: `CP-${String(cpCounter).padStart(3, "0")}`,
      customerId,
      productId: values.productId,
      productName: product.name,
      sku: product.sku,
      unit: product.unit,
      basePrice: product.basePrice,
      customerPrice: values.customerPrice,
      effectiveFrom: values.effectiveFrom,
      effectiveTo: values.effectiveTo,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
    };
    CUSTOMER_PRICING.push(cp);
    return cp;
  },

  async updateCustomerPricing(
    pricingId: string,
    values: Partial<CustomerPricingFormValues>,
  ): Promise<CustomerPricing> {
    await delay(400);
    const idx = CUSTOMER_PRICING.findIndex((p) => p.id === pricingId);
    if (idx === -1) throw new Error("Pricing not found");
    CUSTOMER_PRICING[idx] = {
      ...CUSTOMER_PRICING[idx],
      ...values,
    } as CustomerPricing;
    return CUSTOMER_PRICING[idx];
  },

  async deleteCustomerPricing(pricingId: string): Promise<void> {
    await delay(300);
    CUSTOMER_PRICING = CUSTOMER_PRICING.filter((p) => p.id !== pricingId);
  },

  // Ledger
  async getCustomerLedger(customerId: string): Promise<LedgerEntry[]> {
    await delay(400);
    return [...LEDGER];
  },
};
