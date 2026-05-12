'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { ContentCard, ContentCardBody } from '@/components/ContentCard';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { resolveProductImageSrc } from '@/lib/shop/format';
import type { BackendOrderProduct } from '@/types/api/order';
import styles from './RebuyableProductsFeature.module.scss';

type RebuyableProductsFeatureProps = {
  readonly locale: Locale;
};

export function RebuyableProductsFeature({
  locale,
}: Readonly<RebuyableProductsFeatureProps>) {
  const t = createTranslator(locale);
  const [items, setItems] = useState<BackendOrderProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/rebuyable-products', { cache: 'no-store' })
      .then((response) =>
        response.ok ? (response.json() as Promise<BackendOrderProduct[]>) : []
      )
      .then((products) => setItems(Array.isArray(products) ? products : []))
      .catch(() => setItems([]))
      .finally(() => setIsLoaded(true));
  }, []);

  if (!isLoaded || items.length === 0) return null;

  return (
    <Box component="section" className={styles.section} data-testid="rebuyable-products">
      <Suspense fallback={<ComponentLoading label={t('loadingInProgress')} />}>
        <ContentCard variant="outlined" testId="rebuyable-products-card" className={styles.card}>
          <ContentCardBody title={t('rebuyableProductsTitle')}>
            <Box className={styles.grid}>
              {items.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
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
