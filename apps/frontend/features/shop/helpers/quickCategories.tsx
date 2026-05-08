import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import DevicesIcon from '@mui/icons-material/Devices';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SpaIcon from '@mui/icons-material/Spa';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import WeekendIcon from '@mui/icons-material/Weekend';
import type { ReactNode } from 'react';
import type { ProductCategory } from '@/types/api/product';

// ─── Constants ──────────────────────────────────────────────────────────────

export const QUICK_CATEGORY_ICONS: Record<ProductCategory, ReactNode> = {
  TECHNOLOGY: <DevicesIcon fontSize="small" />,
  HOME: <WeekendIcon fontSize="small" />,
  CLOTHING: <CheckroomIcon fontSize="small" />,
  SPORTS: <SportsBasketballIcon fontSize="small" />,
  BOOKS: <MenuBookIcon fontSize="small" />,
  FOOD: <RestaurantIcon fontSize="small" />,
  BEAUTY: <SpaIcon fontSize="small" />,
  TOYS: <SmartToyIcon fontSize="small" />,
  OTHER: <AutoAwesomeIcon fontSize="small" />,
};

// ─── Types ──────────────────────────────────────────────────────────────────

type BackendQuickCategory = Readonly<{
  category: ProductCategory;
  slug: string;
  label: string;
}>;

type CategoryOption = Readonly<{
  value: ProductCategory | 'ALL';
  label: string;
}>;

type BuildQuickCategoriesResult = Readonly<{
  value: ProductCategory;
  label: string;
  href: string;
  icon: ReactNode;
}>;

// ─── Helpers ────────────────────────────────────────────────────────────────

export function buildQuickCategories(
  fromBackend: ReadonlyArray<BackendQuickCategory> | undefined,
  categoryOptions: ReadonlyArray<CategoryOption>
): BuildQuickCategoriesResult[] {
  return (
    fromBackend?.length
      ? fromBackend
      : categoryOptions
          .filter(
            (option): option is CategoryOption & { value: ProductCategory } =>
              option.value !== 'ALL'
          )
          .map((option) => ({
            category: option.value,
            slug: option.value.toLowerCase(),
            label: option.label,
          }))
  ).map((option) => ({
    value: option.category,
    label: option.label,
    href: `/categoria/${option.slug}`,
    icon: QUICK_CATEGORY_ICONS[option.category],
  }));
}
