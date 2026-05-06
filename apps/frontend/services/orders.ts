// ─── Orders Service ──────────────────────────────────────────────────────────
// DIP: All order-related API calls go through this abstraction
// SRP: Only handles order data — no products, no auth

import { apiClient, type ApiClient, type ApiFetchOptions } from '@/services/api';
import type { BackendOrder, OrderFilter, PaginatedOrdersResponse } from '@/types/api/order';

// ─── Service Interface ──────────────────────────────────────────────────────

export interface OrdersService {
  listMyOrders(params?: { page?: number; limit?: number }): Promise<PaginatedOrdersResponse>;
  listAllOrders(params?: {
    filter?: OrderFilter;
    sort?: string;
    dir?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<PaginatedOrdersResponse>;
}

// ─── Implementation ─────────────────────────────────────────────────────────

function buildQueryString(params?: Record<string, string | number | undefined>): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) qs.set(key, String(value));
  });
  return qs.toString() ? `?${qs.toString()}` : '';
}

export function createOrdersService(api: ApiClient): OrdersService {
  return {
    async listMyOrders(params) {
      const query = buildQueryString({ page: params?.page, limit: params?.limit });
      return api.get<PaginatedOrdersResponse>(`/orders/my${query}`);
    },

    async listAllOrders(params) {
      const query = buildQueryString({
        filter: params?.filter,
        sort: params?.sort,
        dir: params?.dir,
        page: params?.page,
        limit: params?.limit,
      });
      return api.get<PaginatedOrdersResponse>(`/orders${query}`);
    },
  };
}

// ─── Singleton ──────────────────────────────────────────────────────────────

export const ordersService = createOrdersService(apiClient);
