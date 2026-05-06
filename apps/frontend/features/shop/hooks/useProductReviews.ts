'use client';

import { useCallback, useState, useTransition } from 'react';
import type { ProductReview } from '@/types/api/product';
import {
  createProductReview,
  listProductReviews,
  type ProductReviewInput,
  updateMyProductReview,
} from '@/lib/api/reviews';

export function useProductReviews(productId: string, initialReviews: readonly ProductReview[]) {
  const [reviews, setReviews] = useState<ProductReview[]>([...initialReviews]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const refreshReviews = useCallback(async () => {
    const nextReviews = await listProductReviews(productId);
    setReviews(nextReviews);
  }, [productId]);

  const submitReview = useCallback(
    async (input: ProductReviewInput) => {
      setError(null);
      try {
        await createProductReview(productId, input);
        await refreshReviews();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Request failed');
      }
    },
    [productId, refreshReviews]
  );

  const updateReview = useCallback(
    async (input: Partial<ProductReviewInput>) => {
      setError(null);
      try {
        await updateMyProductReview(productId, input);
        await refreshReviews();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Request failed');
      }
    },
    [productId, refreshReviews]
  );

  const submitReviewTransition = useCallback(
    (input: ProductReviewInput) => {
      startTransition(() => {
        void submitReview(input);
      });
    },
    [submitReview]
  );

  const updateReviewTransition = useCallback(
    (input: Partial<ProductReviewInput>) => {
      startTransition(() => {
        void updateReview(input);
      });
    },
    [updateReview]
  );

  return {
    reviews,
    error,
    isPending,
    refreshReviews,
    submitReview,
    submitReviewTransition,
    updateReview,
    updateReviewTransition,
  };
}
