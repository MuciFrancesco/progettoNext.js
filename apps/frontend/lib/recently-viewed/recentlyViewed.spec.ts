import { describe, expect, it } from 'vitest';
import type { ProductStatusSnapshot } from '@/types/api/product';
import {
  filterAvailableRecentlyViewed,
  type RecentlyViewedItem,
} from '@/lib/recently-viewed/recentlyViewed';

function recentlyViewedItem(id: string): RecentlyViewedItem {
  return {
    id,
    title: `Product ${id}`,
    name: `product-${id}`,
    description: `Description ${id}`,
    imagePath: `/${id}.png`,
    priceInCents: 100,
    originalPriceInCents: null,
    category: 'OTHER',
    stockQuantity: 10,
    isAvailableForPurchase: true,
    viewedAt: 1,
  };
}

function status(
  id: string,
  overrides: Partial<ProductStatusSnapshot> = {}
): ProductStatusSnapshot {
  return {
    id,
    stockQuantity: 10,
    isAvailableForPurchase: true,
    ...overrides,
  };
}

describe('filterAvailableRecentlyViewed', () => {
  it('keeps only recently viewed products confirmed as purchasable by the backend', () => {
    const result = filterAvailableRecentlyViewed(
      [recentlyViewedItem('p1'), recentlyViewedItem('deleted'), recentlyViewedItem('sold-out')],
      [status('p1'), status('sold-out', { stockQuantity: 0 })]
    );

    expect(result.map((item) => item.id)).toEqual(['p1']);
  });
});
