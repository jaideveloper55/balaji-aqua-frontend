import authAxios from "../../../lib/axios";

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

export interface ExportFilters {
  dateFrom?: string;
  dateTo?: string;
  format?: "csv" | "pdf";
}

// POS

export const getPOSProductsApi = (search?: string) =>
  authAxios.get("/products", {
    params: {
      search,
      isSellable: true,
      pageSize: 100,
      status: "ACTIVE",
    },
  });
export const getCustomerPriceApi = (customerId: string, productId: string) => {
  return authAxios.get(
    `/billing/pos/customer-price/${customerId}/${productId}`
  );
};

// Invoices

export const createInvoiceApi = (data: CreateInvoicePayload) => {
  return authAxios.post("/billing/invoices", data);
};

export const getInvoicesApi = (filters: InvoiceFilters = {}) => {
  return authAxios.get("/billing/invoices", { params: filters });
};

export const getInvoiceApi = (id: string) => {
  return authAxios.get(`/billing/invoices/${id}`);
};

export const cancelInvoiceApi = (id: string) => {
  return authAxios.patch(`/billing/invoices/${id}/cancel`);
};

export const updateInvoiceApi = (id: string, data: UpdateInvoicePayload) => {
  return authAxios.patch(`/billing/invoices/${id}`, data);
};

// Payments

export const createPaymentApi = (data: CreatePaymentPayload) => {
  return authAxios.post("/billing/payments", data);
};

export const getPaymentsApi = (filters: PaymentFilters = {}) => {
  return authAxios.get("/billing/payments", { params: filters });
};

// ─── Outstanding ──────────────────────────────────────────────────────────

export const getOutstandingApi = (filters: OutstandingFilters = {}) => {
  return authAxios.get("/billing/outstanding", { params: filters });
};

// ─── Daily Summary ────────────────────────────────────────────────────────

export const getDailySummaryApi = (filters: DailySummaryFilters = {}) => {
  return authAxios.get("/billing/daily-summary", { params: filters });
};

// ─── Export (all return Blob via responseType) ─────────────────────────────

export const exportInvoicesApi = (filters: ExportFilters = {}) => {
  return authAxios.get("/billing/export/invoices", {
    params: filters,
    responseType: "blob",
  });
};

export const exportPaymentsApi = (filters: ExportFilters = {}) => {
  return authAxios.get("/billing/export/payments", {
    params: filters,
    responseType: "blob",
  });
};

export const exportOutstandingApi = (filters: ExportFilters = {}) => {
  return authAxios.get("/billing/export/outstanding", {
    params: filters,
    responseType: "blob",
  });
};

export const exportDailySummaryApi = (filters: ExportFilters = {}) => {
  return authAxios.get("/billing/export/daily-summary", {
    params: filters,
    responseType: "blob",
  });
};

// ─── Cart ───────────────────────────────────────────────────────────────────

export const getCartApi = () => {
  return authAxios.get("/billing/cart");
};

export const addCartItemApi = (data: {
  productId: string;
  quantity: number;
  unitPrice?: number;
}) => {
  return authAxios.post("/billing/cart/items", data);
};

export const updateCartItemApi = (
  itemId: string,
  data: { quantity: number; unitPrice?: number }
) => {
  return authAxios.patch(`/billing/cart/items/${itemId}`, data);
};

export const removeCartItemApi = (itemId: string) => {
  return authAxios.delete(`/billing/cart/items/${itemId}`);
};

export const updateCartSettingsApi = (data: {
  customerId?: string;
  walkInName?: string;
  walkInPhone?: string;
  invoiceType?: "SALE" | "WALK_IN";
  gstEnabled?: boolean;
  gstRate?: number;
  discount?: number;
  notes?: string;
}) => {
  return authAxios.patch("/billing/cart/settings", data);
};

export const clearCartApi = () => {
  return authAxios.delete("/billing/cart");
};

export const checkoutApi = (data: {
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
  return authAxios.post("/billing/cart/checkout", data);
};
