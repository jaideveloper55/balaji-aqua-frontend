import authAxios from "../../../lib/axios";
import type { CustomerPricingFormValues } from "../types/Customer";

// Customer Pricing API

// GET /customers/:customerId/pricing
export const getCustomerPricingApi = (customerId: string) => {
  return authAxios.get(`/customers/${customerId}/pricing`);
};

// POST /customers/:customerId/pricing
export const createCustomerPricingApi = (
  customerId: string,
  data: CustomerPricingFormValues
) => {
  return authAxios.post(`/customers/${customerId}/pricing`, data);
};

// PATCH /customers/:customerId/pricing/:pricingId
export const updateCustomerPricingApi = (
  customerId: string,
  pricingId: string,
  data: Partial<CustomerPricingFormValues>
) => {
  return authAxios.patch(`/customers/${customerId}/pricing/${pricingId}`, data);
};

// DELETE /customers/:customerId/pricing/:pricingId
export const removeCustomerPricingApi = (
  customerId: string,
  pricingId: string
) => {
  return authAxios.delete(`/customers/${customerId}/pricing/${pricingId}`);
};

// ─── Products API ──────────────────────────────────────────────────────────

// GET /products
export const getProductsApi = (
  page: number,
  pageSize: number,
  sortBy: string = "name",
  sortOrder: string = "asc",
  isSellable: boolean = true
) => {
  return authAxios.get("/products", {
    params: {
      page,
      pageSize,
      sortBy,
      sortOrder,
      isSellable,
    },
  });
};
