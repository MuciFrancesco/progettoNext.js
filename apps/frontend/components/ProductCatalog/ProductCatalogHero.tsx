'use client';

import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './ProductCatalog.module.scss';

type ProductCatalogHeroProps = {
  readonly imageSrc: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly slideLabel: string;
  readonly primaryCta: string;
  readonly secondaryCta: string;
  readonly ariaLabel: string;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly 'data-testid'?: string;
};

export function ProductCatalogHero({
  imageSrc,
  eyebrow,
  title,
  subtitle,
  slideLabel,
  primaryCta,
  secondaryCta,
  ariaLabel,
  onPrevious,
  onNext,
  'data-testid': testId,
}: Readonly<ProductCatalogHeroProps>) {
  return (
    <Box
      component="section"
      aria-label={ariaLabel}
      className={styles.heroSection}
      data-testid={testId}
    >
      <Box className={styles.heroBackground}>
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="100vw"
          className={styles.heroBackgroundImage}
          priority
          unoptimized
        />
      </Box>

      <Box className={styles.heroWrapper}>
        <Box className={styles.heroContent}>
          <Typography variant="overline" className={styles.heroEyebrow}>
            {eyebrow}
          </Typography>
          <Typography component="h1" variant="h2" className={styles.heroTitle}>
            {title}
          </Typography>
          <Typography className={styles.heroSubtitle}>{subtitle}</Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            className={styles.heroActions}
          >
            <Button href="#catalog" variant="contained" className={styles.heroPrimaryButton}>
              {primaryCta}
            </Button>
            <Button href="#quick-categories" variant="text" className={styles.heroSecondaryButton}>
              {secondaryCta}
            </Button>
          </Stack>
        </Box>
      </Box>

      <IconButton onClick={onPrevious} className={styles.heroControlLeft} aria-label={ariaLabel}>
        <ChevronLeftIcon />
      </IconButton>
      <Box className={styles.heroSlideCounter} aria-label={ariaLabel}>
        <Typography className={styles.heroSlideLabel}>{slideLabel}</Typography>
      </Box>
      <IconButton onClick={onNext} className={styles.heroControlRight} aria-label={ariaLabel}>
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}
