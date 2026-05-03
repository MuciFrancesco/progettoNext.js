import type { TranslationKey } from '@/lib/i18n/translator';
import { type ProductCategory } from '@/types/api/product';

const categoryKeyMap: Record<ProductCategory, TranslationKey> = {
  TECHNOLOGY: 'categoryTechnology',
  HOME: 'categoryHome',
  CLOTHING: 'categoryClothing',
  SPORTS: 'categorySports',
  BOOKS: 'categoryBooks',
  FOOD: 'categoryFood',
  BEAUTY: 'categoryBeauty',
  TOYS: 'categoryToys',
  OTHER: 'categoryOther',
};

export function categoryTranslationKey(category: ProductCategory): TranslationKey {
  return categoryKeyMap[category];
}
