import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdminUpdateProductsTable } from './useAdminUpdateProductsTable';
import {
  getAdminProductsAction,
  getAdminProductsBulkStatusAction,
  updateProductAction,
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
const mockedUpdateProductAction = vi.mocked(updateProductAction);

const initialResponse: PaginatedProductsResponse = {
  data: [
    {
      id: 'p1',
      title: 'Alpha Mouse',
      name: 'Mouse',
      description: 'Wireless mouse',
      imagePath: '/mouse.png',
      imagePaths: ['/mouse.png'],
      brand: null,
      subcategory: null,
      priceInCents: 1999,
      originalPriceInCents: null,
      isInSale: false,
      salePriceInCents: null,
      saleDiscountPercent: null,
      createdAt: '2026-05-01T10:00:00.000Z',
      updatedAt: '2026-05-01T10:00:00.000Z',
      category: 'TECHNOLOGY',
      stockQuantity: 5,
      isAvailableForPurchase: true,
      isRebuyable: false,
    },
    {
      id: 'p2',
      title: 'Beta Book',
      name: 'Book',
      description: 'Tech book',
      imagePath: '/book.png',
      imagePaths: ['/book.png'],
      brand: null,
      subcategory: null,
      priceInCents: 1299,
      originalPriceInCents: null,
      isInSale: false,
      salePriceInCents: null,
      saleDiscountPercent: null,
      createdAt: '2026-05-01T10:00:00.000Z',
      updatedAt: '2026-05-01T10:00:00.000Z',
      category: 'BOOKS',
      stockQuantity: 3,
      isAvailableForPurchase: true,
      isRebuyable: true,
    },
    {
      id: 'p3',
      title: 'Gamma Novel',
      name: 'Novel',
      description: 'Fiction',
      imagePath: '/novel.png',
      imagePaths: ['/novel.png'],
      brand: null,
      subcategory: null,
      priceInCents: 899,
      originalPriceInCents: null,
      isInSale: false,
      salePriceInCents: null,
      saleDiscountPercent: null,
      createdAt: '2026-05-01T10:00:00.000Z',
      updatedAt: '2026-05-01T10:00:00.000Z',
      category: 'BOOKS',
      stockQuantity: 7,
      isAvailableForPurchase: false,
      isRebuyable: false,
    },
  ],
  total: 3,
};

describe('useAdminUpdateProductsTable', () => {
  beforeEach(() => {
    mockedGetAdminProductsAction.mockReset();
    mockedGetAdminProductsBulkStatusAction.mockReset();
    mockedUpdateProductAction.mockReset();
    mockedGetAdminProductsBulkStatusAction.mockResolvedValue({ isBusy: false });
    mockedUpdateProductAction.mockResolvedValue(initialResponse.data[0]!);
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

  it('marks the edit draft dirty and submits isRebuyable changes', async () => {
    const { result } = renderHook(() => useAdminUpdateProductsTable(initialResponse, 'it'));

    act(() => {
      result.current.openEditModal('p1');
    });

    expect(result.current.editDraft?.isRebuyable).toBe(false);

    act(() => {
      result.current.updateEditDraft({ isRebuyable: true });
    });

    expect(result.current.isDirty).toBe(true);

    await act(async () => {
      result.current.save();
    });

    await waitFor(() => {
      expect(mockedUpdateProductAction).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 'p1',
          isRebuyable: true,
        })
      );
    });
  });

  it('marks the edit draft dirty and submits feature and specification text changes', async () => {
    const responseWithRelations: PaginatedProductsResponse = {
      data: [
        {
          ...initialResponse.data[0]!,
          features: [{ id: 'feature-1', text: 'Vecchio punto', sortOrder: 0 }],
          specifications: [{ id: 'spec-1', label: 'RAM', value: '8GB', sortOrder: 0 }],
        },
      ],
      total: 1,
    };
    const { result } = renderHook(() => useAdminUpdateProductsTable(responseWithRelations, 'it'));

    act(() => {
      result.current.openEditModal('p1');
    });

    act(() => {
      result.current.updateEditDraft({
        features: [{ id: 'feature-1', text: 'Nuovo punto', sortOrder: 0 }],
        specifications: [{ id: 'spec-1', label: 'RAM', value: '16GB', sortOrder: 0 }],
      });
    });

    expect(result.current.isDirty).toBe(true);

    await act(async () => {
      result.current.save();
    });

    await waitFor(() => {
      expect(mockedUpdateProductAction).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 'p1',
          features: [{ id: 'feature-1', text: 'Nuovo punto', sortOrder: 0 }],
          specifications: [{ id: 'spec-1', label: 'RAM', value: '16GB', sortOrder: 0 }],
        })
      );
    });
  });

  it('calculates discount percent from sale price and submits sale fields', async () => {
    const { result } = renderHook(() => useAdminUpdateProductsTable(initialResponse, 'it'));

    act(() => {
      result.current.openEditModal('p1');
    });

    act(() => {
      result.current.updateEditDraft({ isInSale: true });
      result.current.updateEditDraft({ salePriceInCents: '1599' });
    });

    expect(result.current.editDraft?.saleDiscountPercent).toBe('20');

    await act(async () => {
      result.current.save();
    });

    await waitFor(() => {
      expect(mockedUpdateProductAction).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 'p1',
          isInSale: true,
          salePriceInCents: 1599,
          saleDiscountPercent: 20,
        })
      );
    });
  });

  it('normalizes missing sale booleans to keep the edit checkbox controlled', () => {
    const legacyResponse: PaginatedProductsResponse = {
      data: [
        {
          ...initialResponse.data[0]!,
          isInSale: undefined as unknown as boolean,
          isAvailableForPurchase: undefined as unknown as boolean,
          isRebuyable: undefined as unknown as boolean,
        },
      ],
      total: 1,
    };
    const { result } = renderHook(() => useAdminUpdateProductsTable(legacyResponse, 'it'));

    act(() => {
      result.current.openEditModal('p1');
    });

    expect(result.current.editDraft?.isInSale).toBe(false);
    expect(result.current.editDraft?.isAvailableForPurchase).toBe(false);
    expect(result.current.editDraft?.isRebuyable).toBe(false);
  });

  it('keeps sale fields editable when a checked sale product has empty sale values', () => {
    const { result } = renderHook(() => useAdminUpdateProductsTable(initialResponse, 'it'));

    act(() => {
      result.current.openEditModal('p1');
      result.current.updateEditDraft({ isInSale: true });
      result.current.updateEditDraft({ salePriceInCents: '1' });
      result.current.updateEditDraft({ salePriceInCents: '' });
    });

    expect(result.current.editDraft?.isInSale).toBe(true);
    expect(result.current.editDraft?.salePriceInCents).toBe('');
    expect(result.current.editDraft?.saleDiscountPercent).toBe('');
  });

  it('calculates sale price from discount percent', () => {
    const { result } = renderHook(() => useAdminUpdateProductsTable(initialResponse, 'it'));

    act(() => {
      result.current.openEditModal('p1');
      result.current.updateEditDraft({ isInSale: true });
      result.current.updateEditDraft({ saleDiscountPercent: '10' });
    });

    expect(result.current.editDraft?.salePriceInCents).toBe('1799');
  });

  it('does not submit a sale product without a valid sale discount', async () => {
    const { result } = renderHook(() => useAdminUpdateProductsTable(initialResponse, 'it'));

    act(() => {
      result.current.openEditModal('p1');
      result.current.updateEditDraft({ isInSale: true });
    });

    await act(async () => {
      result.current.save();
    });

    expect(mockedUpdateProductAction).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(result.current.toast?.severity).toBe('error');
    });
  });
});
