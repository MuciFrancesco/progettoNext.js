import { NextResponse } from 'next/server';
import { authenticatedBackendRequest } from '@/lib/api/backend';

export async function GET() {
  try {
    const data = await authenticatedBackendRequest('/wishlists', undefined, 'Favorites unavailable');
    return NextResponse.json(data);
  } catch (error: unknown) {
    const status = (error as { status?: number }).status ?? 500;
    if (status === 401 || (error instanceof Error && error.message === 'Token unavailable')) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json({ message: 'Favorites unavailable' }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const data = await authenticatedBackendRequest('/wishlists', {
      method: 'POST',
      body: JSON.stringify(body),
    }, 'Failed to add favorite');
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const status = (error as { status?: number }).status ?? 500;
    if (status === 401 || (error instanceof Error && error.message === 'Token unavailable')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Failed to add favorite' }, { status });
  }
}
