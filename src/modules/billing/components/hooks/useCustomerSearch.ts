// src/modules/billing/components/hooks/useCustomerSearch.ts

import { useState, useEffect, useCallback } from "react";
import { customersApi } from "../../../customers/api/customers.api";
import type { Customer as BillingCustomer } from "../../types/billing";

// ─── Fix: return literal types, not string ────────────────────────────────────
// Error was: string is not assignable to "Residential" | "Commercial" | ...
// Both map functions declared return type as string → TypeScript couldn't
// verify the value matched the union. Narrow to exact literals to fix.

function mapType(
  type: string
): "Residential" | "Commercial" | "Industrial" | "Walk-in" {
  const map: Record<string, "Residential" | "Commercial" | "Industrial" | "Walk-in"> = {
    RESIDENTIAL: "Residential",
    COMMERCIAL:  "Commercial",
    INDUSTRIAL:  "Industrial",
  };
  return map[type] ?? "Residential"; // safe fallback instead of returning unknown string
}

function mapStatus(status: string): "Active" | "Inactive" | "Pending" {
  const map: Record<string, "Active" | "Inactive" | "Pending"> = {
    ACTIVE:   "Active",
    INACTIVE: "Inactive",
    PENDING:  "Pending",
  };
  return map[status] ?? "Active"; // safe fallback
}

function mapToBillingCustomer(c: any): BillingCustomer {
  return {
    id:          c.id,
    customerId:  c.customerCode,
    name:        c.name,
    phone:       c.phone,
    email:       c.email ?? "",
    type:        mapType(c.type),    // now returns literal type ✓
    status:      mapStatus(c.status), // now returns literal type ✓
    outstanding: c.outstandingBalance ?? 0,
    address:     "",
    pricing:     [],
    depositJars: 0,
    depositCans: 0,
    isWalkIn:    false,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseCustomerSearchResult {
  customers: BillingCustomer[];
  loading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  loadMore: () => void;
}

export function useCustomerSearch(
  search: string,
  debounceMs = 300
): UseCustomerSearchResult {
  const [customers, setCustomers] = useState<BillingCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setPage(1);
    setCustomers([]);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await customersApi.list({
          search: search || undefined,
          status: "ACTIVE",
          page: 1,
          limit: 20,
          sortBy: "name",
          sortOrder: "asc",
        });
        setCustomers(result.data.map(mapToBillingCustomer));
        setTotal(result.pagination.total);
        setTotalPages(result.pagination.totalPages);
        setPage(1);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to load customers");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [search, debounceMs]);

  const loadMore = useCallback(async () => {
    if (loading || page >= totalPages) return;
    const next = page + 1;
    setLoading(true);
    try {
      const result = await customersApi.list({
        search: search || undefined,
        status: "ACTIVE",
        page: next,
        limit: 20,
        sortBy: "name",
        sortOrder: "asc",
      });
      setCustomers((prev) => [...prev, ...result.data.map(mapToBillingCustomer)]);
      setPage(next);
    } catch {
      // silent fail on load more
    } finally {
      setLoading(false);
    }
  }, [loading, page, totalPages, search]);

  return { customers, loading, error, total, hasMore: page < totalPages, loadMore };
}