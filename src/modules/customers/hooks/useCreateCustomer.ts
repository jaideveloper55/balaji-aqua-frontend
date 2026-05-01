import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import type { CreateCustomerRequest } from "../types/Customer";
import { customersApi } from "../api/customers.api";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => customersApi.create(data),

    onSuccess: (customer) => {
      // Invalidate ALL customer queries → list refetches automatically
      queryClient.invalidateQueries({ queryKey: ["customers"] });

      successNotification(
        "Customer added",
        `${customer.name} (${customer.customerCode}) created successfully`
      );
    },

    onError: (error: any) => {
      errorNotification(
        "Failed to add customer",
        error?.response?.data?.message || "Please try again."
      );
    },
  });
};
