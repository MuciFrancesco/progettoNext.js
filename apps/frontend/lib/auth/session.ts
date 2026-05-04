import { cookies, headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getMe } from '@/lib/api/auth';
import { resolveRole } from '@/lib/auth/roles';
import type { AuthSession } from '@/types/api/auth';
import type { UserRole } from '@/types/api/user';

export const AUTH_COOKIE_NAME = 'access_token';
export const REFRESH_COOKIE_NAME = 'refresh_token';
export const SESSION_EXPIRED_COOKIE_NAME = 'session_expired';

function expireSession(): never {
  redirect('/auth/logout');
}

export async function saveSessionToken(accessToken: string, refreshToken?: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_EXPIRED_COOKIE_NAME);
  cookieStore.set(AUTH_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  });
  if (refreshToken) {
    cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export async function clearSessionToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
  cookieStore.delete(SESSION_EXPIRED_COOKIE_NAME);
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value;
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const headersList = await headers();

  // Prefer the token forwarded by the proxy middleware on a silent refresh
  // (response cookies are only flushed to the browser, not visible in this request)
  const token = headersList.get('x-access-token') ?? cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const me = await getMe(token);
    const role = resolveRole(me.email, me.role, me.isAdmin, me.isEmployee);

    return {
      token,
      user: {
        id: me.id,
        email: me.email,
        isAdmin: me.isAdmin,
        isEmployee: me.isEmployee,
        firstname: me.firstname,
        secondname: me.secondname ?? null,
        lastname: me.lastname,
        role,
        createdAt: me.createdAt ?? '',
        updatedAt: me.updatedAt ?? '',
      },
    };
  } catch {
    return null;
  }
}

export function redirectByRole(role: UserRole): never {
  if (role === 'ADMIN' || role === 'EMPLOYEE') {
    redirect('/dashboard');
  }
  redirect('/');
}

export async function requireAdminSession(): Promise<AuthSession> {
  const cookieStore = await cookies();
  const hadToken = !!cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const hadExpiredFlag = cookieStore.get(SESSION_EXPIRED_COOKIE_NAME)?.value === '1';
  const session = await getCurrentSession();

  if (!session) {
    if (hadToken) {
      expireSession();
    }
    if (hadExpiredFlag) {
      notFound();
    }
    redirect('/login?mode=signin');
  }

  if (session.user.role !== 'ADMIN') {
    notFound();
  }

  return session;
}

export async function requireAdminOrEmployeeSession(): Promise<AuthSession> {
  const cookieStore = await cookies();
  const hadToken = !!cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const hadExpiredFlag = cookieStore.get(SESSION_EXPIRED_COOKIE_NAME)?.value === '1';
  const session = await getCurrentSession();

  if (!session) {
    if (hadToken) {
      expireSession();
    }
    if (hadExpiredFlag) {
      notFound();
    }
    redirect('/login?mode=signin');
  }

  if (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE') {
    notFound();
  }

  return session;
}

export async function requireUserSession(): Promise<AuthSession> {
  const cookieStore = await cookies();
  const hadToken = !!cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = await getCurrentSession();

  if (!session) {
    if (hadToken) {
      expireSession();
    }
    redirect('/login?mode=signin');
  }

  return session;
}
