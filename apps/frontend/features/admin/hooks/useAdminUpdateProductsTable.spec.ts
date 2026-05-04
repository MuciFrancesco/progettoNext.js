import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdminUpdateProductsTable } from './useAdminUpdateProductsTable';
import {
  getAdminProductsAction,
  getAdminProductsBulkStatusAction,
} from '@/lib/actions/admin';
import type { PaginatedProductsResponse } from '@/types/api/product';

vi.mock('@/lib/actions/admin', () => ({
  getAdminProductsAction: vi.fn(),
  getAdminProductsBulkStatusAction: vi.fn(),
  updateProductAction: vi.fn(),
  deleteProductAction: vi.fn(),
  uploadProductImageAction: vi.fn(),
  bulkUpdateProductsAction: vi.fn(),
  bulkDeleteProductsAction: vi.fn(),
}));

const mockedGetAdminProductsAction = vi.mocked(getAdminProductsAction);
const mockedGetAdminProductsBulkStatusAction = vi.mocked(getAdminProductsBulkStatusAction);

const initialResponse: PaginatedProductsResponse = {
  data: [
    {
      id: 'p1',
      title: 'Alpha Mouse',
      name: 'Mouse',
      description: 'Wireless mouse',
      imagePath: '/mouse.png',
      imagePaths: ['/mouse.png'],
      priceInCents: 1999,
      createdAt: '2026-05-01T10:00:00.000Z',
      updatedAt: '2026-05-01T10:00:00.000Z',
      category: 'TECHNOLOGY',
      stockQuantity: 5,
      isAvailableForPurchase: true,
    },
    {
      id: 'p2',
      title: 'Beta Book',
      name: 'Book',
      description: 'Tech book',
      imagePath: '/book.png',
      imagePaths: ['/book.png'],
      priceInCents: 1299,
      createdAt: '2026-05-01T10:00:00.000Z',
      updatedAt: '2026-05-01T10:00:00.000Z',
      category: 'BOOKS',
      stockQuantity: 3,
      isAvailableForPurchase: true,
    },
    {
      id: 'p3',
      title: 'Gamma Novel',
      name: 'Novel',
      description: 'Fiction',
      imagePath: '/novel.png',
      imagePaths: ['/novel.png'],
      priceInCents: 899,
      createdAt: '2026-05-01T10:00:00.000Z',
      updatedAt: '2026-05-01T10:00:00.000Z',
      category: 'BOOKS',
      stockQuantity: 7,
      isAvailableForPurchase: false,
    },
  ],
  total: 3,
};

describe('useAdminUpdateProductsTable', () => {
  beforeEach(() => {
    mockedGetAdminProductsAction.mockReset();
    mockedGetAdminProductsBulkStatusAction.mockReset();
    mockedGetAdminProductsBulkStatusAction.mockResolvedValue({ isBusy: false });
  });

  it('submits the active search filters with the default page size', async () => {
    mockedGetAdminProductsAction.mockResolvedValueOnce({
      data: [initialResponse.data[0]!],
      total: 1,
    });

    const { result } = renderHook(() =>
      useAdminUpdateProductsTable(initialResponse, 'it', 'seed-name')
    );

    act(() => {
      result.current.setSearchCategoriesDraft(['TECHNOLOGY']);
      result.current.setSearchTitleDraft('Alpha');
      result.current.setSearchNameDraft('Mouse');
    });

    await act(async () => {
      result.current.handleProductSearch();
    });

    await waitFor(() => {
      expect(mockedGetAdminProductsAction).toHaveBeenCalledWith({
        categories: ['TECHNOLOGY'],
        title: 'Alpha',
        name: 'Mouse',
        page: 1,
        limit: 20,
      });
    });

    await waitFor(() => {
      expect(result.current.page).toBe(0);
      expect(result.current.products).toHaveLength(1);
      expect(result.current.searchError).toBeNull();
    });
  });

  it('keeps bulk selection constrained to a single category', () => {
    const { result } = renderHook(() => useAdminUpdateProductsTable(initialResponse, 'it'));

    act(() => {
      result.current.toggleSelection('p2');
    });

    expect(Array.from(result.current.selectedIds)).toEqual(['p2']);
    expect(result.current.selectionCategory).toBe('BOOKS');

    act(() => {
      result.current.toggleSelection('p1');
    });

    expect(Array.from(result.current.selectedIds)).toEqual(['p2']);

    act(() => {
      result.current.toggleSelection('p3');
    });

    expect(Array.from(result.current.selectedIds).sort()).toEqual(['p2', 'p3']);
  });
});
