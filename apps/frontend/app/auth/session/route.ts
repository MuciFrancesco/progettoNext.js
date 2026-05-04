import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getCurrentSession, SESSION_EXPIRED_COOKIE_NAME } from '@/lib/auth/session';

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const expired = cookieStore.get(SESSION_EXPIRED_COOKIE_NAME)?.value === '1';
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ authenticated: false, expired }, { status: 401 });
  }

  if (expired) {
    cookieStore.delete(SESSION_EXPIRED_COOKIE_NAME);
  }

  return NextResponse.json({ authenticated: true }, { status: 200 });
}
