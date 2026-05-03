import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import type { OAuthUser } from '../types/oauth-user.type';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(config: ConfigService) {
    const clientID = config.get<string>('FACEBOOK_APP_ID') || 'FACEBOOK_APP_ID_NOT_SET';
    const clientSecret = config.get<string>('FACEBOOK_APP_SECRET') || 'FACEBOOK_APP_SECRET_NOT_SET';
    const callbackURL =
      config.get<string>('FACEBOOK_CALLBACK_URL') || 'http://localhost:3333/auth/facebook/callback';

    super({
      clientID,
      clientSecret,
      callbackURL,
      profileFields: ['id', 'emails', 'name'],
      scope: ['email'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile): OAuthUser {
    const email = profile.emails?.[0]?.value?.toLowerCase().trim();
    if (!email) {
      throw new UnauthorizedException(
        "Facebook non ha restituito una email. Verifica i permessi email nell'app Facebook."
      );
    }

    return {
      email,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      provider: 'facebook',
      providerId: profile.id,
    };
  }
}
