import { NextResponse } from 'next/server';
import {
  BackendRequestError,
  authenticatedBackendRequest,
  backendRequest,
} from '@/lib/api/backend';

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { productId } = await context.params;
  try {
    const response = await backendRequest(`/products/${productId}/reviews`);
    return NextResponse.json(response);
  } catch (error) {
    const status = error instanceof BackendRequestError ? error.status : 400;
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Request failed' },
      { status }
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { productId } = await context.params;
  const payload = (await request.json().catch(() => ({}))) as unknown;

  try {
    const response = await authenticatedBackendRequest(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const status = error instanceof BackendRequestError ? error.status : 400;
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Request failed' },
      { status }
    );
  }
}
