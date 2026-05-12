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
  readonly brand: string | null;
  readonly imagePath: string;
  readonly imagePaths: readonly string[];
  readonly category: ProductCategory;
  readonly subcategory: ProductSubcategory | null;
  readonly priceInCents: number;
  readonly originalPriceInCents: number | null;
  readonly isInSale: boolean;
  readonly salePriceInCents: number | null;
  readonly saleDiscountPercent: number | null;
  readonly averageRating?: number;
  readonly reviewCount?: number;
  readonly images?: readonly ProductImage[];
  readonly features?: readonly ProductFeature[];
  readonly specifications?: readonly ProductSpecification[];
  readonly stockQuantity: number;
  readonly isAvailableForPurchase: boolean;
  readonly isRebuyable: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ProductSubcategory {
  readonly id: string;
  readonly category: ProductCategory;
  readonly slug: string;
  readonly label: string;
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly heroImagePath: string;
  readonly sortOrder: number;
}

export interface CatalogCategory {
  readonly category: ProductCategory;
  readonly slug: string;
  readonly label: string;
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly heroImagePath: string;
  readonly productCount: number;
  readonly subcategories: CatalogSubcategory[];
}

export interface CatalogSubcategory extends ProductSubcategory {
  readonly productCount: number;
}

export interface CatalogHeroSlide {
  readonly category: ProductCategory;
  readonly slug: string;
  readonly label: string;
  readonly title: string;
  readonly subtitle: string;
  readonly imagePath: string;
}

export interface CatalogNavigationResponse {
  readonly categories: CatalogCategory[];
  readonly heroSlides: CatalogHeroSlide[];
}

export interface CategoryCatalogResponse {
  readonly category: CatalogCategory;
  readonly products: PaginatedProductsResponse;
}

export interface ProductImage {
  readonly id?: string;
  readonly url: string;
  readonly altText: string | null;
  readonly sortOrder: number;
  readonly isPrimary: boolean;
}

export interface ProductFeature {
  readonly id?: string;
  readonly text: string;
  readonly sortOrder: number;
}

export interface ProductSpecification {
  readonly id?: string;
  readonly label: string;
  readonly value: string;
  readonly sortOrder: number;
}

export interface ProductReviewUser {
  readonly id: string;
  readonly firstname: string | null;
  readonly secondname: string | null;
  readonly lastname: string | null;
}

export interface ProductReview {
  readonly id: string;
  readonly productId: string;
  readonly userId: string;
  readonly rating: number;
  readonly title: string;
  readonly body: string;
  readonly status: 'PUBLISHED' | 'HIDDEN';
  readonly isVerifiedPurchase: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly user?: ProductReviewUser;
}

export interface CreateProductInput {
  readonly title: string;
  readonly name: string;
  readonly description: string;
  readonly imagePaths: readonly string[];
  readonly brand?: string;
  readonly priceInCents?: number;
  readonly originalPriceInCents?: number;
  readonly isInSale?: boolean;
  readonly salePriceInCents?: number | null;
  readonly saleDiscountPercent?: number | null;
  readonly stockQuantity: number;
  readonly isAvailableForPurchase?: boolean;
  readonly isRebuyable?: boolean;
  readonly category: ProductCategory;
  readonly images?: readonly ProductImage[];
  readonly features?: readonly ProductFeature[];
  readonly specifications?: readonly ProductSpecification[];
}

export interface UpdateProductInput {
  readonly title?: string;
  readonly name?: string;
  readonly description?: string;
  readonly imagePath?: string;
  readonly imagePaths?: string[];
  readonly brand?: string;
  readonly priceInCents?: number;
  readonly originalPriceInCents?: number;
  readonly isInSale?: boolean;
  readonly salePriceInCents?: number | null;
  readonly saleDiscountPercent?: number | null;
  readonly stockQuantity?: number;
  readonly isAvailableForPurchase?: boolean;
  readonly isRebuyable?: boolean;
  readonly category?: ProductCategory;
  readonly images?: readonly ProductImage[];
  readonly features?: readonly ProductFeature[];
  readonly specifications?: readonly ProductSpecification[];
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

export interface ProductStatusSnapshot {
  readonly id: string;
  readonly stockQuantity: number;
  readonly isAvailableForPurchase: boolean;
}
