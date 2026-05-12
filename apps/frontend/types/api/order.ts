import type { ProductCategory } from './product';

export type OrderFilter = 'today' | 'week' | 'month' | 'year' | 'all';

export interface PaginatedOrdersResponse {
  readonly data: BackendOrder[];
  readonly total: number;
  readonly totalRevenue: number;
  readonly grandTotalRevenue: number;
}

export interface BackendOrderProduct {
  readonly id: string;
  readonly title: string;
  readonly name: string;
  readonly description: string;
  readonly imagePath: string;
  readonly imagePaths?: readonly string[];
  readonly category: ProductCategory;
  readonly priceInCents?: number;
  readonly stockQuantity: number;
  readonly isAvailableForPurchase: boolean;
  readonly isRebuyable: boolean;
}

export interface BackendOrderUser {
  readonly id: string;
  readonly email: string;
  readonly firstname: string | null;
  readonly secondname: string | null;
  readonly lastname: string | null;
}

export interface BackendOrder {
  readonly id: string;
  readonly totalPriceInCents: number;
  readonly createdAt: string;
  readonly user: BackendOrderUser;
  readonly items: readonly BackendOrderItem[];
}

export interface BackendOrderItem {
  readonly id: string;
  readonly quantity: number;
  readonly unitPriceInCents: number;
  readonly lineTotalInCents: number;
  readonly productTitleSnapshot: string;
  readonly productImageSnapshot: string | null;
  readonly product: BackendOrderProduct;
}
