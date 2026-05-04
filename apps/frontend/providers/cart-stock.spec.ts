import { describe, expect, it } from 'vitest';
import { reconcileCartItemsWithStatuses } from '@/providers/cart-stock';

const item = (quantity: number) => ({
  product: {
    id: 'p1',
    title: 'Monitor',
    name: 'Monitor',
    description: '4K',
    imagePath: '',
    imagePaths: [],
    category: 'TECHNOLOGY' as const,
    priceInCents: 1000,
    stockQuantity: 5,
    isAvailableForPurchase: true,
    createdAt: '',
    updatedAt: '',
  },
  quantity,
});

describe('reconcileCartItemsWithStatuses', () => {
  it('removes unavailable items', () => {
    const result = reconcileCartItemsWithStatuses([item(2)], [
      { id: 'p1', stockQuantity: 0, isAvailableForPurchase: false },
    ]);

    expect(result.items).toEqual([]);
    expect(result.alerts[0]).toMatchObject({ productId: 'p1', kind: 'removed' });
  });

  it('reduces quantities to current stock', () => {
    const result = reconcileCartItemsWithStatuses([item(3)], [
      { id: 'p1', stockQuantity: 2, isAvailableForPurchase: true },
    ]);

    expect(result.items[0]?.quantity).toBe(2);
    expect(result.alerts[0]).toMatchObject({ productId: 'p1', kind: 'reduced' });
  });
});
