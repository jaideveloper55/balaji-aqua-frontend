import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/auth.store";
import { productsApi } from "../api/customerPricing.api";


export const useProducts = () => {
  const activeCompanyId = useAuthStore((s) => s.activeCompanyId);

  return useQuery({
    queryKey: ["products", "list", activeCompanyId],
    queryFn: () => productsApi.list(),
    enabled: !!activeCompanyId,
    staleTime: 1000 * 60 * 5, 
  });
};
