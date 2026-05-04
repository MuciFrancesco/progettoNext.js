import { NextResponse } from 'next/server';
import { backendRequest } from '@/lib/api/backend';
import type { ProductStatusSnapshot } from '@/types/api/product';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids') ?? '';

  try {
    const response = await backendRequest<ProductStatusSnapshot[]>(
      `/products/status?ids=${encodeURIComponent(ids)}`,
      undefined,
      'Product status unavailable',
      { cache: 'no-store' }
    );

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Product status unavailable' },
      { status: 400 }
    );
  }
}
