import { describe, expect, it } from 'vitest';
import type { BackendOrder, BackendOrderProduct } from '@/types/api/order';
import { getRebuyablePurchasedProducts } from './rebuyableProducts';

function product(id: string, isRebuyable: boolean): BackendOrderProduct {
  return {
    id,
    title: `Product ${id}`,
    name: `product-${id}`,
    description: `Description ${id}`,
    imagePath: `/${id}.png`,
    imagePaths: [`/${id}.png`],
    category: 'OTHER',
    priceInCents: 100,
    stockQuantity: 10,
    isAvailableForPurchase: true,
    isRebuyable,
  };
}

function order(id: string, products: readonly BackendOrderProduct[]): BackendOrder {
  return {
    id,
    totalPriceInCents: 1000,
    createdAt: `2026-05-${id.padStart(2, '0')}T10:00:00.000Z`,
    user: {
      id: 'user-1',
      email: 'user@example.com',
      firstname: 'User',
      secondname: null,
      lastname: 'Example',
    },
    items: products.map((item, index) => ({
      id: `${id}-${item.id}-${index}`,
      quantity: 1,
      unitPriceInCents: 100,
      lineTotalInCents: 100,
      productTitleSnapshot: item.title,
      productImageSnapshot: item.imagePath,
      product: item,
    })),
  };
}

describe('getRebuyablePurchasedProducts', () => {
  it('returns the first four unique purchased products marked as rebuyable', () => {
    const duplicate = product('p1', true);
    const result = getRebuyablePurchasedProducts([
      order('3', [duplicate, product('p2', false), product('p3', true)]),
      order('2', [product('p4', true), duplicate]),
      order('1', [product('p5', true), product('p6', true)]),
    ]);

    expect(result.map((item) => item.id)).toEqual(['p1', 'p3', 'p4', 'p5']);
  });

  it('returns no products when fewer than four purchased products qualify', () => {
    const result = getRebuyablePurchasedProducts([
      order('1', [product('p1', true), product('p2', false), product('p3', true)]),
    ]);

    expect(result).toEqual([]);
  });
});
