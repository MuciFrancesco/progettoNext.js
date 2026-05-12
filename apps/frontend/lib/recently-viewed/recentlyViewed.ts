import type { ProductCategory } from '@/types/api/product';
import type { ProductStatusSnapshot } from '@/types/api/product';
import { RECENTLY_VIEWED_KEY, RECENTLY_VIEWED_MAX } from '@/lib/constants';

export type RecentlyViewedItem = {
  readonly id: string;
  readonly title: string;
  readonly name: string;
  readonly description: string;
  readonly imagePath: string;
  readonly priceInCents: number;
  readonly originalPriceInCents: number | null;
  readonly category: ProductCategory;
  readonly stockQuantity: number;
  readonly isAvailableForPurchase: boolean;
  readonly viewedAt: number;
};

export function getRecentlyViewed(): RecentlyViewedItem[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RecentlyViewedItem[];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(item: Omit<RecentlyViewedItem, 'viewedAt'>): void {
  try {
    const current = getRecentlyViewed();
    const filtered = current.filter((i) => i.id !== item.id);
    const updated = [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, RECENTLY_VIEWED_MAX);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may be unavailable (private mode, storage quota, etc.)
  }
}

export function saveRecentlyViewed(items: readonly RecentlyViewedItem[]): void {
  try {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items.slice(0, RECENTLY_VIEWED_MAX)));
  } catch {
    // localStorage may be unavailable (private mode, storage quota, etc.)
  }
}

export function filterAvailableRecentlyViewed(
  items: readonly RecentlyViewedItem[],
  statuses: readonly ProductStatusSnapshot[]
): RecentlyViewedItem[] {
  const statusesById = new Map(statuses.map((status) => [status.id, status]));

  return items.filter((item) => {
    const status = statusesById.get(item.id);
    return Boolean(status?.isAvailableForPurchase && status.stockQuantity > 0);
  });
}
