'use server';

import {
  createAdminProduct,
  createAdminUser,
  deleteAdminProduct,
  deleteAdminUsers,
  listAdminProducts,
  listAdminOrders,
  listAdminUsers,
  updateAdminProduct,
  updateAdminUserRole,
  uploadProductImage,
  bulkUpdateAdminProducts,
  bulkDeleteAdminProducts,
  getAdminProductsBulkStatus,
} from '@/lib/api/admin';
import { requireAdminSession } from '@/lib/auth/session';
import type {
  CreateProductInput,
  CreateProductResponse,
  UpdateProductInput,
  BulkUpdateProductInput,
  PaginatedProductsResponse,
  ProductCategory,
} from '@/types/api/product';
import type { BackendUser, CreateUserInput, PaginatedUsersResponse } from '@/types/api/user';
import type { OrderFilter, PaginatedOrdersResponse } from '@/types/api/order';

export async function getAdminUsersAction(params?: {
  email?: string;
  name?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedUsersResponse> {
  await requireAdminSession();
  return listAdminUsers(params);
}

export async function createUserAction(input: CreateUserInput): Promise<BackendUser> {
  await requireAdminSession();
  return createAdminUser(input);
}

export async function updateUserRoleAction(input: {
  userId: string;
  isAdmin: boolean;
  canCreateCart: boolean;
  canOrderProducts: boolean;
}) {
  await requireAdminSession();

  return updateAdminUserRole(input.userId, {
    isAdmin: input.isAdmin,
    canCreateCart: input.canCreateCart,
    canOrderProducts: input.canOrderProducts,
  });
}

export async function deleteUsersAction(ids: string[]): Promise<{ count: number }> {
  await requireAdminSession();
  return deleteAdminUsers(ids);
}

export async function getAdminProductsAction(params?: {
  categories?: ProductCategory[];
  title?: string;
  name?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedProductsResponse> {
  await requireAdminSession();
  return listAdminProducts(params);
}

export async function createProductAction(
  input: CreateProductInput,
  forceConfirm = false
): Promise<CreateProductResponse> {
  await requireAdminSession();
  return createAdminProduct(input, forceConfirm);
}

export async function updateProductAction(input: { productId: string } & UpdateProductInput) {
  await requireAdminSession();
  const { productId, ...payload } = input;
  return updateAdminProduct(productId, payload);
}

export async function deleteProductAction(productId: string) {
  await requireAdminSession();
  return deleteAdminProduct(productId);
}

export async function bulkUpdateProductsAction(input: BulkUpdateProductInput) {
  await requireAdminSession();
  return bulkUpdateAdminProducts(input);
}

export async function bulkDeleteProductsAction(ids: string[]): Promise<{ count: number }> {
  await requireAdminSession();
  return bulkDeleteAdminProducts(ids);
}

export async function getAdminProductsBulkStatusAction(): Promise<{ isBusy: boolean }> {
  await requireAdminSession();
  return getAdminProductsBulkStatus();
}

export async function uploadProductImageAction(formData: FormData) {
  await requireAdminSession();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw new TypeError('Nessun file fornito');
  }
  return uploadProductImage(file);
}

export async function getAdminOrdersAction(params?: {
  page?: number;
  limit?: number;
  filter?: OrderFilter;
}): Promise<PaginatedOrdersResponse> {
  await requireAdminSession();
  return listAdminOrders(params);
}
