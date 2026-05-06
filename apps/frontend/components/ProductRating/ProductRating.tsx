import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import styles from './ProductRating.module.scss';

type ProductRatingProps = {
  readonly value: number;
  readonly reviewCount: number;
  readonly label: string;
};

export function ProductRating({ value, reviewCount, label }: Readonly<ProductRatingProps>) {
  return (
    <Box className={styles.ratingRow} aria-label={label}>
      <Rating value={value} precision={0.5} readOnly />
      <Typography variant="body2" color="text.secondary">
        {reviewCount}
      </Typography>
    </Box>
  );
}
