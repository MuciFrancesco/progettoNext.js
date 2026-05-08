'use client';

import Box from '@mui/material/Box';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { formatCurrency } from '@/lib/shop/format';
import type { BackendProduct, ProductReview } from '@/types/api/product';
import { AddToCartButton } from '@/components/AddToCartButton/AddToCartButton';
import { ProductBuyBox } from '@/components/ProductBuyBox/ProductBuyBox';
import { ProductGallery } from '@/components/ProductGallery/ProductGallery';
import { ProductInfo } from '@/components/ProductInfo/ProductInfo';
import { ProductPrice } from '@/components/ProductPrice/ProductPrice';
import { ProductRating } from '@/components/ProductRating/ProductRating';
import { ProductReviews } from '@/components/ProductReviews/ProductReviews';
import { useProductDetail } from '@/features/shop/hooks/useProductDetail';
import styles from './ProductDetailFeature.module.scss';

type ProductDetailFeatureProps = {
  readonly product: BackendProduct;
  readonly reviews: readonly ProductReview[];
  readonly locale: Locale;
};

export function ProductDetailFeature({ product, reviews, locale }: ProductDetailFeatureProps) {
  const t = createTranslator(locale);
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
    removeItem,
    submitReview,
  } = useProductDetail(product, reviews);

  return (
    <Box component="main" className={styles.page}>
      <Box className={styles.detailGrid}>
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

        <ProductBuyBox
          inStock={product.stockQuantity > 0}
          stockLabel={
            product.stockQuantity > 0
              ? t('productStockAvailableCount', { count: product.stockQuantity })
              : t('productUnavailable')
          }
          price={
            <ProductPrice
              price={formatCurrency(product.priceInCents, locale)}
              originalPrice={
                product.originalPriceInCents
                  ? formatCurrency(product.originalPriceInCents, locale)
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
              removeLabel={t('cartRemoveItem')}
              unavailableLabel={t('productUnavailable')}
              onAdd={handleAdd}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
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

      <ProductReviews
        reviews={reviewState.reviews}
        rating={rating}
        reviewTitle={title}
        reviewBody={body}
        error={reviewState.error}
        isPending={reviewState.isPending}
        canSubmit={title.trim().length > 0 && body.trim().length > 0}
        labels={{
          title: t('productReviewsTitle'),
          rating: t('productReviewRatingLabel'),
          titleField: t('productReviewTitleField'),
          bodyField: t('productReviewBodyField'),
          submit: t('productReviewSubmit'),
          verifiedPurchase: t('productVerifiedPurchase'),
        }}
        onRatingChange={setRating}
        onTitleChange={setTitle}
        onBodyChange={setBody}
        onSubmit={submitReview}
      />
    </Box>
  );
}
