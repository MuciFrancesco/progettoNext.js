import type { ProductReview } from '@/types/api/product';

export type ProductReviewInput = {
  readonly rating: number;
  readonly title: string;
  readonly body: string;
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message?: unknown }).message)
        : 'Request failed';
    throw new Error(message);
  }

  return payload as T;
}

export function listProductReviews(productId: string): Promise<ProductReview[]> {
  return requestJson<ProductReview[]>(`/api/products/${productId}/reviews`);
}

export function createProductReview(
  productId: string,
  input: ProductReviewInput
): Promise<ProductReview> {
  return requestJson<ProductReview>(`/api/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateMyProductReview(
  productId: string,
  input: Partial<ProductReviewInput>
): Promise<ProductReview> {
  return requestJson<ProductReview>(`/api/products/${productId}/reviews/me`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
