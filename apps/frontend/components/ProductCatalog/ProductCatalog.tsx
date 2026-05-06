'use client';

import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { ReactNode } from 'react';
import type { BackendProduct, ProductCategory } from '@/types/api/product';
import { ProductCard, type ProductCardViewModel } from '@/components/ProductCard/ProductCard';
import { homeTestIds } from '@/e2e/utils/support/auth-test-ids';
import styles from './ProductCatalog.module.scss';

type ProductCatalogCategoryOption = {
  readonly value: ProductCategory | 'ALL';
  readonly label: string;
};

type ProductCatalogLabels = {
  readonly brand: string;
  readonly heroEyebrow: string;
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly heroPrimaryCta: string;
  readonly heroSecondaryCta: string;
  readonly heroSectionAria: string;
  readonly quickCategoriesAria: string;
  readonly title: string;
  readonly subtitle: string;
  readonly search: string;
  readonly empty: string;
  readonly stock: string;
  readonly addToCart: string;
  readonly decreaseQuantity: string;
  readonly increaseQuantity: string;
  readonly removeFromCart: string;
  readonly unavailable: string;
};

type ProductCatalogQuickCategory = {
  readonly value: ProductCategory;
  readonly label: string;
  readonly href: string;
  readonly icon: ReactNode;
};

type ProductCatalogSubcategory = {
  readonly slug: string;
  readonly label: string;
  readonly href: string;
  readonly isActive: boolean;
  readonly productCount: number;
};

type ProductCatalogProps = {
  readonly cards: ProductCardViewModel[];
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
    readonly eyebrow: string;
    readonly imageSrc: string;
    readonly slideLabel: string;
  };
  readonly query: string;
  readonly category: ProductCategory | 'ALL';
  readonly categoryOptions: ProductCatalogCategoryOption[];
  readonly labels: ProductCatalogLabels;
  readonly quickCategories: ProductCatalogQuickCategory[];
  readonly subcategories: ProductCatalogSubcategory[];
  readonly onQueryChange: (value: string) => void;
  readonly onCategoryChange: (value: ProductCategory | 'ALL') => void;
  readonly onPreviousHero: () => void;
  readonly onNextHero: () => void;
  /** Slot per il componente AddToCartButton (connesso al context) per ogni card */
  readonly cartActionSlot?: (card: ProductCardViewModel) => ReactNode;
};

export function ProductCatalog({
  cards,
  hero,
  query,
  category,
  categoryOptions,
  labels,
  quickCategories,
  subcategories,
  onQueryChange,
  onCategoryChange,
  onPreviousHero,
  onNextHero,
  cartActionSlot,
}: Readonly<ProductCatalogProps>) {
  return (
    <Box component="section" data-testid="product-catalog" className={styles.pageSection}>
      <Box
        component="section"
        aria-label={labels.heroSectionAria}
        className={styles.heroSection}
        data-testid={homeTestIds.page}
      >
        {/* Background image for the carousel */}
        <Box className={styles.heroBackground}>
          <Image
            src={hero.imageSrc}
            alt=""
            fill
            sizes="100vw"
            className={styles.heroBackgroundImage}
            priority
            unoptimized
          />
        </Box>

        {/* Hero content wrapper */}
        <Box className={styles.heroWrapper}>
          <Box className={styles.heroContent}>
            <Typography variant="overline" className={styles.heroEyebrow}>
              {hero.eyebrow}
            </Typography>
            <Typography
              component="h1"
              variant="h2"
              className={styles.heroTitle}
              data-testid={homeTestIds.title}
            >
              {hero.title}
            </Typography>
            <Typography className={styles.heroSubtitle} data-testid={homeTestIds.subtitle}>
              {hero.subtitle}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              className={styles.heroActions}
            >
              <Button href="#catalog" variant="contained" className={styles.heroPrimaryButton}>
                {labels.heroPrimaryCta}
              </Button>
              <Button
                href="#quick-categories"
                variant="text"
                className={styles.heroSecondaryButton}
              >
                {labels.heroSecondaryCta}
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Carousel controls at hero level */}
        <IconButton
          onClick={onPreviousHero}
          className={styles.heroControlLeft}
          aria-label={labels.heroSectionAria}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Box className={styles.heroSlideCounter} aria-label={labels.heroSectionAria}>
          <Typography className={styles.heroSlideLabel}>{hero.slideLabel}</Typography>
        </Box>
        <IconButton
          onClick={onNextHero}
          className={styles.heroControlRight}
          aria-label={labels.heroSectionAria}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box
        component="nav"
        id="quick-categories"
        aria-label={labels.quickCategoriesAria}
        className={styles.quickCategories}
      >
        {quickCategories.map((item) => (
          <ButtonBase
            key={item.value}
            component={Link}
            href={item.href}
            className={styles.quickCategoryButton}
          >
            <Paper
              elevation={0}
              className={
                category === item.value ? styles.quickCategoryActive : styles.quickCategoryCard
              }
            >
              <Box className={styles.quickCategoryIcon}>{item.icon}</Box>
              <Typography variant="body2" className={styles.quickCategoryLabel}>
                {item.label}
              </Typography>
            </Paper>
          </ButtonBase>
        ))}
      </Box>

      <Box id="catalog" className={styles.headerBlock}>
        <Typography variant="overline" className={styles.eyebrow} data-testid={homeTestIds.brand}>
          {labels.brand}
        </Typography>
        <Box className={styles.titleRow}>
          <Box className={styles.catalogCopy}>
            <Typography component="h2" variant="h3" className={styles.title}>
              {labels.title}
            </Typography>
            <Typography className={styles.subtitle}>{labels.subtitle}</Typography>
          </Box>
          <TextField
            label={labels.search}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            size="small"
            className={styles.searchField}
            slotProps={{ htmlInput: { 'data-testid': 'catalog-search' } }}
          />
        </Box>
      </Box>

      {subcategories.length > 0 ? (
        <Box className={styles.subcategoryRail} aria-label={labels.quickCategoriesAria}>
          {subcategories.map((subcategory) => (
            <Button
              key={subcategory.slug}
              component={Link}
              href={subcategory.href}
              variant={subcategory.isActive ? 'contained' : 'outlined'}
              className={styles.subcategoryButton}
            >
              <span>{subcategory.label}</span>
              <span className={styles.subcategoryCount}>{subcategory.productCount}</span>
            </Button>
          ))}
        </Box>
      ) : null}

      <Box className={styles.categoryFilters}>
        {categoryOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            color={category === option.value ? 'primary' : 'default'}
            onClick={() => onCategoryChange(option.value)}
          />
        ))}
      </Box>

      {cards.length === 0 ? (
        <Paper variant="outlined" className={styles.emptyState}>
          <Typography>{labels.empty}</Typography>
        </Paper>
      ) : (
        <Box className={styles.productGrid}>
          {cards.map((card) => (
            <ProductCard
              key={card.product.id}
              card={card}
              labels={labels}
              cartActionSlot={cartActionSlot?.(card)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
