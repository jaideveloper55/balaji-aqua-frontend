import api from "../../../lib/axios";
import type {
  Customer,
  CustomerDetail,
  CustomerListResponse,
  CustomerQuery,
  CustomerStatsResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../../customers/types/Customer";

export const customersApi = {
  // GET /customers — paginated + filtered list
  list: async (query: CustomerQuery = {}): Promise<CustomerListResponse> => {
    const response = await api.get<CustomerListResponse>("/customers", {
      params: query,
    });
    return response.data;
  },

  // GET /customers/:id — basic info
  getOne: async (id: string): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  // GET /customers/:id/detail — full info with summary cards
  getDetail: async (id: string): Promise<CustomerDetail> => {
    const response = await api.get<CustomerDetail>(`/customers/${id}/detail`);
    return response.data;
  },

  // GET /customers/stats — high-level stats
  getStats: async (): Promise<CustomerStatsResponse> => {
    const response = await api.get<CustomerStatsResponse>("/customers/stats");
    return response.data;
  },

  // POST /customers
  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await api.post<Customer>("/customers", data);
    return response.data;
  },

  // PATCH /customers/:id
  update: async (
    id: string,
    data: UpdateCustomerRequest
  ): Promise<Customer> => {
    const response = await api.patch<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  // DELETE /customers/:id
  remove: async (id: string): Promise<{ message: string; id: string }> => {
    const response = await api.delete<{ message: string; id: string }>(
      `/customers/${id}`
    );
    return response.data;
  },
};
