import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import type { UpdateCustomerRequest } from "../types/Customer";
import { customersApi } from "../api/customers.api";

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) =>
      customersApi.update(id, data),

    onSuccess: (customer, variables) => {
      // Invalidate the list AND this specific customer's detail
      queryClient.invalidateQueries({ queryKey: ["customers", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["customers", "detail", undefined, variables.id],
      });

      successNotification(
        "Customer updated",
        `${customer.name} updated successfully`
      );
    },

    onError: (error: any) => {
      errorNotification(
        "Update failed",
        error?.response?.data?.message || "Please try again."
      );
    },
  });
};
