import type { BackendProduct, ProductStatusSnapshot } from '@/types/api/product';

export type CartItemLike = {
  readonly product: BackendProduct;
  readonly quantity: number;
};

export type CartStockAlert = {
  readonly productId: string;
  readonly productTitle: string;
  readonly kind: 'removed' | 'reduced';
  readonly requestedQuantity: number;
  readonly availableQuantity: number;
};

export function mergeProductsWithStatuses(
  products: readonly BackendProduct[],
  statuses: readonly ProductStatusSnapshot[]
) {
  const statusById = new Map(statuses.map((status) => [status.id, status]));
  return products.map((product) => {
    const status = statusById.get(product.id);
    if (!status) return product;

    return {
      ...product,
      stockQuantity: status.stockQuantity,
      isAvailableForPurchase: status.isAvailableForPurchase,
    };
  });
}

export function reconcileCartItemsWithStatuses<T extends CartItemLike>(
  items: readonly T[],
  statuses: readonly ProductStatusSnapshot[]
) {
  const statusById = new Map(statuses.map((status) => [status.id, status]));
  const alerts: CartStockAlert[] = [];

  const nextItems = items
    .map((item) => {
      const status = statusById.get(item.product.id);
      if (!status) return item;

      if (!status.isAvailableForPurchase || status.stockQuantity <= 0) {
        alerts.push({
          productId: item.product.id,
          productTitle: item.product.title,
          kind: 'removed',
          requestedQuantity: item.quantity,
          availableQuantity: 0,
        });
        return null;
      }

      const quantity = Math.min(item.quantity, status.stockQuantity);

      if (quantity < item.quantity) {
        alerts.push({
          productId: item.product.id,
          productTitle: item.product.title,
          kind: 'reduced',
          requestedQuantity: item.quantity,
          availableQuantity: quantity,
        });
      }

      return {
        ...item,
        product: {
          ...item.product,
          stockQuantity: status.stockQuantity,
          isAvailableForPurchase: status.isAvailableForPurchase,
        },
        quantity,
      };
    })
    .filter((item): item is T => Boolean(item));

  return { items: nextItems, alerts };
}
