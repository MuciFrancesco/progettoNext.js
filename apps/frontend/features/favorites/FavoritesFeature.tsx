'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { ContentCard, ContentCardBody } from '@/components/ContentCard';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { resolveProductImageSrc } from '@/lib/shop/format';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { useWishlist } from '@/store/WishlistContext';
import styles from './FavoritesFeature.module.scss';

type FavoritesFeatureProps = {
  readonly locale: Locale;
};

export function FavoritesFeature({ locale }: Readonly<FavoritesFeatureProps>) {
  const t = createTranslator(locale);
  const { items, isLoaded } = useWishlist();

  if (!isLoaded || items.length === 0) return null;

  return (
    <Box component="section" className={styles.section} data-testid="favorites-section">
      <Suspense fallback={<ComponentLoading label={t('loadingInProgress')} />}>
        <ContentCard variant="outlined" testId="favorites-card" className={styles.card}>
          <ContentCardBody title={t('wishlistTitle')}>
            <Box className={styles.grid}>
              {items.slice(0, 4).map(({ productId, product }) => (
                <Link
                  key={productId}
                  href={`/product/${productId}`}
                  className={styles.imageLink}
                  aria-label={product.title}
                >
                  <Box className={styles.imageWrapper}>
                    <Image
                      src={resolveProductImageSrc(product.imagePath)}
                      alt={product.title}
                      fill
                      sizes="15vw"
                      className={styles.image}
                      unoptimized
                    />
                  </Box>
                </Link>
              ))}
            </Box>
          </ContentCardBody>
        </ContentCard>
      </Suspense>
    </Box>
  );
}
