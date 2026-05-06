import type { BackendOrder } from '@/types/api/order';

export function getOrderPrimaryItem(order: BackendOrder) {
  return order.items[0] ?? null;
}

export function getOrderProductName(order: BackendOrder): string {
  const item = getOrderPrimaryItem(order);
  if (!item) return '';
  const suffix = order.items.length > 1 ? ` +${order.items.length - 1}` : '';
  return `${item.productTitleSnapshot || item.product.name}${suffix}`;
}
