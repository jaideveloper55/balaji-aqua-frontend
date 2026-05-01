import api from "../../../lib/axios";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/Product";

export const categoriesApi = {
  // GET /categories
  list: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  },

  // GET /categories/:id
  getOne: async (id: string): Promise<Category> => {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  },

  // POST /categories
  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const { data } = await api.post<Category>("/categories", payload);
    return data;
  },

  // PATCH /categories/:id
  update: async (
    id: string,
    payload: UpdateCategoryPayload
  ): Promise<Category> => {
    const { data } = await api.patch<Category>(`/categories/${id}`, payload);
    return data;
  },

  // DELETE /categories/:id
  remove: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/categories/${id}`);
    return data;
  },
};
