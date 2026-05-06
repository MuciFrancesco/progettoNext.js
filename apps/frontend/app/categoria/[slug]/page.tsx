import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import { notFound } from 'next/navigation';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader/PublicShopHeader';
import { ProductCatalogFeature } from '@/features/shop/components/ProductCatalogFeature/ProductCatalogFeature';
import { FooterFeature } from '@/features/layout/FooterFeature';
import { APP_NAME } from '@/lib/constants';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { getCategoryCatalog, listCatalogNavigation } from '@/lib/api/products';
import { getPublicFooterSections, getSharedFooterSections } from '@/lib/footer/footerSections';
import styles from './page.module.scss';

type CategoryPageProps = {
  readonly params: Promise<{ slug: string }>;
  readonly searchParams?: Promise<{ q?: string; subcategory?: string }>;
};

export async function generateMetadata({ params }: Readonly<CategoryPageProps>): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getCategoryCatalog(slug, { limit: 1, revalidate: 60 }).catch(() => null);
  return { title: catalog?.category.label ?? 'Categoria' };
}

export default async function CategoryPage({ params, searchParams }: Readonly<CategoryPageProps>) {
  const [{ slug }, queryParams, locale, t, navigation] = await Promise.all([
    params,
    searchParams,
    getCurrentLocale(),
    getTranslator(),
    listCatalogNavigation({ revalidate: 60 }).catch(() => ({ categories: [], heroSlides: [] })),
  ]);

  const selectedSubcategory = queryParams?.subcategory?.trim() || undefined;
  const catalog = await getCategoryCatalog(slug, {
    subcategorySlug: selectedSubcategory,
    q: queryParams?.q?.trim() || undefined,
    limit: 60,
    revalidate: 60,
  }).catch(() => null);

  if (!catalog) {
    notFound();
  }

  return (
    <Box className={styles.shell}>
      <PublicShopHeader />
      <Box component="main" className={styles.main}>
        <ProductCatalogFeature
          products={catalog.products.data}
          locale={locale}
          initialQuery={queryParams?.q?.trim() ?? ''}
          initialCategory={catalog.category.category}
          heroSlides={[
            {
              category: catalog.category.category,
              slug: catalog.category.slug,
              label: catalog.category.label,
              title: catalog.category.heroTitle,
              subtitle: catalog.category.heroSubtitle,
              imagePath: catalog.category.heroImagePath,
            },
          ]}
          catalogTitle={catalog.category.label}
          catalogSubtitle={catalog.category.heroSubtitle}
          quickCategories={navigation.categories.map((category) => ({
            category: category.category,
            slug: category.slug,
            label: category.label,
          }))}
          subcategories={catalog.category.subcategories}
          selectedSubcategorySlug={selectedSubcategory}
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
