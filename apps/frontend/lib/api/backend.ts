import { cookies, headers as nextHeaders } from 'next/headers';

const BACKEND_BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:3333';

const SAFE_ERROR_PATTERN = /^[\w\s.,!?:;'"()-]+$/;
const MAX_ERROR_LENGTH = 200;

export class BackendRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload: unknown
  ) {
    super(message);
    this.name = 'BackendRequestError';
  }
}

function sanitizeErrorMessage(raw: string, fallback: string): string {
  if (!raw || raw.length > MAX_ERROR_LENGTH || !SAFE_ERROR_PATTERN.test(raw)) {
    return fallback;
  }
  return raw;
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === 'string') return sanitizeErrorMessage(payload, fallback);
  if (!payload || typeof payload !== 'object') return fallback;

  const maybeMessage = (payload as { message?: unknown }).message;

  if (Array.isArray(maybeMessage) && maybeMessage.length > 0) {
    return sanitizeErrorMessage(String(maybeMessage[0]), fallback);
  }

  if (typeof maybeMessage === 'string') {
    return sanitizeErrorMessage(maybeMessage, fallback);
  }

  return fallback;
}

export async function backendRequest<T>(
  path: string,
  init?: RequestInit,
  errorFallback = 'Request failed'
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new BackendRequestError(getErrorMessage(payload, errorFallback), response.status, payload);
  }

  return payload as T;
}

export async function authenticatedBackendRequest<T>(
  path: string,
  init?: RequestInit,
  errorFallback = 'Request failed'
): Promise<T> {
  const cookieStore = await cookies();
  const headersList = await nextHeaders();
  const token = headersList.get('x-access-token') ?? cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error('Token unavailable');
  }

  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return backendRequest<T>(
    path,
    {
      ...init,
      headers,
    },
    errorFallback
  );
}

export async function authenticatedBackendUpload<T>(
  path: string,
  formData: FormData,
  errorFallback = 'Upload failed'
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error('Token unavailable');
  }

  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, errorFallback));
  }

  return payload as T;
}
