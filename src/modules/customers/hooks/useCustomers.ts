import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../../../store/auth.store";
import type { CustomerQuery } from "../types/Customer";
import { customersApi } from "../api/customers.api";

export const useCustomers = (query: CustomerQuery = {}) => {
  const activeCompanyId = useAuthStore((s) => s.activeCompanyId);

  return useQuery({
    queryKey: ["customers", "list", activeCompanyId, query],
    queryFn: () => customersApi.list(query),
    enabled: !!activeCompanyId,
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  });
};
