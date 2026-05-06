import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader/PublicShopHeader';
import { ProductDetailFeature } from '@/features/shop/components/ProductDetailFeature/ProductDetailFeature';
import { backendRequest } from '@/lib/api/backend';
import { getPublicProduct } from '@/lib/api/products';
import { getCurrentLocale } from '@/lib/i18n/locale';
import type { ProductReview } from '@/types/api/product';

type ProductPageProps = {
  readonly params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Product',
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [locale, product, reviews] = await Promise.all([
    getCurrentLocale(),
    getPublicProduct(id, { revalidate: 60 }).catch(() => null),
    backendRequest<ProductReview[]>(`/products/${id}/reviews`, undefined, 'Request failed', {
      next: { revalidate: 30 },
    }).catch(() => []),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <PublicShopHeader />
      <ProductDetailFeature product={product} reviews={reviews} locale={locale} />
    </>
  );
}
