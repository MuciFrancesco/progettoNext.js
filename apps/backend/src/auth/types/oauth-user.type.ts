export type OAuthProvider = 'google' | 'facebook' | 'apple';

export type OAuthUser = {
  readonly email: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly provider: OAuthProvider;
  readonly providerId: string;
};
