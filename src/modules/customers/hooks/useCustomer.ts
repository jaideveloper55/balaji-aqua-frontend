import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../../../store/auth.store";
import { customersApi } from "../api/customers.api";

export const useCustomer = (id: string | undefined) => {
  const activeCompanyId = useAuthStore((s) => s.activeCompanyId);

  return useQuery({
    queryKey: ["customers", "detail", activeCompanyId, id],
    queryFn: () => customersApi.getDetail(id!),
    enabled: !!id && !!activeCompanyId,
    staleTime: 1000 * 30,
  });
};
