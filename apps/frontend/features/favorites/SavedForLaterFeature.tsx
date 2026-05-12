'use client';

import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { ContentCard, ContentCardBody } from '@/components/ContentCard';
import { resolveProductImageSrc } from '@/lib/shop/format';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { useWishlist } from '@/store/WishlistContext';
import { useCart } from '@/store/CartContext';
import styles from './SavedForLaterFeature.module.scss';

type SavedForLaterFeatureProps = {
  readonly locale: Locale;
};

export function SavedForLaterFeature({ locale }: Readonly<SavedForLaterFeatureProps>) {
  const t = createTranslator(locale);
  const { items, isLoaded, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();

  if (!isLoaded || items.length === 0) return null;

  return (
    <Box component="section" className={styles.section} data-testid="saved-for-later-section">
      <ContentCard variant="outlined" testId="saved-for-later-card" className={styles.card}>
        <ContentCardBody title={t('wishlistTitle')}>
          <Box className={styles.list}>
            {items.map(({ productId, product, quantity }) => (
              <Box key={productId} className={styles.item}>
                <Box className={styles.imageWrapper}>
                  <Image
                    src={resolveProductImageSrc(product.imagePath)}
                    alt={product.title}
                    fill
                    sizes="64px"
                    className={styles.image}
                    unoptimized
                  />
                </Box>
                <Box className={styles.itemInfo}>
                  <Typography variant="body2" className={styles.itemTitle}>
                    {product.title}
                  </Typography>
                  <Typography variant="caption" className={styles.itemQty}>
                    {t('cartQuantity')}: {quantity}
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    className={styles.moveToCartBtn}
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) addToCart(product);
                      void removeItem(productId);
                    }}
                  >
                    {t('wishlistMoveToCart')}
                  </Button>
                </Box>
                <IconButton
                  size="small"
                  aria-label={t('wishlistRemoveLabel')}
                  onClick={() => void removeItem(productId)}
                  className={styles.removeBtn}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </ContentCardBody>
      </ContentCard>
    </Box>
  );
}
