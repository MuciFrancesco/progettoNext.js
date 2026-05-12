'use client';

import { useState, useEffect, Suspense } from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';
import {
  filterAvailableRecentlyViewed,
  getRecentlyViewed,
  saveRecentlyViewed,
  type RecentlyViewedItem,
} from '@/lib/recently-viewed/recentlyViewed';
import { fetchProductStatuses } from '@/lib/api/product-status-client';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import styles from './RecentlyViewedFeature.module.scss';
import { resolveProductImageSrc } from '@/lib/shop/format';
import { ContentCard, ContentCardBody } from '@/components/ContentCard';
import { Link } from '@mui/material';

const MIN_ITEMS = 4;

type RecentlyViewedFeatureProps = {
  readonly locale: Locale;
};

export function RecentlyViewedFeature({ locale }: RecentlyViewedFeatureProps) {
  const t = createTranslator(locale);
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const displayed = items.slice(0, 4);

  useEffect(() => {
    let active = true;

    async function loadValidatedItems() {
      const storedItems = getRecentlyViewed();
      if (storedItems.length === 0) {
        setIsReady(true);
        return;
      }

      try {
        const statuses = await fetchProductStatuses(storedItems.map((item) => item.id));
        const availableItems = filterAvailableRecentlyViewed(storedItems, statuses);
        saveRecentlyViewed(availableItems);
        if (!active) return;
        setItems(availableItems);
      } catch {
        if (!active) return;
        setItems([]);
      } finally {
        if (active) setIsReady(true);
      }
    }

    void loadValidatedItems();

    return () => {
      active = false;
    };
  }, []);

  if (!isReady || items.length < MIN_ITEMS) return null;
  const title = t('recentlyViewedTitle');
  return (
    <Box component="section" className={styles.section} data-testid="recently-viewed">
      <Suspense fallback={<ComponentLoading label={t('loadingInProgress')} />}>
        <ContentCard variant="outlined" testId="recently-viewed-card" className={styles.card}>
          <ContentCardBody title={title}>
            <Box className={styles.grid}>
              {displayed.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className={styles.imageLink}
                  aria-label={item.title}
                >
                  <Box className={styles.imageWrapper}>
                    <Image
                      src={resolveProductImageSrc(item.imagePath)}
                      alt={item.title}
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
