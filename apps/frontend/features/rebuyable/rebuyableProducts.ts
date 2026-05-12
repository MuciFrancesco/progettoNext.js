import type { BackendOrder, BackendOrderProduct } from '@/types/api/order';

const MIN_REBUYABLE_PRODUCTS = 4;

export function getRebuyablePurchasedProducts(
  orders: readonly BackendOrder[]
): BackendOrderProduct[] {
  const productsById = new Map<string, BackendOrderProduct>();

  for (const order of orders) {
    for (const item of order.items) {
      const { product } = item;
      if (!product.isRebuyable || productsById.has(product.id)) continue;
      productsById.set(product.id, product);
    }
  }

  const products = [...productsById.values()];
  return products.length >= MIN_REBUYABLE_PRODUCTS
    ? products.slice(0, MIN_REBUYABLE_PRODUCTS)
    : [];
}
