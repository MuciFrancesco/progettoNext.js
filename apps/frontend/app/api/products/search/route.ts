import { NextResponse } from 'next/server';
import { listPublicProducts } from '@/lib/api/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const limitParam = Number.parseInt(searchParams.get('limit') ?? '6', 10);
  const limit = Math.min(12, Math.max(1, Number.isNaN(limitParam) ? 6 : limitParam));

  if (query.length < 3) {
    return NextResponse.json({ data: [], total: 0 });
  }

  const products = await listPublicProducts({
    q: query,
    limit,
    cache: 'no-store',
  }).catch(() => ({ data: [], total: 0 }));

  return NextResponse.json(products);
}
