import api from "../../../lib/axios";
import type {
  Product,
  ProductAlert,
  ProductQueryParams,
  ProductStats,
  PaginatedResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/Product";

export const productsApi = {
  // GET /products?search=...&page=1...
  list: async (
    params: ProductQueryParams = {}
  ): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<PaginatedResponse<Product>>("/products", {
      params,
    });
    return data;
  },

  // GET /products/stats
  stats: async (): Promise<ProductStats> => {
    const { data } = await api.get<ProductStats>("/products/stats");
    return data;
  },

  // GET /products/alerts
  alerts: async (): Promise<ProductAlert[]> => {
    const { data } = await api.get<ProductAlert[]>("/products/alerts");
    return data;
  },

  // GET /products/:id
  getOne: async (id: string): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  // POST /products
  create: async (payload: CreateProductPayload): Promise<Product> => {
    const { data } = await api.post<Product>("/products", payload);
    return data;
  },

  // PATCH /products/:id
  update: async (
    id: string,
    payload: UpdateProductPayload
  ): Promise<Product> => {
    const { data } = await api.patch<Product>(`/products/${id}`, payload);
    return data;
  },

  // DELETE /products/:id
  remove: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/products/${id}`);
    return data;
  },

  // DELETE /products/bulk
  removeMany: async (
    ids: string[]
  ): Promise<{ message: string; count: number }> => {
    const { data } = await api.delete<{ message: string; count: number }>(
      "/products/bulk",
      { data: { ids } }
    );
    return data;
  },
};
