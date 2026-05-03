import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/session';

const SESSION_EXPIRED_COOKIE_NAME = 'session_expired';

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
