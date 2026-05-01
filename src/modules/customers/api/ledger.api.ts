import api from "../../../lib/axios";
import type { LedgerEntry, LedgerResponse, EntryType } from "../types/Customer";

export interface CreateLedgerEntryRequest {
  entryDate: string; // ISO date
  entryType: EntryType;
  referenceNo?: string;
  description?: string;
  debitAmount?: number;
  creditAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
}

export interface LedgerQuery {
  startDate?: string;
  endDate?: string;
  entryType?: EntryType;
  page?: number;
  limit?: number;
}

export const ledgerApi = {
  // GET /customers/:id/ledger
  list: async (
    customerId: string,
    query: LedgerQuery = {}
  ): Promise<LedgerResponse> => {
    const response = await api.get<LedgerResponse>(
      `/customers/${customerId}/ledger`,
      { params: query }
    );
    return response.data;
  },

  // POST /customers/:id/ledger
  create: async (
    customerId: string,
    data: CreateLedgerEntryRequest
  ): Promise<LedgerEntry> => {
    const response = await api.post<LedgerEntry>(
      `/customers/${customerId}/ledger`,
      data
    );
    return response.data;
  },

  // GET /customers/:id/ledger/export
  export: async (
    customerId: string,
    query: LedgerQuery = {}
  ): Promise<Blob> => {
    const response = await api.get(`/customers/${customerId}/ledger/export`, {
      params: query,
      responseType: "blob",
    });
    return response.data;
  },
};
