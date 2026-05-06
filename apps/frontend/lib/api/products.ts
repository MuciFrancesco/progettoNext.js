import { backendRequest } from '@/lib/api/backend';
import type {
  BackendProduct,
  CatalogNavigationResponse,
  CategoryCatalogResponse,
  PaginatedProductsResponse,
  ProductCategory,
} from '@/types/api/product';

export async function listPublicProducts(params?: {
  categories?: ProductCategory[];
  subcategorySlug?: string;
  q?: string;
  page?: number;
  limit?: number;
  cache?: RequestCache;
  revalidate?: number;
}): Promise<PaginatedProductsResponse> {
  const qs = new URLSearchParams();
  if (params?.categories?.length) qs.set('categories', params.categories.join(','));
  if (params?.subcategorySlug) qs.set('subcategory', params.subcategorySlug);
  if (params?.q) qs.set('q', params.q);
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return backendRequest<PaginatedProductsResponse>(`/products${query}`, undefined, 'Request failed', {
    cache: params?.cache,
    next: params?.revalidate !== undefined ? { revalidate: params.revalidate } : undefined,
  });
}

export async function listCatalogNavigation(params?: {
  cache?: RequestCache;
  revalidate?: number;
}): Promise<CatalogNavigationResponse> {
  return backendRequest<CatalogNavigationResponse>(
    '/products/catalog/navigation',
    undefined,
    'Request failed',
    {
      cache: params?.cache,
      next: params?.revalidate !== undefined ? { revalidate: params.revalidate } : undefined,
    }
  );
}

export async function getCategoryCatalog(
  slug: string,
  params?: {
    subcategorySlug?: string;
    q?: string;
    page?: number;
    limit?: number;
    cache?: RequestCache;
    revalidate?: number;
  }
): Promise<CategoryCatalogResponse> {
  const qs = new URLSearchParams();
  if (params?.subcategorySlug) qs.set('subcategory', params.subcategorySlug);
  if (params?.q) qs.set('q', params.q);
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';

  return backendRequest<CategoryCatalogResponse>(
    `/products/categories/${encodeURIComponent(slug)}${query}`,
    undefined,
    'Request failed',
    {
      cache: params?.cache,
      next: params?.revalidate !== undefined ? { revalidate: params.revalidate } : undefined,
    }
  );
}

export async function getPublicProduct(
  productId: string,
  params?: { cache?: RequestCache; revalidate?: number }
): Promise<BackendProduct> {
  return backendRequest<BackendProduct>(`/products/${productId}`, undefined, 'Request failed', {
    cache: params?.cache,
    next: params?.revalidate !== undefined ? { revalidate: params.revalidate } : undefined,
  });
}
