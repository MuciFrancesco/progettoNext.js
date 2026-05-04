import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  SESSION_EXPIRED_COOKIE_NAME,
} from '@/lib/auth/session';

async function expireSession(request: Request): Promise<NextResponse> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
  cookieStore.set(SESSION_EXPIRED_COOKIE_NAME, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 5,
  });

  return NextResponse.redirect(new URL('/logout', request.url));
}

export async function GET(request: Request): Promise<NextResponse> {
  return expireSession(request);
}

export async function POST(request: Request): Promise<NextResponse> {
  return expireSession(request);
}
