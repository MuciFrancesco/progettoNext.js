import { backendRequest } from '@/lib/api/backend';
import type { PaginatedProductsResponse, ProductCategory } from '@/types/api/product';

export async function listPublicProducts(params?: {
  categories?: ProductCategory[];
  q?: string;
  page?: number;
  limit?: number;
  cache?: RequestCache;
  revalidate?: number;
}): Promise<PaginatedProductsResponse> {
  const qs = new URLSearchParams();
  if (params?.categories?.length) qs.set('categories', params.categories.join(','));
  if (params?.q) qs.set('q', params.q);
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return backendRequest<PaginatedProductsResponse>(`/products${query}`, undefined, 'Request failed', {
    cache: params?.cache,
    next: params?.revalidate !== undefined ? { revalidate: params.revalidate } : undefined,
  });
}
