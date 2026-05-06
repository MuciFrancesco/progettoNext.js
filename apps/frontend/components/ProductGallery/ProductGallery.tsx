'use client';

import Image from 'next/image';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ProductImage } from '@/types/api/product';
import { resolveProductImageSrc } from '@/lib/shop/format';
import styles from './ProductGallery.module.scss';

type ProductGalleryLabels = {
  readonly gallery: string;
  readonly image: (position: number) => string;
  readonly empty: string;
};

type ProductGalleryProps = {
  readonly images: readonly ProductImage[];
  readonly activeImage: ProductImage | undefined;
  readonly activeIndex: number;
  readonly fallbackAlt: string;
  readonly labels: ProductGalleryLabels;
  readonly onSelectImage: (index: number) => void;
};

export function ProductGallery({
  images,
  activeImage,
  activeIndex,
  fallbackAlt,
  labels,
  onSelectImage,
}: Readonly<ProductGalleryProps>) {
  if (!activeImage) {
    return (
      <Box component="section" className={styles.gallery} aria-label={labels.gallery}>
        <Box className={styles.emptyFrame}>
          <Typography color="text.secondary">{labels.empty}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Stack component="section" spacing={1.5} className={styles.gallery} aria-label={labels.gallery}>
      <Box className={styles.imageFrame}>
        <Image
          src={resolveProductImageSrc(activeImage.url)}
          alt={activeImage.altText ?? fallbackAlt}
          fill
          sizes="(max-width: 960px) 100vw, 34vw"
          className={styles.productImage}
          priority
          unoptimized
        />
      </Box>

      {images.length > 1 ? (
        <Box className={styles.thumbRow}>
          {images.map((image, index) => (
            <IconButton
              key={`${image.url}-${image.sortOrder}`}
              type="button"
              aria-label={labels.image(index + 1)}
              aria-pressed={index === activeIndex}
              onClick={() => onSelectImage(index)}
              className={index === activeIndex ? styles.thumbActive : styles.thumb}
            >
              <Image
                src={resolveProductImageSrc(image.url)}
                alt={image.altText ?? fallbackAlt}
                fill
                sizes="64px"
                className={styles.productImage}
                unoptimized
              />
            </IconButton>
          ))}
        </Box>
      ) : null}
    </Stack>
  );
}
