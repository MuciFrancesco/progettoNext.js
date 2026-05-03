declare module 'passport-apple' {
  import type { Strategy as PassportStrategyBase } from 'passport-strategy';

  type VerifyCallback = (error: unknown, user?: unknown, info?: unknown) => void;

  type AppleStrategyOptions = {
    readonly clientID: string;
    readonly teamID: string;
    readonly callbackURL: string;
    readonly keyID: string;
    readonly privateKeyLocation?: string;
    readonly privateKeyString?: string;
    readonly passReqToCallback?: boolean;
    readonly scope?: string[];
  };

  export default class AppleStrategy extends PassportStrategyBase {
    constructor(
      options: AppleStrategyOptions,
      verify: (
        req: unknown,
        accessToken: string,
        refreshToken: string,
        idToken: string,
        profile: unknown,
        done: VerifyCallback
      ) => void
    );

    constructor(
      options: AppleStrategyOptions,
      verify: (
        accessToken: string,
        refreshToken: string,
        idToken: string,
        profile: unknown,
        done: VerifyCallback
      ) => void
    );
  }
}
