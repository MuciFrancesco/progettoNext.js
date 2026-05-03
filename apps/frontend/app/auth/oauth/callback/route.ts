import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { saveSessionToken } from '@/lib/auth/session';
import { decodeJwtPayload } from '@/lib/auth/jwt';
import { resolveRole } from '@/lib/auth/roles';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3333';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?mode=signin', request.url));
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/oauth/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login?mode=signin', request.url));
    }

    const { access_token, refresh_token } = (await response.json()) as {
      access_token: string;
      refresh_token: string;
    };

    await saveSessionToken(access_token, refresh_token);

    const payload = decodeJwtPayload(access_token);
    const role = payload ? resolveRole(payload.email, undefined, payload.isAdmin) : 'USER';
    const redirectPath = role === 'ADMIN' ? '/dashboard' : '/user';

    return NextResponse.redirect(new URL(redirectPath, request.url));
  } catch {
    return NextResponse.redirect(new URL('/login?mode=signin', request.url));
  }
}
