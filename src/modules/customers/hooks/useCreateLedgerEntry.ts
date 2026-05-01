import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import { CreateLedgerEntryRequest, ledgerApi } from "../api/ledger.api";

export const useCreateLedgerEntry = (customerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLedgerEntryRequest) =>
      ledgerApi.create(customerId, data),

    onSuccess: () => {
      // Refetch ledger list AND customer detail (outstanding balance changes)
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
      queryClient.invalidateQueries({
        queryKey: ["customers", "detail"],
      });
      queryClient.invalidateQueries({ queryKey: ["customers", "list"] });

      successNotification("Entry added", "Ledger entry recorded successfully");
    },

    onError: (error: any) => {
      errorNotification(
        "Failed to add entry",
        error?.response?.data?.message || "Please try again."
      );
    },
  });
};
