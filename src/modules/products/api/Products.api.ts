import authAxios from "../../../lib/axios";
import type {
  ProductQueryParams,
  CreateProductPayload,
  UpdateProductPayload,
  SetBomPayload,
  BomResponse,
} from "../types/Product";

// ─── GET /products ────────────────────────────────────────────────────────────
export const getProductsApi = (params: ProductQueryParams = {}) =>
  authAxios.get("/products", { params });

// ─── GET /products/stats ──────────────────────────────────────────────────────
export const getProductStatsApi = () => authAxios.get("/products/stats");

// ─── GET /products/alerts ─────────────────────────────────────────────────────
export const getProductAlertsApi = () => authAxios.get("/products/alerts");

// ─── GET /products/:id ────────────────────────────────────────────────────────
export const getProductApi = (id: string) => authAxios.get(`/products/${id}`);

// ─── POST /products ───────────────────────────────────────────────────────────
export const createProductApi = (payload: CreateProductPayload) =>
  authAxios.post("/products", payload);

// ─── PATCH /products/:id ──────────────────────────────────────────────────────
export const updateProductApi = (id: string, payload: UpdateProductPayload) =>
  authAxios.patch(`/products/${id}`, payload);

// ─── DELETE /products/:id ─────────────────────────────────────────────────────
export const deleteProductApi = (id: string) =>
  authAxios.delete(`/products/${id}`);

// ─── DELETE /products/bulk ────────────────────────────────────────────────────
export const deleteProductsApi = (ids: string[]) =>
  authAxios.delete("/products/bulk", { data: { ids } });

// ─── DELETE /products/:id/force ───────────────────────────────────────────────
// SUPER_ADMIN only. Destroys invoice items and stock movements too.
export const forceDeleteProductApi = (id: string) =>
  authAxios.delete(`/products/${id}/force`);

// ─── GET /products/:id/bom ────────────────────────────────────────────────────
export const getProductBomApi = (id: string) =>
  authAxios.get<BomResponse>(`/products/${id}/bom`);

// ─── PUT /products/:id/bom ────────────────────────────────────────────────────
// Replaces the entire recipe — omitted lines are deleted.
export const setProductBomApi = (id: string, payload: SetBomPayload) =>
  authAxios.put<BomResponse>(`/products/${id}/bom`, payload);

// ─── DELETE /products/:id/bom ─────────────────────────────────────────────────
export const clearProductBomApi = (id: string) =>
  authAxios.delete(`/products/${id}/bom`);
