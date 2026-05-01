import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import { customersApi } from "../api/customers.api";

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customersApi.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      successNotification("Customer removed", "Deleted successfully");
    },

    onError: (error: any) => {
      errorNotification(
        "Delete failed",
        error?.response?.data?.message || "Please try again."
      );
    },
  });
};
