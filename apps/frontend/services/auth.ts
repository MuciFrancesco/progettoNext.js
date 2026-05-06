// ─── Auth Service ────────────────────────────────────────────────────────────
// DIP: Auth operations go through this abstraction
// SRP: Handles authentication, session, and user profile API calls

import { apiClient, createApiClient, type ApiClient } from '@/services/api';
import type {
  AuthTokenResponse,
  BackendMeResponse,
  SigninRequest,
  SigninResponse,
  SignupRequest,
} from '@/types/api/auth';

// ─── Service Interface ──────────────────────────────────────────────────────

export interface AuthService {
  signin(input: SigninRequest): Promise<SigninResponse>;
  signup(input: SignupRequest): Promise<AuthTokenResponse>;
  getMe(token: string): Promise<BackendMeResponse>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  logout(refreshToken: string): Promise<void>;
}

// ─── Implementation ─────────────────────────────────────────────────────────

export function createAuthService(api: ApiClient): AuthService {
  return {
    async signin(input) {
      return api.post<SigninResponse>('/auth/signin', input);
    },

    async signup(input) {
      return api.post<AuthTokenResponse>('/auth/signup', input);
    },

    async getMe(token) {
      // Clone the API client with auth token for this specific request
      const authApi = createApiClient();
      authApi.setAuthToken(token);
      return authApi.get<BackendMeResponse>('/auth/me');
    },

    async forgotPassword(email) {
      await api.post('/auth/forgot-password', { email });
    },

    async resetPassword(token, password) {
      await api.post('/auth/reset-password', { token, password });
    },

    async logout(refreshToken) {
      await api.post('/auth/logout', { refresh_token: refreshToken });
    },
  };
}

// ─── Singleton ──────────────────────────────────────────────────────────────

export const authService = createAuthService(apiClient);
