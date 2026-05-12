import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
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
  readonly authRequired: string;
  readonly empty: string;
};

type ProductReviewsProps = {
  readonly reviews: readonly ProductReview[];
  readonly rating: number | null;
  readonly reviewTitle: string;
  readonly reviewBody: string;
  readonly error: string | null;
  readonly isPending: boolean;
  readonly canReview: boolean;
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
  canReview,
  canSubmit,
  labels,
  onRatingChange,
  onTitleChange,
  onBodyChange,
  onSubmit,
}: Readonly<ProductReviewsProps>) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
      : 0;

  return (
    <Stack component="section" spacing={2} className={styles.reviewBox}>
      <Box className={styles.header}>
        <Box>
          <Typography component="h2" variant="h5" className={styles.title}>
            {labels.title}
          </Typography>
          <Typography className={styles.subtitle}>
            {reviews.length} {labels.title.toLowerCase()}
          </Typography>
        </Box>
        {reviews.length > 0 ? (
          <Box className={styles.scoreBox}>
            <Typography className={styles.score}>{averageRating.toFixed(1)}</Typography>
            <Rating value={averageRating} precision={0.5} readOnly size="small" />
          </Box>
        ) : null}
      </Box>

      <Box className={styles.contentGrid}>
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
          {!canReview ? <Alert severity="info">{labels.authRequired}</Alert> : null}
          <Tooltip title={!canReview ? labels.authRequired : ''}>
            <span>
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={isPending || !canReview || !canSubmit}
              >
                {labels.submit}
              </Button>
            </span>
          </Tooltip>
        </Stack>

        <Box className={styles.reviewList}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Box key={review.id} className={styles.reviewItem}>
                <Box className={styles.reviewMeta}>
                  <Rating value={review.rating} readOnly size="small" />
                  {review.isVerifiedPurchase ? (
                    <Chip size="small" label={labels.verifiedPurchase} className={styles.chip} />
                  ) : null}
                </Box>
                <Typography className={styles.reviewTitle}>{review.title}</Typography>
                <Typography className={styles.reviewBody}>{review.body}</Typography>
              </Box>
            ))
          ) : (
            <Box className={styles.reviewItem}>
              <Typography className={styles.reviewBody}>{labels.empty}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Stack>
  );
}
