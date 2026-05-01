import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../../../store/auth.store";
import { customersApi } from "../api/customers.api";

export const useCustomerStats = () => {
  const activeCompanyId = useAuthStore((s) => s.activeCompanyId);

  return useQuery({
    queryKey: ["customers", "stats", activeCompanyId],
    queryFn: () => customersApi.getStats(),
    enabled: !!activeCompanyId,
    staleTime: 1000 * 60, // 1 minute
  });
};
