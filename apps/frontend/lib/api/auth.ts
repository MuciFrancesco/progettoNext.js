import { backendRequest } from '@/lib/api/backend';
import type {
  AuthTokenResponse,
  BackendMeResponse,
  SigninRequest,
  SignupRequest,
} from '@/types/api/auth';

export async function signin(input: SigninRequest): Promise<AuthTokenResponse> {
  return backendRequest<AuthTokenResponse>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function signup(input: SignupRequest): Promise<AuthTokenResponse> {
  return backendRequest<AuthTokenResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getMe(token: string): Promise<BackendMeResponse> {
  return backendRequest<BackendMeResponse>('/users/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function refreshSession(
  rawRefreshToken: string
): Promise<{ access_token: string; refresh_token: string }> {
  return backendRequest<{ access_token: string; refresh_token: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: rawRefreshToken }),
  });
}

export async function logoutFromBackend(rawRefreshToken: string): Promise<void> {
  await backendRequest<void>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: rawRefreshToken }),
  });
}

export async function forgotPassword(email: string): Promise<void> {
  await backendRequest<void>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await backendRequest<void>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}
