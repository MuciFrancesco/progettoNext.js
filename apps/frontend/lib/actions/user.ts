'use server';

import { listMyOrders } from '@/lib/api/user';
import { requireUserSession } from '@/lib/auth/session';
import type { OrderFilter, PaginatedOrdersResponse } from '@/types/api/order';

export async function getMyOrdersAction(params?: {
  page?: number;
  limit?: number;
  filter?: OrderFilter;
}): Promise<PaginatedOrdersResponse> {
  await requireUserSession();
  return listMyOrders(params);
}
