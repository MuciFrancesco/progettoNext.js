'use client';

import Image from 'next/image';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(activeIndex);

  if (!activeImage) {
    return (
      <Box component="section" className={styles.gallery} aria-label={labels.gallery}>
        <Box className={styles.emptyFrame}>
          <Typography color="text.secondary">{labels.empty}</Typography>
        </Box>
      </Box>
    );
  }

  const boundedLightboxIndex =
    lightboxIndex >= 0 && lightboxIndex < images.length ? lightboxIndex : activeIndex;
  const lightboxImage = images[boundedLightboxIndex] ?? activeImage;
  const showLightboxControls = images.length > 1;
  const imageCountLabel = `${activeIndex + 1} / ${images.length}`;
  const lightboxCountLabel = `${boundedLightboxIndex + 1} / ${images.length}`;

  function openLightbox() {
    setLightboxIndex(activeIndex);
    setIsLightboxOpen(true);
  }

  function selectLightboxImage(index: number) {
    setLightboxIndex(index);
    onSelectImage(index);
  }

  function showPreviousImage() {
    const previousIndex = (boundedLightboxIndex - 1 + images.length) % images.length;
    selectLightboxImage(previousIndex);
  }

  function showNextImage() {
    const nextIndex = (boundedLightboxIndex + 1) % images.length;
    selectLightboxImage(nextIndex);
  }

  return (
    <Stack component="section" spacing={1.5} className={styles.gallery} aria-label={labels.gallery}>
      <Box
        component="button"
        type="button"
        className={styles.imageFrame}
        onClick={openLightbox}
      >
        <Image
          src={resolveProductImageSrc(activeImage.url)}
          alt={activeImage.altText ?? fallbackAlt}
          fill
          sizes="(max-width: 960px) 100vw, 34vw"
          className={styles.productImage}
          priority
          unoptimized
        />
        <span className={styles.zoomHint}>
          <ZoomInIcon fontSize="small" />
        </span>
        {images.length > 1 ? <span className={styles.imageCount}>{imageCountLabel}</span> : null}
      </Box>

      <Dialog
        open={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        maxWidth="lg"
        fullWidth
        slotProps={{ paper: { 'aria-label': labels.gallery } }}
        onKeyDown={(event) => {
          if (!showLightboxControls) return;
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showPreviousImage();
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            showNextImage();
          }
        }}
      >
        <DialogContent className={styles.lightboxContent}>
          <Box className={styles.lightboxToolbar}>
            <Typography variant="body2" className={styles.lightboxCounter}>
              {lightboxCountLabel}
            </Typography>
          </Box>
          <Box className={styles.lightboxFrame}>
            <Image
              src={resolveProductImageSrc(lightboxImage.url)}
              alt={lightboxImage.altText ?? fallbackAlt}
              fill
              sizes="90vw"
              className={styles.lightboxImage}
              unoptimized
            />
            {showLightboxControls ? (
              <>
                <IconButton
                  type="button"
                  aria-label="Previous image"
                  className={`${styles.lightboxNavButton} ${styles.lightboxPrevious}`}
                  onClick={showPreviousImage}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  type="button"
                  aria-label="Next image"
                  className={`${styles.lightboxNavButton} ${styles.lightboxNext}`}
                  onClick={showNextImage}
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            ) : null}
          </Box>
          {showLightboxControls ? (
            <Box className={styles.lightboxThumbRow}>
              {images.map((image, index) => (
                <IconButton
                  key={`${image.url}-${image.sortOrder}-lightbox`}
                  type="button"
                  aria-label={`Show enlarged image ${index + 1}`}
                  aria-pressed={index === boundedLightboxIndex}
                  onClick={() => selectLightboxImage(index)}
                  className={
                    index === boundedLightboxIndex ? styles.lightboxThumbActive : styles.lightboxThumb
                  }
                >
                  <Image
                    src={resolveProductImageSrc(image.url)}
                    alt=""
                    fill
                    sizes="64px"
                    className={styles.productImage}
                    unoptimized
                  />
                </IconButton>
              ))}
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>

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
                alt=""
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
