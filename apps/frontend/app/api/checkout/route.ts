import { NextResponse } from 'next/server';
import { BackendRequestError, authenticatedBackendRequest } from '@/lib/api/backend';

type CheckoutPayload = {
  readonly items?: Array<{ readonly productId?: string; readonly quantity?: number }>;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as CheckoutPayload;

  try {
    const response = await authenticatedBackendRequest<{
      amount: number;
      currency: string;
      mode: 'stripe' | 'demo';
      clientSecret: string;
    }>('/checkout/payment-intent', {
      method: 'POST',
      body: JSON.stringify({ items: payload.items ?? [] }),
    });

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof Error && error.message === 'Token unavailable') {
      return NextResponse.json({ code: 'UNAUTHENTICATED', message: error.message }, { status: 401 });
    }

    if (error instanceof BackendRequestError && error.status === 400) {
      return NextResponse.json(
        { code: 'INVALID_CART', message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Checkout unavailable' },
      { status: 400 }
    );
  }
}
