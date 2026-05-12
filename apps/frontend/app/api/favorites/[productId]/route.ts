import { NextResponse } from 'next/server';
import { authenticatedBackendRequest } from '@/lib/api/backend';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    await authenticatedBackendRequest(
      `/wishlists/${encodeURIComponent(productId)}`,
      { method: 'DELETE' },
      'Failed to remove favorite'
    );
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const status = (error as { status?: number }).status ?? 500;
    if (status === 401 || (error instanceof Error && error.message === 'Token unavailable')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Failed to remove favorite' }, { status });
  }
}
