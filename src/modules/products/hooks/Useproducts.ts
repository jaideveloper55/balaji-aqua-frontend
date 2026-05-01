import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import type {
  CreateProductPayload,
  ProductQueryParams,
  UpdateProductPayload,
} from "../types/Product";
import { productsApi } from "../api/Products.api";
import {
  errorNotification,
  successNotification,
} from "../../../components/common/Notification";

// ─── QUERY KEYS (inline) ──────────────────────────────────────────────────
const productKeys = {
  all: ["products"] as const,
  list: (params: ProductQueryParams) =>
    [...productKeys.all, "list", params] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
  stats: () => [...productKeys.all, "stats"] as const,
  alerts: () => [...productKeys.all, "alerts"] as const,
};

// ─── LIST with filters + pagination ───────────────────────────────────────
export const useProducts = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.list(params),
    placeholderData: keepPreviousData,
  });
};

// ─── STATS (4 cards) ──────────────────────────────────────────────────────
export const useProductStats = () => {
  return useQuery({
    queryKey: productKeys.stats(),
    queryFn: productsApi.stats,
  });
};

// ─── ALERTS (banner) ──────────────────────────────────────────────────────
export const useProductAlerts = () => {
  return useQuery({
    queryKey: productKeys.alerts(),
    queryFn: productsApi.alerts,
    refetchInterval: 1000 * 60, // re-check every 60s
  });
};

// ─── GET ONE ──────────────────────────────────────────────────────────────
export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: productKeys.detail(id || ""),
    queryFn: () => productsApi.getOne(id!),
    enabled: !!id,
  });
};

// ─── CREATE ───────────────────────────────────────────────────────────────
export const useCreateProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    onSuccess: (product) => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      qc.invalidateQueries({ queryKey: ["categories"] });
      successNotification(
        "Product created",
        `${product.name} was added to your inventory.`
      );
    },
    onError: (err: any) => {
      errorNotification(
        "Failed to create product",
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    },
  });
};

// ─── UPDATE ───────────────────────────────────────────────────────────────
export const useUpdateProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => productsApi.update(id, payload),
    onSuccess: (product) => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      qc.invalidateQueries({ queryKey: ["categories"] });
      successNotification(
        "Product updated",
        `${product.name} has been updated.`
      );
    },
    onError: (err: any) => {
      errorNotification(
        "Failed to update product",
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    },
  });
};

// ─── DELETE ONE ───────────────────────────────────────────────────────────
export const useDeleteProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      qc.invalidateQueries({ queryKey: ["categories"] });
      successNotification(
        "Product deleted",
        "The product was removed from your inventory."
      );
    },
    onError: (err: any) => {
      errorNotification(
        "Failed to delete product",
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    },
  });
};

// ─── BULK DELETE ──────────────────────────────────────────────────────────
export const useDeleteProducts = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => productsApi.removeMany(ids),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      qc.invalidateQueries({ queryKey: ["categories"] });
      successNotification(
        "Products deleted",
        `${data.count} product${data.count !== 1 ? "s" : ""} removed.`
      );
    },
    onError: (err: any) => {
      errorNotification(
        "Failed to delete products",
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    },
  });
};
