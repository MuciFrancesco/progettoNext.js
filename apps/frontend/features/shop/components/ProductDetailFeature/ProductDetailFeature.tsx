'use client';

import { useEffect, lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { addRecentlyViewed } from '@/lib/recently-viewed/recentlyViewed';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { formatCurrency } from '@/lib/shop/format';
import { getEffectivePriceInCents } from '@/lib/shop/pricing';
import type { BackendProduct, ProductReview } from '@/types/api/product';
import { AddToCartButton } from '@/components/AddToCartButton/AddToCartButton';
import { ProductBuyBox } from '@/components/ProductBuyBox/ProductBuyBox';
import { ProductGallery } from '@/components/ProductGallery/ProductGallery';
import { ProductInfo } from '@/components/ProductInfo/ProductInfo';
import { ProductPrice } from '@/components/ProductPrice/ProductPrice';
import { ProductRating } from '@/components/ProductRating/ProductRating';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { useProductDetail } from '@/features/shop/hooks/useProductDetail';
import styles from './ProductDetailFeature.module.scss';

const ProductReviews = lazy(() =>
  import('@/components/ProductReviews/ProductReviews').then((m) => ({ default: m.ProductReviews }))
);

type ProductDetailFeatureProps = {
  readonly product: BackendProduct;
  readonly reviews: readonly ProductReview[];
  readonly locale: Locale;
  readonly canReview: boolean;
};

export function ProductDetailFeature({
  product,
  reviews,
  locale,
  canReview,
}: ProductDetailFeatureProps) {
  const t = createTranslator(locale);

  useEffect(() => {
    addRecentlyViewed({
      id: product.id,
      title: product.title,
      name: product.name,
      description: product.description.slice(0, 150),
      imagePath: product.imagePath,
      priceInCents: product.priceInCents,
      originalPriceInCents: product.originalPriceInCents,
      category: product.category,
      stockQuantity: product.stockQuantity,
      isAvailableForPurchase: product.isAvailableForPurchase,
    });
  }, [product]);

  const {
    reviewState,
    quantity,
    sortedImages,
    activeImage,
    boundedActiveImageIndex,
    setActiveImageIndex,
    sortedFeatures,
    sortedSpecifications,
    rating,
    setRating,
    title,
    setTitle,
    body,
    setBody,
    handleAdd,
    handleDecrease,
    handleIncrease,
    handleQuantityChange,
    removeItem,
    submitReview,
  } = useProductDetail(product, reviews);

  return (
    <Box component="main" className={styles.page}>
      <Box className={styles.detailGrid}>
        <Box className={styles.galleryColumn}>
          <ProductGallery
            images={sortedImages}
            activeImage={activeImage}
            activeIndex={boundedActiveImageIndex}
            fallbackAlt={product.title}
            labels={{
              gallery: t('productGalleryLabel'),
              image: (position) => t('productGalleryImageLabel', { position }),
              empty: t('productGalleryEmpty'),
            }}
            onSelectImage={setActiveImageIndex}
          />
        </Box>

        <Box className={styles.buyColumn}>
          <ProductBuyBox
            inStock={product.stockQuantity > 0}
            stockLabel={
              product.stockQuantity > 0
                ? t('productStockAvailableCount', { count: product.stockQuantity })
                : t('productUnavailable')
            }
            price={
              <ProductPrice
                price={formatCurrency(getEffectivePriceInCents(product), locale)}
                originalPrice={
                  product.isInSale && product.salePriceInCents
                    ? formatCurrency(product.priceInCents, locale)
                    : product.originalPriceInCents
                      ? formatCurrency(product.originalPriceInCents, locale)
                      : undefined
                }
                saleBadge={
                  product.isInSale && product.saleDiscountPercent
                    ? t('productSaleBadge', { percent: product.saleDiscountPercent })
                    : undefined
                }
              />
            }
            action={
              <AddToCartButton
                product={product}
                quantity={quantity}
                addLabel={t('cartAddItem')}
                decreaseLabel={t('cartDecreaseQuantity')}
                increaseLabel={t('cartIncreaseQuantity')}
                quantityLabel={t('cartQuantity')}
                removeLabel={t('cartRemoveItem')}
                unavailableLabel={t('productUnavailable')}
                onAdd={handleAdd}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
                onQuantityChange={handleQuantityChange}
                onRemove={removeItem}
              />
            }
            labels={{
              ariaLabel: t('productBuyBoxLabel'),
              deliveryTitle: t('productDeliveryTitle'),
              deliveryDate: t('productDeliveryDate'),
              deliveryVendor: t('productDeliveryVendor'),
              trustLabel: t('productTrustLabel'),
              returns: t('productTrustReturns'),
              securePayment: t('productTrustSecurePayment'),
              warranty: t('productTrustWarranty'),
            }}
          />
        </Box>

        <Box className={styles.infoColumn}>
          <ProductInfo
            brand={product.brand}
            title={product.title}
            subtitle={product.name}
            categoryLabel={t(categoryTranslationKey(product.category))}
            description={product.description}
            features={sortedFeatures}
            specifications={sortedSpecifications}
            rating={
              <ProductRating
                value={product.averageRating ?? 0}
                reviewCount={product.reviewCount ?? 0}
                label={t('productRatingLabel')}
              />
            }
            labels={{
              featuresTitle: t('productFeaturesTitle'),
              specsTitle: t('productSpecsTitle'),
            }}
          />
        </Box>
      </Box>

      <Suspense fallback={<ComponentLoading label={t('loadingInProgress')} />}>
        <ProductReviews
          reviews={reviewState.reviews}
          rating={rating}
          reviewTitle={title}
          reviewBody={body}
          error={reviewState.error}
          isPending={reviewState.isPending}
          canReview={canReview}
          canSubmit={title.trim().length > 0 && body.trim().length > 0}
          labels={{
            title: t('productReviewsTitle'),
            rating: t('productReviewRatingLabel'),
            titleField: t('productReviewTitleField'),
            bodyField: t('productReviewBodyField'),
            submit: t('productReviewSubmit'),
            verifiedPurchase: t('productVerifiedPurchase'),
            authRequired: t('productReviewAuthRequired'),
            empty: t('productReviewEmpty'),
          }}
          onRatingChange={setRating}
          onTitleChange={setTitle}
          onBodyChange={setBody}
          onSubmit={submitReview}
        />
      </Suspense>
    </Box>
  );
}
