/**
 * Centralized configuration and derived values for authentication forms.
 * This file contains shared logic that should not live in atomic components.
 */

/**
 * Backend base URL for API calls and OAuth redirects.
 */
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3333';

/**
 * Derived values for signin form.
 */
export interface SigninFormDerivedValues {
  backendBaseUrl: string;
  forgotPasswordHref: string;
  showWarning: boolean;
}

/**
 * Calculate derived values for the signin form based on form state.
 */
export function getSigninFormDerivedValues(
  email: string,
  remainingAttempts?: number
): SigninFormDerivedValues {
  return {
    backendBaseUrl: BACKEND_BASE_URL,
    forgotPasswordHref: email
      ? `/forgot-password?email=${encodeURIComponent(email)}`
      : '/forgot-password',
    showWarning: remainingAttempts !== undefined && remainingAttempts > 0 && remainingAttempts <= 2,
  };
}

/**
 * Derived values for signup form.
 */
export interface SignupFormDerivedValues {
  backendBaseUrl: string;
}

/**
 * Calculate derived values for the signup form.
 */
export function getSignupFormDerivedValues(): SignupFormDerivedValues {
  return {
    backendBaseUrl: BACKEND_BASE_URL,
  };
}
