import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min — data is "fresh" for 5 min
      retry: 1, // Retry failed queries once
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
    mutations: {
      retry: 0, // Don't auto-retry mutations
    },
  },
});
