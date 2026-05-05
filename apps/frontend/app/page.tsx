import type { Metadata } from 'next';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { listPublicProducts } from '@/lib/api/products';
import { ProductCatalogFeature } from '@/features/shop/components/ProductCatalogFeature/ProductCatalogFeature';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader/PublicShopHeader';

export const metadata: Metadata = {
  title: 'Catalog',
};

export default async function HomePage() {
  const [locale, productsResponse] = await Promise.all([
    getCurrentLocale(),
    listPublicProducts({ limit: 60, revalidate: 60 }).catch(() => ({ data: [], total: 0 })),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <PublicShopHeader />
      <main className="flex-1">
        <ProductCatalogFeature products={productsResponse.data} locale={locale} />
      </main>
    </div>
  );
}
