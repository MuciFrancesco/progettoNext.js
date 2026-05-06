// ─── Admin Service ───────────────────────────────────────────────────────────
// DIP: All admin-related API calls go through this abstraction
// SRP: Handles admin operations — products CRUD, user management

import { apiClient, type ApiClient, type ApiFetchOptions } from '@/services/api';
import type { BackendProduct, CreateProductInput, CreateProductResponse, BulkUpdateProductInput, PaginatedProductsResponse, ProductCategory } from '@/types/api/product';
import type { BackendUser, CreateUserInput, PaginatedUsersResponse } from '@/types/api/user';

// ─── Service Interface ──────────────────────────────────────────────────────

export interface AdminService {
  // Products
  createProduct(input: CreateProductInput, forceDuplicate: boolean): Promise<CreateProductResponse>;
  updateProduct(id: string, input: Partial<BackendProduct>): Promise<BackendProduct>;
  deleteProduct(id: string): Promise<void>;
  bulkUpdate(input: BulkUpdateProductInput): Promise<{ updated: number }>;
  bulkDelete(ids: string[]): Promise<{ deleted: number }>;
  searchProducts(params: {
    title?: string;
    name?: string;
    categories?: ProductCategory[];
    page?: number;
    limit?: number;
    sort?: string;
    dir?: 'asc' | 'desc';
  }): Promise<PaginatedProductsResponse>;
  uploadImage(formData: FormData): Promise<{ imagePath: string }>;

  // Users
  listUsers(params?: {
    email?: string;
    name?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedUsersResponse>;
  createUser(input: CreateUserInput): Promise<BackendUser>;
  updateUserRoles(userId: string, roles: Record<string, boolean>): Promise<BackendUser>;
  deleteUsers(ids: string[]): Promise<void>;
}

// ─── Implementation ─────────────────────────────────────────────────────────

export function createAdminService(api: ApiClient): AdminService {
  return {
    // Products
    async createProduct(input, forceDuplicate) {
      return api.post<CreateProductResponse>(
        `/admin/products?force=${forceDuplicate}`,
        input
      );
    },

    async updateProduct(id, input) {
      return api.put<BackendProduct>(`/admin/products/${id}`, input);
    },

    async deleteProduct(id) {
      await api.delete(`/admin/products/${id}`);
    },

    async bulkUpdate(input) {
      return api.put<{ updated: number }>('/admin/products/bulk', input);
    },

    async bulkDelete(ids) {
      return api.post<{ deleted: number }>('/admin/products/bulk-delete', { ids });
    },

    async searchProducts(params) {
      const qs = new URLSearchParams();
      if (params.title) qs.set('title', params.title);
      if (params.name) qs.set('name', params.name);
      if (params.categories?.length) qs.set('categories', params.categories.join(','));
      if (params.page !== undefined) qs.set('page', String(params.page));
      if (params.limit !== undefined) qs.set('limit', String(params.limit));
      if (params.sort) qs.set('sort', params.sort);
      if (params.dir) qs.set('dir', params.dir);
      const query = qs.toString() ? `?${qs.toString()}` : '';

      return api.get<PaginatedProductsResponse>(`/admin/products${query}`);
    },

    async uploadImage(formData) {
      return api.upload<{ imagePath: string }>('/admin/products/upload', formData);
    },

    // Users
    async listUsers(params) {
      const qs = new URLSearchParams();
      if (params?.email) qs.set('email', params.email);
      if (params?.name) qs.set('name', params.name);
      if (params?.page !== undefined) qs.set('page', String(params.page));
      if (params?.limit !== undefined) qs.set('limit', String(params.limit));
      const query = qs.toString() ? `?${qs.toString()}` : '';

      return api.get<PaginatedUsersResponse>(`/admin/users${query}`);
    },

    async createUser(input) {
      return api.post<BackendUser>('/admin/users', input);
    },

    async updateUserRoles(userId, roles) {
      return api.put<BackendUser>(`/admin/users/${userId}/roles`, roles);
    },

    async deleteUsers(ids) {
      await api.post('/admin/users/bulk-delete', { ids });
    },
  };
}

// ─── Singleton ──────────────────────────────────────────────────────────────

export const adminService = createAdminService(apiClient);
