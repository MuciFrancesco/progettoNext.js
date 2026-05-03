export class SigninResponseDto {
  access_token!: string;
  refresh_token?: string;
  remainingAttempts?: number; // undefined if successful, number if failed
  isBlocked?: boolean; // true if account is temporarily blocked
}
