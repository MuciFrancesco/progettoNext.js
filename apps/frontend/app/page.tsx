import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import { FooterFeature } from '@/features/footer/FooterFeature';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { getTranslator } from '@/lib/i18n/locale';
import { APP_NAME } from '@/lib/constants';
import { listCatalogNavigation, listPublicProducts } from '@/lib/api/products';
import { getPublicFooterSections, getSharedFooterSections } from '@/lib/footer/footerSections';
import { ProductCatalogFeature } from '@/features/shop/components/ProductCatalogFeature/ProductCatalogFeature';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader/PublicShopHeader';
import { PRODUCT_CATEGORIES, type ProductCategory } from '@/types/api/product';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Catalog',
};

type HomePageProps = {
  readonly searchParams?: Promise<{ q?: string; category?: string }>;
};

export default async function HomePage({ searchParams }: Readonly<HomePageProps>) {
  const [locale, t, productsResponse, navigation, params] = await Promise.all([
    getCurrentLocale(),
    getTranslator(),
    listPublicProducts({ limit: 60, revalidate: 60 }).catch(() => ({ data: [], total: 0 })),
    listCatalogNavigation({ revalidate: 60 }).catch(() => ({ categories: [], heroSlides: [] })),
    searchParams,
  ]);
  const initialQuery = params?.q?.trim() ?? '';
  const initialCategory = params?.category;
  const safeInitialCategory: ProductCategory | 'ALL' =
    initialCategory && PRODUCT_CATEGORIES.includes(initialCategory as ProductCategory)
      ? (initialCategory as ProductCategory)
      : 'ALL';

  return (
    <Box className={styles.shell}>
      <PublicShopHeader />
      <Box component="main" className={styles.main}>
        <ProductCatalogFeature
          products={productsResponse.data}
          locale={locale}
          initialQuery={initialQuery}
          initialCategory={safeInitialCategory}
          heroSlides={navigation.heroSlides}
          quickCategories={navigation.categories.map((category) => ({
            category: category.category,
            slug: category.slug,
            label: category.label,
          }))}
        />
      </Box>
      <FooterFeature
        appName={APP_NAME}
        copyright={t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
        note={t('footerUserNote')}
        sections={[
          ...getPublicFooterSections(t),
          ...getSharedFooterSections(t).filter((section) => section.title !== t('footerSupport')),
        ]}
      />
    </Box>
  );
}
