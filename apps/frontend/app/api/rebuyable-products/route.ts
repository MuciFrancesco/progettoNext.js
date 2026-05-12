import { NextResponse } from 'next/server';
import { authenticatedBackendRequest } from '@/lib/api/backend';
import type { PaginatedOrdersResponse } from '@/types/api/order';
import { getRebuyablePurchasedProducts } from '@/features/rebuyable/rebuyableProducts';

export async function GET() {
  try {
    const response = await authenticatedBackendRequest<PaginatedOrdersResponse>(
      '/users/me/orders?page=1&limit=20&filter=all',
      undefined,
      'Rebuyable products unavailable'
    );

    return NextResponse.json(getRebuyablePurchasedProducts(response.data));
  } catch (error: unknown) {
    const status = (error as { status?: number }).status ?? 500;
    if (status === 401 || (error instanceof Error && error.message === 'Token unavailable')) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json([], { status: 200 });
  }
}
