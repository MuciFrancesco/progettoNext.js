import type { ProductStatusSnapshot } from '@/types/api/product';

export async function fetchProductStatuses(ids: readonly string[]): Promise<ProductStatusSnapshot[]> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return [];

  const response = await fetch(`/api/products/status?ids=${encodeURIComponent(uniqueIds.join(','))}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Product status unavailable');
  }

  return (await response.json()) as ProductStatusSnapshot[];
}
