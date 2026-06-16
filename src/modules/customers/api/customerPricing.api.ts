import api from "../../../lib/axios";
import {
  CustomerPricing,
  CustomerPricingFormValues,
  Product,
} from "../types/Customer";

function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as T[];
  }
  return [];
}

// ─── Customer Pricing API ─────────────────────────────────────────────────
export const customerPricingApi = {
  // GET /customers/:customerId/pricing
  list: async (customerId: string): Promise<CustomerPricing[]> => {
    const response = await api.get(`/customers/${customerId}/pricing`);
    return unwrapList<CustomerPricing>(response.data);
  },

  // POST /customers/:customerId/pricing
  create: async (
    customerId: string,
    data: CustomerPricingFormValues
  ): Promise<CustomerPricing> => {
    const response = await api.post<CustomerPricing>(
      `/customers/${customerId}/pricing`,
      data
    );
    return response.data;
  },

  // PATCH /customers/:customerId/pricing/:pricingId
  update: async (
    customerId: string,
    pricingId: string,
    data: Partial<CustomerPricingFormValues>
  ): Promise<CustomerPricing> => {
    const response = await api.patch<CustomerPricing>(
      `/customers/${customerId}/pricing/${pricingId}`,
      data
    );
    return response.data;
  },

  // DELETE /customers/:customerId/pricing/:pricingId
  remove: async (
    customerId: string,
    pricingId: string
  ): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/customers/${customerId}/pricing/${pricingId}`
    );
    return response.data;
  },
};

// ─── Products API (paginated, capped at pageSize=100) ─────────────────────
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const MAX_PAGE_SIZE = 100;

export const productsApi = {
  list: async (): Promise<Product[]> => {
    const first = await api.get<PaginatedResponse<Product>>("/products", {
      params: {
        page: 1,
        pageSize: MAX_PAGE_SIZE,
        sortBy: "name",
        sortOrder: "asc",
        isSellable: true,
      },
    });

    const firstData = unwrapList<Product>(first.data);
    const meta = first.data?.meta;

    if (!meta || meta.totalPages <= 1) {
      return firstData;
    }

    const remaining = await Promise.all(
      Array.from({ length: meta.totalPages - 1 }, (_, i) =>
        api.get<PaginatedResponse<Product>>("/products", {
          params: {
            page: i + 2,
            pageSize: MAX_PAGE_SIZE,
            sortBy: "name",
            sortOrder: "asc",
            isSellable: true,
          },
        })
      )
    );

    return [
      ...firstData,
      ...remaining.flatMap((res) => unwrapList<Product>(res.data)),
    ];
  },
};
