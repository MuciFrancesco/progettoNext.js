'use client';

import { useCallback, useState } from 'react';
import type { BackendProduct, ProductReview } from '@/types/api/product';
import { useCart } from '@/store/CartContext';
import { useProductReviews } from '@/features/shop/hooks/useProductReviews';

export function useProductDetail(product: BackendProduct, reviews: readonly ProductReview[]) {
  const reviewState = useProductReviews(product.id, reviews);
  const { items, addItem, updateQuantity, removeItem } = useCart();

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = useCallback(() => addItem(product), [addItem, product]);
  const handleDecrease = useCallback(
    (productId: string) => {
      const current = items.find((i) => i.product.id === productId);
      if (current && current.quantity <= 1) {
        removeItem(productId);
      } else {
        updateQuantity(productId, (current?.quantity ?? 1) - 1);
      }
    },
    [items, removeItem, updateQuantity]
  );
  const handleIncrease = useCallback(
    (productId: string, maxStock: number) => {
      const current = items.find((i) => i.product.id === productId);
      updateQuantity(productId, Math.min((current?.quantity ?? 0) + 1, maxStock));
    },
    [items, updateQuantity]
  );

  const images = product.images?.length
    ? product.images
    : product.imagePaths.map((url, index) => ({
        url,
        altText: product.title,
        sortOrder: index,
        isPrimary: index === 0,
      }));
  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const initialImageIndex = Math.max(0, sortedImages.findIndex((img) => img.isPrimary));
  const [activeImageIndex, setActiveImageIndex] = useState(initialImageIndex);
  const boundedActiveImageIndex = Math.min(activeImageIndex, Math.max(sortedImages.length - 1, 0));
  const activeImage = sortedImages[boundedActiveImageIndex];

  const sortedFeatures = [...(product.features ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedSpecifications = [...(product.specifications ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const [rating, setRating] = useState<number | null>(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  function submitReview() {
    reviewState.submitReviewTransition({ rating: rating ?? 5, title, body });
    setTitle('');
    setBody('');
  }

  return {
    reviewState,
    quantity,
    sortedImages,
    activeImage,
    boundedActiveImageIndex,
    setActiveImageIndex,
    sortedFeatures,
    sortedSpecifications,
    rating,
    setRating,
    title,
    setTitle,
    body,
    setBody,
    handleAdd,
    handleDecrease,
    handleIncrease,
    removeItem,
    submitReview,
  };
}
