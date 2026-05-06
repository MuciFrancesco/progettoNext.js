import { NextResponse } from 'next/server';
import { BackendRequestError, authenticatedBackendRequest } from '@/lib/api/backend';

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { productId } = await context.params;
  const payload = (await request.json().catch(() => ({}))) as unknown;

  try {
    const response = await authenticatedBackendRequest(`/products/${productId}/reviews/me`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return NextResponse.json(response);
  } catch (error) {
    const status = error instanceof BackendRequestError ? error.status : 400;
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Request failed' },
      { status }
    );
  }
}
