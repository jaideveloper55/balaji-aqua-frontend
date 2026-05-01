import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/Product";
import { categoriesApi } from "../api/Categories.api";
import {
  errorNotification,
  successNotification,
} from "../../../components/common/Notification";

// ─── QUERY KEYS (inline) ──────────────────────────────────────────────────
const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  detail: (id: string) => [...categoryKeys.all, "detail", id] as const,
};

// ─── LIST ─────────────────────────────────────────────────────────────────
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: categoriesApi.list,
  });
};

// ─── GET ONE ──────────────────────────────────────────────────────────────
export const useCategory = (id: string | undefined) => {
  return useQuery({
    queryKey: categoryKeys.detail(id || ""),
    queryFn: () => categoriesApi.getOne(id!),
    enabled: !!id,
  });
};

// ─── CREATE ───────────────────────────────────────────────────────────────
export const useCreateCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoriesApi.create(payload),
    onSuccess: (category) => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
      successNotification(
        "Category created",
        `"${category.name}" is ready to use.`
      );
    },
    onError: (err: any) => {
      errorNotification(
        "Failed to create category",
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    },
  });
};

// ─── UPDATE ───────────────────────────────────────────────────────────────
export const useUpdateCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => categoriesApi.update(id, payload),
    onSuccess: (category) => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
      qc.invalidateQueries({ queryKey: ["products"] }); // products show category info
      successNotification(
        "Category updated",
        `"${category.name}" has been updated.`
      );
    },
    onError: (err: any) => {
      errorNotification(
        "Failed to update category",
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    },
  });
};

// ─── DELETE ───────────────────────────────────────────────────────────────
export const useDeleteCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
      successNotification("Category deleted", "The category was removed.");
    },
    onError: (err: any) => {
      // Backend may return: "Cannot delete category. 5 product(s) are linked..."
      errorNotification(
        "Failed to delete category",
        err?.response?.data?.message ||
          "Reassign products to another category first."
      );
    },
  });
};
