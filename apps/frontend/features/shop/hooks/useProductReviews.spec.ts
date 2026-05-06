import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProductReview } from '@/types/api/product';
import {
  createProductReview,
  listProductReviews,
  updateMyProductReview,
} from '@/lib/api/reviews';
import { useProductReviews } from './useProductReviews';

vi.mock('@/lib/api/reviews', () => ({
  createProductReview: vi.fn(),
  listProductReviews: vi.fn(),
  updateMyProductReview: vi.fn(),
}));

const mockedCreateProductReview = vi.mocked(createProductReview);
const mockedListProductReviews = vi.mocked(listProductReviews);
const mockedUpdateMyProductReview = vi.mocked(updateMyProductReview);

function review(id: string, userId = 'user-1'): ProductReview {
  return {
    id,
    productId: 'product-1',
    userId,
    rating: 5,
    title: 'Ottimo',
    body: 'Molto valido',
    status: 'PUBLISHED',
    isVerifiedPurchase: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('useProductReviews', () => {
  beforeEach(() => {
    mockedCreateProductReview.mockReset();
    mockedListProductReviews.mockReset();
    mockedUpdateMyProductReview.mockReset();
    mockedListProductReviews.mockResolvedValue([review('review-refreshed')]);
  });

  it('keeps public reviews visible when unauthenticated submit is rejected', async () => {
    mockedCreateProductReview.mockRejectedValue(new Error('Token unavailable'));
    const { result } = renderHook(() => useProductReviews('product-1', [review('review-1')]));

    await act(async () => {
      await result.current.submitReview({ rating: 5, title: 'Titolo', body: 'Testo' });
    });

    expect(result.current.reviews).toHaveLength(1);
    expect(result.current.error).toBe('Token unavailable');
  });

  it('submits an authenticated review and refreshes published reviews', async () => {
    mockedCreateProductReview.mockResolvedValue(review('review-created'));
    const { result } = renderHook(() => useProductReviews('product-1', []));

    await act(async () => {
      await result.current.submitReview({ rating: 5, title: 'Titolo', body: 'Testo' });
    });

    expect(mockedCreateProductReview).toHaveBeenCalledWith('product-1', {
      rating: 5,
      title: 'Titolo',
      body: 'Testo',
    });
    await waitFor(() => expect(result.current.reviews[0]?.id).toBe('review-refreshed'));
  });

  it('updates the current user review and refreshes published reviews', async () => {
    mockedUpdateMyProductReview.mockResolvedValue(review('review-updated'));
    const { result } = renderHook(() => useProductReviews('product-1', [review('review-1')]));

    await act(async () => {
      await result.current.updateReview({ title: 'Nuovo titolo' });
    });

    expect(mockedUpdateMyProductReview).toHaveBeenCalledWith('product-1', {
      title: 'Nuovo titolo',
    });
    await waitFor(() => expect(result.current.reviews[0]?.id).toBe('review-refreshed'));
  });
});
