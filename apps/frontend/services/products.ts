// ─── Products Service ────────────────────────────────────────────────────────
// DIP: All product-related API calls go through this abstraction
// SRP: Only handles product data — no cart, no auth, no orders

import { apiClient, type ApiClient, type ApiFetchOptions } from '@/services/api';
import type {
  BackendProduct,
  CatalogNavigationResponse,
  CategoryCatalogResponse,
  PaginatedProductsResponse,
  ProductCategory,
  ProductStatusSnapshot,
} from '@/types/api/product';

// ─── Public Types ───────────────────────────────────────────────────────────

export type ProductListParams = ApiFetchOptions & {
  readonly categories?: ProductCategory[];
  readonly subcategorySlug?: string;
  readonly q?: string;
  readonly page?: number;
  readonly limit?: number;
};

export type CategoryParams = ApiFetchOptions & {
  readonly subcategorySlug?: string;
  readonly q?: string;
  readonly page?: number;
  readonly limit?: number;
};

// ─── Service Interface ──────────────────────────────────────────────────────

export interface ProductsService {
  list(params?: ProductListParams): Promise<PaginatedProductsResponse>;
  getById(productId: string, params?: ApiFetchOptions): Promise<BackendProduct>;
  getNavigation(params?: ApiFetchOptions): Promise<CatalogNavigationResponse>;
  getCategoryCatalog(slug: string, params?: CategoryParams): Promise<CategoryCatalogResponse>;
  fetchStatuses(ids: readonly string[]): Promise<ProductStatusSnapshot[]>;
}

// ─── Implementation ─────────────────────────────────────────────────────────

function buildQueryString(params?: Record<string, string | number | string[] | undefined>): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      if (value.length > 0) qs.set(key, value.join(','));
    } else {
      qs.set(key, String(value));
    }
  });
  return qs.toString() ? `?${qs.toString()}` : '';
}

export function createProductsService(api: ApiClient): ProductsService {
  return {
    async list(params) {
      const query = buildQueryString({
        categories: params?.categories,
        subcategory: params?.subcategorySlug,
        q: params?.q,
        page: params?.page,
        limit: params?.limit,
      });
      return api.get<PaginatedProductsResponse>(`/products${query}`, params);
    },

    async getById(productId, params) {
      return api.get<BackendProduct>(`/products/${productId}`, params);
    },

    async getNavigation(params) {
      return api.get<CatalogNavigationResponse>('/products/catalog/navigation', params);
    },

    async getCategoryCatalog(slug, params) {
      const query = buildQueryString({
        subcategory: params?.subcategorySlug,
        q: params?.q,
        page: params?.page,
        limit: params?.limit,
      });
      return api.get<CategoryCatalogResponse>(
        `/products/categories/${encodeURIComponent(slug)}${query}`,
        params
      );
    },

    async fetchStatuses(ids) {
      if (ids.length === 0) return [];
      return api.get<ProductStatusSnapshot[]>(`/products/status?ids=${ids.join(',')}`);
    },
  };
}

// ─── Singleton ──────────────────────────────────────────────────────────────

export const productsService = createProductsService(apiClient);
