'use client';

import Box from '@mui/material/Box';
import Image from 'next/image';
import type { ReactNode } from 'react';
import styles from './ImageOverlay.module.scss';

export type ImageOverlayPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

export type ImageOverlayProps = {
  readonly src: string;
  readonly alt: string;
  readonly height?: number; // height in px, default 240
  readonly overlay?: ReactNode; // content to overlay on image
  readonly overlayPosition?: ImageOverlayPosition;
  readonly testId?: string;
};

/**
 * Sub-component: Image with optional overlay text/content.
 * Used within ContentCard to display images with text overlays.
 * Fully responsive with proper image sizing.
 */
export function ImageOverlay({
  src,
  alt,
  height = 240,
  overlay,
  overlayPosition = 'bottom-left',
  testId,
}: Readonly<ImageOverlayProps>) {
  return (
    <Box
      className={styles.imageOverlayContainer}
      style={{ minHeight: `${height}px` }}
      data-testid={testId}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={styles.image}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {overlay && (
        <Box
          className={`${styles.overlay} ${styles[overlayPosition]}`}
          data-testid={`${testId}-overlay`}
        >
          {overlay}
        </Box>
      )}
    </Box>
  );
}
