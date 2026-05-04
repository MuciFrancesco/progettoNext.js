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
import { requireAdminSession, requireAdminOrEmployeeSession } from '@/lib/auth/session';
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
  isEmployee?: boolean;
  canCreateCart: boolean;
  canOrderProducts: boolean;
}) {
  await requireAdminSession();

  return updateAdminUserRole(input.userId, {
    isAdmin: input.isAdmin,
    isEmployee: input.isEmployee,
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
  await requireAdminOrEmployeeSession();
  return listAdminProducts(params);
}

export async function createProductAction(
  input: CreateProductInput,
  forceConfirm = false
): Promise<CreateProductResponse> {
  await requireAdminOrEmployeeSession();
  return createAdminProduct(input, forceConfirm);
}

export async function updateProductAction(input: { productId: string } & UpdateProductInput) {
  await requireAdminOrEmployeeSession();
  const { productId, ...payload } = input;
  return updateAdminProduct(productId, payload);
}

export async function deleteProductAction(productId: string) {
  await requireAdminOrEmployeeSession();
  return deleteAdminProduct(productId);
}

export async function bulkUpdateProductsAction(input: BulkUpdateProductInput) {
  await requireAdminOrEmployeeSession();
  return bulkUpdateAdminProducts(input);
}

export async function bulkDeleteProductsAction(ids: string[]): Promise<{ count: number }> {
  await requireAdminOrEmployeeSession();
  return bulkDeleteAdminProducts(ids);
}

export async function getAdminProductsBulkStatusAction(): Promise<{ isBusy: boolean }> {
  await requireAdminOrEmployeeSession();
  return getAdminProductsBulkStatus();
}

export async function uploadProductImageAction(formData: FormData) {
  await requireAdminOrEmployeeSession();
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
