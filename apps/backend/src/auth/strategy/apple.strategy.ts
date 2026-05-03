import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import AppleStrategy from 'passport-apple';
import type { OAuthUser } from '../types/oauth-user.type';

type AppleCallbackBody = {
  readonly user?: string;
};

type AppleIdTokenPayload = {
  readonly sub?: string;
  readonly email?: string;
};

function parseJwtPayload(idToken: string): AppleIdTokenPayload {
  const tokenParts = idToken.split('.');
  if (tokenParts.length < 2) return {};

  try {
    const base64 = tokenParts[1].replaceAll('-', '+').replaceAll('_', '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json) as AppleIdTokenPayload;
  } catch {
    return {};
  }
}

@Injectable()
export class AppleOAuthStrategy extends PassportStrategy(AppleStrategy, 'apple') {
  constructor(config: ConfigService) {
    const clientID = config.get<string>('APPLE_CLIENT_ID') || 'APPLE_CLIENT_ID_NOT_SET';
    const teamID = config.get<string>('APPLE_TEAM_ID') || 'APPLE_TEAM_ID_NOT_SET';
    const keyID = config.get<string>('APPLE_KEY_ID') || 'APPLE_KEY_ID_NOT_SET';
    const privateKeyString = config.get<string>('APPLE_PRIVATE_KEY') || 'APPLE_PRIVATE_KEY_NOT_SET';
    const callbackURL =
      config.get<string>('APPLE_CALLBACK_URL') || 'http://localhost:3333/auth/apple/callback';

    super({
      clientID,
      teamID,
      keyID,
      privateKeyString,
      callbackURL,
      passReqToCallback: true,
      scope: ['name', 'email'],
    });
  }

  validate(
    req: Request<unknown, unknown, AppleCallbackBody>,
    accessToken: string,
    refreshToken: string,
    idToken: string
  ): OAuthUser {
    const idTokenPayload = parseJwtPayload(idToken);

    const rawUser = req.body?.user;
    let parsedUser:
      | {
          readonly name?: { readonly firstName?: string; readonly lastName?: string };
          readonly email?: string;
        }
      | undefined;

    if (typeof rawUser === 'string') {
      try {
        parsedUser = JSON.parse(rawUser) as {
          readonly name?: { readonly firstName?: string; readonly lastName?: string };
          readonly email?: string;
        };
      } catch {
        parsedUser = undefined;
      }
    }

    const email =
      parsedUser?.email?.toLowerCase().trim() ?? idTokenPayload.email?.toLowerCase().trim();

    if (!email) {
      throw new UnauthorizedException(
        'Apple non ha restituito la email. Controlla i permessi della tua app Apple.'
      );
    }

    return {
      email,
      firstName: parsedUser?.name?.firstName,
      lastName: parsedUser?.name?.lastName,
      provider: 'apple',
      providerId: idTokenPayload.sub ?? email,
    };
  }
}
