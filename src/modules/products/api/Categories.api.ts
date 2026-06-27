import authAxios from "../../../lib/axios";
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/Product";

// ─── GET /categories ──────────────────────────────────────────────────────────
export const getCategoriesApi = () => authAxios.get("/categories");

// ─── GET /categories/:id ──────────────────────────────────────────────────────
export const getCategoryApi = (id: string) =>
  authAxios.get(`/categories/${id}`);

// ─── POST /categories ─────────────────────────────────────────────────────────
export const createCategoryApi = (payload: CreateCategoryPayload) =>
  authAxios.post("/categories", payload);

// ─── PATCH /categories/:id ────────────────────────────────────────────────────
export const updateCategoryApi = (id: string, payload: UpdateCategoryPayload) =>
  authAxios.patch(`/categories/${id}`, payload);

// ─── DELETE /categories/:id ───────────────────────────────────────────────────
export const deleteCategoryApi = (id: string) =>
  authAxios.delete(`/categories/${id}`);
