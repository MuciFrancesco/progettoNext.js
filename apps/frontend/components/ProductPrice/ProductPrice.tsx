import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './ProductPrice.module.scss';

type ProductPriceProps = {
  readonly price: string;
  readonly originalPrice?: string;
};

export function ProductPrice({ price, originalPrice }: Readonly<ProductPriceProps>) {
  return (
    <Box className={styles.priceRow}>
      <Typography variant="h4" className={styles.price}>
        {price}
      </Typography>
      {originalPrice ? (
        <Typography className={styles.originalPrice}>{originalPrice}</Typography>
      ) : null}
    </Box>
  );
}
