'use server';

import { redirect } from 'next/navigation';
import {
  forgotPassword,
  logoutFromBackend,
  resetPassword,
  signin,
  signup,
} from '@/lib/api/auth';
import { clearSessionToken, getRefreshToken, saveSessionToken } from '@/lib/auth/session';
import { resolveRole } from '@/lib/auth/roles';
import { decodeJwtPayload } from '@/lib/auth/jwt';
import type { SigninRequest, SignupRequest, SigninResponse } from '@/types/api/auth';
import type { UserRole } from '@/types/api/user';

type AuthActionResult = {
  readonly ok: boolean;
  readonly redirectTo?: string;
  readonly error?: string;
  readonly remainingAttempts?: number;
  readonly isBlocked?: boolean;
};

function pathByRole(role: UserRole): string {
  if (role === 'ADMIN') {
    return '/dashboard';
  }

  return '/user';
}

export async function signinAction(input: SigninRequest): Promise<AuthActionResult> {
  const email = input.email.trim();
  const password = input.password;

  if (!email || !password) {
    return {
      ok: false,
      error: 'Compila email e password.',
    };
  }

  try {
    const signinResponse: SigninResponse = await signin({ email, password });

    // If backend returned remaining attempts (failed login with warning)
    if (signinResponse.remainingAttempts !== undefined) {
      return {
        ok: false,
        remainingAttempts: signinResponse.remainingAttempts,
        isBlocked: signinResponse.isBlocked,
        error: undefined,
      };
    }

    const access_token = signinResponse.access_token;
    if (!access_token) {
      return {
        ok: false,
        error: 'Login non riuscito',
      };
    }

    await saveSessionToken(access_token, signinResponse.refresh_token);
    const payload = decodeJwtPayload(access_token);
    const role = payload ? resolveRole(payload.email, undefined, payload.isAdmin) : 'USER';

    return {
      ok: true,
      redirectTo: pathByRole(role),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Login non riuscito',
    };
  }
}

export async function signupAction(input: SignupRequest): Promise<AuthActionResult> {
  const email = input.email.trim();
  const password = input.password;
  const firstName = input.firstName?.trim();
  const lastName = input.lastName?.trim();

  if (!email || !password) {
    return {
      ok: false,
      error: 'Compila email e password.',
    };
  }

  try {
    const { access_token, refresh_token } = await signup({
      email,
      password,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    });

    await saveSessionToken(access_token, refresh_token);
    const payload = decodeJwtPayload(access_token);
    const role = payload ? resolveRole(payload.email, undefined, payload.isAdmin) : 'USER';

    return {
      ok: true,
      redirectTo: pathByRole(role),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Registrazione non riuscita',
    };
  }
}

export async function signoutAction(): Promise<void> {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    try {
      await logoutFromBackend(refreshToken);
    } catch {
      // Best-effort: revoke on BE, ignore network errors
    }
  }
  await clearSessionToken();
  redirect('/login?mode=signin');
}

type SimpleActionResult = {
  readonly ok: boolean;
  readonly message?: string;
  readonly error?: string;
};

export async function forgotPasswordAction(email: string): Promise<SimpleActionResult> {
  if (!email) return { ok: false, error: 'Inserisci la tua email.' };
  try {
    await forgotPassword(email.trim().toLowerCase());
    return { ok: true };
  } catch {
    // Always return ok to prevent email enumeration
    return { ok: true };
  }
}

export async function resetPasswordAction(
  token: string,
  password: string
): Promise<SimpleActionResult> {
  if (!token || !password) return { ok: false, error: 'Dati mancanti.' };
  try {
    await resetPassword(token, password);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Reset non riuscito.',
    };
  }
}
