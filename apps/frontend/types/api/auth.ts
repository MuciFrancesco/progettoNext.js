import type { BackendUser, UserRole } from '@/types/api/user';

export interface SigninRequest {
  readonly email: string;
  readonly password: string;
}

export interface SignupRequest {
  readonly email: string;
  readonly password: string;
  readonly firstName?: string;
  readonly lastName?: string;
}

export interface AuthTokenResponse {
  readonly access_token: string;
  readonly refresh_token?: string;
}

export interface SigninResponse extends AuthTokenResponse {
  readonly remainingAttempts?: number;
  readonly isBlocked?: boolean;
}

export interface BackendMeResponse {
  readonly id: string;
  readonly email: string;
  readonly firstname: string | null;
  readonly secondname?: string | null;
  readonly lastname: string | null;
  readonly isAdmin?: boolean;
  readonly isEmployee?: boolean;
  readonly role?: UserRole;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface AuthSession {
  readonly token: string;
  readonly user: BackendUser & { readonly role: UserRole };
}
