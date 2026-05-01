import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../../api/auth.api";
import { useAuthStore } from "../../../store/auth.store";

export const useMe = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  return useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me(),
    enabled: isAuthenticated, // Don't run if not logged in
    staleTime: 1000 * 60 * 10, // 10 min
  });
};
