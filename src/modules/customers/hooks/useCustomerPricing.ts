import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/auth.store";

import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import type { CustomerPricingFormValues } from "../types/Customer";
import { customerPricingApi } from "../api/customerPricing.api";

// ─── List ────────────────────────────────────────────────────────────────

export const useCustomerPricing = (customerId: string | undefined) => {
  const activeCompanyId = useAuthStore((s) => s.activeCompanyId);

  return useQuery({
    queryKey: ["customerPricing", "list", activeCompanyId, customerId],
    queryFn: () => customerPricingApi.list(customerId!),
    enabled: !!customerId && !!activeCompanyId,
    staleTime: 1000 * 30,
  });
};

// ─── Create ──────────────────────────────────────────────────────────────

export const useCreatePricing = (customerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomerPricingFormValues) =>
      customerPricingApi.create(customerId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerPricing"] });
      successNotification("Price rule added", "Custom pricing applied");
    },

    onError: (error: any) => {
      errorNotification(
        "Failed to add price rule",
        error?.response?.data?.message || "Please try again."
      );
    },
  });
};

// ─── Update ──────────────────────────────────────────────────────────────

export const useUpdatePricing = (customerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pricingId,
      data,
    }: {
      pricingId: string;
      data: Partial<CustomerPricingFormValues>;
    }) => customerPricingApi.update(customerId, pricingId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerPricing"] });
      successNotification("Price rule updated", "Changes saved");
    },

    onError: (error: any) => {
      errorNotification(
        "Update failed",
        error?.response?.data?.message || "Please try again."
      );
    },
  });
};

// ─── Delete ──────────────────────────────────────────────────────────────

export const useDeletePricing = (customerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pricingId: string) =>
      customerPricingApi.remove(customerId, pricingId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerPricing"] });
      successNotification("Price rule removed", "Pricing reverted to default");
    },

    onError: (error: any) => {
      errorNotification(
        "Delete failed",
        error?.response?.data?.message || "Please try again."
      );
    },
  });
};
