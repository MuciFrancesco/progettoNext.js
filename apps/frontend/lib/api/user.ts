import { authenticatedBackendRequest } from '@/lib/api/backend';
import type { OrderFilter, PaginatedOrdersResponse } from '@/types/api/order';

export async function listMyOrders(params?: {
  page?: number;
  limit?: number;
  filter?: OrderFilter;
}): Promise<PaginatedOrdersResponse> {
  const sp = new URLSearchParams();
  if (params?.page) sp.set('page', String(params.page));
  if (params?.limit) sp.set('limit', String(params.limit));
  if (params?.filter) sp.set('filter', params.filter);
  const qs = sp.toString();
  const url = qs ? `/users/me/orders?${qs}` : '/users/me/orders';
  return authenticatedBackendRequest<PaginatedOrdersResponse>(url);
}
