import authAxios from "../../../lib/axios";
import type { EntryType } from "../types/Customer";

export interface CreateLedgerEntryRequest {
  entryDate: string;
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

// GET /customers/:id/ledger
export const getLedgerApi = (customerId: string, query: LedgerQuery = {}) => {
  return authAxios.get(`/customers/${customerId}/ledger`, { params: query });
};

// POST /customers/:id/ledger
export const createLedgerEntryApi = (
  customerId: string,
  data: CreateLedgerEntryRequest
) => {
  return authAxios.post(`/customers/${customerId}/ledger`, data);
};

// GET /customers/:id/ledger/export
export const exportLedgerApi = (
  customerId: string,
  query: LedgerQuery = {}
) => {
  return authAxios.get(`/customers/${customerId}/ledger/export`, {
    params: query,
    responseType: "blob",
  });
};
