import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/auth.store";
import { LedgerQuery, ledgerApi } from "../api/ledger.api";

export const useLedger = (
  customerId: string | undefined,
  query: LedgerQuery = {}
) => {
  const activeCompanyId = useAuthStore((s) => s.activeCompanyId);

  return useQuery({
    queryKey: ["ledger", "list", activeCompanyId, customerId, query],
    queryFn: () => ledgerApi.list(customerId!, query),
    enabled: !!customerId && !!activeCompanyId,
    staleTime: 1000 * 30,
  });
};
