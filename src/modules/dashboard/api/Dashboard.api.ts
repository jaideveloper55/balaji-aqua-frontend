import authAxios from "../../../lib/axios";
import type { DashboardSummaryFilters } from "../types/Dashboard";

export const getDashboardSummaryApi = (filters?: DashboardSummaryFilters) =>
  authAxios.get("/dashboard/summary", { params: filters });
