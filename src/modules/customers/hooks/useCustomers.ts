import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../../../store/auth.store";
import type { CustomerQuery } from "../types/Customer";
import { customersApi } from "../api/customers.api";

export const useCustomers = (query: CustomerQuery = {}) => {
  // Re-fetch when active company changes (multi-tenant scoping)
  const activeCompanyId = useAuthStore((s) => s.activeCompanyId);

  return useQuery({
    // queryKey includes companyId so switching companies refetches automatically
    queryKey: ["customers", "list", activeCompanyId, query],
    queryFn: () => customersApi.list(query),
    enabled: !!activeCompanyId, // only fetch if a company is selected
    staleTime: 1000 * 30, // 30 seconds
  });
};
