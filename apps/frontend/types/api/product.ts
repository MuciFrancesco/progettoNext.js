export const PRODUCT_CATEGORIES = [
  'TECHNOLOGY',
  'HOME',
  'CLOTHING',
  'SPORTS',
  'BOOKS',
  'FOOD',
  'BEAUTY',
  'TOYS',
  'OTHER',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface BackendProduct {
  readonly id: string;
  readonly title: string;
  readonly name: string;
  readonly description: string;
  readonly imagePath: string;
  readonly imagePaths: readonly string[];
  readonly category: ProductCategory;
  readonly stockQuantity: number;
  readonly isAvailableForPurchase: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateProductInput {
  readonly title: string;
  readonly name: string;
  readonly description: string;
  readonly imagePaths: readonly string[];
  readonly stockQuantity: number;
  readonly category: ProductCategory;
}

export interface UpdateProductInput {
  readonly title?: string;
  readonly name?: string;
  readonly description?: string;
  readonly imagePath?: string;
  readonly imagePaths?: string[];
  readonly stockQuantity?: number;
  readonly isAvailableForPurchase?: boolean;
  readonly category?: ProductCategory;
}

export interface BulkUpdateProductInput {
  readonly ids: string[];
  readonly category?: ProductCategory;
  readonly isAvailableForPurchase?: boolean;
}

export interface CreateProductResponse {
  readonly created: boolean;
  readonly requiresConfirmation: boolean;
  readonly similarProducts: Array<{
    readonly id: string;
    readonly title: string;
    readonly name: string;
    readonly imagePath: string;
    readonly stockQuantity: number;
  }>;
  readonly product?: BackendProduct;
}

export interface PaginatedProductsResponse {
  readonly data: BackendProduct[];
  readonly total: number;
}
