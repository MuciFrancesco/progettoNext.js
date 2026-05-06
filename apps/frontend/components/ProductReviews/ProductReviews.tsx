import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { ProductReview } from '@/types/api/product';
import styles from './ProductReviews.module.scss';

type ProductReviewsLabels = {
  readonly title: string;
  readonly rating: string;
  readonly titleField: string;
  readonly bodyField: string;
  readonly submit: string;
  readonly verifiedPurchase: string;
};

type ProductReviewsProps = {
  readonly reviews: readonly ProductReview[];
  readonly rating: number | null;
  readonly reviewTitle: string;
  readonly reviewBody: string;
  readonly error: string | null;
  readonly isPending: boolean;
  readonly canSubmit: boolean;
  readonly labels: ProductReviewsLabels;
  readonly onRatingChange: (value: number | null) => void;
  readonly onTitleChange: (value: string) => void;
  readonly onBodyChange: (value: string) => void;
  readonly onSubmit: () => void;
};

export function ProductReviews({
  reviews,
  rating,
  reviewTitle,
  reviewBody,
  error,
  isPending,
  canSubmit,
  labels,
  onRatingChange,
  onTitleChange,
  onBodyChange,
  onSubmit,
}: Readonly<ProductReviewsProps>) {
  return (
    <Stack component="section" spacing={2} className={styles.reviewBox}>
      <Typography component="h2" variant="h5">
        {labels.title}
      </Typography>
      <Stack spacing={2} className={styles.reviewForm}>
        <Rating
          value={rating}
          onChange={(_, value) => onRatingChange(value)}
          aria-label={labels.rating}
        />
        <TextField
          value={reviewTitle}
          onChange={(event) => onTitleChange(event.target.value)}
          label={labels.titleField}
        />
        <TextField
          value={reviewBody}
          onChange={(event) => onBodyChange(event.target.value)}
          label={labels.bodyField}
          multiline
          minRows={3}
        />
        {error ? <Alert severity="warning">{error}</Alert> : null}
        <Button variant="contained" onClick={onSubmit} disabled={isPending || !canSubmit}>
          {labels.submit}
        </Button>
      </Stack>

      <Box className={styles.reviewList}>
        {reviews.map((review) => (
          <Box key={review.id} className={styles.reviewItem}>
            <Rating value={review.rating} readOnly size="small" />
            <Typography className={styles.reviewTitle}>{review.title}</Typography>
            <Typography>{review.body}</Typography>
            {review.isVerifiedPurchase ? (
              <Chip size="small" label={labels.verifiedPurchase} />
            ) : null}
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
