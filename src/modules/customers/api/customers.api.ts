import authAxios from "../../../lib/axios";
import type {
  CustomerQuery,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../types/Customer";

// GET /customers — paginated + filtered list
export const getCustomersApi = (query: CustomerQuery = {}) => {
  return authAxios.get("/customers", { params: query });
};

// GET /customers/:id — basic info
export const getCustomerApi = (id: string) => {
  return authAxios.get(`/customers/${id}`);
};

// GET /customers/:id/detail — full info with summary cards
export const getCustomerDetailApi = (id: string) => {
  return authAxios.get(`/customers/${id}/detail`);
};

// GET /customers/stats — high-level stats
export const getCustomerStatsApi = () => {
  return authAxios.get("/customers/stats");
};

// POST /customers
export const createCustomerApi = (data: CreateCustomerRequest) => {
  return authAxios.post("/customers", data);
};

// PATCH /customers/:id
export const updateCustomerApi = (id: string, data: UpdateCustomerRequest) => {
  return authAxios.patch(`/customers/${id}`, data);
};

// DELETE /customers/:id
export const removeCustomerApi = (id: string) => {
  return authAxios.delete(`/customers/${id}`);
};
