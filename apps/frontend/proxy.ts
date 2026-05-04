import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/user', '/admin', '/checkout', '/api/checkout'];
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3333';

/**
 * Decode JWT payload without verification (we only need the `exp` claim).
 * This runs on Edge Runtime where Node.js crypto is unavailable.
 */
function getJwtExp(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replaceAll('-', '+').replaceAll('_', '/');
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded) as { exp?: number };
    return typeof parsed.exp === 'number' ? parsed.exp : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const exp = getJwtExp(token);
  if (exp === null) return true;
  // Add 5-second buffer to avoid edge-case races
  return Date.now() / 1000 >= exp - 5;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Token present and still valid — allow through
  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  // Attempt silent refresh
  if (refreshToken) {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (res.ok) {
        const data = (await res.json()) as { access_token: string; refresh_token: string };
        const isProd = process.env.NODE_ENV === 'production';

        // Forward the new token in a request header so route handlers can use it
        // during THIS request (response cookies are only visible on the next request).
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-access-token', data.access_token);

        const response = NextResponse.next({
          request: { headers: requestHeaders },
        });

        response.cookies.set('access_token', data.access_token, {
          httpOnly: true,
          secure: isProd,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 15,
        });
        response.cookies.set('refresh_token', data.refresh_token, {
          httpOnly: true,
          secure: isProd,
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
        return response;
      }
    } catch {
      // Network error — fall through to redirect
    }
  }

  // No valid token — redirect to login
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.search = '?mode=signin';
  const redirectResponse = NextResponse.redirect(loginUrl);
  redirectResponse.cookies.delete('access_token');
  redirectResponse.cookies.delete('refresh_token');
  return redirectResponse;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/user/:path*',
    '/admin/:path*',
    '/checkout',
    '/checkout/:path*',
    '/api/checkout',
    '/api/checkout/:path*',
  ],
};
