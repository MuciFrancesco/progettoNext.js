// ─── API Client Abstraction ───────────────────────────────────────────────────
// DIP: Components depend on this abstraction, not on fetch() directly
// SRP: Only handles HTTP communication — no business logic, no auth concerns

import { BACKEND_BASE_URL } from '@/utils/constants';
import { toSafeErrorMessage } from '@/utils/security';

// ─── Public Types ───────────────────────────────────────────────────────────

export type ApiFetchOptions = {
  readonly cache?: RequestCache;
  readonly revalidate?: number;
  readonly tags?: string[];
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload: unknown
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

// ─── Client Interface ───────────────────────────────────────────────────────

export interface ApiClient {
  get<T>(path: string, options?: ApiFetchOptions): Promise<T>;
  post<T>(path: string, body?: unknown, options?: ApiFetchOptions): Promise<T>;
  put<T>(path: string, body?: unknown, options?: ApiFetchOptions): Promise<T>;
  delete<T>(path: string, options?: ApiFetchOptions): Promise<T>;
  upload<T>(path: string, formData: FormData): Promise<T>;
  setAuthToken(token: string | null): void;
}

// ─── Implementation ─────────────────────────────────────────────────────────

export function createApiClient(baseUrl: string = BACKEND_BASE_URL): ApiClient {
  let authToken: string | null = null;

  function buildHeaders(init?: HeadersInit): Headers {
    const headers = new Headers(init);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }
    return headers;
  }

  function buildRequestInit(
    method: string,
    headers: Headers,
    body?: string,
    options?: ApiFetchOptions
  ): RequestInit {
    return {
      method,
      headers,
      body,
      cache: options?.cache ?? (options?.revalidate !== undefined ? undefined : 'no-store'),
      next: options?.revalidate !== undefined
        ? { revalidate: options.revalidate, tags: options?.tags }
        : options?.tags
          ? { tags: options.tags }
          : undefined,
    };
  }

  function getErrorMessage(payload: unknown, fallback: string): string {
    if (typeof payload === 'string') return toSafeErrorMessage(payload, fallback);
    if (!payload || typeof payload !== 'object') return fallback;

    const maybeMessage = (payload as { message?: unknown }).message;
    if (Array.isArray(maybeMessage) && maybeMessage.length > 0) {
      return toSafeErrorMessage(String(maybeMessage[0]), fallback);
    }
    if (typeof maybeMessage === 'string') {
      return toSafeErrorMessage(maybeMessage, fallback);
    }
    return fallback;
  }

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: ApiFetchOptions,
    isFormData = false
  ): Promise<T> {
    const headers = isFormData ? new Headers() : buildHeaders();
    if (authToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...buildRequestInit(method, headers, isFormData ? (body as FormData) as unknown as string : body ? JSON.stringify(body) : undefined, options),
      ...(isFormData ? { body: body as FormData } : {}),
    });

    const payload = (await response.json().catch(() => null)) as unknown;

    if (!response.ok) {
      throw new ApiRequestError(
        getErrorMessage(payload, `Request failed: ${response.status}`),
        response.status,
        payload
      );
    }

    return payload as T;
  }

  return {
    get<T>(path: string, options?: ApiFetchOptions): Promise<T> {
      return request<T>('GET', path, undefined, options);
    },

    post<T>(path: string, body?: unknown, options?: ApiFetchOptions): Promise<T> {
      return request<T>('POST', path, body, options);
    },

    put<T>(path: string, body?: unknown, options?: ApiFetchOptions): Promise<T> {
      return request<T>('PUT', path, body, options);
    },

    delete<T>(path: string, options?: ApiFetchOptions): Promise<T> {
      return request<T>('DELETE', path, undefined, options);
    },

    upload<T>(path: string, formData: FormData): Promise<T> {
      const headers = new Headers();
      if (authToken) headers.set('Authorization', `Bearer ${authToken}`);
      return request<T>('POST', path, formData, undefined, true);
    },

    setAuthToken(token: string | null) {
      authToken = token;
    },
  };
}

// ─── Singleton Export ───────────────────────────────────────────────────────

export const apiClient = createApiClient();
