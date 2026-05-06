import type { ProductStatusSnapshot } from '@/types/api/product';

export async function fetchProductStatuses(ids: readonly string[]): Promise<ProductStatusSnapshot[]> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return [];

  const path = `/api/products/status?ids=${encodeURIComponent(uniqueIds.join(','))}`;
  const url = new URL(
    path,
    typeof window === 'undefined' ? 'http://localhost' : window.location.origin
  ).toString();

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Product status unavailable');
  }

  return (await response.json()) as ProductStatusSnapshot[];
}
