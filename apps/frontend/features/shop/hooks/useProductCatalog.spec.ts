import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { APP_NAME } from '@/lib/constants';
import { createTranslator } from '@/lib/i18n/translator';

import { useCart } from '@/store/CartContext';
import type { BackendProduct } from '@/types/api/product';
import { useProductCatalog } from './useProductCatalog';

vi.mock('@/store/CartContext', () => ({
  useCart: vi.fn(),
}));

const mockedUseCart = vi.mocked(useCart);
const syncWithProducts = vi.fn();
const t = createTranslator('it');

function createProduct(
  id: string,
  title: string,
  category: BackendProduct['category'],
  description = `${title} description`
): BackendProduct {
  return {
    id,
    title,
    name: title,
    description,
    imagePath: `/${id}.png`,
    imagePaths: [`/${id}.png`],
    category,
    subcategory: null,
    brand: null,
    priceInCents: 1999,
    originalPriceInCents: null,
    stockQuantity: 8,
    isAvailableForPurchase: true,
    isRebuyable: false,
    createdAt: '2026-05-01T10:00:00.000Z',
    updatedAt: '2026-05-01T10:00:00.000Z',
  };
}

const products: BackendProduct[] = [
  createProduct('p1', 'Alpha Mouse', 'TECHNOLOGY', 'Wireless office mouse'),
  createProduct('p2', 'Beta Book', 'BOOKS', 'Deep guide for frontend testing'),
  createProduct('p3', 'Gamma Lamp', 'HOME', 'Desk lamp for the studio'),
];

describe('useProductCatalog', () => {
  beforeEach(() => {
    syncWithProducts.mockReset();
    mockedUseCart.mockReturnValue({
      items: [],
      totalQuantity: 0,
      totalInCents: 0,
      stockAlerts: [],
      isLoaded: true,
      addItem: vi.fn(),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
      clearAlerts: vi.fn(),
      syncWithProducts,
      syncWithStatuses: vi.fn(),
      refreshItemStock: vi.fn(),
      refreshAllStock: vi.fn(),
    });
  });

  it('syncs the cart with the available products on mount', async () => {
    renderHook(() => useProductCatalog(products, 'it'));

    await waitFor(() => {
      expect(syncWithProducts).toHaveBeenCalledWith(products);
    });
  });

  it('returns stable translated labels and category options', () => {
    const { result } = renderHook(() => useProductCatalog(products, 'it'));

    expect(result.current.labels.brand).toBe(APP_NAME);
    expect(result.current.labels.title).toBe(t('catalogTitle'));
    expect(result.current.labels.addToCart).toBe(t('cartAddItem'));
    expect(result.current.categoryOptions[0]).toEqual({
      value: 'ALL',
      label: t('categoryAll'),
    });
    expect(result.current.categoryOptions).toContainEqual({
      value: 'BOOKS',
      label: t('categoryBooks'),
    });
  });

  it('filters products by category and text search', () => {
    const { result } = renderHook(() => useProductCatalog(products, 'it'));

    act(() => {
      result.current.setCategory('BOOKS');
    });

    expect(result.current.filteredProducts.map((product) => product.id)).toEqual(['p2']);

    act(() => {
      result.current.setCategory('ALL');
      result.current.setQuery('lamp');
    });

    expect(result.current.filteredProducts.map((product) => product.id)).toEqual(['p3']);
  });

  it('exposes an empty state when no product matches the active filters', () => {
    const { result } = renderHook(() => useProductCatalog(products, 'it'));

    act(() => {
      result.current.setCategory('TECHNOLOGY');
      result.current.setQuery('nonexistent');
    });

    expect(result.current.filteredProducts).toEqual([]);
    expect(result.current.labels.empty).toBe(t('catalogEmpty'));
  });
});
