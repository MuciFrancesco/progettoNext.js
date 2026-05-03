import { authenticatedBackendRequest, authenticatedBackendUpload } from '@/lib/api/backend';
import type { BackendUser, CreateUserInput, PaginatedUsersResponse } from '@/types/api/user';
import {
  BackendProduct,
  CreateProductInput,
  CreateProductResponse,
  UpdateProductInput,
  BulkUpdateProductInput,
  PaginatedProductsResponse,
  ProductCategory,
} from '@/types/api/product';
import type { OrderFilter, PaginatedOrdersResponse } from '@/types/api/order';

export async function listAdminUsers(params?: {
  email?: string;
  name?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedUsersResponse> {
  const qs = new URLSearchParams();
  if (params?.email) qs.set('email', params.email);
  if (params?.name) qs.set('name', params.name);
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return authenticatedBackendRequest<PaginatedUsersResponse>(`/admin/users${query}`);
}

export async function updateAdminUserRole(
  userId: string,
  input: {
    isAdmin?: boolean;
    canCreateCart?: boolean;
    canOrderProducts?: boolean;
  }
): Promise<BackendUser> {
  return authenticatedBackendRequest<BackendUser>(`/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function createAdminUser(input: CreateUserInput): Promise<BackendUser> {
  return authenticatedBackendRequest<BackendUser>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function deleteAdminUsers(ids: string[]): Promise<{ count: number }> {
  return authenticatedBackendRequest<{ count: number }>('/admin/users/bulk', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  });
}

export async function listAdminProducts(params?: {
  categories?: ProductCategory[];
  title?: string;
  name?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedProductsResponse> {
  const qs = new URLSearchParams();
  if (params?.categories && params.categories.length > 0) {
    qs.set('categories', params.categories.join(','));
  }
  if (params?.title) qs.set('title', params.title);
  if (params?.name) qs.set('name', params.name);
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return authenticatedBackendRequest<PaginatedProductsResponse>(`/admin/products${query}`);
}

export async function createAdminProduct(
  input: CreateProductInput,
  forceConfirm = false
): Promise<CreateProductResponse> {
  const imagePath = input.imagePaths[0] ?? '';
  return authenticatedBackendRequest<CreateProductResponse>('/admin/products', {
    method: 'POST',
    body: JSON.stringify({ ...input, imagePath, forceConfirm }),
  });
}

export async function updateAdminProduct(
  productId: string,
  input: UpdateProductInput
): Promise<BackendProduct> {
  return authenticatedBackendRequest<BackendProduct>(`/admin/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteAdminProduct(
  productId: string
): Promise<{ id: string; title: string }> {
  return authenticatedBackendRequest<{ id: string; title: string }>(
    `/admin/products/${productId}`,
    { method: 'DELETE' }
  );
}

export async function bulkUpdateAdminProducts(
  input: BulkUpdateProductInput
): Promise<BackendProduct[]> {
  return authenticatedBackendRequest<BackendProduct[]>('/admin/products/bulk', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function bulkDeleteAdminProducts(ids: string[]): Promise<{ count: number }> {
  return authenticatedBackendRequest<{ count: number }>('/admin/products/bulk', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  });
}

export async function getAdminProductsBulkStatus(): Promise<{ isBusy: boolean }> {
  return authenticatedBackendRequest<{ isBusy: boolean }>('/admin/products/bulk-status');
}

export async function uploadProductImage(file: File): Promise<{ imagePath: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return authenticatedBackendUpload<{ imagePath: string }>('/admin/upload', formData);
}

export async function listAdminOrders(params?: {
  page?: number;
  limit?: number;
  filter?: OrderFilter;
}): Promise<PaginatedOrdersResponse> {
  const sp = new URLSearchParams();
  if (params?.page) sp.set('page', String(params.page));
  if (params?.limit) sp.set('limit', String(params.limit));
  if (params?.filter) sp.set('filter', params.filter);
  const qs = sp.toString();
  const url = qs ? `/admin/orders?${qs}` : '/admin/orders';
  return authenticatedBackendRequest<PaginatedOrdersResponse>(url);
}
