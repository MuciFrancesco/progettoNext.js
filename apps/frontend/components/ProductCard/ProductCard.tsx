import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { BackendProduct } from '@/types/api/product';
import { AddToCartButton } from '@/components/AddToCartButton/AddToCartButton';
import styles from './ProductCard.module.scss';

export type ProductCardViewModel = {
  readonly product: BackendProduct;
  readonly href: string;
  readonly imageSrc: string;
  readonly categoryLabel: string;
  readonly priceLabel: string;
  readonly stockLabel: string;
};

type ProductCardLabels = {
  readonly brand: string;
  readonly addToCart: string;
  readonly decreaseQuantity: string;
  readonly increaseQuantity: string;
  readonly removeFromCart: string;
  readonly unavailable: string;
};

type ProductCardProps = {
  readonly card: ProductCardViewModel;
  readonly labels: ProductCardLabels;
  readonly onRefreshProduct: (productId: string) => Promise<BackendProduct | undefined>;
};

export function ProductCard({ card, labels, onRefreshProduct }: Readonly<ProductCardProps>) {
  const { product } = card;

  return (
    <Paper
      variant="outlined"
      data-testid={`product-card-${product.id}`}
      className={styles.productCard}
    >
      <Box component={Link} href={card.href} className={styles.imageFrame}>
        {card.imageSrc ? (
          <Image
            src={card.imageSrc}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.containImage}
            unoptimized
          />
        ) : (
          <Box className={styles.imagePlaceholder}>
            <Typography>{labels.brand}</Typography>
          </Box>
        )}
      </Box>
      <Box className={styles.productContent}>
        <Box className={styles.productHeadingRow}>
          <Box>
            <Typography
              component={Link}
              href={card.href}
              variant="h6"
              className={styles.productTitle}
            >
              {product.title}
            </Typography>
            <Typography variant="body2" className={styles.mutedText}>
              {product.name}
            </Typography>
          </Box>
          <Chip size="small" label={card.categoryLabel} />
        </Box>
        <Typography variant="body2" className={styles.productDescription}>
          {product.description}
        </Typography>
        <Box className={styles.priceRow}>
          <Typography className={styles.price}>{card.priceLabel}</Typography>
          <Typography variant="caption" className={styles.mutedText}>
            {card.stockLabel}
          </Typography>
        </Box>
        <AddToCartButton
          product={product}
          addLabel={labels.addToCart}
          decreaseLabel={labels.decreaseQuantity}
          increaseLabel={labels.increaseQuantity}
          removeLabel={labels.removeFromCart}
          unavailableLabel={labels.unavailable}
          onRefreshProduct={onRefreshProduct}
        />
      </Box>
    </Paper>
  );
}
