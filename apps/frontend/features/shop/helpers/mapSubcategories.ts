import type { CatalogSubcategory } from '@/types/api/product';

type MappedSubcategory = {
  readonly slug: string;
  readonly label: string;
  readonly href: string;
  readonly isActive: boolean;
  readonly productCount: number;
};

/** Trasforma le subcategory backend nel formato atteso da ProductCatalog. */
export function mapSubcategories(
  subcategories: readonly CatalogSubcategory[],
  selectedSubcategorySlug: string | undefined
): MappedSubcategory[] {
  return subcategories.map((subcategory) => {
    const isActive = selectedSubcategorySlug === subcategory.slug;

    return {
      slug: subcategory.slug,
      label: subcategory.label,
      href: isActive ? '#' : `?subcategory=${subcategory.slug}`,
      isActive,
      productCount: subcategory.productCount,
    };
  });
}
