import { NextResponse } from 'next/server';
import { authenticatedBackendRequest } from '@/lib/api/backend';

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as { items?: unknown[] };

  try {
    const response = await authenticatedBackendRequest('/checkout/paypal/order', {
      method: 'POST',
      body: JSON.stringify({ items: payload.items ?? [] }),
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'PayPal unavailable' },
      { status: 400 }
    );
  }
}
