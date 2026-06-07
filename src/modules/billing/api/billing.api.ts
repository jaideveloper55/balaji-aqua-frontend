import api from "../../../lib/axios";

export interface POSProduct {
  id: string;
  name: string;
  sku: string;
  basePrice: number;
  stock: number;
  unit: string;
  status: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

export interface CreateInvoiceItemPayload {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface CreateInvoicePayload {
  invoiceType: "SALE" | "WALK_IN";
  customerId?: string;
  walkInName?: string;
  walkInPhone?: string;
  gstEnabled?: boolean;
  gstRate?: number;
  notes?: string;
  dueDate?: string;
  items: CreateInvoiceItemPayload[];
}

export interface CreatePaymentPayload {
  customerId: string;
  invoiceId?: string;
  amount: number;
  paymentMode: "CASH" | "UPI" | "BANK_TRANSFER" | "CREDIT";
  referenceId?: string;
  notes?: string;
  paymentDate?: string;
}

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  status?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  paymentMode?: "CASH" | "UPI" | "BANK_TRANSFER" | "CREDIT";
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface UpdateInvoicePayload {
  notes?: string;
  dueDate?: string;
}

export interface OutstandingFilters {
  risk?: "HIGH" | "MEDIUM" | "RECENT";
  search?: string;
  sortBy?: "risk" | "amount" | "days" | "lastPaid" | "newest";
  page?: number;
  limit?: number;
}

export interface DailySummaryFilters {
  date?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ── Export ─────────────────────────────────────────────────────────────────
export interface ExportFilters {
  dateFrom?: string;
  dateTo?: string;
  format?: "csv" | "pdf";
}

export const billingApi = {
  getPOSProducts: async (search?: string): Promise<POSProduct[]> => {
    const response = await api.get<POSProduct[]>("/billing/pos/products", {
      params: search ? { search } : {},
    });
    return response.data;
  },

  getCustomerPrice: async (
    customerId: string,
    productId: string
  ): Promise<{ price: number }> => {
    const response = await api.get<{ price: number }>(
      `/billing/pos/customer-price/${customerId}/${productId}`
    );
    return response.data;
  },

  // ── Invoices ───────────────────────────────────────────────────────────

  createInvoice: async (data: CreateInvoicePayload) => {
    const response = await api.post("/billing/invoices", data);
    return response.data;
  },

  listInvoices: async (filters: InvoiceFilters = {}) => {
    const response = await api.get("/billing/invoices", { params: filters });
    return response.data;
  },

  getInvoice: async (id: string) => {
    const response = await api.get(`/billing/invoices/${id}`);
    return response.data;
  },

  cancelInvoice: async (id: string) => {
    const response = await api.patch(`/billing/invoices/${id}/cancel`);
    return response.data;
  },

  updateInvoice: async (id: string, data: UpdateInvoicePayload) => {
    const response = await api.patch(`/billing/invoices/${id}`, data);
    return response.data;
  },

  // ── Payments ───────────────────────────────────────────────────────────

  createPayment: async (data: CreatePaymentPayload) => {
    const response = await api.post("/billing/payments", data);
    return response.data;
  },

  listPayments: async (filters: PaymentFilters = {}) => {
    const response = await api.get("/billing/payments", { params: filters });
    return response.data;
  },

  // ── Outstanding ────────────────────────────────────────────────────────

  getOutstanding: async (filters: OutstandingFilters = {}) => {
    const response = await api.get("/billing/outstanding", { params: filters });
    return response.data;
  },

  // ── Daily Summary ──────────────────────────────────────────────────────

  getDailySummary: async (filters: DailySummaryFilters = {}) => {
    const response = await api.get("/billing/daily-summary", {
      params: filters,
    });
    return response.data;
  },

  // ── Export ─────────────────────────────────────────────────────────────
  // All four return a Blob. The caller triggers the browser download.

  exportInvoices: async (filters: ExportFilters = {}): Promise<Blob> => {
    const response = await api.get("/billing/export/invoices", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  },

  exportPayments: async (filters: ExportFilters = {}): Promise<Blob> => {
    const response = await api.get("/billing/export/payments", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  },

  exportOutstanding: async (filters: ExportFilters = {}): Promise<Blob> => {
    const response = await api.get("/billing/export/outstanding", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  },

  exportDailySummary: async (filters: ExportFilters = {}): Promise<Blob> => {
    const response = await api.get("/billing/export/daily-summary", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  },

  // ── Cart ───────────────────────────────────────────────────────────────

  getCart: async () => {
    const response = await api.get("/billing/cart");
    return response.data;
  },

  addCartItem: async (data: {
    productId: string;
    quantity: number;
    unitPrice?: number;
  }) => {
    const response = await api.post("/billing/cart/items", data);
    return response.data;
  },

  updateCartItem: async (
    itemId: string,
    data: { quantity: number; unitPrice?: number }
  ) => {
    const response = await api.patch(`/billing/cart/items/${itemId}`, data);
    return response.data;
  },

  removeCartItem: async (itemId: string) => {
    const response = await api.delete(`/billing/cart/items/${itemId}`);
    return response.data;
  },

  updateCartSettings: async (data: {
    customerId?: string;
    walkInName?: string;
    walkInPhone?: string;
    invoiceType?: "SALE" | "WALK_IN";
    gstEnabled?: boolean;
    gstRate?: number;
    discount?: number;
    notes?: string;
  }) => {
    const response = await api.patch("/billing/cart/settings", data);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete("/billing/cart");
    return response.data;
  },

  checkout: async (data: {
    dueDate?: string;
    paymentMode?: string;
    referenceId?: string;
    amountPaid?: number;
    payments?: {
      mode: "CASH" | "UPI" | "BANK_TRANSFER";
      amount: number;
      referenceId?: string;
    }[];
  }) => {
    const response = await api.post("/billing/cart/checkout", data);
    return response.data;
  },
};
